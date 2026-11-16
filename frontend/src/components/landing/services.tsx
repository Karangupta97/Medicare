import { CtaLink } from "./cta-link";
import { LandingIcon } from "./landing-icons";
import { SERVICES } from "./landing-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { CARD_CLASS } from "./why-choose";

export function Services() {
  return (
    <section
      aria-labelledby="services-title"
      // Old: py-14 below md, py-10 from md, my-4. Fluid: 56px at 375px to 40px at 768px.
      className="w-full bg-linear-to-b from-tint to-surface py-[clamp(2.5rem,4.454rem-4.071vw,3.5rem)]"
    >
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="services-title" title="Our Services">
          Comprehensive healthcare solutions designed to simplify your medical journey
        </SectionHeading>

        {/* Four cards: 1, 2 or 4 columns from the width of this box (never 3 + 1). Old: 1 / md 2 / lg 4. */}
        <div className="@container">
          <ul className="grid grid-cols-1 gap-8 @xl:grid-cols-2 @4xl:grid-cols-4">
            {SERVICES.map((service, index) => (
              <li key={service.title}>
                <Reveal className="h-full" delay={index * 100}>
                  <div
                    // Focus (keyboard, or tap on touch screens) shows the Coming Soon overlay, the same as hover
                    tabIndex={service.comingSoon === true ? 0 : undefined}
                    aria-label={service.comingSoon === true ? `${service.title}, coming soon` : undefined}
                    className={`group relative overflow-hidden ${CARD_CLASS}`}
                  >
                    {service.comingSoon === true && (
                      <>
                        <div
                          data-brand-surface
                          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-linear-to-br from-hero-via/95 via-hero-via/90 to-hero-via/95 opacity-0 backdrop-blur-[2px] transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus:opacity-100"
                        >
                          <div className="scale-95 space-y-4 transition-transform duration-500 ease-out group-hover:scale-100 group-focus:scale-100">
                            <div className="relative">
                              <div aria-hidden="true" className="absolute -inset-1 rounded-lg bg-linear-to-r from-hero-lock to-violet opacity-25 blur" />
                              <div className="relative rounded-lg border border-on-hero/20 bg-on-hero/10 px-6 py-3 backdrop-blur-md">
                                <span className="text-lg font-medium tracking-wide text-on-hero">Coming Soon</span>
                              </div>
                            </div>
                            <p className="mt-3 max-w-[200px] px-4 text-center text-sm text-on-hero/90">
                              We&apos;re working on bringing you seamless appointment scheduling. Stay tuned!
                            </p>
                          </div>
                        </div>
                        <div className="absolute right-4 top-4 z-10">
                          <span className="inline-flex items-center gap-1 rounded-full border border-secondary-subtle bg-linear-to-r from-secondary-subtle to-violet-subtle px-2.5 py-0.5 text-xs font-medium text-brand">
                            <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-hero-glow-a motion-reduce:animate-none" />
                            Coming Soon
                          </span>
                        </div>
                      </>
                    )}
                    <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-muted">
                      <LandingIcon name={service.icon} className="size-8 text-brand" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-brand">{service.title}</h3>
                    <p className="text-sm font-normal text-text-muted md:text-base">{service.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="mt-12 text-center" delay={300}>
          <CtaLink href="/services" label="Explore All Services" />
        </Reveal>
      </div>
    </section>
  );
}
