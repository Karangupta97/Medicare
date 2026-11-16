"use client";

import { useReducedMotion } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

/** Pull toward the pointer, in px (mouse only). */
const MAGNET_PX = 6;
/** Maximum pointer tilt, in degrees (mouse only). */
const TILT_DEG = 4;

/** Wraps a button or link: it follows the mouse by up to 6px. No effect on touch or under reduced motion. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (el === null || reduced === true || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    el.style.transform = `translate3d(${(clamp(dx) * MAGNET_PX).toFixed(2)}px, ${(clamp(dy) * MAGNET_PX).toFixed(2)}px, 0)`;
  };
  const reset = () => {
    if (ref.current !== null) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={`inline-block transition-transform duration-200 ease-out motion-reduce:transition-none ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

/**
 * Card with a cursor-following spotlight (a glow layer moved with transform, faded in on hover), a violet hairline
 * that draws across the top edge, and a 4px lift. The hover rules also apply on keyboard focus within.
 */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const glow = glowRef.current;
    if (glow === null || reduced === true || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - glow.offsetWidth / 2;
    const y = event.clientY - rect.top - glow.offsetHeight / 2;
    glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  };

  return (
    <div
      onPointerMove={onMove}
      className={`group relative overflow-hidden transition-[transform,border-color,box-shadow] duration-[250ms] ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-lift focus-within:-translate-y-1 focus-within:border-border-strong motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0 ${className ?? ""}`}
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 size-80 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--sem-secondary)_22%,transparent),transparent)] opacity-0 transition-opacity duration-[250ms] ease-out group-hover:opacity-100 motion-reduce:hidden"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-violet transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:transition-none"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/** Subtle pointer tilt (max 4 degrees, mouse only, off under reduced motion). */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el === null || reduced === true || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-py * 2 * TILT_DEG).toFixed(2)}deg) rotateY(${(px * 2 * TILT_DEG).toFixed(2)}deg)`;
  };
  const reset = () => {
    if (ref.current !== null) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
