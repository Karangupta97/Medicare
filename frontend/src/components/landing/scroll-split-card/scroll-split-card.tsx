"use client";

/*
 * Scroll Split Card, from Componentry (https://componentry.dev/docs/components/scroll-split-card), installed with
 * `npx shadcn@latest add @componentry/scroll-split-card`. The registry file has no license header; the docs list it as
 * MIT and say to verify licenses before production use.
 * API kept: imageSrc, cards (title, description, bgColor, textColor, icon), containerRef, className (outer scroll
 * region; its height is the scroll distance). Added: imageAlt, `intro` (an overlay shown before the split), and an
 * optional `content` node per card for custom back faces.
 * Changes: strict TypeScript; full-bleed sticky stage (no frame, no inset); next/image scene (navy gradient, lilac glow,
 * photo with object-cover) instead of a CSS background, sliced into three full-height panels; a
 * "Scroll" cue; phones stack the panels as three full-width rows (flip on the X axis); reduced motion and short landscape
 * screens get a static revealed layout without a pin; colors are CSS variables from our tokens; the demo captions, the
 * cards-move-up step and the external noise texture were removed. Easing and the 0 / 0.4 / 0.8 scroll stops are unchanged;
 * there are no springs.
 */

import { m, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef, type ReactNode, type RefObject } from "react";
import { EASE_IN_OUT } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

export interface ScrollSplitCardItem {
  title: string;
  description: string;
  /** CSS color value, for example "var(--sem-hero-via)". */
  bgColor: string;
  /** CSS color value, for example "var(--sem-on-hero)". */
  textColor: string;
  icon?: ReactNode;
  /** Replaces the title and description on the back face. */
  content?: ReactNode;
}

export interface ScrollSplitCardProps {
  imageSrc: StaticImageData;
  imageAlt: string;
  /** Exactly three cards; extra items are ignored. */
  cards: readonly ScrollSplitCardItem[];
  /** Overlay at the bottom left of the photo; fades out as the split begins. Decorative. */
  intro?: ReactNode;
  /** Rendered instead of the split card below md (phones and small tablets): a plain hero, no pin, no split. */
  mobile?: ReactNode;
  containerRef?: RefObject<HTMLElement | null>;
  /** Styles the outer scroll region. Set its height here: it is the scroll distance. */
  className?: string;
}

const DEFAULT_SCROLL_HEIGHT = "h-[180svh] md:h-[250svh]";
/** Pinned box: the viewport below the sticky navbar (the card sits 4px under the navbar with 20px side margins, as in the legacy page); on phones also clear of the fixed bottom bar. */
const STAGE_HEIGHT = "h-[calc(100svh-var(--navbar-h)-4.5rem-env(safe-area-inset-bottom))] lg:h-[calc(100svh-var(--navbar-h))]";
/**
 * Card height, copied from the legacy React hero (frontend-react/src/pages/Home.jsx): `h-[800px]` from md, capped by the
 * viewport so the whole card stays in view while pinned. Phones used a compact box there, which cannot hold three stacked
 * cards, so phones get 32rem.
 */
const CARD_HEIGHT = "h-[min(32rem,calc(100%-1.5rem))] md:h-[min(800px,calc(100%-1.5rem))]";
const CARD_SURFACE = "bg-linear-to-br from-hero-via via-hero-to to-hero-from";
const GLOW = "bg-[radial-gradient(70%_60%_at_85%_0%,color-mix(in_srgb,var(--sem-hero-glow-b)_35%,transparent),transparent)]";

export function ScrollSplitCard(props: ScrollSplitCardProps) {
  const reduceMotion = useReducedMotion();
  const isShortScreen = useMediaQuery("(max-height: 30rem)");
  // Phones and small tablets (below md) do not split: they get the plain `mobile` hero when one is given (otherwise the
  // revealed layout, photo then cards), with no pin. The server renders the desktop version, so desktop has no flash.
  const canSplit = useMediaQuery("(min-width: 48rem)", true);
  if (!canSplit && props.mobile !== undefined) return <>{props.mobile}</>;
  if (reduceMotion === true || isShortScreen || !canSplit) return <StaticSplitCard {...props} />;
  return <AnimatedSplitCard {...props} />;
}

