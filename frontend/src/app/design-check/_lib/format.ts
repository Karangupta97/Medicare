// Formatting and lookup helpers for measured colors. Pure functions, no browser access.
import { toHexLabel } from "./contrast";
import type { ResolvedColor } from "./token-store";

/** Upper-case hex for opaque colors, "rgba(r, g, b, a)" otherwise, "unresolved" or "…" when unknown. */
export function formatColor(value: ResolvedColor | undefined): string {
  if (value === undefined) return "…";
  if (value.status === "unresolved") return "unresolved";
  const [r, g, b, a] = value.rgba;
  return a === 1 ? toHexLabel([r, g, b]).toUpperCase() : `rgba(${r}, ${g}, ${b}, ${a})`;
}

function keyOf(value: ResolvedColor | undefined): string | null {
  if (value === undefined || value.status !== "resolved") return null;
  return value.rgba.join(",");
}

/** Maps a measured color to the name of the primitive token that has exactly that value. */
export function buildPrimitiveIndex(primitives: ReadonlyMap<string, ResolvedColor>): Map<string, string> {
  const index = new Map<string, string>();
  for (const [name, value] of primitives) {
    const key = keyOf(value);
    if (key !== null) index.set(key, name);
  }
  return index;
}

/** The primitive token that a measured semantic color resolves to, or null. */
export function primitiveFor(value: ResolvedColor | undefined, index: ReadonlyMap<string, string>): string | null {
  const key = keyOf(value);
  return key === null ? null : (index.get(key) ?? null);
}
