import Link from "next/link";
import { Magnetic } from "@/components/motion/interactions";
import { LandingIcon } from "./landing-icons";

export type ButtonVariant = "primary" | "secondary" | "primary-on-dark" | "secondary-on-dark";

const BASE =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-[250ms] ease-out motion-reduce:transition-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand shadow-soft hover:bg-brand-hover hover:shadow-lift focus-visible:bg-brand-hover",
  secondary:
    "border border-border-strong text-text hover:-translate-y-px hover:border-brand focus-visible:-translate-y-px focus-visible:border-brand motion-reduce:hover:translate-y-0",
  "primary-on-dark": "bg-on-hero text-hero-from hover:opacity-90 focus-visible:opacity-90",
  "secondary-on-dark":
    "border border-on-hero/30 text-on-hero hover:-translate-y-px hover:border-hero-accent-to hover:bg-on-hero/5 focus-visible:-translate-y-px focus-visible:border-hero-accent-to motion-reduce:hover:translate-y-0",
};

interface ButtonLinkProps {
  href: string;
  children: string;
  variant?: ButtonVariant;
  /** Arrow that slides 4px on hover and focus. */
  arrow?: boolean;
}

/** Pill button link. Primary variants get a 6px magnetic pull on pointer (mouse only). */
export function ButtonLink({ href, children, variant = "primary", arrow = false }: ButtonLinkProps) {
  const link = (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]}`}>
      {children}
      {arrow && (
        <LandingIcon
          name="feather-arrow-right"
          className="size-4 transition-transform duration-[250ms] ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
        />
      )}
    </Link>
  );
  return variant.startsWith("primary") ? <Magnetic>{link}</Magnetic> : link;
}
