// Pure helpers for naming and grouping tokens. No browser access, so server and client
// components can both import this file.
import { PRIMITIVE_NAMES } from "./tokens";

/** "--prim-ink-50" becomes "ink-50"; "--sem-brand" becomes "brand". */
export function shortName(name: string): string {
  return name.replace(/^--(prim|sem)-/, "");
}

/** The Tailwind theme variable that maps a semantic token, for example "--color-brand". */
export function tailwindName(semanticName: string): string {
  return `--color-${shortName(semanticName)}`;
}

/** The background utility for a semantic token, for example "bg-brand". */
export function utilityName(semanticName: string): string {
  return `bg-${shortName(semanticName)}`;
}

export type PaletteFamily = { readonly id: string; readonly label: string; readonly names: readonly string[] };

// Family labels follow DESIGN.md section 3.2. An unknown family still renders, capitalized.
const FAMILY_LABELS: Readonly<Record<string, string>> = {
  white: "White",
  ink: "Ink (light neutrals)",
  night: "Night (dark neutrals)",
  navy: "Navy (primary)",
  periwinkle: "Periwinkle (primary in dark)",
  indigo: "Indigo (secondary)",
  teal: "Teal (accent)",
  green: "Green (success)",
  amber: "Amber (warning)",
  rose: "Rose (danger)",
  vermilion: "Vermilion (emergency)",
  overlay: "Overlay",
};

function familyOf(name: string): string {
  const key = shortName(name);
  // DESIGN.md lists these two together as the overlay primitives.
  if (key === "black" || key === "night-1000") return "overlay";
  return key.split("-")[0];
}

/** Primitive tokens grouped by family, in the order the families first appear in globals.css. */
export function groupPrimitives(names: readonly string[] = PRIMITIVE_NAMES): PaletteFamily[] {
  const order: string[] = [];
  const byFamily = new Map<string, string[]>();
  for (const name of names) {
    const id = familyOf(name);
    const list = byFamily.get(id);
    if (list === undefined) {
      order.push(id);
      byFamily.set(id, [name]);
    } else {
      list.push(name);
    }
  }
  return order.map((id) => ({
    id,
    label: FAMILY_LABELS[id] ?? id.charAt(0).toUpperCase() + id.slice(1),
    names: byFamily.get(id) ?? [],
  }));
}
