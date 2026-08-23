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
  how I work. ~640 words.
- `design/index.html` → `src/pages/Design` — **Blueprint**, the design system:
  fourteen components, live examples, props, accessibility notes and guidance.
  Storybook builds alongside it at `/storybook/`.

## What belongs in the system, and what does not

There are two layers of component and the line between them is the single most
load-bearing decision in this repo.

- **`src/ds`** — the system. Fourteen components, every one of them generic.
- **`src/components`** — the app. Nine, every one of them composed from the
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
2. **Two token layers, and one vocabulary.** Primitives say what a colour IS
   (`--ds-violet-400`, `--cover-pink-400`). Semantic tokens say what it is FOR
   (`--ds-accent`), and they are the only names any stylesheet outside the token
   layer may read. A theme is the same semantic names pointed at different
   primitives: `--ds-surface` is a near-black in one and a near-white in
   another, and nothing below the token layer knows which. The design system's
   primitive ramps are **generated** — edit `scripts/generate-palette.mjs` and
   re-run `pnpm palette`, never `src/ds/tokens/primitives.css` by hand.

   A component may parameterise itself with properties of its own —
   `--button-bg`, `--badge-dot`, `--beacon-halo` — defined and read inside its
   own module. That is not a third layer: nothing outside the file reads them,
   so they publish no vocabulary. It is what lets one variant change without
   touching the others.

   Three things remap the semantic layer, and none of them touches a component
   stylesheet. That is the only evidence the indirection is real:

   - `[data-ds-theme]` in `semantic.css` — light and dark on `/design/`
   - `tokens.cover.css` and `tokens.profile.css` — the site's own palettes, each
     defining its primitives and pointing `--ds-*` at them, so Blueprint's
     components wear synthwave on the cover and the profile's near-monochrome on
     the CV
   - `[data-xray]` in `blueprint.css` — the cyanotype the x-ray prints in

   Every one of them is measured by the contrast audit, and because the pages
   are themes rather than translations, the **same** `DS_CHECKS` list runs
   against all of them. A pair the system promises is re-measured in every
   palette that ships.

   **This was broken for months and the fix is what the rule above is written
   from.** The site kept a second vocabulary — `--bg`, `--ink`, `--accent`,
   `--line`, plus its own `--s1..--s9` scale — and a `tokens.ds-bridge.css`
   whose entire content was `--ds-text: var(--ink)`: the same colour with two
   names, aliased to itself. The damage was not the extra file. App components
   read one vocabulary (92 uses against 2) and the page stylesheets laying them
   out read the other (119 against 44), so two files opened side by side
   disagreed about what to call the same value — and the scales had drifted
   apart, `--s3` being 12px while `--ds-space-3` was 8px. 212 substitutions
   later there is one vocabulary, and
   `conventions.test.ts` fails the build on a `var()` that is neither `--ds-*`,
   nor `--xray-*` (the blueprint's own drawing scale, which has no semantic
   equivalent — a grid step is not a colour role), nor a property the file
   defines itself.

   A corollary worth stating: **a custom property written from JavaScript still
   has to be declared where it is read.** `RotatingHeadline` measures a width
   and `Exploded` measures a depth, and both used to exist only as a
   `setProperty` call. A `var()` whose only definition is a line of JS is a rule
   nobody can read the whole of.

   **A theme adds primitives, never semantics.** The blueprint owns
   `--xray-paper` and `--xray-line`, and remaps `--ds-surface` and
   `--ds-border-strong` onto them — it does not introduce a
   `--ds-blueprint-surface` for components to learn about. `xray.css` broke this
   for a while by reading `--xray-line` directly, which tied the drawing to one
   particular theme; it reads the semantic layer now, so the x-ray would draw
   correctly under a theme nobody has written yet.
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
7. A **Writing** section shipped for a while with three drafts and a "to publish"
badge, and came out: a CV listing things its author has not written yet spends
the reader's attention on the one part of the page with nothing behind it.
**How I work** replaced it, and what those three entries had to survive is not
repeating `about`. The obvious three — how a breaking change is negotiated, how
adoption is measured, what is and is not delegated to a model — are all in that
section already, at length. A second section restating them in a different shape
is exactly the filler the word ceiling exists to prevent, and the first draft of
this one did it three times out of three.

