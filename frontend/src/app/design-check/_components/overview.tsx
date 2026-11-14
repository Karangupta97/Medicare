"use client";
import { formatRatio } from "../_lib/contrast";
import { totalsFor, type PairResult } from "../_lib/evaluate";
import { shortName } from "../_lib/palette";
import { INTENDED_PAIRS, PRIMITIVE_NAMES, SEMANTIC_NAMES, type Theme } from "../_lib/tokens";
import { useDashboard } from "./dashboard-provider";
import { CheckCircleIcon, ReplayIcon, WarningIcon, XCircleIcon } from "./icons";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-2 text-4xl font-bold tabular-nums text-brand">{value}</p>
      {hint !== undefined && <p className="mt-1 text-sm text-text-muted">{hint}</p>}
    </div>
  );
}

function themeLabel(theme: Theme): string {
  return theme === "light" ? "Light" : "Dark";
}

function describe(result: PairResult): string {
  const names = `${themeLabel(result.pair.theme)}: ${shortName(result.pair.token)} on ${shortName(result.pair.pair)}`;
  if (result.status === "unresolved") return `${names} (${result.reason})`;
  return `${names}, ${formatRatio(result.ratio)}, minimum ${result.pair.minimum}`;
}

export function Overview() {
  const { snapshot, results, refresh } = useDashboard();
  const ready = snapshot.ready;
  const light = totalsFor(results, "light");
  const dark = totalsFor(results, "dark");
  const failing = results.filter((result) => result.status === "measured" && !result.pass);
  const unresolved = results.filter((result) => result.status === "unresolved");
  const unresolvedTokens = [snapshot.primitives, snapshot.light, snapshot.dark].reduce(
    (sum, map) => sum + [...map.values()].filter((value) => value.status === "unresolved").length,
    0,
  );
  const totalsText = (t: { pass: number; fail: number }) => (ready ? `${t.pass} pass · ${t.fail} fail` : "…");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Primitive tokens" value={String(PRIMITIVE_NAMES.length)} hint="--prim-* in :root" />
        <Stat label="Semantic tokens" value={String(SEMANTIC_NAMES.length)} hint="--sem-* in :root and .dark" />
        <Stat label="Contrast pairs" value={String(INTENDED_PAIRS.length)} hint="Intended pairs, both themes" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Light theme" value={totalsText(light)} hint={ready ? `${light.pass + light.fail + light.unresolved} pairs measured` : "Measuring"} />
        <Stat label="Dark theme" value={totalsText(dark)} hint={ready ? `${dark.pass + dark.fail + dark.unresolved} pairs measured` : "Measuring"} />
      </div>

      {!ready && (
        <div role="status" className="rounded-xl border border-border bg-surface-muted p-5 text-text">
          Measuring tokens in the browser…
        </div>
      )}

      {ready && failing.length === 0 && unresolved.length === 0 && unresolvedTokens === 0 && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-success bg-success-subtle p-5">
          <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="font-bold text-success">All {results.length} pairs meet their minimum</p>
            <p className="mt-1 text-sm text-text">
              {light.pass} light and {dark.pass} dark pairs pass. All {PRIMITIVE_NAMES.length + SEMANTIC_NAMES.length * 2} measured token values resolved.
            </p>
          </div>
        </div>
      )}

      {ready && failing.length > 0 && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-danger bg-danger-subtle p-5">
          <XCircleIcon className="mt-0.5 size-5 shrink-0 text-danger" />
          <div>
            <p className="font-bold text-danger">
              {failing.length} {failing.length === 1 ? "pair fails" : "pairs fail"} its minimum
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text">
              {failing.map((result) => (
                <li key={`${result.pair.theme}-${result.pair.token}-${result.pair.pair}`}>{describe(result)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {ready && (unresolved.length > 0 || unresolvedTokens > 0) && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-warning bg-warning-subtle p-5">
          <WarningIcon className="mt-0.5 size-5 shrink-0 text-warning" />
          <div>
            <p className="font-bold text-warning">Some values could not be measured</p>
            <p className="mt-1 text-sm text-text">
              {unresolvedTokens} {unresolvedTokens === 1 ? "token" : "tokens"} did not resolve and {unresolved.length} {unresolved.length === 1 ? "pair was" : "pairs were"} skipped.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text">
              {unresolved.map((result) => (
                <li key={`${result.pair.theme}-${result.pair.token}-${result.pair.pair}`}>{describe(result)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={refresh} className="btn btn-secondary">
          <ReplayIcon />
          Measure again
        </button>
        <p className="text-sm text-text-muted">Values are read from the page&apos;s computed styles, so they follow globals.css. Measure again after editing it.</p>
      </div>
    </div>
  );
}
