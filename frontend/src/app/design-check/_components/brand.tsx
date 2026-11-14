// The Medicare logo for the sidebar. The sidebar background is `surface`, which is light in the
// light theme and dark in the dark theme, so the matching logo file is shown for each (DESIGN.md section 12).
import Image, { type StaticImageData } from "next/image";
import logoOnDarkImport from "@/assets/logo/medicare-logo-full-on-dark.svg";
import logoOnLightImport from "@/assets/logo/medicare-logo-full-on-light.svg";

// Next types SVG imports as `any`; this gives them the type they really have.
const logoOnLight: StaticImageData = logoOnLightImport;
const logoOnDark: StaticImageData = logoOnDarkImport;

export function Brand() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 lg:flex-col lg:items-start lg:gap-2">
      {/* The dark logo file has its own background, so both are shown as a rounded tile. */}
      <span className="block overflow-hidden rounded-lg">
        <Image src={logoOnLight} alt="Medicare" priority className="block h-9 w-auto lg:h-11 [.dark_&]:hidden" />
        <Image src={logoOnDark} alt="Medicare" priority className="hidden h-9 w-auto lg:h-11 [.dark_&]:block" />
      </span>
      <div className="flex items-center gap-2">
        <p className="whitespace-nowrap text-sm font-bold text-text">Design system</p>
        <span className="inline-flex items-center rounded-full bg-accent-subtle px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-on-accent-subtle">
          Internal
        </span>
      </div>
    </div>
  );
}
