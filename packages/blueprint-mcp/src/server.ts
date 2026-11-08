import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { findToken, getComponent, listComponents } from "./catalog.js";
import { checkContrast } from "./contrast.js";
import { lintUi } from "./lint.js";
import type { Manifest } from "./manifest.js";

const json = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] });
const fail = (message: string) => ({ content: [{ type: "text" as const, text: message }], isError: true });
const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

/**
 * Input caps. The server only reads its bundled manifest — no file system, network or shell — so the
 * remaining risk is an agent (or a prompt injected into one) sending huge inputs to stall it.
 * Bounds keep every tool fast, and nothing a caller sends is ever executed.
 */
export const LIMITS = { name: 100, intent: 200, colour: 64, code: 200_000 } as const;
const quote = (s: string) => JSON.stringify(s.length > 60 ? `${s.slice(0, 60)}…` : s);

/**
 * Blueprint as an MCP server. Every tool is read-only and answers from the
 * manifest, so an agent gets the same answer the docs page would give.
 */
export function createBlueprintServer(m: Manifest, version = "0.1.0"): McpServer {
  const server = new McpServer(
    { name: "blueprint", version },
    {
      instructions:
        "Blueprint is an accessible React design system. Before writing UI: call list_components / get_component to use an " +
        "existing component, find_token for every colour, space or radius (never raw values or primitive tokens), " +
        "check_contrast for any new colour pairing, and run lint_ui on the code you wrote before returning it.",
    },
  );

  server.registerTool(
    "list_components",
    { title: "List components", description: "Every Blueprint component with its category and a one-line summary.", annotations: READ_ONLY },
    async () => json({ components: listComponents(m), rules: m.rules }),
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a component",
      description: "Props (with allowed values), anatomy, accessibility guarantees, do / don't guidance and the import path for one component.",
      inputSchema: { name: z.string().max(LIMITS.name).describe('Component name or slug, e.g. "Button"') },
      annotations: READ_ONLY,
    },
    async ({ name }) => {
      const c = getComponent(m, name);
      return c ? json(c) : fail(`No component ${quote(name)}. Available: ${m.components.map((x) => x.name).join(", ")}`);
    },
  );

  server.registerTool(
    "find_token",
    {
      title: "Find a token",
      description:
        'The token for an intent, e.g. "error text", "card background", "espacio entre secciones". Semantic tokens rank first; primitives are only for the semantic layer itself.',
      inputSchema: {
        intent: z.string().max(LIMITS.intent).describe("What the value is for, in English or Spanish"),
        limit: z.number().int().min(1).max(20).optional(),
      },
      annotations: READ_ONLY,
    },
    async ({ intent, limit }) => {
      const matches = findToken(m, intent, limit ?? 5);
      return matches.length
        ? json({ intent, matches: matches.map(({ score: _s, ...t }) => ({ ...t, use: `var(${t.name})` })) })
        : fail(`No token matches ${quote(intent)}. Try words like text, surface, border, accent, danger, space, radius.`);
    },
  );

  server.registerTool(
    "check_contrast",
    {
      title: "Check contrast",
      description: "WCAG 2.2 contrast between two colours — token names or hex — in a theme. Reports 1.4.3 (text), 1.4.11 (UI edges) and 1.4.6 (AAA).",
      inputSchema: {
        foreground: z.string().max(LIMITS.colour).describe('Token (e.g. "--ds-text-muted") or hex'),
        background: z.string().max(LIMITS.colour).describe('Token (e.g. "--ds-surface-raised") or hex'),
        theme: z.enum(["dark", "light"]).optional(),
      },
      annotations: READ_ONLY,
    },
    async ({ foreground, background, theme }) => {
      try {
        return json(checkContrast(m, foreground, background, theme ?? "dark"));
      } catch (e) {
        return fail((e as Error).message);
      }
    },
  );

  server.registerTool(
    "lint_ui",
    {
      title: "Lint UI code",
      description:
        "Checks TSX/JSX/CSS against Blueprint: raw colours, primitive or unknown tokens, bare spacing, unknown props, invalid prop values and icon-only controls without a label. Returns findings with suggested fixes.",
      inputSchema: { code: z.string().max(LIMITS.code).describe("The UI code to check (up to 200,000 characters)") },
      annotations: READ_ONLY,
    },
    async ({ code }) => json(lintUi(m, code)),
  );

  server.registerResource(
    "rules",
    "blueprint://rules",
    { title: "Blueprint rules", description: "The rules every Blueprint consumer follows.", mimeType: "text/markdown" },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: m.rules.map((r) => `- ${r}`).join("\n") }] }),
  );

  return server;
}
