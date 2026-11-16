"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/features/pricing/use-media-query";
import { MedicareMark } from "./medicare-mark";

/** Same-origin, high-contrast mark only (cross in black, leaves in white, transparent background). */
const MARK_SRC = "/medicare-mark-dither.svg";

const DitheredLogo = dynamic(
  () => import("@/components/landing/dithered-logo/dithered-logo").then((module) => module.DitheredLogo),
  { ssr: false },
);

/** Catches errors thrown while rendering the canvas component and shows the static mark instead. */
class StageErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Static mark, centered at the same scale the canvas uses (70% of the shorter side). */
function StaticMark({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out motion-reduce:transition-none ${
        hidden === true ? "opacity-0" : "opacity-100"
      }`}
    >
      <MedicareMark className="h-[70%] max-w-[70%] aspect-square" />
    </div>
  );
}

/**
 * Decorative stage for the Medicare mark as an interactive dither particle field. The canvas is created only while the
 * stage is near the viewport and the tab is visible, so no animation runs off screen. The static mark shows until the
 * canvas is ready, with reduced motion, and if anything fails. Ratio is fixed (1:1 phones, 4:3 from sm), so nothing shifts.
 */
export function DitheredStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isWide = useMediaQuery("(min-width: 40rem)");

  useEffect(() => {
    const el = stageRef.current;
    if (el === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry !== undefined) setNear(entry.isIntersecting);
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setTabVisible(!document.hidden);
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  const showCanvas = near && tabVisible && !reducedMotion && !failed;

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-3xl overflow-hidden rounded-2xl bg-surface-muted text-brand [touch-action:pan-y] sm:aspect-[4/3]"
    >
      <StaticMark hidden={showCanvas && ready} />
      {showCanvas && (
        <StageErrorBoundary fallback={null}>
          <DitheredLogo
            imageSrc={MARK_SRC}
            className="absolute inset-0 h-full w-full text-brand"
            gridSize={isWide ? 160 : 120}
            scale={0.7}
            blur={2}
            threshold={180}
            invert
            onReady={onReady}
            onError={onError}
          />
        </StageErrorBoundary>
      )}
    </div>
  );
}
