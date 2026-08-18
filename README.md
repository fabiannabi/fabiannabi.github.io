# fabiannabi.github.io

Personal site and a small design system.
**[fabiannabi.github.io](https://fabiannabi.github.io)**

- **/** — the cover.
- **/profile/** — the full profile.
- **/design/** — *Blueprint*, a design system: eight components with live
  examples, props, accessibility notes and guidance.
- **/storybook/** — the same components in Storybook, with generated props tables.

React, TypeScript and CSS Modules on Vite. Three HTML entry points rather than a
client router: GitHub Pages serves static files, so real URLs beat the
`404.html` rewrite hack, and someone who only reads the cover never downloads the
design system.

```
src/
  entries/     one file per page — mounts React, imports that page's tokens
  pages/       Cover, Profile, Design
  components/  the site's own layer
  hooks/       usePrefersReducedMotion, useTheme, useActiveSection
  data/        every word on the cover and the profile, typed
  styles/      the site's palettes and the only global rules
  ds/          the design system — tokens, components, docs, x-ray
scripts/       palette generator, contrast audit
e2e/           Playwright
```

## The x-ray

Press `X` on any page, or use the toggle. Every component is outlined and
labelled with the props it was given and the padding it actually computed — the
outer dashed box is the border box, the inner one is the content box, and the gap
between them is the padding.

Components opt in by spreading `xray("Name", { props })` onto their root element,
which stamps two data attributes and adds no DOM. While the mode is off it costs
nothing: no wrapper, no extra box, no layout.

The padding is *measured*, not declared. A component's spacing comes from a
token, through a size variant, possibly overridden by a media query, so the only
honest answer is the used value.

## Tokens

Three layers, and a component may only read the middle one:

```
--ds-violet-400   primitive   what the colour is
--ds-accent       semantic    what it is for
--button-bg       component   where it is used
```

The primitive ramps are generated, not picked. `scripts/generate-palette.mjs`
walks one perceptual lightness scale in OKLCH for every hue, tapering chroma at
the ends and reducing it until each swatch is inside sRGB — so `violet-600` and
`rose-600` are the same lightness by construction, and swapping one for the other
is safe.

## Running it

```bash
pnpm install
pnpm dev              # localhost:5173
pnpm storybook        # localhost:6006
pnpm verify           # typecheck + contrast audit + unit tests + build
pnpm test:e2e         # Playwright
pnpm palette          # regenerate the primitive ramps
```

## Accessibility

The site is about design systems and accessibility, so the checks are part of the
build rather than a claim in the copy.

- **Contrast is computed, not eyeballed.** `scripts/audit-contrast.mjs` resolves
  the semantic tokens through the primitive layer and checks every
  foreground/background pair against WCAG 2.2 — in every theme, including
  translucent fills and dimmed states, since opacity is a contrast change. It
  exits non-zero, so CI fails on a regression. Decorative edges are measured and
  reported but do not gate, because SC 1.4.11 applies to boundaries that are
  *required to identify* a component; the ones that are — control edges — do gate.
- **The API enforces what it can.** An icon-only `Button` will not compile
  without an accessible name. A `Chip`'s remove button cannot be nested inside
  its toggle. `Heading` separates level from size so a smaller heading never
  costs you the document outline.
- **`Tabs` implements the ARIA APG pattern** — roving tabindex, arrow keys that
  wrap, Home/End, a focusable panel, and optional manual activation.
- **Status is never carried by colour alone.** Each `Alert` tone has its own
  glyph shape and a visually hidden tone word.
- **Every animation honours `prefers-reduced-motion`,** including the
  `requestAnimationFrame` marquee and the x-ray's staggered reveal, which no
  stylesheet can stop.
- **axe-core runs against every page and component** in the unit tests.
- **Keyboard navigable end to end** — tab order, focus rings and skip links are
  asserted in Playwright, at 380px and 1600px.

The conventions the codebase claims to follow are themselves tested: no colour
literal outside the token files, no physical properties in stylesheets that have
to mirror for RTL, and a ceiling on the word count of each page.

## Deploying

Pushing to `main` runs the full verification and, if it passes, deploys `dist/`
to Pages via GitHub Actions. Requires **Settings → Pages → Source → GitHub
Actions**.
