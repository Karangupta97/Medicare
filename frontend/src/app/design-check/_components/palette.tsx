"use client";
import { formatColor } from "../_lib/format";
import { groupPrimitives, shortName } from "../_lib/palette";
import { useDashboard } from "./dashboard-provider";
import { Panel } from "./panel";

const FAMILIES = groupPrimitives();

export function Palette() {
  const { snapshot, copy } = useDashboard();
  return (
    <div className="space-y-6">
      {FAMILIES.map((family) => (
        <Panel key={family.id} title={family.label}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {family.names.map((name) => {
              const hex = formatColor(snapshot.primitives.get(name));
              return (
                <li key={name} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => copy(name)}
                    aria-label={`Copy ${name} (${hex})`}
                    className="group block w-full min-w-0 rounded-xl border border-border bg-surface p-2 text-left hover:border-border-strong"
                  >
                    <span
                      className="block h-14 rounded-lg border border-border"
                      style={{ backgroundColor: `var(${name})` }}
                    />
                    <span className="mt-2 block break-all text-sm font-bold text-text">{shortName(name)}</span>
                    <span className="block text-xs tabular-nums text-text-muted">{hex}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
      ))}
      <p className="text-sm text-text-muted">Select a swatch to copy its CSS variable name.</p>
    </div>
  );
}
