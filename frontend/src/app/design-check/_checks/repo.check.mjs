#!/usr/bin/env node
// Repository check (task 7.8; task 15.9 adds the stage 2 part).
//
// Stage 1:
//   - logo copies in `src/assets/logo/` and `src/app/icon.svg` match the
//     sha256 of their sources in `src/assets/Medicare logo/solid/`, and
//     `src/app/favicon.ico` is unchanged (Requirements 7.2, 7.4)
//   - `src/app/layout.tsx` and `src/app/globals.css` contain no Geist,
//     Inter, Satoshi or Fontshare reference and no `preload: false` or
//     `adjustFontFallback: false` (Requirements 5.5, 5.6, 5.8, 6.3)
//   - no remote font `@import` or `<link>` in those files (Requirement 5.3)
//   - `next.config.ts` matches its baseline hash (Requirement 1.9)
//
// Stage 2 (task 15.9):
//   - no `/design-check` text and no import into `src/app/design-check/`
//     in files under `src/` outside that folder (Requirements 14.1, 21.4)
//   - `suppressHydrationWarning` appears in code only on `<html>` in
//     `src/app/layout.tsx` (Requirement 14.10)
//
// Usage (from `frontend/`):
//   node src/app/design-check/_checks/repo.check.mjs [--stage=1|2]
// Stage 2 runs the stage 1 checks plus the checks in STAGE_2_CHECKS.
//
// The hashes below are sha256 strings, not colors. This file contains no
// color literals (Requirement 10.5). Node built-ins only.

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { FRONTEND_ROOT, getStage, lineOf, parseCss } from "./lib/css.mjs";

// ---------------------------------------------------------------------------
// Expected values
// ---------------------------------------------------------------------------

const SOURCE_DIR = join("src", "assets", "Medicare logo", "solid");
const LOGO_DIR = join("src", "assets", "logo");
const LAYOUT = join("src", "app", "layout.tsx");
const GLOBALS = join("src", "app", "globals.css");

/** Source logo sha256 values from design.md "Target file layout". */
const LOGO_HASHES = Object.freeze({
  "medicare-logo-full-on-light.svg": "f66bd7205ae435f1bbac2e10ad3eca3a70e961b26d39b928bdf936da6cd8fc61",
  "medicare-logo-full-on-dark.svg": "e9d7f509c7006ecfaf2b508933dd83581f0e25230adc2f35987d2d1978243232",
  "medicare-logo-icon-on-light.svg": "d8ff46519c4ea4d3c904be6a7cbd113648303d77d50545d06ff681a8d4ddc1ce",
  "medicare-logo-icon-on-dark.svg": "21f5b154904eec03206172e4009b79be58f3e02f9d9659ce50dafef5e2ea3058",
});

/** Files that must keep their baseline hash (final-report-draft.md baseline). */
const UNCHANGED_FILES = Object.freeze({
  [join("src", "app", "favicon.ico")]: "bdbf6368f723439dd993e0ddd22725e4422ae3bd1c4a4e400aa7d13c22b76523",
  "next.config.ts": "bb409e5b989fb255dd2c0f8890ce9f2fd15a7b47af02ac0917ba4f132a336ac3",
});

/** Forbidden font references in layout.tsx and globals.css. */
const FORBIDDEN_PATTERNS = Object.freeze([
  { label: "Geist", re: /Geist/g },
  { label: "Geist_Mono", re: /Geist_Mono/g },
  { label: "--font-geist-", re: /--font-geist-/g },
  { label: "Inter (whole word)", re: /\bInter\b/g },
  { label: "Satoshi", re: /Satoshi/gi },
  { label: "fontshare", re: /fontshare/gi },
  { label: "preload: false", re: /\bpreload\s*:\s*false\b/g },
  { label: "adjustFontFallback: false", re: /\badjustFontFallback\s*:\s*false\b/g },
]);

