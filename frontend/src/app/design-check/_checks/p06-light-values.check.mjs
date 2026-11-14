#!/usr/bin/env node
// Feature: design-system-dark-mode, Property 6: Token values equal the DESIGN.md palette.
//
// The refreshed palette (DESIGN.md sections 3.2 and 3.3) supersedes the original
// Requirement 2 rule that light values equal the Legacy_App. This check compares
// `src/app/globals.css` with the palette as number triples:
//   1. every Primitive_Token has the section 3.2 value, and no primitive is missing or extra;
//   2. every Semantic_Token resolves, in `:root` (light) and in `.dark` (dark), through a
//      --prim-* token to the section 3.3 value, and no token is missing or extra;
//   3. the Legacy_Tokens follow section 3.4: --color-primary is an alias of brand,
//      --color-secondary and --color-accent map to the new secondary and accent tokens.
//
// Usage (from `frontend/`):
//   node src/app/design-check/_checks/p06-light-values.check.mjs [--stage=1|2]
// This file contains no hex color literals (Requirement 10.5). Node built-ins only.
import {
  formatTriple,
  getPrimitives,
  getSemantics,
  getStage,
  getThemeInline,
  loadStylesheet,
  resolvePrimitive,
  resolveVar,
  toTriple,
  tripleEquals,
} from "./lib/css.mjs";

getStage();

// Primitive name (without --prim-) to [r, g, b].
const PRIMITIVES = {
  "white": [255, 255, 255],
  "ink-50": [246, 247, 251],
  "ink-100": [237, 239, 247],
  "ink-200": [213, 217, 232],
  "ink-400": [128, 137, 171],
  "ink-600": [82, 90, 125],
  "ink-900": [18, 21, 46],
  "night-950": [10, 13, 34],
  "night-900": [16, 20, 58],
  "night-800": [23, 28, 71],
  "night-700": [42, 49, 102],
  "night-500": [108, 117, 170],
  "night-300": [163, 170, 208],
  "night-50": [237, 238, 248],
  "navy-900": [26, 30, 74],
  "navy-700": [37, 42, 97],
  "periwinkle-300": [169, 179, 245],
  "periwinkle-200": [192, 200, 248],
  "indigo-800": [47, 56, 128],
  "indigo-600": [74, 85, 176],
  "indigo-100": [230, 233, 249],
  "indigo-400": [143, 154, 230],
  "indigo-200": [195, 202, 246],
  "indigo-900": [31, 38, 88],
  "teal-900": [7, 83, 80],
  "teal-800": [9, 99, 96],
  "teal-700": [11, 124, 120],
  "teal-50": [221, 243, 241],
  "teal-200": [140, 235, 227],
  "teal-300": [107, 221, 212],
  "teal-400": [63, 207, 196],
  "teal-950": [6, 33, 31],
  "teal-surface-dark": [14, 47, 52],
  "green-700": [22, 118, 63],
  "green-50": [221, 243, 229],
  "green-400": [82, 212, 138],
  "green-950": [15, 45, 34],
  "amber-700": [154, 91, 6],
  "amber-50": [251, 239, 211],
  "amber-400": [242, 184, 75],
  "amber-950": [51, 40, 15],
  "rose-600": [194, 41, 75],
  "rose-50": [251, 227, 232],
  "rose-400": [244, 112, 139],
  "rose-950": [58, 21, 34],
  "vermilion-700": [179, 38, 14],
  "vermilion-50": [251, 225, 218],
  "vermilion-400": [255, 122, 92],
  "vermilion-950": [68, 25, 15],
  "black": [0, 0, 0],
  "night-1000": [5, 6, 26],
};

