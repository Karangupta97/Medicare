// External store that resolves design tokens for the design-check route
// (design.md › Components and Interfaces › Design_Check_Route).
//
// The resolver functions (`resolveColor`, `resolveColors`, `resolveTypography`) take a
// style source as a parameter and touch no browser globals, so a fake style source can
// test them from Node with type stripping. Browser globals are read only inside
// `createDomStyleSource` and the store returned by `createTokenStore`, and only when
// their functions run, never at module load time.
//
// Only erasable TypeScript syntax. No color literals (Requirement 10.5).
//
// Note for Node: this module imports "./css-color" without an extension, as the rest of
// the Next.js code does. A Node script that imports this file directly needs a resolve
// hook that retries extensionless relative specifiers with ".ts"
// (`registerHooks` from "node:module").
import type { Rgba } from "./contrast";
import { parseComputedColor } from "./css-color";

export type UnresolvedReason = "undefined-variable" | "unparseable";

export type ResolvedColor =
  | { status: "resolved"; rgba: Rgba }
  | { status: "unresolved"; reason: UnresolvedReason };

/** Computed typography of one sample class, as returned by getComputedStyle. */
export type TypographyStyle = {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
};

export type TokenSnapshot = {
  version: number;
  /** Keyed by custom property name, for example "--sem-brand". */
  values: ReadonlyMap<string, ResolvedColor>;
  /** Keyed by class name, for example "heading-1" or "font-mono". */
  typography: ReadonlyMap<string, TypographyStyle>;
};

/** Where the resolver reads styles from. The browser implementation is `createDomStyleSource`. */
export interface StyleSource {
  /** Step 1: raw value of the custom property on `<html>` ("" when undefined). */
  readCustomProperty(name: string): string;
  /** Step 2: computed `background-color` of a probe whose background is `var(name)`. */
  readProbeColor(name: string): string;
  /**
   * Step 3 fallback for strings the parser rejects (for example `oklch(…)`):
   * 8-bit sRGB through a 1×1 canvas, or null when the string is not a usable color.
   */
  rasterizeColor(value: string): Rgba | null;
}

export interface TypographySource {
  readTypography(className: string): TypographyStyle;
}

/**
 * Resolves one color token. Errors thrown by the style source mark only this token
 * as unresolved, so the other tokens still resolve (Requirement 14.12, Property 16).
 */
export function resolveColor(name: string, source: StyleSource): ResolvedColor {
  try {
    if (source.readCustomProperty(name).trim() === "") {
      return { status: "unresolved", reason: "undefined-variable" };
    }
    const computed = source.readProbeColor(name).trim();
    if (computed === "") return { status: "unresolved", reason: "unparseable" };
    const rgba = parseComputedColor(computed) ?? source.rasterizeColor(computed);
    if (rgba === null) return { status: "unresolved", reason: "unparseable" };
    return { status: "resolved", rgba };
  } catch {
    return { status: "unresolved", reason: "unparseable" };
  }
}

/** Resolves every name independently, keeping the input order. */
export function resolveColors(
  names: readonly string[],
  source: StyleSource,
): Map<string, ResolvedColor> {
  const values = new Map<string, ResolvedColor>();
  for (const name of names) values.set(name, resolveColor(name, source));
  return values;
}

/** Reads typography for each class. A class whose read throws is left out of the map. */
export function resolveTypography(
  classNames: readonly string[],
  source: TypographySource,
): Map<string, TypographyStyle> {
  const styles = new Map<string, TypographyStyle>();
  for (const className of classNames) {
    try {
      styles.set(className, source.readTypography(className));
    } catch {
      // Skipped; the sample renders without computed labels.
    }
  }
  return styles;
}

// Hidden, out-of-flow and non-interactive. Font and background properties are left alone.
const PROBE_CSS =
  "position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;" +
  "clip-path:inset(50%);visibility:hidden;pointer-events:none;";

// Set before each conversion. Only strings the parser rejects reach the canvas, so no
// input can equal this rgba() sentinel; an unchanged fillStyle means the input was ignored.
const FILL_SENTINEL = "rgba(1, 2, 3, 0.5)";

/** Theme scope for a probe: the probe container gets the `light` or `dark` class. */
export type StyleScope = "light" | "dark";

/**
 * Browser style source. Call only in the browser. The probe container is attached by
 * `attach()` and removed by `detach()`, so it exists in the document only while
 * the store reads values.
 *
 * With a `scope`, custom properties are read from a container that carries the `light` or
 * `dark` class, so both themes can be measured at once whatever theme `<html>` is in.
 * Without a scope they are read from `<html>`, as before.
 */
