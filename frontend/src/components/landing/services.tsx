import { CtaLink } from "./cta-link";
import { CaseStudyFlipStack, type CaseStudyFlipItem } from "./case-study-flip-stack/case-study-flip-stack";
import { SERVICES } from "./landing-data";
import { LandingIcon } from "./landing-icons";
import { CONTAINER, SECTION_PAD, SectionHeading } from "./section-heading";

/**
 * One deep, distinct hue per card, all from tokens: navy, indigo, teal and violet, each mixed with the navy hero token so they
 * share one dark, rich value and white text stays readable in both themes.
 */
const BACKGROUNDS = [
  "var(--sem-hero-from)",
  "color-mix(in srgb, var(--sem-secondary) 58%, var(--sem-hero-from))",
  "color-mix(in srgb, var(--sem-accent) 52%, var(--sem-hero-from))",
  "color-mix(in srgb, var(--sem-violet) 52%, var(--sem-hero-from))",
] as const;

/**
 * Our Services as a Componentry Case Study Flip Stack: the four services in a sticky stack; as you scroll, the top card
 * tilts and lifts away and the next one rises. Each card has an empty image slot on the right (set `image` on the service in
 * landing-data.ts to fill it). "Coming Soon" is a badge by the number, and the old overlay message sits under the description.
 */
export function Services() {
  const items: CaseStudyFlipItem[] = SERVICES.map((service, index) => ({
    title: service.title,
    description: service.desc,
    badge: service.comingSoon === true ? "Coming Soon" : undefined,
    note: service.comingSoon === true ? "We're working on bringing you seamless appointment scheduling. Stay tuned!" : undefined,
    icon: <LandingIcon name={service.icon} />,
    image: service.image,
    imageAlt: service.imageAlt,
    background: BACKGROUNDS[index % BACKGROUNDS.length] ?? BACKGROUNDS[0],
    foreground: "var(--sem-on-hero)",
  }));

  return (
    <section aria-labelledby="services-title" className={`w-full bg-tint ${SECTION_PAD}`}>
      <div className={CONTAINER}>
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Our Services"
          action={<CtaLink href="/services" label="Explore All Services" />}
        >
          Comprehensive healthcare solutions designed to simplify your medical journey
        </SectionHeading>
        <CaseStudyFlipStack items={items} />
      </div>
    </section>
  );
}
