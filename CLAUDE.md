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
  fourteen components, live examples, props, accessibility notes and guidance.
  Storybook builds alongside it at `/storybook/`.

## What belongs in the system, and what does not

There are two layers of component and the line between them is the single most
load-bearing decision in this repo.

- **`src/ds`** — the system. Fourteen components, every one of them generic.
- **`src/components`** — the app. Seven, every one of them composed from the
  system.

**The test is not how many times a component is used. It is whether its API
encodes a situation.** `Button({ variant, size })` serves any product;
`Entry({ when, org, badge })` serves a CV and nothing else, so it is app code no
matter how many rows render it. By the same test `Button`, `Chip`, `Alert` and
`Tabs` stay in the system with zero uses on this site: a catalogue entry nobody
has needed yet is not the same as a one-off wearing the system's badge.

An audit ran once and found three kinds of failure. All three are easy to repeat:

1. **One-off shapes inside the system.** `RotatingHeadline` is one page's
   conceit and `StackRail` is one page's marquee. Shipping them in the package
   would ship this cover's ideas to everyone who installed it.
2. **The domain leaking in.** `Entry`'s props *were* the CV's data model. A
   system that knows what a job is has taken a position on the app's model.
3. **Duplication hiding as specificity.** `ActionLink` was `Button` with a
   different radius and hover; `StatusPill` was `Badge` with a dot and a
   different corner. Two components that mean the same thing can only drift.
   They are `Button href` and `Badge shape="pill" dot` now.

### Composition, where it is real

A composite reaches for the primitive rather than re-declaring it. `Badge` is a
`Label` in a box; `Table`'s caption and column headers are `Label`s. Both used to
set the mono face, the size and the caps tracking themselves, which is how two
components that should agree stop agreeing.

**Not everywhere, though.** `Button`, `Chip` and `Toggle` set their own type on
purpose: a control's type is part of its size variant, and wrapping the label in
a `Text` would give one decision two owners — `size="lg"` on the button and
`size="md"` on the text inside it, disagreeing forever. Compose when the inner
thing is genuinely the same typographic role; do not compose to hit a metric.

`Toggle` is the counter-example worth keeping in mind: it earns its place
because the site's theme switch and the design system's own x-ray control are
both it. One use would have made it a component nobody needed.

**Every app component is built from the system**, and an e2e test asserts it —
for each `[data-ds-local]` on the cover and the profile it requires at least one
`[data-ds-component]` inside that is not itself app code. The earlier version of
that test demanded *zero* app components, which passed by moving every one-off
into the system. That is the failure mode the rule above exists to prevent.

The page stylesheets hold layout and nothing else. A `font-size`, a `color` or a
`letter-spacing` in `src/pages/*/*.module.css` means the page has started
re-implementing the system instead of consuming it — the two documented
exceptions are `.tagline`'s 31ch (a column width, not a reading measure) and
`.skip`, which is not part of the page.

## Non-negotiables

**This site argues that its author does accessibility and design systems well.
Every claim on the page has to survive an audit of the page itself.** A contrast
failure here is not a bug, it is a contradiction. Treat a11y regressions as
build-breaking.

That was once truer of the pages than of the system. An audit found **nine of
fourteen components with no test at all and thirty-one accessibility claims in
the docs with nothing behind them** — the `.docs.ts` files said what each
component guaranteed and only four of them proved it. Every component now ships
a test that runs axe over its own output, and `conventions.test.ts` fails the
build if a new one does not: a component may not claim in prose what it does not
assert in a test.

**Accessibility is checked in three places, and none of them is sufficient
alone.** Do not read a green run as "the site is accessible".

| where | what it can see | what it is blind to |
|---|---|---|
| `axe` in jsdom, per component | roles, names, structure, ARIA | colour and layout — jsdom computes neither, so `color-contrast` is switched off |
| `axe` in Chromium, per page (`e2e/a11y.spec.ts`) | the real cascade, both themes, 1280 and 380px, contrast included | everything automation cannot decide |
| `scripts/audit-contrast.mjs` | every declared pair across eight palettes, resolved to literals | pairs nobody wrote into `CHECKS` |

