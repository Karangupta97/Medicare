import founder from "@/assets/image/founder-image/Self.webp";
import { TiltCard } from "@/components/motion/interactions";
import { ParallaxImage, Reveal } from "@/components/motion/primitives";
import { CtaLink } from "./cta-link";
import { FOUNDER_SOCIALS } from "./landing-data";
import { LandingIcon } from "./landing-icons";
import { CONTAINER, SECTION_PAD, SectionHeading } from "./section-heading";

// Old link colors: LinkedIn blue-600, GitHub gray-700, Mail red-600, Instagram pink-600 (mapped to tokens).
const SOCIAL_COLOR: Record<string, string> = {
  LinkedIn: "text-secondary",
  GitHub: "text-text",
  Email: "text-danger",
  Instagram: "text-danger",
};

export function Team() {
  return (
    <section aria-labelledby="team-title" className={`w-full bg-page ${SECTION_PAD}`}>
      <div className={CONTAINER}>
        <SectionHeading
          id="team-title"
          eyebrow="Our Team"
          title="Meet Our Team"
          action={<CtaLink href="/team" label="View Full Team" />}
        >
          The passionate minds behind Medicare&apos;s mission to revolutionize healthcare management
        </SectionHeading>
        <Reveal className="mx-auto max-w-4xl">
          <TiltCard>
          <article className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lift">
            <div className="lg:flex">
              <div className="lg:w-2/5">
                {/* Photo: clip reveal from the bottom (0.9s ease-in-out) and 6% parallax inside its frame */}
                <ParallaxImage
                  src={founder}
                  alt="Karan Gupta - Founder & CEO"
                  className="aspect-square bg-surface-muted lg:aspect-1024/1337 lg:h-full"
                  sizes="(min-width: 1024px) 358px, (min-width: 928px) 896px, calc(100vw - 32px)"
                  parallax={6}
                  clipReveal
                  imageClassName="object-cover object-center"
                />
              </div>
              <div className="p-8 lg:w-3/5 lg:p-12">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-medium text-text lg:text-3xl">Karan Gupta</h3>
                  <p className="mb-1 text-lg font-medium text-text-muted">Founder &amp; CEO of Medicare</p>
                  <p className="mb-3 text-text-muted">Full Stack Developer</p>
                  <p className="mb-4 flex items-center text-sm text-text-muted">
                    <LandingIcon name="map-pin" className="mr-1 size-4" />
                    <span>India</span>
                  </p>
                </div>
                <div className="mb-6">
                  <p className="mb-4 leading-relaxed text-text">
                    Passionate about healthcare technology and committed to creating innovative solutions that improve
                    patient care and medical record management. Specialized in building secure, scalable, and
                    user-friendly healthcare applications.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-sm font-medium text-text">Connect:</span>
                  <ul className="flex flex-wrap gap-3">
                    {FOUNDER_SOCIALS.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className={`flex size-11 items-center justify-center rounded-full border border-border transition-[border-color,transform,box-shadow] duration-[250ms] ease-out hover:-translate-y-0.5 hover:border-brand hover:ring-2 hover:ring-brand focus-visible:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${SOCIAL_COLOR[social.label] ?? "text-text"}`}
                        >
                          <LandingIcon name={social.icon} className="size-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
