// Token names and intended contrast pairs for the Design_Check_Route.
// Data only: no color values. The resolved values come from the Globals_Stylesheet at
// runtime (`token-store.ts`) or in the Node checks.
// No imports and only erasable TypeScript syntax, so Node type stripping can load this file.
//
// Both name lists must equal the `--prim-*` and `--sem-*` names declared in
// `src/app/globals.css`. The pair table follows DESIGN.md section 3.5.

/** Every Primitive_Token (DESIGN.md section 3.2), in Globals_Stylesheet order. */
export const PRIMITIVE_NAMES = [
  "--prim-white",
  "--prim-ink-50",
  "--prim-ink-100",
  "--prim-ink-200",
  "--prim-ink-400",
  "--prim-ink-600",
  "--prim-ink-900",
  "--prim-night-950",
  "--prim-night-900",
  "--prim-night-800",
  "--prim-night-700",
  "--prim-night-500",
  "--prim-night-300",
  "--prim-night-50",
  "--prim-navy-900",
  "--prim-navy-700",
  "--prim-periwinkle-300",
  "--prim-periwinkle-200",
  "--prim-indigo-800",
  "--prim-indigo-600",
  "--prim-indigo-100",
  "--prim-indigo-400",
  "--prim-indigo-200",
  "--prim-indigo-900",
  "--prim-teal-900",
  "--prim-teal-800",
  "--prim-teal-700",
  "--prim-teal-50",
  "--prim-teal-200",
  "--prim-teal-300",
  "--prim-teal-400",
  "--prim-teal-950",
  "--prim-teal-surface-dark",
  "--prim-green-700",
  "--prim-green-50",
  "--prim-green-400",
  "--prim-green-950",
  "--prim-amber-700",
  "--prim-amber-50",
  "--prim-amber-400",
  "--prim-amber-950",
  "--prim-rose-600",
  "--prim-rose-50",
  "--prim-rose-400",
  "--prim-rose-950",
  "--prim-vermilion-700",
  "--prim-vermilion-50",
  "--prim-vermilion-400",
  "--prim-vermilion-950",
  "--prim-black",
  "--prim-night-1000",
] as const;

/** Every Semantic_Token (DESIGN.md section 3.3). Each is declared in both `:root` and `.dark`. */
export const SEMANTIC_NAMES = [
  "--sem-page",
  "--sem-surface",
  "--sem-surface-muted",
  "--sem-border",
  "--sem-border-strong",
  "--sem-text",
  "--sem-text-muted",
  "--sem-overlay",
  "--sem-brand",
  "--sem-brand-hover",
  "--sem-on-brand",
  "--sem-secondary",
  "--sem-secondary-subtle",
  "--sem-on-secondary-subtle",
  "--sem-accent",
  "--sem-accent-hover",
  "--sem-on-accent",
  "--sem-accent-subtle",
  "--sem-on-accent-subtle",
  "--sem-success",
  "--sem-success-subtle",
  "--sem-warning",
  "--sem-warning-subtle",
  "--sem-danger",
  "--sem-danger-subtle",
  "--sem-emergency",
  "--sem-emergency-subtle",
  "--sem-on-emergency",
] as const;

export type PrimitiveName = (typeof PRIMITIVE_NAMES)[number];
export type SemanticName = (typeof SEMANTIC_NAMES)[number];
export type Theme = "light" | "dark";

/**
 * One intended pair: `token` is drawn on (or next to) `pair`.
 * `minimum` is the WCAG 2.x Contrast_Ratio threshold, compared unrounded:
 * 4.5 for text, 3 for UI components such as control borders and focus rings.
 * `legacyExempt` is kept for the swatch component; the refreshed palette has no exemptions, so it is always false.
 */
export interface IntendedPair {
  readonly token: SemanticName;
  readonly pair: SemanticName;
  readonly theme: Theme;
  readonly minimum: number;
  readonly legacyExempt: boolean;
  /** How the token is used against the pair. */
  readonly usage: string;
}

function pairs(
  token: SemanticName,
  surfaces: readonly SemanticName[],
  minimum: number,
  usage: string,
): IntendedPair[] {
  const out: IntendedPair[] = [];
  for (const pair of surfaces) {
    for (const theme of ["light", "dark"] as const) {
      out.push({ token, pair, theme, minimum, legacyExempt: false, usage });
    }
  }
  return out;
}

const STATUS_SURFACES = ["--sem-surface"] as const satisfies readonly SemanticName[];

/** Intended pairs per theme, in DESIGN.md section 3.5 order. */
export const INTENDED_PAIRS: readonly IntendedPair[] = [
  ...pairs("--sem-text", ["--sem-surface", "--sem-page", "--sem-surface-muted"], 4.5, "body text"),
  ...pairs("--sem-text-muted", ["--sem-surface", "--sem-surface-muted"], 4.5, "secondary text"),
  ...pairs("--sem-on-brand", ["--sem-brand", "--sem-brand-hover"], 4.5, "text on primary button"),
  ...pairs("--sem-brand", ["--sem-surface"], 3, "UI component, link"),
  ...pairs("--sem-brand", ["--sem-surface-muted"], 4.5, "nav-link hover text"),
  ...pairs("--sem-brand", ["--sem-page", "--sem-secondary-subtle"], 3, "focus ring; btn-secondary hover border"),
  ...pairs("--sem-secondary", ["--sem-surface"], 4.5, "secondary text and selected state"),
  ...pairs("--sem-secondary", ["--sem-secondary-subtle"], 3, "btn-secondary border"),
  ...pairs("--sem-on-secondary-subtle", ["--sem-secondary-subtle", "--sem-surface-muted"], 4.5, "text on soft background; btn-secondary hover"),
  ...pairs("--sem-on-accent", ["--sem-accent", "--sem-accent-hover"], 4.5, "text on accent fill"),
  ...pairs("--sem-accent", ["--sem-surface"], 4.5, "accent text"),
  ...pairs("--sem-on-accent-subtle", ["--sem-accent-subtle"], 4.5, "text on accent chip"),
  ...pairs("--sem-success", [...STATUS_SURFACES, "--sem-success-subtle"], 4.5, "status text"),
  ...pairs("--sem-warning", [...STATUS_SURFACES, "--sem-warning-subtle"], 4.5, "status text"),
  ...pairs("--sem-danger", [...STATUS_SURFACES, "--sem-danger-subtle"], 4.5, "status text"),
  ...pairs("--sem-emergency", [...STATUS_SURFACES, "--sem-emergency-subtle"], 4.5, "status text"),
  ...pairs("--sem-on-emergency", ["--sem-emergency"], 4.5, "text on solid emergency fill"),
  ...pairs("--sem-border-strong", ["--sem-surface", "--sem-page"], 3, "control border"),
];

/** Intended pairs for one theme. */
export function pairsFor(theme: Theme): IntendedPair[] {
  return INTENDED_PAIRS.filter((entry) => entry.theme === theme);
}
