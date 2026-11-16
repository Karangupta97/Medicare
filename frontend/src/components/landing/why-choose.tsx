import { SpotlightCard } from "@/components/motion/interactions";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { CtaLink } from "./cta-link";
import { FEATURES } from "./landing-data";
import { LandingIcon } from "./landing-icons";
import { CONTAINER, SECTION_PAD, SectionHeading } from "./section-heading";

/** Porcelain card: white, hairline border, layered soft shadow. Hover behavior comes from SpotlightCard. */
export const CARD_CLASS = "h-full w-full rounded-2xl border border-border bg-surface p-6 shadow-soft md:p-8";

/**
 * Bento grid on porcelain. lg: three columns, the first card is wide (2 columns x 2 rows) and the other five fill the
 * rest, so every row is full: [wide, card 2], [wide, card 3], [card 4, 5, 6]. Below lg the cards are equal. Cards have a
 * cursor spotlight, a violet hairline that draws across the top on hover, a 4px lift, and an icon ring that grows 1.06.
 */
export function WhyChoose() {
  return (
    <section aria-labelledby="why-choose-title" className={`w-full bg-page ${SECTION_PAD}`}>
      <div className={CONTAINER}>
        <SectionHeading
          id="why-choose-title"
          eyebrow="Why Choose Us"
          title="Why Choose Medicare"
          action={<CtaLink href="/about" label="Learn More About Us" />}
        >
          We&apos;re revolutionizing healthcare management with our secure, accessible, and user-friendly platform
        </SectionHeading>
        <Stagger as="ul" innerClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const wide = index === 0;
            return (
              <StaggerItem key={feature.title} as="li" className={wide ? "lg:col-span-2 lg:row-span-2" : undefined}>
                <SpotlightCard className={`${CARD_CLASS} ${wide ? "lg:p-10" : ""}`}>
                  <div className={wide ? "lg:flex lg:h-full lg:min-h-80 lg:flex-col lg:justify-end" : ""}>
                    <div
                      className={`mb-6 flex items-center justify-center rounded-full bg-surface-muted ring-1 ring-border transition-transform duration-[250ms] ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06] motion-reduce:transition-none ${
                        wide ? "size-16 lg:mb-auto lg:size-20" : "size-16"
                      }`}
                    >
                      <LandingIcon name={feature.icon} className={`text-brand ${wide ? "size-8 lg:size-10" : "size-8"}`} />
                    </div>
                    <h3 className={`mb-3 font-bold tracking-[-0.01em] text-text ${wide ? "text-xl lg:mt-12 lg:text-3xl" : "text-xl"}`}>{feature.title}</h3>
                    <p className={`text-sm font-normal leading-[1.65] text-text-muted md:text-base ${wide ? "lg:max-w-[44ch] lg:text-lg" : ""}`}>
                      {feature.description}
                    </p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
