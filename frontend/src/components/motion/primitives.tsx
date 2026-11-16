"use client";

import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  REVEAL_FALLBACK_MS,
  REVEAL_ROOT_MARGIN,
  STAGGER,
  clipFromBottom,
  drawIn,
  maskRise,
  revealItem,
  staggerContainer,
} from "@/lib/motion";

/**
 * Shared motion primitives (framer-motion through LazyMotion, `m` components only).
 *
 * - Every trigger observes a STATIC wrapper, never the element that is moved or clipped, with threshold 0 (any part
 *   in view) and a small bottom margin. Triggers fire once.
 * - Content is visible by default: the server markup and the first client render use the final state. After hydration,
 *   and only without reduced motion, elements switch to "hidden" with a zero-duration transition and animate in when
 *   seen. If IntersectionObserver is missing or never reports within 1.5 s, everything is shown.
 * - Only transform, opacity, clip-path and stroke length animate. No springs.
 */

/** True after hydration when motion is allowed (not under prefers-reduced-motion). */
export function useMotionOn(): boolean {
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  return armed && reduced !== true;
}

/** True once any part of the static wrapper has been in view (or the fallback fired). */
export function useShown(ref: RefObject<HTMLElement | null>, enabled: boolean): boolean {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (el === null) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    let reported = false;
    const observer = new IntersectionObserver(
      (entries) => {
        reported = true;
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: REVEAL_ROOT_MARGIN },
    );
    observer.observe(el);
    const fallback = window.setTimeout(() => {
      if (!reported) setShown(true);
    }, REVEAL_FALLBACK_MS);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [enabled, ref]);
  return shown;
}

export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/** 2px reading-progress bar in the brand color at the very top of the viewport (transform only). */
export function ScrollProgress() {
  const on = useMotionOn();
  const { scrollYProgress } = useScroll();
  if (!on) return null;
  return <m.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand" />;
}

interface RevealProps {
  children: ReactNode;
  /** Classes for the static wrapper (spacing, sizing). */
  className?: string;
  /** Classes for the animated inner element (layout of the content). */
  innerClassName?: string;
  /** Position in a group; the delay is index x 0.08s. */
  index?: number;
}

/** Fade up 24px over 0.7s, expo-out, once. */
export function Reveal({ children, className, innerClassName, index = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionOn();
  const shown = useShown(ref, on);
  return (
    <div ref={ref} className={className}>
      <m.div
        className={innerClassName}
        variants={revealItem}
        custom={index * STAGGER}
        initial={false}
        animate={on && !shown ? "hidden" : "visible"}
      >
        {children}
      </m.div>
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  /** Classes for the static wrapper. */
  className?: string;
  /** Classes for the animated container (for example a grid). */
  innerClassName?: string;
  /** Render the container as a list. Children must then be StaggerItem as="li". */
  as?: "div" | "ul" | "ol";
}

/** Reveals its StaggerItem children one after another, 0.08s apart, when the wrapper is seen. */
export function Stagger({ children, className, innerClassName, as = "div" }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionOn();
  const shown = useShown(ref, on);
  const state = on && !shown ? "hidden" : "visible";
  const Container = as === "ul" ? m.ul : as === "ol" ? m.ol : m.div;
  return (
    <div ref={ref} className={className}>
      <Container className={innerClassName} variants={staggerContainer} initial={false} animate={state}>
        {children}
      </Container>
    </div>
  );
}

/** One staggered child: fade up 24px. Follows the parent Stagger's state. */
export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Item = as === "li" ? m.li : m.div;
  return (
    <Item className={className} variants={revealItem}>
      {children}
    </Item>
  );
}

/** Check mark that draws itself in as part of a Stagger (follows the parent's state). */
export function DrawCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      <m.polyline points="20 6 9 17 4 12" variants={drawIn} />
    </svg>
  );
}

function MaskLine({ children, delay }: { children: ReactNode; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const on = useMotionOn();
  const shown = useShown(ref, on);
  return (
    <span ref={ref} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <m.span className="block" variants={maskRise} custom={delay} initial={false} animate={on && !shown ? "hidden" : "visible"}>
        {children}{" "}
      </m.span>
    </span>
  );
}

/** Heading lines that rise from behind a mask, one after another. Render it inside the h1 or h2. */
export function RevealLines({ lines, delay = 0 }: { lines: readonly ReactNode[]; delay?: number }) {
  return (
    <>
      {lines.map((line, index) => (
        <MaskLine key={index} delay={delay + index * STAGGER}>
          {line}
        </MaskLine>
      ))}
    </>
  );
}

interface ParallaxImageProps {
  src: StaticImageData;
  alt: string;
  /** Frame classes: aspect ratio, radius, sizing. The frame clips (overflow-hidden) and is the static observed element. */
  className: string;
  sizes: string;
  /** Inner parallax travel as a percentage of the frame height (the image moves against the scroll). 0 disables it. */
  parallax?: number;
  /** Clip-path reveal from the bottom edge (0.9s ease-in-out). */
  clipReveal?: boolean;
  priority?: boolean;
  /** Classes for the image itself (object-fit, filters). */
  imageClassName?: string;
  /** Overlay content drawn above the image (tints, captions). */
  children?: ReactNode;
}

/** Image in a clipped frame with an optional bottom clip reveal and inner parallax. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  parallax = 0,
  clipReveal = false,
  priority = false,
  imageClassName,
  children,
}: ParallaxImageProps) {
  const on = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);
  const shown = useShown(ref, on && clipReveal);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The image is taller than the frame by 2 x parallax %, so it can travel without showing an edge.
  const travel = (parallax / (100 + 2 * parallax)) * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`${-travel}%`, `${travel}%`]);
  const move = on && parallax > 0;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div
        className="absolute inset-0"
        variants={clipFromBottom}
        initial={false}
        animate={on && clipReveal && !shown ? "hidden" : "visible"}
      >
        <m.div
          className="absolute inset-x-0"
          style={{ top: `${-parallax}%`, height: `${100 + 2 * parallax}%`, y: move ? y : undefined }}
        >
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={imageClassName ?? "object-cover object-center"} />
        </m.div>
        {children}
      </m.div>
    </div>
  );
}

function Word({ word, range, progress, floor }: { word: string; range: readonly [number, number]; progress: MotionValue<number>; floor: number }) {
  const opacity = useTransform(progress, [range[0], range[1]], [floor, 1]);
  return (
    <>
      <m.span style={{ opacity }} className="inline-block">
        {word}
      </m.span>{" "}
    </>
  );
}

/**
 * Text whose words lighten from a muted floor (default 40% opacity, never lower) to full color as it scrolls through
 * the viewport. Progress is computed from the element's own position on scroll and resize, so it is correct on first
 * paint. Plain full-color text before hydration and under reduced motion.
 */
export function PullStatement({ text, className, floor = 0.4 }: { text: string; className?: string; floor?: number }) {
  const on = useMotionOn();
  const ref = useRef<HTMLParagraphElement>(null);
  const progress = useMotionValue(1);

  useEffect(() => {
    if (!on) return;
    const el = ref.current;
    if (el === null) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.85;
      const end = viewport * 0.45;
      const value = (start - rect.top) / (start - end + rect.height);
      progress.set(Math.min(1, Math.max(0, value)));
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [on, progress]);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {on
        ? words.map((word, index) => {
            const start = (index / words.length) * 0.85;
            return <Word key={index} word={word} range={[start, start + 0.15]} progress={progress} floor={floor} />;
          })
        : text}
    </p>
  );
}
