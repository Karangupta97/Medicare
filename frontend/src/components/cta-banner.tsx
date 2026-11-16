import Link from "next/link";

interface CtaBannerProps {
  /** Id of the h2, used for the section's accessible name. */
  id: string;
  heading: string;
  body: string;
  href: string;
  label: string;
}

/** Closing banner: flat brand surface, one pill button. Used by the Pricing and About pages. */
export function CtaBanner({ id, heading, body, href, label }: CtaBannerProps) {
  return (
    <section
      aria-labelledby={id}
      className="mx-auto mt-[clamp(64px,9svh,112px)] w-full max-w-[960px] px-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6"
    >
      <div className="rounded-2xl bg-brand px-6 py-[clamp(40px,6svh,72px)] text-center text-on-brand">
        <h2
          id={id}
          className="mx-auto max-w-[24ch] text-[clamp(1.75rem,1.1rem+2vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em]"
        >
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-[15px] font-normal leading-normal text-[color-mix(in_srgb,var(--sem-on-brand)_80%,var(--sem-brand))] sm:text-base">
          {body}
        </p>
        <Link
          href={href}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-surface px-6 text-[15px] font-medium text-brand transition-colors duration-150 ease-out hover:bg-surface-muted focus-visible:outline-on-brand motion-reduce:transition-none"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
