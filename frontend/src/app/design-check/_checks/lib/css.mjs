// Shared CSS helpers for the `_checks/*.check.mjs` scripts (task 7.1).
//
// Reads and parses the stylesheets the checks compare:
//   - `globals`        frontend/src/app/globals.css (Globals_Stylesheet)
//   - `legacy`         frontend-react/src/index.css (Legacy_App stylesheet)
//   - `tailwind`       frontend/node_modules/tailwindcss/theme.css (4.3.3)
//   - `legacyTailwind` frontend-react/node_modules/tailwindcss/theme.css (4.1.8)
//
// The parser builds a tree of blocks (`:root`, `.dark`, `@theme`,
// `@theme inline`, `@utility`, plain rules, `@keyframes`, `@media` and
// `@layer` wrappers) with their declarations and statement at-rules such
// as `@apply`. It is a small purpose-built parser for these files, not a
// general CSS parser.
//
// Colors are compared as number triples. This file contains no hex color
// literals (Requirement 10.5). Node built-ins only.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/** Absolute path of `frontend/` (this file is frontend/src/app/design-check/_checks/lib/css.mjs). */
export const FRONTEND_ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
/** Absolute path of the repository root (parent of `frontend/` and `frontend-react/`). */
export const REPO_ROOT = join(FRONTEND_ROOT, "..");
export const LEGACY_ROOT = join(REPO_ROOT, "frontend-react");

export const STYLESHEETS = Object.freeze({
  globals: join(FRONTEND_ROOT, "src", "app", "globals.css"),
  legacy: join(LEGACY_ROOT, "src", "index.css"),
  tailwind: join(FRONTEND_ROOT, "node_modules", "tailwindcss", "theme.css"),
  legacyTailwind: join(LEGACY_ROOT, "node_modules", "tailwindcss", "theme.css"),
});

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/** 1-based line number of `offset` in `text`. */
export function lineOf(text, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i += 1) if (text.charCodeAt(i) === 10) line += 1;
  return line;
}

/**
 * Replace every comment with spaces (newlines kept) so offsets and line
 * numbers stay valid. Strings are respected. Returns the blanked text and
 * the comment list.
 */
function blankComments(text) {
  const out = text.split("");
  const comments = [];
  let quote = null;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === "\\") i += 1;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (c === "/" && text[i + 1] === "*") {
      const close = text.indexOf("*/", i + 2);
      const end = close === -1 ? text.length : close + 2;
      comments.push({ text: text.slice(i + 2, end - 2).trim(), start: i, end, line: lineOf(text, i) });
      for (let j = i; j < end; j += 1) if (out[j] !== "\n") out[j] = " ";
      i = end - 1;
    }
  }
  return { text: out.join(""), comments };
}

/**
 * Collapse whitespace runs to one space outside quoted strings, drop
 * whitespace just inside parentheses, and trim.
 */
export function collapseWhitespace(value) {
  let out = "";
  let quote = null;
  let pendingSpace = false;
  for (let i = 0; i < value.length; i += 1) {
    const c = value[i];
    if (quote) {
      out += c;
      if (c === "\\" && i + 1 < value.length) out += value[++i];
      else if (c === quote) quote = null;
      continue;
    }
    if (/\s/.test(c)) {
      pendingSpace = true;
      continue;
    }
    // No space directly inside parentheses: `f( a )` and `f(a)` compare equal.
    if (pendingSpace && out.length > 0 && c !== ")" && !out.endsWith("(")) out += " ";
    pendingSpace = false;
    if (c === '"' || c === "'") quote = c;
    out += c;
  }
  return out;
}

/** Classify a block from its kind, at-rule name, prelude or selector. */
function classify(kind, name, prelude) {
  if (kind === "rule") {
    if (prelude === ":root" || /^:root\s*,\s*\.light$/.test(prelude)) return "root";
    if (prelude === ".dark") return "dark";
    return "rule";
  }
  if (name === "theme") return prelude.split(/\s+/).includes("inline") ? "theme-inline" : "theme";
  if (name === "utility") return "utility";
  if (/^(-[a-z]+-)?keyframes$/.test(name)) return "keyframes";
  if (name === "media" || name === "layer" || name === "supports" || name === "container") return name;
  return `at-${name}`;
}

