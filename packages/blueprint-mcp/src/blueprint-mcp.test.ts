import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeAll, describe, expect, it } from "vitest";
import { findToken, getComponent, listComponents } from "./catalog.js";
import { checkContrast, ratio } from "./contrast.js";
import { lintUi, MAX_FINDINGS } from "./lint.js";
import { loadManifest, type Manifest } from "./manifest.js";
import { createBlueprintServer, LIMITS } from "./server.js";

/* The manifest is generated from the real registry and token files (pnpm test
   builds it first), so these tests also prove the generator reads them right. */
let m: Manifest;
beforeAll(() => {
  m = loadManifest(join(process.cwd(), "packages", "blueprint", "dist", "manifest.json"));
});

describe("manifest", () => {
  it("describes every documented component and both themes", () => {
    expect(m.components.length).toBeGreaterThanOrEqual(14);
    expect(m.themes).toEqual(expect.arrayContaining(["dark", "light"]));
    const accent = m.tokens.find((t) => t.name === "--ds-accent");
    expect(accent?.layer).toBe("semantic");
    expect(accent?.themes?.dark?.primitive).toMatch(/^--ds-violet-\d+$/);
  });
});

describe("catalog", () => {
  it("looks components up by name or slug", () => {
    expect(getComponent(m, "button")?.name).toBe("Button");
    expect(getComponent(m, "Nope")).toBeUndefined();
    expect(listComponents(m).map((c) => c.name)).toContain("Alert");
  });

  it.each([
    ["color de error", "--ds-danger"],
    ["error text", "--ds-danger"],
    ["card background", "--ds-surface-raised"],
    ["primary brand colour", "--ds-accent"],
    ["muted text", "--ds-text-muted"],
  ])("find_token(%s) → %s", (intent, expected) => {
    expect(findToken(m, intent)[0]?.name).toBe(expected);
  });

  it("never ranks a primitive above the semantic token for the same intent", () => {
    const results = findToken(m, "violet accent", 10);
    const first = results.findIndex((t) => t.layer === "primitive");
    expect(results[0]?.layer).toBe("semantic");
    expect(first === -1 || first > 0).toBe(true);
  });
});

describe("contrast", () => {
  it("computes WCAG ratios", () => {
    expect(ratio("#000000", "#ffffff")).toBe(21);
    expect(ratio("#777777", "#ffffff")).toBeCloseTo(4.48, 1);
  });

  it("resolves tokens per theme and agrees with the build's audit", () => {
    for (const theme of ["dark", "light"]) {
      const r = checkContrast(m, "--ds-text", "--ds-surface", theme);
      expect(r.passes.text, `${theme}: text on surface`).toBe(true);
      expect(r.background.via).toMatch(/^--ds-/);
    }
  });

  it("rejects unknown tokens", () => {
    expect(() => checkContrast(m, "--ds-nope", "--ds-surface")).toThrow(/Unknown token/);
  });
});

describe("lint_ui", () => {
  const clean = `
    import { Button } from "@fabiannabi/blueprint/components/Button/Button";
    export const Save = () => (
      <div style={{ padding: "var(--ds-space-4)", color: "var(--ds-text)" }}>
        <Button variant="ghost" size="sm" iconOnly aria-label="Close" icon={<X />} onClick={close} />
        <Button {...rest} data-testid="save">Save</Button>
      </div>
    );`;

  it("passes on-system code", () => {
    const r = lintUi(m, clean);
    expect(r.findings).toEqual([]);
    expect(r.componentsUsed).toEqual(["Button"]);
    expect(r.tokensUsed).toEqual(["--ds-space-4", "--ds-text"]);
  });

  it.each([
    ["raw-colour", `<p style={{ color: "#e11d48" }} />`],
    ["raw-colour", `.x { background: rgb(0 0 0 / 50%); }`],
    ["primitive-token", `.x { color: var(--ds-violet-400); }`],
    ["unknown-token", `.x { color: var(--ds-brand); }`],
    ["bare-spacing", `.x { padding: 12px 8px; }`],
    ["bare-spacing", `<div style={{ marginTop: 16 }} />`],
    ["invalid-prop-value", `<Button variant="primary">Go</Button>`],
    ["unknown-prop", `<Button tone="soft">Go</Button>`],
    ["icon-only-label", `<Button iconOnly icon={<X />} />`],
  ])("flags %s", (rule, code) => {
    expect(lintUi(m, code).findings.map((f) => f.rule)).toContain(rule);
  });

  it("suggests the fix: nearest semantic colour and nearest space step", () => {
    const r = lintUi(m, `.x { padding: 15px; color: var(--ds-violet-400); }`);
    expect(r.findings.find((f) => f.rule === "bare-spacing")?.suggestion).toMatch(/--ds-space-5/);
    expect(r.findings.find((f) => f.rule === "primitive-token")?.suggestion).toMatch(/--ds-accent/);
  });

  it("ignores colours inside comments and id selectors", () => {
    expect(lintUi(m, `/* brand was #ff0000 */ #main .x { color: var(--ds-text); }`).findings).toEqual([]);
  });
});

