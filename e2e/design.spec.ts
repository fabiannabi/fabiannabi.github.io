import { expect, test } from "@playwright/test";

test.describe("Design system", () => {
  test.use({ colorScheme: "dark" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/design/");
  });

  test("documents every component in the registry", async ({ page }) => {
    for (const name of ["Button", "Chip", "Badge", "Tabs", "Alert", "Heading", "Text", "Code"]) {
      await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    }
  });

  test("renders props as a real table, one per component", async ({ page }) => {
    const table = page.getByRole("table", { name: /props for button/i });

    await expect(table).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "Prop" })).toBeVisible();
    await expect(table.getByRole("row").filter({ hasText: "variant" })).toBeVisible();
  });

  test("the examples are live components, not screenshots", async ({ page }) => {
    const chip = page.getByRole("button", { name: "Call", exact: true });

    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  test("tabs in the docs follow the keyboard pattern", async ({ page }) => {
    const overview = page.getByRole("tab", { name: "Overview" });

    await overview.focus();
    await page.keyboard.press("ArrowRight");

    await expect(page.getByRole("tab", { name: "Steps" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "Steps" })).toHaveAttribute("aria-selected", "true");
  });

  test("keeps its own theme, independent of the profile", async ({ page }) => {
    await page.getByRole("button", { name: /switch to light theme/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-ds-theme", "light");

    await page.goto("/profile/");
    // Different attribute, different storage key — /design/ in light does not
    // drag the profile with it.
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("does not scroll sideways at 380px", async ({ page }) => {
    await page.setViewportSize({ width: 380, height: 900 });
    await page.goto("/design/");

    const fits = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    );
    expect(fits).toBe(true);
  });
});
