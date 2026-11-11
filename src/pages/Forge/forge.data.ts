/**
 * What the /forge/ case study says, kept out of the JSX.
 *
 * Every number comes from Forge's own run log (its SQLite store, `forge` repo,
 * `/api/runs`) as of 10 November 2026, for frontscan: the public repo Forge's
 * dev loop builds. Forge itself is private; frontscan's issues and pull requests
 * are public, so each row below can be checked against GitHub. Never round a
 * cost up or a loop down: when the log changes, change these.
 */
export const FRONTSCAN = "https://github.com/fabiannabi/frontscan";

export const LINKS = {
  frontscan: FRONTSCAN,
  frontscanPage: "/frontscan/",
  showcase: "/forge/showcase/",
  design: "/design/",
  mcp: "/mcp/",
  profile: "/profile/",
} as const;

/** The headline figures. Each one is computed from TICKETS below. */
export const STATS: readonly { readonly value: string; readonly label: string }[] = [
  { value: "18", label: "frontscan pull requests merged, now on npm" },
  { value: "$1.17", label: "average cost per ticket, plan to merge" },
  { value: "17 of 18", label: "passed the repo's checks on the agent's first try" },
  { value: "0", label: "tickets I sent back after the Reviewer agent's pass" },
];

/**
 * The calls I made, each with what I did not do and what it costs. This is the
 * part an agent did not decide: the platform's shape is mine.
 */
export const DECISIONS: readonly { readonly choice: string; readonly instead: string; readonly why: string; readonly cost: string }[] = [
  {
    choice: "A fresh container for every step",
    instead: "One long-running agent session per ticket",
    why: "Each step gets only the access and budget it needs, and nothing it did leaks into the next.",
    cost: "No memory between steps: every prompt carries the issue, the plan and my answers explicitly.",
  },
  {
    choice: "The key outside the container, added by a proxy",
    instead: "Passing the API key to the agent",
    why: "An agent tricked into printing its environment finds a placeholder.",
    cost: "One more service to run, and every model call goes through it.",
  },
  {
    choice: "My own orchestration in Python",
    instead: "An agent framework",
    why: "Steps that touch GitHub or the vault are plain code, not a model's choice, and I control every boundary.",
    cost: "More code to maintain than wiring up a framework.",
  },
  {
    choice: "Polling GitHub every minute",
    instead: "Webhooks",
    why: "My machine is never reachable from the internet.",
    cost: "Up to a minute before Forge notices a label or a comment.",
  },
];

/** Why frontscan, of all things: it is the design-systems problem I work on. */
export const WHY_FRONTSCAN =
  "frontscan measures how a team adopts its design system: colours that skip the tokens, which components and props get used. That is the problem I work on in design systems, so it was the repo I wanted agents to build.";

/**
 * How a ticket moves, in three phases. Each step is a few words, because people
 * scan a flow rather than read it; `human` marks the three points where a person
 * decides. "You" is the maintainer.
 */
export type Step = { readonly who: string; readonly title: string; readonly detail: string; readonly human?: boolean };
export const PHASES: readonly { readonly name: string; readonly steps: readonly Step[] }[] = [
  {
    name: "Plan",
    steps: [
      { who: "You", title: "Write an idea", detail: "One line in an Obsidian note.", human: true },
      { who: "Planner", title: "Writes the ticket", detail: "Files, criteria, tests, a default for every decision." },
      { who: "You", title: "Approve the plan", detail: "Edit it, mark it ready.", human: true },
      { who: "Advisor", title: "Opens the issue", detail: "Your comments rewrite the plan." },
    ],
  },
  {
    name: "Build",
    steps: [
      { who: "Implementer", title: "Writes the code", detail: "Sealed container, until the checks pass." },
      { who: "Forge", title: "Opens the PR", detail: "Scans the diff for secrets first." },
      { who: "Reviewer", title: "Reviews it", detail: "Can send it back." },
      { who: "You", title: "Merge, or don't", detail: "Forge never merges.", human: true },
    ],
  },
  {
    name: "Learn",
    steps: [
      { who: "Retro", title: "Proposes lessons", detail: "At most three, from what went round." },
      { who: "You", title: "Approve them", detail: "Only approved lessons reach a prompt.", human: true },
    ],
  },
];

/**
 * The container boundary, drawn as a diagram: what is inside with the agent, the
 * one way out, and what never comes in.
 */
export const BOUNDARY = {
  inside: ["The agent (Claude Code)", "The ticket's worktree", "A placeholder instead of the key"],
  proxy: "Adds the real key on the way out",
  out: "Model API",
  host: ["The API key", "git and the push", "GitHub"],
} as const;

/** The other rules, one short line each. */
export const RULES: readonly { readonly title: string; readonly detail: string }[] = [
  { title: "Maintainers only", detail: "Only my issue and my label start a build. Text in issues and code is data, not instructions." },
  { title: "Forbidden commands", detail: "No printing the environment, no push, no publish: rules first in every prompt, and tools Claude Code may not use." },
  { title: "A budget per ticket", detail: "Going over it stops the work." },
  { title: "Scrubbed output", detail: "Credentials and mentions are removed before anything reaches GitHub." },
];

