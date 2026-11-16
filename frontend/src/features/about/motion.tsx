"use client";

import { m, useScroll, useTransform } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef, type ReactNode } from "react";
import { STAGGER, fadeUp, imageClip, imageScale } from "@/lib/motion";

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

import { MotionRoot, PullStatement, RevealLines, ScrollProgress, useMotionOn, useShown } from "@/components/motion/primitives";

export { MotionRoot, PullStatement, RevealLines, ScrollProgress, useMotionOn };

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