function makeBlock(kind, header, start, text, parent) {
  let name = null;
  let prelude = header;
  if (kind === "atrule") {
    const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(header);
    name = m[1].toLowerCase();
    prelude = collapseWhitespace(m[2]);
  } else {
    prelude = collapseWhitespace(header);
  }
  const block = {
    kind,
    type: classify(kind, name, prelude),
    name,
    prelude,
    selector: kind === "rule" ? prelude : null,
    start,
    line: lineOf(text, start),
    end: -1,
    endLine: -1,
    declarations: [],
    statements: [],
    children: [],
  };
  Object.defineProperty(block, "parent", { value: parent, enumerable: false });
  return block;
}

/** Handle the text between two boundaries: a declaration or a statement at-rule. */
function addItem(block, raw, start, text) {
  const item = raw.trim();
  if (!item) return;
  const line = lineOf(text, start);
  if (item.startsWith("@")) {
    const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(item);
    block.statements.push({ name: m[1].toLowerCase(), prelude: collapseWhitespace(m[2]), line, start });
    return;
  }
  const colon = item.indexOf(":");
  if (colon === -1) {
    block.statements.push({ name: null, prelude: collapseWhitespace(item), line, start });
    return;
  }
  const prop = item.slice(0, colon).trim();
  let value = collapseWhitespace(item.slice(colon + 1));
  const important = /!\s*important$/i.test(value);
  if (important) value = value.replace(/\s*!\s*important$/i, "");
  block.declarations.push({ prop, value, important, line, start });
}

/**
 * Parse CSS text into a tree. Returns
 * `{ file, text, comments, root, blocks }` where `root` is a pseudo block
 * holding top-level statements (`@import`, `@plugin`, …) and children, and
 * `blocks` is every block in document order.
 */
export function parseCss(source, file = null) {
  const { text, comments } = blankComments(source);
  const root = makeBlock("rule", "", 0, text, null);
  root.type = "stylesheet";
  root.selector = null;
  const blocks = [];
  const stack = [root];
  let bufStart = 0;
  let quote = null;
  let parens = 0;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quote) {
      if (c === "\\") i += 1;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === "(") parens += 1;
    else if (c === ")") parens = Math.max(0, parens - 1);
    else if (parens === 0 && (c === "{" || c === ";" || c === "}")) {
      const raw = text.slice(bufStart, i);
      const lead = raw.length - raw.trimStart().length;
      const itemStart = bufStart + lead;
      const current = stack[stack.length - 1];
      if (c === "{") {
        const header = raw.trim();
        const block = makeBlock(header.startsWith("@") ? "atrule" : "rule", header, itemStart, text, current);
        current.children.push(block);
        blocks.push(block);
        stack.push(block);
      } else if (c === ";") {
        addItem(current, raw, itemStart, text);
      } else {
        addItem(current, raw, itemStart, text);
        if (stack.length === 1) throw new Error(`${file ?? "css"}:${lineOf(text, i)}: unmatched "}"`);
        current.end = i;
        current.endLine = lineOf(text, i);
        stack.pop();
      }
      bufStart = i + 1;
    }
  }
  addItem(root, text.slice(bufStart), bufStart, text);
  if (stack.length !== 1) {
    const open = stack[stack.length - 1];
    throw new Error(`${file ?? "css"}:${open.line}: unclosed block "${open.prelude}"`);
  }
  root.end = text.length;
  root.endLine = lineOf(text, text.length);
  return { file, text: source, comments, root, blocks };
}

const cache = new Map();

/**
 * Read and parse a stylesheet by key (`globals`, `legacy`, `tailwind`,
 * `legacyTailwind`) or by absolute path. Results are cached per process.
 */
export function loadStylesheet(keyOrPath) {
  const file = STYLESHEETS[keyOrPath] ?? keyOrPath;
  if (!cache.has(file)) cache.set(file, parseCss(readFileSync(file, "utf8"), file));
  return cache.get(file);
}

// ---------------------------------------------------------------------------
// Block queries
// ---------------------------------------------------------------------------