/** A URL that leaves the app origin: `http:`, `https:` or protocol-relative. */
const REMOTE_URL_RE = /^\s*(?:url\(\s*)?["']?\s*(?:https?:)?\/\//i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const abs = (rel) => join(FRONTEND_ROOT, rel);

function sha256(rel) {
  return createHash("sha256").update(readFileSync(abs(rel))).digest("hex");
}

/** Compare a file's sha256 with `expected`. Returns a failure message or null. */
function hashMismatch(rel, expected) {
  if (!existsSync(abs(rel))) return `${rel}: missing`;
  const actual = sha256(rel);
  return actual === expected ? null : `${rel}: sha256 ${actual}, expected ${expected}`;
}

/** Every match of `re` in `text` as `file:line: label "match"`. */
function matchesOf(file, text, re, label) {
  return [...text.matchAll(re)].map((m) => `${file}:${lineOf(text, m.index)}: ${label} "${m[0]}"`);
}

// ---------------------------------------------------------------------------
// Stage 1 checks. Each returns an array of failure messages.
// ---------------------------------------------------------------------------

/** Requirement 7.2: sources keep their hashes and copies match them. */
function checkLogoCopies() {
  const failures = [];
  for (const [name, expected] of Object.entries(LOGO_HASHES)) {
    for (const rel of [join(SOURCE_DIR, name), join(LOGO_DIR, name)]) {
      const failure = hashMismatch(rel, expected);
      if (failure) failures.push(failure);
    }
  }
  return failures;
}

/** Requirement 7.4: icon.svg is a byte copy of the light icon, favicon.ico unchanged. */
function checkAppIcons() {
  const failures = [];
  const icon = hashMismatch(join("src", "app", "icon.svg"), LOGO_HASHES["medicare-logo-icon-on-light.svg"]);
  if (icon) failures.push(icon);
  const favicon = join("src", "app", "favicon.ico");
  const fav = hashMismatch(favicon, UNCHANGED_FILES[favicon]);
  if (fav) failures.push(fav);
  return failures;
}

/** Requirements 5.5, 5.6, 5.8, 6.3: no forbidden font references. */
function checkForbiddenFontReferences() {
  const failures = [];
  for (const rel of [LAYOUT, GLOBALS]) {
    if (!existsSync(abs(rel))) {
      failures.push(`${rel}: missing`);
      continue;
    }
    const text = readFileSync(abs(rel), "utf8");
    for (const { label, re } of FORBIDDEN_PATTERNS) failures.push(...matchesOf(rel, text, re, label));
  }
  return failures;
}

/** Requirement 5.3: no remote `@import` in globals.css, no remote `<link>` or `@import` in layout.tsx. */
function checkRemoteFontLoading() {
  const failures = [];
  if (existsSync(abs(GLOBALS))) {
    const sheet = parseCss(readFileSync(abs(GLOBALS), "utf8"), GLOBALS);
    // Statement at-rules at any depth; comments are already blanked by the parser.
    const statements = [sheet.root, ...sheet.blocks].flatMap((b) => b.statements);
    for (const s of statements) {
      if (s.name === "import" && REMOTE_URL_RE.test(s.prelude)) {
        failures.push(`${GLOBALS}:${s.line}: remote @import ${s.prelude}`);
      }
    }
  }
  if (existsSync(abs(LAYOUT))) {
    const text = readFileSync(abs(LAYOUT), "utf8");
    for (const m of text.matchAll(/<link\b[^>]*>/gi)) {
      const href = /\bhref\s*=\s*\{?\s*["'`]([^"'`]*)["'`]/i.exec(m[0]);
      if (!href || REMOTE_URL_RE.test(href[1])) {
        failures.push(`${LAYOUT}:${lineOf(text, m.index)}: <link> ${href ? `to remote ${href[1]}` : "with unresolved href"}`);
      }
    }
    for (const m of text.matchAll(/@import\s+([^;\n]+)/gi)) {
      if (REMOTE_URL_RE.test(m[1])) failures.push(`${LAYOUT}:${lineOf(text, m.index)}: remote @import ${m[1].trim()}`);
    }
  }
  return failures;
}

/** Requirement 1.9: next.config.ts unchanged. */
function checkNextConfig() {
  const failure = hashMismatch("next.config.ts", UNCHANGED_FILES["next.config.ts"]);
  return failure ? [failure] : [];
}

const STAGE_1_CHECKS = [
  { name: "logo copies match source sha256 (7.2)", run: checkLogoCopies },
  { name: "icon.svg copy and favicon.ico unchanged (7.4)", run: checkAppIcons },
  { name: "no Geist, Inter, Satoshi, Fontshare or disabled font defaults (5.5, 5.6, 5.8, 6.3)", run: checkForbiddenFontReferences },
  { name: "no remote font @import or <link> (5.3)", run: checkRemoteFontLoading },
  { name: "next.config.ts unchanged (1.9)", run: checkNextConfig },
];

// ---------------------------------------------------------------------------
// Stage 2 checks (task 15.9): design-check references, imports from the
// route folder, suppressHydrationWarning placement.
// ---------------------------------------------------------------------------

const SRC_DIR = "src";
const ROUTE_DIR = join("src", "app", "design-check");

/** Text file extensions scanned under `src/`. Binary assets (ico, png) are skipped. */
const TEXT_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".scss", ".json", ".md", ".mdx", ".html", ".svg",
]);
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

/** Repo-relative paths of text files under `src/`, excluding the route folder. */
function sourceFilesOutsideRoute() {
  const files = [];
  const walk = (rel) => {
    for (const entry of readdirSync(abs(rel), { withFileTypes: true })) {
      const child = join(rel, entry.name);
      if (entry.isDirectory()) {
        if (child !== ROUTE_DIR) walk(child);
      } else if (entry.isFile() && TEXT_EXTENSIONS.has(extname(entry.name))) {
        files.push(child);
      }
    }
  };
  walk(SRC_DIR);
  return files.sort();
}

/**
 * Replace `//` and `/* *\/` comments with spaces, keeping newlines and string
 * contents, so offsets and line numbers stay valid. Template literals are
 * treated as opaque strings (nested templates inside `${}` are not tracked).
 */
function blankComments(text) {
  const out = text.split("");
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const n = text[i + 1];
    if (c === '"' || c === "'" || c === "`") {
      i += 1;
      while (i < text.length && text[i] !== c) i += text[i] === "\\" ? 2 : 1;
      i += 1;
    } else if (c === "/" && n === "/") {
      while (i < text.length && text[i] !== "\n") out[i++] = " ";
    } else if (c === "/" && n === "*") {
      const end = text.indexOf("*/", i + 2);
      const stop = end === -1 ? text.length : end + 2;
      for (; i < stop; i += 1) if (out[i] !== "\n") out[i] = " ";
    } else {
      i += 1;
    }
  }
  return out.join("");
}

/** True when `target` (absolute) is the route folder or inside it. */
function isInsideRoute(target) {
  const rel = relative(abs(ROUTE_DIR), target);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

/** Requirements 14.1, 21.4: no `/design-check` text and no import into the route folder outside it. */
function checkNoDesignCheckReferences() {
  const failures = [];
  const specifierRe = /\b(?:from|import|require)\s*\(?\s*["'`]([^"'`\n]+)["'`]/g;
  for (const rel of sourceFilesOutsideRoute()) {
    const text = readFileSync(abs(rel), "utf8");
    failures.push(...matchesOf(rel, text, /\/design-check\b/g, "reference"));
    if (!CODE_EXTENSIONS.has(extname(rel))) continue;
    const code = blankComments(text);
    for (const m of code.matchAll(specifierRe)) {
      const spec = m[1];
      let target = null;
      if (spec.startsWith("@/")) target = join(FRONTEND_ROOT, SRC_DIR, spec.slice(2));
      else if (spec.startsWith(".")) target = resolve(dirname(abs(rel)), spec);
      if (target && isInsideRoute(target)) {
        failures.push(`${rel}:${lineOf(code, m.index)}: import from route folder "${spec}"`);
      }
    }
  }
  return failures;
}

/**
 * Requirement 14.10: `suppressHydrationWarning` appears in code only as an
 * attribute of the `<html>` element in `src/app/layout.tsx`. Mentions inside
 * comments are ignored. Files in `node_modules` are out of scope.
 */
function checkSuppressHydrationWarning() {
  const failures = [];
  let onHtml = 0;
  const files = [...sourceFilesOutsideRoute(), LAYOUT].filter(
    (rel, i, all) => CODE_EXTENSIONS.has(extname(rel)) && all.indexOf(rel) === i,
  );
  for (const rel of files) {
    if (!existsSync(abs(rel))) {
      failures.push(`${rel}: missing`);
      continue;
    }
    const code = blankComments(readFileSync(abs(rel), "utf8"));
    for (const m of code.matchAll(/\bsuppressHydrationWarning\b/g)) {
      const before = code.slice(0, m.index);
      const tags = [...before.matchAll(/<([A-Za-z][\w.:-]*)/g)];
      const tag = tags.at(-1);
      // Inside the opening tag only if no `>` (other than `=>`) follows the tag start.
      const inTag = tag && !before.slice(tag.index).replaceAll("=>", "").includes(">");
      const where = `${rel}:${lineOf(code, m.index)}`;
      if (rel === LAYOUT && inTag && tag[1] === "html") onHtml += 1;
      else failures.push(`${where}: suppressHydrationWarning ${inTag ? `on <${tag[1]}>` : "outside a JSX opening tag"}`);
    }
  }
  if (onHtml !== 1) failures.push(`${LAYOUT}: expected suppressHydrationWarning on <html> once, found ${onHtml}`);
  return failures;
}

const STAGE_2_CHECKS = [
  { name: "no /design-check reference or route-folder import outside the route (14.1, 21.4)", run: checkNoDesignCheckReferences },
  { name: "suppressHydrationWarning only on <html> in layout.tsx (14.10)", run: checkSuppressHydrationWarning },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

let stage;
try {
  stage = getStage(process.argv.slice(2));
} catch (error) {
  console.error(`repo.check: ${error.message}`);
  process.exit(2);
}

const checks = stage === 2 ? [...STAGE_1_CHECKS, ...STAGE_2_CHECKS] : STAGE_1_CHECKS;
let failed = 0;
console.log(`repo.check: stage ${stage}, root ${FRONTEND_ROOT}`);
for (const check of checks) {
  let failures;
  try {
    failures = check.run();
  } catch (error) {
    failures = [`error: ${error.message}`];
  }
  if (failures.length === 0) {
    console.log(`  ok   ${check.name}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${check.name}`);
    for (const f of failures) console.log(`       ${f}`);
  }
}
console.log(`repo.check: ${checks.length - failed} of ${checks.length} checks passed`);
process.exit(failed > 0 ? 1 : 0);
