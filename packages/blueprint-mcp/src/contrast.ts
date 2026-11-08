import type { Manifest } from "./manifest.js";

/** WCAG 2.2 relative luminance of an sRGB hex colour. */
export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6);
  const channel = (i: number): number => {
    const v = Number.parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

export function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** A token name (--ds-text or ds-text) or a hex colour, resolved for a theme. */
export function resolveColour(m: Manifest, input: string, theme: string): { hex: string; via: string } {
  const raw = input.trim();
  if (HEX.test(raw)) return { hex: raw.toLowerCase(), via: "literal" };
  const name = raw.startsWith("--") ? raw : `--${raw.replace(/^-*/, "")}`;
  const token = m.tokens.find((t) => t.name === name);
  if (!token) throw new Error(`Unknown token or colour: ${input}`);
  if (token.layer === "semantic") {
    const v = token.themes?.[theme] ?? token.themes?.default;
    if (!v?.value) throw new Error(`${name} has no value in the ${theme} theme`);
    return { hex: v.value, via: v.primitive ?? name };
  }
  if (token.value && HEX.test(token.value)) return { hex: token.value, via: name };
  throw new Error(`${name} is not a colour token`);
}

export type ContrastReport = {
  theme: string;
  foreground: { input: string; hex: string; via: string };
  background: { input: string; hex: string; via: string };
  ratio: number;
  passes: { text: boolean; largeText: boolean; nonText: boolean; enhancedText: boolean };
  verdict: string;
};

/** Checks a pair against WCAG 2.2: 1.4.3 (text), 1.4.11 (UI components) and 1.4.6 (AAA). */
export function checkContrast(m: Manifest, fg: string, bg: string, theme = "dark"): ContrastReport {
  const f = resolveColour(m, fg, theme);
  const b = resolveColour(m, bg, theme);
  const r = ratio(f.hex, b.hex);
  const passes = { text: r >= 4.5, largeText: r >= 3, nonText: r >= 3, enhancedText: r >= 7 };
  const verdict = passes.text
    ? `${r}:1 passes AA for body text${passes.enhancedText ? " and AAA" : ""}.`
    : passes.largeText
      ? `${r}:1 only passes for large text (≥24px, or ≥18.66px bold) and UI edges — not body text.`
      : `${r}:1 fails WCAG 2.2 for text and for UI components.`;
  return { theme, foreground: { input: fg, ...f }, background: { input: bg, ...b }, ratio: r, passes, verdict };
}