**Copy for the cover and profile lives in `src/data/content.ts`**; component
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

### Simulating colour vision deficiency

`src/ds/a11y/` renders the page as a dichromat sees it — protanopia,
deuteranopia, tritanopia — from the Machado, Oliveira & Fernandes (2009)
matrices at severity 1.0. The controls are on the cover, in the claim they
settle.

- **`color-interpolation-filters="linearRGB"` is not optional.** The matrices are
  defined on linear light and `feColorMatrix` defaults to sRGB. Applying them to
  gamma-encoded values produces a picture that looks plausible and is not the
  simulation — worse than no simulation, because it invites a decision. There is
  a unit test and an e2e test on the attribute.
- The filter goes on `body`, not `:root`. A filtered element becomes the
  containing block for its fixed-position descendants, and the root is where
  browsers disagree; `Glow` and the blueprint's developing sweep are both fixed.
- **The same matrices gate the build.** `audit-contrast.mjs` re-measures all 166
  non-advisory pairs through each deficiency. WCAG does not ask for this — 1.4.3
  is a luminance rule and simulation shifts luminance — but a pair that cannot
  survive deuteranomaly is a palette problem worth knowing about. All three
  currently pass, tightest 3.89 against a floor of 3.
- **It is an instrument, not an accommodation.** Nobody with protanopia needs a
  button to turn protanopia on. The button exists so the person choosing the
  colours has to look. What actually serves that reader is the page never
  resting meaning on hue — which is why the rotating slot carries an underline,
  and why there is an e2e test asserting the underline survives the simulation.

### One instrument on the cover, and it sits inside the claim it settles

The cover's controls sat in the page chrome, then moved into cards that
explained them, then came back to the chrome, and are now in the card for good.
What settled it: **a control in the chrome is a button with no sentence attached
to it**, and on this page the sentence was three hundred words further down.

The chrome version had a real answer to that objection and it still lost. An eye
docked beside the status badge previewed itself — pointing at it rendered the
whole page through a colour vision deficiency and moving away put it back — on
the theory that a control whose effect you can see without committing to it has
the page for a sentence. Two things killed it. It read as cramped no matter what
the gap said, for a reason worth keeping (see the halo, below); and once the
chips applied on press it was **a second control that started the same
simulation**, which is the duplication this repo has undone twice already, in
`ActionLink` over `Button` and `StatusPill` over `Badge`.

So the instrument row is three chips and one button.

- **A chip is a choice that takes effect.** Press Deutan and the page is
  deuteranopic. A picker that stages a value somebody then has to go and apply
  somewhere else is a form; this is an instrument.
- **"Back to normal" is the one thing the chips cannot be**, and it is live in
  both states rather than disabled in one: with a simulation running it takes it
  off, and at rest it stops the card walking the palette on its own. From the
  reader's side those are one thing — put it back the way it was — so they share
  a label and a control.

**The blueprint is not on the cover.** It draws every page as named boxes, which
is the honest way to show the site is built from the system rather than beside
it — and that is an argument for the CV and for `/design/` to make. On a cover
letter it was a second instrument competing with the only thing that page has to
sell. The cover therefore ships neither `blueprint.css` nor `xray.css` nor the
provider that measures for them.

**Nothing previews any more.** The eye was the only control that did, and the
x-ray never should have: redrawing the whole page is not a thing to do to
somebody who was scrolling past, and on touch there is no hover at all — a tap
fires `pointerenter` and then `click`, so the preview is one frame on the way to
the press that was actually meant.

`VisionState` went back to two values with it — `vision` and `choice`. It had
four: `applied` beside `vision`, and a `preview` that showed a deficiency
without committing to it, because labelling a control from the drawing rather
than from the decision is how a button ends up reading "Stop simulating" under a
cursor that has not decided anything. That distinction is only real while
something can put a deficiency on screen that nobody chose, and nothing can any
more. A catalogue entry with no caller is allowed here — `Button` and `Alert`
have none on this site — but a *distinction* with no caller is different: it is
two values that can never disagree, and the next reader has to work out why
before they can trust either.

