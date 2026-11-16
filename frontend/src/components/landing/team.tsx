import Image from "next/image";
import founder from "@/assets/image/founder-image/Self.webp";
import { CtaLink } from "./cta-link";
import { LandingIcon } from "./landing-icons";
import { FOUNDER_SOCIALS } from "./landing-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

// Old link colors: LinkedIn blue-600, GitHub gray-700, Mail red-600, Instagram pink-600 (mapped to tokens).
const SOCIAL_COLOR: Record<string, string> = {
  LinkedIn: "text-secondary",
  GitHub: "text-text",
  Email: "text-danger",
  Instagram: "text-danger",
};

export function Team() {
  return (
    <section
      aria-labelledby="team-title"
      // Old: py-14 my-4 below md, py-16 my-8 from md. Fluid: 56/16px at 375px to 64/32px at 768px.
      className="w-full bg-linear-to-b from-surface to-tint py-[clamp(3.5rem,3.023rem+2.036vw,4rem)]"
    >
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="team-title" title="Meet Our Team">
          The passionate minds behind Medicare&apos;s mission to revolutionize healthcare management
        </SectionHeading>

        <Reveal className="mx-auto max-w-4xl">
          <article className="overflow-hidden rounded-3xl border border-surface-muted bg-surface shadow-2xl">
            <div className="lg:flex">
              <div className="relative lg:w-2/5">
                {/* Old: square below lg; from lg the photo's own ratio sets the card height */}
                <div className="relative aspect-square overflow-hidden lg:aspect-1024/1337 lg:h-full">
                  <Image
                    src={founder}
                    alt="Karan Gupta - Founder & CEO"
                    fill
                    sizes="(min-width: 1024px) 358px, (min-width: 928px) 896px, calc(100vw - 32px)"
                    className="object-cover object-center"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-brand/20 to-transparent" />
                </div>
              </div>

              <div className="p-8 lg:w-3/5 lg:p-12">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-brand lg:text-3xl">Karan Gupta</h3>
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
                          className={`flex size-11 items-center justify-center rounded-full border-2 border-border transition-[transform,border-color] duration-200 ease-out hover:scale-110 hover:border-current active:scale-95 ${SOCIAL_COLOR[social.label] ?? "text-text"}`}
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
        </Reveal>

        <Reveal className="mt-12 text-center" delay={300}>
          <CtaLink href="/team" label="View Full Team" />
        </Reveal>
      </div>
    </section>
  );
}
