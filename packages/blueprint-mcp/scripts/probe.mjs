// Adversarial probe of the built server over real stdio, the way an agent host talks to it.
// Each call has a timeout. Fails (exit 1) if any probe hangs, crashes the process, or if
// something that must be refused gets an answer.
//   node scripts/probe.mjs [dist/cli.js]
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

const CLI = process.argv[2] ?? fileURLToPath(new URL("../dist/cli.js", import.meta.url));
let proc, rl, nextId = 1;
const pending = new Map();

function start() {
  proc = spawn(process.execPath, [CLI], { stdio: ["pipe", "pipe", "pipe"] });
  rl = createInterface({ input: proc.stdout });
  rl.on("line", (l) => {
    let msg; try { msg = JSON.parse(l); } catch { console.log("  !! non-JSON on stdout:", l.slice(0, 120)); return; }
    const p = pending.get(msg.id); if (p) { pending.delete(msg.id); p(msg); }
  });
  proc.stderr.on("data", (d) => { stderr += d; });
  const me = proc; proc.on("exit", (c) => { if (me === proc) exited = c ?? "signal"; });
}
let stderr = "", exited = null;

function send(obj, raw) {
  proc.stdin.write((raw ?? JSON.stringify(obj)) + "\n");
}
function call(method, params, timeout = 5000) {
  const id = nextId++;
  return new Promise((res) => {
    const t = setTimeout(() => { pending.delete(id); res({ timeout: true }); }, timeout);
    pending.set(id, (m) => { clearTimeout(t); res(m); });
    send({ jsonrpc: "2.0", id, method, params });
  });
}
const tool = (name, args, timeout) => call("tools/call", { name, arguments: args }, timeout);