**A halo is layout.** `Beacon` wraps a control and draws a wash disc and a pulse
around it — one pulse every nine seconds, stopping for good once the control is
hovered, focused or used. The disc reaches `--beacon-halo` past the control on
every side while the caller lays out against the button's box, so a neighbour
spaced by exactly that much lands *on* the disc: the cover's header had a label
pill, an eye and a status badge all touching, with a flex gap in the stylesheet
insisting otherwise. The overhang is `margin` now. `Beacon` carries
`data-ds-chrome` as well — wrapped around the blueprint's own switch it
otherwise drew a box labelled BEACON over the one control the mode may not hide.

It is on the profile's x-ray switch, and nowhere else. A system control that
shouted would be useless in a toolbar; shouting is a page's problem, so it lives
in a page's component.

**Nothing on a filtered page may be `position: fixed`.** An element with a
`filter` becomes the containing block for its fixed-position descendants, and
this instrument puts a filter on `body`. The eye was docked to the edge of the
page for a while, fixed, and it jumped to document coordinates the instant it
was pointed at — then oscillated: hover previews, the filter moves the dock out
from under the pointer, the pointer leaves, the preview ends, the dock returns.
Playwright reported it as "element is not stable" fifty-six times. It is the
same rule that keeps `Glow` overscanned and hides it while the simulation runs.

### The x-ray

**It is off the built site, and it is a work in progress.** Both switches are
out of the pages and the `X` shortcut is development-only, so `pnpm dev` still
has the whole mode and a visitor has no way into it. That is deliberate rather
than a deletion: the code, the stylesheets, the provider and the unit tests are
all still here and still typechecked, and `e2e/xray.spec.ts` skips the two
blocks that need the mode on — the stamps have their own block that keeps
running, because `data-ds-component` and `data-ds-local` are inert markup that
ships either way and the site's claim about being built from its own system
rides on them. Put a `Toggle` back on a page, drop the `import.meta.env.DEV`
guard in `XRayProvider`, and un-skip the file.

What follows describes the mode as it works.

Toggled by the button or the `X` key, on the profile and the design system. Not
on the cover — see above. It prints the page as
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
- **A background set on `body` with no background on the root propagates to the
  canvas, and the canvas is painted before everything — including negative
  z-index children.** The ruling used to be `body`'s own background-image, and
  nothing could be put over it: a cover element at `z-index: -1` in the paper's
  colour simply did not appear, at any z-index, because it was painting into a
  layer above something that had already been hoisted underneath the whole
  document. The ruling is a `body::after` at `position: absolute; inset: 0` now,
  which keeps it under the content and scrolling with the page, and can be
  masked.
- **Nothing in the blueprint's entrance travels.** It took three versions to
  get there and the first two are worth knowing. The ruling arrived by scaling
  `background-size` from three times the step down to one — every line on the
  page moving inward — while a band of light crossed top to bottom: two
  directions, dozens of thin high-contrast lines, inside a second, which is the
  vestibular pattern exactly. The second version fixed the directions, uncovering
  the grid left to right behind a band travelling the same axis with its bright
  edge locked to the mask's boundary. It was coherent and it was still a bright
  object crossing a drawing made of thin lines, which reads as noise against a
  grid. What ships is opacity on the ruling and a slow transition on the page's
  background colour, and nothing else.
- **Every part of the exit ends on one duration, and it is not the entrance's.**
  The frames left at `--ds-duration-slow` while the rest of the exit was still
  running, which left a third of a second of ruled paper with nothing drawn on
  it — the page reading as broken rather than the mode being put away. So they
  were all put on one number. Making that number `--xray-develop` was wrong in
  the other direction and read as slow: an entrance has something to show and
  can take its time over it, an exit is a reader saying they are done looking.
  `--xray-undevelop` is two thirds of it, and `XRayProvider`'s `LEAVE_MS` has to
  match.
