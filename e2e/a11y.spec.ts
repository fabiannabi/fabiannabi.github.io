import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const AXE = createRequire(import.meta.url).resolve("axe-core");

/**
 * axe in a real browser, which is the half the unit tests cannot do.
 *
 * `src/test/axe.ts` runs the same engine under jsdom and has to switch
 * `color-contrast` off there, because jsdom does no layout and computes no
 * colours — the rule can only ever return "incomplete". Here it runs for real,
 * on both themes, at both widths, with the actual cascade applied.
 *
 * This caught something the unit tests structurally could not: the cover's
 * identity block, its status badge and its stack rail sat outside every
 * landmark, so there was nothing for a screen reader user to skip to.
 */

type Result = {
  violations: ReadonlyArray<{
    id: string;
    impact: string | null;
    help: string;
    nodes: ReadonlyArray<{ html: string }>;
  }>;
};

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const PAGES = [
  ["/", "cover"],
  ["/profile/", "profile"],
  ["/design/", "design system"],
] as const;

const WIDTHS = [1280, 380] as const;

for (const [path, label] of PAGES) {
  for (const scheme of ["dark", "light"] as const) {
    for (const width of WIDTHS) {
      test(`${label} has no axe violations · ${scheme} · ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(path);
        await page.addScriptTag({ path: AXE });

        const result: Result = await page.evaluate(
          async (tags) =>
            await (
              window as unknown as {
                axe: { run: (ctx: Document, opts: unknown) => Promise<Result> };
              }
            ).axe.run(document, { resultTypes: ["violations"], runOnly: { type: "tag", values: tags } }),
          TAGS,
        );

        const report = result.violations
          .map(
            (violation) =>
              `[${violation.impact ?? "unknown"}] ${violation.id}: ${violation.help}\n` +
              violation.nodes.map((node) => `    ${node.html}`).join("\n"),
          )
          .join("\n");

        expect(report, report).toBe("");
      });
    }
  }
}

test("every interactive target clears 24x24 CSS px", async ({ page }) => {
  await page.goto("/");

  // SC 2.5.8. Measured on real layout, because the whole failure mode is a
  // control that looks big enough and whose box is not — line-height instead of
  // padding is the usual way it happens, and a 2.1-era checker passes it.
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("a, button, [tabindex]:not([tabindex='-1'])")]
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width > 0 || rect.height > 0)
      .filter(({ rect }) => rect.width < 24 || rect.height < 24)
      .map(({ el, rect }) => `${el.tagName.toLowerCase()} "${el.textContent?.trim().slice(0, 40)}" ${Math.round(rect.width)}x${Math.round(rect.height)}`),
  );

  expect(small.join("\n"), small.join("\n")).toBe("");
});
