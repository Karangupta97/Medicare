import type { ReactNode } from "react";

/** Shared heading block for the sections below the plan cards: h2, muted subtitle, 40px to the content. */
export function SectionHeading({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <h2 id={id} className="text-[clamp(1.75rem,1.2rem+1.8vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-text">
        {title}
      </h2>
      <p className="mt-3 max-w-[52ch] text-[15px] font-normal leading-normal text-text-muted sm:text-base">{children}</p>
    </div>
  );
}