The e2e pass found what the unit tests structurally could not: the cover's
identity block, its status badge and its rail sat outside every landmark, so a
screen reader user had nothing to skip to. `header`/`main`/`footer` was the fix.

**Automated rules catch on the order of a third of WCAG.** They cannot judge
whether alt text is *right*, whether focus order matches reading order, whether
an error message is comprehensible, or whether a live region interrupts at a
useful moment. Those are read by hand or not at all, and this repo does not
pretend otherwise.

1. **React + TypeScript + CSS Modules. Three entry points, no client router.**
   GitHub Pages serves static files; an SPA router would need the 404.html
   rewrite hack. Do not add a router, Tailwind, or a component library — the
   site's argument is that the author writes this layer, not that he installs it.

   The cover used to be kept clear of the design system entirely. That rule is
   retired: all three pages are built from Blueprint. What replaces it is a
   budget, and the budget is **measured, not asserted** — `pnpm weigh` walks each
   entry HTML and sums what the browser is actually told to fetch, and `pnpm
   verify` fails if the cover's own gzipped JS passes 8 kB.

   Do not read page weight off the `vite build` list. It reports chunks, not
   pages, and names each chunk after whichever module happens to be inside it —
   the cover's entry chunk says 0.85 kB while the page loads 5.44 kB, because
   the shared chunks its imports drag in are listed separately. That mistake was
   made in this repo and the number was reported to the author before anyone
   checked it.
2. **Three token layers, and components may only read the middle one.**
   `--ds-violet-400` (primitive) → `--ds-accent` (semantic) → `--button-bg`
   (component). A component reaching straight for a primitive is what makes a
   design system impossible to re-theme later. The primitive ramps are
   **generated** — edit `scripts/generate-palette.mjs` and re-run `pnpm palette`,
   never `src/ds/tokens/primitives.css` by hand.

   Three different things now remap that middle layer, and none of them touches
   a component stylesheet. That is the only evidence the indirection is real:

   - `[data-ds-theme]` in `semantic.css` — light and dark on `/design/`
   - `tokens.ds-bridge.css` — the site's own palettes, so Blueprint's components
     wear synthwave on the cover and the profile's near-monochrome on the CV
   - `[data-xray]` in `blueprint.css` — the cyanotype the x-ray prints in

   Every one of them is measured by the contrast audit. Eight palettes, and a
   new remap means a new section in `scripts/audit-contrast.mjs`.
3. **No raw colour outside the token files.** Enforced:
   `src/__tests__/conventions.test.ts` greps every CSS Module for hex and
   `rgb()` literals and fails on a match.

   **The same rule applies to type**, and it went unwritten for longer. Every
   `font-size`, `letter-spacing`, `line-height` and `font-weight` outside the
   token files has to resolve from a token; the conventions test enforces it.
   Eight values had escaped when it was added, four of them in `Heading` — the
   component that owns tracking, still carrying the literals the
   `--ds-tracking-*` steps were created to replace.

   **Tokenized is not the same as composed.** `Button` sets its own `font-size`
   and is fully tokenized; `Heading` delegated to nothing and was not. Reaching
   for another component is a separate decision, made on whether the inner thing
   is the same typographic role — see the note on composition below.
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

**The docs page is the system's first consumer**, which is the cheapest way to
find out a component is missing. Its own chrome — not the examples it renders,
which use each component once by definition — is built from `Text`, `Label`,
`Heading`, `Code`, `Badge`, `Alert`, `Link` and `Table`. What is left as raw
markup there is `ul`/`li` (a list is a list) and a handful of `aria-hidden`
swatches.

`Table` came out of that exercise: the props tables were hand-built markup that
already carried a caption, `scope` on every header and a focusable scroll
region, and none of it was reusable. `PropsTable` is now the app half — it knows
what a `PropDoc` is — over a `Table` that knows how to be a table.

**Neither `Label` nor `Heading` takes a `className`, deliberately.** When the
docs page swapped its hand-styled `<h3>`s for them, four stylesheets kept rules
nobody applied any more and every section head lost its bottom margin. Spacing
around a component belongs to the page and is set on the element (`.sub > h3`),
never by reaching into the component.