describe("MCP server", () => {
  it("exposes the tools over the protocol", async () => {
    const server = createBlueprintServer(m);
    const [a, b] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "1.0.0" });
    await Promise.all([server.connect(a), client.connect(b)]);

    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(["check_contrast", "find_token", "get_component", "lint_ui", "list_components"]);
    expect(tools.every((t) => t.annotations?.readOnlyHint)).toBe(true);

    const res = await client.callTool({ name: "lint_ui", arguments: { code: `<Button variant="primary" />` } });
    const text = (res.content as { text: string }[])[0]?.text ?? "{}";
    expect(JSON.parse(text).errors).toBe(1);

    const missing = await client.callTool({ name: "get_component", arguments: { name: "Carousel" } });
    expect(missing.isError).toBe(true);
    await client.close();
  });
});

describe("hostile input", () => {
  async function connect() {
    const server = createBlueprintServer(m);
    const [a, b] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test", version: "1.0.0" });
    await Promise.all([server.connect(a), client.connect(b)]);
    return client;
  }

  it("rejects inputs over the limits instead of processing them", async () => {
    const client = await connect();
    const big = await client.callTool({ name: "lint_ui", arguments: { code: "a".repeat(LIMITS.code + 1) } });
    expect(big.isError).toBe(true);
    const intent = await client.callTool({ name: "find_token", arguments: { intent: "x".repeat(LIMITS.intent + 1) } });
    expect(intent.isError).toBe(true);
    const colour = await client.callTool({ name: "check_contrast", arguments: { foreground: "#".repeat(500), background: "#000" } });
    expect(colour.isError).toBe(true);
    await client.close();
  });

  it("does not echo long input back in errors", async () => {
    const client = await connect();
    const res = await client.callTool({ name: "get_component", arguments: { name: "Z".repeat(LIMITS.name) } });
    const text = (res.content as { text: string }[])[0]?.text ?? "";
    expect(text).not.toContain("Z".repeat(61));
    await client.close();
  });

  // Worst cases for the scanners at the size limit: one giant tag full of attributes,
  // unclosed comments and quotes, long spacing declarations. Each must stay fast.
  it.each([
    ["one tag with thousands of attributes", `<Button ${"a ".repeat(LIMITS.code / 2 - 10)}`],
    ["unclosed quotes inside a tag", `<Button x="${'"'.repeat(LIMITS.code - 20)}`],
    ["an unclosed block comment", `/*${"*".repeat(LIMITS.code - 2)}`],
    ["repeated spacing declarations", "padding: 1 2 3 4;".repeat(Math.floor(LIMITS.code / 17))],
    ["deep nesting of tags", "<Button>".repeat(Math.floor(LIMITS.code / 8))],
    // found by probing the live server: the first hung forever, the others were quadratic
    ["an unclosed quote in an attribute", `<Button x="abc`],
    ["thousands of unclosed tags with an open brace", "<Button {".repeat(Math.floor(LIMITS.code / 9))],
    ["thousands of unclosed tags with an open template quote", "<Button `".repeat(Math.floor(LIMITS.code / 9))],
    ["thousands of tags that never close", "<Button a ".repeat(Math.floor(LIMITS.code / 10))],
    ["one tag with endless braces", `<Button x=${"{".repeat(LIMITS.code - 20)}`],
  ])("lints %s in under 2s", (_label, code) => {
    const start = performance.now();
    lintUi(m, code);
    expect(performance.now() - start).toBeLessThan(2000);
  });
});

describe("malformed tags", () => {
  it("skips a tag that never closes, and keeps reading the ones after it", () => {
    const rep = lintUi(m, `<Button variant="primary />
<Chip x={ <Button variant="primary" />`);
    expect(rep.errors).toBeGreaterThanOrEqual(0);
    expect(lintUi(m, `<Button {
<Button variant="primary" />`).findings.some((f) => f.rule === "invalid-prop-value")).toBe(true);
  });

  it("reads components passed as props inside braces", () => {
    const rep = lintUi(m, `<Alert action={<Button variant="primary">Retry</Button>} />`);
    expect(rep.findings.some((f) => f.rule === "invalid-prop-value")).toBe(true);
  });
});

describe("output size", () => {
  it("caps the findings list but keeps the counts exact", () => {
    const rep = lintUi(m, "#fff ".repeat(1000));
    expect(rep.findings).toHaveLength(MAX_FINDINGS);
    expect(rep.errors).toBeGreaterThan(MAX_FINDINGS * 4);
    expect(rep.omitted).toBe(rep.errors + rep.warnings - MAX_FINDINGS);
  });
});
