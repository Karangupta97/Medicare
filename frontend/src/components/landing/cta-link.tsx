import Link from "next/link";
import { LandingIcon } from "./landing-icons";

interface CtaLinkProps {
  href: string;
  label: string;
  /** "arrow" is the old inline Heroicons arrow; "feather" is FiArrowRight. */
  arrow?: "arrow" | "feather";
}

/** The old page's primary call to action: navy button, rounded-lg, px-6 py-3, shadow-md, scale 1.05 on hover and 0.95 on press. */
export function CtaLink({ href, label, arrow = "feather" }: CtaLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 py-3 font-medium text-on-brand shadow-md transition-[transform,background-color] duration-300 ease-out hover:scale-105 hover:bg-brand-hover focus-visible:scale-105 active:scale-95"
    >
      {label}
      <LandingIcon name={arrow === "arrow" ? "arrow-right" : "feather-arrow-right"} className="ml-2 size-4" />
    </Link>
  );
}
