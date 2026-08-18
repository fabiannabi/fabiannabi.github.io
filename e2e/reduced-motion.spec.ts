import { expect, test } from "@playwright/test";

/**
 * CSS handles the declarative half of prefers-reduced-motion, but nothing in a
 * stylesheet stops a requestAnimationFrame loop. These run in a real browser
 * with the preference actually set, which is the only way to prove the JS half.
 */
test.use({ contextOptions: { reducedMotion: "reduce" } });

test.describe("with reduced motion requested", () => {
  test("the stack rail does not move", async ({ page }) => {
    await page.goto("/");
    const track = page.locator("[aria-hidden='true'] > div").first();

    const first = await track.evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(800);
    const second = await track.evaluate((el) => getComputedStyle(el).transform);

    expect(second).toBe(first);
  });

  test("the headline does not rotate", async ({ page }) => {
    await page.goto("/");
    const slot = page.locator("h1 [aria-hidden='true']");

    const first = await slot.textContent();
    await page.waitForTimeout(4000);

    expect(await slot.textContent()).toBe(first);
  });

  test("the page is still fully usable", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /read the full profile/i }).click();
    await expect(page).toHaveURL(/\/profile\/$/);
  });
});
