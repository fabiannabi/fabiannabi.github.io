import axe from "axe-core";
import { expect } from "vitest";

/**
 * Runs axe-core against rendered output and fails with the rule, the impact and
 * the offending markup rather than a bare boolean.
 *
 * `color-contrast` is off here on purpose: jsdom does no layout and computes no
 * colours, so axe can only return "incomplete" for it. Contrast is verified for
 * real by scripts/audit-contrast.mjs, against the token files, in CI. Turning
 * the rule on here would produce a green check that proves nothing.
 */
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });

  const report = results.violations
    .map((violation) => {
      const nodes = violation.nodes.map((node) => `      ${node.html}`).join("\n");
      return `  [${violation.impact ?? "unknown"}] ${violation.id}: ${violation.help}\n${nodes}`;
    })
    .join("\n");

  expect(report, `axe found ${results.violations.length} violation(s):\n${report}`).toBe("");
}
