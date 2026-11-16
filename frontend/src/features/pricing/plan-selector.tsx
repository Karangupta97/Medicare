"use client";

import { useRef, type KeyboardEvent } from "react";
import { PLANS, type PlanKey } from "./plans";
import { SEGMENT_TRACK, segmentClass } from "./segmented";

interface PlanSelectorProps {
  value: PlanKey;
  onChange: (next: PlanKey) => void;
  label: string;
  /** Ids are `${idPrefix}-tab-${key}` (tabs) and `${idPrefix}-panel-${key}` (the panels they control). */
  idPrefix: string;
  /** Visibility classes, for example "lg:hidden". */
  className?: string;
}

/** Soft segmented Free | Pro | Premium tablist with arrow-key, Home and End support. */
export function PlanSelector({ value, onChange, label, idPrefix, className }: PlanSelectorProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function select(index: number) {
    const target = PLANS[(index + PLANS.length) % PLANS.length];
    if (target === undefined) return;
    onChange(target.key);
    refs.current[PLANS.indexOf(target)]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number | undefined> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: PLANS.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  }

  return (
    <div className={`flex justify-center ${className ?? ""}`}>
      <div role="tablist" aria-label={label} className={SEGMENT_TRACK}>
        {PLANS.map((plan, index) => {
          const selected = plan.key === value;
          return (
            <button
              key={plan.key}
              ref={(el) => {
                refs.current[index] = el;
              }}
              id={`${idPrefix}-tab-${plan.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${plan.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(plan.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={segmentClass(selected)}
            >
              {plan.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
