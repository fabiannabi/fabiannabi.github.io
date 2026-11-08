/**
 * Builds dist/manifest.json — Blueprint described as data, for tools and agents.
 *
 *   components  every entry in the docs registry (props, anatomy, accessibility,
 *               do / don't), plus the import path a consumer should use
 *   tokens      every --ds-* custom property: its layer (primitive, semantic,
 *               scale), its value per theme, the primitive it resolves to, and
 *               the comment written above it — the "what it is for"
 *
 * The registry is TypeScript, so it is loaded through Vite rather than parsed:
 * the manifest can never disagree with the docs page, because both read the
 * same objects.
 *
 *   node packages/blueprint/scripts/build-manifest.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const pkg = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(pkg, "src");

/* ---- components --------------------------------------------------------- */
const server = await createServer({
  root: pkg,
  logLevel: "error",
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
let registry;
try {
  ({ registry } = await server.ssrLoadModule(join(src, "docs", "registry.ts")));
} finally {
  await server.close();
}

const components = registry.map((doc) => ({
  ...doc,
  import: `@fabiannabi/blueprint/components/${doc.name}/${doc.name}`,
}));

/* ---- tokens ------------------------------------------------------------- */
const read = (file) => readFileSync(join(src, "tokens", file), "utf8");

/**
 * Walks a stylesheet and returns declarations with the selector they sit in and
 * the comment immediately above them (blank lines break the association, so a
 * section header is not mistaken for a token's description).
 */
function declarations(css) {
  const out = [];
  let selector = ":root";
  let comment = "";
  const re = /\/\*([\s\S]*?)\*\/|([^{}]+)\{|\}|(--ds-[\w-]+)\s*:\s*([^;]+);|\n\s*\n/g;
  for (const m of css.matchAll(re)) {
    if (m[1] !== undefined) comment = m[1].replace(/^\s*\*?\s?/gm, "").replace(/\s+/g, " ").trim();
    else if (m[2] !== undefined) { selector = m[2].trim(); comment = ""; }
    else if (m[0] === "}") selector = ":root";
    else if (m[3] !== undefined) { out.push({ name: m[3], value: m[4].trim(), selector, comment }); comment = ""; }
    else comment = ""; // blank line
  }
  return out;
}

const themeOf = (selector) => {
  const m = selector.match(/data-ds-theme="(\w+)"/);
  return m ? m[1] : "default";
};

const primitives = Object.fromEntries(declarations(read("primitives.css")).map((d) => [d.name, d.value]));
const resolve = (value) => {
  const m = value.match(/^var\((--ds-[\w-]+)\)$/);
  return m ? { ref: m[1], value: primitives[m[1]] ?? null } : { ref: null, value };
};

const tokens = [];
for (const [name, value] of Object.entries(primitives)) {
  const [, hue, step] = name.match(/^--ds-([a-z]+)-(\d+)$/) ?? [];
  tokens.push({ name, layer: "primitive", group: hue ?? "primitive", step: step ? Number(step) : null, value });
}

const semantic = new Map();
for (const d of declarations(read("semantic.css"))) {
  const t = semantic.get(d.name) ?? { name: d.name, layer: "semantic", group: d.name.replace(/^--ds-/, "").split("-")[0], themes: {}, comment: "" };
  const r = resolve(d.value);
  t.themes[themeOf(d.selector)] = { value: r.value, primitive: r.ref };
  if (d.comment && !t.comment) t.comment = d.comment;
  semantic.set(d.name, t);
}
tokens.push(...semantic.values());

for (const d of declarations(read("scale.css"))) {
  tokens.push({
    name: d.name, layer: "scale", group: d.name.replace(/^--ds-/, "").split("-")[0],
    value: d.value, comment: d.comment,
  });
}

/* ---- rules an agent (or a linter) can enforce --------------------------- */
const rules = [
  "Components and app code read semantic tokens (--ds-accent, --ds-text…); primitives (--ds-violet-400) are only for the semantic layer.",
  "No raw colour literals (hex, rgb, hsl, oklch) outside the token files.",
  "No bare pixel spacing: use --ds-space-* (4px base).",
  "Import components by path: @fabiannabi/blueprint/components/<Name>/<Name>.",
  "Icon-only controls need an aria-label.",
];

const manifest = {
  name: "@fabiannabi/blueprint",
  generated: new Date().toISOString().slice(0, 10),
  themes: [...new Set([...semantic.values()].flatMap((t) => Object.keys(t.themes)))],
  rules,
  components,
  tokens,
};

mkdirSync(join(pkg, "dist"), { recursive: true });
writeFileSync(join(pkg, "dist", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest: ${components.length} components, ${tokens.length} tokens (${semantic.size} semantic), themes: ${manifest.themes.join(", ")}`);
