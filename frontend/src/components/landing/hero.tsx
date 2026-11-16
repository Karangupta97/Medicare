import Image from "next/image";
import nurse from "@/assets/image/nurse.webp";
import { ButtonLink } from "./button-link";
import { LandingIcon } from "./landing-icons";
import { ScrollSplitCard, type ScrollSplitCardItem } from "./scroll-split-card/scroll-split-card";

const BADGE =
  "inline-flex min-h-12 items-center gap-3 rounded-2xl border border-on-hero/20 bg-on-hero/10 px-4 py-2 backdrop-blur-md md:min-h-16 md:gap-4 md:px-6";
const VIOLET_TEXT = "bg-linear-to-r from-hero-accent-from to-hero-accent-to bg-clip-text text-transparent";

/** Panel 1: the headline (36px to 72px from md) with the violet gradient on "Reimagined", and both buttons. */
const HEADLINE_CARD = (
  <div className="flex h-full min-w-0 flex-col justify-between gap-3 md:justify-center md:gap-10">
    <h1
      id="hero-title"
      className="break-words text-[clamp(1.375rem,1rem+1.8vw,2rem)] font-bold leading-[1.02] tracking-[-0.03em] text-on-hero md:text-[clamp(36px,5vw,72px)]"
    >
      Healthcare <span className={VIOLET_TEXT}>Reimagined</span> for the Digital Age
    </h1>
    <div className="flex flex-wrap gap-2 md:gap-3">
      <ButtonLink href="/signup" variant="primary-on-dark">
        Join Medicare
      </ButtonLink>
      <ButtonLink href="/dashboard" variant="secondary-on-dark">
        Explore Features
      </ButtonLink>
    </div>
  </div>
);

/** Panel 2: the lead paragraph at 20 to 24px from md. */
const LEAD_CARD = (
  <div className="flex h-full items-center">
    <p className="text-[13px] leading-[1.5] text-on-hero/90 sm:text-[15px] md:text-[clamp(20px,1.7vw,24px)] md:leading-[1.55]">
      Experience healthcare evolved. Our secure platform seamlessly connects patients, doctors, and hospitals, providing
      instant access to medical records and expert care—anytime, anywhere.
    </p>
  </div>
);

/** Panel 3: the two trust badges. */
const TRUST_CARD = (
  <ul className="flex h-full w-full flex-col justify-center gap-3 md:gap-5">
    <li className={BADGE}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-hero-check text-on-hero md:size-9">
        <LandingIcon name="check" className="size-4 md:size-5" />
      </span>
      <span className="text-sm font-medium text-on-hero md:text-xl">Secure &amp; Certified</span>
    </li>
    <li className={BADGE}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-hero-lock text-on-hero md:size-9">
        <LandingIcon name="lock" className="size-4 md:size-5" />
      </span>
      <span className="text-sm font-medium text-on-hero md:text-xl">End-to-End Encrypted</span>
    </li>
  </ul>
);

/**
 * Before the split, over the photo, at the left: the headline, "for the Digital Age", the lead in a glass panel and the
 * two badges, compact like the previous hero. Decorative (the cards carry the real headings); it fades out as the split begins.
 * Phones show only the headline and the subline.
 */
const INTRO = (
  <div className="max-w-xl">
    <p className="text-[clamp(2.25rem,1rem+3.6vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-on-hero">
      Healthcare
      <br />
      <span className={VIOLET_TEXT}>Reimagined</span>
    </p>
    <p className="mt-2 text-xl text-on-hero/80 md:text-2xl">for the Digital Age</p>
    <p className="mt-5 hidden rounded-2xl border border-on-hero/10 bg-on-hero/5 p-5 text-sm leading-relaxed text-on-hero/85 backdrop-blur-md md:block md:text-base">
      Experience healthcare evolved. Our secure platform seamlessly connects patients, doctors, and hospitals, providing
      instant access to medical records and expert care—anytime, anywhere.
    </p>
    <ul className="mt-5 hidden flex-wrap gap-3 md:flex">
      <li className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-on-hero/15 bg-on-hero/10 px-4 text-xs font-medium text-on-hero/90 backdrop-blur-md">
        <span className="flex size-5 items-center justify-center rounded-full bg-hero-check text-on-hero">
          <LandingIcon name="check" className="size-3" />
        </span>
        Secure &amp; Certified
      </li>
      <li className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-on-hero/15 bg-on-hero/10 px-4 text-xs font-medium text-on-hero/90 backdrop-blur-md">
        <span className="flex size-5 items-center justify-center rounded-full bg-hero-lock text-on-hero">
          <LandingIcon name="lock" className="size-3" />
        </span>
        End-to-End Encrypted
      </li>
    </ul>
  </div>
);

