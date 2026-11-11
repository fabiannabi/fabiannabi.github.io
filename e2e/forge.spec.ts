import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const AXE = createRequire(import.meta.url).resolve("axe-core");

/**
 * /forge/ is the case study of Forge, the author's private agent platform, and
 * /forge/showcase/ is its dashboard exported from the private repo (`forge
 * showcase`) into public/forge/showcase. The showcase is a different app on the
 * same design system, so these tests check what this site promises about both:
 * they load, the case study's figures link to the public repo they describe, the
 * showcase is read-only, and nothing names a private repo or the author's machine.
 */
test.describe("Forge case study", () => {
  test("is reached from the cover's Forge card", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Forge/ }).click();
    await expect(page).toHaveURL(/\/forge\/$/);
    await expect(page.getByRole("heading", { level: 1, name: /Forge/ })).toBeVisible();
  });

  test("links every ticket to its public issue and pull request", async ({ page }) => {
    await page.goto("/forge/");
    const table = page.getByRole("table", { name: "Every frontscan ticket Forge built" });
    await expect(table.getByRole("row")).toHaveCount(19); // header + 18 tickets
    const issue = table.getByRole("link", { name: /^#1 / });
    await expect(issue).toHaveAttribute("href", "https://github.com/fabiannabi/frontscan/issues/1");
    await expect(table.getByRole("link", { name: "#2", exact: true })).toHaveAttribute(
      "href",
      "https://github.com/fabiannabi/frontscan/pull/2",
    );
  });

  test("plays the silent walkthrough on its own, except under reduced motion", async ({ page }) => {
    const reduce = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
    await page.goto("/forge/");
    const video = page.locator("video");
    await expect(video).toHaveAttribute("controls", ""); // always pausable
    if (reduce) {
      await page.waitForTimeout(1000);
      expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    } else {
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.muted)).toBe(true);
    }
  });

  test("fits the ticket table without a sideways scroll on a desktop", async ({ page }) => {
    // A long ticket title once made it 82px wider than its column.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/forge/");
    const table = page.getByRole("table", { name: "Every frontscan ticket Forge built" });
    const [scroll, client] = await table.evaluate((t) => {
      const box = t.parentElement as HTMLElement;
      return [box.scrollWidth, box.clientWidth];
    });
    expect(scroll).toBeLessThanOrEqual(client);
  });

  test("leads to the live dashboard", async ({ page }) => {
    await page.goto("/forge/");
    await page.getByRole("link", { name: "Live dashboard →" }).click();
    await expect(page).toHaveURL(/\/forge\/showcase\/$/);
  });
});

test.describe("Forge showcase", () => {
  test("loads the dashboard from static files", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/forge/showcase/");
    await expect(page.getByRole("link", { name: "How it works" })).toBeVisible();
    // The header badge is hidden on phones; the footer says it at every width.
    await expect(page.getByText(/^Snapshot: dev loop runs are real/)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("shows the real runs of the public repo", async ({ page }) => {
    await page.goto("/forge/showcase/#/runs");
    await expect(page.getByRole("heading", { level: 1, name: "Runs" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "fabiannabi/frontscan" })).toBeVisible();
  });

  test("names no private repo and no path on the author's machine", async ({ request }) => {
    const data = await (await request.get("/forge/showcase/data.js")).text();
    expect(data).not.toMatch(/forge-sandbox|[A-Z]:[\\/]{1,2}Users|\/Users\/|\/home\/|sk-ant-/);
  });

  // The a11y suite covers /forge/showcase/ itself; these are the dashboard's other
  // views, which are hash routes of the same page.
  for (const route of ["#/runs", "#/lessons", "#/architecture", "#/evals", "#/cases", "#/o/dev-loop"]) {
    for (const scheme of ["dark", "light"] as const) {
      test(`${route} has no axe violations · ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(`/forge/showcase/${route}`);
        await page.waitForSelector("main h1");
        await page.addScriptTag({ path: AXE });
        const violations = await page.evaluate(async () => {
          // @ts-expect-error axe is injected above
          const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
          return r.violations.map((v: { id: string; nodes: { html: string }[] }) => `${v.id}: ${v.nodes.length} · ${v.nodes[0]?.html.slice(0, 120)}`);
        });
        expect(violations.join("\n"), violations.join("\n")).toBe("");
      });
    }
  }
});
