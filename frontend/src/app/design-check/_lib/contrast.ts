// WCAG 2.x contrast helpers for the Design_Check_Route.
// No imports and only erasable TypeScript syntax, so Node type stripping can load this file.
// Colors are number triples; this file holds no color literals (Requirement 14.5).

/** 8-bit sRGB, integer channels 0–255. */
export type Rgb = readonly [number, number, number];
/** 8-bit sRGB channels 0–255 plus alpha 0–1. */
export type Rgba = readonly [number, number, number, number];

function assertChannel(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new RangeError(`${name} must be an integer from 0 to 255, got ${String(value)}`);
  }
}

function assertRgb(color: Rgb, name: string): void {
  if (!Array.isArray(color) || color.length < 3) {
    throw new RangeError(`${name} must have three channels`);
  }
  assertChannel(color[0], `${name}[0]`);
  assertChannel(color[1], `${name}[1]`);
  assertChannel(color[2], `${name}[2]`);
}

function assertAlpha(value: number, name: string): void {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be a number from 0 to 1, got ${String(value)}`);
  }
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance, 0–1. */
export function relativeLuminance(color: Rgb): number {
  assertRgb(color, "color");
  return 0.2126 * linearize(color[0]) + 0.7152 * linearize(color[1]) + 0.0722 * linearize(color[2]);
}

/** WCAG 2.x contrast ratio, 1–21, symmetric and unrounded. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  assertRgb(a, "a");
  assertRgb(b, "b");
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Alpha-composites fg over an opaque bg: per channel round(fg·α + bg·(1−α)). */
export function compositeOver(fg: Rgba, bg: Rgb): Rgb {
  if (!Array.isArray(fg) || fg.length < 4) {
    throw new RangeError("fg must have four channels");
  }
  assertChannel(fg[0], "fg[0]");
  assertChannel(fg[1], "fg[1]");
  assertChannel(fg[2], "fg[2]");
  assertAlpha(fg[3], "fg[3]");
  assertRgb(bg, "bg");
  const alpha = fg[3];
  const mix = (f: number, b: number): number => Math.round(f * alpha + b * (1 - alpha));
  return [mix(fg[0], bg[0]), mix(fg[1], bg[1]), mix(fg[2], bg[2])];
}

/** Pass/fail on the unrounded ratio, independent of formatRatio. */
export function meetsMinimum(ratio: number, minimum: number): boolean {
  return ratio >= minimum;
}

/** Display form "N.NN:1" (ratio.toFixed(2) + ":1"). Never used for pass/fail. */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/** Lowercase hex label built at runtime: "#" followed by two hex digits per channel. */
export function toHexLabel(color: Rgb): string {
  assertRgb(color, "color");
  const digits = [color[0], color[1], color[2]]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("");
  return "#" + digits;
}
