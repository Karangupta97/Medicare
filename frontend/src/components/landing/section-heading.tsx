import type { ReactNode } from "react";
import { Reveal, RevealLines } from "@/components/motion/primitives";

/**
 * One rhythm for the landing sections: padding clamp(80px, 10vw, 140px), eyebrow to heading 12px, heading to lead 16px,
 * heading block to content clamp(40px, 5vw, 72px).
 */
export const SECTION_PAD = "py-[clamp(80px,10vw,140px)]";
export const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6";
export const H2_CLASS = "text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.02em]";
export const BODY_CLASS = "text-base leading-[1.65] sm:text-[17px] lg:text-lg";

/** Eyebrow: 12px, uppercase, tracking 0.14em, brand on light surfaces and the lilac hero accent on navy. */
export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-3 flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em] ${dark ? "text-hero-accent-to" : "text-brand"}`}>
      <span aria-hidden="true" className={`size-1 rounded-full ${dark ? "bg-hero-accent-to" : "bg-violet"}`} />
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  /** Muted lead under the heading. */
  children?: ReactNode;
  align?: "start" | "center";
  /** Section sits on an ink surface. */
  dark?: boolean;
  /** Optional link or button shown at the end of the heading row from md. */
  action?: ReactNode;
}

/** Section heading block: eyebrow, h2 with a masked rise, muted lead, optional action. */
export function SectionHeading({ id, eyebrow, title, children, align = "start", dark = false, action }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={`mb-[clamp(40px,5vw,72px)] flex flex-col gap-6 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between md:gap-12"
      }`}
    >
      <div className="max-w-[52ch]">
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <h2 id={id} className={`${H2_CLASS} ${dark ? "text-on-hero" : "text-text"}`}>
          <RevealLines lines={[title]} />
        </h2>
        {children !== undefined && (
          <Reveal className="mt-4">
            <p className={`${BODY_CLASS} max-w-[62ch] ${dark ? "text-on-hero/70" : "text-text-muted"}`}>{children}</p>
          </Reveal>
        )}
      </div>
      {action}
    </div>
  );
}
