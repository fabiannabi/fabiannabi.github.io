/**
 * What the /frontscan/ page says, kept out of the JSX.
 *
 * Every figure comes from running frontscan's own CLI (`pnpm frontscan <path>`,
 * main at 166b211, and checked again with `npx frontscan@0.1.0`) on 10 November 2026 against the commit of each repo named
 * below, on the author's laptop. Re-run before changing a number: never round a
 * count or a time to look better.
 */
export const REPO = "https://github.com/fabiannabi/frontscan";

export const LINKS = {
  repo: REPO,
  readme: `${REPO}#readme`,
  forge: "/forge/",
  design: "/design/",
} as const;

/** How to run it: on npm since 0.1.0 (11 November 2026), nothing to install first. */
export const NPM = "https://www.npmjs.com/package/frontscan";
export const RUN = [
  "npx frontscan .                       # the readable summary",
  "npx frontscan . --html report.html    # one file with everything, to share",
  "npx frontscan . --json                # every finding, for scripts and CI",
] as const;

/** What one scan reports. */
export const FINDS: readonly { readonly title: string; readonly detail: string }[] = [
  {
    title: "Colours that skip the tokens",
    detail:
      "Every hex, rgb and hsl written by hand in CSS or an inline style, outside the token files. Each one gets a suggestion: the nearest token, and how far its colour is (ΔE).",
  },
  {
    title: "Which components get used",
    detail: "Every JSX element across the repo: how many times, in how many files. The design system's components next to the ones teams wrote themselves.",
  },
  {
    title: "Which props they get",
    detail: "For each component, every prop and its most common values. A className on a design-system Button is a team working around it.",
  },
];

/** Real runs on public repos, at a fixed commit so anyone can check them. */
export type Run = {
  readonly repo: string;
  readonly url: string;
  readonly commit: string;
  readonly files: string;
  readonly time: string;
  readonly colours: number;
  readonly components: string;
  readonly note: string;
};
export const RUNS: readonly Run[] = [
  {
    repo: "Cal.com",
    url: "https://github.com/calcom/cal.com/tree/2eb48eccd8aca8a0c0ffabf28cf92e298b33ecee",
    commit: "2eb48ec",
    files: "6,211",
    time: "2.8 s",
    colours: 177,
    components: "1,391",
    note: "Its Button is used 478 times, and 200 of those also pass a className.",
  },
  {
    repo: "Excalidraw",
    url: "https://github.com/excalidraw/excalidraw/tree/701b901a0f1ba3d0b390d9cdf63d112e25abac4b",
    commit: "701b901",
    files: "1,040",
    time: "1.2 s",
    colours: 78,
    components: "418",
    note: "Its own Excalidraw component is used 371 times in 85 files, 152 of them with handleKeyboardGlobally.",
  },
];

/** A real excerpt of the terminal report on Cal.com, trimmed where it says "…". */
export const SAMPLE = `calcom  ·  6211 files  ·  2.8s

area           errors  warnings  info
design-system       0       177  5446

To fix

census/raw-colour · warning · 177
  apps/web/components/AddToHomescreen.tsx:18
  Raw colour \`#2F333D\` in \`background\` bypasses the design tokens.
    → Use the nearest token \`var(--cal-bg-brand-emphasis)\` (ΔE 5.8).
  … and 176 more

Components

component     uses  files
Button         478    228
SkeletonText   182     46
Badge          127     59
…

Button (478 uses)
  prop       uses  top values
  color       342  "secondary" (173), "minimal" (82), "primary" (64)
  className   200  "me-2 ms-2" (8), "justify-center" (6), …`;

/**
 * The roadmap, in four stages. Each item is an idea note in the Forge vault
 * (`Tickets/P1 …` to `Tickets/P5 …`); a stage is a priority band, so nothing
 * here has a date. When one ships, it leaves this list.
 */
export type Stage = { readonly name: string; readonly goal: string; readonly items: readonly string[] };
export const ROADMAP: readonly Stage[] = [
  {
    name: "Shipped",
    goal: "Easy to run, and right",
    items: [
      "On npm: npx frontscan . with nothing to clone",
      "A shareable HTML report, nothing cut",
      "Colours with transparency matched only at the same opacity",
      "Every JSX element tagged design system, local, external or HTML, from its imports",
    ],
  },
  {
    name: "Now",
    goal: "Measure adoption",
    items: [
      "An adoption score: how much of the interactive UI uses the design system",
      "Design-system components forced with className or style",
      "Plain HTML where the system has a component",
      "Hand-written spacing, type, radii and shadows, and Tailwind arbitrary values",
      "A CI mode with a baseline: a pull request fails only on what it adds",
    ],
  },
  {
    name: "Later",
    goal: "Suggest the fix",
    items: [
      "A token scale proposed from the loose values: these 23 greys are 5",
      "API changes from real usage: a default, a variant nobody uses",
      "Near-duplicate components, and repeated markup that wants to be one",
      "Patches to review, never applied on their own",
      "A score and its trend, sprint to sprint",
    ],
  },
  {
    name: "Beyond",
    goal: "Where teams already work",
    items: [
      "A GitHub Action that comments on each pull request",
      "An MCP server, so coding agents check their own UI",
      "One report across all of an organisation's repos",
      "Findings turned into tickets for Forge's agents",
      "More lenses: accessibility, internationalisation, agent readiness, security, performance",
    ],
  },
];

/** How it was built: the part that makes it a portfolio piece. */
export const BUILT = {
  line: "Every line of frontscan was written by agents in Forge, my agent platform: 18 pull requests, about $1.17 each, each one reviewed by an agent and then by me.",
} as const;
