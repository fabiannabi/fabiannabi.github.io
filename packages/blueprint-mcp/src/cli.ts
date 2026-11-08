#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { lintUi } from "./lint.js";
import { loadManifest } from "./manifest.js";
import { createBlueprintServer, LIMITS } from "./server.js";

/**
 *   blueprint-mcp              run the MCP server over stdio
 *   blueprint-mcp lint <file>  print the lint report as JSON (exit 1 on errors) —
 *                              the same check, usable in CI or as an eval grader
 */
const here = dirname(fileURLToPath(import.meta.url));
const manifest = loadManifest(process.env.BLUEPRINT_MANIFEST ?? join(here, "manifest.json"));
const { version } = JSON.parse(readFileSync(join(here, "..", "package.json"), "utf8")) as { version: string };

const [command, file] = process.argv.slice(2);
if (command === "--version" || command === "-v") {
  console.log(version);
} else if (command === "lint") {
  if (!file) {
    console.error("usage: blueprint-mcp lint <file>");
    process.exit(2);
  }
  const code = readFileSync(file, "utf8");
  if (code.length > LIMITS.code) {
    console.error(`${file} is over ${LIMITS.code} characters; lint it in parts.`);
    process.exit(2);
  }
  const report = lintUi(manifest, code);
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.errors ? 1 : 0);
} else {
  const server = createBlueprintServer(manifest, version);
  await server.connect(new StdioServerTransport());
}
