import { ButtonLink } from "./button-link";

interface CtaLinkProps {
  href: string;
  label: string;
  /** Kept for existing call sites; both render the same sliding arrow. */
  arrow?: "arrow" | "feather";
}

/** Section call to action: the primary pill button with a sliding arrow. */
export function CtaLink({ href, label }: CtaLinkProps) {
  return (
    <ButtonLink href={href} arrow>
      {label}
    </ButtonLink>
  );
}
