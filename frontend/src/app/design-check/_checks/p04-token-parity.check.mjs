#!/usr/bin/env node
// Property 4: Semantic tokens are complete in both themes and fully mapped.
// Validates: Requirements 4.4, 10.1, 10.2, 10.3, 11.5, 20.3
// (stage 1 from task 7.3, stage 2 `.dark` parity from task 15.1).
//
// Stage 1 checks, against src/app/globals.css:
//   1. At least one Semantic_Token is declared in the top-level `:root` rules.
//   2. No `--sem-*` name is declared twice in `:root`.
//   3. Every `:root` `--sem-*` value is exactly one `var(--prim-*)` that
//      names a Primitive_Token declared in the file, and that primitive
//      resolves to a literal value (not undeclared, not a cycle).
//   4. `@theme inline` declares `--color-<role>: var(--sem-<role>)` for every
//      Semantic_Token `--sem-<role>`.
//   5. Every `@theme inline` `--color-*` that references a `--sem-*` names a
//      declared Semantic_Token.
//
// Stage 2 adds:
//   6. Exactly one top-level `.dark` rule exists, and no `.dark` rule nested
//      in a wrapper declares `--sem-*`.
//   7. No `--sem-*` name is declared twice in `.dark`.
//   8. `:root` and `.dark` declare identical `--sem-*` name sets.
//   9. Every `.dark` `--sem-*` value is exactly one `var(--prim-*)` naming a
//      declared Primitive_Token that resolves to a literal value.
//  10. Every `var(--prim-*)` or `var(--sem-*)` reference anywhere in the
//      file (declarations and at-rule statements) names a declared token.
//
// Usage (from `frontend/`):
//   node src/app/design-check/_checks/p04-token-parity.check.mjs [--stage=1|2] [--file=<css path>]
// `--file` overrides the stylesheet (default src/app/globals.css), for
// failure tests on a temporary copy. Exits 1 on failure, 2 on a usage or
// parse error.
//
// This file contains no color literals (Requirement 10.5). Node built-ins only.
import { relative, resolve } from "node:path";
import {
  FRONTEND_ROOT,
  STYLESHEETS,
  darkBlocks,
  findBlocks,
  getSemantics,
  getPrimitives,
  getSemanticDeclarations,
  getStage,
  getThemeInlineDeclarations,
  isTopLevel,
  loadStylesheet,
  resolvePrimitive,
  singleVarRef,
  toMap,
  varRefs,
} from "./lib/css.mjs";

const NAME = "p04-token-parity";
const fileArg = process.argv.slice(2).find((a) => a.startsWith("--file="));
const SHEET_PATH = fileArg ? resolve(fileArg.slice("--file=".length)) : STYLESHEETS.globals;
const FILE = relative(FRONTEND_ROOT, SHEET_PATH);

/** Stage 1: light Semantic_Tokens and the `@theme inline` mapping. */
function checkLight(sheet, failures) {
  const primitives = getPrimitives(sheet);
  const semDecls = getSemanticDeclarations(sheet, "light");
  const semantics = toMap(semDecls);

  if (semDecls.length === 0) {
    failures.push(`${FILE}: no --sem-* declarations found in a top-level :root rule`);
    return semantics;
  }

  for (const name of new Set(semantics.duplicates)) {
    const lines = semDecls.filter((d) => d.prop === name).map((d) => d.line);
    failures.push(`${FILE}: ${name} is declared more than once in :root (lines ${lines.join(", ")})`);
  }

  for (const d of semDecls) {
    const where = `${FILE}:${d.line}: :root ${d.prop}`;
    const ref = singleVarRef(d.value);
    if (!ref || !ref.startsWith("--prim-")) {
      failures.push(`${where} must be a single var(--prim-*) reference, found "${d.value}"`);
      continue;
    }
    if (!primitives.has(ref)) {
      failures.push(`${where} references ${ref}, which is not a declared Primitive_Token`);
      continue;
    }
    const resolved = resolvePrimitive(sheet, d.value, "light");
    if (resolved.error) failures.push(`${where} does not resolve: ${resolved.error} (chain ${resolved.chain.join(" -> ")})`);
  }

  const inlineDecls = getThemeInlineDeclarations(sheet);
  const inline = toMap(inlineDecls);
  for (const name of semantics.keys()) {
    const role = name.slice("--sem-".length);
    const color = `--color-${role}`;
    const expected = `var(${name})`;
    if (!inline.has(color)) {
      failures.push(`${FILE}: @theme inline is missing "${color}: ${expected};" for Semantic_Token ${name}`);
    } else if (singleVarRef(inline.get(color)) !== name) {
      const line = inlineDecls.filter((d) => d.prop === color).at(-1).line;
      failures.push(`${FILE}:${line}: @theme inline ${color} must be "${expected}", found "${inline.get(color)}"`);
    }
  }

  for (const d of inlineDecls) {
    if (!d.prop.startsWith("--color-")) continue;
    for (const ref of varRefs(d.value)) {
      if (ref.startsWith("--sem-") && !semantics.has(ref)) {
        failures.push(`${FILE}:${d.line}: @theme inline ${d.prop} references ${ref}, which is not declared in :root`);
      }
    }
  }

  return semantics;
}

