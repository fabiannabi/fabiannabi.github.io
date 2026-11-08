import type { ComponentEntry, Manifest, TokenEntry } from "./manifest.js";

export type Finding = {
  rule:
    | "raw-colour"
    | "primitive-token"
    | "unknown-token"
    | "bare-spacing"
    | "unknown-prop"
    | "invalid-prop-value"
    | "icon-only-label";
  severity: "error" | "warning";
  line: number;
  message: string;
  suggestion?: string;
};

export type LintReport = {
  findings: Finding[];
  errors: number;
  warnings: number;
  componentsUsed: string[];
  tokensUsed: string[];
  /** Findings left out of the list once it reached MAX_FINDINGS; the counts above still include them. */
  omitted?: number;
};

/** The list stops here so a pathological file cannot flood an agent's context; counts stay exact. */
export const MAX_FINDINGS = 200;

const lineOf = (code: string, index: number): number => code.slice(0, index).split("\n").length;

/* Comments can talk about #fff without using it. Blank them out but keep the
   offsets, so line numbers still point at the real source. */
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));
}

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h.length === 6 ? h : null;
  if (!full) return null;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function nearestSemantic(m: Manifest, hex: string): TokenEntry | undefined {
  const rgb = hexToRgb(hex);
  if (!rgb) return undefined;
  let best: { t: TokenEntry; d: number } | undefined;
  for (const t of m.tokens) {
    if (t.layer !== "semantic") continue;
    for (const v of Object.values(t.themes ?? {})) {
      const other = v.value ? hexToRgb(v.value) : null;
      if (!other) continue;
      const d = Math.hypot(rgb[0] - other[0], rgb[1] - other[1], rgb[2] - other[2]);
      if (!best || d < best.d) best = { t, d };
    }
  }
  return best?.t;
}

function nearestSpace(m: Manifest, px: number): TokenEntry | undefined {
  const spaces = m.tokens.filter((t) => t.group === "space" && /px$/.test(t.value ?? ""));
  return spaces.sort((a, b) => Math.abs(Number.parseFloat(a.value ?? "0") - px) - Math.abs(Number.parseFloat(b.value ?? "0") - px))[0];
}

/* Attributes every element accepts; a component prop list only documents its own API. */
const UNIVERSAL = new Set([
  "children", "className", "style", "id", "key", "ref", "title", "role", "tabIndex", "type", "name", "value",
  "href", "target", "rel", "disabled", "form", "htmlFor", "lang", "dir", "hidden", "autoFocus", "placeholder",
]);

/** Longest opening tag the scanner reads; real ones are a few hundred characters. */
const MAX_TAG = 4_000;

type Tag = { name: string; index: number; attrs: { name: string; value: string | null }[] };

/** A small JSX tag scanner: enough to read <Button variant="ghost" iconOnly aria-label={x}> without a parser. */
function jsxTags(code: string, names: Set<string>): Tag[] {
  const tags: Tag[] = [];
  // Dotted names are compound parts (<Tabs.List>, <Tabs.Tab>): their props are not the root's.
  const open = /<([A-Z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)*)\b/g;
  for (const m of code.matchAll(open)) {
    const name = m[1] ?? "";
    if (!names.has(name)) continue;
    let i = (m.index ?? 0) + m[0].length;
    let depth = 0;
    let quote: string | null = null;
    const start = i;
    // A tag longer than MAX_TAG is malformed. The cap keeps the scan linear: without it,
    // thousands of unclosed "<Button {" would each be read to the end of the input.
    const stop = Math.min(code.length, start + MAX_TAG);
    let closed = false;
    for (; i < stop; i++) {
      const c = code[i];
      if (quote) { if (c === quote) quote = null; continue; }
      if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
      if (c === "{") depth++;
      else if (c === "}") depth = Math.max(0, depth - 1);
      else if (c === ">" && depth === 0) { closed = true; break; }
      else if (c === "<" && depth === 0) break; // a new tag starts: this one was never closed
    }
    if (!closed) continue;
    const body = code.slice(start, i).replace(/\/$/, "");
    tags.push({ name, index: m.index ?? 0, attrs: attributes(body) });
  }
  return tags;
}

