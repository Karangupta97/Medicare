// Composes the dashboard: shell, then the nine sections in order. Server component; only the
// interactive parts (measurement, filters, copy, compare, motion replay) are client components.
import { TOP_ID } from "../_lib/sections";
import { ActiveSectionProvider } from "./active-section";
import { CompareSection } from "./compare";
import {
  ButtonsGroup,
  CardsGroup,
  ComponentsPanel,
  InputsGroup,
  LayoutGroup,
  LegacyGroup,
  NavigationGroup,
  SurfacesGroup,
} from "./component-samples";
import { ContrastMatrix } from "./contrast-matrix";
import { DashboardProvider } from "./dashboard-provider";
import { MotionGrid } from "./motion";
import { Overview } from "./overview";
import { Palette } from "./palette";
import { SectionCard } from "./panel";
import { ScalesPanel } from "./scales";
import { SemanticChips } from "./semantic-chips";
import { SemanticTable } from "./semantic-table";
import { DashboardShell } from "./shell";
import { StatusPanel } from "./status-samples";
import { TopBar } from "./top-bar";
import { TouchTargetScope } from "./touch-targets";
import { Typography } from "./typography";

export function Dashboard() {
  return (
    <ActiveSectionProvider>
      <DashboardShell>
        <DashboardProvider>
          <span id={TOP_ID} />
          <TopBar />
          <div className="mx-auto w-full max-w-[1200px] px-4 pt-8 sm:px-8 lg:pt-12">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Internal tool</p>
              <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">Medicare design system</h1>
              <p className="mt-3 text-base text-text-muted">
                A live view of the tokens, contrast results and components in the app. Every value is read from src/app/globals.css and described in DESIGN.md, and every color is a semantic token, so the page follows the theme you pick.
              </p>
            </div>
            <div className="space-y-12">
              <SectionCard id="overview" number="01" title="Overview" description="Token counts and the result of every intended contrast pair, in both themes." divider={false}>
                <Overview />
              </SectionCard>
              <SectionCard id="palette" number="02" title="Palette" description="Primitive tokens by family. These are the only place raw color values exist.">
                <Palette />
              </SectionCard>
              <SectionCard id="semantic-tokens" number="03" title="Semantic tokens" description="Purpose-named tokens with a value for each theme. Components use these, never primitives.">
                <SemanticTable />
              </SectionCard>
              <SectionCard id="contrast-matrix" number="04" title="Contrast matrix" description="Each intended pair measured with the WCAG 2.x formula. Text needs 4.5:1, UI parts need 3:1.">
                <ContrastMatrix />
              </SectionCard>
              <SectionCard id="typography" number="05" title="Typography" description="The four text classes and the font, measured at the current viewport.">
                <Typography />
              </SectionCard>
              <SectionCard id="components" number="06" title="Components" description="Every ported class in its states. Anything marked TODO is not defined by the design system yet.">
                <TouchTargetScope>
                  <ComponentsPanel />
                </TouchTargetScope>
              </SectionCard>
              <SectionCard id="status" number="07" title="Status and emergency" description="Success, warning, danger, info and emergency, each with an icon and a text label.">
                <StatusPanel />
              </SectionCard>
              <SectionCard id="scales" number="08" title="Spacing, radius, elevation, motion" description="The real steps used by the ported classes, and every animation with its timing.">
                <ScalesPanel />
                <MotionGrid />
              </SectionCard>
            </div>
          </div>
          <div className="mx-auto mt-12 w-full max-w-[1680px] px-4 sm:px-8">
            <SectionCard id="compare" number="09" title="Compare mode" description="Pick a group and see it large, in light and dark side by side. The page can be in either theme.">
              <CompareSection
                groups={[
                  { id: "buttons", label: "Buttons", node: <ButtonsGroup /> },
                  { id: "inputs", label: "Inputs", node: <InputsGroup /> },
                  { id: "navigation", label: "Navigation", node: <NavigationGroup /> },
                  { id: "cards", label: "Cards and badges", node: <CardsGroup /> },
                  { id: "surfaces", label: "Surfaces and overlays", node: <SurfacesGroup /> },
                  { id: "layout", label: "Layout helpers", node: <LayoutGroup /> },
                  { id: "legacy", label: "Legacy utilities", node: <LegacyGroup /> },
                  { id: "status", label: "Status and emergency", node: <StatusPanel /> },
                  { id: "colors", label: "Semantic colors", node: <SemanticChips /> },
                ]}
              />
            </SectionCard>
          </div>
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-8 sm:px-8 lg:pb-12">
            <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm text-text-muted">
              <p>End of the design system page. Edit src/app/globals.css, then use “Measure again” in the Overview.</p>
              <a href={`#${TOP_ID}`} className="inline-flex min-h-11 items-center rounded-lg px-3 font-bold text-brand hover:bg-surface-muted">
                Back to top
              </a>
            </footer>
          </div>
        </DashboardProvider>
      </DashboardShell>
    </ActiveSectionProvider>
  );
}