/** Stage 2: `.dark` Semantic_Tokens and references across the whole file. */
function checkDark(sheet, lightSemantics, failures) {
  const primitives = getPrimitives(sheet);
  const darkTop = darkBlocks(sheet);
  if (darkTop.length !== 1) {
    const lines = darkTop.map((b) => b.line).join(", ");
    failures.push(`${FILE}: expected exactly one top-level .dark rule, found ${darkTop.length}${lines ? ` (lines ${lines})` : ""}`);
  }
  const nestedDark = findBlocks(
    sheet,
    (b) => b.type === "dark" && !isTopLevel(b) && b.declarations.some((d) => d.prop.startsWith("--sem-")),
  );
  for (const b of nestedDark) {
    failures.push(`${FILE}:${b.line}: .dark rule declaring --sem-* must be top-level, not nested in a wrapper`);
  }

  const darkDecls = getSemanticDeclarations(sheet, "dark");
  const dark = toMap(darkDecls);

  for (const name of new Set(dark.duplicates)) {
    const lines = darkDecls.filter((d) => d.prop === name).map((d) => d.line);
    failures.push(`${FILE}: ${name} is declared more than once in .dark (lines ${lines.join(", ")})`);
  }

  for (const name of lightSemantics.keys()) {
    if (!dark.has(name)) failures.push(`${FILE}: ${name} is declared in :root but missing from .dark`);
  }
  for (const d of darkDecls) {
    if (!lightSemantics.has(d.prop)) failures.push(`${FILE}:${d.line}: .dark ${d.prop} is not declared in :root`);
  }

  for (const d of darkDecls) {
    const where = `${FILE}:${d.line}: .dark ${d.prop}`;
    const ref = singleVarRef(d.value);
    if (!ref || !ref.startsWith("--prim-")) {
      failures.push(`${where} must be a single var(--prim-*) reference, found "${d.value}"`);
      continue;
    }
    if (!primitives.has(ref)) {
      failures.push(`${where} references ${ref}, which is not a declared Primitive_Token`);
      continue;
    }
    const resolved = resolvePrimitive(sheet, d.value, "dark");
    if (resolved.error) failures.push(`${where} does not resolve: ${resolved.error} (chain ${resolved.chain.join(" -> ")})`);
  }

  // Zero undeclared --prim-* / --sem-* references anywhere in the file.
  const declared = (ref) =>
    ref.startsWith("--prim-") ? primitives.has(ref) : lightSemantics.has(ref) || getSemantics(sheet, "dark").has(ref);
  const items = [sheet.root, ...sheet.blocks].flatMap((b) => [
    ...b.declarations.map((d) => ({ line: d.line, label: d.prop, value: d.value })),
    ...b.statements.map((st) => ({ line: st.line, label: st.name ? `@${st.name}` : "statement", value: st.prelude })),
  ]);
  let refCount = 0;
  for (const item of items) {
    for (const ref of varRefs(item.value)) {
      if (!ref.startsWith("--prim-") && !ref.startsWith("--sem-")) continue;
      refCount += 1;
      if (!declared(ref)) failures.push(`${FILE}:${item.line}: ${item.label} references undeclared ${ref}`);
    }
  }
  return { dark, refCount };
}

function main() {
  let stage;
  let sheet;
  try {
    stage = getStage(process.argv.slice(2));
    sheet = loadStylesheet(SHEET_PATH);
  } catch (error) {
    console.error(`${NAME}: ${error.message}`);
    process.exit(2);
  }

  const failures = [];
  const semantics = checkLight(sheet, failures);

  const darkResult = stage === 2 ? checkDark(sheet, semantics, failures) : null;

  if (failures.length > 0) {
    console.error(`${NAME}: FAIL, ${failures.length} problem(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `${NAME}: OK, ${semantics.size} :root Semantic_Tokens each map to a declared Primitive_Token and to @theme inline --color-<role>.`,
  );
  if (darkResult) {
    console.log(
      `${NAME}: OK (stage 2), one top-level .dark rule declares the same ${darkResult.dark.size} Semantic_Tokens, each a single declared var(--prim-*); ${darkResult.refCount} --prim-*/--sem-* references in ${FILE} all name declared tokens.`,
    );
  }
}

main();
