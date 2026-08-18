#!/usr/bin/env node
/**
 * Contrast audit — no dependencies.
 *
 * Parses the CSS custom properties out of the token files and checks every
 * foreground/background pair the pages actually use against WCAG 2.2. Run it
 * after touching any colour. Exits non-zero on failure so it can gate CI.
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
const tokenFile = (name) => `${root}src/styles/${name}`;

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

/** Pull `--token: value` pairs out of one CSS rule block. */
const tokensIn = (css, selector) => {
  const re = new RegExp(`${selector}\\s*\\{([^}]*)\\}`, "s");
  const block = css.match(re)?.[1] ?? "";
  const out = {};
  for (const [, k, v] of block.matchAll(/(--[\w-]+)\s*:\s*(#[^;]+|rgba?\([^)]*\))/g)) {
    out[k] = v.trim();
  }
  return out;
};

/* Each entry mirrors a real rule in the stylesheet. If you add a colour
   combination to the CSS, add it here too — an unchecked pair is an unknown. */
const CHECKS = [
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

const targets = [
  { file: "tokens.cover.css", label: "cover", themes: [[":root", "synthwave"]] },
  {
    file: "tokens.profile.css",
    label: "profile",
    themes: [
      [":root", "dark"],
      ['\\[data-theme="light"\\]', "light"],
    ],
  },
];

let failures = 0;

const report = (name, value, need) => {
  const ok = value >= need;
  if (!ok) failures++;
  console.log(
    `  ${name.padEnd(24)}${value.toFixed(2).padStart(6)}  need ${need.toFixed(1)}  ${ok ? "pass" : "FAIL"}`,
  );
};

for (const { file, label, themes } of targets) {
  const css = readFileSync(tokenFile(file), "utf8");

  /* A full-width digit once slipped into a hex value and silently broke a rule.
     parseInt would read it as NaN and the ratio would come back nonsense, so
     catch it here rather than reporting a garbage number. Comments are stripped
     first — prose is allowed an em dash. */
  const nonAscii = css.replace(/\/\*[\s\S]*?\*\//g, "").match(/[^\x00-\x7F]/g);
  if (nonAscii) {
    console.error(`\n${file}: non-ASCII character(s) in a colour value: ${nonAscii.join(" ")}`);
    failures++;
  }

  const base = tokensIn(css, ":root");

  for (const [selector, themeName] of themes) {
    const t = { ...base, ...tokensIn(css, selector) };
    console.log(`\n${label} · ${themeName}`);

    for (const [name, fgTok, bgTok, need] of CHECKS) {
      if (!t[fgTok] || !t[bgTok]) continue;
      report(name, ratio(hex2rgb(t[fgTok]), hex2rgb(t[bgTok])), need);
    }

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
    if (t["--dim"]) {
      const dimmed = flatten(hex2rgb(t["--dim"]), hex2rgb(t["--bg"]), RAIL_DIM);
      report(`rail dimmed @${RAIL_DIM}`, ratio(dimmed, hex2rgb(t["--bg"])), AA_TEXT);
    }
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"} — ${failures} failing pair(s)\n`);
process.exit(failures === 0 ? 0 : 1);
