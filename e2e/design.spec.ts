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
    // .first() is the sidebar's control: the page documents ThemeToggle further
    // down, so there is a second button with the same accessible name, and that
    // one drives its own local state rather than the page's theme.
    await page.getByRole("button", { name: /switch to light theme/i }).first().click();
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

  test("does not move the page when the simulation changes", async ({ page }) => {
    // Two separate bugs, both caught here. The verdict is one line at rest and
    // two once a deficiency is running, and the first version reserved a single
    // line for it; the box is sized by a hidden copy of every line it can hold
    // now. The larger one was Glow: a filtered ancestor becomes the containing
    // block for its fixed descendants, so the wash stopped being viewport-sized
    // and started being document-sized, and the page grew 330px the moment
    // anyone pressed a chip.

    /* The web fonts are blocked for this test, and that is the point rather
       than a shortcut. The page reflows as the display face lands, which flaked every attempt to establish a
       baseline — first `document.fonts.ready`, which resolves before the reflow
       finishes, then a settle loop, which reads the same fallback value twice
       inside 160ms and calls it stable. A font swap is not the page moving
       under the reader, so it is removed rather than waited out. */
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());

    for (const width of [1280, 380]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/design/");

      // Document-relative: focusing a chip below the fold scrolls the page, and
      // a scroll is not the page moving under the reader.
      const railTop = () =>
        page.evaluate(() =>
          Math.round(
            document.querySelector("main footer")!.getBoundingClientRect().top + window.scrollY,
          ),
        );
      // The document's own height, which is what a reader actually notices: the
      // bug that prompted this test showed up as a scrollbar appearing on the
      // first press, not as text reflowing.
      const docHeight = () => page.evaluate(() => document.documentElement.scrollHeight);

      for (const name of ["Protan", "Deutan", "Tritan", "Back to normal"]) {
        const before = await railTop();
        const beforeHeight = await docHeight();

        await page.getByRole("button", { name: new RegExp(`^${name}`) }).click();

        expect(await railTop(), `${name} moved the page at ${width}px`).toBe(before);
        expect(await docHeight(), `${name} grew the page at ${width}px`).toBe(beforeHeight);
      }
    }
  });

});
