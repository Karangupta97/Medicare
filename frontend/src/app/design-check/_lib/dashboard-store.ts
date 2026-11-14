// External store for the design-check dashboard.
//
// Primitive tokens are measured once on `<html>`. Semantic tokens are measured twice, in a
// `light` and a `dark` probe, so the page can show and judge both themes at the same time
// whatever theme the page itself is in. Nothing is read during module load or on the server.
import { createDomStyleSource, resolveColors, type ResolvedColor } from "./token-store";
import { PRIMITIVE_NAMES, SEMANTIC_NAMES } from "./tokens";

export type DashboardSnapshot = {
  /** False on the server and during hydration, true once the browser measured the tokens. */
  readonly ready: boolean;
  readonly version: number;
  /** Keyed by custom property name, for example "--prim-navy-700". */
  readonly primitives: ReadonlyMap<string, ResolvedColor>;
  /** Keyed by custom property name, for example "--sem-brand". */
  readonly light: ReadonlyMap<string, ResolvedColor>;
  readonly dark: ReadonlyMap<string, ResolvedColor>;
};

export type DashboardStore = {
  subscribe(onChange: () => void): () => void;
  getSnapshot(): DashboardSnapshot;
  getServerSnapshot(): DashboardSnapshot;
  /** Measures again, for example after editing globals.css while the dev server runs. */
  refresh(): void;
};

const SERVER_SNAPSHOT: DashboardSnapshot = Object.freeze({
  ready: false,
  version: 0,
  primitives: new Map<string, ResolvedColor>(),
  light: new Map<string, ResolvedColor>(),
  dark: new Map<string, ResolvedColor>(),
});

export function createDashboardStore(): DashboardStore {
  const listeners = new Set<() => void>();
  let snapshot: DashboardSnapshot | null = null;
  let version = 0;

  function measure(): DashboardSnapshot {
    const root = createDomStyleSource();
    const light = createDomStyleSource("light");
    const dark = createDomStyleSource("dark");
    try {
      root.attach();
      light.attach();
      dark.attach();
      version += 1;
      return {
        ready: true,
        version,
        primitives: resolveColors(PRIMITIVE_NAMES, root),
        light: resolveColors(SEMANTIC_NAMES, light),
        dark: resolveColors(SEMANTIC_NAMES, dark),
      };
    } finally {
      root.detach();
      light.detach();
      dark.detach();
    }
  }

  function getSnapshot(): DashboardSnapshot {
    if (typeof document === "undefined") return SERVER_SNAPSHOT;
    snapshot ??= measure();
    return snapshot;
  }

  function subscribe(onChange: () => void): () => void {
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }

  function refresh(): void {
    if (typeof document === "undefined") return;
    snapshot = measure();
    for (const listener of [...listeners]) listener();
  }

  return { subscribe, getSnapshot, getServerSnapshot: () => SERVER_SNAPSHOT, refresh };
}
