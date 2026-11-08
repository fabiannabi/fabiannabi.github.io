# Security

## What the server can do

Nothing outside its own data. Every tool is read-only and answers from the `manifest.json` bundled in
the package. The server does not read or write files, open network connections, run commands or
evaluate the code it is given — `lint_ui` scans it as text.

Inputs are bounded (names 100 characters, intents 200, colours 64, code 200,000), so an agent — or a
prompt injected into one — cannot stall it with huge inputs. The scanners are tested against
worst-case input at those sizes. Errors never echo more than 60 characters of what was sent, and
`lint_ui` lists at most 200 findings (the counts stay exact), so a pathological file cannot flood an
agent's context.

These limits were found by probing the running server over stdio with hostile input — path traversal,
prototype keys, type confusion, malformed JSON-RPC, a 10 MB message, 500 concurrent calls and linter
worst cases. The probe found an unclosed attribute quote that looped forever and unclosed tags that
made the scan quadratic; both are fixed and covered by tests.

The CLI's `lint <file>` reads the one file you name, with the same size limit.

## Prompt injection and rug pulls

Component guidance and token comments come from the docs, and they reach agents through this server.
`src/security.test.ts` therefore scans every string a model can read — the server instructions, each
tool's name, description and schema, the rules resource and the whole manifest — for the shapes of
published MCP attacks: hidden `<IMPORTANT>` blocks, "ignore previous instructions", requests to hide
things from the user or to read credentials (`~/.ssh`, `.env`, `mcp.json`), tool shadowing, role
markers, shell commands, unknown URLs, encoded blobs and invisible Unicode (ASCII smuggling). The
scanner is itself tested against those attacks before it is trusted to pass the docs.

The agent-facing surface is pinned in `tool-surface.snap.json`. Any change to a tool, the instructions
or the resources fails the build until the snapshot is reviewed and updated on purpose, so what a
client approved cannot drift between releases.

## How releases are made

- Released only from GitHub Actions on a `blueprint-mcp-v*` tag, through npm trusted publishing:
  no npm token exists in the repository, and each version has a provenance statement you can verify
  on npmjs.com or with `npm audit signatures`.
- The workflow can only *stage* a version. It goes live when the maintainer approves it on npmjs.com
  with a hardware security key, so a compromised GitHub account or workflow cannot ship on its own.
- Before publishing, the job runs every test, `pnpm audit`, the stdio probe (`scripts/probe.mjs`, 36
  hostile inputs) and a tarball check (`scripts/check-pack.mjs`: exact file list, no install hooks,
  no secrets, no local paths).
- The workflow is linted with [zizmor](https://docs.zizmor.sh): actions are pinned to commit SHAs,
  permissions are per job, the release job has no dependency cache and installs nothing ad hoc, and
  checkout does not keep credentials.
- The workspace only resolves dependency versions at least 3 days old, rejects a package whose
  provenance disappears between versions (`trustPolicy: no-downgrade`), and allows registry-only
  transitive dependencies.
- No install scripts. Two runtime dependencies, pinned to exact versions.
- The published tarball contains only `dist/`, `README.md`, `SECURITY.md`, `LICENSE` and `package.json`.

Pin a version when you configure the server, for example `npx -y @fabiannabi/blueprint-mcp@0.1.1`, so
a new release only reaches you when you choose it.

## Reporting a vulnerability

Open a private security advisory on
[github.com/fabiannabi/fabiannabi.github.io](https://github.com/fabiannabi/fabiannabi.github.io/security/advisories/new).
Please do not open a public issue.
