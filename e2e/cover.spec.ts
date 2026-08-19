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
    // The blueprint switch sits with the identity block and the vision
    // simulator comes after the actions, where it reads as one more thing —
    // DOM order is tab order, and this test exists to notice when that changes.
    // It has now caught the same move twice.
    const expected = [
      "X-ray",
      "Read the full profile",
      "Design system",
      "Email",
      "LinkedIn",
      "GitHub",
      "Normal",
      "Protan",
      "Deutan",
      "Tritan",
    ];

    for (const name of expected) {
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toContainText(name);
    }
  });

  test("keeps the whole pitch above the fold", async ({ page }) => {
    // "One screen" is the cover's job, and it was prose in CLAUDE.md that
    // nothing checked — the pitch measured 871px and overflowed a laptop. What
    // has to be above the fold is the pitch: the headline, the paragraph, the
    // figures and the actions. The vision simulator sits below it on purpose,
    // as a reward for scrolling rather than a tax on arriving.
    // 1280x900 only, and the boundary is stated rather than hidden: the pitch
    // measures 770px, so it clears this viewport by 130px and a 1440x780 laptop
    // by 10. On a 1366x700 it does not clear at all — closing that would mean
    // shrinking an 88px headline, which is a design decision and not a test's
    // to make. Asserting the tight case would buy a flake, not a guarantee.
    for (const [width, height] of [[1280, 900]] as const) {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);

      const actions = page.getByRole("link", { name: /GitHub/ });
      const box = await actions.boundingBox();

      expect(box, `the actions should be laid out at ${width}x${height}`).not.toBeNull();
      expect(box!.y + box!.height, `the pitch overflows at ${width}x${height}`).toBeLessThan(height);
    }
  });

  test("does not move the page when the simulation changes", async ({ page }) => {
    // Two separate bugs, both caught here. The verdict is one line at rest and
    // two once a deficiency is running, and the first version reserved a single
    // line for it; the box is sized by a hidden copy of every line it can hold
    // now. The larger one was Glow: a filtered ancestor becomes the containing
    // block for its fixed descendants, so the wash stopped being viewport-sized
    // and started being document-sized, and the page grew 330px the moment
    // anyone pressed a chip.
    for (const width of [1280, 380]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      // Measured after the web fonts land. Reading immediately after goto
      // catches the swap from the fallback face, and a font reflow is not the
      // page moving under the reader — it is what cost an afternoon here.
      await page.evaluate(() => document.fonts.ready);

      // Document-relative: focusing a chip below the fold scrolls the page, and
      // a scroll is not the page moving under the reader.
      const railTop = () =>
        page.evaluate(
          () =>
            Math.round(
              document.querySelector("footer")!.getBoundingClientRect().top + window.scrollY,
            ),
        );

      // The document's own height, which is what a reader actually notices: the
      // bug that prompted this test showed up as a scrollbar appearing on the
      // first press, not as text reflowing.
      const docHeight = () => page.evaluate(() => document.documentElement.scrollHeight);

      const before = await railTop();
      const beforeHeight = await docHeight();

      for (const name of ["Protan", "Deutan", "Tritan", "Normal"]) {
        await page.getByRole("button", { name: new RegExp(`^${name}`) }).click();
        expect(await railTop(), `${name} moved the page at ${width}px`).toBe(before);
        expect(await docHeight(), `${name} grew the page at ${width}px`).toBe(beforeHeight);
      }
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