const CARDS: readonly ScrollSplitCardItem[] = [
  {
    title: "Healthcare Reimagined for the Digital Age",
    description: "",
    bgColor: "var(--sem-hero-via)",
    textColor: "var(--sem-on-hero)",
    content: HEADLINE_CARD,
  },
  {
    title: "Overview",
    description: "",
    bgColor: "var(--sem-hero-via)",
    textColor: "var(--sem-on-hero)",
    content: LEAD_CARD,
  },
  {
    title: "Trust",
    description: "",
    bgColor: "var(--sem-hero-via)",
    textColor: "var(--sem-on-hero)",
    content: TRUST_CARD,
  },
];

/**
 * Phones and small tablets (below md): a tall rounded card that fills the screen between the navbar and the fixed bottom bar.
 * Navy-to-violet gradient, the headline at the top left, the nurse photo anchored to the bottom, and a "Scroll" cue with a
 * thin line at the very bottom. No split card and no card content. The photo sits in a fixed-ratio-friendly box (contain,
 * bottom-aligned), so nothing shifts; type scales from 320px.
 */
const MOBILE_HERO = (
  <div
    data-brand-surface
    className="relative mx-5 mt-1 h-[calc(100svh-var(--navbar-h)-4.5rem-env(safe-area-inset-bottom)-0.5rem)] min-h-[26rem] overflow-clip rounded-2xl bg-linear-to-b from-hero-via via-hero-to to-hero-to-compact text-on-hero shadow-2xl sm:rounded-[30px]"
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_55%_at_80%_85%,color-mix(in_srgb,var(--sem-hero-glow-b)_45%,transparent),transparent)]" />
    <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-10 size-48 rounded-full bg-hero-glow-a/20 blur-3xl" />
    <div className="relative z-10 p-5 sm:p-8">
      <h1
        id="hero-title"
        className="text-[clamp(2rem,1.1rem+6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em]"
      >
        <span className="bg-linear-to-r from-on-hero via-hero-headline-mid to-hero-headline-end bg-clip-text text-transparent">Healthcare</span>
        <br />
        <span className={VIOLET_TEXT}>Reimagined</span>
      </h1>
      <p className="mt-3 text-[clamp(1rem,0.85rem+1vw,1.5rem)] text-on-hero/85">for the Digital Age</p>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[68%]">
      <Image
        src={nurse}
        alt="Healthcare professional"
        fill
        priority
        sizes="(min-width: 640px) 560px, 100vw"
        className="object-contain object-[60%_100%] drop-shadow-2xl"
      />
    </div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-on-hero">
      Scroll
      <span className="block h-8 w-px bg-on-hero/70 motion-safe:animate-pulse" />
    </div>
  </div>
);

/**
 * Landing hero: the whole hero is the Componentry Scroll Split Card, a rounded card with a 12px inset under the navbar. A sticky stage fills
 * the viewport and is pinned for about 250svh (180svh on phones). The nurse photo on the navy gradient splits into three
 * full-height panels that flip to reveal the headline, the lead and the trust badges. No section padding: the next
 * section starts right after the pinned stage. Static and unpinned under reduced motion. Below md the split card is not used: a plain hero (MOBILE_HERO) is shown instead.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="w-full">
      <ScrollSplitCard imageSrc={nurse} imageAlt="Healthcare professional" cards={CARDS} intro={INTRO} mobile={MOBILE_HERO} className="h-[180svh] md:h-[250svh]" />
    </section>
  );
}
