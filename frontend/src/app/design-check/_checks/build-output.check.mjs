#!/usr/bin/env node
// Build output check (task 7.9; task 15.8 adds the stage 2 part).
//
// Run after `npm run build`. Reads the `.next` output only.
//
// Stage 1:
//   - the prerendered `/` HTML has, in `<head>`, a `rel="icon"` link to
//     `/favicon.ico`, a `rel="icon"` link to the `icon` file with
//     `type="image/svg+xml"`, and, when `src/app/apple-icon.*` exists, a
//     `rel="apple-touch-icon"` link with `sizes="180x180"` (Requirement 7.7)
//   - every compiled semantic color utility used in a source file under
//     `src` (for example `bg-brand`, `text-on-brand`,
//     `hover:bg-brand-hover`) and every compiled `@utility` class from
//     `globals.css` sets its colors through `var(--sem-*)` with no literal
//     color (Requirements 3.1, 10.3)
//   - the compiled CSS has no Google Fonts or Fontshare URL (Requirement 5.3)
//
// Stage 2 (task 15.8) adds:
//   - the compiled CSS has `.bg-primary`, `.text-secondary`, `.bg-accent`,
//     `.xs\:flex`, `.font-montserrat`, `.shadow-custom`, `.prose` and
//     `.aspect-w-16` (Requirements 3.1, 3.2)
//   - the compiled CSS has a rule for each of the 23 `@utility` classes
//     and for each variant form of them used under `src`, at least
//     `sm:card`, `hover:btn-primary` and `sm:heading-1` (Requirement 3.4)
//   - the compiled CSS has the `@tailwindcss/forms` base rules
//     (`appearance: none` for `[type='text']`, `select` and `textarea`)
//     (Requirement 3.2)
//   - the prerendered `/design-check` HTML has
//     `<meta name="robots" content="noindex, nofollow">` (Requirement 14.9)
//
// Usage (from `frontend/`):
//   node src/app/design-check/_checks/build-output.check.mjs [--stage=1|2]
//
// This file contains no color literals (Requirement 10.5). Node built-ins only.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  FRONTEND_ROOT,
  ancestors,
  findHexLiterals,
  getStage,
  getThemeInline,
  getUtilities,
  loadStylesheet,
  parseCss,
  varRefs,
} from "./lib/css.mjs";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const NEXT_DIR = join(FRONTEND_ROOT, ".next");
const BUILD_ID = join(NEXT_DIR, "BUILD_ID");
const STATIC_DIR = join(NEXT_DIR, "static");
const SERVER_APP_DIR = join(NEXT_DIR, "server", "app");
const SRC_DIR = join(FRONTEND_ROOT, "src");
const APP_DIR = join(SRC_DIR, "app");
const CHECKS_DIR = join(APP_DIR, "design-check", "_checks");

/** Source files whose edits make an existing build stale. */
const BUILD_INPUTS = ["globals.css", "layout.tsx", "page.tsx", "apple-icon.tsx", "icon.svg", "favicon.ico"].map((f) =>
  join(APP_DIR, f),
);

const rel = (file) => relative(FRONTEND_ROOT, file);

/** Every file under `dir` (recursive) for which `keep(name)` is true. */
function listFiles(dir, keep, skipDirs = []) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.includes(full)) out.push(...listFiles(full, keep, skipDirs));
    } else if (entry.isFile() && keep(entry.name)) {
      out.push(full);
    }
  }
  return out.sort();
}

