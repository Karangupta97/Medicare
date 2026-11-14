#!/usr/bin/env node
// Feature: design-system-dark-mode, Property 5: Raw hex appears only in Primitive_Token declarations
// Task 7.2. Validates: Requirements 10.5, 10.7, 13.7, 14.5
//
// 1. Every `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs` and `.css` file under
//    `frontend/src`, except the Globals_Stylesheet (`src/app/globals.css`),
//    must contain zero raw hex color literals. `.svg` files are not scanned.
//    A raw hex color literal is `#` followed by exactly 3, 4, 6 or 8 hex
//    digits with no letter, digit or underscore directly after them, matched
//    case-insensitively (HEX_LITERAL_RE in lib/css.mjs). No exemptions.
// 2. Every raw hex literal inside the Globals_Stylesheet must sit in the value
//    of a `--prim-*` declaration. Literals in comments, selectors or any other
//    declaration fail.
//
// Same result for --stage=1 and --stage=2. Exits 1 and lists every offending
// file:line on failure. This file contains no hex color literals.
// Node built-ins only.
//
// Usage (from `frontend/`): node src/app/design-check/_checks/p05-raw-hex.check.mjs [--stage=1|2]
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";
import { FRONTEND_ROOT, STYLESHEETS, findHexLiterals, getStage, loadStylesheet } from "./lib/css.mjs";

const SRC_ROOT = join(FRONTEND_ROOT, "src");
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
const GLOBALS = STYLESHEETS.globals;

const rel = (file) => relative(FRONTEND_ROOT, file).split(sep).join("/");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && EXTENSIONS.has(extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

/** Part 1: raw hex literals in source files other than the Globals_Stylesheet. */
function scanSources() {
  const files = walk(SRC_ROOT).filter((file) => file !== GLOBALS).sort();
  const offenders = [];
  for (const file of files) {
    for (const hit of findHexLiterals(readFileSync(file, "utf8"))) {
      offenders.push(`${rel(file)}:${hit.line}: ${hit.match}`);
    }
  }
  return { count: files.length, offenders };
}

/**
 * The declaration whose text contains `index`, or null. A declaration spans
 * from its start to the next `;`, `{` or `}` outside parentheses and quotes
 * in the comment-blanked text.
 */
function declarationAt(sheet, blanked, index) {
  let best = null;
  for (const block of [sheet.root, ...sheet.blocks]) {
    for (const decl of block.declarations) {
      if (decl.start <= index && (!best || decl.start > best.start)) best = decl;
    }
  }
  if (!best) return null;
  let parens = 0;
  let quote = null;
  for (let i = best.start; i < index; i += 1) {
    const c = blanked[i];
    if (quote) {
      if (c === "\\") i += 1;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === "(") parens += 1;
    else if (c === ")") parens = Math.max(0, parens - 1);
    else if (parens === 0 && (c === ";" || c === "{" || c === "}")) return null;
  }
  return best;
}

/** Part 2: every raw hex literal in the Globals_Stylesheet is in a `--prim-*` value. */
function scanGlobals() {
  const sheet = loadStylesheet("globals");
  const source = sheet.text;
  // Same offsets as the source: comments replaced by spaces, newlines kept.
  const blanked = source.split("");
  for (const c of sheet.comments) for (let i = c.start; i < c.end; i += 1) if (blanked[i] !== "\n") blanked[i] = " ";
  const blankedText = blanked.join("");
  const hits = findHexLiterals(source);
  const offenders = [];
  for (const hit of hits) {
    const inComment = sheet.comments.some((c) => hit.index >= c.start && hit.index < c.end);
    const decl = inComment ? null : declarationAt(sheet, blankedText, hit.index);
    const valueStart = decl ? source.indexOf(":", decl.start) : -1;
    if (decl && decl.prop.startsWith("--prim-") && hit.index > valueStart) continue;
    const where = inComment ? "in a comment" : decl ? `in ${decl.prop}` : "outside any declaration";
    offenders.push(`${rel(GLOBALS)}:${hit.line}: ${hit.match} (${where})`);
  }
  return { count: hits.length, offenders };
}

let stage;
try {
  stage = getStage();
} catch (error) {
  console.error(`p05-raw-hex: ${error.message}`);
  process.exit(2);
}

const sources = scanSources();
const globals = scanGlobals();

if (sources.offenders.length > 0 || globals.offenders.length > 0) {
  console.error("FAIL Property 5: raw hex appears only in Primitive_Token declarations");
  if (sources.offenders.length > 0) {
    console.error(`Raw hex literals outside src/app/globals.css (${sources.offenders.length}):`);
    for (const line of sources.offenders) console.error(`  ${line}`);
  }
  if (globals.offenders.length > 0) {
    console.error(`Raw hex literals in src/app/globals.css outside a --prim-* declaration (${globals.offenders.length}):`);
    for (const line of globals.offenders) console.error(`  ${line}`);
  }
  process.exit(1);
}

console.log(
  `PASS Property 5 (stage ${stage}): 0 raw hex literals in ${sources.count} files under src (globals.css excluded); ` +
    `all ${globals.count} literals in src/app/globals.css are in --prim-* declarations.`,
);
