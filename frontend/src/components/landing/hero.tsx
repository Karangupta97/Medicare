import type { CSSProperties } from "react";
import Image from "next/image";
import nurse from "@/assets/image/nurse.webp";
import handLogo from "@/assets/logo/medicare-hand-logo.png";
import { LandingIcon } from "./landing-icons";

// Staggered entrance, as in the old page (framer-motion delays 0.3 / 0.5 / 0.7 / 0.9 / 0.8 s).
const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

const HEADLINE_TOP = "bg-linear-to-r from-on-hero via-hero-headline-mid to-hero-headline-end bg-clip-text text-transparent";
const HEADLINE_BOTTOM = "bg-linear-to-r from-hero-accent-from to-hero-accent-to bg-clip-text text-transparent";

/**
 * Landing hero: one card whose layout follows the old page's two heroes.
 * - Below md: the compact card. Text on the left, a square box on the right with the doctor image
 *   contained and pushed down (its lower part is cropped by the card), short copy, one chip.
 * - md: the large card with full copy and both chips, no image (the old page hid it until lg).
 * - lg and up: two columns, the doctor image anchored to the bottom of the right column.
 * Colors come from the hero-* tokens, so the card stays dark in both themes.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" data-brand-surface className="w-full px-5 pt-1">
      <div className="animate-hero-shrink origin-top">
        <div className="animate-scale-in relative overflow-hidden rounded-2xl bg-linear-to-r from-hero-via to-hero-to-compact p-3 sm:p-4 md:min-h-[clamp(40rem,100svh,50rem)] md:rounded-[30px] md:from-hero-from md:via-hero-via md:to-hero-to md:p-0 md:shadow-2xl lg:rounded-[50px]">
          {/* Compact glow (below md) */}
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 size-20 animate-pulse rounded-full bg-hero-glow-a/20 opacity-30 blur-xl motion-reduce:animate-none md:hidden" />
          {/* Large-card glows (old: blue-300, purple-400 and indigo-400 at 30%, opacity 30, overlay blend) */}
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 hidden size-96 rounded-full bg-hero-glow-a/30 opacity-30 mix-blend-overlay blur-3xl md:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-3.5 left-20 hidden size-72 rounded-full bg-hero-glow-b/30 opacity-30 mix-blend-overlay blur-3xl md:block" />
          <div aria-hidden="true" className="pointer-events-none absolute left-0 top-24 hidden size-80 rounded-full bg-hero-glow-a/30 opacity-30 mix-blend-overlay blur-3xl md:block" />

          <div className="relative grid grid-cols-[minmax(0,1fr)_clamp(6.5rem,2rem+30vw,10rem)] items-center gap-2 md:min-h-[40.625rem] md:grid-cols-1 md:items-stretch md:gap-0 lg:min-h-[50.875rem] lg:grid-cols-2">
            <div className="relative z-10 min-w-0 md:flex md:flex-col md:justify-center md:px-8 md:py-20 lg:px-16">
              <div className="md:animate-slide-in-left">
                <div className="mb-2 flex items-center md:mb-8">
                  <div className="rounded-lg bg-on-hero/10 p-1.5 shadow-lg backdrop-blur-md md:rounded-2xl md:border md:border-on-hero/10 md:bg-on-hero/15 md:p-3 md:backdrop-blur-xl md:transition-colors md:duration-300 md:ease-out md:hover:border-on-hero/20">
                    <Image src={handLogo} alt="" width={48} height={48} className="size-6 object-contain md:size-12" />
                  </div>
                  <p className="pl-2 text-base font-bold text-on-hero md:pl-5 md:text-2xl md:font-medium md:tracking-wide md:text-on-hero/90">
                    Medicare
                  </p>
                </div>

                <div className="md:animate-rise md:mb-8" style={delay(300)}>
                  <h1 id="hero-title" className="mb-1 font-bold leading-[1.3] md:mb-4 md:text-fluid-hero md:leading-tight">
                    {/* The old headline scrolled to the vision section on click; here it is a real link */}
                    <a
                      href="#vision-section"
                      className="block w-fit rounded-md transition-opacity duration-200 ease-out hover:opacity-80 md:rounded-lg md:hover:opacity-100"
                    >
                      <span className={`text-base leading-[inherit] md:text-[1em] ${HEADLINE_TOP}`}>Healthcare</span>
                      <br />
                      <span className={`text-xl leading-[inherit] md:text-[1em] ${HEADLINE_BOTTOM}`}>Reimagined</span>
                    </a>
                  </h1>
                  <p className="hidden text-3xl font-normal text-on-hero/80 md:block">for the Digital Age</p>
                </div>

                {/* Old compact copy: 12px, 180px wide, clamped to two lines */}
                <p className="mb-2 line-clamp-2 max-w-[180px] text-xs text-on-hero/90 md:hidden">
                  A secure platform that connects patients, doctors, and hospitals.
                </p>
                <p
                  className="mb-10 hidden max-w-xl rounded-2xl border border-on-hero/10 bg-on-hero/10 p-6 text-lg leading-relaxed text-on-hero/85 shadow-lg backdrop-blur-xl md:block md:animate-rise"
                  style={delay(500)}
                >
                  Experience healthcare evolved. Our secure platform seamlessly connects patients, doctors, and hospitals,
                  providing instant access to medical records and expert care—anytime, anywhere.
                </p>

                <ul className="flex flex-wrap gap-1.5 md:gap-4">
                  <li
                    className="inline-flex items-center gap-1.5 rounded-full border border-on-hero/20 bg-on-hero/10 px-2 py-1 backdrop-blur-md md:min-h-11 md:animate-rise md:gap-3 md:rounded-2xl md:bg-on-hero/15 md:px-5 md:py-3 md:backdrop-blur-xl md:transition-colors md:duration-300 md:ease-out md:hover:bg-on-hero/20"
                    style={delay(700)}
                  >
                    <span className="flex size-3 shrink-0 items-center justify-center rounded-full bg-hero-check text-on-hero md:size-6">
                      <LandingIcon name="check" className="size-2 md:size-3.5" />
                    </span>
                    <span className="text-[10px] font-medium text-on-hero/90 md:text-sm">Secure &amp; Certified</span>
                  </li>
                  <li
                    className="hidden min-h-11 items-center gap-3 rounded-2xl border border-on-hero/20 bg-on-hero/15 px-5 py-3 backdrop-blur-xl transition-colors duration-300 ease-out hover:bg-on-hero/20 md:inline-flex md:animate-rise"
                    style={delay(900)}
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-hero-lock text-on-hero">
                      <LandingIcon name="lock" className="size-3.5" />
                    </span>
                    <span className="text-sm font-medium text-on-hero/90">End-to-End Encrypted</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Doctor image: compact square box below md, hidden at md, bottom-anchored column from lg */}
            <div className="relative aspect-square md:hidden lg:block lg:aspect-auto">
              <div aria-hidden="true" className="absolute inset-0 animate-pulse rounded-full bg-hero-glow-a/20 opacity-30 blur-xl motion-reduce:animate-none lg:animate-none lg:bg-transparent lg:bg-linear-to-br lg:from-hero-lock/20 lg:to-hero-glow-b/20 lg:opacity-100 lg:blur-3xl" />
              <div
                className="absolute inset-0 top-6 -bottom-6 lg:inset-auto lg:-bottom-3.5 lg:left-1/2 lg:aspect-429/628 lg:h-[86.75%] lg:-translate-x-1/2 lg:animate-rise"
                style={delay(800)}
              >
                <div aria-hidden="true" className="absolute -left-12 -top-12 hidden size-24 animate-pulse rounded-full bg-hero-glow-a/40 blur-xl motion-reduce:animate-none lg:block" />
                <div aria-hidden="true" className="absolute -bottom-8 -right-8 hidden size-20 animate-pulse rounded-full bg-hero-glow-b/40 blur-xl [animation-delay:1s] motion-reduce:animate-none lg:block" />
                <Image
                  src={nurse}
                  alt="Healthcare professional"
                  fill
                  priority
                  sizes="(min-width: 1024px) 30rem, (min-width: 768px) 1px, 10rem"
                  className="relative z-10 object-contain brightness-105 drop-shadow-lg lg:object-bottom lg:drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
