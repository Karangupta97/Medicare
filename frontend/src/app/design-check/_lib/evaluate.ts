// Evaluates the intended contrast pairs against measured tokens. All math comes from
// `contrast.ts`; this file only looks up the two colors of each pair and reports the result.
import { compositeOver, contrastRatio, meetsMinimum, type Rgb } from "./contrast";
import type { DashboardSnapshot } from "./dashboard-store";
import type { ResolvedColor } from "./token-store";
import { INTENDED_PAIRS, type IntendedPair, type Theme } from "./tokens";

export type PairResult =
  | { readonly status: "measured"; readonly pair: IntendedPair; readonly ratio: number; readonly pass: boolean }
  | { readonly status: "unresolved"; readonly pair: IntendedPair; readonly reason: string };

function unresolved(pair: IntendedPair, reason: string): PairResult {
  return { status: "unresolved", pair, reason };
}

export function evaluatePair(pair: IntendedPair, values: ReadonlyMap<string, ResolvedColor>): PairResult {
  const fg = values.get(pair.token);
  const bg = values.get(pair.pair);
  if (fg === undefined || fg.status !== "resolved") return unresolved(pair, `${pair.token} did not resolve`);
  if (bg === undefined || bg.status !== "resolved") return unresolved(pair, `${pair.pair} did not resolve`);
  const [br, bgG, bb, ba] = bg.rgba;
  if (ba < 1) return unresolved(pair, `${pair.pair} is not opaque`);
  const background: Rgb = [br, bgG, bb];
  try {
    const [fr, fgG, fb, fa] = fg.rgba;
    // Alpha colors are composited over the paired surface before measuring.
    const foreground: Rgb = fa < 1 ? compositeOver(fg.rgba, background) : [fr, fgG, fb];
    const ratio = contrastRatio(foreground, background);
    return { status: "measured", pair, ratio, pass: meetsMinimum(ratio, pair.minimum) };
  } catch {
    return unresolved(pair, "channel values are out of range");
  }
}

/** Every intended pair, in table order. Empty until the tokens were measured. */
export function evaluateAll(snapshot: DashboardSnapshot): PairResult[] {
  if (!snapshot.ready) return [];
  return INTENDED_PAIRS.map((pair) => evaluatePair(pair, pair.theme === "light" ? snapshot.light : snapshot.dark));
}

export type Totals = { readonly pass: number; readonly fail: number; readonly unresolved: number };

export function totalsFor(results: readonly PairResult[], theme: Theme): Totals {
  let pass = 0;
  let fail = 0;
  let unresolvedCount = 0;
  for (const result of results) {
    if (result.pair.theme !== theme) continue;
    if (result.status === "unresolved") unresolvedCount += 1;
    else if (result.pass) pass += 1;
    else fail += 1;
  }
  return { pass, fail, unresolved: unresolvedCount };
}
