// Spacing, radius, elevation and border steps, as documented in DESIGN.md section 5.
// Server component. Spacing is the Tailwind scale with a 4px base unit (1 = 0.25rem).
import { Code, Panel } from "./panel";

const SPACING = [
  { step: 1, bar: "w-1", use: "tight gaps" },
  { step: 2, bar: "w-2", use: "py-2, gap-2" },
  { step: 3, bar: "w-3", use: "py-3, space-x-3" },
  { step: 4, bar: "w-4", use: "px-4, gap-4, card padding" },
  { step: 6, bar: "w-6", use: "sm:p-6, sm:gap-6" },
  { step: 8, bar: "w-8", use: "lg:px-8" },
  { step: 11, bar: "w-11", use: "min-h-11 (touch target)" },
  { step: 12, bar: "w-12", use: "lg:py-12" },
] as const;

const RADIUS = [
  { name: "rounded-lg", value: "0.5rem (8px)", shape: "rounded-lg", use: "nav-link, toggle options" },
  { name: "rounded-xl", value: "0.75rem (12px)", shape: "rounded-xl", use: "card, btn, form-input" },
  { name: "rounded-full", value: "pill", shape: "rounded-full", use: "status-badge, chips" },
] as const;

const ELEVATION = [
  { name: "shadow-xs", shadow: "shadow-xs", use: "card, btn-primary" },
  { name: "shadow-md", shadow: "shadow-md", use: "btn-primary hover" },
  { name: "shadow-lg", shadow: "shadow-lg", use: "card-hover" },
  { name: "shadow-custom", shadow: "shadow-custom", use: "floating surfaces (0px 10px 20px, 20% black)" },
] as const;

export function ScalesPanel() {
  return (
    <div className="space-y-6">
      <Panel title="Spacing" description="4px base unit. These are the steps the ported classes use.">
        <ul className="space-y-3">
          {SPACING.map((item) => (
            <li key={item.step} className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:grid-cols-[4.5rem_3rem_1fr_1fr]">
              <Code>{item.step}</Code>
              <span className="hidden text-sm tabular-nums text-text-muted sm:block">{item.step * 4}px</span>
              <span aria-hidden="true" className={`block h-3 rounded bg-secondary ${item.bar}`} />
              <span className="col-span-2 text-sm text-text-muted sm:col-span-1">{item.use}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Radius">
          <ul className="space-y-4">
            {RADIUS.map((item) => (
              <li key={item.name} className="flex items-center gap-4">
                <span aria-hidden="true" className={`block size-14 shrink-0 border-2 border-secondary bg-secondary-subtle ${item.shape}`} />
                <span className="min-w-0 text-sm">
                  <Code>{item.name}</Code>
                  <span className="mt-1 block text-text-muted">{item.value} · {item.use}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Elevation and borders" description="Shadows are soft; in dark mode they are close to invisible, so surfaces rely on borders.">
          <ul className="grid gap-4 sm:grid-cols-2">
            {ELEVATION.map((item) => (
              <li key={item.name} className="min-w-0">
                <span aria-hidden="true" className={`block h-14 rounded-xl border border-border bg-surface ${item.shadow}`} />
                <span className="mt-2 block text-sm"><Code>{item.name}</Code></span>
                <span className="block text-xs text-text-muted">{item.use}</span>
              </li>
            ))}
            <li className="min-w-0">
              <span aria-hidden="true" className="block h-14 rounded-xl border border-border bg-surface" />
              <span className="mt-2 block text-sm"><Code>border-border</Code></span>
              <span className="block text-xs text-text-muted">1px, decorative lines</span>
            </li>
            <li className="min-w-0">
              <span aria-hidden="true" className="block h-14 rounded-xl border border-border-strong bg-surface" />
              <span className="mt-2 block text-sm"><Code>border-border-strong</Code></span>
              <span className="block text-xs text-text-muted">1px, control edges</span>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
