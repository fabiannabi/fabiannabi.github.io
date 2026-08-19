#!/usr/bin/env node
/**
 * Contrast audit — no dependencies.
 *
 * Parses the CSS custom properties out of the token files and checks every
 * foreground/background pair the pages actually use against WCAG 2.2. Run it
 * after touching any colour. Exits non-zero on failure so it can gate CI.
 *
 * The design system's semantic tokens are aliases (--ds-accent: var(--ds-violet-400)),
 * so values are resolved through the primitive layer before anything is measured.
 * An audit that only reads the semantic file would be checking the names.
 *
 * This runs instead of axe's color-contrast rule, not alongside it: jsdom does
 * no layout and computes no colours, so axe can only ever return "incomplete"
 * for contrast. This reads the real values.
 *
 *   node scripts/audit-contrast.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const AA_TEXT = 4.5; // 1.4.3 — body text
const AA_LARGE = 3.0; // 1.4.3 — >=24px, or >=18.66px bold
const AA_UI = 3.0; // 1.4.11 — UI components and focus indicators

const root = fileURLToPath(new URL("..", import.meta.url));
const load = (path) => readFileSync(`${root}${path}`, "utf8");

/* ------------------------------------------------------------------ colour -- */

const hex2rgb = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (fg, bg) => {
  const [a, b] = [luminance(fg), luminance(bg)];
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

/** Flatten a translucent layer onto an opaque backdrop. */
const flatten = (fg, bg, alpha) => fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));

/* ---------------------------------------------------------------- parsing -- */

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Pull `--token: value` pairs out of one CSS rule block. */
const tokensIn = (css, selector) => {
  const re = new RegExp(`${selector}\\s*\\{([^}]*)\\}`, "s");
  const block = stripComments(css).match(re)?.[1] ?? "";
  const out = {};
  for (const [, k, v] of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)) {
    out[k] = v.trim();
  }
  return out;
};

/**
 * Follow `var(--x)` aliases down to a literal. The design system deliberately
 * routes every component colour through two hops, so this has to walk them.
 */
const resolve = (value, table, seen = new Set()) => {
  if (!value) return undefined;
  /* The fallback form matters: the bridge writes var(--dimmer, var(--dim))
     because the cover has two inks and the profile has three. Reading only the
     bare form silently returned undefined and printed NaN as a failure. */
  const alias = value.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+?)\s*)?\)$/);
  if (!alias) return value;
  const [, next, fallback] = alias;
  if (seen.has(next)) throw new Error(`Circular token reference at ${next}`);
  seen.add(next);
  if (table[next] === undefined && fallback !== undefined) return resolve(fallback, table, seen);
  return resolve(table[next], table, seen);
};

/** A full-width digit once slipped into a hex value and silently broke a rule. */
const assertAscii = (css, file) => {
  const suspect = stripComments(css).match(/[^\x00-\x7F]/g);
  if (!suspect) return 0;
  console.error(`\n${file}: non-ASCII character(s) in a colour value: ${suspect.join(" ")}`);
  return 1;
};

/* ----------------------------------------------------------------- report -- */

let failures = 0;

const report = (name, value, need, advisory = false) => {
  const ok = value >= need;
  if (!ok && !advisory) failures++;
  const verdict = advisory ? (ok ? "pass" : "info") : ok ? "pass" : "FAIL";
  console.log(
    `  ${name.padEnd(30)}${value.toFixed(2).padStart(6)}  need ${need.toFixed(1)}  ${verdict}`,
  );
};

const check = (table, [name, fgTok, bgTok, need, advisory]) => {
  const fg = resolve(table[fgTok], table);
  const bg = resolve(table[bgTok], table);
  if (!fg || !bg) return;
  report(name, ratio(hex2rgb(fg), hex2rgb(bg)), need, advisory);
};

/* ================================================================ the site == */

/* Each entry mirrors a real rule in the stylesheet. If you add a colour
   combination to the CSS, add it here too — an unchecked pair is an unknown. */
const SITE_CHECKS = [
  ["h1 / stat numbers", "--ink", "--bg", AA_LARGE],
  ["rotating slot", "--accent", "--bg", AA_LARGE],
  ["body / sub / rail", "--dim", "--bg", AA_TEXT],
  ["dates, nav, colophon", "--dimmer", "--bg", AA_TEXT],
  ["headings, entry titles", "--ink", "--bg", AA_TEXT],
  ["accent text", "--accent", "--bg", AA_TEXT],
  ["focus ring", "--accent", "--bg", AA_UI],
  ["body on hover surface", "--dim", "--bg-2", AA_TEXT],
  ["entry title on hover", "--accent", "--bg-2", AA_TEXT],
  ["dates on hover surface", "--dimmer", "--bg-2", AA_TEXT],
];

