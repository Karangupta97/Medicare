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
  fadeUp,
  imageClip,
  imageScale,
  maskRise,
} from "@/lib/motion";

/**
 * Motion layer for the About page.
 *
 * Why content used to stay hidden: the in-view trigger was attached to the element that was being moved or clipped
 * (a line translated 100% below its overflow-hidden mask, an image clipped to inset(100%)). Those elements never
 * intersected the viewport, so the "visible" state never ran. Now every trigger observes a STATIC wrapper (the mask,
 * the frame, the block), and the animated child only follows a boolean.
 *
 * Visible by default: the server markup and the first client render use the final ("visible") state. After hydration
 * (and only without reduced motion) elements switch to "hidden" with a zero-duration transition, and animate in when
 * their wrapper is seen. If the observer is missing or never reports back, everything is shown after a short delay.
 * Only transform, opacity and clip-path animate.
 */

/** True after hydration when motion is allowed. */
export function useMotionOn(): boolean {
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  return armed && reduced !== true;
}

/** True once any part of the static wrapper has been in view (or the fallback fired). */
function useShown(ref: RefObject<HTMLElement | null>, enabled: boolean): boolean {
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

interface RevealProps {
  children: ReactNode;
  /** Classes for the static wrapper (spacing, sizing). */
  className?: string;
  /** Classes for the animated inner element (layout of the content). */
  innerClassName?: string;
  /** Position in a group; the delay is index x 0.08s. */
  index?: number;
}

/** Fade up 24px, once, when the wrapper comes into view. */
export function Reveal({ children, className, innerClassName, index = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionOn();
  const shown = useShown(ref, on);
  return (
    <div ref={ref} className={className}>
      <m.div
        className={innerClassName}
        variants={fadeUp}
        custom={index * STAGGER}
        initial={false}
        animate={on && !shown ? "hidden" : "visible"}
      >
        {children}
      </m.div>
    </div>
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

interface RevealLinesProps {
  lines: readonly ReactNode[];
  /** Start delay in seconds. */
  delay?: number;
}

/** Heading lines that rise from behind a mask, one after another. Render it inside the h1 or h2. */
export function RevealLines({ lines, delay = 0 }: RevealLinesProps) {
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

interface ImageFrameProps {
  src: StaticImageData;
  alt: string;
  /** Aspect and sizing classes for the frame, for example "aspect-[4/5]". The ratio reserves the space. */
  className: string;
  sizes: string;
  /** Scroll-linked vertical drift of about 40px. */
  parallax?: boolean;
  priority?: boolean;
  index?: number;
}

/** Rounded image frame with a token overlay, a clip-path reveal and an optional gentle parallax. */
export function ImageFrame({ src, alt, className, sizes, parallax = false, priority = false, index = 0 }: ImageFrameProps) {
  const on = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);
  const shown = useShown(ref, on);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const state = on && !shown ? "hidden" : "visible";

  return (
    <div ref={ref} className="relative">
      <m.div style={on && parallax ? { y } : undefined}>
        <m.div
          className={`relative overflow-hidden rounded-2xl bg-surface-muted ${className}`}
          variants={imageClip}
          custom={index * STAGGER}
          initial={false}
          animate={state}
        >
          <m.div className="absolute inset-0" variants={imageScale} custom={index * STAGGER} initial={false} animate={state}>
            <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover object-center" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-hero-from/15" />
          </m.div>
        </m.div>
      </m.div>
    </div>
  );
}

/** 2px reading-progress bar at the top of the viewport (transform only). */
export function ScrollProgress() {
  const on = useMotionOn();
  const { scrollYProgress } = useScroll();
  if (!on) return null;
  return <m.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-brand" />;
}

/** Wraps the page body. From md a thin curved line beside the sections draws itself as you scroll. */
export function ScrollCurve({ children }: { children: ReactNode }) {
  const on = useMotionOn();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="relative">
      {on && (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-y-0 left-0 hidden h-full w-6 text-secondary/40 md:block lg:w-12 xl:w-24"
        >
          <m.path
            d="M 20 0 C 90 120, -10 240, 55 380 S 95 640, 30 780 S 70 920, 40 1000"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
      )}
      {children}
    </div>
  );
}

/** Lowest word opacity: the statement is always readable. */
const MUTED_OPACITY = 0.4;

function Word({ word, range, progress }: { word: string; range: readonly [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [range[0], range[1]], [MUTED_OPACITY, 1]);
  return (
    <>
      <m.span style={{ opacity }} className="inline-block">
        {word}
      </m.span>{" "}
    </>
  );
}

/**
 * Large statement whose words lighten from muted (40%) to full color as it scrolls through the viewport. Progress is
 * computed from the element's own position on scroll and resize, so it is correct on first paint and never reaches 0 opacity.
 */
export function PullStatement({ text, className }: { text: string; className?: string }) {
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
            return <Word key={index} word={word} range={[start, start + 0.15]} progress={progress} />;
          })
        : text}
    </p>
  );
}
