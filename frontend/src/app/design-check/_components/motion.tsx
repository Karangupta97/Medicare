"use client";
// One card per animation class. One-shot animations get a Replay button (it remounts the preview).
// The global reduced-motion rule in globals.css stops every animation class, so the previews
// become static when the user asks for reduced motion.
import { useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../_lib/hooks";
import { MOTION, type MotionEntry } from "../_lib/motion";
import { ReplayIcon } from "./icons";
import { Code } from "./panel";

function Preview({ entry }: { entry: MotionEntry }): ReactNode {
  switch (entry.className) {
    case "animate-float":
      return <div className="animate-float size-12 rounded-xl bg-secondary" />;
    case "animate-fadeIn":
      return <div className="animate-fadeIn rounded-xl border border-secondary bg-secondary-subtle p-4 text-sm text-on-secondary-subtle">Fades in</div>;
    case "animate-slideIn":
      return <div className="animate-slideIn rounded-xl border border-secondary bg-secondary-subtle p-4 text-sm text-on-secondary-subtle">Slides in from the right</div>;
    case "animate-scroll":
      return (
        <div className="h-3 overflow-hidden rounded-full bg-surface-muted">
          <div className="animate-scroll h-3 w-1/4 rounded-full bg-secondary" />
        </div>
      );
    case "notification-badge":
      return (
        <span className="notification-badge inline-flex size-8 items-center justify-center rounded-full border border-danger bg-danger-subtle text-sm font-bold text-danger">3</span>
      );
    case "status-indicator":
      return (
        <p className="flex items-center gap-2 text-sm text-text">
          <span className="status-indicator inline-block size-4 rounded-full bg-success" />
          Online
        </p>
      );
    case "animate-medical-fade":
      return <div className="animate-medical-fade rounded-xl border border-secondary bg-secondary-subtle p-4 text-sm text-on-secondary-subtle">Medical fade</div>;
    case "animate-medical-pop":
      return <div className="animate-medical-pop rounded-xl border border-secondary bg-secondary-subtle p-4 text-sm text-on-secondary-subtle">Medical pop</div>;
    case "animate-medical-pulse-ring":
      return (
        <div className="relative size-14">
          <span className="absolute inset-0 m-auto size-5 rounded-full bg-secondary" />
          <span className="animate-medical-pulse-ring absolute inset-0 rounded-full" />
        </div>
      );
    case "animate-medical-dots":
      return (
        <p className="flex items-start gap-1 text-base leading-6 text-text">
          Loading
          <span className="animate-medical-dots inline-block h-6 w-6" />
        </p>
      );
    case "skeleton-medical":
      return (
        <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
          <div className="skeleton-medical h-4 w-full rounded" />
          <div className="skeleton-medical h-4 w-3/4 rounded" />
          <div className="skeleton-medical h-4 w-1/2 rounded" />
        </div>
      );
    default:
      return null;
  }
}

function MotionCard({ entry }: { entry: MotionEntry }) {
  const [run, setRun] = useState(0);
  return (
    <li className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex min-h-20 items-center" key={run}>
        <div className="w-full">
          <Preview entry={entry} />
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <p><Code>{entry.className}</Code></p>
        <p className="text-text-muted">{entry.keyframe} · {entry.duration} · {entry.easing}</p>
        <p className="text-text-muted">{entry.iteration}</p>
      </div>
      {entry.oneShot && (
        <button type="button" onClick={() => setRun((value) => value + 1)} className="btn btn-secondary mt-auto self-start">
          <ReplayIcon />
          Replay
        </button>
      )}
    </li>
  );
}

export function MotionGrid() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-border bg-surface-muted p-4 text-sm text-text">
        Reduced motion on this device:{" "}
        <span className="font-bold">{reduced ? "on" : "off"}</span>.{" "}
        {reduced
          ? "Every animation below is stopped by the global rule in globals.css."
          : "Turn on “reduce motion” in your system settings to see them stop."}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOTION.map((entry) => (
          <MotionCard key={entry.className} entry={entry} />
        ))}
      </ul>
    </div>
  );
}