/** Ancestors of a block, nearest first, excluding the stylesheet root. */
export function ancestors(block) {
  const out = [];
  for (let p = block.parent; p && p.type !== "stylesheet"; p = p.parent) out.push(p);
  return out;
}

/** True when the block sits directly in the stylesheet (no wrapper). */
export const isTopLevel = (block) => block.parent?.type === "stylesheet";

/** Every block matching `type` (string, array of strings, or predicate). */
export function findBlocks(sheet, type) {
  const test =
    typeof type === "function" ? type : Array.isArray(type) ? (b) => type.includes(b.type) : (b) => b.type === type;
  return sheet.blocks.filter(test);
}

/** Flatten the declarations of several blocks, in order, tagged with their block. */
export function declarationsOf(blocks) {
  return blocks.flatMap((block) => block.declarations.map((d) => ({ ...d, block })));
}

/**
 * Build a Map prop → value from a declaration list. Later declarations win,
 * like the cascade. `duplicates` lists every prop declared more than once.
 */
export function toMap(declarations) {
  const map = new Map();
  const duplicates = [];
  for (const d of declarations) {
    if (map.has(d.prop)) duplicates.push(d.prop);
    map.set(d.prop, d.value);
  }
  return Object.assign(map, { duplicates });
}

const allPrefixed = (block, prefix) =>
  block.declarations.length > 0 && block.declarations.every((d) => d.prop.startsWith(prefix));

/** Top-level `:root` blocks. */
export const rootBlocks = (sheet) => findBlocks(sheet, (b) => b.type === "root" && isTopLevel(b));
/** Top-level `.dark` blocks. */
export const darkBlocks = (sheet) => findBlocks(sheet, (b) => b.type === "dark" && isTopLevel(b));

/** The first top-level `:root` block whose declarations are all `--prim-*`. */
export const primitiveRootBlock = (sheet) => rootBlocks(sheet).find((b) => allPrefixed(b, "--prim-")) ?? null;
/** The first top-level `:root` block whose declarations are all `--sem-*`. */
export const semanticRootBlock = (sheet) => rootBlocks(sheet).find((b) => allPrefixed(b, "--sem-")) ?? null;

/** Primitive_Tokens: every `--prim-*` declaration in top-level `:root` blocks. */
export const getPrimitiveDeclarations = (sheet) =>
  declarationsOf(rootBlocks(sheet)).filter((d) => d.prop.startsWith("--prim-"));
export const getPrimitives = (sheet) => toMap(getPrimitiveDeclarations(sheet));

/**
 * Semantic_Tokens for a theme: `--sem-*` declarations of the top-level
 * `:root` blocks (`light`) or `.dark` blocks (`dark`).
 */
export function getSemanticDeclarations(sheet, theme = "light") {
  const blocks = theme === "dark" ? darkBlocks(sheet) : rootBlocks(sheet);
  return declarationsOf(blocks).filter((d) => d.prop.startsWith("--sem-"));
}
export const getSemantics = (sheet, theme = "light") => toMap(getSemanticDeclarations(sheet, theme));

/** Top-level `@theme` blocks without `inline` (includes `@theme default`). */
export const themeBlocks = (sheet) => findBlocks(sheet, (b) => b.type === "theme" && isTopLevel(b));
/** Top-level `@theme … inline …` blocks. */
export const themeInlineBlocks = (sheet) => findBlocks(sheet, (b) => b.type === "theme-inline" && isTopLevel(b));

export const getThemeDeclarations = (sheet) => declarationsOf(themeBlocks(sheet));
export const getTheme = (sheet) => toMap(getThemeDeclarations(sheet));
export const getThemeInlineDeclarations = (sheet) => declarationsOf(themeInlineBlocks(sheet));
export const getThemeInline = (sheet) => toMap(getThemeInlineDeclarations(sheet));

/**
 * Tailwind palette colors (`--color-*`) from the `@theme default` block of
 * a Tailwind `theme.css`, for example `--color-gray-100`.
 */
export const getPalette = (sheet) =>
  toMap(getThemeDeclarations(sheet).filter((d) => d.prop.startsWith("--color-")));

