/**
 * What the /mcp/ page says, kept out of the JSX. The tool list mirrors
 * packages/blueprint-mcp/src/server.ts; the before/after samples are real lint
 * output from the published package.
 */
export const PACKAGE = "@fabiannabi/blueprint-mcp";
export const VERSION = "0.1.2";
export const REPO = "https://github.com/fabiannabi/fabiannabi.github.io";

export const LINKS = {
  npm: `https://www.npmjs.com/package/${PACKAGE}`,
  source: `${REPO}/tree/main/packages/blueprint-mcp`,
  security: `${REPO}/blob/main/packages/blueprint-mcp/SECURITY.md`,
  docs: "/design/",
  storybook: "/storybook/",
} as const;

/** What an agent gets wrong when it writes UI without the system in reach. */
export const PROBLEMS: readonly string[] = [
  "Invents colours — #e11d48 instead of the token that means “error”.",
  "Passes values that do not exist — variant=\"primary\" on a Button whose variants are solid, outline, ghost and danger.",
  "Forgets accessibility — an icon-only button with no accessible name.",
  "Rebuilds a component the system already has, so the two drift apart.",
];

export const BEFORE = `<Button
  style={{ background: "#e11d48", padding: 12 }}
  iconOnly
  icon={<TrashIcon />}
  variant="primary"
  onClick={remove}
/>`;

/** Real output of `blueprint-mcp lint` on BEFORE, shortened to one line each. */
export const LINT = `L1  error    invalid-prop-value  variant="primary" is not valid  → solid, outline, ghost, danger
L1  error    icon-only-label     iconOnly with no aria-label     → add aria-label="…"
L2  error    raw-colour          raw colour #e11d48              → var(--ds-danger)
L2  warning  bare-spacing        padding: 12 is a bare value     → var(--ds-space-4)`;

export const AFTER = `import { Button }
  from "@fabiannabi/blueprint/components/Button/Button";

<Button
  variant="danger"
  iconOnly
  icon={<TrashIcon />}
  aria-label="Delete project"
  onClick={remove}
/>`;

export const TOOLS: ReadonlyArray<{ name: string; asks: string; answers: string }> = [
  {
    name: "list_components",
    asks: "What is there to use?",
    answers: "Every component with its category and a one-line summary, plus the system's rules.",
  },
  {
    name: "get_component",
    asks: "How do I use Button?",
    answers: "Props and their allowed values, anatomy, accessibility guarantees, do and don't, the import path.",
  },
  {
    name: "find_token",
    asks: "Which token is error text?",
    answers: "The semantic token for an intent, in English or Spanish. Semantic tokens always outrank primitives.",
  },
  {
    name: "check_contrast",
    asks: "Does this text pass on this background?",
    answers: "The WCAG 2.2 ratio for two tokens or colours, per theme: text, UI edges and AAA.",
  },
  {
    name: "lint_ui",
    asks: "Is what I wrote on-system?",
    answers: "Raw colours, primitive or unknown tokens, bare spacing, invalid props, unlabelled icon buttons — each with the fix.",
  },
];

export const USES: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Build screens",
    body: "The main use. An agent asked for a settings page reads the catalogue, picks components and tokens, and lints its answer before handing it back.",
  },
  {
    title: "Audit what exists",
    body: "The linter runs without MCP too, so it can gate CI. Run over this site, it found three components whose docs had fallen behind their code — an agent would have been told the wrong API.",
  },
  {
    title: "Start a new component",
    body: "find_token and check_contrast help choose the colours and spacing for something new. The component itself is still written by a person, or by an agent, in the package.",
  },
];

export const LIMITS: readonly string[] = [
  "It does not generate components or screens. The agent writes the code; the MCP tells it what is true.",
  "It does not edit files, open the network or run anything. Every tool is read-only.",
  "It only knows Blueprint. It is a pattern any design system can copy, not a general UI linter.",
];

export const SAFETY: readonly string[] = [
  "Answers come from a manifest bundled in the package, generated from the same registry this site's docs render.",
  "Inputs are size-bounded and the scanners are tested against worst-case input; probing found and fixed two hangs.",
  "Everything a model can read is scanned for prompt injection, and the tool surface is pinned so it cannot change silently.",
  "Released only from CI with npm provenance, and each version is approved by hand with a security key.",
];

export const INSTALL = {
  claudeCode: `claude mcp add blueprint -- npx -y ${PACKAGE}@${VERSION}`,
  client: `{
  "mcpServers": {
    "blueprint": {
      "command": "npx",
      "args": ["-y", "${PACKAGE}@${VERSION}"]
    }
  }
}`,
  ci: `npx ${PACKAGE}@${VERSION} lint src/Settings.tsx`,
} as const;
