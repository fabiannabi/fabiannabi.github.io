/**
 * What the /frontscan/ page says, kept out of the JSX.
 *
 * Every figure comes from running frontscan's own CLI (`pnpm frontscan <path>`,
 * main at 166b211) on 10 November 2026 against the commit of each repo named
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

/** How to run it today. The npm package is in the dev loop; until it ships, the honest command is a clone. */
export const RUN_TODAY = [
  "git clone https://github.com/fabiannabi/frontscan",
  "cd frontscan && pnpm install",
  "pnpm frontscan ../your-app",
] as const;
export const RUN_SOON = "npx frontscan .";

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

/** What comes next, in the order it is planned. */
export const NEXT: readonly string[] = [
  "On npm, so it runs with npx frontscan . and nothing to clone.",
  "A self-contained HTML report to share with a team or attach to a pull request.",
  "A CI mode with a baseline, so a pull request fails only on what it adds.",
  "More lenses on the same scan: accessibility, internationalisation, readiness for coding agents and security.",
];

/** How it was built: the part that makes it a portfolio piece. */
export const BUILT = {
  line: "Every line of frontscan was written by agents in Forge, my agent platform: 9 pull requests, about $1.07 each, each one reviewed by an agent and then by me.",
} as const;
