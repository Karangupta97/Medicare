// Layout primitives shared by every section. Server components; they hold no state.
import type { ReactNode } from "react";

/** An anchored section: small uppercase label, large quiet heading, one description line, then content. */
export function SectionCard({
  id,
  number,
  title,
  description,
  divider = true,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  /** A line and spacing above the section. The first section on the page has none. */
  divider?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-4 space-y-6 lg:scroll-mt-16 ${divider ? "border-t border-border pt-12" : ""}`}>
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Section {number}</p>
        <h2 id={`${id}-title`} className="mt-2 text-2xl font-bold text-text sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-prose text-base text-text-muted">{description}</p>
      </header>
      {children}
    </section>
  );
}

/** A soft card inside a section. */
export function Panel({
  title,
  description,
  children,
}: {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="@container min-w-0 rounded-xl border border-border bg-surface p-5 sm:p-6">
      {title !== undefined && (
        <div className="mb-5">
          <h3 className="text-lg font-bold text-text">{title}</h3>
          {description !== undefined && <p className="mt-1 max-w-prose text-sm text-text-muted">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

/** A labeled specimen: small caption above the sample. */
export function Sample({ label, note, children }: { label: ReactNode; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
      {children}
      {note !== undefined && <p className="text-xs text-text-muted">{note}</p>}
    </div>
  );
}

/** Inline code. */
export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-sm text-text break-words">{children}</code>;
}

/** Marks a state or component that the design system does not define yet. */
export function TodoChip({ children = "TODO" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-warning-subtle px-2 py-0.5 text-xs font-bold text-warning">
      {children}
    </span>
  );
}
