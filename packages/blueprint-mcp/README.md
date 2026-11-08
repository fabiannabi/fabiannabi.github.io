# @fabiannabi/blueprint-mcp

An [MCP](https://modelcontextprotocol.io) server that makes the **Blueprint** design system legible to
coding agents. An agent writing UI can ask which component to use, which token means "error text",
whether a colour pair passes WCAG, and whether the code it just wrote is on-system — and get the same
answers the docs page gives, because both read the same source.

## Tools

| Tool | What it answers |
|---|---|
| `list_components` | Every component with its category and a one-line summary, plus the system's rules |
| `get_component` | Props with their allowed values, anatomy, accessibility guarantees, do / don't, import path |
| `find_token` | The token for an intent — `"error text"`, `"card background"`, `"color de error"`. Semantic tokens always outrank primitives |
| `check_contrast` | WCAG 2.2 contrast for two tokens or hex colours in a theme: 1.4.3 text, 1.4.11 UI edges, 1.4.6 AAA |
| `lint_ui` | Raw colours, primitive or unknown tokens, bare spacing, unknown props, invalid prop values, icon-only controls without a label — each with a suggested fix |

All tools are read-only. A `blueprint://rules` resource lists the rules every consumer follows.

```text
lint_ui  <Button variant="primary" iconOnly />  ·  style={{ padding: 12, color: "#e11d48" }}

L4  error    raw-colour          #e11d48 — colours come from tokens.        → var(--ds-danger)
L4  warning  bare-spacing        padding: 12 uses a bare value.             → var(--ds-space-4) (12px)
L5  error    invalid-prop-value  <Button variant="primary"> — not valid.    → "solid", "outline", "ghost", "danger"
L5  error    icon-only-label     <Button iconOnly> has no accessible name.  → add aria-label
```

## Where the answers come from

`packages/blueprint/scripts/build-manifest.mjs` turns the system into data: it loads the typed docs
registry (the same objects the docs page renders) and reads the three token layers, keeping the
comment above each token as its "what it is for". The server ships that `manifest.json` inside its
`dist`, so the package is self-contained.

## Use it

Claude Code:

```bash
claude mcp add blueprint -- npx -y @fabiannabi/blueprint-mcp@0.1.0
```

Any MCP client (Cursor, Windsurf, Claude Desktop):

```json
{ "mcpServers": { "blueprint": { "command": "npx", "args": ["-y", "@fabiannabi/blueprint-mcp@0.1.0"] } } }
```

Pinning the version means a new release only reaches you when you choose it.

The linter also runs without MCP — in CI, or as an eval grader:

```bash
npx @fabiannabi/blueprint-mcp lint src/Toolbar.tsx   # JSON report, exit 1 on errors
```

From this repo, `pnpm build:mcp` at the root builds it and `node packages/blueprint-mcp/dist/cli.js` runs it.

## Security

Read-only by construction: the server answers from its bundled manifest and never touches files,
the network or a shell, and never runs the code it lints. Inputs are size-bounded and the scanners are
tested against worst-case input. Releases come only from GitHub Actions through npm trusted publishing,
with provenance. See [SECURITY.md](SECURITY.md).

## Tests

`pnpm test` at the root regenerates the manifest and runs the suite, which includes a real MCP
client talking to the server over an in-memory transport.
