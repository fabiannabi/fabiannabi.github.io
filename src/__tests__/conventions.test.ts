import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  about,
  colophon,
  coverSub,
  experience,
  headline,
  identity,
  personalLine,
  stats,
  work,
  writing,
} from "../data/content";

/**
 * The rules in CLAUDE.md, enforced.
 *
 * This site argues that its author does accessibility and design systems well,
 * so every claim on the page has to survive an audit of the page itself. A
 * convention nobody enforces is only a suggestion — which is the argument the
 * profile makes about lint rules, and it would be a poor look to not apply it
 * here.
 */

/* Vitest rewrites import.meta.url to a non-file scheme, so it cannot be used to
   locate the source tree. The runner's cwd is the project root. */
const SRC = join(process.cwd(), "src");

const cssFiles = (): string[] =>
  readdirSync(SRC, { recursive: true, encoding: "utf8" })
    .filter((entry) => entry.endsWith(".css"))
    .map((entry) => join(SRC, entry));

/**
 * Token files are the one place a colour literal is allowed to live: the site's
 * palettes, and the design system's generated primitive ramps. Everything else —
 * every CSS Module, every page stylesheet — must resolve through them.
 */
const isTokenFile = (path: string): boolean =>
  /tokens\.[\w-]+\.css$/.test(path) || /[\\/]ds[\\/]tokens[\\/]/.test(path);

const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, "");

const read = (path: string): string => stripComments(readFileSync(path, "utf8"));

const label = (path: string): string => relative(SRC, path).replace(/\\/g, "/");

const countWords = (...parts: string[]): number =>
  parts
    .join(" ")
    .split(/\s+/)
    .filter((token) => /[a-zA-Z0-9]/.test(token)).length;

describe("no raw colour outside the token files", () => {
  it.each(cssFiles().filter((path) => !isTokenFile(path)).map((p) => [label(p), p]))(
    "%s",
    (_name, path) => {
      const literals = read(path).match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab)\(/g);

      expect(literals, "every colour resolves from a custom property in :root").toBeNull();
    },
  );
});

/**
 * The colour rule below has a twin nobody wrote down: type is tokenized too.
 * An audit found eight values that had escaped — four of them in Heading, the
 * component that owns tracking, still carrying the literals the --ds-tracking-*
 * steps were added to replace.
 *
 * This is what "inside the tokenization" actually means, and it is not the same
 * as "composed from another component". Button sets its own font-size and is
 * fully tokenized; Heading delegated to nothing and was not.
 */
describe("no raw typography outside the token files", () => {
  const TYPOGRAPHY = /(?:font-size|letter-spacing|line-height|font-weight)\s*:\s*([^;]+);/g;
  const ALLOWED = /^(?:var\(|inherit|normal|unset|revert)/;

  it.each(cssFiles().filter((path) => !isTokenFile(path)).map((p) => [label(p), p]))(
    "%s",
    (_name, path) => {
      const found = [...read(path).matchAll(TYPOGRAPHY)]
        .map((match) => match[1]?.trim() ?? "")
        .filter((value) => value !== "" && !ALLOWED.test(value));

      expect(found, "every type value resolves from a token in ds/tokens/scale.css").toEqual([]);
    },
  );
});

describe("logical properties only", () => {
  // The profile mirrors for RTL. A physical property is a bug there, not a style.
  const PHYSICAL =
    /(?:^|[\s;{])(?:(?:margin|padding|border|scroll-margin|scroll-padding)-(?:left|right)|(?:left|right)\s*:|float\s*:)/gm;

  it.each(cssFiles().map((p) => [label(p), p]))("%s", (_name, path) => {
    const found = read(path).match(PHYSICAL);

    expect(found, "use inline-start / inline-end / margin-inline").toBeNull();
  });
});

describe("colour literals are validated programmatically", () => {
  // A full-width digit once slipped into a hex value and silently broke a rule.
  // Reading the stylesheet by eye will not catch that; a regex will.
  it.each(cssFiles().map((p) => [label(p), p]))("%s has no non-ASCII outside comments", (_name, path) => {
    const suspect = read(path).match(/[^\x00-\x7F]/g);

    expect(suspect, "a look-alike character in a value fails silently").toBeNull();
  });
});

describe("reduced motion is honoured globally", () => {
  it("declares the media query in the base tokens", () => {
    const base = readFileSync(join(SRC, "styles", "tokens.base.css"), "utf8");

    expect(base).toContain("prefers-reduced-motion: reduce");
  });

  it("checks the flag in JavaScript too, where CSS cannot reach", () => {
    // Nothing in a stylesheet stops a rAF loop. The hook lives in the design
    // system, because every animated component in it reads the flag and the
    // system has to work in an app that has never heard of this site; src/hooks
    // re-exports it so page code still imports from one place.
    const hook = readFileSync(join(SRC, "ds", "hooks", "usePrefersReducedMotion.ts"), "utf8");

    expect(hook).toContain("prefers-reduced-motion: reduce");
  });
});

/**
 * An audit found nine of fourteen components with no test at all and thirty-one
 * accessibility claims in the docs with nothing behind them. Writing the tests
 * fixed that once; this stops it drifting back, which is the only version of a
 * convention that is worth anything.
 */
describe("every design system component is tested against its own claims", () => {
  const COMPONENTS = join(SRC, "ds", "components");

  const componentNames = (): string[] =>
    readdirSync(COMPONENTS, { encoding: "utf8" }).filter((entry) =>
      existsSync(join(COMPONENTS, entry, `${entry}.tsx`)),
    );

  it.each(componentNames())("%s ships a test", (name) => {
    const test = join(COMPONENTS, name, `${name}.test.tsx`);

    expect(existsSync(test), `${name} has accessibility notes in its docs and no test`).toBe(true);
  });

  it.each(componentNames())("%s runs axe over its own output", (name) => {
    const body = readFileSync(join(COMPONENTS, name, `${name}.test.tsx`), "utf8");

    expect(body).toContain("expectNoAxeViolations");
  });

  it.each(componentNames())("%s documents what it guarantees", (name) => {
    const docs = readFileSync(join(COMPONENTS, name, `${name}.docs.ts`), "utf8");

    // A component in the registry with an empty accessibility list is a
    // component claiming nothing, which is worse than claiming and being wrong.
    expect(docs).toMatch(/accessibility: \[\s*"/);
  });
});

describe("word counts stay low", () => {
  // Earlier versions of both pages were too dense. Adding a paragraph is a real
  // cost, and a ceiling makes it a visible one.
  it("keeps the cover to about one screen", () => {
    const words = countWords(
      identity.name,
      identity.coverRole,
      identity.status,
      headline.sentence,
      coverSub.lead,
      coverSub.emphasis,
      coverSub.tail,
      ...stats.map((stat) => `${stat.value} ${stat.label}`),
    );

    // 79 at the time of writing. The ceiling is close enough that a new sentence
    // or a fourth stat has to displace something rather than just being added.
    expect(words).toBeLessThanOrEqual(100);
  });

  it("keeps the profile under its ceiling", () => {
    const words = countWords(
      identity.tagline,
      ...about.flat(),
      ...experience.map((entry) => `${entry.note ?? ""} ${entry.description ?? ""}`),
      ...work.map((entry) => entry.description ?? ""),
      ...writing.map((entry) => entry.description ?? ""),
      personalLine.text,
      colophon,
    );

    // 609 at the time of writing, against a ceiling that a whole new paragraph
    // would not fit under. Cutting something is the intended way past this.
    expect(words).toBeLessThanOrEqual(660);
  });
});
