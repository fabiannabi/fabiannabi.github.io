import { expect, test } from "@playwright/test";

/** ds/tokens/blueprint.css --xray-paper. */
const PAPER = "rgb(11, 37, 69)";
/** --xray-line, the drafting line every frame is drawn in. */
const LINE = "rgb(143, 184, 222)";
/** --xray-accent, the ink a design system component is named in. */
const ACCENT = "rgb(143, 224, 255)";
/** --xray-ink-muted, the ink an app component is named in. */
const MUTED = "rgb(168, 200, 232)";

type Page = import("@playwright/test").Page;

/** One computed style, optionally from a pseudo-element. */
const styleOf = (
  page: Page,
  selector: string,
  property: string,
  pseudo: string | null = null,
): Promise<string | null> =>
  page.evaluate(
    (args) => {
      const el = document.querySelector(args.selector);
      if (!el) return null;
      const styles = getComputedStyle(el, args.pseudo) as unknown as Record<string, string>;
      return styles[args.property] ?? null;
    },
    { selector, property, pseudo },
  );

/**
 * The shortcut is bound by the provider on mount, so a key pressed before React
 * has run is simply lost. Waiting for the toggle to exist is waiting for the
 * listener to exist — without this the keyboard tests race the bundle and pass
 * or fail on machine speed.
 */
const ready = async (page: Page): Promise<void> => {
  await expect(page.getByRole("button", { name: /x-ray/i }).first()).toBeVisible();
};

