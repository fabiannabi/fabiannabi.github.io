import { expect, test } from "@playwright/test";

const outlineOf = (selector: string) => `
  (() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    return el ? getComputedStyle(el).outlineStyle : null;
  })()
`;

/**
 * The shortcut is bound by the provider on mount, so a key pressed before React
 * has run is simply lost. Waiting for the toggle to exist is waiting for the
 * listener to exist — without this the keyboard tests race the bundle and pass
 * or fail on machine speed.
 */
const ready = async (page: import("@playwright/test").Page): Promise<void> => {
  await expect(page.getByRole("button", { name: /x-ray/i }).first()).toBeVisible();
};

test.describe("X-ray blueprint", () => {
  test.use({ colorScheme: "dark" });

  test("costs nothing while it is off", async ({ page }) => {
    await page.goto("/design/");

    await expect(page.locator("html")).not.toHaveAttribute("data-xray", /.*/);
    // The stamp is inert markup; no wrapper element, no outline, no extra box.
    expect(await page.evaluate(outlineOf("[data-ds-component='Button']"))).not.toBe("dashed");
  });

  test("outlines and labels every instrumented component", async ({ page }) => {
    await page.goto("/design/");
    await page.getByRole("button", { name: /x-ray/i }).first().click();

    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    expect(await page.evaluate(outlineOf("[data-ds-component='Button']"))).toBe("dashed");

    // The label is a pseudo-element, so it is read rather than queried.
    const label = await page.evaluate(() => {
      const el = document.querySelector("[data-ds-component='Button']");
      return el ? getComputedStyle(el, "::before").content : null;
    });
    expect(label).toContain("Button");
    expect(label).toContain("variant=");
  });

  test("prints the padding it actually measured", async ({ page }) => {
    await page.goto("/design/");
    await page.getByRole("button", { name: /x-ray/i }).first().click();

    const box = await page.getAttribute("[data-ds-component='Button']", "data-ds-box");

    // Measured from the used value, not declared in the component — the number
    // has to survive size variants and media queries.
    expect(box).toMatch(/\d+px/);
  });

  test("toggles with the X key", async ({ page }) => {
    await page.goto("/design/");
    await ready(page);

    await page.keyboard.press("x");
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    await page.keyboard.press("x");
    await expect(page.locator("html")).not.toHaveAttribute("data-xray", /.*/);
  });

  // Pinned to no-preference: there is deliberately no leaving state when the
  // visitor asked for reduced motion, and that case is asserted in its own
  // describe below.
  test.describe("with motion allowed", () => {
    test.use({ contextOptions: { reducedMotion: "no-preference" } });

    test("animates out through a leaving state", async ({ page }) => {
      await page.goto("/design/");
      const toggle = page.getByRole("button", { name: /x-ray/i }).first();

      await toggle.click();
      await toggle.click();

      // Caught before the timer clears it. Vanishing on a frame reads as a bug.
      await expect(page.locator("html")).toHaveAttribute("data-xray", "leaving");
      await expect(page.locator("html")).not.toHaveAttribute("data-xray", /.*/, { timeout: 3000 });
    });
  });

  test("runs over the cover, using the cover's own palette", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /x-ray/i }).click();

    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");
    expect(await page.evaluate(outlineOf("[data-ds-component='RotatingHeadline']"))).toBe("dashed");

    // Polled: the outline animates in from transparent, so reading it once
    // catches whatever alpha the frame happened to be at.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const el = document.querySelector("[data-ds-component='ActionLink']");
          return el ? getComputedStyle(el).outlineColor : null;
        }),
      )
      // The cover's accent, not the design system's violet — the overlay falls
      // back to whichever palette the page defines.
      .toBe("rgb(255, 92, 168)");
  });

  test("keeps the focus ring visible over the blueprint", async ({ page }) => {
    await page.goto("/design/");
    await ready(page);
    await page.keyboard.press("x");
    // Asserted, not assumed: a focus ring is solid with or without the
    // blueprint, so this test proves nothing unless x-ray is actually on.
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    await page.getByRole("link", { name: "Overview" }).first().focus();
    const style = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? getComputedStyle(el).outlineStyle : null;
    });

    // A blueprint that hid the focus ring would break the exact criterion this
    // page exists to demonstrate.
    expect(style).toBe("solid");
  });
});

test.describe("X-ray with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" }, colorScheme: "dark" });

  const ready = async (page: import("@playwright/test").Page): Promise<void> => {
    await expect(page.getByRole("button", { name: /x-ray/i }).first()).toBeVisible();
  };

  test("appears without the staggered delay", async ({ page }) => {
    await page.goto("/design/");
    await ready(page);
    await page.keyboard.press("x");
    // Without this the assertion below is true whether or not x-ray ran.
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    const delay = await page.evaluate(() => {
      const el = document.querySelector("[data-ds-component='Button']");
      return el ? getComputedStyle(el).animationDelay : null;
    });

    expect(delay).toBe("0s");
  });

  test("leaves immediately instead of holding a leaving state", async ({ page }) => {
    await page.goto("/design/");
    await ready(page);

    await page.keyboard.press("x");
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    await page.keyboard.press("x");
    await expect(page.locator("html")).not.toHaveAttribute("data-xray", /.*/);
  });
});
