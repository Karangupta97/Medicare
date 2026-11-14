#!/usr/bin/env node
// Legacy inventory report (task 3.1).
// Scans `.js`, `.jsx`, `.ts`, `.tsx`, `.css` and `.html` files under
// `frontend-react/src` and prints, as Markdown:
//   - the hex inventory (Requirement 4.1)
//   - single-file values (4.5, 17.3 a) and near-duplicate pairs (4.6, 17.3 d)
//   - font-weight class and numeric weight counts (5.10)
//   - Legacy_Token usage counts (17.1, 17.2) and `font-montserrat` files (17.5)
//   - the real format of `frontend-react/public/logo.png` (17.4)
//
// Report only: the file name ends in `.report.mjs`, so the check runner skips it.
// This file contains no color literals (Requirement 10.5); colors are handled
// as number triples. Node built-ins only.
//
// Usage (from `frontend/`): node src/app/design-check/_checks/legacy-inventory.report.mjs

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const LEGACY_ROOT = join(REPO_ROOT, "frontend-react");
const LEGACY_SRC = join(LEGACY_ROOT, "src");
const EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".css", ".html"]);

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      out.push(...walk(full));
    } else if (entry.isFile() && EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

const repoPath = (full) => relative(REPO_ROOT, full).split(sep).join("/");

/** Replace every `@theme … { … }` block with spaces (newlines kept) so offsets stay valid. */
function blankThemeBlocks(text) {
  const chars = text.split("");
  const re = /@theme\b[^{;]*\{/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    let depth = 0;
    let end = m.index;
    for (let i = m.index; i < text.length; i += 1) {
      if (text[i] === "{") depth += 1;
      else if (text[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    for (let i = m.index; i <= end; i += 1) if (chars[i] !== "\n") chars[i] = " ";
    re.lastIndex = end + 1;
  }
  return chars.join("");
}

// ---------------------------------------------------------------------------
// Hex inventory (4.1)
// ---------------------------------------------------------------------------

// `#` + exactly 8, 6, 4 or 3 hex digits, not followed by a letter, digit or underscore.
const HEX_RE = /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})(?![0-9a-z_])/gi;

function normalizeHex(digits) {
  const d = digits.toLowerCase();
  if (d.length === 3 || d.length === 4) return d.split("").map((c) => c + c).join("");
  return d;
}

/** Channels as numbers [r, g, b, a]; alpha is 255 for 6-digit values. */
function channels(norm) {
  const out = [];
  for (let i = 0; i < norm.length; i += 2) out.push(Number.parseInt(norm.slice(i, i + 2), 16));
  if (out.length === 3) out.push(255);
  return out;
}

const TW_PROPERTY = {
  bg: "background-color",
  text: "color",
  border: "border-color",
  "border-t": "border-color",
  "border-r": "border-color",
  "border-b": "border-color",
  "border-l": "border-color",
  "border-x": "border-color",
  "border-y": "border-color",
  divide: "border-color",
  from: "gradient-stop",
  via: "gradient-stop",
  to: "gradient-stop",
  ring: "ring-color",
  "ring-offset": "ring-offset-color",
  shadow: "box-shadow",
  outline: "outline-color",
  fill: "fill",
  stroke: "stroke",
  placeholder: "color (placeholder)",
  decoration: "text-decoration-color",
  caret: "caret-color",
  accent: "accent-color",
};

const kebab = (name) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * Classify the context of a hex match.
 * Returns { property, variant } where property is a CSS property name, a
 * Tailwind-derived property, `--custom-property`, `key:<name>` for a JS
 * object key that is not a CSS property, `attr:<name>` for a JSX/HTML
 * attribute that is not a CSS property, or `other`.
 */
function classify(text, index) {
  const lineStart = text.lastIndexOf("\n", index - 1) + 1;
  const line = text.slice(lineStart, index);

  // Tailwind arbitrary value: `hover:bg-[#…]`, `shadow-[0_0_4px_#…]`.
  const tw = /(?:^|[^\w[\]-])((?:[\w-]+:)*)!?([a-z]+(?:-[a-z]+)*)-\[[^\]\s"'`]*$/.exec(line);
  if (tw) {
    const variant = tw[1] ? tw[1].slice(0, -1) : "";
    return { property: TW_PROPERTY[tw[2]] ?? `tw:${tw[2]}`, variant };
  }

  // Attribute: `fill="#…"`, `stopColor="#…"`, `fill={'#…'}`.
  const attr = /([A-Za-z][\w-]*)=\s*[{"'`]*\s*$/.exec(line);
  if (attr) {
    const k = kebab(attr[1]);
    return { property: CSS_PROPERTIES.has(k) ? k : `attr:${attr[1]}`, variant: "" };
  }

  // Declaration or object key: `color: #…`, `backgroundColor: '#…'`,
  // `background: linear-gradient(135deg, #… 0%, #… 100%)`. Look back to the
  // last `;`, `{` or `}` so multi-line values are attributed to their property.
  const start = Math.max(text.lastIndexOf(";", index - 1), text.lastIndexOf("{", index - 1), text.lastIndexOf("}", index - 1));
  const chunk = text.slice(start + 1, index);
  const decl = /(?:^|[\s,'"`])['"]?(--[\w-]+|[A-Za-z][\w-]*)['"]?\s*:\s*[^:;{}]*$/.exec(chunk);
  if (decl) {
    const name = decl[1];
    if (name.startsWith("--")) return { property: name, variant: "" };
    const k = kebab(name);
    if (CSS_PROPERTIES.has(k)) return { property: k, variant: "" };
    return { property: `key:${name}`, variant: "" };
  }
  return { property: "other", variant: "" };
}

const CSS_PROPERTIES = new Set([
  "color",
  "background",
  "background-color",
  "background-image",
  "border",
  "border-color",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline",
  "outline-color",
  "box-shadow",
  "text-shadow",
  "fill",
  "stroke",
  "stop-color",
  "caret-color",
  "accent-color",
  "text-decoration-color",
  "scrollbar-color",
  "filter",
  "-webkit-text-fill-color",
  "webkit-text-fill-color",
]);

// ---------------------------------------------------------------------------
// Font weights (5.10)
// ---------------------------------------------------------------------------

const WEIGHT_CLASSES = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};
const KEYWORD_WEIGHTS = { normal: 400, bold: 700 };
const LOADED_FACES = [400, 500, 700, 900]; // Requirement 5.1

/** CSS Fonts Level 4 weight matching against the loaded faces. */
function resolveFace(desired, faces = LOADED_FACES) {
  const asc = [...faces].sort((a, b) => a - b);
  const desc = [...asc].reverse();
  if (asc.includes(desired)) return desired;
  if (desired >= 400 && desired <= 500) {
    return asc.find((w) => w > desired && w <= 500) ?? desc.find((w) => w < desired) ?? asc.find((w) => w > 500);
  }
  if (desired < 400) return desc.find((w) => w < desired) ?? asc.find((w) => w > desired);
  return asc.find((w) => w > desired) ?? desc.find((w) => w < desired);
}

const WEIGHT_CLASS_RE = /(?<![\w-])font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)(?![\w-])/g;
const WEIGHT_ARBITRARY_RE = /(?<![\w-])font-\[(\d{3})\]/g;
const WEIGHT_DECL_RE = /(?:font-weight|fontWeight)\s*[:=]\s*[{'"`]*\s*(\d{3}|bold|normal|bolder|lighter)(?![\w-])/gi;

// ---------------------------------------------------------------------------
// Legacy_Tokens (17.1, 17.2, 17.5)
// ---------------------------------------------------------------------------

const COLOR_UTILITIES =
  "bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|outline|divide|from|via|to|fill|stroke|shadow|inset-shadow|inset-ring|decoration|accent|caret|placeholder";
const colorTokenRe = (name) =>
  new RegExp(`(?<![\\w-])(${COLOR_UTILITIES})-${name}(?:\\/[\\w.%\\[\\]-]+)?(?![\\w-])`, "g");

const TOKENS = [
  { name: "primary", utility: colorTokenRe("primary"), cssVar: /--color-primary(?![\w-])/g },
  { name: "secondary", utility: colorTokenRe("secondary"), cssVar: /--color-secondary(?![\w-])/g },
  { name: "accent", utility: colorTokenRe("accent"), cssVar: /--color-accent(?![\w-])/g },
  // A Tailwind variant has no whitespace or quote after the colon; `@xs:` is a container query.
  { name: "xs", utility: /(?<![\w@-])((?:max-)?xs):(?=[^\s'"`,;)}])/g, cssVar: /--breakpoint-xs(?![\w-])/g },
  { name: "font-montserrat", utility: /(?<![\w-])(font-montserrat)(?![\w-])/g, cssVar: /--font-montserrat(?![\w-])/g },
  { name: "shadow-custom", utility: /(?<![\w-])(shadow-custom)(?:\/[\w.%[\]-]+)?(?![\w-])/g, cssVar: /--shadow-custom(?![\w-])/g },
];
// Every `xs:` occurrence, for the false-positive check.
const XS_RAW_RE = /xs:/g;
// Class-like tokens that contain a Legacy_Token name only as a substring.
const SUBSTRING_RE = /(?<![\w-])[\w-]*-(primary|secondary|accent)[\w-]*|(?<![\w-])(primary|secondary|accent)-[\w-]+/g;

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------

const files = walk(LEGACY_SRC).sort();
const hex = new Map(); // norm -> { count, files:Set, props:Map, variants:Map }
const weights = new Map(); // label -> { count, files:Set, weight }
const tokens = new Map(TOKENS.map((t) => [t.name, { count: 0, files: new Map(), forms: new Map() }]));
const substrings = new Map(); // class-like token -> { count, files:Set }
let xsRaw = 0;
const xsRawFiles = new Set();

const bump = (map, key, by = 1) => map.set(key, (map.get(key) ?? 0) + by);

for (const full of files) {
  const path = repoPath(full);
  const text = readFileSync(full, "utf8");

  for (const m of text.matchAll(HEX_RE)) {
    const norm = normalizeHex(m[1]);
    const entry = hex.get(norm) ?? { count: 0, files: new Set(), props: new Map(), variants: new Map() };
    entry.count += 1;
    entry.files.add(path);
    const { property, variant } = classify(text, m.index);
    bump(entry.props, property);
    if (variant) bump(entry.variants, variant);
    hex.set(norm, entry);
  }

  const addWeight = (label, weight) => {
    const e = weights.get(label) ?? { count: 0, files: new Set(), weight };
    e.count += 1;
    e.files.add(path);
    weights.set(label, e);
  };
  for (const m of text.matchAll(WEIGHT_CLASS_RE)) addWeight(`font-${m[1]}`, WEIGHT_CLASSES[m[1]]);
  for (const m of text.matchAll(WEIGHT_ARBITRARY_RE)) addWeight(`font-[${m[1]}]`, Number(m[1]));
  for (const m of text.matchAll(WEIGHT_DECL_RE)) {
    const v = m[1].toLowerCase();
    const w = /^\d+$/.test(v) ? Number(v) : KEYWORD_WEIGHTS[v];
    addWeight(`font-weight ${v}`, w);
  }

  const scoped = extname(full) === ".css" ? blankThemeBlocks(text) : text;
  for (const t of TOKENS) {
    const e = tokens.get(t.name);
    for (const re of [t.utility, t.cssVar]) {
      for (const m of scoped.matchAll(re)) {
        e.count += 1;
        bump(e.files, path);
        bump(e.forms, m[0].startsWith("--") ? `var ${m[0]}` : m[0].replace(/\/.*$/, "/…"));
      }
    }
  }
  const xsHits = scoped.match(XS_RAW_RE)?.length ?? 0;
  if (xsHits > 0) {
    xsRaw += xsHits;
    xsRawFiles.add(path);
  }
  for (const m of scoped.matchAll(SUBSTRING_RE)) {
    const tok = m[0];
    let counted = false;
    for (const t of TOKENS.slice(0, 3)) {
      t.utility.lastIndex = 0;
      const u = t.utility.exec(tok);
      if (u && u.index === 0 && u[0].length === tok.length) counted = true;
    }
    if (counted || tok.startsWith("--")) continue;
    const e = substrings.get(tok) ?? { count: 0, files: new Set() };
    e.count += 1;
    e.files.add(path);
    substrings.set(tok, e);
  }
}

// ---------------------------------------------------------------------------
// Favicon (17.4)
// ---------------------------------------------------------------------------

function sniff(bytes) {
  const starts = (sig) => sig.every((b, i) => bytes[i] === b);
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    const colorTypes = { 0: "grayscale", 2: "RGB", 3: "indexed", 4: "grayscale+alpha", 6: "RGBA" };
    return `PNG (signature 89 50 4E 47 0D 0A 1A 0A), ${width}×${height}, bit depth ${bytes[24]}, color type ${bytes[25]} (${colorTypes[bytes[25]] ?? "unknown"})`;
  }
  if (starts([0xff, 0xd8, 0xff])) return "JPEG";
  if (starts([0x47, 0x49, 0x46, 0x38])) return "GIF";
  if (starts([0x52, 0x49, 0x46, 0x46]) && bytes.toString("ascii", 8, 12) === "WEBP") return "WebP";
  if (starts([0x00, 0x00, 0x01, 0x00])) return "ICO";
  const head = bytes.toString("utf8").trimStart();
  if (head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"))) return "SVG";
  return `unknown (first bytes ${[...bytes.subarray(0, 8)].map((b) => b.toString(16).padStart(2, "0")).join(" ")})`;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const lines = [];
const out = (s = "") => lines.push(s);
const fmtMap = (map) =>
  [...map.entries()]
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
    .map(([k, v]) => `${k} ${v}`)
    .join(", ");
const show = (norm) => `\`${String.fromCharCode(35)}${norm}\``; // 35 is the number sign

const inventory = [...hex.entries()].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]));
const totalOccurrences = inventory.reduce((s, [, e]) => s + e.count, 0);
const singleFile = inventory.filter(([, e]) => e.files.size === 1);

out(`Scope: ${files.length} files (\`.js\`, \`.jsx\`, \`.ts\`, \`.tsx\`, \`.css\`, \`.html\`) under \`frontend-react/src\`.`);
out();
out("### Hex inventory (4.1)");
out();
out(`${inventory.length} distinct values, ${totalOccurrences} occurrences, ${singleFile.length} values in only one file.`);
out();
out("| Value | Count | Files | CSS properties seen | Variants |");
out("| :--- | ---: | ---: | :--- | :--- |");
for (const [norm, e] of inventory) {
  out(`| ${show(norm)} | ${e.count} | ${e.files.size} | ${fmtMap(e.props)} | ${fmtMap(e.variants) || "—"} |`);
}
out();

out("### Single-file values (4.5, 17.3 a)");
out();
out("| Value | Count | File |");
out("| :--- | ---: | :--- |");
for (const [norm, e] of [...singleFile].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))) {
  out(`| ${show(norm)} | ${e.count} | \`${[...e.files][0]}\` |`);
}
out();

out("### Near-duplicate pairs: every channel difference ≤ 4 (4.6, 17.3 d)");
out();
out("| Value A (count / files) | Value B (count / files) | ΔR ΔG ΔB ΔA | Files A | Files B |");
out("| :--- | :--- | :--- | :--- | :--- |");
const sortedValues = inventory.map(([n]) => n).sort();
let pairCount = 0;
for (let i = 0; i < sortedValues.length; i += 1) {
  for (let j = i + 1; j < sortedValues.length; j += 1) {
    const a = sortedValues[i];
    const b = sortedValues[j];
    const ca = channels(a);
    const cb = channels(b);
    const d = ca.map((v, k) => Math.abs(v - cb[k]));
    if (d.every((x) => x <= 4)) {
      pairCount += 1;
      const ea = hex.get(a);
      const eb = hex.get(b);
      const [hi, lo, ehi, elo, dd] = ea.count >= eb.count ? [a, b, ea, eb, d] : [b, a, eb, ea, d];
      out(
        `| ${show(hi)} (${ehi.count} / ${ehi.files.size}) | ${show(lo)} (${elo.count} / ${elo.files.size}) | ${dd.join(" ")} | ${[...ehi.files].map((f) => `\`${f}\``).join(", ")} | ${[...elo.files].map((f) => `\`${f}\``).join(", ")} |`,
      );
    }
  }
}
if (pairCount === 0) out("| none | | | | |");
out();
out(`${pairCount} pairs. Value A is the one with the higher occurrence count.`);
out();

out("### Font weights (5.10)");
out();
out(`Faces loaded: ${LOADED_FACES.join(", ")}. "Face" is the CSS Fonts weight-matching result against those faces.`);
out();
out("| Usage | Weight | Count | Files | Face |");
out("| :--- | ---: | ---: | ---: | ---: |");
for (const [label, e] of [...weights.entries()].sort((a, b) => (a[1].weight ?? 0) - (b[1].weight ?? 0) || b[1].count - a[1].count)) {
  out(`| \`${label}\` | ${e.weight ?? "?"} | ${e.count} | ${e.files.size} | ${e.weight ? resolveFace(e.weight) : "?"} |`);
}
const byWeight = new Map();
for (const e of weights.values()) {
  const w = byWeight.get(e.weight) ?? { count: 0, files: new Set() };
  w.count += e.count;
  for (const f of e.files) w.files.add(f);
  byWeight.set(e.weight, w);
}
out();
out("Combined by numeric weight (class + arbitrary + declaration):");
out();
out("| Weight | Count | Files | Face |");
out("| ---: | ---: | ---: | ---: |");
for (const w of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
  const e = byWeight.get(w);
  out(`| ${w} | ${e ? e.count : 0} | ${e ? e.files.size : 0} | ${resolveFace(w)} |`);
}
out();

out("### Legacy_Token usage (17.1, 17.2)");
out();
out("Excludes the `@theme` block in `frontend-react/src/index.css` and class names that contain the token name only as a substring.");
out();
out("| Token | Usages | Files | Forms | Paths |");
out("| :--- | ---: | ---: | :--- | :--- |");
for (const t of TOKENS) {
  const e = tokens.get(t.name);
  const paths = [...e.files.entries()].sort((a, b) => b[1] - a[1]).map(([f, c]) => `\`${f}\` (${c})`).join(", ");
  out(`| \`${t.name}\` | ${e.count} | ${e.files.size} | ${fmtMap(e.forms) || "—"} | ${paths || "—"} |`);
}
out();
const unused = TOKENS.filter((t) => tokens.get(t.name).count === 0).map((t) => `\`${t.name}\``);
out(`Unused (count 0): ${unused.length ? unused.join(", ") : "none"}.`);
out();
out(
  `\`xs:\` false-positive check: ${xsRaw} raw \`xs:\` substrings in ${xsRawFiles.size} files; ${tokens.get("xs").count} counted as the \`xs\` variant (no whitespace or quote after the colon, not preceded by a word character, \`-\` or \`@\`, plus \`--breakpoint-xs\`).`,
);
out();
out("Excluded substring matches (class-like names containing `primary`, `secondary` or `accent`):");
out();
out("| Name | Count | Files |");
out("| :--- | ---: | ---: |");
const subs = [...substrings.entries()].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]));
for (const [name, e] of subs) out(`| \`${name}\` | ${e.count} | ${e.files.size} |`);
if (subs.length === 0) out("| none | | |");
out();

out("### `font-montserrat` usage files (17.5)");
out();
const mont = tokens.get("font-montserrat");
out(mont.files.size ? [...mont.files.keys()].map((f) => `- \`${f}\``).join("\n") : "None: no file under `frontend-react/src` uses `font-montserrat` or `--font-montserrat` outside the `@theme` block.");
out();

out("### Favicon type mismatch (17.4)");
out();
const indexHtml = join(LEGACY_ROOT, "index.html");
const logoPng = join(LEGACY_ROOT, "public", "logo.png");
if (existsSync(indexHtml)) {
  const html = readFileSync(indexHtml, "utf8");
  for (const m of html.matchAll(/<link\b[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/gi)) {
    const type = /type=["']([^"']+)["']/i.exec(m[0])?.[1] ?? "(none)";
    const href = /href=["']([^"']+)["']/i.exec(m[0])?.[1] ?? "(none)";
    out(`- \`frontend-react/index.html\` declares \`type="${type}"\` for \`${href}\`.`);
  }
} else {
  out("- `frontend-react/index.html` not found.");
}
if (existsSync(logoPng)) {
  const fd = readFileSync(logoPng).subarray(0, 64);
  out(`- \`frontend-react/public/logo.png\` contents: ${sniff(Buffer.from(fd))}.`);
} else {
  out("- `frontend-react/public/logo.png` not found.");
}

process.stdout.write(`${lines.join("\n")}\n`);