test.describe("X-ray blueprint", () => {
  test.use({ colorScheme: "dark" });

  test("costs nothing while it is off", async ({ page }) => {
    await page.goto("/design/");

    await expect(page.locator("html")).not.toHaveAttribute("data-xray", /.*/);
    // The stamp is inert markup: no wrapper element, no frame, no ruling.
    expect(await styleOf(page, "[data-ds-component='Button']", "outlineStyle")).toBe("none");
    expect(await styleOf(page, "body", "backgroundImage")).toBe("none");
  });

  test("repaints the page as blueprint paper", async ({ page }) => {
    await page.goto("/design/");
    await page.getByRole("button", { name: /x-ray/i }).first().click();

    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    // The field arrives through the token remap — blueprint.css is a theme, so
    // the page repaints without xray.css owning a single colour rule. Polled
    // because the body transitions its background rather than swapping it.
    await expect.poll(() => styleOf(page, "body", "backgroundColor")).toBe(PAPER);

    // Four layers: the major ruling and the minor ruling, each way.
    const ruling = await styleOf(page, "body", "backgroundImage");
    expect(ruling?.match(/linear-gradient/g)).toHaveLength(4);
  });

  test("draws every instrumented component as a frame, not an inspector box", async ({ page }) => {
    await page.goto("/design/");
    await page.getByRole("button", { name: /x-ray/i }).first().click();
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    const selector = "[data-ds-component='Button']";

    // Solid line for the border box, dashed for the content box: the two boxes
    // are told apart by line style, not only by position.
    await expect.poll(() => styleOf(page, selector, "outlineStyle")).toBe("solid");
    expect(await styleOf(page, selector, "outlineStyle", "::after")).toBe("dashed");

    // Eight registration marks, one pair per corner.
    const marks = await styleOf(page, selector, "backgroundImage");
    expect(marks?.match(/linear-gradient/g)).toHaveLength(8);

    // No fill and no ink: the box is what is left, which is the point.
    expect(await styleOf(page, selector, "backgroundColor")).toBe("rgba(0, 0, 0, 0)");
    expect(await styleOf(page, selector, "color")).toBe("rgba(0, 0, 0, 0)");
  });

  test("blanks the content but leaves it in the accessibility tree", async ({ page }) => {
    await page.goto("/design/");
    await page.getByRole("button", { name: /x-ray/i }).first().click();
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    // Transparent, not hidden. `visibility: hidden` would have deleted the page
    // for a screen reader in a mode built to explain the page's structure, so
    // the accessible name has to survive the wireframe intact.
    await expect(page.getByRole("button", { name: "Save changes" }).first()).toBeVisible();
  });

  test("names each box in place of the content it replaced", async ({ page }) => {
    await page.goto("/design/");
    await page.getByRole("button", { name: /x-ray/i }).first().click();
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    const selector = "[data-ds-component='Button']";

    // The name plate is a pseudo-element, so it is read rather than queried.
    expect(await styleOf(page, selector, "content", "::before")).toContain("Button");

    // The name and nothing else, hovered or not. Props on the drawing are the
    // badge this mode was rebuilt to stop being; they stay on the element for
    // anyone who wants to read them off it.
    expect(await styleOf(page, selector, "content", "::before")).not.toContain("variant=");
    await page.locator(selector).first().hover();
    expect(await styleOf(page, selector, "content", "::before")).not.toContain("variant=");
    expect(await page.getAttribute(selector, "data-ds-props")).toContain("variant=");
  });

  /**
   * The claim the site makes, and the one an audit actually has to check.
   *
   * The earlier version of this test counted `[data-ds-local]` and demanded
   * zero, which passed by moving every one-off *into* the system — a page
   * component named Entry whose props are `when`, `org` and `badge` is the app's
   * data model wearing the system's badge. The rule that survives is the other
   * way round: app components are expected, and every one of them has to be
   * built from the system rather than from raw markup.
   */
  const PAGES: ReadonlyArray<readonly [string, string]> = [
    ["/", "cover"],
    ["/profile/", "profile"],
  ];

  for (const [path, label] of PAGES) {
    test(`every ${label} component is built from the system`, async ({ page }) => {
      await page.goto(path);

      const appComponents = page.locator("[data-ds-local]");
      const count = await appComponents.count();
      // The precondition: this page has app components at all, or the loop below
      // asserts nothing and passes for the wrong reason.
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const component = appComponents.nth(i);
        const name = await component.getAttribute("data-ds-component");
        const fromSystem = component.locator("[data-ds-component]:not([data-ds-local])");
        expect(await fromSystem.count(), `${name} should be composed from the system`).toBeGreaterThan(
          0,
        );
      }
    });
  }

  test("tells a system component apart from an app one", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /x-ray/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    // From Blueprint: registration marks at the corners, named in the accent.
    const fromSystem = "[data-ds-component='Display']";
    expect(
      (await styleOf(page, fromSystem, "backgroundImage"))?.match(/linear-gradient/g),
    ).toHaveLength(8);
    expect(await styleOf(page, fromSystem, "color", "::before")).toBe(ACCENT);

    // The app's own. Same frame, no marks, muted name — the marks are the claim
    // that the system owns the box, and RotatingHeadline is one page's conceit.
    const appOwn = "[data-ds-component='RotatingHeadline']";
    await expect(page.locator(appOwn)).toHaveAttribute("data-ds-local", "");
    expect(await styleOf(page, appOwn, "backgroundImage")).toBe("none");
    expect(await styleOf(page, appOwn, "outlineStyle")).toBe("solid");
    expect(await styleOf(page, appOwn, "color", "::before")).toBe(MUTED);
  });

  test("does not draw an inline component", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /x-ray/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    // The emphasis inside the cover's opening paragraph. It is typography, not
    // structure, and it fragments across line boxes, so there is no rectangle
    // to draw — every attempt to draw one looked like a rendering fault.
    const inline = "[data-ds-component='Text'] [data-ds-component='Text']";
    await expect(page.locator(inline).first()).toHaveAttribute("data-ds-flow", "inline");

    expect(await styleOf(page, inline, "outlineStyle")).toBe("none");
    expect(await styleOf(page, inline, "boxShadow")).toBe("none");
    expect(await styleOf(page, inline, "display", "::before")).toBe("none");

    // The paragraph around it is still a box, and still named.
    expect(
      await styleOf(page, "[data-ds-component='Text']", "content", "::before"),
    ).toContain("Text");
  });

  test("does not let a component's own typography reach its name plate", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /x-ray/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    // A pseudo-element inherits from the element it hangs off, so a Label with
    // caps printed its own annotation as "LABEL". The plate resets it.
    expect(
      await styleOf(page, "[data-ds-component='Label']", "textTransform", "::before"),
    ).toBe("none");
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

    test("develops with one pass over the page", async ({ page }) => {
      await page.goto("/design/");
      await ready(page);
      await page.keyboard.press("x");
      // Without this the assertion below is true whether or not x-ray ran.
      await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

      expect(await styleOf(page, "body", "animationName", "::before")).toBe("xray-develop");
    });
  });

  test("collapses the cover to the same monochrome", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /x-ray/i }).click();

    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    // The cover's synthwave palette is gone, not tinted: x-ray is a remap of the
    // semantic layer, and the page has no say in it.
    await expect.poll(() => styleOf(page, "body", "backgroundColor")).toBe(PAPER);

    // Polled: the frame is drawn in from transparent, so reading it once catches
    // whatever alpha the frame happened to be at.
    await expect
      .poll(() => styleOf(page, "[data-ds-component='Button']", "outlineColor"))
      .toBe(LINE);

    // Glow reads --wash, which the blueprint sets to transparent. A drawing has
    // no atmosphere, and Glow was never told the mode exists.
    const wash = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--wash").trim(),
    );
    expect(wash).toBe("transparent");
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

  test("appears without the staggered delay", async ({ page }) => {
    await page.goto("/design/");
    await ready(page);
    await page.keyboard.press("x");
    // Without this the assertion below is true whether or not x-ray ran.
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    const delay = await styleOf(page, "[data-ds-component='Button']", "animationDelay");

    expect(delay).toBe("0s");
  });

  test("does not run the developing pass at all", async ({ page }) => {
    await page.goto("/design/");
    await ready(page);
    await page.keyboard.press("x");
    await expect(page.locator("html")).toHaveAttribute("data-xray", "on");

    // Collapsing the duration is not enough: a sweep crossing the viewport in
    // 0.01ms is a flash, which is the one kind of motion that is a safety
    // problem rather than a taste one. It is removed, not accelerated.
    expect(await styleOf(page, "body", "display", "::before")).toBe("none");

    // The paper itself still arrives — the mode works, it just does not move.
    await expect.poll(() => styleOf(page, "body", "backgroundColor")).toBe(PAPER);
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