function attributes(body: string): { name: string; value: string | null }[] {
  const out: { name: string; value: string | null }[] = [];
  let i = 0;
  while (i < body.length) {
    while (i < body.length && /\s/.test(body[i] ?? "")) i++;
    if (body[i] === "{") { // spread: {...props}
      let depth = 0;
      for (; i < body.length; i++) { if (body[i] === "{") depth++; else if (body[i] === "}" && --depth === 0) { i++; break; } }
      continue;
    }
    const nm = /^[A-Za-z_][\w:.-]*/.exec(body.slice(i));
    if (!nm) { i++; continue; }
    const name = nm[0];
    i += name.length;
    while (/\s/.test(body[i] ?? "")) i++;
    if (body[i] !== "=") { out.push({ name, value: null }); continue; }
    i++;
    while (/\s/.test(body[i] ?? "")) i++;
    const q = body[i];
    if (q === '"' || q === "'") {
      const end = body.indexOf(q, i + 1);
      if (end === -1) { out.push({ name, value: body.slice(i + 1) }); break; } // unclosed quote: rest of the tag
      out.push({ name, value: body.slice(i + 1, end) });
      i = end + 1;
    } else if (q === "{") {
      let depth = 0;
      const s = i;
      for (; i < body.length; i++) { if (body[i] === "{") depth++; else if (body[i] === "}" && --depth === 0) { i++; break; } }
      out.push({ name, value: body.slice(s, i) });
    } else {
      out.push({ name, value: null });
    }
  }
  return out;
}

