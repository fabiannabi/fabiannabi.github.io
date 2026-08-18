# CLAUDE.md

Personal site for Fabián Alcalá — User Interface Engineer at Salesloft, targeting
frontend platform / design systems lead roles.

**The first two pages are the job application.** `index` is the cover letter; the
profile is the extended CV. There is no separate document to keep in sync — a
copy edit there is a CV edit.

Three entry points, deployed to GitHub Pages at `https://fabiannabi.github.io`:

- `index.html` → `src/pages/Cover` — the cover. One screen, ~80 words. Its only
  job is to earn ten seconds and a click through.
- `profile/index.html` → `src/pages/Profile` — about, experience, selected work,
  writing. ~610 words.
- `design/index.html` → `src/pages/Design` — **Blueprint**, the design system:
  eight components, live examples, props, accessibility notes and guidance.
  Storybook builds alongside it at `/storybook/`.

## Non-negotiables

**This site argues that its author does accessibility and design systems well.
Every claim on the page has to survive an audit of the page itself.** A contrast
failure here is not a bug, it is a contradiction. Treat a11y regressions as
build-breaking.

1. **React + TypeScript + CSS Modules. Three entry points, no client router.**
   GitHub Pages serves static files; an SPA router would need the 404.html
   rewrite hack and would ship the design system's JS to someone who only reads
   the cover. Do not add a router, Tailwind, or a component library — the site's
   argument is that the author writes this layer, not that he installs it.
2. **Three token layers, and components may only read the middle one.**
   `--ds-violet-400` (primitive) → `--ds-accent` (semantic) → `--button-bg`
   (component). A component reaching straight for a primitive is what makes a
   design system impossible to re-theme later. The primitive ramps are
   **generated** — edit `scripts/generate-palette.mjs` and re-run `pnpm palette`,
   never `src/ds/tokens/primitives.css` by hand.
3. **No raw colour outside the token files.** Enforced:
   `src/__tests__/conventions.test.ts` greps every CSS Module for hex and
   `rgb()` literals and fails on a match.
4. **Logical properties only.** `inline-start` / `inline-end` / `margin-inline`,
   never `left` / `right` / `margin-left`. Also enforced by the conventions test.
5. **`prefers-reduced-motion` is honoured by every animation**, including
   JS-driven ones. Nothing in a stylesheet stops a `requestAnimationFrame` loop,
   so every animated component reads `usePrefersReducedMotion` and refuses to
   start. The hook is reactive — turning the OS setting on mid-visit stops the
   motion.
6. **Keep the word counts low** on the cover and the profile. Ceilings are
   asserted: 100 words and 660 words. Getting past one means cutting something.
   The design system page is documentation and is not under a ceiling.
7. **Copy for the cover and profile lives in `src/data/content.ts`**; component
   guidance lives in `*.docs.ts` next to each component. Neither belongs in JSX.

## The design system

`src/ds/` is written to be liftable into its own package: it owns its tokens, its
hooks, and the x-ray. The site consumes it, not the other way round — which is
why `src/hooks/useTheme.ts` is a thin wrapper over `src/ds/hooks/useThemeAttribute.ts`.

Each component ships four files: the implementation, its CSS Module, a
`.docs.ts` describing the API and the guidance, and a `.stories.tsx`. The docs
page and the props tables render from the `.docs.ts`; Storybook generates its own
tables from the TypeScript via react-docgen. **Add a component to
`src/ds/docs/registry.ts` or it will not appear on the docs page.**

### The x-ray

A blueprint overlay, toggled by the button or the `X` key, on all three pages.

- Components opt in by spreading `xray("Name", { props })` onto their **root**
  element. It stamps `data-ds-component` and `data-ds-props` and nothing else —
  no wrapper node, so the mode costs nothing while it is off.
- `XRayProvider` measures the padding the browser actually computed and writes
  it back, because the only honest answer to "what is the spacing here" is the
  used value, not what a variant declared.
- The outer dashed box is the border box, the inner one is the content box, and
  the gap between them *is* the padding. No annotation required.

## Verifying

```bash
pnpm verify        # typecheck + contrast audit + unit tests + build
pnpm test:e2e      # Playwright: keyboard, themes, reduced motion, x-ray, 380/1600px
pnpm dev           # localhost:5173  (/profile/ and /design/)
pnpm storybook     # localhost:6006
pnpm palette       # regenerate the primitive ramps
```

CI runs all of it on every push and pull request, and only deploys from `main`
after it passes.

