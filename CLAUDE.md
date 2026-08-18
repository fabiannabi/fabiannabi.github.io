# CLAUDE.md

Personal site for Fabián Alcalá — User Interface Engineer at Salesloft, targeting
frontend platform / design systems lead roles.

**These two pages are the job application.** `index` is the cover letter; the
profile is the extended CV. There is no separate document to keep in sync — a
copy edit here is a CV edit.

Two entry points, deployed to GitHub Pages at `https://fabiannabi.github.io`:

- `index.html` → `src/pages/Cover` — the cover. One screen, ~80 words. Its only
  job is to earn ten seconds and a click through to the profile.
- `profile/index.html` → `src/pages/Profile` — about, experience, selected work,
  writing. ~610 words.

## Non-negotiables

**This site argues that its author does accessibility and design systems well.
Every claim on the page has to survive an audit of the page itself.** A contrast
failure here is not a bug, it is a contradiction. Treat a11y regressions as
build-breaking.

1. **React + TypeScript + CSS Modules. Two entry points, no client router.**
   GitHub Pages serves static files; an SPA router would need the 404.html
   rewrite hack and would ship the profile's JS to someone who only reads the
   cover. Do not add a router, Tailwind, or a component library — the site's
   argument is that the author writes this layer, not that he installs it.
2. **No raw colour outside `src/styles/tokens.*.css`.** Everything else resolves
   from a custom property. This is enforced: `src/__tests__/conventions.test.ts`
   greps every CSS Module for hex and `rgb()` literals and fails on a match.
3. **Logical properties only.** `inline-start` / `inline-end` / `margin-inline`,
   never `left` / `right` / `margin-left`. The profile mirrors for RTL. Also
   enforced by the conventions test.
4. **`prefers-reduced-motion` is honoured by every animation**, including
   JS-driven ones. Nothing in a stylesheet stops a `requestAnimationFrame` loop,
   so every animated component reads `usePrefersReducedMotion` and refuses to
   start. The hook is reactive, not read-once — turning the OS setting on
   mid-visit stops the motion.
5. **Keep the word counts low.** Earlier versions were too dense. Adding a
   paragraph is a real cost, so the ceilings are asserted in the conventions
   test: 100 words on the cover, 660 on the profile. Getting past one means
   cutting something, which is the point.
6. **Copy lives in `src/data/content.ts`, not in JSX.** That is what makes rule 5
   testable and what makes editing the CV a data change.

## Verifying

```bash
pnpm verify        # typecheck + contrast audit + unit tests + build
pnpm test:e2e      # Playwright: keyboard, themes, reduced motion, 380/1600px
pnpm dev           # localhost:5173  (profile at /profile/)
```

CI runs all of it on every push and pull request, and only deploys from `main`
after it passes.

`CHECKS` in `scripts/audit-contrast.mjs` mirrors the real rules in the
stylesheets. **If you introduce a new foreground/background combination, add it
to `CHECKS`.** An unchecked pair is an unknown, not a pass.

### What the tests actually cover

- `conventions.test.ts` — the rules above, as assertions.
- Component tests — the accessible name of the headline, the reduced-motion
  branch of every animation, the theme toggle's label.
- `audit-contrast.mjs` — WCAG 2.2 ratios for every pair, in both profile themes,
  including translucent fills and the rail's dimmed state.
- Playwright — tab order and focus rings, skip link, theme persistence across a
  reload, the nav marker following scroll, and no horizontal scroll at 380px or
  1600px.

axe's `color-contrast` rule is **off** in unit tests on purpose: jsdom does no
layout and computes no colours, so it can only return "incomplete". Contrast is
verified for real by the audit script.

## Invariants learned the hard way

These are real bugs that already happened here. Do not reintroduce them.

- **`Glow` must stay overscanned.** It is `position: fixed; inset: -30%` and
  drifts by `translate3d(14vw, 10vh, 0) scale(1.18)`. At `inset: 0` the layer's
  own left edge walked into the viewport and left a hard vertical seam where the
  wash stopped. If you change the drift transform, re-check that the layer still
  covers `0..100vw` and `0..100vh` at both ends. The gradient origin
  (`at 32.5% 30%`) is expressed against the oversized box, not the viewport —
  changing `inset` means recomputing it.
- **The rotating headline slot must not animate its underline width.** The
  `::after` rule resizes at zero opacity, during the fade. Transitioning `width`
  while visible reads as a bar growing and shrinking, not an underline.
- **The `<h1>` carries its full sentence in a `VisuallyHidden`**, and the visible
  rotating construction is `aria-hidden`. Without this a screen reader announces
  "I build the other teams build on." There is a test on the accessible name.
- **Opacity is a contrast change.** The stack rail dims non-hovered items to
  `0.85` because that is the lowest value that still clears 4.5:1. The earlier
  `0.32` looked better and measured 1.8:1. Highlight the hovered item instead of
  fading the rest.
- **A hover state is not exempt from contrast.** `--dimmer` measured 4.35:1
  against `--bg-2`, which is what entry rows swap to on hover — so the dates
  failed only while hovered. Both themes were re-tuned and the pair is now in
  `CHECKS`.
- **Interactive targets are ≥24×24 CSS px** (WCAG 2.2 SC 2.5.8). This is a 2.2
  criterion, so a 2.1-era checker will not catch it.
- **Validate colour literals programmatically.** A full-width digit once slipped
  into a hex value (`#96828７`) and silently broke a rule. Both the audit script
  and the conventions test scan for non-ASCII outside comments.
- **The theme is set by a blocking script in `profile/index.html`, before React
  mounts.** Deciding it in an effect means a frame of the wrong palette on every
  load. `useTheme` adopts that value rather than re-deriving it.

## Voice

Direct, technical, no filler. Concrete over abstract: "deprecation stopped being
an argument and became a query" rather than "improved decision-making". State
trade-offs and what they cost. Never invent metrics — Salesloft code is private,
so the work is described honestly without numbers rather than with invented ones.
British-ish spelling is not used; keep US spelling.

## Open items

- [ ] Write the one personal line in `src/data/content.ts` (`personalLine`,
      rendered with a dashed underline). Still a placeholder. Flip
      `isPlaceholder` to `false` when it is real.
- [ ] The three `writing` entries are drafts with a "to publish" badge. When a
      post goes live, link it and drop the badge.
