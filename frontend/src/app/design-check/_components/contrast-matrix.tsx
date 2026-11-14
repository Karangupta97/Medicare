"use client";
import { useState } from "react";
import { formatRatio } from "../_lib/contrast";
import type { PairResult } from "../_lib/evaluate";
import { shortName } from "../_lib/palette";
import { INTENDED_PAIRS, type IntendedPair } from "../_lib/tokens";
import { ResultBadge } from "./badges";
import { useDashboard } from "./dashboard-provider";
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from "./icons";

type Filter = "all" | "failing" | "text" | "ui";
type Sort = "none" | "asc" | "desc";

const FILTERS: readonly { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "failing", label: "Failing" },
  { id: "text", label: "Text (4.5)" },
  { id: "ui", label: "UI (3)" },
];

function matches(result: PairResult, filter: Filter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "failing":
      return result.status === "unresolved" || !result.pass;
    case "text":
      return result.pair.minimum === 4.5;
    case "ui":
      return result.pair.minimum === 3;
  }
}

function sortResults(results: readonly PairResult[], sort: Sort): PairResult[] {
  if (sort === "none") return [...results];
  const direction = sort === "asc" ? 1 : -1;
  return [...results].sort((a, b) => {
    // Unresolved pairs have no ratio, so they stay at the end in both directions.
    if (a.status === "unresolved" || b.status === "unresolved") {
      return Number(a.status === "unresolved") - Number(b.status === "unresolved");
    }
    return (a.ratio - b.ratio) * direction;
  });
}

// The sample carries the pair's theme class, so the inline custom properties resolve in that theme.
// Text pairs show the token as text color; UI pairs show it as a 2px border.
function AaSample({ pair }: { pair: IntendedPair }) {
  const scope = pair.theme === "light" ? "light" : "dark";
  const isText = pair.minimum === 4.5;
  return (
    <span
      className={`${scope} inline-flex h-11 min-w-16 items-center justify-center rounded-lg px-3 text-lg font-bold ${
        isText ? "border border-border" : "border-2"
      }`}
      style={{
        backgroundColor: `var(${pair.pair})`,
        color: isText ? `var(${pair.token})` : "var(--sem-text)",
        borderColor: isText ? undefined : `var(${pair.token})`,
      }}
    >
      Aa
    </span>
  );
}

function SortIcon({ sort }: { sort: Sort }) {
  if (sort === "asc") return <ArrowUpIcon />;
  if (sort === "desc") return <ArrowDownIcon />;
  return <ArrowsUpDownIcon />;
}

export function ContrastMatrix() {
  const { snapshot, results } = useDashboard();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("none");

  const rows = sortResults(
    results.filter((result) => matches(result, filter)),
    sort,
  );
  // Before the browser has measured, every pair is listed with placeholders so the table has its
  // final height on the server and a deep link to a later section lands in the right place.
  const pending = snapshot.ready ? [] : INTENDED_PAIRS;
  const nextSort: Sort = sort === "none" ? "asc" : sort === "asc" ? "desc" : "none";
  const ariaSort = sort === "none" ? "none" : sort === "asc" ? "ascending" : "descending";

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Filter pairs" className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count = results.filter((result) => matches(result, item.id)).length;
          const selected = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(item.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold ${
                selected
                  ? "border-brand bg-brand text-on-brand"
                  : "border-border-strong bg-surface text-text hover:bg-surface-muted"
              }`}
            >
              {item.label}
              <span className="tabular-nums">{snapshot.ready ? count : "…"}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface" tabIndex={0} role="region" aria-label="Contrast matrix table">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="sr-only">
            Intended contrast pairs in both themes with the measured ratio, the required minimum and the result.
          </caption>
          <thead className="bg-surface-muted text-xs font-bold uppercase tracking-wider text-text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">Theme</th>
              <th scope="col" className="px-4 py-3">Foreground on background</th>
              <th scope="col" className="px-4 py-3">Sample</th>
              <th scope="col" aria-sort={ariaSort} className="px-2 py-1">
                <button
                  type="button"
                  onClick={() => setSort(nextSort)}
                  aria-label={`Sort by ratio, currently ${sort === "none" ? "not sorted" : ariaSort}`}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-bold uppercase tracking-wider hover:bg-surface hover:text-text"
                >
                  Ratio
                  <SortIcon sort={sort} />
                </button>
              </th>
              <th scope="col" className="px-4 py-3">Minimum</th>
              <th scope="col" className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((pair) => (
              <tr key={`${pair.theme}-${pair.token}-${pair.pair}`} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-sm text-text-muted">{pair.theme === "light" ? "Light" : "Dark"}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-bold text-text">{shortName(pair.token)}</span>
                  <span className="text-text-muted"> on </span>
                  <span className="font-bold text-text">{shortName(pair.pair)}</span>
                  <span className="block text-xs text-text-muted">{pair.usage}</span>
                </td>
                <td className="px-4 py-3">
                  <AaSample pair={pair} />
                </td>
                <td className="px-4 py-3 text-sm font-bold tabular-nums text-text-muted">…</td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {pair.minimum} · {pair.minimum === 4.5 ? "text" : "UI"}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold text-text-muted">Measuring</span>
                </td>
              </tr>
            ))}
            {snapshot.ready && rows.length === 0 && (
              <tr className="border-t border-border">
                <td colSpan={6} className="px-4 py-6 text-sm text-text-muted">
                  No pairs match this filter.
                </td>
              </tr>
            )}
            {rows.map((result) => (
              <tr key={`${result.pair.theme}-${result.pair.token}-${result.pair.pair}`} className="border-t border-border align-middle">
                <td className="px-4 py-3 text-sm text-text-muted">{result.pair.theme === "light" ? "Light" : "Dark"}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-bold text-text">{shortName(result.pair.token)}</span>
                  <span className="text-text-muted"> on </span>
                  <span className="font-bold text-text">{shortName(result.pair.pair)}</span>
                  <span className="block text-xs text-text-muted">{result.pair.usage}</span>
                </td>
                <td className="px-4 py-3">
                  <AaSample pair={result.pair} />
                </td>
                <td className="px-4 py-3 text-sm font-bold tabular-nums text-text">
                  {result.status === "measured" ? formatRatio(result.ratio) : "n/a"}
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {result.pair.minimum} · {result.pair.minimum === 4.5 ? "text" : "UI"}
                </td>
                <td className="px-4 py-3">
                  <ResultBadge result={result} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
