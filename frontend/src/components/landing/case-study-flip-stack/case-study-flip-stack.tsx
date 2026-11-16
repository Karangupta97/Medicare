"use client";

/*
 * Case Study Flip Stack, from Componentry (https://componentry.dev/docs/components/case-study-flip-stack), installed with
 * `npx shadcn@latest add @componentry/case-study-flip-stack`. The registry file has no license header; the docs list
 * Componentry components as MIT and say to verify licenses before production use.
 * Behavior kept: a sticky stage where the top card tilts on the X axis and lifts away while the next card rises from the stack.
 * Changes: strict TypeScript; the demo page chrome (scroll hint, heading, "The End") is removed; the last card stays instead
 * of flipping away; the spring on the scroll progress is removed (Lenis already smooths it); colors are CSS variables from our
 * tokens; cards use next/image and an empty, labelled image slot until a photo is supplied; position dots; a static list under
 * reduced motion; the stage sits under the sticky navbar.
 */

import { m, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CaseStudyFlipItem {
  number?: string;
  eyebrow?: string;
  title: string;
  description: string;
  /** Extra line under the description. */
  note?: string;
  /** Small pill next to the number. */
  badge?: string;
  /** Shown in the empty image slot until `image` is set. */
  icon?: ReactNode;
  /** Photo for the image slot. Leave undefined to show the placeholder. */
  image?: StaticImageData | string;
  imageAlt?: string;
  /** CSS color value, for example "var(--sem-hero-via)". */
  background: string;
  /** CSS color value, for example "var(--sem-on-hero)". */
  foreground?: string;
}

interface CaseStudyFlipStackProps {
  items: readonly CaseStudyFlipItem[];
  className?: string;
}

/** Scroll distance per transition, in svh. */
const SCROLL_PER_CARD_SVH = 90;

function ImageSlot({ item, priority }: { item: CaseStudyFlipItem; priority: boolean }) {
  return (
    <div
      data-slot="case-study-image"
      className="relative m-[clamp(10px,1.2vw,18px)] min-h-[140px] overflow-hidden rounded-[clamp(12px,1.4vw,22px)] bg-on-hero/10 ring-1 ring-on-hero/15 sm:ml-0"
    >
      {item.image !== undefined ? (
        <>
          <Image
            src={item.image}
            alt={item.imageAlt ?? ""}
            fill
            priority={priority}
            sizes="(min-width: 640px) 400px, 90vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-hero-from/15" />
        </>
      ) : (
        // Empty slot: add `image` (and `imageAlt`) to the item to fill it.
        <div aria-hidden="true" className="absolute inset-3 flex items-center justify-center rounded-[inherit] border border-dashed border-on-hero/25">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,color-mix(in_srgb,var(--sem-hero-glow-b)_28%,transparent),transparent)]" />
          <div className="relative flex size-16 items-center justify-center rounded-full bg-on-hero/10 text-on-hero/80 ring-1 ring-on-hero/20 sm:size-20 [&_svg]:size-8 sm:[&_svg]:size-10">
            {item.icon}
          </div>
        </div>
      )}
    </div>
  );
}

function CardFace({ item, index, total }: { item: CaseStudyFlipItem; index: number; total: number }) {
  return (
    <div
      className="relative grid h-full overflow-hidden rounded-[clamp(18px,2vw,30px)] shadow-lift ring-1 ring-on-hero/10 sm:grid-cols-[1.15fr_0.85fr]"
      style={{ backgroundColor: item.background, color: item.foreground ?? "var(--sem-on-hero)" }}
    >
      {/* Premium finish: a soft top-left sheen and a violet glow, both from tokens */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-br from-on-hero/10 via-transparent to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_90%_0%,color-mix(in_srgb,var(--sem-hero-glow-b)_26%,transparent),transparent)]"
      />
      <div className="relative flex min-w-0 flex-col p-[clamp(24px,3vw,48px)] md:pr-[clamp(22px,3vw,48px)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[clamp(24px,2.5vw,36px)] font-medium leading-none tracking-[-0.06em]">
            {item.number ?? String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-30" />
          <span className="text-xs font-medium tracking-[0.14em] opacity-70">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          {item.badge !== undefined && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-on-hero/25 bg-on-hero/10 px-2.5 py-0.5 text-xs font-medium">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-hero-accent-to" />
              {item.badge}
            </span>
          )}
        </div>
        <div className="mt-auto max-w-[46rem] pt-8">
          {item.eyebrow !== undefined && (
            <p className="mb-[clamp(10px,1.5vw,22px)] text-[10px] font-medium uppercase tracking-[0.16em] opacity-70 sm:text-xs">{item.eyebrow}</p>
          )}
          <h3 className="max-w-[16ch] text-balance text-[clamp(28px,3.25vw,48px)] font-bold leading-[0.98] tracking-[-0.04em]">{item.title}</h3>
          <p className="mt-[clamp(16px,1.8vw,24px)] max-w-[42rem] text-[clamp(14px,1.1vw,16px)] leading-[1.55] opacity-85">{item.description}</p>
          {item.note !== undefined && <p className="mt-3 max-w-[42rem] text-[clamp(13px,1vw,14px)] leading-[1.5] opacity-70">{item.note}</p>}
        </div>
      </div>
      <div className="relative flex min-h-0 flex-col [&>*]:flex-1">
        <ImageSlot item={item} priority={index < 2} />
      </div>
    </div>
  );
}

