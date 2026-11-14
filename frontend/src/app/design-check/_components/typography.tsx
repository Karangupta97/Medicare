"use client";
import { activeBreakpoint, useFontFaces, useTypeMetrics, useViewportWidth } from "../_lib/hooks";
import { Code, Panel, Sample } from "./panel";

const SPECIMENS = [
  { className: "heading-1", label: "Heading 1", text: "Your health records, in one place" },
  { className: "heading-2", label: "Heading 2", text: "Recent reports and results" },
  { className: "body-text", label: "Body", text: "Upload, store and share medical reports. Your data stays private and you decide who can see it." },
  { className: "form-label", label: "Label", text: "Date of birth" },
] as const;

const WEIGHTS = [
  { className: "font-normal", weight: 400, label: "Regular" },
  { className: "font-medium", weight: 500, label: "Medium" },
  { className: "font-bold", weight: 700, label: "Bold" },
  { className: "font-black", weight: 900, label: "Black" },
] as const;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789";

export function Typography() {
  const metrics = useTypeMetrics();
  const width = useViewportWidth();
  const faces = useFontFaces();

  const family = metrics?.get("font-sans")?.fontFamily ?? "…";

  function faceStatus(weight: number): string {
    if (faces === null) return "…";
    const matching = faces.filter((face) => face.weight === String(weight));
    if (matching.length === 0) return "not declared";
    return matching.some((face) => face.status === "loaded") ? "loaded" : "declared, loads on first use";
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-muted">
        Viewport <span className="font-bold tabular-nums text-text">{width === 0 ? "…" : `${width}px`}</span>, breakpoint{" "}
        <span className="font-bold text-text">{activeBreakpoint(width)}</span>. Sizes below are read from the rendered elements, so they change with the viewport.
      </p>

      <Panel title="Hierarchy">
        <div className="divide-y divide-border">
          {SPECIMENS.map((specimen) => {
            const m = metrics?.get(specimen.className);
            return (
              <div key={specimen.className} className="grid grid-cols-1 gap-3 py-5 first:pt-0 last:pb-0 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
                <dl className="space-y-1 text-sm">
                  <dt className="sr-only">Class</dt>
                  <dd><Code>{specimen.className}</Code></dd>
                  <dt className="sr-only">Computed style</dt>
                  <dd className="tabular-nums text-text-muted">
                    {m ? `${m.fontSize} / ${m.lineHeight}` : "…"}
                  </dd>
                  <dd className="tabular-nums text-text-muted">{m ? `weight ${m.fontWeight}` : "…"}</dd>
                </dl>
                <p className={`${specimen.className} min-w-0 break-words`}>{specimen.text}</p>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Font" description="Montserrat Alternates, loaded with next/font/google (latin subset, display swap).">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-w-0 space-y-4">
            <Sample label="Family stack in use">
              <p className="break-words font-mono text-sm text-text">{family}</p>
            </Sample>
            <Sample label="Large specimen">
              <p aria-hidden="true" className="text-8xl font-black leading-none text-text">Aa</p>
            </Sample>
          </div>
          <ul className="min-w-0 space-y-4">
            {WEIGHTS.map((item) => (
              <li key={item.className} className="min-w-0">
                <p className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="font-bold text-text">{item.label} {item.weight}</span>
                  <span className="text-text-muted"><Code>{item.className}</Code> · {faceStatus(item.weight)}</span>
                </p>
                <p className={`${item.className} mt-1 break-words text-lg text-text`}>{ALPHABET}</p>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
