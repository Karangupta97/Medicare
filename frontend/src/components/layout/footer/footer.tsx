import Image from "next/image";
import Link from "next/link";
import handLogo from "@/assets/logo/medicare-hand-logo.png";
import { LandingIcon } from "@/components/landing/landing-icons";

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

// Old: text-white/70, text-sm (sm: text-base, md: text-sm), py-1, rows 12px apart. Rows are 44px tall here for touch.
const LINK_CLASS =
  "flex min-h-11 items-center text-sm text-on-hero/70 transition-[color,transform] duration-200 ease-out hover:translate-x-1 hover:text-on-hero focus-visible:translate-x-1 sm:text-base md:text-sm";

const SOCIAL_CLASS =
  "flex size-11 items-center justify-center rounded-full bg-on-hero/10 transition-[background-color,transform] duration-300 ease-out hover:scale-110 hover:bg-on-hero/20 active:scale-95";

/** Footer on the navy hero surface (hero-via), so it stays dark in both themes like the old one. */
export function Footer() {
  return (
    <footer data-brand-surface className="w-full bg-hero-via pt-8 text-on-hero sm:pt-10 md:pt-12">
      <div className="mx-auto max-w-[1700px] px-4 pb-bottom-bar sm:px-6 md:px-8 lg:px-10">
        <div className="mb-8 grid grid-cols-1 gap-6 sm:mb-10 sm:grid-cols-2 sm:gap-8 md:mb-12 lg:grid-cols-4 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center sm:mb-6">
              <Image src={handLogo} alt="" width={48} height={48} className="mr-2 size-8 rounded-full object-cover sm:mr-3 sm:size-10 md:size-12" />
              <p className="text-lg font-bold sm:text-xl md:text-2xl">Medicare</p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-on-hero/70 sm:max-w-md sm:text-base md:text-sm lg:max-w-none">
              Empowering individuals to take control of their health through accessible digital healthcare management.
            </p>
            <ul className="mt-4 flex gap-3 sm:mt-6 sm:gap-4">
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

          <nav aria-labelledby="footer-quick-links" className="mt-6 sm:mt-0">
            <h2 id="footer-quick-links" className="mb-4 text-base font-bold sm:mb-6 sm:text-lg md:text-xl">
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

          <nav aria-labelledby="footer-services" className="mt-6 sm:mt-0">
            <h2 id="footer-services" className="mb-4 text-base font-bold sm:mb-6 sm:text-lg md:text-xl">
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

          <div className="mt-6 sm:mt-0">
            <h2 className="mb-4 text-base font-bold sm:mb-6 sm:text-lg md:text-xl">Contact Us</h2>
            <ul>
              <li className="group flex min-h-11 items-center">
                <LandingIcon name="envelope" className="mr-2 size-4 shrink-0 text-on-hero/70 transition-colors duration-200 group-hover:text-on-hero sm:mr-3 sm:size-5" />
                <a
                  href="mailto:support@medicares.in"
                  className="flex min-h-11 items-center break-all text-sm text-on-hero/70 transition-colors duration-200 hover:text-on-hero sm:break-normal sm:text-base md:text-sm"
                >
                  support@medicares.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-4 h-px bg-on-hero/20 sm:my-6 md:my-8" />

        <div className="flex flex-col items-center justify-between gap-3 pb-6 sm:flex-row sm:gap-4 sm:pb-8 md:gap-6">
          <p className="text-center text-xs text-on-hero/70 sm:text-left sm:text-sm">
            &copy; {new Date().getFullYear()} Medicare. All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-4 sm:justify-end sm:gap-x-6">
            {LEGAL_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="flex min-h-11 items-center text-xs text-on-hero/70 transition-[color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:text-on-hero sm:text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
