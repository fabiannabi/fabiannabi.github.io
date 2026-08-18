import { expect, test } from "@playwright/test";

const noHorizontalScroll = async (page: import("@playwright/test").Page): Promise<boolean> =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);

test.describe("Cover", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("leads with the whole claim as one accessible sentence", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });

    await expect(heading).toHaveAccessibleName(
      "I build the design systems, component APIs, accessibility baselines, release pipelines and translation workflows other teams build on.",
    );
  });

  test("reaches every action by keyboard, in reading order", async ({ page }) => {
    // The x-ray toggle sits with the identity block, so it comes first — DOM
    // order is tab order, and this test exists to notice when that changes.
    const expected = ["X-ray", "Read the full profile", "Design system", "Email", "LinkedIn", "GitHub"];

    for (const name of expected) {
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toContainText(name);
    }
  });

  test("shows a focus ring on the focused control", async ({ page }) => {
    await page.keyboard.press("Tab");

    // Removing an outline without replacing it is the defect this guards.
    const outlineWidth = await page
      .locator(":focus")
      .evaluate((el) => getComputedStyle(el).outlineWidth);

    expect(parseFloat(outlineWidth)).toBeGreaterThan(0);
  });

  test("links through to the profile", async ({ page }) => {
    await page.getByRole("link", { name: /read the full profile/i }).click();

    await expect(page).toHaveURL(/\/profile\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fabián Alcalá");
  });

  // Pinned to no-preference so this still asserts motion under the
  // reduced-motion project, where the opposite is proved in its own spec.
  test.describe("with motion allowed", () => {
    test.use({ contextOptions: { reducedMotion: "no-preference" } });

    test("the stack rail is scrolling", async ({ page }) => {
      await page.goto("/");
      const track = page.locator("[aria-hidden='true'] > div").first();

      const first = await track.evaluate((el) => getComputedStyle(el).transform);
      await page.waitForTimeout(600);
      const second = await track.evaluate((el) => getComputedStyle(el).transform);

      expect(second).not.toBe(first);
    });
  });

  test.describe("responsive", () => {
    for (const width of [380, 1600]) {
      test(`does not scroll sideways at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/");

        expect(await noHorizontalScroll(page)).toBe(true);
      });
    }
  });
});
