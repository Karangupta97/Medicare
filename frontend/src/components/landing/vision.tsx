import { Fragment } from "react";
import hospitalRoom from "@/assets/image/hospitalbad.webp";
import Ribbons from "@/components/Ribbons";
import { CurveDivider } from "@/components/curve-divider";
import { DrawCheck, ParallaxImage, PullStatement, Reveal, RevealLines, Stagger, StaggerItem } from "@/components/motion/primitives";
import { CursorReveal } from "./cursor-reveal";
import { VISION_POINTS } from "./landing-data";
import { BODY_CLASS, CONTAINER, Eyebrow, H2_CLASS } from "./section-heading";

const RIBBON_COLORS = ["#a9b3f5", "#6bddd4", "#8f9ae6"];
/**
 * Vision, on an ink surface with a curved top edge. Text on the left (its words lighten as you scroll through it), a
 * sticky 4:5 photo on the right with a bottom clip reveal and an 8% inner parallax (md and up). The photo is grayscale with a navy tint
 * (CursorReveal) that opens a soft circle around the mouse to show the real colors. The checklist reveals one item at a time and each
 * check draws in.
 */
export function Vision() {
  return (
    <section id="vision-section" aria-labelledby="vision-title" className="w-full scroll-mt-20">
      <CurveDivider orientation="top" className="-mb-px text-hero-via" />
      <div data-brand-surface className="surface-texture relative overflow-hidden bg-hero-via py-[clamp(48px,7vw,112px)] text-on-hero">
        {/* Cursor-trailing ribbons in the Medicare palette (periwinkle, teal, indigo). Reads the pointer from the window. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60">
          <Ribbons colors={RIBBON_COLORS} thickness={22} length={1.2} softness={0.6} fade />
        </div>
        <div className={`relative ${CONTAINER} grid items-start gap-y-[clamp(40px,5vw,72px)] lg:grid-cols-[7fr_5fr] lg:gap-x-[clamp(32px,6vw,96px)]`}>
          <div>
            <Eyebrow dark>Our Vision</Eyebrow>
            <h2 id="vision-title" className={`${H2_CLASS} text-on-hero`}>
              <RevealLines
                lines={[
                  <Fragment key="line">
                    Healthcare{" "}
                    <span className="bg-linear-to-r from-hero-accent-from to-hero-accent-to bg-clip-text italic text-transparent">Reimagined</span>
                  </Fragment>,
                  "For The Digital Age",
                ]}
              />
            </h2>
            <PullStatement
              floor={0.55}
              className={`${BODY_CLASS} mt-6 max-w-[62ch] text-on-hero`}
              text="We envision a future where healthcare information is easily accessible, securely managed, and efficiently shared between patients and healthcare providers, leading to better health outcomes for all. Our platform aims to bridge the gap between patients and healthcare providers, creating a unified ecosystem where health information flows seamlessly."
            />
            <Stagger as="ul" className="mt-8 max-w-[62ch]" innerClassName="divide-y divide-on-hero/10 border-y border-on-hero/10">
              {VISION_POINTS.map((point) => (
                <StaggerItem key={point} as="li" className="flex min-h-14 items-center gap-4 py-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-hero-accent-to/50 text-hero-accent-to">
                    <DrawCheck className="size-3.5" />
                  </span>
                  <span className="text-base font-normal leading-normal text-on-hero">{point}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal className="lg:sticky lg:top-[calc(var(--navbar-h)+2rem)]">
            <ParallaxImage
              src={hospitalRoom}
              alt="Modern hospital room with a bed and patient monitor"
              className="cursor-reveal-root aspect-[4/5] rounded-3xl bg-hero-from shadow-inner-light ring-1 ring-on-hero/10"
              sizes="(min-width: 1280px) 440px, (min-width: 1024px) 38vw, calc(100vw - 32px)"
              parallax={8}
              clipReveal
              imageClassName="object-cover object-center"
            >
              <CursorReveal src={hospitalRoom.src} />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-on-hero/15 bg-hero-via/70 p-4 backdrop-blur-md">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-hero-accent-to">Our Vision</span>
                <p className="mt-1 text-xl font-medium text-on-hero">Healthcare of Tomorrow</p>
              </div>
            </ParallaxImage>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