/** `@utility` blocks as Map name → block. */
export function getUtilities(sheet) {
  return new Map(findBlocks(sheet, "utility").map((b) => [b.prelude, b]));
}

/** Class names listed by the `@apply` statements of a block, in order. */
export function applyClasses(block) {
  return block.statements.filter((s) => s.name === "apply").flatMap((s) => s.prelude.split(" ").filter(Boolean));
}

/**
 * `@keyframes` blocks as Map name → block (searched at any depth, so the
 * keyframes inside Tailwind's `@theme default` are included). Each block's
 * `children` are the frames, with `selector` such as `0%, 100%` or `from`.
 */
export function getKeyframes(sheet) {
  return new Map(findBlocks(sheet, "keyframes").map((b) => [b.prelude, b]));
}

/**
 * Plain style rules outside `@utility`, `@keyframes` and `@theme`, at any
 * depth. Rules inside `@media`, `@layer` or `@supports` are included; use
 * `ancestors(block)` to read their wrappers. `:root` and `.dark` are
 * excluded unless `includeTokens` is true.
 */
export function getRules(sheet, { includeTokens = false } = {}) {
  const skip = new Set(["utility", "keyframes", "theme", "theme-inline"]);
  return findBlocks(sheet, (b) => {
    if (b.kind !== "rule") return false;
    if (!includeTokens && (b.type === "root" || b.type === "dark")) return false;
    return !ancestors(b).some((a) => skip.has(a.type) || a.kind === "rule");
  });
}

/** Wrapper at-rule blocks: `@media`, `@layer`, `@supports`, `@container`. */
export const getWrappers = (sheet) => findBlocks(sheet, ["media", "layer", "supports", "container"]);
export const getMediaBlocks = (sheet) => findBlocks(sheet, "media");

/** Top-level statement at-rules (`@import`, `@plugin`, `@custom-variant`, …). */
export const getStatements = (sheet) => sheet.root.statements;

// ---------------------------------------------------------------------------
// var() references and the primitive resolver
// ---------------------------------------------------------------------------

/** The custom property name when `value` is exactly one `var(--x)`, else null. */
export function singleVarRef(value) {
  const m = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value.trim());
  return m ? m[1] : null;
}

/** Every custom property name referenced by `var()` in `value`. */
export function varRefs(value) {
  return [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);
}

/**
 * Follow single `var(--x)` references through `scopes` (Maps searched in
 * order) until a value that is not a single reference is reached.
 * Returns `{ value, chain }` on success, or `{ error, chain }` when a name
 * is undeclared or the chain loops.
 */
export function resolveVar(value, scopes) {
  const chain = [];
  let current = value;
  for (;;) {
    const name = singleVarRef(current);
    if (!name) return { value: current, chain };
    if (chain.includes(name)) return { error: `cycle at ${name}`, chain };
    chain.push(name);
    const scope = scopes.find((s) => s.has(name));
    if (!scope) return { error: `undeclared ${name}`, chain };
    current = scope.get(name);
  }
}

/**
 * Resolve a Semantic_Token (or any value) of `sheet` to its Primitive_Token
 * literal. Light uses `:root`, dark uses `.dark` then `:root`.
 * Returns `{ value, chain, primitive }` or `{ error, chain }`; `primitive`
 * is the last `--prim-*` name in the chain.
 */
export function resolvePrimitive(sheet, nameOrValue, theme = "light") {
  const primitives = getPrimitives(sheet);
  const scopes = theme === "dark" ? [getSemantics(sheet, "dark"), getSemantics(sheet, "light"), primitives] : [getSemantics(sheet, "light"), primitives];
  const start = nameOrValue.startsWith("--") ? `var(${nameOrValue})` : nameOrValue;
  const result = resolveVar(start, scopes);
  if (result.error) return result;
  const primitive = [...result.chain].reverse().find((n) => n.startsWith("--prim-")) ?? null;
  return { ...result, primitive };
}

// ---------------------------------------------------------------------------
// Colors as number triples
// ---------------------------------------------------------------------------

/**
 * `#` followed by exactly 3, 4, 6 or 8 hex digits, not followed by a
 * letter, digit or underscore (Requirement 10.5 definition). Global, case
 * insensitive.
 */
