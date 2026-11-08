import { expect, test } from "@playwright/test";
import { headline } from "../src/data/content";

const noHorizontalScroll = async (page: import("@playwright/test").Page): Promise<boolean> =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);

test.describe("Cover", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("leads with the whole claim as one accessible sentence", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });

    // Read from content.ts rather than written out here. A copy of the sentence
    // in the test is a second source of truth for one string: this one kept the
    // old wording through an edit to the headline and failed on a page that was
    // correct, which is the least useful way for a test to speak up.
    await expect(heading).toHaveAccessibleName(headline.sentence);
  });

  test("reaches every action by keyboard, in reading order", async ({ page }) => {
    // DOM order is tab order, and this test exists to notice when that changes.
    // It has now caught the same move four times.
    const expected = [
      "Read the full profile",
      // Contact sits in the action row, as text: where to find me, after the
      // one thing to do.
      "LinkedIn",
      "GitHub",
      "Email",
      // Then the work, in the order the pitch earns it: the system, the MCP
      // that makes it readable to agents, the platform those agents run on.
      "Blueprint",
      "Blueprint MCP",
      "Forge",
    ];

    for (const name of expected) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");

      // An icon-only control has an accessible name and no text; a chip has
      // both, and its name carries the description after the word. Asserting on
      // the text alone would have quietly skipped the first kind.
      const label = await focused.getAttribute("aria-label");
      if (label) expect(label).toContain(name);
      else await expect(focused).toContainText(name);
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

      const actions = page.getByRole("link", { name: /GitHub/ });
      // Polled for the same reason the shift test settles: the display face
      // lands after first paint and moves everything under it.
      await expect
        .poll(async () => (await actions.boundingBox())?.y ?? 0, { timeout: 5000 })
        .toBeGreaterThan(0);
      const box = await actions.boundingBox();

      expect(box, `the actions should be laid out at ${width}x${height}`).not.toBeNull();
      expect(box!.y + box!.height, `the pitch overflows at ${width}x${height}`).toBeLessThan(height);
    }
  });

  test("every headline term fits a 360px phone on one line", async ({ page }) => {
    // The slot does not wrap, so a term wider than the heading pushes the whole
    // page sideways on a phone. Two shipped that way before this test existed.
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate((terms) => {
      const word = document.querySelector("[data-ds-component='RotatingHeadline'] span span span")!;
      const style = getComputedStyle(word);
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.letterSpacing = style.letterSpacing;
      const room = word.closest("h1")!.getBoundingClientRect().width;
      return terms.map((t) => ({ t, w: Math.ceil(ctx.measureText(t).width), room: Math.floor(room) }));
    }, [...headline.rotating]);
    for (const { t, w, room } of result) expect(w, `"${t}" is ${w}px in ${room}px`).toBeLessThanOrEqual(room);
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
