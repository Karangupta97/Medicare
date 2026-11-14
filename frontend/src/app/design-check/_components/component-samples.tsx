// Every ported class in its states. Server component: forced states are plain classes, so no
// pointer interaction is needed. States the design system does not define are marked TODO.
import type { ReactNode } from "react";
import { FieldSample } from "./field-sample";
import { CheckCircleIcon, CheckIcon, WarningIcon, XCircleIcon } from "./icons";
import { Code, Panel, Sample, TodoChip } from "./panel";

const FORCED_FOCUS = "outline-2 outline-offset-2 outline-brand";

type StateCells = {
  readonly default: ReactNode;
  readonly hover: ReactNode;
  readonly focus: ReactNode;
  readonly disabled: ReactNode;
};

const STATE_LABELS = [
  ["default", "Default"],
  ["hover", "Hover (forced)"],
  ["focus", "Focus (forced)"],
  ["disabled", "Disabled"],
] as const;

/** One card per class with its four states. The states sit in 1, 2 or 4 columns depending on the card's own width. */
function StateGrid({ caption, rows }: { caption: string; rows: readonly { name: string; note?: string; states: StateCells }[] }) {
  return (
    <ul aria-label={caption} className="space-y-4">
      {rows.map((row) => (
        <li key={row.name} className="@container rounded-xl border border-border bg-surface p-4">
          <div className="mb-4">
            <Code>{row.name}</Code>
            {row.note !== undefined && <p className="mt-2 text-xs text-text-muted">{row.note}</p>}
          </div>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-5 @sm:grid-cols-2 @3xl:grid-cols-4">
            {STATE_LABELS.map(([key, label]) => (
              <div key={key} className="min-w-0 space-y-2">
                <dt className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</dt>
                <dd>{row.states[key]}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}

/** A state the design system has no style for: the plain element plus a TODO marker. */
function Undefined({ children, what }: { children: ReactNode; what: string }) {
  return (
    <div className="space-y-2">
      {children}
      <p className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <TodoChip />
        {what}
      </p>
    </div>
  );
}

function Buttons() {
  return (
    <StateGrid
      caption="Buttons in each state"
      rows={[
        {
          name: "btn btn-primary",
          states: {
            default: <button type="button" className="btn btn-primary">Save report</button>,
            hover: <button type="button" className="btn btn-primary bg-brand-hover! shadow-md!">Save report</button>,
            focus: <button type="button" className={`btn btn-primary ${FORCED_FOCUS}`}>Save report</button>,
            disabled: (
              <Undefined what="No disabled style is defined">
                <button type="button" disabled className="btn btn-primary">Save report</button>
              </Undefined>
            ),
          },
        },
        {
          name: "btn btn-secondary",
          states: {
            default: <button type="button" className="btn btn-secondary">Cancel</button>,
            hover: <button type="button" className="btn btn-secondary border-brand!">Cancel</button>,
            focus: <button type="button" className={`btn btn-secondary ${FORCED_FOCUS}`}>Cancel</button>,
            disabled: (
              <Undefined what="No disabled style is defined">
                <button type="button" disabled className="btn btn-secondary">Cancel</button>
              </Undefined>
            ),
          },
        },
        {
          name: "btn btn-primary with icon",
          states: {
            default: <button type="button" className="btn btn-primary"><CheckIcon />Verify</button>,
            hover: <button type="button" className="btn btn-primary bg-brand-hover! shadow-md!"><CheckIcon />Verify</button>,
            focus: <button type="button" className={`btn btn-primary ${FORCED_FOCUS}`}><CheckIcon />Verify</button>,
            disabled: (
              <Undefined what="No disabled style is defined">
                <button type="button" disabled className="btn btn-primary"><CheckIcon />Verify</button>
              </Undefined>
            ),
          },
        },
      ]}
    />
  );
}

function Navigation() {
  const disabledNote = "No disabled style is defined";
  return (
    <StateGrid
      caption="Navigation links in each state"
      rows={[
        {
          name: "nav-link",
          note: "The real hover also scales to 110%; not shown here.",
          states: {
            default: <a href="#components" className="nav-link">Patients</a>,
            hover: <a href="#components" className="nav-link bg-surface-muted! text-brand!">Patients</a>,
            focus: <a href="#components" className={`nav-link ${FORCED_FOCUS}`}>Patients</a>,
            disabled: (
              <Undefined what={disabledNote}>
                <a aria-disabled="true" className="nav-link">Patients</a>
              </Undefined>
            ),
          },
        },
        {
          name: "mobile-nav-link",
          states: {
            default: <a href="#components" className="mobile-nav-link">Reports</a>,
            hover: <a href="#components" className="mobile-nav-link bg-surface-muted!">Reports</a>,
            focus: <a href="#components" className={`mobile-nav-link ${FORCED_FOCUS}`}>Reports</a>,
            disabled: (
              <Undefined what={disabledNote}>
                <a aria-disabled="true" className="mobile-nav-link">Reports</a>
              </Undefined>
            ),
          },
        },
        {
          name: "menu-item",
          states: {
            default: <a href="#components" className="menu-item">Settings</a>,
            hover: <a href="#components" className="menu-item bg-surface-muted!">Settings</a>,
            focus: <a href="#components" className={`menu-item ${FORCED_FOCUS}`}>Settings</a>,
            disabled: (
              <Undefined what={disabledNote}>
                <a aria-disabled="true" className="menu-item">Settings</a>
              </Undefined>
            ),
          },
        },
      ]}
    />
  );
}

function Inputs() {
  return (
    <div className="grid gap-6 @md:grid-cols-2 @4xl:grid-cols-4">
      <Sample label={<>Default</>}>
        <FieldSample state="default" />
      </Sample>
      <Sample label="Focus (forced)">
        <FieldSample state="focus" />
      </Sample>
      <Sample label="Error" note={<><TodoChip /> Uses border-danger as listed in DESIGN.md; the state is not confirmed.</>}>
        <FieldSample state="error" />
      </Sample>
      <Sample label="Disabled" note={<><TodoChip /> No disabled style is defined; this is the native disabled field.</>}>
        <FieldSample state="disabled" />
      </Sample>
    </div>
  );
}

function CardsAndBadges() {
  return (
    <div className="grid gap-6 @xl:grid-cols-2 @4xl:grid-cols-3">
      <Sample label="card">
        <div className="card">
          <h4 className="text-base font-bold text-text">Blood test report</h4>
          <p className="mt-1 text-sm text-text-muted">Uploaded 12 Nov, 2 pages</p>
        </div>
      </Sample>
      <Sample label="card card-hover" note="Hover over the card to see the real hover.">
        <div className="card card-hover">
          <h4 className="text-base font-bold text-text">Blood test report</h4>
          <p className="mt-1 text-sm text-text-muted">Uploaded 12 Nov, 2 pages</p>
        </div>
      </Sample>
      <Sample label="card-hover (forced, approximate)" note="Approximated with utilities; the real rule also lifts and scales the card.">
        <div className="card card-hover -translate-y-1 scale-[1.02] shadow-2xl">
          <h4 className="text-base font-bold text-text">Blood test report</h4>
          <p className="mt-1 text-sm text-text-muted">Uploaded 12 Nov, 2 pages</p>
        </div>
      </Sample>
      <Sample label="status-badge">
        <div className="flex flex-wrap gap-2">
          <span className="status-badge status-badge-success"><CheckCircleIcon className="mr-1 size-3.5" />Verified</span>
          <span className="status-badge status-badge-warning"><WarningIcon className="mr-1 size-3.5" />Expiring</span>
          <span className="status-badge status-badge-error"><XCircleIcon className="mr-1 size-3.5" />Rejected</span>
        </div>
      </Sample>
    </div>
  );
}

function Surfaces() {
  return (
    <div className="grid gap-6 @3xl:grid-cols-2">
      <Sample label="glass on a brand backdrop">
        <div className="space-y-3 rounded-xl bg-brand p-5">
          <div className="glass rounded-xl border border-border p-4 text-on-brand">
            <p className="font-bold">.glass</p>
            <p className="text-sm">Translucent surface over a solid backdrop.</p>
          </div>
          <div className="glass-search-card rounded-xl p-4 text-on-brand">
            <p className="font-bold">.glass-search-card</p>
            <p className="text-sm">Slightly more opaque, with a border.</p>
          </div>
        </div>
      </Sample>
      <Sample label="Modal overlay in a bounded box" note="bg-overlay at 50%, with a card as the dialog.">
        <div className="relative h-56 overflow-hidden rounded-xl border border-border bg-surface-muted">
          <p className="p-4 text-sm text-text-muted">Page content behind the overlay</p>
          <div className="absolute inset-0 flex items-center justify-center bg-overlay/50 p-4">
            <div className="card w-full max-w-xs">
              <h4 className="text-base font-bold text-text">Share this report?</h4>
              <p className="mt-1 text-sm text-text-muted">Your doctor will be able to view it.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn btn-secondary">Cancel</button>
                <button type="button" className="btn btn-primary">Share</button>
              </div>
            </div>
          </div>
        </div>
      </Sample>
      <Sample label="Table" note={<><TodoChip /> Native table with bg-surface, a bg-surface-muted header and border-border. No table class exists yet.</>}>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[20rem] text-left text-sm">
            <caption className="sr-only">Sample table</caption>
            <thead className="bg-surface-muted text-xs font-bold uppercase tracking-wider text-text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">Report</th>
                <th scope="col" className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border"><td className="px-4 py-3 text-text">Blood test</td><td className="px-4 py-3 text-text-muted">12 Nov</td></tr>
              <tr className="border-t border-border"><td className="px-4 py-3 text-text">X-ray</td><td className="px-4 py-3 text-text-muted">3 Nov</td></tr>
            </tbody>
          </table>
        </div>
      </Sample>
      <Sample label="Toast and gradient text">
        <div className="space-y-3">
          <p className="flex flex-wrap items-center gap-2 text-sm text-text"><TodoChip /> Toast: no design exists yet. Not drawn here on purpose.</p>
          <p className="gradient-text text-2xl font-bold">.gradient-text</p>
          <p className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <span className="inline-flex items-center rounded-full bg-warning-subtle px-2 py-0.5 text-xs font-bold text-warning">Deprecated</span>
            Remove when unused. Do not use in new work.
          </p>
        </div>
      </Sample>
    </div>
  );
}

function LayoutHelpers() {
  const box = "rounded-lg border border-border bg-surface-muted p-3 text-center text-sm text-text";
  return (
    <div className="space-y-6">
      <Sample label="container-custom and section" note="container-custom: max width 1280px, padding 16 / 24 / 32px. section: vertical padding 24 / 32 / 48px.">
        <div className="section rounded-xl border border-border bg-surface-muted">
          <div className="container-custom"><p className="rounded-lg border border-border bg-surface p-3 text-sm text-text">container-custom inside section</p></div>
        </div>
      </Sample>
      <div className="grid gap-6">
        <Sample label="grid-responsive-2">
          <div className="grid-responsive-2"><div className={box}>1</div><div className={box}>2</div></div>
        </Sample>
        <Sample label="grid-responsive-3">
          <div className="grid-responsive-3"><div className={box}>1</div><div className={box}>2</div><div className={box}>3</div></div>
        </Sample>
        <Sample label="grid-responsive-4">
          <div className="grid-responsive-4"><div className={box}>1</div><div className={box}>2</div><div className={box}>3</div><div className={box}>4</div></div>
        </Sample>
      </div>
      <Sample label="scrollbar-hide" note="Scrolls with the wheel or keyboard; the scrollbar is hidden.">
        <div className="scrollbar-hide h-20 overflow-y-auto rounded-lg border border-border bg-surface p-3 text-sm text-text" tabIndex={0} role="region" aria-label="Scrollable sample">
          <p>Line one</p><p>Line two</p><p>Line three</p><p>Line four</p><p>Line five</p><p>Line six</p><p>Line seven</p><p>Line eight</p>
        </div>
      </Sample>
    </div>
  );
}

function LegacyUtilities() {
  const field = "mt-1 w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-text";
  return (
    <div className="grid gap-6 @md:grid-cols-2 @4xl:grid-cols-3">
      <Sample label="bg-primary"><div className="bg-primary rounded-lg p-3 text-sm font-bold text-on-brand">bg-primary</div></Sample>
      <Sample label="text-secondary"><p className="text-secondary text-lg font-bold">text-secondary</p></Sample>
      <Sample label="bg-accent"><div className="bg-accent rounded-lg p-3 text-sm font-bold text-on-accent">bg-accent</div></Sample>
      <Sample label="border-accent"><div className="rounded-lg border-2 border-accent p-3 text-sm text-text">border-accent</div></Sample>
      <Sample label="xs:flex" note="Appears from 320px.">
        <div className="hidden items-center gap-2 rounded-lg bg-surface-muted p-3 text-sm text-text xs:flex">xs:flex</div>
      </Sample>
      <Sample label="font-montserrat"><p className="font-montserrat text-lg text-text">font-montserrat</p></Sample>
      <Sample label="shadow-custom"><div className="shadow-custom rounded-lg bg-surface p-3 text-sm text-text">shadow-custom</div></Sample>
      <Sample label="aspect-w-16 aspect-h-9">
        <div className="aspect-w-16 aspect-h-9">
          <div className="flex items-center justify-center rounded-lg bg-surface-muted text-sm text-text">16:9</div>
        </div>
      </Sample>
      <Sample label="sm:card and hover:btn-primary" note="Becomes a card from 640px.">
        <div className="sm:card">
          <button type="button" className="btn btn-secondary hover:btn-primary">hover:btn-primary</button>
        </div>
      </Sample>
      <Sample label="sm:heading-1"><p className="text-lg font-bold text-text sm:heading-1">sm:heading-1</p></Sample>
      <div className="@md:col-span-2 @4xl:col-span-3">
        <Sample label="prose (typography plugin, mapped to tokens)" note="The plugin's own colors are fixed, so the prose variables are pointed at tokens. This works in both themes without dark: utilities.">
          <div className="prose max-w-none [--tw-prose-body:var(--sem-text)] [--tw-prose-bold:var(--sem-text)] [--tw-prose-bullets:var(--sem-text-muted)] [--tw-prose-headings:var(--sem-text)] [--tw-prose-links:var(--sem-brand)]">
            <h4>Prose heading</h4>
            <p>Long-form text such as terms and notices. It includes a <a href="#components">link</a> and a list.</p>
            <ul><li>First item</li><li>Second item</li></ul>
          </div>
        </Sample>
      </div>
      <div className="@md:col-span-2 @4xl:col-span-3">
        <Sample label="Native form controls (@tailwindcss/forms)">
          <div className="grid gap-4 @lg:grid-cols-3">
            <label className="block text-sm text-text">Text<input type="text" className={field} /></label>
            <label className="block text-sm text-text">Select<select className={field}><option>First</option><option>Second</option></select></label>
            <label className="block text-sm text-text">Textarea<textarea rows={2} className={field} /></label>
          </div>
        </Sample>
      </div>
    </div>
  );
}

export function ButtonsGroup() {
  return <Panel title="Buttons" description="btn with btn-primary or btn-secondary. Forced states are drawn with classes, no pointer needed."><Buttons /></Panel>;
}
export function InputsGroup() {
  return <Panel title="Inputs" description="form-label and form-input."><Inputs /></Panel>;
}
export function NavigationGroup() {
  return <Panel title="Navigation" description="Links used in the header, the mobile menu and dropdowns."><Navigation /></Panel>;
}
export function CardsGroup() {
  return <Panel title="Cards and status badges"><CardsAndBadges /></Panel>;
}
export function SurfacesGroup() {
  return <Panel title="Surfaces, overlays and other classes"><Surfaces /></Panel>;
}
export function LayoutGroup() {
  return <Panel title="Layout helpers" description="These classes use the viewport width, not the width of the box they are in."><LayoutHelpers /></Panel>;
}
export function LegacyGroup() {
  return <Panel title="Legacy utilities" description="Names ported from the old app, kept so existing markup keeps working."><LegacyUtilities /></Panel>;
}

/** All component groups, one after the other. */
export function ComponentsPanel() {
  return (
    <div className="space-y-6">
      <ButtonsGroup />
      <InputsGroup />
      <NavigationGroup />
      <CardsGroup />
      <SurfacesGroup />
      <LayoutGroup />
      <LegacyGroup />
    </div>
  );
}
