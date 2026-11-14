"use client";
// Sticky bar at the top of the scrolling area (large screens): where you are, and the contrast result.
import { SECTIONS } from "../_lib/sections";
import { useActiveSection } from "./active-section";
import { useDashboard } from "./dashboard-provider";
import { CheckCircleIcon, WarningIcon, XCircleIcon } from "./icons";

function StatusChip() {
  const { snapshot, results } = useDashboard();
  if (!snapshot.ready) {
    return <span className="inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-xs font-bold text-text-muted">Measuring…</span>;
  }
  const failing = results.filter((result) => result.status === "measured" && !result.pass).length;
  const unresolved = results.filter((result) => result.status === "unresolved").length;
  if (failing > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-subtle px-3 py-1 text-xs font-bold text-danger">
        <XCircleIcon />
        {failing} failing {failing === 1 ? "pair" : "pairs"}
      </span>
    );
  }
  if (unresolved > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-subtle px-3 py-1 text-xs font-bold text-warning">
        <WarningIcon />
        {unresolved} not measured
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-3 py-1 text-xs font-bold text-success">
      <CheckCircleIcon />
      All {results.length} pairs pass
    </span>
  );
}

export function TopBar() {
  const { active } = useActiveSection();
  const section = SECTIONS.find((item) => item.id === active) ?? SECTIONS[0];
  return (
    <div className="sticky top-0 z-10 hidden items-center justify-between gap-4 border-b border-border bg-page px-8 py-3 lg:flex">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li className="text-text-muted">Design system</li>
          <li aria-hidden="true" className="text-text-muted">/</li>
          <li aria-current="location" className="font-bold text-text">
            <span className="tabular-nums text-text-muted">{section.number}</span> {section.label}
          </li>
        </ol>
      </nav>
      <StatusChip />
    </div>
  );
}
