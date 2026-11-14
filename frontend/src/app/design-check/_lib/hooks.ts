// Browser hooks for the dashboard. Each one renders a constant value on the server and
// during hydration, then the real value, so the first client render matches the server HTML.
import { useSyncExternalStore } from "react";
import { createDomStyleSource, resolveTypography, type TypographyStyle } from "./token-store";

const subscribeNever = () => () => {};

/** False on the server and during hydration, true afterwards. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

function subscribeResize(onChange: () => void): () => void {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** The user's reduced-motion setting. False until mounted. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/** Viewport width in CSS pixels. 0 until mounted. */
export function useViewportWidth(): number {
  return useSyncExternalStore(subscribeResize, () => window.innerWidth, () => 0);
}

// Tailwind breakpoints used by the design system (DESIGN.md section 6).
const BREAKPOINTS = [
  { name: "2xl", min: 1536 },
  { name: "xl", min: 1280 },
  { name: "lg", min: 1024 },
  { name: "md", min: 768 },
  { name: "sm", min: 640 },
  { name: "xs", min: 320 },
] as const;

export function activeBreakpoint(width: number): string {
  if (width === 0) return "…";
  return BREAKPOINTS.find((breakpoint) => breakpoint.min <= width)?.name ?? "below xs";
}

// Typography is read from probe elements that carry the class, at the current viewport width.
export const TYPE_CLASSES = ["heading-1", "heading-2", "body-text", "form-label", "font-sans", "font-montserrat"] as const;

let cachedWidth = -1;
let cachedMetrics = "";

function readMetrics(): string {
  if (typeof document === "undefined") return "";
  if (cachedWidth === window.innerWidth && cachedMetrics !== "") return cachedMetrics;
  const source = createDomStyleSource();
  source.attach();
  try {
    cachedMetrics = JSON.stringify([...resolveTypography(TYPE_CLASSES, source)]);
    cachedWidth = window.innerWidth;
  } finally {
    source.detach();
  }
  return cachedMetrics;
}

/** Computed typography per class at the current viewport, or null until mounted. */
export function useTypeMetrics(): ReadonlyMap<string, TypographyStyle> | null {
  const json = useSyncExternalStore(subscribeResize, readMetrics, () => "");
  if (json === "") return null;
  return new Map(JSON.parse(json) as [string, TypographyStyle][]);
}

export type FontFaceInfo = { readonly weight: string; readonly style: string; readonly status: string };

function readFonts(): string {
  if (typeof document === "undefined" || !("fonts" in document)) return "";
  const faces: FontFaceInfo[] = [];
  document.fonts.forEach((face) => {
    if (/montserrat/i.test(face.family)) faces.push({ weight: face.weight, style: face.style, status: face.status });
  });
  return JSON.stringify(faces);
}

function subscribeFonts(onChange: () => void): () => void {
  document.fonts.addEventListener("loadingdone", onChange);
  return () => document.fonts.removeEventListener("loadingdone", onChange);
}

/** Montserrat Alternates font faces declared on the page and their load status. Null until mounted. */
export function useFontFaces(): readonly FontFaceInfo[] | null {
  const json = useSyncExternalStore(subscribeFonts, readFonts, () => "");
  if (json === "") return null;
  return JSON.parse(json) as FontFaceInfo[];
}
