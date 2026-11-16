import type { ReactNode } from "react";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  id: string;
  title: string;
  children: ReactNode;
  /** Small pill above the title (the "Why Choose Us" tag). */
  eyebrow?: string;
}

/** Centered section heading used by the old page: optional pill, h2 (24px to 36px), gray-600 lead at max-w-2xl. */
export function SectionHeading({ id, title, children, eyebrow }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 text-center md:mb-16">
      {eyebrow !== undefined && (
        <span className="mb-3 inline-block rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-brand md:text-sm">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="mb-4 text-fluid-h2 font-bold text-brand">
        {title}
      </h2>
      <p className="mx-auto max-w-2xl font-normal text-text-muted">{children}</p>
    </Reveal>
  );
}