`src/ds/` is written to be liftable into its own package: it owns its tokens, its
hooks, and the x-ray. The site consumes it, not the other way round — which is
why `src/hooks/useTheme.ts` is a thin wrapper over `src/ds/hooks/useThemeAttribute.ts`.

Each component ships four files: the implementation, its CSS Module, a
`.docs.ts` describing the API and the guidance, and a `.stories.tsx`. The docs
page and the props tables render from the `.docs.ts`; Storybook generates its own
tables from the TypeScript via react-docgen. **Add a component to
`src/ds/docs/registry.ts` or it will not appear on the docs page.**

### The x-ray

Toggled by the button or the `X` key, on all three pages. It prints the page as
a blueprint: the palette collapses to one cyanotype, the page is ruled like graph
paper, and every component is reduced to a named box at the size it really
occupies. It is a wireframe of the live page, not an inspector on top of it.

**It is split in two, and the split is the argument.**

- The colour half is `src/ds/tokens/blueprint.css` — a *theme*, a remap of the
  semantic layer, exactly like `[data-ds-theme="light"]` is. Nothing in
  `xray.css` sets a colour. If it did, the token architecture would be a story
  rather than a fact.
- The drawing half is `src/ds/xray/xray.css` — the ruling, the developing pass,
  the frames, the registration marks and the name plates.

Details that are load-bearing:

- **Three tiers, and the drawing is only worth reading if it keeps them apart.**
  All three stamp attributes onto the **root** element and nothing else — no
  wrapper node, so the mode costs nothing while it is off.

  | stamp | what it means | how it is drawn |
  |---|---|---|
  | `xray("Name", { props })` | a Blueprint component | solid frame, registration marks at the corners, name in the accent |
  | `local("Name", { props })` | an app component, in `src/components` | solid frame, **no** marks, name in the muted ink |
  | `region("Name")` | page markup that is not a component | dashed enclosure, legend on its own line |

  The registration marks are the claim that the system owns the box, and the
  difference is the most useful thing on the drawing: turn the x-ray on and you
  can see how much of a page is system and how much is one-off, which is the
  ratio a design system is actually judged on. Drawing a one-off identically to
  a `Display` would make the blueprint flatter its author, and a drawing that
  does that is not worth showing anyone.
- Content is blanked with `color: transparent`, **never `visibility: hidden`**.
  Hidden content leaves the accessibility tree, so a mode built to explain the
  page's structure would have deleted the page for anyone reading it with a
  screen reader.
- `XRayProvider` measures the padding the browser actually computed and writes
  it back, because the only honest answer to "what is the spacing here" is the
  used value, not what a variant declared. It also measures whether a box is
  wide enough for its own name and suppresses the plate if it is not.
- The solid frame is the border box, the dashed inner box is the content box,
  and the gap between them *is* the padding. **The plate shows the name and
  nothing else.** Props and the measured padding stay on the element as
  `data-ds-props` and `data-ds-box` for anyone who wants to read them off it;
  printing them on the drawing — at rest or on hover — is what turns this back
  into an inspector. There is no tooltip, and adding one is a regression.
- `XRayToggle` carries `data-ds-chrome` and is the one thing the blueprint may
  not blank — the control that turns the mode off has to keep reading as a
  control.

## Verifying

```bash
pnpm verify        # typecheck + contrast audit + unit tests + build
pnpm test:e2e      # Playwright: keyboard, themes, reduced motion, x-ray, 380/1600px
pnpm dev           # localhost:5173  (/profile/ and /design/)
pnpm storybook     # localhost:6006
pnpm palette       # regenerate the primitive ramps
pnpm weigh         # what each page actually costs, per entry HTML
```

CI runs all of it on every push and pull request, and only deploys from `main`
after it passes.

**Never measure performance against `pnpm dev`.** Vite serves unbundled ESM in
development — every module its own request, unminified, React in development
mode, plus the HMR client. A Lighthouse run against `localhost:5173` reported
3.55 MB and 3,521 kB of JavaScript for the cover; the same page built is 0.33 MB
and 206 kB across 13 requests. Seventeen times the JavaScript, and none of it
ships. Profile the build:

