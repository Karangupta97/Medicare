import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaqAccordion } from "@/features/pricing/faq-accordion";
import { ABOUT_FAQ } from "./faqs";
import { ABOUT_HERO } from "./hero";
import { DitheredStage } from "./dithered-stage";
import { STORY } from "./story";
import { TeamCarousel } from "./team-carousel";
import { TEAM } from "./team";
import { VALUES } from "./values";
import { VISION } from "./vision";

const SECTION = "mx-auto mt-[clamp(64px,9svh,112px)] w-full max-w-[1120px] px-4 sm:px-6";

interface HeadingProps {
  id: string;
  start: string;
  accent: string;
  children?: ReactNode;
}

/** Section heading: one h2, accent word in the loaded italic face (weight 400), optional muted subtitle. */
function Heading({ id, start, accent, children }: HeadingProps) {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <h2 id={id} className="text-[clamp(1.75rem,1.1rem+2.4vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.02em] text-text">
        {start}
        <em className="font-normal italic">{accent}</em>
      </h2>
      {children !== undefined && (
        <p className="mt-3 max-w-[52ch] text-[15px] font-normal leading-normal text-text-muted sm:text-base">{children}</p>
      )}
    </div>
  );
}

/** Deep navy hero panel (hero tokens, same in both themes) with CSS rings and the large title bottom-left. */
export function AboutHero() {
  return (
    <section
      aria-labelledby="about-title"
      className="mx-auto mt-1 w-full max-w-[1120px] px-4 pt-[clamp(8px,1.5svh,16px)] sm:px-6"
    >
      <div
        data-brand-surface
        className="relative flex min-h-[clamp(26rem,62svh,36rem)] flex-col justify-end overflow-clip rounded-2xl bg-hero-via p-[clamp(1.25rem,4vw,3rem)] text-on-hero"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-[18rem] rounded-full border border-on-hero/15" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[30rem] rounded-full border border-on-hero/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-56 -top-56 size-[42rem] rounded-full border border-on-hero/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-72 -top-72 size-[54rem] rounded-full border border-on-hero/5" />
        <div className="relative">
          <h1 id="about-title" className="text-[clamp(3rem,1rem+9vw,7rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            {ABOUT_HERO.title}
          </h1>
          <p className="mt-[clamp(12px,2.4svh,24px)] max-w-[52ch] text-[15px] font-normal leading-normal text-on-hero/80 sm:text-base">
            {ABOUT_HERO.lead}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={ABOUT_HERO.primary.href}
              className="inline-flex min-h-11 items-center rounded-full bg-on-hero px-6 text-[15px] font-medium text-hero-from transition-opacity duration-150 ease-out hover:opacity-90 motion-reduce:transition-none"
            >
              {ABOUT_HERO.primary.label}
            </Link>
            <Link
              href={ABOUT_HERO.secondary.href}
              className="inline-flex min-h-11 items-center rounded-full bg-on-hero/10 px-6 text-[15px] font-medium text-on-hero transition-colors duration-150 ease-out hover:bg-on-hero/20 motion-reduce:transition-none"
            >
              {ABOUT_HERO.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Our story" slot: the old Mission text, then the real photos (the old page has two). */
export function StorySection() {
  return (
    <section aria-labelledby="story-title" className={SECTION}>
      <Heading id="story-title" start={STORY.headingStart} accent={STORY.headingAccent}>
        {STORY.subtitle}
      </Heading>
      <p className="mx-auto max-w-[62ch] text-center text-base font-normal leading-relaxed text-text-muted">{STORY.paragraph}</p>
      <ul className="mx-auto mt-6 flex max-w-[62ch] flex-col gap-2 text-center text-[15px] text-text">
        {STORY.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-[2fr_3fr]">
        {STORY.images.map((image, index) => (
          <div key={image.alt} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-muted md:aspect-auto md:h-[clamp(20rem,38vw,30rem)]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={false}
              sizes={index === 0 ? "(min-width: 768px) 40vw, 50vw" : "(min-width: 768px) 60vw, 50vw"}
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/** "What sets us apart" slot: the dithered Medicare mark, then the old Vision text. */
export function VisionSection() {
  return (
    <section aria-labelledby="vision-title" className={SECTION}>
      <Heading id="vision-title" start={VISION.headingStart} accent={VISION.headingAccent} />
      <DitheredStage />
      <p className="mt-4 text-center text-base font-medium text-text">{VISION.stageCaption}</p>
      <p className="mx-auto mt-6 max-w-[62ch] text-center text-base font-normal leading-relaxed text-text-muted">{VISION.paragraph}</p>
    </section>
  );
}

export function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className={SECTION}>
      <Heading id="values-title" start={VALUES.headingStart} accent={VALUES.headingAccent}>
        {VALUES.subtitle}
      </Heading>
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {VALUES.items.map((value, index) => (
          <li key={value.title} className="relative flex min-h-44 flex-col justify-end rounded-xl bg-secondary-subtle p-6 text-on-secondary-subtle">
            <span aria-hidden="true" className="absolute right-5 top-5 text-sm font-normal text-on-secondary-subtle/70">
              /{String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-lg font-medium leading-tight">{value.title}</h3>
            <p className="mt-2 text-[15px] font-normal leading-normal text-on-secondary-subtle/80">{value.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The old Vision card's quote, as a large pull quote (the old page gave it no attribution). */
export function QuoteSection() {
  return (
    <section aria-label="Our goal" className={SECTION}>
      <figure className="mx-auto max-w-[40ch] text-center">
        <blockquote>
          <p className="text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.02em] text-text">
            &ldquo;{VISION.quote}&rdquo;
          </p>
        </blockquote>
      </figure>
    </section>
  );
}

export function TeamSection() {
  return (
    <section aria-labelledby="team-title" className={SECTION}>
      <Heading id="team-title" start={TEAM.headingStart} accent={TEAM.headingAccent}>
        {TEAM.subtitle}
      </Heading>
      <TeamCarousel />
    </section>
  );
}

export function AboutFaq() {
  return (
    <section aria-labelledby="about-faq-title" className="mx-auto mt-[clamp(64px,9svh,112px)] w-full max-w-[720px] px-4 sm:px-6">
      <Heading id="about-faq-title" start={ABOUT_FAQ.headingStart} accent={ABOUT_FAQ.headingAccent}>
        {ABOUT_FAQ.subtitle}
      </Heading>
      <FaqAccordion items={ABOUT_FAQ.items} />
    </section>
  );
}