/** One real lesson, from start to finish. */
export const LESSON = {
  problem: "On the CSS index ticket the Reviewer sent the pull request back: some tests only counted results.",
  lesson: "Every test asserts the exact output objects with toEqual, never just a count.",
  result: "The next ticket's plan asked for exact objects, and its PR passed review on the first round.",
} as const;

/**
 * Every frontscan ticket, oldest first. `plan` is rounds of the plan on the issue
 * after the first draft; `review` is rounds of the Reviewer; cost covers the whole
 * ticket (plan, issue, code, review, retrospective).
 */
export const TICKETS: readonly {
  readonly issue: number;
  readonly pr: number;
  readonly title: string;
  readonly plan: number;
  readonly review: number;
  readonly cost: string;
}[] = [
  { issue: 1, pr: 2, title: "Core contract: the types every lens shares", plan: 1, review: 1, cost: "$0.83" },
  { issue: 3, pr: 4, title: "Scan a repo into an index", plan: 1, review: 1, cost: "$1.17" },
  { issue: 5, pr: 6, title: "Index every JSX element", plan: 0, review: 1, cost: "$0.87" },
  { issue: 7, pr: 8, title: "Index every CSS declaration", plan: 0, review: 2, cost: "$1.25" },
  { issue: 9, pr: 10, title: "First rule: which components are used", plan: 0, review: 1, cost: "$0.82" },
  { issue: 11, pr: 12, title: "Which props each component gets", plan: 0, review: 1, cost: "$0.90" },
  { issue: 13, pr: 14, title: "Colours that bypass the design tokens", plan: 0, review: 1, cost: "$1.12" },
  { issue: 15, pr: 16, title: "The command, with terminal and JSON reports", plan: 0, review: 1, cost: "$0.99" },
  { issue: 17, pr: 18, title: "A terminal report a person can read", plan: 0, review: 2, cost: "$1.68" },
  { issue: 19, pr: 21, title: "A README that says what it does today", plan: 0, review: 1, cost: "$0.79" },
  { issue: 20, pr: 24, title: "Package it for npm", plan: 0, review: 2, cost: "$2.60" },
  { issue: 22, pr: 23, title: "Translucent colours at the right opacity", plan: 0, review: 1, cost: "$1.04" },
  { issue: 25, pr: 27, title: "A shareable HTML report", plan: 0, review: 2, cost: "$1.56" },
  { issue: 26, pr: 28, title: "Where each element comes from", plan: 0, review: 2, cost: "$1.35" },
  { issue: 29, pr: 30, title: "Keep the command when npm publishes", plan: 0, review: 1, cost: "$0.65" },
  { issue: 31, pr: 32, title: "Run it with npm, pnpm or Yarn", plan: 0, review: 1, cost: "$0.77" },
  { issue: 34, pr: 36, title: "Design system through tsconfig aliases", plan: 0, review: 1, cost: "$1.55" },
  { issue: 33, pr: 37, title: "A design-system adoption score", plan: 0, review: 1, cost: "$1.13" },
];

/** What frontscan, built this way, did on a real open-source repo. */
export const REAL_RUN = {
  repo: "Cal.com",
  files: "6,211",
  time: "2.8 s",
  found: "177 colours written by hand outside its token files, 478 uses of its Button with 200 of them passed a className on top, and a design-system adoption of 84% of its interactive elements.",
} as const;

/**
 * The overview a reader gets in the first minute, before anything else: what I
 * did, with what, and what came of it. Recruiters often decide in about that long.
 */
export const OVERVIEW = {
  role: "I designed Forge and built it with Claude Code, on my own time. Its agents wrote frontscan; I planned every ticket and merged every pull request.",
  outcome: "18 merged pull requests on a public repo, about $1.17 each, every one reviewed by an agent and then by me. The result is on npm: npx frontscan .",
  stack: ["Python", "FastAPI", "SQLite", "Docker", "Claude Code", "GitHub", "Obsidian", "React", "Blueprint"],
} as const;

/**
 * What real runs broke, and what changed because of it. Said plainly: the
 * iteration is the interesting part, and a case study that only lists wins is
 * an advert.
 */
export const FOUND: readonly { readonly problem: string; readonly fix: string }[] = [
  {
    problem: "An agent wrote tests it could not run: its container and the setup container had different Node and system libraries.",
    fix: "Both now start from the same image, and the agent runs the repo's checks itself before it hands over.",
  },
  {
    problem: "Agents wrote what they learned straight into memory, and one note stayed wrong long after the fix.",
    fix: "A Retro agent proposes lessons and nothing reaches a prompt until I approve it.",
  },
  {
    problem: "The first plans left open questions for me to answer on every issue.",
    fix: "A Planner proposes a default for every decision, so I only change the ones I disagree with.",
  },
  {
    problem: "Packaging frontscan for npm moved a dependency, and every sealed check failed: with no network, pnpm could not reinstall, and the agent was not allowed to.",
    fix: "Forge itself now resyncs dependencies offline from what setup downloaded, before the checks. It took three builds to find where pnpm 11 keeps its store and metadata.",
  },
];

/** What comes next. */
export const NEXT: readonly string[] = [
  "An eval suite for the dev loop's own agents, so a prompt or model change that makes them worse is caught before a ticket.",
  "A live trace of every step an agent takes, for the observability a production harness needs.",
  "Running as a service that resumes after a restart, instead of a loop on one machine, with tickets that touch different files built in parallel.",
];
