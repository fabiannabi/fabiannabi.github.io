import { expect, test } from "@playwright/test";

test.describe("Profile", () => {
  /* Chromium's default is a light OS preference, which the page correctly
     honours — so without pinning this, "switch to light theme" is not the
     button that exists. That the preference is respected at all is asserted
     separately below. */
  test.use({ colorScheme: "dark" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/profile/");
  });

  test("puts a working skip link first", async ({ page }) => {
    const skip = page.getByRole("link", { name: /skip to content/i });

    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    // Off-screen until focused — a skip link nobody can see is not one.
    await expect(skip).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#about$/);
  });

  test("remembers the theme across a reload", async ({ page }) => {
    await page.getByRole("button", { name: /switch to light theme/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.reload();

    // Set by the blocking script in the head, so there is no flash of dark.
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("actually repaints when the theme changes", async ({ page }) => {
    const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    const dark = await background();
    await page.getByRole("button", { name: /switch to light theme/i }).click();

    // Polled, not read once: body transitions its background, so the computed
    // value immediately after the click is still the old one mid-transition.
    await expect.poll(background).not.toBe(dark);
  });

  test("shows the section nav at desktop width and hides it below", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Sections" });

    await page.setViewportSize({ width: 1400, height: 900 });
    await expect(nav).toBeVisible();

    // The marker tracks scroll next to a sticky column that does not exist here.
    await page.setViewportSize({ width: 800, height: 900 });
    await expect(nav).toBeHidden();
  });

  test("moves the nav marker to the section in view", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });

    await expect(page.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "true");

    await page.getByRole("heading", { level: 2, name: "Selected work" }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "true");
  });

  test.describe("follows the OS preference until told otherwise", () => {
    test.use({ colorScheme: "light" });

    test("opens in light when the system asks for light", async ({ page }) => {
      await page.goto("/profile/");

      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    });

    test("a stored choice outranks the system preference", async ({ page }) => {
      await page.goto("/profile/");
      await page.getByRole("button", { name: /switch to dark theme/i }).click();
      await page.reload();

      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    });
  });

  test.describe("responsive", () => {
    for (const width of [380, 1600]) {
      test(`does not scroll sideways at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/profile/");

        const fits = await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
        );
        expect(fits).toBe(true);
      });
    }
  });
});