/** Navy gradient, lilac glow, then the photo at the right (contained, so it keeps its natural size). Drawn full size in every panel slice. */
function Scene({ imageSrc, imageAlt, labelled }: { imageSrc: StaticImageData; imageAlt: string; labelled: boolean }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-hero-to via-hero-via to-hero-from" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(45%_60%_at_78%_55%,color-mix(in_srgb,var(--sem-hero-glow-b)_30%,transparent),transparent)]"
      />
      <Image
        src={imageSrc}
        alt={labelled ? imageAlt : ""}
        aria-hidden={labelled ? undefined : true}
        fill
        priority
        sizes="100vw"
        className="object-contain object-[50%_100%] md:object-[82%_100%]"
      />
    </>
  );
}

function CardBody({ card }: { card: ScrollSplitCardItem }) {
  if (card.content !== undefined) return <div className="relative z-10 h-full w-full min-w-0">{card.content}</div>;
  return (
    <div className="relative z-10 min-w-0">
      {card.icon !== undefined && <div className="mb-4">{card.icon}</div>}
      <h3 className="mb-2 text-xl font-medium leading-tight md:text-2xl">{card.title}</h3>
      <p className="text-base leading-snug opacity-90">{card.description}</p>
    </div>
  );
}

/** Phones and small tablets, reduced motion and short landscape screens: the revealed state, no pin. Photo on top, then the cards. */
function StaticSplitCard({ imageSrc, imageAlt, cards, intro }: ScrollSplitCardProps) {
  return (
    <div data-brand-surface className="mx-5 mt-1 overflow-clip rounded-2xl bg-hero-from shadow-2xl md:rounded-[30px] lg:rounded-[50px] text-on-hero sm:mx-4">
      <div className="relative aspect-[4/3] w-full md:aspect-[21/9]">
        <Scene imageSrc={imageSrc} imageAlt={imageAlt} labelled />
        {intro !== undefined && (
          <div aria-hidden="true" className="absolute inset-0 flex items-start p-5 md:items-center md:p-12">
            {intro}
          </div>
        )}
      </div>
      <ul className="grid md:grid-cols-3">
        {cards.slice(0, 3).map((card) => (
          <li key={card.title} className={cn("relative min-h-52 overflow-hidden p-6 md:p-10", CARD_SURFACE)} style={{ color: card.textColor }}>
            <div aria-hidden="true" className={cn("absolute inset-0", GLOW)} />
            <CardBody card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnimatedSplitCard({ imageSrc, imageAlt, cards, intro, containerRef: externalContainerRef, className }: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRow = useMediaQuery("(min-width: 48rem)");
  const isLg = useMediaQuery("(min-width: 64rem)");
  // Outer corner radius of the joined card, as in the legacy hero: rounded-2xl (16px) on phones, 30px md, 50px lg.
  const outer = isLg ? 50 : isRow ? 30 : 16;
  // The sticky navbar sits above the region, so progress starts as soon as the region's top reaches the navbar's bottom edge:
  // the hero animates from the first scroll, and the rest of the page only moves after it.
  const navbarPx = isLg ? 73 : 65;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: [`start ${navbarPx}px`, "end end"],
  });

  // 0 to 0.4: separate. 0.4 to 0.8: flip and move closer.
  const spread = isRow ? 28 : 10;
  const spreadEnd = isRow ? 14 : 5;
  const firstOffset = useTransform(scrollYProgress, [0, 0.35, 0.9], [0, -spread, -spreadEnd]);
  const lastOffset = useTransform(scrollYProgress, [0, 0.35, 0.9], [0, spread, spreadEnd]);
  const scale = useTransform(scrollYProgress, [0, 0.35], [1, 0.96]);
  const flip = useTransform(scrollYProgress, [0.35, 0.9], [0, 180]);
  // After a 180deg flip, a positive Z rotation turns counter-clockwise.
  const rotateZFirst = useTransform(scrollYProgress, [0.35, 0.9], [0, isRow ? 2 : 0]);
  const rotateZLast = useTransform(scrollYProgress, [0.35, 0.9], [0, isRow ? -2 : 0]);

  // Joined into one card at first (32px outer corners), then every panel gets 20px corners as it separates.
  const radiusFirst = useTransform(scrollYProgress, [0, 0.2], [isRow ? `${outer}px 0px 0px ${outer}px` : `${outer}px ${outer}px 0px 0px`, "24px 24px 24px 24px"]);
  const radiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "24px 24px 24px 24px"]);
  const radiusLast = useTransform(scrollYProgress, [0, 0.2], [isRow ? `0px ${outer}px ${outer}px 0px` : `0px 0px ${outer}px ${outer}px`, "24px 24px 24px 24px"]);
  const radii = [radiusFirst, radiusMiddle, radiusLast] as const;

  const highlightPercent = useTransform(scrollYProgress, [0, 0.2], [0, 12]);
  const shadowPercent = useTransform(scrollYProgress, [0, 0.2], [0, 45]);
  const boxShadow = useMotionTemplate`inset 0 1px 0 color-mix(in srgb, var(--sem-on-hero) ${highlightPercent}%, transparent), 0 24px 48px -16px color-mix(in srgb, var(--sem-hero-from) ${shadowPercent}%, transparent)`;

  const introOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.12], [0, -16]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className ?? DEFAULT_SCROLL_HEIGHT)}>
      {/* No background on the pinned box or the stage: when the panels separate, the page shows through the gaps. */}
      <div
        data-brand-surface
        className={cn("sticky top-(--navbar-h) flex w-full items-start px-5 pt-1 text-on-hero [perspective:1400px]", STAGE_HEIGHT)}
      >
        {/* mt-6 moves the card 24px lower so it clears the sticky navbar; on tall screens the 800px height is unchanged */}
        <div className={cn("relative mt-6 w-full", CARD_HEIGHT)}>
        <m.div style={{ scale, transformStyle: "preserve-3d" }} className="flex h-full w-full flex-col md:flex-row">
          {cards.slice(0, 3).map((card, i) => {
            const offset = i === 0 ? firstOffset : i === 2 ? lastOffset : undefined;
            const radius = radii[i] ?? radiusMiddle;
            return (
              <m.div
                key={card.title}
                className="relative min-h-0 min-w-0 flex-1"
                style={{
                  ...(isRow ? { x: offset } : { y: offset }),
                  ...(isRow ? { rotateY: flip } : { rotateX: flip }),
                  rotateZ: i === 0 ? rotateZFirst : i === 2 ? rotateZLast : 0,
                  zIndex: i,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front: this panel's full-height slice of the scene */}
                <m.div
                  className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                  style={{ zIndex: 2, borderRadius: radius, boxShadow }}
                >
                  <div
                    className={cn("absolute", isRow ? "h-full w-[300%]" : "h-[300%] w-full")}
                    style={isRow ? { left: `${-100 * i}%`, top: 0 } : { top: `${-100 * i}%`, left: 0 }}
                  >
                    <Scene imageSrc={imageSrc} imageAlt={imageAlt} labelled={i === 1} />
                  </div>
                </m.div>
                {/* Back: card content, filling the whole panel */}
                <m.div
                  className={cn(
                    "absolute inset-0 flex flex-col justify-center overflow-hidden border border-on-hero/10 p-5 [backface-visibility:hidden] will-change-transform md:p-8 lg:p-12",
                    CARD_SURFACE,
                  )}
                  style={{
                    backgroundColor: card.bgColor,
                    color: card.textColor,
                    transform: isRow ? "rotateY(180deg)" : "rotateX(180deg)",
                    zIndex: 1,
                    borderRadius: radius,
                    boxShadow,
                  }}
                >
                  <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", GLOW)} />
                  <CardBody card={card} />
                </m.div>
              </m.div>
            );
          })}
        </m.div>

        {/* Before the split: a headline and supporting line at the bottom left of the photo. Fades out as the split begins. */}
        {intro !== undefined && (
          <m.div
            aria-hidden="true"
            style={{ opacity: introOpacity, y: introY }}
            className="pointer-events-none absolute inset-0 z-30 flex items-start p-6 pb-12 md:items-center md:p-12 lg:px-16"
          >
            {intro}
          </m.div>
        )}

        {/* "Scroll" cue: fades once scrolling starts */}
        <m.div
          aria-hidden="true"
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-on-hero/80"
        >
          Scroll
          <span className="relative block h-8 w-px overflow-hidden bg-on-hero/20">
            <m.span
              className="absolute inset-x-0 top-0 block h-3 bg-hero-accent-to"
              animate={{ y: ["-100%", "280%"] }}
              transition={{ duration: 2.6, ease: EASE_IN_OUT, repeat: Infinity }}
            />
          </span>
        </m.div>

        </div>
      </div>
    </div>
  );
}
