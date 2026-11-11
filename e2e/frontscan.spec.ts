import { expect, test } from "@playwright/test";

/**
 * /frontscan/ announces the open-source CLI Forge's agents built. What it
 * promises: it is reached from the Forge case study, every real run names the
 * exact commit it scanned, and it points at the public repo.
 */
test.describe("frontscan page", () => {
  test("is reached from the Forge case study", async ({ page }) => {
    await page.goto("/forge/");
    await page.getByRole("link", { name: "What frontscan does →" }).click();
    await expect(page).toHaveURL(/\/frontscan\/$/);
    await expect(page.getByRole("heading", { level: 1, name: /frontscan/ })).toBeVisible();
  });

  test("pins every real run to the commit it scanned", async ({ page }) => {
    await page.goto("/frontscan/");
    const table = page.getByRole("table", { name: "frontscan on open-source repos" });
    await expect(table.getByRole("row")).toHaveCount(3); // header + Cal.com + Excalidraw
    for (const link of await table.getByRole("link").all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/[0-9a-f]{40}$/);
    }
  });

  test("links to the public repo and back to how it was built", async ({ page }) => {
    await page.goto("/frontscan/");
    await expect(page.getByRole("link", { name: "frontscan on GitHub →" })).toHaveAttribute(
      "href",
      "https://github.com/fabiannabi/frontscan",
    );
    await expect(page.getByRole("link", { name: "The Forge case study →" })).toHaveAttribute("href", "/forge/");
  });

  test("never pushes a phone sideways", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/frontscan/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
});
