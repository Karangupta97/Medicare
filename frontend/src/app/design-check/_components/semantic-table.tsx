"use client";
import { useMemo } from "react";
import { buildPrimitiveIndex, formatColor, primitiveFor } from "../_lib/format";
import { shortName, tailwindName } from "../_lib/palette";
import { SEMANTIC_NAMES } from "../_lib/tokens";
import type { ResolvedColor } from "../_lib/token-store";
import { CopyButton } from "./copy-button";
import { useDashboard } from "./dashboard-provider";

// The swatch carries the `light` or `dark` class, so its own custom properties resolve in that theme.
function ThemeCell({
  scope,
  name,
  value,
  primitive,
}: {
  scope: "light" | "dark";
  name: string;
  value: ResolvedColor | undefined;
  primitive: string | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`${scope} block size-10 shrink-0 rounded-lg border border-border-strong`}
        style={{ backgroundColor: `var(${name})` }}
      />
      <span className="min-w-0">
        <span className="block text-sm font-bold tabular-nums text-text">{formatColor(value)}</span>
        <span className="block break-all text-xs text-text-muted">{primitive === null ? "no matching primitive" : shortName(primitive)}</span>
      </span>
    </div>
  );
}

export function SemanticTable() {
  const { snapshot } = useDashboard();
  const index = useMemo(() => buildPrimitiveIndex(snapshot.primitives), [snapshot.primitives]);
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface" tabIndex={0} role="region" aria-label="Semantic tokens table">
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <caption className="sr-only">Every semantic token with its light and dark value, the primitive it resolves to, and its Tailwind variable.</caption>
        <thead className="bg-surface-muted text-xs font-bold uppercase tracking-wider text-text-muted">
          <tr>
            <th scope="col" className="px-4 py-3">Token</th>
            <th scope="col" className="px-4 py-3">Light</th>
            <th scope="col" className="px-4 py-3">Dark</th>
            <th scope="col" className="px-4 py-3">Tailwind variable</th>
          </tr>
        </thead>
        <tbody>
          {SEMANTIC_NAMES.map((name) => {
            const light = snapshot.light.get(name);
            const dark = snapshot.dark.get(name);
            return (
              <tr key={name} className="border-t border-border align-middle">
                <th scope="row" className="px-2 py-2 font-normal">
                  <CopyButton text={name}>{name}</CopyButton>
                </th>
                <td className="px-4 py-2">
                  <ThemeCell scope="light" name={name} value={light} primitive={primitiveFor(light, index)} />
                </td>
                <td className="px-4 py-2">
                  <ThemeCell scope="dark" name={name} value={dark} primitive={primitiveFor(dark, index)} />
                </td>
                <td className="px-2 py-2">
                  <CopyButton text={tailwindName(name)}>{tailwindName(name)}</CopyButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
