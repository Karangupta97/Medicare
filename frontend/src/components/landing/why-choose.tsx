import { CtaLink } from "./cta-link";
import { LandingIcon } from "./landing-icons";
import { FEATURES } from "./landing-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/** Feature card, shared by "Why Choose Medicare" and "Our Services": white, rounded-2xl, p-6 md:p-8, shadow-md, lifts 5px on hover. */
export const CARD_CLASS =
  "h-full w-full rounded-2xl border border-surface-muted bg-surface p-6 shadow-md transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[5px] hover:shadow-xl md:p-8";

export function WhyChoose() {
  return (
    // Old: py-8 my-4 below md, py-10 my-4 from md. Fluid: 32px at 375px to 40px at 768px.
    <section aria-labelledby="why-choose-title" className="my-4 w-full py-[clamp(2rem,1.523rem+2.036vw,2.5rem)]">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="why-choose-title" title="Why Choose Medicare" eyebrow="Why Choose Us">
          We&apos;re revolutionizing healthcare management with our secure, accessible, and user-friendly platform
        </SectionHeading>

        {/* auto-fit: 1 column below about 670px, 2 to about 1010px, 3 above (old: 1 / md 2 / lg 3) */}
        <ul className="grid-auto-fit gap-8 [--card-min:19rem]">
          {FEATURES.map((feature, index) => (
            <li key={feature.title}>
              <Reveal className="h-full" delay={index * 100}>
                <div className={CARD_CLASS}>
                  <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-muted">
                    <LandingIcon name={feature.icon} className="size-8 text-brand" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-brand">{feature.title}</h3>
                  <p className="text-sm text-text-muted md:text-base">{feature.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12 text-center md:mt-16" delay={300}>
          <CtaLink href="/about" label="Learn More About Us" arrow="arrow" />
        </Reveal>
      </div>
    </section>
  );
}