- **The blueprint animates only the boxes that are on screen.** `/design/`
  instruments 599 components, and animating each one's frame, name plate and
  content box is around 1800 animations of `outline-color` and a registered
  length — none of it compositable, all of it repainting every frame. It ran the
  entrance at 25fps, with a 133ms gap in it. `XRayProvider` stamps
  `data-ds-draw` on the components intersecting the viewport when the mode is
  turned on and the animation rules require it; everything else is simply
  already drawn. 599 animated boxes became 38, and the entrance is 60fps on both
  pages. Nobody is watching a box eleven screens below the fold assemble itself,
  which is the same argument the stagger cap already made.
- **Whatever replaces the page has to arrive when the page leaves.** The ink is
  blanked in the single frame `data-xray` lands in, so giving the field colour
  the entrance's own 720ms made the page vanish: a third of a second of
  near-white paper with no text on it and a few faint lines, which reads as the
  page breaking rather than as a mode arriving. The field keeps global.css's
  fast duration on the way in and only the ruling and the frames develop over
  `--xray-develop`. On the way out it is the opposite case and does take the
  long one, because there the palette has already reverted and the blue is being
  carried away from under a page that is back.
- **A dropped frame and a discontinuity are different bugs, and only one of
  them shows up in a frame counter.** The exit was reported as choppy after the
  entrance was fixed. Measured, it dropped nothing: 54 frames in the first
  second, worst gap 17ms — cleaner than the entrance. The fault was that the
  blueprint's palette and its blanking were scoped to `[data-xray]`, so they
  applied during "leaving" as well: the drawing faded away over 480ms, left a
  blank blue page, and then the entire real page returned in the single frame
  the attribute was removed in. Both are scoped to `[data-xray="on"]` now, and
  what stays on `[data-xray]` is only what is *drawn* — so the page comes back
  when the reader asks for it and the wireframe lifts off it. Frame timings say
  nothing about this class of bug; only looking at it does.
- **Measure before optimising, including when the bug is obvious.** `measure()`
  interleaved a style write, a `getBoundingClientRect`, an attribute write and a
  `getComputedStyle` per element — textbook layout thrashing, one forced reflow
  per instrumented component, landing in the frame the mode turns on in.
  Splitting it into a read pass and a write pass is correct and it is committed.
  It also moved the number from 24 frames to 26. The cost was somewhere else
  entirely, and an afternoon could have gone into making that loop beautiful
  while the page still ran at 25fps.
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
- [ ] **Decide whether the x-ray stays at all.** It is off the built site as of
      August 2026 — both switches removed, the `X` shortcut behind
      `import.meta.env.DEV` — because the question is no longer whether the
      animation is right but whether a cover letter and a CV are served by the
      mode existing. Nothing is deleted. Two things are waiting on the answer:
      `src/components/Beacon` has no caller left, since the halo went out with
      the switch it pointed at, and `/profile/` and `/design/` still ship
      `xray.css` and `blueprint.css` — about 2.6 kB gzipped of stylesheet for a
      mode nobody can reach. Both are cheap to undo and neither is worth paying
      for a feature that comes back.
- [ ] **The blueprint's entrance is redesigned; check whether it is enough.**
      Nothing travels any more: the ruling fades in on opacity, the page's blue
      arrives on a 720ms transition, and the band of light that used to cross
      the viewport is gone. The exit is the same fade in reverse, every part of
      it ending on one duration. What still animates is each component's frame
      drawing itself in place, staggered — no translation, which is the part
      that moves people, so it is a different thing from what this note was
      about. Worth watching rather than fixing blind.

      One asymmetry left on purpose: the last step of the exit — paper going
      back to page — takes `--dur-fast` rather than the exit's own duration,
      because a transition is defined by the after-change style and the
      attribute the slow rule needs is gone by then. Making it symmetrical means
      scoping the whole remap to `[data-xray="on"]` and giving "leaving" a
      palette of its own.

      `prefers-reduced-motion` is honoured and is not a defence: it covers the
      reader who already configured their OS, not the one who simply gets dizzy.
      /lab/'s exploded view is the other shape this could take — one axis,
      staggered by depth, over 900ms, starting separated under reduced motion
      rather than animating faster.
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
