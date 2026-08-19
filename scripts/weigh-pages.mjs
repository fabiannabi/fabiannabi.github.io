#!/usr/bin/env node
/**
 * What each page actually costs — no dependencies.
 *
 * Vite's build output lists chunks, not pages, and it names each chunk after
 * whichever module happens to be in it. Reading "cover-L5024C4l.js 0.85 kB" off
 * that list and calling it the cover's weight is wrong by a factor of six: the
 * page also pulls every shared chunk its imports drag in. This walks each entry
 * HTML instead and sums what the browser is actually told to fetch.
 *
 * React is separated out because it is a fixed cost that no decision in this
 * repo moves. The number worth watching is the "own" column.
 *
 *   node scripts/weigh-pages.mjs
 */
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

/** The cover is one screen of text and has to stay cheap. Gzipped, own JS. */
const COVER_BUDGET_KB = 8;

/** Anything this large is the framework, not a decision made here. */
const VENDOR_BYTES = 100_000;

const PAGES = [
  ["cover", "index.html"],
  ["profile", "profile/index.html"],
  ["design", "design/index.html"],
];

const kb = (bytes) => (bytes / 1024).toFixed(2).padStart(6);
const gz = (path) => gzipSync(readFileSync(path)).length;

let failures = 0;
const results = [];

for (const [label, html] of PAGES) {
  const source = readFileSync(join("dist", html), "utf8");
  const refs = [...new Set([...source.matchAll(/(?:src|href)="\/([^"]+\.(?:js|css))"/g)].map((m) => m[1]))];

  let js = 0;
  let css = 0;
  let vendor = 0;

  for (const ref of refs) {
    const path = join("dist", ref);
    const size = gz(path);
    if (!ref.endsWith(".js")) {
      css += size;
      continue;
    }
    js += size;
    if (statSync(path).size > VENDOR_BYTES) vendor += size;
  }

  results.push({ label, own: js - vendor, vendor, css, files: refs.length });
}

console.log("\ngzipped, as the browser is told to fetch it\n");
console.log("  page      own js   react     css   files");
for (const { label, own, vendor, css, files } of results) {
  console.log(`  ${label.padEnd(8)}${kb(own)}  ${kb(vendor)}  ${kb(css)}   ${String(files).padStart(3)}`);
}

const cover = results.find((r) => r.label === "cover");
const coverKb = cover.own / 1024;
const withinBudget = coverKb <= COVER_BUDGET_KB;
if (!withinBudget) failures++;

console.log(
  `\n  cover budget  ${coverKb.toFixed(2)} kB of ${COVER_BUDGET_KB} kB  ${withinBudget ? "pass" : "FAIL"}`,
);
console.log(`\n${failures === 0 ? "PASS" : "FAIL"}\n`);
process.exit(failures === 0 ? 0 : 1);