export function createDomStyleSource(scope?: StyleScope): StyleSource &
  TypographySource & { attach(): void; detach(): void } {
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  if (scope !== undefined) container.className = scope;
  container.dataset.designCheckProbe = "";
  container.style.cssText = PROBE_CSS;

  const colorProbe = document.createElement("div");
  colorProbe.style.cssText = PROBE_CSS;
  container.append(colorProbe);
  const colorProbeStyle = getComputedStyle(colorProbe);

  const typeProbe = document.createElement("div");
  typeProbe.style.cssText = PROBE_CSS;
  container.append(typeProbe);
  const typeProbeStyle = getComputedStyle(typeProbe);

  const rootStyle = getComputedStyle(document.documentElement);
  const containerStyle = getComputedStyle(container);

  let context: CanvasRenderingContext2D | null | undefined;
  function getCanvasContext(): CanvasRenderingContext2D | null {
    if (context === undefined) {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      context = canvas.getContext("2d", { colorSpace: "srgb", willReadFrequently: true });
    }
    return context;
  }

  return {
    attach() {
      if (!container.isConnected) document.body.append(container);
    },
    detach() {
      container.remove();
    },
    readCustomProperty(name) {
      return (scope === undefined ? rootStyle : containerStyle).getPropertyValue(name);
    },
    readProbeColor(name) {
      colorProbe.style.backgroundColor = `var(${name})`;
      return colorProbeStyle.backgroundColor;
    },
    rasterizeColor(value) {
      const ctx = getCanvasContext();
      if (ctx === null) return null;
      ctx.fillStyle = FILL_SENTINEL;
      const before = ctx.fillStyle;
      ctx.fillStyle = value;
      if (ctx.fillStyle === before) return null;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1, { colorSpace: "srgb" }).data;
      return [r, g, b, Math.round((a / 255) * 1000) / 1000];
    },
    readTypography(className) {
      typeProbe.className = className;
      return {
        fontFamily: typeProbeStyle.fontFamily,
        fontSize: typeProbeStyle.fontSize,
        lineHeight: typeProbeStyle.lineHeight,
        fontWeight: typeProbeStyle.fontWeight,
      };
    },
  };
}

export type TokenStoreConfig = {
  /** Custom property names to resolve, for example "--prim-navy-900" and "--sem-brand". */
  tokens: readonly string[];
  /** Classes whose computed typography is read, for example "heading-1" and "font-mono". */
  typography: readonly string[];
};

export type TokenStore = {
  subscribe(onChange: () => void): () => void;
  getSnapshot(): TokenSnapshot;
  getServerSnapshot(): TokenSnapshot;
};

const SERVER_SNAPSHOT: TokenSnapshot = Object.freeze({
  version: 0,
  values: new Map<string, ResolvedColor>(),
  typography: new Map<string, TypographyStyle>(),
});

/** Constant snapshot with empty maps, for server rendering and hydration. */
export function getServerSnapshot(): TokenSnapshot {
  return SERVER_SNAPSHOT;
}

/**
 * Creates a store for `useSyncExternalStore(store.subscribe, store.getSnapshot,
 * store.getServerSnapshot)`. Creating it reads nothing from the DOM, so it is safe at
 * module level in a Client Component. The token and class lists come from the caller.
 */
export function createTokenStore(config: TokenStoreConfig): TokenStore {
  const tokens = [...config.tokens];
  const typography = [...config.typography];
  const listeners = new Set<() => void>();
  let source: ReturnType<typeof createDomStyleSource> | null = null;
  let snapshot: TokenSnapshot | null = null;
  let version = 0;
  let observer: MutationObserver | null = null;
  let frame: number | null = null;

  function compute(): TokenSnapshot {
    source ??= createDomStyleSource();
    source.attach();
    try {
      version += 1;
      return {
        version,
        values: resolveColors(tokens, source),
        typography: resolveTypography(typography, source),
      };
    } finally {
      source.detach();
    }
  }

  function getSnapshot(): TokenSnapshot {
    if (typeof document === "undefined") return SERVER_SNAPSHOT;
    snapshot ??= compute();
    return snapshot;
  }

  // Recompute in the next frame, after next-themes has applied the class and color-scheme.
  function scheduleRecompute(): void {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      snapshot = compute();
      for (const listener of [...listeners]) listener();
    });
  }

  function subscribe(onChange: () => void): () => void {
    listeners.add(onChange);
    if (observer === null) {
      observer = new MutationObserver(scheduleRecompute);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
      // The theme may have changed between the cached read and this subscription.
      if (snapshot !== null) scheduleRecompute();
    }
    return () => {
      listeners.delete(onChange);
      if (listeners.size > 0) return;
      observer?.disconnect();
      observer = null;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };
  }

  return { subscribe, getSnapshot, getServerSnapshot };
}
