"use client";
// Compare mode: pick one group of components and see it large, in a `.light` box next to a `.dark`
// box. A scope sets token values only, so each box sets its own page background and text color.
// The samples size themselves by the width of their own box (container queries), so they stay
// readable in a half-width column.
import { useId, useState, type ReactNode } from "react";
import { formatColor } from "../_lib/format";
import { useDashboard } from "./dashboard-provider";
import { MoonIcon, SunIcon } from "./icons";

export type CompareGroup = { readonly id: string; readonly label: string; readonly node: ReactNode };
type Scope = "light" | "dark";
type Layout = "side" | "stacked";

// The four tokens shown in each box header, so the page, card and brand colors of the theme are visible at a glance.
const HEADER_TOKENS = [
  { name: "--sem-page", label: "page" },
  { name: "--sem-surface", label: "surface" },
  { name: "--sem-text", label: "text" },
  { name: "--sem-brand", label: "brand" },
] as const;

function ScopeBox({ scope, children }: { scope: Scope; children: ReactNode }) {
  const { snapshot } = useDashboard();
  const values = scope === "light" ? snapshot.light : snapshot.dark;
  const Icon = scope === "light" ? SunIcon : MoonIcon;
  const title = scope === "light" ? "Light theme" : "Dark theme";
  return (
    <section aria-label={title} className={`${scope} min-w-0 rounded-2xl border border-border-strong bg-page text-text`}>
      <div className="sticky top-0 z-[5] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-t-2xl border-b border-border bg-page px-4 py-3 sm:px-6 lg:top-[49px]">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text">
          <Icon className="size-4 text-text-muted" />
          {title}
        </h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {HEADER_TOKENS.map((token) => (
            <li key={token.name} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="block size-3 rounded-full border border-border-strong"
                style={{ backgroundColor: `var(${token.name})` }}
              />
              <span className="text-text-muted">{token.label}</span>
              <span className="tabular-nums text-text">{formatColor(values.get(token.name))}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-6 p-4 sm:p-6">{children}</div>
    </section>
  );
}

function Segment({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-bold ${
        pressed ? "border-brand bg-brand text-on-brand" : "border-border-strong bg-surface text-text hover:bg-surface-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function CompareSection({ groups }: { groups: readonly CompareGroup[] }) {
  const [enabled, setEnabled] = useState(true);
  const [layout, setLayout] = useState<Layout>("side");
  const [selected, setSelected] = useState(groups[0]?.id ?? "");
  const switchLabel = useId();
  const group = groups.find((item) => item.id === selected) ?? groups[0];

  return (
    <div className="space-y-6">
      <div className="space-y-5 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-labelledby={switchLabel}
              onClick={() => setEnabled((value) => !value)}
              className="inline-flex h-11 w-16 items-center justify-center rounded-full"
            >
              <span
                className={`flex h-7 w-12 items-center rounded-full border px-0.5 ${
                  enabled ? "justify-end border-brand bg-brand" : "justify-start border-border-strong bg-surface-muted"
                }`}
              >
                <span className={`block size-5 rounded-full ${enabled ? "bg-on-brand" : "bg-text-muted"}`} />
              </span>
            </button>
            <span id={switchLabel} className="text-sm font-bold text-text">
              Compare light and dark
            </span>
          </div>
          <div role="group" aria-label="Layout" className="flex flex-wrap gap-2">
            <Segment pressed={layout === "side"} onClick={() => setLayout("side")}>Side by side</Segment>
            <Segment pressed={layout === "stacked"} onClick={() => setLayout("stacked")}>Stacked</Segment>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">Show</p>
          <div role="group" aria-label="Content to compare" className="flex flex-wrap gap-2">
            {groups.map((item) => (
              <Segment key={item.id} pressed={selected === item.id} onClick={() => setSelected(item.id)}>
                {item.label}
              </Segment>
            ))}
          </div>
        </div>
      </div>

      {group !== undefined && enabled && (
        <div className={`grid grid-cols-1 gap-6 ${layout === "side" ? "xl:grid-cols-2" : ""}`}>
          <ScopeBox scope="light">{group.node}</ScopeBox>
          <ScopeBox scope="dark">{group.node}</ScopeBox>
        </div>
      )}

      {group !== undefined && !enabled && (
        <div className="space-y-4 rounded-2xl border border-border bg-page p-4 sm:p-6">
          <p className="text-sm text-text-muted">Showing one copy in the theme the page is in. Turn the switch on to compare both themes.</p>
          {group.node}
        </div>
      )}
    </div>
  );
}