// Semantic name (without --sem-) to [r, g, b] per theme.
const SEMANTIC = {
  "page": { light: [246, 247, 251], dark: [10, 13, 34] },
  "surface": { light: [255, 255, 255], dark: [16, 20, 58] },
  "surface-muted": { light: [237, 239, 247], dark: [23, 28, 71] },
  "border": { light: [213, 217, 232], dark: [42, 49, 102] },
  "border-strong": { light: [128, 137, 171], dark: [108, 117, 170] },
  "text": { light: [18, 21, 46], dark: [237, 238, 248] },
  "text-muted": { light: [82, 90, 125], dark: [163, 170, 208] },
  "overlay": { light: [0, 0, 0], dark: [5, 6, 26] },
  "brand": { light: [37, 42, 97], dark: [169, 179, 245] },
  "brand-hover": { light: [26, 30, 74], dark: [192, 200, 248] },
  "on-brand": { light: [255, 255, 255], dark: [10, 13, 34] },
  "secondary": { light: [74, 85, 176], dark: [143, 154, 230] },
  "secondary-subtle": { light: [230, 233, 249], dark: [31, 38, 88] },
  "on-secondary-subtle": { light: [47, 56, 128], dark: [195, 202, 246] },
  "accent": { light: [11, 124, 120], dark: [63, 207, 196] },
  "accent-hover": { light: [9, 99, 96], dark: [107, 221, 212] },
  "on-accent": { light: [255, 255, 255], dark: [6, 33, 31] },
  "accent-subtle": { light: [221, 243, 241], dark: [14, 47, 52] },
  "on-accent-subtle": { light: [7, 83, 80], dark: [140, 235, 227] },
  "success": { light: [22, 118, 63], dark: [82, 212, 138] },
  "success-subtle": { light: [221, 243, 229], dark: [15, 45, 34] },
  "warning": { light: [154, 91, 6], dark: [242, 184, 75] },
  "warning-subtle": { light: [251, 239, 211], dark: [51, 40, 15] },
  "danger": { light: [194, 41, 75], dark: [244, 112, 139] },
  "danger-subtle": { light: [251, 227, 232], dark: [58, 21, 34] },
  "emergency": { light: [179, 38, 14], dark: [255, 122, 92] },
  "emergency-subtle": { light: [251, 225, 218], dark: [68, 25, 15] },
  "on-emergency": { light: [255, 255, 255], dark: [10, 13, 34] },
};

const globals = loadStylesheet("globals");
const failures = [];
const fail = (message) => failures.push(message);

// 1. Primitives
const declared = getPrimitives(globals);
for (const [name, expected] of Object.entries(PRIMITIVES)) {
  const key = `--prim-${name}`;
  if (!declared.has(key)) {
    fail(`${key}: missing from globals.css`);
    continue;
  }
  const actual = toTriple(declared.get(key));
  if (!tripleEquals(actual, expected)) fail(`${key}: is ${actual ? formatTriple(actual) : declared.get(key)} but the palette says ${formatTriple(expected)}`);
}
for (const key of declared.keys()) {
  if (!(key.slice("--prim-".length) in PRIMITIVES)) fail(`${key}: declared in globals.css but not in the palette (section 3.2)`);
}

// 2. Semantic tokens in both themes
for (const theme of ["light", "dark"]) {
  const map = getSemantics(globals, theme);
  for (const [name, values] of Object.entries(SEMANTIC)) {
    const key = `--sem-${name}`;
    if (!map.has(key)) {
      fail(`${key}: missing from the ${theme} block`);
      continue;
    }
    const resolved = resolvePrimitive(globals, key, theme);
    if (resolved.error || !resolved.primitive) {
      fail(`${key} (${theme}): does not resolve through a --prim-* token (${resolved.error ?? resolved.value})`);
      continue;
    }
    const actual = toTriple(resolved.value);
    const expected = values[theme];
    if (!tripleEquals(actual, expected)) {
      fail(`${key} (${theme}): resolves to ${actual ? formatTriple(actual) : resolved.value} via ${resolved.primitive} but the palette says ${formatTriple(expected)}`);
    }
  }
  for (const key of map.keys()) {
    if (!(key.slice("--sem-".length) in SEMANTIC)) fail(`${key}: declared in the ${theme} block but not in the palette (section 3.3)`);
  }
}

// 3. Legacy_Tokens (section 3.4)
const scopes = [getThemeInline(globals), getSemantics(globals, "light"), declared];
const LEGACY = { primary: "brand", secondary: "secondary", accent: "accent" };
for (const [legacy, target] of Object.entries(LEGACY)) {
  const prop = `--color-${legacy}`;
  const mapped = resolveVar(`var(${prop})`, scopes);
  if (mapped.error) {
    fail(`${prop}: does not resolve (${mapped.error})`);
    continue;
  }
  if (!mapped.chain.includes(`--sem-${target}`)) fail(`${prop}: resolves via ${mapped.chain.join(" -> ")}, expected it to go through --sem-${target}`);
  else if (!tripleEquals(toTriple(mapped.value), SEMANTIC[target].light)) fail(`${prop}: light value is not the ${target} light value`);
}

if (failures.length > 0) {
  console.error(`FAIL p06-light-values: ${failures.length} mismatch(es)`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `PASS p06-light-values: ${Object.keys(PRIMITIVES).length} primitives and ${Object.keys(SEMANTIC).length} semantic tokens match the palette in light and dark; --color-primary, --color-secondary and --color-accent map through brand, secondary and accent.`,
);