/** The literal options of a union type such as '"solid" | "outline"', or null if it is not one. */
function literalOptions(type: string): string[] | null {
  const parts = type.split("|").map((p) => p.trim());
  if (!parts.every((p) => /^"[^"]*"$/.test(p))) return null;
  return parts.map((p) => p.slice(1, -1));
}

/**
 * Lints UI code (TSX, JSX or CSS) against Blueprint's rules. Deterministic, so
 * the same code always gets the same report — which is what makes it usable as
 * an eval grader as well as an agent tool.
 */
export function lintUi(m: Manifest, source: string): LintReport {
  const code = stripComments(source);
  const findings: Finding[] = [];
  const tokenNames = new Set(m.tokens.map((t) => t.name));
  const primitives = new Map(m.tokens.filter((t) => t.layer === "primitive").map((t) => [t.name, t]));

  // 1. raw colours
  for (const match of code.matchAll(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g)) {
    // "#" inside an id selector or a URL fragment is not a colour: require a property-ish context
    const before = code.slice(Math.max(0, (match.index ?? 0) - 40), match.index);
    if (match[0].startsWith("#") && !/[:=,(\s"'`]$/.test(before)) continue;
    const near = match[0].startsWith("#") ? nearestSemantic(m, match[0]) : undefined;
    findings.push({
      rule: "raw-colour", severity: "error", line: lineOf(code, match.index ?? 0),
      message: `Raw colour ${match[0]}${match[0].endsWith("(") ? "…)" : ""} — colours come from tokens.`,
      ...(near ? { suggestion: `var(${near.name})` } : { suggestion: "Use a semantic token, e.g. var(--ds-text) or var(--ds-accent)." }),
    });
  }

  // 2. tokens: primitives and unknown names
  const used = new Set<string>();
  for (const match of code.matchAll(/--ds-[a-z0-9-]+/g)) {
    // `--ds-space-${n}` or `--ds-space-{n}` builds the name at runtime: the prefix alone is not a token.
    const next = code[(match.index ?? 0) + match[0].length];
    if (match[0].endsWith("-") && (next === "$" || next === "{")) continue;
    const name = match[0].replace(/-+$/, "");
    used.add(name);
    const line = lineOf(code, match.index ?? 0);
    if (primitives.has(name)) {
      const semantic = m.tokens.filter((t) => t.layer === "semantic" && Object.values(t.themes ?? {}).some((v) => v.primitive === name));
      findings.push({
        rule: "primitive-token", severity: "error", line,
        message: `${name} is a primitive — components read the semantic layer, or the theme cannot change it.`,
        suggestion: semantic.length ? semantic.map((t) => `var(${t.name})`).join(" or ") : "Use the semantic token for this purpose.",
      });
    } else if (!tokenNames.has(name)) {
      findings.push({ rule: "unknown-token", severity: "error", line, message: `${name} is not a Blueprint token.` });
    }
  }

  // 3. bare spacing
  for (const match of code.matchAll(/\b(padding|margin|gap|row-gap|column-gap|rowGap|columnGap|(?:padding|margin)(?:-?(?:top|right|bottom|left|inline|block)(?:-start|-end)?|Top|Right|Bottom|Left|Inline|Block))\s*:\s*["']?([^;,}"'\n]+)/gi)) {
    const value = match[2] ?? "";
    if (/var\(--ds-space/.test(value)) continue;
    const px = [...value.matchAll(/(?<![\w-])(\d+(?:\.\d+)?)(px)?\b/g)].map((n) => Number(n[1])).filter((n) => n > 0);
    if (!px.length) continue;
    const near = nearestSpace(m, px[0] ?? 0);
    findings.push({
      rule: "bare-spacing", severity: "warning", line: lineOf(code, match.index ?? 0),
      message: `${match[1]}: ${value.trim()} uses a bare value — spacing comes from the --ds-space-* scale.`,
      ...(near ? { suggestion: `var(${near.name}) (${near.value})` } : {}),
    });
  }

  // 4. component props
  const byName = new Map<string, ComponentEntry>(m.components.map((c) => [c.name, c]));
  const usedComponents = new Set<string>();
  for (const tag of jsxTags(code, new Set(byName.keys()))) {
    const doc = byName.get(tag.name);
    if (!doc) continue;
    usedComponents.add(tag.name);
    const line = lineOf(code, tag.index);
    const props = new Map(doc.props.map((p) => [p.name, p]));
    for (const attr of tag.attrs) {
      if (props.has(attr.name)) {
        const opts = literalOptions(props.get(attr.name)?.type ?? "");
        if (opts && attr.value !== null && !attr.value.startsWith("{") && !opts.includes(attr.value)) {
          findings.push({
            rule: "invalid-prop-value", severity: "error", line,
            message: `<${tag.name} ${attr.name}="${attr.value}"> — not a valid value.`,
            suggestion: `One of: ${opts.map((o) => `"${o}"`).join(", ")}`,
          });
        }
        continue;
      }
      if (UNIVERSAL.has(attr.name) || /^(aria|data)-/.test(attr.name) || /^on[A-Z]/.test(attr.name)) continue;
      findings.push({
        rule: "unknown-prop", severity: "warning", line,
        message: `<${tag.name}> has no "${attr.name}" prop.`,
        suggestion: `Documented props: ${doc.props.map((p) => p.name).join(", ") || "none"}`,
      });
    }
    const names = new Set(tag.attrs.map((a) => a.name));
    if (names.has("iconOnly") && !names.has("aria-label") && !names.has("aria-labelledby")) {
      findings.push({
        rule: "icon-only-label", severity: "error", line,
        message: `<${tag.name} iconOnly> without aria-label has no accessible name.`,
        suggestion: 'Add aria-label="…" describing the action.',
      });
    }
  }

  findings.sort((a, b) => a.line - b.line);
  return {
    findings: findings.slice(0, MAX_FINDINGS),
    ...(findings.length > MAX_FINDINGS ? { omitted: findings.length - MAX_FINDINGS } : {}),
    errors: findings.filter((f) => f.severity === "error").length,
    warnings: findings.filter((f) => f.severity === "warning").length,
    componentsUsed: [...usedComponents].sort(),
    tokensUsed: [...used].sort(),
  };
}
