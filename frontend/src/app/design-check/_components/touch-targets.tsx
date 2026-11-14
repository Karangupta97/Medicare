"use client";
// Wraps the component samples and, when switched on, outlines every control with a dashed
// line so its box (and the 44px minimum height) is visible.
import { useState, type ReactNode } from "react";

export function TouchTargetScope({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setOn((value) => !value)}
          className={on ? "btn btn-primary" : "btn btn-secondary"}
        >
          Touch-target outlines: {on ? "on" : "off"}
        </button>
        <p className="max-w-prose text-sm text-text-muted">
          Draws a dashed outline around each button, link and field. The minimum touch target is 44px (min-h-11).
        </p>
      </div>
      <div
        data-targets={on ? "on" : "off"}
        className={[
          "space-y-6",
          "data-[targets=on]:[&_button]:outline-2 data-[targets=on]:[&_button]:outline-dashed data-[targets=on]:[&_button]:outline-secondary",
          "data-[targets=on]:[&_a]:outline-2 data-[targets=on]:[&_a]:outline-dashed data-[targets=on]:[&_a]:outline-secondary",
          "data-[targets=on]:[&_input]:outline-2 data-[targets=on]:[&_input]:outline-dashed data-[targets=on]:[&_input]:outline-secondary",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
