import { readFileSync, readdirSync } from "node:fs";
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
    // Nothing in a stylesheet stops a rAF loop.
    const hook = readFileSync(join(SRC, "hooks", "usePrefersReducedMotion.ts"), "utf8");

    expect(hook).toContain("prefers-reduced-motion: reduce");
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