`CHECKS` in `scripts/audit-contrast.mjs` mirrors the real rules in the
stylesheets. **If you introduce a new foreground/background combination, add it
to `CHECKS`.** An unchecked pair is an unknown, not a pass.

axe's `color-contrast` rule is **off** in unit tests on purpose: jsdom does no
layout and computes no colours, so it can only return "incomplete". Contrast is
verified for real by the audit script, which resolves the semantic aliases down
to literals before measuring.

## Invariants learned the hard way

These are real bugs that already happened here. Do not reintroduce them.

- **`Glow` must stay overscanned.** `position: fixed; inset: -30%`, drifting by
  `translate3d(14vw, 10vh, 0) scale(1.18)`. At `inset: 0` the layer's own left
  edge walked into the viewport and left a hard vertical seam. The gradient
  origin (`at 32.5% 30%`) is expressed against the oversized box, so changing
  `inset` means recomputing it.
- **The rotating headline slot must not animate its underline width.** The
  `::after` resizes at zero opacity, during the fade. Animating it in view reads
  as a bar growing and shrinking, not an underline.
- **The `<h1>` carries its full sentence in a `VisuallyHidden`**, and the visible
  rotating construction is `aria-hidden`. Without this a screen reader announces
  "I build the other teams build on." There is a test on the accessible name.
- **Opacity is a contrast change.** The stack rail dims to `0.85` because that is
  the lowest value that still clears 4.5:1. The earlier `0.32` looked better and
  measured 1.8:1.
- **A hover state is not exempt from contrast.** `--dimmer` measured 4.35:1
  against `--bg-2`, the surface entry rows swap to on hover, so dates failed only
  while hovered. Both themes were re-tuned and the pair is in `CHECKS`.
- **Instrument the root element, never one that already uses `::before` or
  `::after` for content.** The x-ray paints its label and its content box with
  those two pseudo-elements, so stamping `StackRail`'s items (whose `::before` is
  the diamond) would silently replace them. Stamp the rail.
- **A scrollable component must carry `max-width: 100%`.** `Code`'s block sized
  to `max-content` inside a flex parent that did not stretch it, so a long line
  pushed the *page* wide instead of scrolling — SC 1.4.10, caused by the
  component built to prevent it.
- **Interactive targets are ≥24×24 CSS px** (WCAG 2.2 SC 2.5.8). A 2.1-era
  checker will not catch this.
- **Validate colour literals programmatically.** A full-width digit once slipped
  into a hex value (`#96828７`) and silently broke a rule. The audit and the
  conventions test both scan for non-ASCII outside comments.
- **The theme is set by a blocking script in each entry HTML**, before React
  mounts. Deciding it in an effect means a frame of the wrong palette on load.
  The site and the design system use separate attributes and storage keys, so
  `/design/` in light does not drag the profile with it.
- **Do not fake timers around `user-event`.** It deadlocks user-event's internal
  waits; the test times out before it can restore the clock, and the *next* test
  inherits a frozen one. Use real timers and `waitFor` — the animations here are
  360ms.
- **A Playwright assertion that is true either way is not a test.** Two x-ray
  tests "passed" while the keyboard shortcut was broken, because a focus ring is
  solid with or without the blueprint. Assert the precondition (`data-xray` is
  `on`) before asserting the consequence.
- **Pin motion-dependent e2e tests explicitly.** The suite runs a
  `reduced-motion` project, so any test asserting that something *moves* needs
  `contextOptions: { reducedMotion: "no-preference" }`.

## Voice

Direct, technical, no filler. Concrete over abstract: "deprecation stopped being
an argument and became a query" rather than "improved decision-making". State
trade-offs and what they cost. Never invent metrics — Salesloft code is private,
so the work is described honestly without numbers rather than with invented ones.
British-ish spelling is not used; keep US spelling.

**The design system is Fabián's own work, not a copy of his employer's.** Its
palette is generated from its own formula, its components are independently
designed, and nothing about it should carry Salesloft branding or values.

## Open items

- [ ] Write the one personal line in `src/data/content.ts` (`personalLine`,
      rendered with a dashed underline). Still a placeholder. Flip
      `isPlaceholder` to `false` when it is real.
- [ ] The three `writing` entries are drafts with a "to publish" badge. When a
      post goes live, link it and drop the badge.
- [ ] Form controls — Input, Select, Checkbox, Radio, Switch — are the obvious
      v2 for the design system, and the ones with the most accessibility work.
