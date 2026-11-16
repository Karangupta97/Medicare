"use client";

import { m, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { CurveDivider } from "@/components/curve-divider";
import { EASE_IN_OUT } from "@/lib/motion";
import { ABOUT_HERO } from "./hero";
import { Reveal, RevealLines, useMotionOn } from "./motion";

/**
 * Split hero on the landing hero tokens. Entrance on load, staggered 0.08s: eyebrow, title (masked rise), lead, buttons,
 * stage. While the hero scrolls out: title and lead drift up and fade slightly, the stage scales to 92% and rises, the
 * rings expand and fade, the curve rises. Transform and opacity only; all off under reduced motion.
 */
export function AboutHeroScene({ stage }: { stage: ReactNode }) {
  const on = useMotionOn();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const curveScaleY = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  return (
    <section ref={ref} aria-labelledby="about-title" data-brand-surface className="relative overflow-clip bg-hero-via text-on-hero">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-0 size-96 rounded-full bg-hero-glow-a/30 opacity-30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-10 size-72 rounded-full bg-hero-glow-b/30 opacity-30 blur-3xl" />
      <m.div
        aria-hidden="true"
        style={on ? { scale: ringScale, opacity: ringOpacity } : undefined}
        className="pointer-events-none absolute -right-[20%] top-1/2 size-[44rem] -translate-y-1/2 lg:right-[-8%]"
      >
        <div className="absolute inset-[22%] rounded-full border border-on-hero/15" />
        <div className="absolute inset-[11%] rounded-full border border-on-hero/10" />
        <div className="absolute inset-0 rounded-full border border-on-hero/10" />
      </m.div>

      <div className="relative mx-auto grid min-h-[min(88svh,760px)] w-full max-w-[1120px] items-center gap-10 px-4 pb-[calc(clamp(48px,8vw,120px)+72px)] pt-[clamp(32px,6svh,72px)] sm:px-6 lg:grid-cols-2 lg:gap-12">
        <m.div style={on ? { y: textY, opacity: textOpacity } : undefined}>
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-on-hero/70">{ABOUT_HERO.eyebrow}</p>
          </Reveal>
          <h1 id="about-title" className="text-[clamp(3rem,1.2rem+8vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            <RevealLines lines={[ABOUT_HERO.title]} delay={0.08} />
          </h1>
          <Reveal index={2} className="mt-[clamp(16px,3svh,28px)] max-w-[48ch]">
            <p className="text-[17px] font-normal leading-[1.7] text-on-hero/80 sm:text-lg">{ABOUT_HERO.lead}</p>
          </Reveal>
          <Reveal index={3} className="mt-8" innerClassName="flex flex-wrap gap-3">
            <Link
              href={ABOUT_HERO.primary.href}
              className="inline-flex min-h-11 items-center rounded-full bg-surface px-6 text-[15px] font-medium text-brand transition-colors duration-[250ms] ease-out hover:bg-surface-muted motion-reduce:transition-none"
            >
              {ABOUT_HERO.primary.label}
            </Link>
            <Link
              href={ABOUT_HERO.secondary.href}
              className="inline-flex min-h-11 items-center rounded-full border border-on-hero/30 px-6 text-[15px] font-medium text-on-hero transition-colors duration-[250ms] ease-out hover:bg-on-hero/10 motion-reduce:transition-none"
            >
              {ABOUT_HERO.secondary.label}
            </Link>
          </Reveal>
        </m.div>
        <m.div style={on ? { scale: stageScale, y: stageY } : undefined} className="mx-auto w-full max-w-[520px] lg:ml-auto">
          <Reveal index={4}>{stage}</Reveal>
        </m.div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[calc(clamp(48px,8vw,120px)+12px)] hidden sm:block">
        <div className="mx-auto flex max-w-[1120px] items-center gap-3 px-6 text-xs font-medium uppercase tracking-[0.14em] text-on-hero/70">
          <span className="relative block h-10 w-px overflow-hidden bg-on-hero/20">
            <m.span
              className="absolute inset-x-0 top-0 block h-4 bg-on-hero"
              animate={on ? { y: ["-100%", "260%"] } : undefined}
              transition={{ duration: 2.6, ease: EASE_IN_OUT, repeat: Infinity }}
            />
          </span>
          Scroll
        </div>
      </div>

      <m.div style={on ? { scaleY: curveScaleY } : undefined} className="absolute inset-x-0 -bottom-px origin-bottom">
        <CurveDivider orientation="top" className="text-page" />
      </m.div>
    </section>
  );
}