async function handshake() {
  start(); stderr = ""; exited = null;
  await call("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "probe", version: "1" } });
  send({ jsonrpc: "2.0", method: "notifications/initialized" });
}

const results = [];
async function probe(label, fn, timeout = 5000, expect = "any") {
  const t0 = performance.now();
  const r = await fn(timeout);
  const ms = Math.round(performance.now() - t0);
  const text = r.result?.content?.[0]?.text ?? r.error?.message ?? "";
  let verdict;
  if (r.timeout) verdict = "HANG";
  else if (exited !== null) verdict = "CRASH";
  else if (r.error) verdict = "rejected (protocol error)";
  else if (r.result?.isError) verdict = "rejected (tool error)";
  else verdict = "answered";
  const ok = verdict !== "HANG" && verdict !== "CRASH" && (expect === "any" || (expect === "refused") === verdict.startsWith("rejected"));
  results.push({ ok: ok ? "ok" : "FAIL", label, verdict, ms, sample: text.replace(/\s+/g, " ").slice(0, 70) });
  if (verdict === "HANG" || verdict === "CRASH") { proc.kill(); await handshake(); }
}

await handshake();
const big = (n, s) => s.repeat(Math.ceil(n / s.length)).slice(0, n);

// 1. Reaching outside the manifest
await probe("get_component path traversal", () => tool("get_component", { name: "../../../../etc/passwd" }), 5000, "refused");
await probe("get_component __proto__", () => tool("get_component", { name: "__proto__" }), 5000, "refused");
await probe("check_contrast token = constructor", () => tool("check_contrast", { foreground: "constructor", background: "#000" }), 5000, "refused");
await probe("check_contrast theme = __proto__", () => tool("check_contrast", { foreground: "--ds-text", background: "--ds-surface", theme: "__proto__" }), 5000, "refused");
await probe("find_token file:// URI", () => tool("find_token", { intent: "file:///etc/passwd" }), 5000, "refused");
await probe("read resource file:///etc/passwd", (t) => call("resources/read", { uri: "file:///etc/passwd" }, t), 5000, "refused");
await probe("read resource ../ traversal", (t) => call("resources/read", { uri: "blueprint://../../package.json" }, t), 5000, "refused");
await probe("call a tool that does not exist", () => tool("exec", { cmd: "whoami" }), 5000, "refused");

// 2. Type confusion
await probe("name as object", () => tool("get_component", { name: { toString: 1 } }), 5000, "refused");
await probe("name as array", () => tool("get_component", { name: ["Button"] }), 5000, "refused");
await probe("limit = 1e9", () => tool("find_token", { intent: "text", limit: 1e9 }), 5000, "refused");
await probe("limit = -1", () => tool("find_token", { intent: "text", limit: -1 }), 5000, "refused");
await probe("limit = NaN-ish string", () => tool("find_token", { intent: "text", limit: "5" }), 5000, "refused");
await probe("code = null", () => tool("lint_ui", { code: null }), 5000, "refused");
await probe("missing arguments", (t) => call("tools/call", { name: "lint_ui" }, t), 5000, "refused");
await probe("extra arguments ignored", () => tool("get_component", { name: "Button", __proto__: { polluted: 1 }, cmd: "rm -rf /" }));

// 3. Odd text
await probe("null bytes and lone surrogates", () => tool("lint_ui", { code: "<Button\u0000 variant=\"\uD800\" />" }));
await probe("RTL override + zero-width in intent", () => tool("find_token", { intent: "‮error​ text" }));
await probe("emoji flood intent", () => tool("find_token", { intent: big(200, "🔥") }));

// 4. Linter worst cases at the size limit (200,000 chars)
const L = 200_000;
await probe("unclosed quote in attribute", () => tool("lint_ui", { code: `<Button x="abc` }));
await probe("unclosed quote, single", () => tool("lint_ui", { code: `<Button x='abc` }));
await probe("many unclosed tags with open brace", () => tool("lint_ui", { code: big(L - 10, "<Button {") }), 15000);
await probe("many unclosed tags with open quote", () => tool("lint_ui", { code: big(L - 10, "<Button `") }), 15000);
await probe("many tags never closed", () => tool("lint_ui", { code: big(L - 10, "<Button a ") }), 15000);
await probe("deep braces", () => tool("lint_ui", { code: "<Button x=" + big(L - 20, "{") }), 15000);
await probe("unbalanced closing braces", () => tool("lint_ui", { code: "<Button " + big(L - 20, "}") + ">" }), 15000);
await probe("token-like flood", () => tool("lint_ui", { code: big(L, "--ds-") }), 15000);
await probe("spacing flood no separators", () => tool("lint_ui", { code: "padding:" + big(L - 10, "1") }), 15000);
await probe("comment opener flood", () => tool("lint_ui", { code: big(L, "/*") }), 15000);
await probe("line comment flood", () => tool("lint_ui", { code: big(L, "a//") }), 15000);
await probe("hex flood", () => tool("lint_ui", { code: big(L, "#fff ") }), 15000);

// 5. Protocol abuse
await probe("garbage line then valid call", async (t) => { send(null, "{not json"); send(null, "\u0000\u0001"); return tool("list_components", {}, t); });
await probe("deeply nested JSON (10k)", async (t) => { send(null, "[".repeat(10000) + "]".repeat(10000)); return tool("list_components", {}, t); });
await probe("10 MB single message", async (t) => { send({ jsonrpc: "2.0", id: 999999, method: "tools/call", params: { name: "lint_ui", arguments: { code: big(10_000_000, "a") } } }); return tool("list_components", {}, t); }, 15000);
await probe("burst of 500 calls", async (t) => { const all = []; for (let i = 0; i < 500; i++) all.push(tool("find_token", { intent: "error text" }, t)); const r = await Promise.all(all); return r.find((x) => x.timeout) ?? r[0]; }, 15000);
await probe("still alive after all of it", () => tool("get_component", { name: "Button" }));

console.table(results);
const failed = results.filter((r) => r.ok !== "ok");
proc.kill();
console.log(failed.length ? `${failed.length} probe(s) failed` : `${results.length} probes passed`);
process.exit(failed.length ? 1 : 0);