/** One card in the stack. The top card tilts and lifts away over its segment; the next card rises from the stack behind it. */
function FlipCard({
  item,
  index,
  total,
  progress,
}: {
  item: CaseStudyFlipItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const transitions = Math.max(total - 1, 1);
  const segment = 1 / transitions;
  const isLast = index === total - 1;
  const exitStart = index * segment;
  const exitEnd = Math.min(exitStart + segment, 1);
  const exitRange = isLast ? [0, 1] : [exitStart, exitEnd];
  const entryStart = Math.max(0, exitStart - segment);
  const entryEnd = index === 0 ? 0.0001 : entryStart + segment * 0.7;
  const stackedOffset = index * Math.min(24, 72 / Math.max(total - 1, 1));
  const restingOffset = Math.min(index * 12, 34);
  const restingScale = 1 - Math.min(index * 0.012, 0.035);

  const exitYPercent = useTransform(progress, exitRange, isLast ? [0, 0] : [0, -118]);
  const exitStackOffset = useTransform(progress, exitRange, isLast ? [0, 0] : [0, stackedOffset]);
  const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`;
  const rotateX = useTransform(progress, exitRange, isLast ? [0, 0] : [0, 22]);
  const entryScale = useTransform(progress, [entryStart, entryEnd], index === 0 ? [1, 1] : [restingScale, 1]);
  const entryY = useTransform(progress, [entryStart, entryEnd], index === 0 ? [0, 0] : [restingOffset, 0]);

  return (
    <m.article
      aria-label={item.title}
      className="absolute inset-x-0 top-0 h-full will-change-transform"
      style={{ y: exitY, rotateX, zIndex: total - index, transformOrigin: "50% 50%", transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
    >
      <m.div className="h-full" style={{ y: entryY, scale: entryScale, transformOrigin: "50% 100%" }}>
        <CardFace item={item} index={index} total={total} />
      </m.div>
    </m.article>
  );
}

/**
 * Position dot: widens and brightens while its card is on top. Computed with a function (not an input range), so it never
 * needs offsets outside 0 to 1.
 */
function Dot({ index, total, progress }: { index: number; total: number; progress: MotionValue<number> }) {
  const transitions = Math.max(total - 1, 1);
  const center = index / transitions;
  const half = 0.5 / transitions;
  const closeness = useTransform(progress, (value) => 1 - Math.min(1, Math.abs(value - center) / half));
  const opacity = useTransform(closeness, (value) => 0.3 + 0.7 * value);
  const scaleX = useTransform(closeness, (value) => 1 + 2 * value);
  return <m.span style={{ opacity, scaleX }} className="block h-1.5 w-1.5 rounded-full bg-text" />;
}

export function CaseStudyFlipStack({ items, className }: CaseStudyFlipStackProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion === true) return <StaticStack items={items} className={className} />;
  return <AnimatedStack items={items} className={className} />;
}

/** Reduced motion: a plain vertical list, no pin and no transforms. */
function StaticStack({ items, className }: CaseStudyFlipStackProps) {
  return (
    <ol className={cn("mx-auto flex w-full max-w-[min(80vw,1200px)] flex-col gap-6 max-sm:max-w-full", className)}>
      {items.map((item, index) => (
        <li key={item.title} className="min-h-[26rem] sm:min-h-[28rem]">
          <CardFace item={item} index={index} total={items.length} />
        </li>
      ))}
    </ol>
  );
}

function AnimatedStack({ items, className }: CaseStudyFlipStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const total = items.length;
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const height = `calc(100svh + ${Math.max(total - 1, 1) * SCROLL_PER_CARD_SVH}svh)`;

  return (
    <div ref={stackRef} className={cn("relative", className)} style={{ height }}>
      <div className="sticky top-(--navbar-h) flex h-[calc(100svh-var(--navbar-h))] flex-col justify-center overflow-clip py-6">
        {/* Card box: about 80% of the viewport (width and height), capped at 1200px wide; full width on phones */}
        <div className="relative mx-auto h-[min(80svh,calc(100%-3rem))] w-full [perspective:800px] sm:w-[min(80vw,1200px)]">
          {[...items].reverse().map((item, reverseIndex) => {
            const index = total - reverseIndex - 1;
            return <FlipCard key={item.title} item={item} index={index} total={total} progress={scrollYProgress} />;
          })}
        </div>
        <div aria-hidden="true" className="mt-5 flex items-center justify-center gap-2">
          {items.map((item, index) => (
            <Dot key={item.title} index={index} total={total} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}
