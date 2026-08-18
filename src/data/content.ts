/**
 * Every word on both pages.
 *
 * Copy lives here rather than inline in JSX for two reasons: editing the CV is
 * then a data change, and the word-count ceilings in CLAUDE.md are testable
 * (see src/__tests__/conventions.test.ts) instead of aspirational.
 *
 * Rule that outranks the rest: never invent a metric. Salesloft code is private,
 * so the work is described honestly without numbers rather than with made-up ones.
 */

export const identity = {
  name: "Fabián Alcalá",
  role: "User Interface Engineer",
  company: "Salesloft",
  location: "Guadalajara, MX",
  coverRole: "User Interface Engineer · Salesloft · Guadalajara, MX",
  status: "Open to lead roles",
  statusWithLocation: "Open to lead roles · Guadalajara, MX",
  tagline: "I build design systems other teams actually adopt — accessible, localized, documented.",
} as const;

export const links = {
  email: "mailto:fabian_alcala@outlook.com",
  linkedin: "https://www.linkedin.com/in/fabianalcala/",
  github: "https://github.com/fabiannabi",
  profile: "/profile/",
  design: "/design/",
  cover: "/",
} as const;

/* ---------------------------------------------------------------- cover ---- */

/**
 * The rotating slot. `headlineSentence` is what a screen reader gets — the full
 * claim, every term, in one grammatical sentence. Without it the rotation
 * announces "I build the other teams build on."
 */
export const headline = {
  before: "I build the",
  after: "other teams build on.",
  rotating: [
    "design systems",
    "component APIs",
    "accessibility baselines",
    "release pipelines",
    "translation workflows",
  ],
  sentence:
    "I build the design systems, component APIs, accessibility baselines, release pipelines and translation workflows other teams build on.",
} as const;

export const coverSub = {
  lead: "Six years in software.",
  emphasis:
    "Components, accessibility, localization and the telemetry that proves any of it is being used",
  tail: "— shipped as semver packages from a pnpm monorepo, built with AI in the loop and verified without it.",
} as const;

export type Stat = { readonly value: string; readonly label: string };

export const stats: readonly Stat[] = [
  { value: "6 years", label: "in software" },
  { value: "14 months", label: "associate → engineer" },
  { value: "WCAG 2.2", label: "baseline I own" },
] as const;

export const stack: readonly string[] = [
  "React",
  "TypeScript",
  "CSS Modules",
  "Storybook",
  "Playwright",
  "axe-core",
  "Lighthouse CI",
  "WCAG 2.2",
  "pnpm monorepo",
  "SemVer",
  "GitHub Actions",
  "ESLint",
  "Smartling",
  "i18n / RTL",
  "Mixpanel",
  "RudderStack",
  "Pendo",
  "LaunchDarkly",
  "Native web APIs",
  "AI-assisted workflows",
  "Codemods",
] as const;

/* -------------------------------------------------------------- profile ---- */

export type Section = { readonly id: string; readonly label: string };

export const sections: readonly Section[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "writing", label: "Writing" },
] as const;

/**
 * A paragraph is `[plain, strong, plain, ...]` — odd indices render as <strong>.
 * Encoding emphasis as structure keeps markup out of the content module without
 * reaching for dangerouslySetInnerHTML.
 */
export type RichParagraph = readonly string[];

export const about: readonly RichParagraph[] = [
  [
    "I work on the layer other teams build on: ",
    "design systems, accessibility, and the platform underneath them.",
    " Currently a User Interface Engineer at Salesloft, where our design system lives in a pnpm monorepo and ships to other teams as semver packages — so every change I make is someone else's upgrade, and a major is a decision I have to defend.",
  ],
  [
    "A design system is more than its components. ",
    "I instrument ours with Mixpanel, so adoption is a number instead of an opinion",
    " — which component is actually used, by which team, and which one nobody ever imported. The translation pipeline runs on GitHub Actions into Smartling, so shipping a new locale is a workflow rather than a project.",
  ],
  [
    "The rest of my week is review: reading other teams' feature work and catching the accessibility and API problems early. When the same mistake shows up twice, it becomes a lint rule — ",
    "a convention nobody enforces is only a suggestion.",
  ],
  [
    "The library also has to keep moving with React, TypeScript, and what the platform now does natively. The hard part was never adopting the new thing; it's keeping every consuming team aligned on it. Right now that looks like styled-components → CSS Modules.",
  ],
  [
    "I use AI hard and with a rule. Codemods, the mechanical half of a migration, scaffolding stories and specs, getting to a working model of an unfamiliar codebase in an afternoon — all delegated. What I never delegate is ARIA semantics, anything that becomes public API of the design system, or a performance claim. ",
    "Models are excellent at plausible, and plausible is exactly what fails an audit.",
  ],
];

