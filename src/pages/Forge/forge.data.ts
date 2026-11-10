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
  showcase: "/forge/showcase/",
  mcp: "/mcp/",
  profile: "/profile/",
} as const;

/** The headline figures. Each one is computed from TICKETS below. */
export const STATS: readonly { readonly value: string; readonly label: string }[] = [
  { value: "9 of 9", label: "frontscan pull requests merged" },
  { value: "$1.07", label: "average cost per ticket, plan to merge" },
  { value: "9 of 9", label: "passed the repo's checks on the agent's first try" },
  { value: "0", label: "times I had to ask an agent for changes" },
];

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
];

/** What frontscan, built this way, did on a real open-source repo. */
export const REAL_RUN = {
  repo: "Cal.com",
  files: "6,211",
  time: "2.8 s",
  found: "177 colours written by hand outside its token files, and 478 uses of its Button, 200 of them passed a className on top.",
} as const;

/** What it is made of, as labels: what does what is in the boundary diagram. */
export const STACK: readonly string[] = [
  "Python", "FastAPI", "SQLite", "Docker", "Claude Code", "GitHub", "Obsidian", "React", "Blueprint",
];

/** Said plainly, because a case study that only lists wins is an advert. */
export const LIMITS: readonly string[] = [
  "A personal project: one real repo, one maintainer.",
  "The dev loop's own agents have no eval suite yet. That is next.",
  "One machine, polling GitHub every minute. Not a hosted service.",
];
