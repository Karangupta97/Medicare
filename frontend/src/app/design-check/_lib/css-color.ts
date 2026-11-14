// Parser for color strings returned by getComputedStyle.
// No imports and only erasable TypeScript syntax, so Node type stripping can load it.

// Same shape as `Rgba` in ./contrast: 8-bit sRGB channels (integers 0–255) and alpha 0–1.
export type Rgba = readonly [number, number, number, number];

const NUMBER = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?`;
const ALPHA = String.raw`${NUMBER}%?`;

// rgb(r, g, b) / rgba(r, g, b, a), comma syntax. Either function name, alpha optional.
const RGB_COMMA = new RegExp(
  String.raw`^rgba?\(\s*(${NUMBER})\s*,\s*(${NUMBER})\s*,\s*(${NUMBER})\s*(?:,\s*(${ALPHA})\s*)?\)$`,
  "i",
);

// rgb(r g b / a), space syntax. Either function name, alpha optional.
const RGB_SPACE = new RegExp(
  String.raw`^rgba?\(\s*(${NUMBER})\s+(${NUMBER})\s+(${NUMBER})\s*(?:\/\s*(${ALPHA})\s*)?\)$`,
  "i",
);

// color(srgb r g b / a), channels 0–1.
const COLOR_SRGB = new RegExp(
  String.raw`^color\(\s*srgb\s+(${NUMBER})\s+(${NUMBER})\s+(${NUMBER})\s*(?:\/\s*(${ALPHA})\s*)?\)$`,
  "i",
);

function parseAlpha(raw: string | undefined): number | null {
  if (raw === undefined) return 1;
  const isPercent = raw.endsWith("%");
  const n = Number(isPercent ? raw.slice(0, -1) : raw);
  if (!Number.isFinite(n)) return null;
  const alpha = isPercent ? n / 100 : n;
  return alpha >= 0 && alpha <= 1 ? alpha : null;
}

// Converts channel strings to 8-bit integers. `scale` is 255 for color(srgb) and 1 for rgb().
// Out-of-range channels return null so the caller can fall back to another resolver.
function toChannels(raw: readonly string[], scale: number): [number, number, number] | null {
  const out: number[] = [];
  for (const value of raw) {
    const n = Number(value) * scale;
    if (!Number.isFinite(n)) return null;
    const rounded = Math.round(n);
    if (rounded < 0 || rounded > 255) return null;
    out.push(rounded);
  }
  return [out[0], out[1], out[2]];
}

/**
 * Parses a computed CSS color.
 * Accepts "rgb(r, g, b)", "rgba(r, g, b, a)", "rgb(r g b / a)" and "color(srgb r g b / a)"
 * (channels 0–1, scaled to 0–255 and rounded). Returns null for any other syntax,
 * such as oklch(), oklab(), lab() or keywords like "transparent".
 */
export function parseComputedColor(value: string): Rgba | null {
  const input = value.trim();

  const rgb = RGB_COMMA.exec(input) ?? RGB_SPACE.exec(input);
  const srgb = rgb === null ? COLOR_SRGB.exec(input) : null;
  const match = rgb ?? srgb;
  if (match === null) return null;

  const channels = toChannels([match[1], match[2], match[3]], rgb !== null ? 1 : 255);
  const alpha = parseAlpha(match[4]);
  if (channels === null || alpha === null) return null;

  return [channels[0], channels[1], channels[2], alpha];
}