/** The prerendered HTML of an app route, for example `/` → `server/app/index.html`. */
function prerenderedHtmlPath(route) {
  const name = route === "/" ? "index" : route.replace(/^\//, "");
  return join(SERVER_APP_DIR, `${name}.html`);
}

function readPrerenderedHtml(route) {
  const file = prerenderedHtmlPath(route);
  if (!existsSync(file)) throw new Error(`no prerendered HTML for ${route} at ${rel(file)}; was the route built as static?`);
  return readFileSync(file, "utf8");
}

let compiledCache = null;

/** Every compiled CSS file under `.next/static`, parsed. */
function compiledCss() {
  if (compiledCache) return compiledCache;
  const files = listFiles(STATIC_DIR, (n) => n.endsWith(".css"));
  if (files.length === 0) throw new Error(`no compiled CSS under ${rel(STATIC_DIR)}`);
  compiledCache = files.map((file) => {
    const text = readFileSync(file, "utf8");
    return { file, text, sheet: parseCss(text, rel(file)) };
  });
  return compiledCache;
}

/** Compiled style rules (not inside keyframes) with their file and wrappers. */
function compiledRules() {
  return compiledCss().flatMap(({ file, sheet }) =>
    sheet.blocks
      .filter((b) => b.kind === "rule" && b.selector && !ancestors(b).some((a) => a.type === "keyframes"))
      .map((block) => ({ file, block, wrappers: ancestors(block).map((a) => `@${a.name} ${a.prelude}`).reverse() })),
  );
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

/** Attributes of an HTML start tag as a Map (names lowercased). */
function parseAttributes(tag) {
  const attrs = new Map();
  const body = tag.replace(/^<[\w-]+/, "").replace(/\/?>$/, "");
  for (const m of body.matchAll(/([^\s=/>]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+))?/g)) {
    attrs.set(m[1].toLowerCase(), m[3] ?? m[4] ?? m[2] ?? "");
  }
  return attrs;
}

/** Every `<link>` tag in `html` with its attributes. */
const linkTags = (html) => [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => ({ tag: m[0], attrs: parseAttributes(m[0]) }));

const relTokens = (link) => (link.attrs.get("rel") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
const hrefPath = (link) => (link.attrs.get("href") ?? "").split(/[?#]/)[0];

// ---------------------------------------------------------------------------
// CSS helpers
// ---------------------------------------------------------------------------

/** Escape a class name the way it appears in a CSS selector. */
const escapeClass = (name) => name.replace(/[^A-Za-z0-9_-]/g, (c) => `\\${c}`);
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when `selector` contains the class `escaped` (already CSS-escaped). */
function selectorHasClass(selector, escaped, { variants = false } = {}) {
  const prefix = variants ? "(?:(?:[A-Za-z0-9_-]|\\\\.)+\\\\:)?" : "";
  return new RegExp(`\\.${prefix}${escapeRegExp(escaped)}(?![A-Za-z0-9_-]|\\\\)`).test(selector);
}

/**
 * Declarations that set a color: `color`, any `*-color` property
 * (including Tailwind's `--tw-*-color`), `fill`, `stroke` and the gradient
 * stops. These must use `var(--sem-*)` or a color keyword.
 */
const isColorProp = (prop) => /(^|-)color$/.test(prop) || ["fill", "stroke", "--tw-gradient-from", "--tw-gradient-via", "--tw-gradient-to"].includes(prop);
/** Shorthands that may hold colors; checked for literals only. */
const isColorShorthand = (prop) => ["background", "background-image", "border", "outline", "text-decoration"].includes(prop);

const COLOR_KEYWORDS = new Set(["transparent", "currentcolor", "inherit", "initial", "unset", "revert", "none"]);
const COLOR_FUNCTION_RE = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const NAMED_COLOR_RE =
  /\b(?:white|black|gray|grey|silver|red|maroon|orange|yellow|olive|lime|green|teal|aqua|cyan|blue|navy|indigo|purple|violet|fuchsia|magenta|pink)\b/i;

/** Literal colors in a declaration value (custom property names ignored). */
function literalColors(value) {
  const found = findHexLiterals(value).map((h) => h.match);
  const bare = value.replace(/--[\w-]+/g, "");
  const fn = COLOR_FUNCTION_RE.exec(bare);
  if (fn) found.push(`${fn[0]}…)`);
  const named = NAMED_COLOR_RE.exec(bare);
  if (named) found.push(named[0]);
  return found;
}

/**
 * Problems with the color declarations of one compiled rule. Returns
 * `{ problems, semCount }` where `semCount` counts color declarations that
 * reference `var(--sem-*)`.
 */
function checkRuleColors({ file, block, wrappers }) {
  const where = `${rel(file)}:${block.line} ${[...wrappers, block.selector].join(" ")}`;
  const problems = [];
  let semCount = 0;
  for (const d of block.declarations) {
    const colorProp = isColorProp(d.prop);
    if (!colorProp && !isColorShorthand(d.prop)) continue;
    const literals = literalColors(d.value);
    if (literals.length > 0) problems.push(`${where}: ${d.prop}: ${d.value} has literal color ${literals.join(", ")}`);
    if (!colorProp) continue;
    const usesSem = varRefs(d.value).some((n) => n.startsWith("--sem-"));
    if (usesSem) semCount += 1;
    else if (!COLOR_KEYWORDS.has(d.value.trim().toLowerCase()))
      problems.push(`${where}: ${d.prop}: ${d.value} does not use var(--sem-*)`);
  }
  return { problems, semCount };
}

// ---------------------------------------------------------------------------
// Source scan: semantic color utilities used under `src`
// ---------------------------------------------------------------------------

/** Tailwind v4 utility prefixes that take a theme color. Longest first. */
const COLOR_UTILITY_PREFIXES = [
  "ring-offset", "inset-shadow", "inset-ring", "drop-shadow", "decoration", "placeholder",
  "border-x", "border-y", "border-t", "border-r", "border-b", "border-l", "border-s", "border-e",
  "outline", "border", "divide", "accent", "caret", "stroke", "shadow", "text", "fill", "ring",
  "from", "via", "bg", "to",
].sort((a, b) => b.length - a.length);

/** Semantic color roles: `--color-<role>: var(--sem-…)` in `@theme inline`. */
function semanticRoles() {
  const roles = new Set();
  for (const [prop, value] of getThemeInline(loadStylesheet("globals"))) {
    if (prop.startsWith("--color-") && varRefs(value).some((n) => n.startsWith("--sem-"))) roles.add(prop.slice("--color-".length));
  }
  return roles;
}

/** The base utility of a candidate (variants, `!` and `/opacity` removed). */
function baseUtility(candidate) {
  if (candidate.includes("[")) return null;
  const parts = candidate.split(":");
  return parts[parts.length - 1].replace(/^!|!$/g, "").replace(/\/[\w.%]+$/, "");
}

/** True when `utility` is `<color prefix>-<semantic role>`. */
function isSemanticColorUtility(utility, roles) {
  return COLOR_UTILITY_PREFIXES.some((p) => utility.startsWith(`${p}-`) && roles.has(utility.slice(p.length + 1)));
}

/** Map candidate → first source location, for semantic color utilities in `src`. */
function usedSemanticUtilities() {
  const roles = semanticRoles();
  if (roles.size === 0) throw new Error("no --color-<role>: var(--sem-*) entries in @theme inline of globals.css");
  const files = listFiles(SRC_DIR, (n) => /\.(?:tsx?|jsx?|mjs)$/.test(n), [CHECKS_DIR]);
  const used = new Map();
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/[^\s"'`{}();,<>=]+/g)) {
      const candidate = m[0];
      const base = baseUtility(candidate);
      if (base && isSemanticColorUtility(base, roles) && !used.has(candidate)) used.set(candidate, `${rel(file)}`);
    }
  }
  return used;
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

/** Requirement 7.7: icon links in the prerendered `/` HTML. */
function checkIconLinks() {
  const html = readPrerenderedHtml("/");
  const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(html);
  if (!head) return ["prerendered / HTML has no <head> element"];
  const links = linkTags(head[1]);
  const icons = links.filter((l) => relTokens(l).includes("icon"));
  const failures = [];
  const outsideHead = (pred) => linkTags(html).some(pred) ? " (a matching link exists outside <head>)" : "";

  const favicon = (l) => relTokens(l).includes("icon") && hrefPath(l) === "/favicon.ico";
  if (!icons.some(favicon)) failures.push(`no <link rel="icon" href="/favicon.ico…"> in <head>${outsideHead(favicon)}`);

  const svgIcon = (l) =>
    relTokens(l).includes("icon") && /^\/icon(?:[\w.-]*)$/.test(hrefPath(l)) && (l.attrs.get("type") ?? "").toLowerCase() === "image/svg+xml";
  if (!icons.some(svgIcon)) failures.push(`no <link rel="icon" href="/icon…" type="image/svg+xml"> in <head>${outsideHead(svgIcon)}`);

  const appleSources = readdirSync(APP_DIR).filter((n) => /^apple-icon\d*\.(?:tsx|ts|jsx|js|png|jpg|jpeg)$/.test(n));
  if (appleSources.length > 0) {
    const apple = (l) => relTokens(l).includes("apple-touch-icon") && l.attrs.get("sizes") === "180x180";
    if (!links.some(apple))
      failures.push(`src/app/${appleSources[0]} exists but <head> has no <link rel="apple-touch-icon" sizes="180x180">${outsideHead(apple)}`);
  }
  if (failures.length > 0) failures.push(`icon links found: ${links.filter((l) => /icon/.test(l.attrs.get("rel") ?? "")).map((l) => l.tag).join(" ") || "none"}`);
  return failures;
}

/** Requirements 3.1, 10.3: semantic color utilities used in source compile to var(--sem-*). */
function checkUsedSemanticUtilities() {
  const used = usedSemanticUtilities();
  if (used.size === 0) return ["no semantic color utility (for example bg-brand) found in any source file under src"];
  const rules = compiledRules();
  const failures = [];
  for (const [candidate, source] of used) {
    const matching = rules.filter((r) => selectorHasClass(r.block.selector, escapeClass(candidate)));
    if (matching.length === 0) {
      failures.push(`${candidate} (used in ${source}) has no rule in the compiled CSS`);
      continue;
    }
    let semCount = 0;
    for (const rule of matching) {
      const result = checkRuleColors(rule);
      failures.push(...result.problems.map((p) => `${candidate}: ${p}`));
      semCount += result.semCount;
    }
    if (semCount === 0) failures.push(`${candidate} (used in ${source}): no compiled color declaration references var(--sem-*)`);
  }
  console.log(`       ${used.size} semantic color utilities used in src: ${[...used.keys()].join(" ")}`);
  return failures;
}

/**
 * Component classes that `@tailwindcss/forms` adds when no `strategy` is
 * set. `@utility form-input` shares its name with one of them, so the
 * compiled `.form-input` combines the plugin rules and the `@utility`
 * rules, as in the Legacy_App (design.md "Inputs read"). Plugin rules are
 * not part of the `@utility` body.
 */
const FORMS_PLUGIN_CLASSES = new Set(["form-input", "form-textarea", "form-select", "form-multiselect", "form-checkbox", "form-radio"]);

const referencesSem = (block) => block.declarations.some((d) => varRefs(d.value).some((n) => n.startsWith("--sem-")));

/** Requirement 10.3: compiled `@utility` class bodies set colors through var(--sem-*). */
function checkUtilityClassColors() {
  const names = [...getUtilities(loadStylesheet("globals")).keys()].filter((n) => !n.endsWith("-*"));
  if (names.length === 0) return ["no @utility blocks in globals.css"];
  const rules = compiledRules();
  const failures = [];
  const notCompiled = [];
  for (const name of names) {
    const matching = rules.filter((r) => selectorHasClass(r.block.selector, escapeClass(name), { variants: true }));
    if (matching.length === 0) notCompiled.push(name);
    // A rule for a forms plugin class name with no var(--sem-*) at all is
    // the plugin's own rule. Report its color values that no later
    // `@utility` rule for the same selector overrides, for information.
    const pluginRules = FORMS_PLUGIN_CLASSES.has(name) ? matching.filter((r) => !referencesSem(r.block)) : [];
    for (const rule of matching) {
      if (pluginRules.includes(rule)) continue;
      failures.push(...checkRuleColors(rule).problems.map((p) => `@utility ${name}: ${p}`));
    }
    if (pluginRules.length > 0) {
      const own = matching.filter((r) => !pluginRules.includes(r));
      const overrides = (file, block, prop) =>
        own.some(
          (o) => o.file === file && o.block.selector === block.selector && o.block.start > block.start && o.block.declarations.some((od) => od.prop === prop),
        );
      const kept = pluginRules.flatMap(({ file, block }) =>
        block.declarations
          .filter((d) => isColorProp(d.prop) || isColorShorthand(d.prop))
          .filter((d) => !overrides(file, block, d.prop))
          .map((d) => `${block.selector} { ${d.prop}: ${d.value} }`),
      );
      console.log(`       ${name}: ${pluginRules.length} @tailwindcss/forms plugin rules skipped (not part of the @utility body)`);
      if (kept.length > 0) console.log(`       ${name}: plugin color values the @utility does not override: ${[...new Set(kept)].join("; ")}`);
    }
  }
  console.log(`       ${names.length - notCompiled.length} of ${names.length} @utility classes in the compiled CSS`);
  if (notCompiled.length > 0) console.log(`       not compiled (unused, not checked here): ${notCompiled.join(" ")}`);
  return failures;
}

/** Requirement 5.3: no Google Fonts or Fontshare URL in the compiled CSS. */
function checkNoRemoteFonts() {
  const failures = [];
  for (const { file, text } of compiledCss()) {
    for (const m of text.matchAll(/fonts\.googleapis\.com|fonts\.gstatic\.com|fontshare/gi)) {
      failures.push(`${rel(file)}: "${m[0]}" at offset ${m.index}`);
    }
  }
  return failures;
}

const STAGE_1_CHECKS = [
  { name: "prerendered / HTML has the favicon, icon.svg and apple-touch-icon links (7.7)", run: checkIconLinks },
  { name: "semantic color utilities used in src compile to var(--sem-*) with no literal color (3.1, 10.3)", run: checkUsedSemanticUtilities },
  { name: "compiled @utility classes set colors through var(--sem-*) with no literal color (10.3)", run: checkUtilityClassColors },
  { name: "compiled CSS has no Google Fonts or Fontshare URL (5.3)", run: checkNoRemoteFonts },
];

// ---------------------------------------------------------------------------
// Stage 2 checks (task 15.8)
// ---------------------------------------------------------------------------

/**
 * Legacy token utilities and plugin classes that the `/design-check`
 * utility coverage section uses (Requirements 3.1, 3.2).
 */
const LEGACY_COVERAGE_CLASSES = [
  "bg-primary", "text-secondary", "bg-accent", "xs:flex", "font-montserrat", "shadow-custom",
  "prose", "aspect-w-16", "aspect-h-9",
];

/** The 23 Legacy_App classes Requirement 3.4 requires as `@utility` directives. */
const REQUIRED_UTILITIES = [
  "nav-link", "mobile-nav-link", "menu-item", "card", "card-hover", "form-input", "form-label", "btn",
  "btn-primary", "btn-secondary", "container-custom", "section", "heading-1", "heading-2", "body-text",
  "grid-responsive-2", "grid-responsive-3", "grid-responsive-4", "status-badge", "status-badge-success",
  "status-badge-warning", "status-badge-error", "scrollbar-hide",
];

/** Variant forms the utility coverage section must use (Requirement 3.4). */
const REQUIRED_VARIANT_FORMS = ["sm:card", "hover:btn-primary", "sm:heading-1"];

/** Compiled rules whose selector contains exactly the class `candidate`. */
const rulesForClass = (rules, candidate) => rules.filter((r) => selectorHasClass(r.block.selector, escapeClass(candidate)));

/** Requirements 3.1, 3.2: legacy token utilities, `xs:`, `prose` and `aspect-w-16` compile. */
function checkLegacyCoverageClasses() {
  const rules = compiledRules();
  const failures = LEGACY_COVERAGE_CLASSES.filter((c) => rulesForClass(rules, c).length === 0).map(
    (c) => `.${escapeClass(c)} has no rule in the compiled CSS`,
  );
  console.log(`       ${LEGACY_COVERAGE_CLASSES.length - failures.length} of ${LEGACY_COVERAGE_CLASSES.length} classes found: ${LEGACY_COVERAGE_CLASSES.join(" ")}`);
  return failures;
}

/** Map candidate → first source file, for `<variant>:…:<utility>` candidates under `src`. */
function usedUtilityVariantForms(names) {
  const files = listFiles(SRC_DIR, (n) => /\.(?:tsx?|jsx?|mjs)$/.test(n), [CHECKS_DIR]);
  const used = new Map();
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/(?<![\w:-])(?:[a-z0-9-]+:)+([a-z0-9-]+)(?![\w:-])/g)) {
      if (names.has(m[1]) && !used.has(m[0])) used.set(m[0], rel(file));
    }
  }
  return used;
}

/** Requirement 3.4: every `@utility` class and its variant forms used in source compile. */
function checkUtilityCoverage() {
  const defined = new Set([...getUtilities(loadStylesheet("globals")).keys()].filter((n) => !n.endsWith("-*")));
  const failures = REQUIRED_UTILITIES.filter((n) => !defined.has(n)).map((n) => `@utility ${n} is not defined in globals.css`);
  const rules = compiledRules();
  const missing = REQUIRED_UTILITIES.filter((n) => rulesForClass(rules, n).length === 0);
  failures.push(...missing.map((n) => `@utility ${n}: .${escapeClass(n)} has no rule in the compiled CSS`));
  console.log(`       ${REQUIRED_UTILITIES.length - missing.length} of ${REQUIRED_UTILITIES.length} @utility classes in the compiled CSS`);

  const variants = usedUtilityVariantForms(new Set(REQUIRED_UTILITIES));
  for (const form of REQUIRED_VARIANT_FORMS) {
    if (!variants.has(form)) failures.push(`${form} is not used in any source file under src`);
  }
  for (const [candidate, source] of variants) {
    if (rulesForClass(rules, candidate).length === 0)
      failures.push(`${candidate} (used in ${source}): .${escapeClass(candidate)} has no rule in the compiled CSS`);
  }
  console.log(`       ${variants.size} variant forms used in src: ${[...variants.keys()].join(" ") || "none"}`);
  return failures;
}

/** Requirement 3.2: the `@tailwindcss/forms` base rules for input types, `select` and `textarea`. */
function checkFormsBaseRules() {
  const appearanceNone = (block) => block.declarations.some((d) => d.prop === "appearance" && d.value.trim() === "none");
  const rules = compiledRules().filter((r) => appearanceNone(r.block));
  const selectorList = (r) => r.block.selector.split(",").map((s) => s.trim());
  const targets = [
    { label: "an input type such as [type='text']", test: (s) => /\[type=(['"]?)text\1\]/.test(s) },
    { label: "select", test: (s) => /^select(?![\w-])/.test(s) },
    { label: "textarea", test: (s) => /^textarea(?![\w-])/.test(s) },
  ];
  const failures = [];
  for (const { label, test } of targets) {
    const hit = rules.find((r) => selectorList(r).some(test));
    if (hit) console.log(`       ${label}: ${rel(hit.file)}:${hit.block.line}`);
    else failures.push(`no compiled rule with appearance: none targets ${label}`);
  }
  return failures;
}

/**
 * Requirement 14.9 and the internal-only rule: the dashboard is not served in production.
 * The build prerenders `/design-check` as a 404 (status recorded in the .meta file, no dashboard
 * markup in the HTML), and page.tsx declares noindex, nofollow metadata and calls notFound().
 */
function checkDesignCheckInternalOnly() {
  const problems = [];
  const metaFile = join(SERVER_APP_DIR, "design-check.meta");
  if (!existsSync(metaFile)) {
    problems.push(`no prerender metadata for /design-check at ${rel(metaFile)}`);
  } else {
    const status = JSON.parse(readFileSync(metaFile, "utf8")).status;
    if (status !== 404) problems.push(`the production prerender of /design-check has status ${status}, expected 404`);
    else console.log("       /design-check is prerendered with status 404");
  }
  const html = readPrerenderedHtml("/design-check");
  if (html.includes("Medicare design system")) problems.push("the production HTML of /design-check contains the dashboard");
  const pageFile = join(FRONTEND_ROOT, "src/app/design-check/page.tsx");
  const page = readFileSync(pageFile, "utf8");
  if (!/robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/.test(page)) problems.push("page.tsx does not declare robots { index: false, follow: false }");
  if (!/process\.env\.NODE_ENV\s*===\s*"production"[\s\S]{0,40}notFound\(\)/.test(page)) problems.push("page.tsx does not call notFound() when NODE_ENV is production");
  return problems;
}

const STAGE_2_CHECKS = [
  { name: "compiled CSS has bg-primary, text-secondary, bg-accent, xs:flex, font-montserrat, shadow-custom, prose, aspect-w-16 (3.1, 3.2)", run: checkLegacyCoverageClasses },
  { name: "compiled CSS has all 23 @utility classes and their variant forms used in src (3.4)", run: checkUtilityCoverage },
  { name: "compiled CSS has the @tailwindcss/forms base rules for input, select and textarea (3.2)", run: checkFormsBaseRules },
  { name: "/design-check is internal only: 404 in the production build, noindex and nofollow metadata (14.9)", run: checkDesignCheckInternalOnly },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let stage;
try {
  stage = getStage(process.argv.slice(2));
} catch (error) {
  console.error(`build-output.check: ${error.message}`);
  process.exit(2);
}

console.log(`build-output.check: stage ${stage}, root ${FRONTEND_ROOT}`);

if (!existsSync(NEXT_DIR) || !existsSync(BUILD_ID) || !existsSync(SERVER_APP_DIR)) {
  console.log(`  FAIL no production build found at ${rel(NEXT_DIR)}/ (missing BUILD_ID or server/app).`);
  console.log("       Run `npm run build` in frontend/ first, then run this check again.");
  process.exit(1);
}

const builtAt = statSync(BUILD_ID).mtimeMs;
const stale = BUILD_INPUTS.filter((f) => existsSync(f) && statSync(f).mtimeMs > builtAt);
if (stale.length > 0) {
  console.log(`  warn build may be stale; changed since the last build: ${stale.map(rel).join(", ")}. Run \`npm run build\` again.`);
}

const checks = stage === 2 ? [...STAGE_1_CHECKS, ...STAGE_2_CHECKS] : STAGE_1_CHECKS;
let failed = 0;
for (const check of checks) {
  console.log(`  ...  ${check.name}`);
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
console.log(`build-output.check: ${checks.length - failed} of ${checks.length} checks passed`);
process.exit(failed > 0 ? 1 : 0);
