import { Lilita_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import handLogo from "@/assets/logo/medicare-hand-logo.png";
import { LandingIcon } from "@/components/landing/landing-icons";
import { CursorDrivenParticleTypography } from "@/components/landing/particle-typography/cursor-driven-particle-typography";

// Lilita One (Google Fonts, SIL Open Font License), self-hosted by next/font at build time. Used for the particle wordmark only.
const lilita = Lilita_One({ weight: "400", subsets: ["latin"], display: "swap" });
interface FooterLink {
  name: string;
  path: string;
}

const QUICK_LINKS: readonly FooterLink[] = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Profile", path: "/profile" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Services", path: "/services" },
  { name: "Find Hospital", path: "/find-hospital" },
  { name: "Contact", path: "/contact" },
];

const SERVICE_LINKS: readonly FooterLink[] = [
  { name: "Report Management", path: "/reports" },
  { name: "Health Tips", path: "/services/health-tips" },
];

const LEGAL_LINKS: readonly FooterLink[] = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Service", path: "/terms-of-service" },
  { name: "Cookie Policy", path: "/cookie-policy" },
];

// One scale: links and labels are 14px (rows 44px tall for touch); column headings use the eyebrow style; spacing follows
// clamp(40px, 5vw, 64px) between blocks.
const LINK_CLASS =
  "link-draw flex min-h-11 w-fit items-center text-sm text-on-hero/70 transition-colors duration-200 ease-out hover:text-on-hero focus-visible:text-on-hero";
const SOCIAL_CLASS =
  "flex size-11 items-center justify-center rounded-full bg-on-hero/10 transition-[background-color,transform] duration-200 ease-out hover:bg-on-hero/20 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 motion-reduce:hover:translate-y-0";
const HEADING_CLASS = "mb-4 text-xs font-medium uppercase tracking-[0.14em] text-hero-accent-to";

/** Footer on the navy hero surface (hero-via), dark in both themes. Hairline on top, one 4-column grid. */
export function Footer() {
  return (
    <footer data-brand-surface className="surface-texture relative w-full overflow-clip border-t border-on-hero/20 bg-hero-via pt-[clamp(64px,8vw,112px)] text-on-hero">
      <div className="relative mx-auto max-w-7xl px-4 pb-bottom-bar sm:px-6">
        <div className="grid grid-cols-1 gap-x-[clamp(32px,5vw,64px)] gap-y-[clamp(32px,5vw,48px)] sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image src={handLogo} alt="" width={48} height={48} className="size-10 rounded-full object-cover" />
              <p className="text-xl font-medium">Medicare</p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-on-hero/70">
              Empowering individuals to take control of their health through accessible digital healthcare management.
            </p>
            <ul className="mt-4 flex gap-3">
              <li>
                <a href="https://twitter.com/Medicares_india" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={SOCIAL_CLASS}>
                  <LandingIcon name="twitter" className="size-4" />
                </a>
              </li>
              <li>
                <a href="https://instagram.com/medicaresindia" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={SOCIAL_CLASS}>
                  <LandingIcon name="instagram-solid" className="size-4" />
                </a>
              </li>
            </ul>
          </div>
          <nav aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links" className={HEADING_CLASS}>
              Quick Links
            </h2>
            <ul>
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className={LINK_CLASS}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-services">
            <h2 id="footer-services" className={HEADING_CLASS}>
              Our Services
            </h2>
            <ul>
              {SERVICE_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className={LINK_CLASS}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={HEADING_CLASS}>Contact Us</h2>
            <ul>
              <li className="flex min-h-11 items-center gap-3">
                <LandingIcon name="envelope" className="size-4 shrink-0 text-on-hero/70" />
                <a href="mailto:support@medicares.in" className={`${LINK_CLASS} break-all sm:break-normal`}>
                  support@medicares.in
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-4 mt-[clamp(40px,5vw,64px)] h-px bg-on-hero/20" />
        <div className="flex flex-col items-center justify-between gap-3 pb-6 sm:flex-row sm:gap-4 sm:pb-8">
          <p className="text-center text-xs text-on-hero/70 sm:text-left sm:text-sm">
            &copy; {new Date().getFullYear()} Medicare. All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 sm:justify-end">
            {LEGAL_LINKS.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className={LINK_CLASS}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Big "Medicare" in particles. It blends (overlay) over the footer text, ignores the pointer and follows the cursor. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[clamp(200px,30vw,420px)] mix-blend-overlay">
        <CursorDrivenParticleTypography
          text="Medicare"
          className="text-on-hero"
          fontFamily={lilita.style.fontFamily}
          fontWeight="normal"
          fontSize={360}
          maxFontRatio={0.22}
          heartForI
          particleSize={1.4}
          particleDensity={5}
          dispersionStrength={14}
        />
      </div>
    </footer>
  );
}
