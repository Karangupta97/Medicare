"use client";

import { useRef, type KeyboardEvent } from "react";
import { useBilling } from "./billing-context";
import { INTRO, MAX_SAVE_PCT, type BillingPeriod } from "./plans";
import { SEGMENT_TRACK, segmentClass } from "./segmented";

const OPTIONS: readonly { value: BillingPeriod; label: string }[] = [
  { value: "monthly", label: INTRO.monthlyLabel },
  { value: "annual", label: INTRO.annualLabel },
];

/** Segmented Monthly | Annual radio group. Arrow keys move and select; only the checked option is in the tab order. */
export function BillingToggle() {
  const { billing, setBilling } = useBilling();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function select(index: number) {
    const option = OPTIONS[(index + OPTIONS.length) % OPTIONS.length];
    if (option === undefined) return;
    setBilling(option.value);
    refs.current[OPTIONS.indexOf(option)]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        select(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        select(index - 1);
        break;
      case "Home":
        event.preventDefault();
        select(0);
        break;
      case "End":
        event.preventDefault();
        select(OPTIONS.length - 1);
        break;
      default:
    }
  }

  return (
    <div role="radiogroup" aria-label={INTRO.billingLabel} className={SEGMENT_TRACK}>
      {OPTIONS.map((option, index) => {
        const checked = option.value === billing;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => setBilling(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={segmentClass(checked)}
          >
            {option.label}
            {option.value === "annual" && (
              <span className="whitespace-nowrap rounded-full bg-secondary-subtle px-2 py-0.5 text-xs font-medium text-on-secondary-subtle">
                Save up to {MAX_SAVE_PCT}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
