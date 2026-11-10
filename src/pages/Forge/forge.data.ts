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

/** Who does what, in the order a ticket moves. "You" is the maintainer. */
export const STEPS: readonly { readonly who: string; readonly what: string }[] = [
  { who: "You", what: "Write an idea in an Obsidian note, one line is enough, and mark it draft." },
  { who: "Planner", what: "Reads the repo and rewrites the note as a ticket: goal, files to touch, acceptance criteria, tests, and a default for every decision." },
  { who: "You", what: "Edit the plan in Obsidian and mark it ready." },
  { who: "Advisor", what: "Opens the GitHub issue. Any comment you leave on it gets the plan rewritten, until you add the build label." },
  { who: "Implementer", what: "Works on its own branch in a throwaway container until the repo's own checks pass." },
  { who: "Forge", what: "Pushes, opens the pull request and scans the diff for secrets on the way out." },
  { who: "Reviewer", what: "Reviews the pull request against the issue and the repo's rules, and can send it back." },
  { who: "You", what: "Review and merge, or don't. Forge never merges." },
  { who: "Retro", what: "Reads everything that went round and proposes at most three lessons. Only the ones you approve reach a prompt." },
];

/** What keeps an agent that is wrong, or manipulated, from doing damage. */
export const SAFETY: readonly string[] = [
  "The API key never enters an agent's container. A proxy outside it adds the key; the agent holds a placeholder, so there is nothing to print or commit.",
  "The container's only way out is the model API. Installs run once, before the workspace is sealed, through a proxy that reaches the package registry and nothing else.",
  "Platform rules every agent reads first (never print the environment, never push or publish, never read outside the worktree), and a list of forbidden commands handed to Claude Code as tools it may not use.",
  "Only a maintainer's issue and a maintainer's label start a build. Text in issues, pull requests and code is data, never instructions.",
  "Every ticket has a budget. Going over it stops the work.",
  "Everything Forge posts on GitHub is scrubbed of credentials and mentions first.",
];

/** One real lesson, from start to finish. */
export const LESSON = {
  what: "Make every test in this repo assert the exact output objects with toEqual, never just a count or a subset of fields.",
  why: "On the CSS index ticket the Reviewer sent the pull request back once, because some tests only checked how many results came back.",
  after: "The next ticket's plan already asked for exact objects in every test, and its pull request went through review on the first round.",
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

export const STACK: readonly string[] = [
  "Python, FastAPI and SQLite for the orchestrator",
  "Claude Code in Docker, one container per step",
  "GitHub issues, labels and reviews as the interface",
  "Obsidian for planning and lessons",
  "React and Blueprint for the dashboard",
];

/** Said plainly, because a case study that only lists wins is an advert. */
export const LIMITS: readonly string[] = [
  "It is a personal project. It has built one real repo, by one maintainer, not a team's backlog.",
  "Its evals cover other agent teams; the dev loop's own agents do not have an eval suite yet. That is the next piece.",
  "It runs on one machine and polls GitHub every minute. It is not a hosted service.",
];