const siteTargets = [
  { file: "src/styles/tokens.cover.css", label: "cover", themes: [[":root", "synthwave"]] },
  {
    file: "src/styles/tokens.profile.css",
    label: "profile",
    themes: [
      [":root", "dark"],
      ['\\[data-theme="light"\\]', "light"],
    ],
  },
];

for (const { file, label, themes } of siteTargets) {
  const css = load(file);
  failures += assertAscii(css, file);
  const base = tokensIn(css, ":root");

  for (const [selector, themeName] of themes) {
    const t = { ...base, ...tokensIn(css, selector) };
    console.log(`\n${label} · ${themeName}`);

    for (const entry of SITE_CHECKS) check(t, entry);

    // Solid button: the page paints --bg-coloured text on an --accent fill.
    report("primary button text", ratio(hex2rgb(t["--bg"]), hex2rgb(t["--accent"])), AA_TEXT);

    // Status pill: --accent text on a translucent --wash over --bg.
    const wash = t["--wash"]?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (wash) {
      const pill = flatten(
        [+wash[1], +wash[2], +wash[3]],
        hex2rgb(t["--bg"]),
        wash[4] === undefined ? 1 : +wash[4],
      );
      report("status pill", ratio(hex2rgb(t["--accent"]), pill), AA_TEXT);
    }

    // The stack rail dims non-hovered items. Opacity is a contrast change.
    const RAIL_DIM = 0.85;
    const dimmed = flatten(hex2rgb(t["--dim"]), hex2rgb(t["--bg"]), RAIL_DIM);
    report(`rail dimmed @${RAIL_DIM}`, ratio(dimmed, hex2rgb(t["--bg"])), AA_TEXT);
  }
}

/* ====================================================== the design system == */

/**
 * A note on 1.4.11, because the distinction below is the difference between an
 * honest audit and a green one.
 *
 * The 3:1 floor applies to a visual boundary that is *required to identify* a
 * component. The edge of a control that has no other affordance is one. A
 * separator between rows, or the hairline around an Alert whose meaning is
 * already carried by its icon and its text, is not — the success criterion says
 * so, and painting those at 3:1 would produce a UI of grey boxes shouting at
 * each other.
 *
 * So decorative edges are measured and printed, but marked `advisory` and do not
 * gate the build. What does gate: --ds-border-strong, which is what every
 * interactive control uses. And every status component is tested separately for
 * not relying on colour alone (1.4.1) — the icon and the label carry it.
 */
const ADVISORY = true;

const DS_CHECKS = [
  ["body text", "--ds-text", "--ds-surface", AA_TEXT],
  ["muted text", "--ds-text-muted", "--ds-surface", AA_TEXT],
  ["subtle text", "--ds-text-subtle", "--ds-surface", AA_TEXT],
  ["text on raised surface", "--ds-text", "--ds-surface-raised", AA_TEXT],
  ["muted on raised surface", "--ds-text-muted", "--ds-surface-raised", AA_TEXT],
  ["text on overlay", "--ds-text", "--ds-surface-overlay", AA_TEXT],

  ["separator (decorative)", "--ds-border", "--ds-surface", AA_UI, ADVISORY],
  ["control edge", "--ds-border-strong", "--ds-surface", AA_UI],

  ["accent text", "--ds-accent", "--ds-surface", AA_TEXT],
  ["accent on raised", "--ds-accent", "--ds-surface-raised", AA_TEXT],
  ["focus ring", "--ds-accent", "--ds-surface", AA_UI],
  ["accent on its own surface", "--ds-accent", "--ds-accent-surface", AA_TEXT],
  ["accent border (decorative)", "--ds-accent-border", "--ds-surface", AA_UI, ADVISORY],
  ["solid button label", "--ds-accent-contrast", "--ds-accent", AA_TEXT],

  ["info text", "--ds-info", "--ds-surface", AA_TEXT],
  ["info on its own surface", "--ds-info", "--ds-info-surface", AA_TEXT],
  ["info border (decorative)", "--ds-info-border", "--ds-info-surface", AA_UI, ADVISORY],

  ["success text", "--ds-success", "--ds-surface", AA_TEXT],
  ["success on its own surface", "--ds-success", "--ds-success-surface", AA_TEXT],
  ["success border (decorative)", "--ds-success-border", "--ds-success-surface", AA_UI, ADVISORY],

  ["warning text", "--ds-warning", "--ds-surface", AA_TEXT],
  ["warning on its own surface", "--ds-warning", "--ds-warning-surface", AA_TEXT],
  ["warning border (decorative)", "--ds-warning-border", "--ds-warning-surface", AA_UI, ADVISORY],

  ["danger text", "--ds-danger", "--ds-surface", AA_TEXT],
  ["danger on its own surface", "--ds-danger", "--ds-danger-surface", AA_TEXT],
  ["danger border (decorative)", "--ds-danger-border", "--ds-danger-surface", AA_UI, ADVISORY],
  ["destructive button label", "--ds-danger-contrast", "--ds-danger", AA_TEXT],
];

