// Checks what `npm publish` would upload: exactly the expected files, nothing that runs on
// install, no secrets or local paths. Runs in CI before every release.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("..", import.meta.url));
const EXPECTED = [
  "LICENSE", "README.md", "SECURITY.md", "package.json",
  "dist/catalog.js", "dist/cli.js", "dist/contrast.js", "dist/lint.js",
  "dist/manifest.js", "dist/manifest.json", "dist/server.js",
];
const SECRETS = [
  /npm_[A-Za-z0-9]{36}/, /gh[pousr]_[A-Za-z0-9]{36,}/, /sk-ant-[A-Za-z0-9-_]{20,}/, /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /xox[baprs]-[A-Za-z0-9-]{10,}/, /AIza[0-9A-Za-z-_]{35}/,
];
const LOCAL = [/[A-Z]:\\?Users/i, /\/Users\/[a-z]/, /\/home\/[a-z]/, /FABIAN/];

const problems = [];
// npm pack occasionally exits 1 with no message on Windows; retry before calling it a failure.
function packList() {
  for (let attempt = 1; ; attempt++) {
    try {
      return JSON.parse(execSync("npm pack --dry-run --json --ignore-scripts", { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
    } catch (e) {
      if (attempt >= 4) throw e;
    }
  }
}
const [pack] = packList();
const files = pack.files.map((f) => f.path).sort();
const extra = files.filter((f) => !EXPECTED.includes(f));
const missing = EXPECTED.filter((f) => !files.includes(f));
if (extra.length) problems.push(`unexpected files: ${extra.join(", ")}`);
if (missing.length) problems.push(`missing files: ${missing.join(", ")}`);
if (pack.size > 60_000) problems.push(`tarball is ${pack.size} bytes; expected under 60 kB`);

const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
for (const hook of ["preinstall", "install", "postinstall", "prepare"]) if (pkg.scripts?.[hook]) problems.push(`install hook: ${hook}`);

for (const f of files) {
  const text = readFileSync(join(dir, f), "utf8");
  for (const re of SECRETS) if (re.test(text)) problems.push(`${f}: looks like a secret (${re})`);
  if (f !== "LICENSE") for (const re of LOCAL) if (re.test(text)) problems.push(`${f}: contains a local path (${re})`);
}

console.log(`${pack.name}@${pack.version}: ${files.length} files, ${pack.size} bytes`);
if (problems.length) { for (const p of problems) console.error(`  ✗ ${p}`); process.exit(1); }
console.log("  ✓ contents, install hooks, secrets and local paths");