/** Still a placeholder. Every portfolio that lands has one human line. */
export const personalLine = {
  text: "Outside work — one honest personal line goes here.",
  hint: "Replace with something true: hobbies, family, weekends. Every portfolio that lands has one human line.",
  isPlaceholder: true,
} as const;

export type Entry = {
  readonly when: string;
  readonly title: string;
  readonly org?: string;
  readonly note?: string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly badge?: string;
};

export const experience: readonly Entry[] = [
  {
    when: "2023 — Present",
    title: "User Interface Engineer",
    org: "Salesloft",
    note: "Promoted from Associate UI Engineer in 14 months",
    description:
      "Build and maintain the components the whole product is assembled from, in a pnpm monorepo consumed as versioned packages. Own the pipelines around them — translation workflows, component telemetry, accessibility in CI — and review feature work across teams.",
    tags: [
      "React",
      "TypeScript",
      "CSS Modules",
      "Storybook",
      "Playwright",
      "axe-core",
      "GitHub Actions",
      "ESLint",
      "pnpm",
      "SemVer",
    ],
  },
  {
    when: "2020 — 2023",
    title: "Software Development Engineer",
    org: "MagmaLabs",
    description:
      "Client projects end to end on Ruby on Rails and React. Three years shipping to other people's deadlines — where I learned what makes a component library worth adopting.",
    tags: ["React", "Ruby on Rails", "JavaScript", "SCSS"],
  },
  {
    when: "2017 — 2020",
    title: "Microbiology Analyst",
    org: "Food industry",
    description:
      "Lab work in quality analysis. Taught myself development on nights and weekends through this period.",
  },
  {
    when: "2013 — 2017",
    title: "BSc Biochemical Engineering",
    org: "Universidad Autónoma de Aguascalientes",
  },
];

export const work: readonly Entry[] = [
  {
    when: "Salesloft",
    title: "Design system accessibility audit",
    description:
      "Went through the library component by component against WCAG 2.2, wrote the remediation plan, and put axe-core and Lighthouse in CI so regressions fail the build instead of reaching QA.",
    tags: ["WCAG 2.2", "axe-core", "Lighthouse CI"],
  },
  {
    when: "Salesloft",
    title: "Inline mentions",
    description:
      "A combobox inside a free-text editor: the popup must not steal focus, the active option must be announced, the caret must survive insertion. Built once so other teams stopped building it wrong.",
    tags: ["ARIA APG", "aria-activedescendant", "Storybook"],
  },
  {
    when: "Salesloft",
    title: "Component adoption, measured",
    description:
      "Instrumented the design system itself with Mixpanel: which components ship, to which teams, and which ones nobody imports. Deprecation stopped being an argument and became a query.",
    tags: ["Mixpanel", "TypeScript", "Telemetry"],
  },
  {
    when: "Salesloft",
    title: "Translation pipeline on GitHub Actions",
    description:
      "Strings move to Smartling and back through a workflow instead of a person. Adding a locale is a pull request, and no release waits on a translation handoff.",
    tags: ["GitHub Actions", "Smartling", "i18n", "RTL"],
  },
  {
    when: "Salesloft",
    title: "One event contract, three vendors",
    description:
      "Pendo, RudderStack and EverAfter behind a single typed track(). Adding a fourth vendor is a change in one package; removing one is a deletion, not a migration.",
    tags: ["RudderStack", "Pendo", "EverAfter", "TypeScript", "LaunchDarkly"],
  },
];

export const writing: readonly Entry[] = [
  {
    when: "Draft",
    title: "Why we left styled-components for CSS Modules",
    badge: "to publish",
    description:
      "The runtime cost, the RSC path, and the two ugly quarters of running both systems at once.",
  },
  {
    when: "Draft",
    title: "Six defects every component library audit finds",
    badge: "to publish",
    description:
      "Contrast, removed outlines, divs pretending to be buttons, unnamed icon buttons, untrapped modals, motion that ignores the user's preference.",
  },
  {
    when: "Draft",
    title: "Mentions is the hardest easy component",
    badge: "to publish",
    description: "The combobox pattern, why the virtual cursor wins, and how to test it by keyboard only.",
  },
];

export const colophon =
  "Built with React, TypeScript and CSS Modules. Every value resolves from a custom property, contrast is verified in CI rather than by eye, and the whole thing is keyboard navigable end to end. Set in Archivo, Inter and IBM Plex Mono.";
