"use client";

import { useRef, useSyncExternalStore, type KeyboardEvent, type ReactElement, type SVGProps } from "react";
import { useTheme } from "next-themes";
import { THEME_MODES, checkedStates, nextOptionIndex, toThemeMode, type ThemeMode, type ToggleKey } from "./theme-mode";

type IconProps = SVGProps<SVGSVGElement>;

const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function SunIcon(props: IconProps) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(props: IconProps) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon(props: IconProps) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

const OPTIONS: readonly { mode: ThemeMode; label: string; Icon: (props: IconProps) => ReactElement }[] = [
  { mode: THEME_MODES[0], label: "Light", Icon: SunIcon },
  { mode: THEME_MODES[1], label: "Dark", Icon: MoonIcon },
  { mode: THEME_MODES[2], label: "System", Icon: SystemIcon },
];

const TOGGLE_KEYS: readonly string[] = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", " "];

function isToggleKey(key: string): key is ToggleKey {
  return TOGGLE_KEYS.includes(key);
}

// Mount detection without setState in an effect: the server snapshot is
// false, the client snapshot is true, so hydration renders the placeholder.
const subscribeNever = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const OPTION_CLASS =
  "flex size-11 items-center justify-center rounded-lg border-2 border-transparent text-text-muted " +
  "aria-checked:border-brand aria-checked:bg-surface aria-checked:text-text " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeNever, getClientSnapshot, getServerSnapshot);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const checked = mounted ? checkedStates(toThemeMode(theme)) : ([false, false, false] as const);

  function select(index: 0 | 1 | 2) {
    setTheme(OPTIONS[index].mode);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: 0 | 1 | 2) {
    if (!mounted || !isToggleKey(event.key)) return;
    event.preventDefault();
    const next = nextOptionIndex(index, event.key);
    select(next);
    if (next !== index) buttonsRef.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex gap-1 rounded-xl border border-border bg-surface-muted p-1"
    >
      {OPTIONS.map((option, i) => {
        const index = i as 0 | 1 | 2;
        return (
          <button
            key={option.mode}
            ref={(node) => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-label={option.label}
            aria-checked={checked[index]}
            tabIndex={checked[index] ? 0 : -1}
            className={OPTION_CLASS}
            onClick={mounted ? () => select(index) : undefined}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <option.Icon aria-hidden="true" focusable="false" />
          </button>
        );
      })}
    </div>
  );
}
