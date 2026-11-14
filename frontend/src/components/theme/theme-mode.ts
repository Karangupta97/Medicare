// Pure Theme_Mode helpers. No imports and only erasable TypeScript syntax,
// so Node type stripping can import this file directly.

export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function toThemeMode(value: string | null | undefined): ThemeMode {
  return isThemeMode(value) ? value : "system";
}

export type ToggleKey = "ArrowRight" | "ArrowDown" | "ArrowLeft" | "ArrowUp" | " ";

// ArrowRight/ArrowDown → (current + 1) % 3; ArrowLeft/ArrowUp → (current + 2) % 3; " " → current
export function nextOptionIndex(current: 0 | 1 | 2, key: ToggleKey): 0 | 1 | 2 {
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return ((current + 1) % 3) as 0 | 1 | 2;
    case "ArrowLeft":
    case "ArrowUp":
      return ((current + 2) % 3) as 0 | 1 | 2;
    case " ":
      return current;
  }
}

// The index of mode in THEME_MODES is true, the other two are false.
export function checkedStates(mode: ThemeMode): readonly [boolean, boolean, boolean] {
  return [mode === THEME_MODES[0], mode === THEME_MODES[1], mode === THEME_MODES[2]] as const;
}