const primitivesCss = load("src/ds/tokens/primitives.css");
const semanticCss = load("src/ds/tokens/semantic.css");
failures += assertAscii(primitivesCss, "src/ds/tokens/primitives.css");
failures += assertAscii(semanticCss, "src/ds/tokens/semantic.css");

const primitives = tokensIn(primitivesCss, ":root");

for (const [selector, themeName] of [
  ['\\[data-ds-theme="dark"\\]', "dark"],
  ['\\[data-ds-theme="light"\\]', "light"],
]) {
  const t = { ...primitives, ...tokensIn(semanticCss, selector) };
  console.log(`\ndesign system · ${themeName}`);
  for (const entry of DS_CHECKS) check(t, entry);
}

/* ============================================== the site, through the DS == */

/**
 * The cover and the profile are built from the design system's components but
 * painted in their own palettes, which tokens.ds-bridge.css does by remapping
 * the semantic layer. That remap is a colour decision, so it is measured — the
 * same DS_CHECKS list, resolved through the bridge into whichever page palette
 * loaded underneath it.
 *
 * Without this the bridge would be the one layer in the stack nobody checked,
 * and it is the layer that decides what every component on two of the three
 * pages is painted with.
 */
const bridgeCss = load("src/styles/tokens.ds-bridge.css");
failures += assertAscii(bridgeCss, "src/styles/tokens.ds-bridge.css");
const bridge = tokensIn(bridgeCss, ":root");

/** rgba() over the page background, resolved to the literal it actually shows. */
const flattenWash = (table) => {
  const wash = resolve(table["--ds-accent-surface"], table);
  const parts = wash?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!parts) return table;
  const bg = hex2rgb(resolve(table["--bg"], table));
  const flat = flatten([+parts[1], +parts[2], +parts[3]], bg, parts[4] === undefined ? 1 : +parts[4]);
  return { ...table, "--ds-accent-surface": `#${flat.map((c) => c.toString(16).padStart(2, "0")).join("")}` };
};

for (const { file, label, themes } of siteTargets) {
  const css = load(file);
  const base = tokensIn(css, ":root");

  for (const [selector, themeName] of themes) {
    const t = flattenWash({ ...base, ...tokensIn(css, selector), ...bridge });
    console.log(`\n${label} · ${themeName} · through the design system`);
    for (const entry of DS_CHECKS) check(t, entry);
  }
}

/* ========================================================== the blueprint == */

/**
 * X-ray is a theme, not an overlay, so it is audited as one. Both check lists
 * run again against ds/tokens/blueprint.css, because the blueprint remaps both
 * palettes: the design system's semantics for /design/, and the site's six
 * tokens for the cover and the profile.
 *
 * This is the palette most likely to be waved through — it is a mode, it is
 * temporary, nobody reads a blueprint for long. None of which is an argument a
 * success criterion accepts.
 */
const blueprintCss = load("src/ds/tokens/blueprint.css");
failures += assertAscii(blueprintCss, "src/ds/tokens/blueprint.css");

{
  const t = { ...tokensIn(blueprintCss, ":root"), ...tokensIn(blueprintCss, "\\[data-xray\\]") };
  console.log("\nblueprint · x-ray");

  for (const entry of DS_CHECKS) check(t, entry);
  for (const entry of SITE_CHECKS) check(t, entry);

  /* The annotation prints in --xray-accent on --xray-paper, and the frames and
     registration marks are drawn in --xray-line. Those are rules in xray.css
     rather than semantic aliases, so nothing above reaches them. */
  check(t, ["component annotation", "--xray-accent", "--xray-paper", AA_TEXT]);
  check(t, ["component frame", "--xray-line", "--xray-paper", AA_UI]);
  check(t, ["dimension box (decorative)", "--xray-line-soft", "--xray-paper", AA_UI, ADVISORY]);
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"} — ${failures} failing pair(s)\n`);
process.exit(failures === 0 ? 0 : 1);
