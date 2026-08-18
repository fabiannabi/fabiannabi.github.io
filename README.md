# fabiannabi.github.io

Personal site — a one-screen cover and a longer profile.
**[fabiannabi.github.io](https://fabiannabi.github.io)**

React, TypeScript and CSS Modules on Vite. Two HTML entry points rather than a
client router: GitHub Pages serves static files, so real URLs beat the
`404.html` rewrite hack, and someone who only reads the cover never downloads the
profile.

```
src/
  entries/     one file per page — mounts React, imports that page's tokens
  pages/       Cover, Profile
  components/  the shared layer: VisuallyHidden, StatusPill, Entry, …
  hooks/       usePrefersReducedMotion, useTheme, useActiveSection
  data/        every word on both pages, typed
  styles/      tokens, and the only global rules in the codebase
scripts/       contrast audit
e2e/           Playwright
```

## Running it

```bash
pnpm install
pnpm dev          # localhost:5173 — profile at /profile/
pnpm verify       # typecheck + contrast audit + unit tests + build
pnpm test:e2e     # Playwright
```

## Accessibility

The site is about design systems and accessibility, so the checks are part of the
build rather than a claim in the copy.

- **Contrast is computed, not eyeballed.** `scripts/audit-contrast.mjs` parses
  the token files and checks every foreground/background pair against the WCAG
  2.2 relative-luminance formula — in both profile themes, including translucent
  fills and dimmed states, since opacity is a contrast change. It exits non-zero,
  so CI fails on a regression.
- **Every animation honours `prefers-reduced-motion`,** including the
  `requestAnimationFrame` marquee, which no stylesheet can stop. Proved in a real
  browser with the preference set.
- **axe-core runs against both pages** in the unit tests.
- **Keyboard navigable end to end** — tab order, focus rings and the skip link
  are asserted in Playwright, at 380px and 1600px.
- **Interactive targets meet the 24×24 CSS px minimum** of SC 2.5.8.

The conventions the codebase claims to follow are themselves tested: no colour
literal outside the token files, no physical properties in a stylesheet that has
to mirror for RTL, and a ceiling on the word count of each page.

## Deploying

Pushing to `main` runs the full verification and, if it passes, deploys `dist/`
to Pages via GitHub Actions. Requires **Settings → Pages → Source → GitHub
Actions**.