export const HEX_LITERAL_RE = /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})(?![0-9a-z_])/gi;

/** Every raw hex color literal in `text` with its offset and line. */
export function findHexLiterals(text) {
  return [...text.matchAll(HEX_LITERAL_RE)].map((m) => ({ match: m[0], index: m.index, line: lineOf(text, m.index) }));
}

const clamp255 = (n) => Math.min(255, Math.max(0, Math.round(n)));

/** Parse one rgb() channel: a number or a percentage. */
function rgbChannel(token) {
  if (token.endsWith("%")) return clamp255((Number.parseFloat(token) / 100) * 255);
  return clamp255(Number.parseFloat(token));
}

/** Parse an alpha token: a number or a percentage. */
function alphaValue(token) {
  if (token === undefined) return 1;
  return token.endsWith("%") ? Number.parseFloat(token) / 100 : Number.parseFloat(token);
}

/**
 * Parse a CSS color into a comparable form.
 *   - hex and `rgb()`/`rgba()`: `{ space: "srgb", rgb: [r, g, b], alpha }`
 *   - `oklch()`: `{ space: "oklch", text }` (exact string, whitespace collapsed)
 *   - `transparent`, `currentcolor`, `inherit`: `{ space: "keyword", text }`
 * Returns null for anything else (including values with `var()`).
 */
export function parseColor(value) {
  const v = collapseWhitespace(value).toLowerCase();
  if (v.startsWith("#")) {
    const digits = v.slice(1);
    if (!/^[0-9a-f]+$/.test(digits) || ![3, 4, 6, 8].includes(digits.length)) return null;
    const full = digits.length <= 4 ? [...digits].map((c) => c + c).join("") : digits;
    const n = [];
    for (let i = 0; i < full.length; i += 2) n.push(Number.parseInt(full.slice(i, i + 2), 16));
    return { space: "srgb", rgb: n.slice(0, 3), alpha: n.length === 4 ? n[3] / 255 : 1 };
  }
  const rgb = /^rgba?\(([^)]*)\)$/.exec(v);
  if (rgb) {
    const [main, slashAlpha] = rgb[1].split("/").map((s) => s.trim());
    const parts = main.split(/[\s,]+/).filter(Boolean);
    if (parts.length < 3 || parts.length > 4) return null;
    const channels = parts.slice(0, 3).map(rgbChannel);
    if (channels.some(Number.isNaN)) return null;
    return { space: "srgb", rgb: channels, alpha: alphaValue(slashAlpha ?? parts[3]) };
  }
  if (/^oklch\([^)]*\)$/.test(v)) return { space: "oklch", text: v };
  if (v === "transparent" || v === "currentcolor" || v === "inherit") return { space: "keyword", text: v };
  return null;
}

/** The 8-bit `[r, g, b]` triple of a hex or `rgb()` value, or null. */
export function toTriple(value) {
  const c = parseColor(value);
  return c && c.space === "srgb" ? c.rgb : null;
}

/** True when two triples have equal channels. */
export const tripleEquals = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((n, i) => n === b[i]);

/** `rgb(r, g, b)` text for messages. */
export const formatTriple = (t) => (Array.isArray(t) ? `rgb(${t.join(", ")})` : String(t));

/**
 * Compare two color values: channels and alpha for sRGB values, the exact
 * collapsed string for `oklch()` and keywords. Returns false if either
 * value does not parse.
 */
export function sameColor(a, b) {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb || ca.space !== cb.space) return false;
  if (ca.space === "srgb") return tripleEquals(ca.rgb, cb.rgb) && Math.abs(ca.alpha - cb.alpha) < 1e-9;
  return ca.text === cb.text;
}

// ---------------------------------------------------------------------------
// Script helpers
// ---------------------------------------------------------------------------

/** The `--stage=1|2` argument of a check script, defaulting to 1. */
export function getStage(argv = process.argv.slice(2)) {
  const arg = argv.find((a) => a.startsWith("--stage="));
  if (!arg) return 1;
  const stage = Number(arg.slice("--stage=".length));
  if (stage !== 1 && stage !== 2) throw new Error(`invalid ${arg}; expected --stage=1 or --stage=2`);
  return stage;
}
