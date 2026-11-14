"use client";
import type { ReactNode } from "react";
import { CopyIcon } from "./icons";
import { useDashboard } from "./dashboard-provider";

/** A text button that copies `text` and announces it. Keeps a 44px touch target. */
export function CopyButton({ text, children }: { text: string; children: ReactNode }) {
  const { copy } = useDashboard();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={`Copy ${text}`}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-left font-mono text-sm text-text hover:bg-surface-muted"
    >
      <span className="break-all">{children}</span>
      <CopyIcon className="size-3.5 shrink-0 text-text-muted" />
    </button>
  );
}
