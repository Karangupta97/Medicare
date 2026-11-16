import { Reveal, RevealLines } from "@/components/motion/primitives";
import { FINAL_CTA } from "@/features/pricing/plans";
import { ButtonLink } from "./button-link";
import { CONTAINER, Eyebrow, H2_CLASS } from "./section-heading";

/**
 * Closing call to action: a full-width ink band with a soft violet glow. The heading and supporting line are the
 * existing "Ready to take control of your health records?" copy; the buttons are the hero's.
 */
export function ClosingCta() {
  return (
    <section aria-labelledby="closing-cta-title" data-brand-surface className="surface-texture relative w-full overflow-clip bg-hero-via py-[clamp(80px,10vw,140px)] text-on-hero">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--sem-hero-glow-b)_24%,transparent),transparent)]"
      />
      <div className={`${CONTAINER} relative`}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow dark>Get Started</Eyebrow>
          <h2 id="closing-cta-title" className={`${H2_CLASS} text-on-hero`}>
            <RevealLines lines={[`${FINAL_CTA.headingStart}${FINAL_CTA.headingAccent}${FINAL_CTA.headingEnd}`]} />
          </h2>
          <Reveal className="mt-4 max-w-[52ch]">
            <p className="text-base leading-[1.65] text-on-hero/70 sm:text-lg">{FINAL_CTA.body}</p>
          </Reveal>
          <Reveal index={1} className="mt-8" innerClassName="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/signup" variant="primary-on-dark" arrow>
              Join Medicare
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary-on-dark">
              Explore Features
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
