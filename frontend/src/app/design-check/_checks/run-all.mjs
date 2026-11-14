#!/usr/bin/env node
// Check runner (task 7.1).
// Runs every `*.check.mjs` in this folder in name order, one after another,
// with `frontend/` as the working directory. `*.report.mjs` scripts and
// `lib/` are skipped. Prints PASS or FAIL per script and exits 1 if any
// script fails. With no check scripts present it says so and exits 0.
//
// Usage (from `frontend/`):
//   node src/app/design-check/_checks/run-all.mjs [--stage=1|2]
// The stage defaults to 1 and is passed to every script as `--stage=N`.
//
// This file contains no color literals (Requirement 10.5). Node built-ins only.

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { FRONTEND_ROOT, getStage } from "./lib/css.mjs";

const CHECKS_DIR = fileURLToPath(new URL(".", import.meta.url));

let stage;
try {
  stage = getStage(process.argv.slice(2));
} catch (error) {
  console.error(`run-all: ${error.message}`);
  process.exit(2);
}

const scripts = readdirSync(CHECKS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".check.mjs"))
  .map((entry) => entry.name)
  .sort();

if (scripts.length === 0) {
  console.log(`run-all: no *.check.mjs scripts found in ${CHECKS_DIR}; nothing to run.`);
  process.exit(0);
}

console.log(`run-all: stage ${stage}, ${scripts.length} script(s)\n`);

const results = [];
for (const name of scripts) {
  console.log(`--- ${name} ---`);
  const run = spawnSync(process.execPath, [join(CHECKS_DIR, name), `--stage=${stage}`], {
    cwd: FRONTEND_ROOT,
    stdio: "inherit",
  });
  const ok = run.status === 0 && !run.error;
  const reason = run.error ? run.error.message : run.signal ? `signal ${run.signal}` : `exit ${run.status}`;
  results.push({ name, ok, reason });
  console.log(ok ? `PASS ${name}\n` : `FAIL ${name} (${reason})\n`);
}

const failed = results.filter((r) => !r.ok);
console.log("Summary:");
for (const r of results) console.log(`  ${r.ok ? "PASS" : "FAIL"} ${r.name}`);
console.log(`${results.length - failed.length} passed, ${failed.length} failed`);
process.exit(failed.length > 0 ? 1 : 0);
