"use client";

import { useState, type ReactNode } from "react";
import { COMPARISON, type ComparisonValue } from "./comparison";
import { PlanSelector } from "./plan-selector";
import { PLANS, PLAN_SELECTOR_LABEL, type PlanKey } from "./plans";
import { PricingIcon } from "./pricing-icons";

const PRO_TINT = "bg-secondary-subtle/40";

function Value({ value }: { value: ComparisonValue }): ReactNode {
  if (value === true) {
    return (
      <>
        <PricingIcon name="check" strokeWidth={1.75} className="mx-auto size-[18px] text-brand" />
        <span className="sr-only">{COMPARISON.included}</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <PricingIcon name="minus" strokeWidth={1.75} className="mx-auto size-[18px] text-text-muted" />
        <span className="sr-only">{COMPARISON.notIncluded}</span>
      </>
    );
  }
  return <>{value}</>;
}

/**
 * One white card. From md a real table with a sticky header and a tinted Pro column. Below md a plan selector
 * and a two-column list for the selected plan (no sideways scrolling). No overflow clipping on the card, so the
 * sticky header keeps working.
 */
export function ComparisonTable() {
  const [plan, setPlan] = useState<PlanKey>("pro");

  return (
    <div className="rounded-2xl bg-surface shadow-xs">
      <div className="hidden md:block">
        <table className="w-full border-separate border-spacing-0 text-[15px] text-text">
          <caption className="sr-only">{COMPARISON.heading}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 z-10 h-14 w-[40%] rounded-tl-2xl border-b border-border bg-surface px-6 text-left text-sm font-normal text-text-muted">
                {COMPARISON.featuresLabel}
              </th>
              {PLANS.map((p) => (
                <th
                  key={p.key}
                  scope="col"
                  className={`sticky top-0 z-10 h-14 border-b border-border bg-surface px-4 text-center font-medium text-text ${
                    p.popular === true ? "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-secondary-subtle/40" : ""
                  } ${p.key === "premium" ? "rounded-tr-2xl" : ""}`}
                >
                  {p.name}
                  {p.popular === true && <span className="block text-xs font-normal leading-tight text-text-muted">{COMPARISON.popularNote}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>*]:border-b-0">
            {COMPARISON.rows.map((row) => (
              <tr key={row.name} className="h-14">
                <th scope="row" className="border-b border-border px-6 text-left font-normal text-text">
                  {row.name}
                </th>
                <td className="border-b border-border px-4 text-center">
                  <Value value={row.free} />
                </td>
                <td className={`border-b border-border px-4 text-center ${PRO_TINT}`}>
                  <Value value={row.pro} />
                </td>
                <td className="border-b border-border px-4 text-center">
                  <Value value={row.premium} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-4 md:hidden">
        <PlanSelector value={plan} onChange={setPlan} label={PLAN_SELECTOR_LABEL} idPrefix="compare" />
        {PLANS.map((p) => (
          <div
            key={p.key}
            id={`compare-panel-${p.key}`}
            role="tabpanel"
            aria-labelledby={`compare-tab-${p.key}`}
            hidden={p.key !== plan}
            className="mt-2"
          >
            <dl>
              {COMPARISON.rows.map((row) => (
                <div key={row.name} className="flex min-h-14 items-center justify-between gap-4 border-b border-border text-[15px] last:border-b-0">
                  <dt className="min-w-0 text-left font-normal text-text">{row.name}</dt>
                  <dd className="shrink-0 text-right text-text">
                    <Value value={row[p.key]} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
