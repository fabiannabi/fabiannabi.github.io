import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const AXE = createRequire(import.meta.url).resolve("axe-core");

/**
 * /forge/ is the static showcase of Forge, the author's agent platform, exported
 * from its private repo (`forge showcase`) into public/forge. It is a different
 * app, built on the same design system, so these tests check what this site
 * promises about it: it loads, it is read-only, and it names no private repo.
 */
test.describe("Forge showcase", () => {
  test("loads the dashboard from static files", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/forge/");
    await expect(page.getByRole("link", { name: "Architecture" })).toBeVisible();
    await expect(page.getByText("Demo", { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("shows the dev loop board", async ({ page }) => {
    await page.goto("/forge/#/tickets");
    await expect(page.getByRole("heading", { level: 1, name: "Tickets" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Tickets by status" })).toBeVisible();
  });

  test("names no private repo and no path on the author's machine", async ({ request }) => {
    const data = await (await request.get("/forge/data.js")).text();
    expect(data).not.toMatch(/forge-sandbox|[A-Z]:\\Users|\/Users\/|sk-ant-/);
  });

  test("is reached from the cover's Forge card", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Forge/ }).click();
    await expect(page).toHaveURL(/\/forge\/$/);
  });

  // The a11y suite covers /forge/ itself; these are the dashboard's other views,
  // which are hash routes of the same page.
  for (const route of ["#/architecture", "#/tickets", "#/blueprint", "#/evals", "#/cases", "#/o/dev-loop", "#/sessions"]) {
    for (const scheme of ["dark", "light"] as const) {
      test(`${route} has no axe violations · ${scheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(`/forge/${route}`);
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