```bash
pnpm build && pnpm preview     # localhost:4173
```

and run Lighthouse there, in a private window — stored IndexedDB from a dev
session skews the load timings too.

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
- **`[data-xray]` must be qualified as `:root[data-xray]`.** As a bare attribute
  selector it ties with `[data-ds-theme]` and `[data-theme]`, so the winner is
  decided by import order — which held in dev and lost in the production bundle,
  where the token chunk is emitted ahead of the page chunk. The blueprint's
  colours silently did not apply and three e2e tests caught it.
- **A wireframe label that does not fit is worse than no label.** Centring the
  component name inside a 20px-wide `Code` clipped it to "od", which reads as a
  rendering bug. CSS cannot ask how wide its own text is, so `XRayProvider`
  decides and stamps `data-ds-plate`.
- **A container's name plate goes to the top edge, not the middle.** A `Stat` and
  the `Display` inside it print on the same line otherwise. `:has()` does it.
- **Everything the drawing prints has to fit in the box it belongs to.** Every
  attempt to say more than the name failed on this: expanded in place it clipped
  mid-word, floated as a panel it covered the region below, and either way it
  read as an inspector. The plate is one word, and `XRayProvider` measures
  whether even that fits before stamping `data-ds-plate`.
- **The x-ray's own text must reset the typography it hangs off.** A
  pseudo-element inherits from its originating element, so a `Label` with `caps`
  printed its own annotation as `LABEL / SIZE="XS" TONE="MUTED" CAPS` — the
  component's styling leaking into the description of the component. The plate
  resets `text-transform`, `font-style`, `font-variant`, `font-weight` and
  `text-decoration`.
- **Two controls of the same size line up through `--ds-control-*`, not by
  eye.** `StatusPill` sat at 25px next to the x-ray toggle's 34px on the cover
  and the difference read as a mistake. The toggle had been sized from
  `--ds-target-min`, which is the 24px accessibility floor, not a size. Both are
  `--ds-control-sm` now.
- **An inline component is not drawn.** A `<span>` emphasising two words inside
  a paragraph is typography, not structure, and a wireframe draws structure. It
  has no rectangle either — it fragments across line boxes. Three marks were
  tried and all three read as rendering faults, which was the signal that the
  question was wrong: an `outline` came out as a skewed L across the break, an
  underline sat below text the blueprint had already made invisible, and a
  filled wash was the only solid in a drawing made of lines. The paragraph is
  the box; what is emphasised inside it is content, and the content is already
  blanked. `XRayProvider` flags these with `data-ds-flow="inline"`, because CSS
  cannot ask an element for its used display.
- **A region's tag is a legend on its own enclosure line, at the inline end.**
  Above the line it needed vertical space, and that space is the gap between one
  region and the next — LINKS was crowded against the bottom of STATS. On the
  line it costs no height. At the inline end it cannot meet the tag of whatever
  component starts at the region's beginning.
- **An inline component is never framed.** A `<span>` emphasising two words
  fragments across line boxes, so there is no rectangle: the outline came out as
  a skewed L across two lines and the plate centred itself on a shape nothing
  occupies. `XRayProvider` flags them with `data-ds-flow="inline"`, because CSS
  cannot ask an element for its used display.
- **A component that contains a framed component is tagged outside its frame.**
  Centred, a `Stat` and its `Display` printed on the same line; moved to the
  inside top edge they were still seven pixels apart, because the child starts
  where the parent's padding ends. Only an inline child does not count — or a
  paragraph with an emphasised span would be tagged differently from the one
  next to it without one, implying a structural difference that is not there.
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
- [ ] `Stat` moved out to `src/components` in the audit and is the one call that
      could go either way: "a figure and what it counts" is a generic pattern,
      but only the cover uses it. Revisit if a second page needs one.
- [ ] `/design/`'s component index is four raw anchors, because it is a grouped
      navigation with an active state and no system component covers that.
      Inventing one for a single use is the mistake the audit just undid, so it
      stays raw until a second page needs the same thing.
- [ ] `mobile` still does not run in CI: add `--project=mobile` to
      `.github/workflows/deploy.yml`.
