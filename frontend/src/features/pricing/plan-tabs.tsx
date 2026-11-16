"use client";

import { useBilling } from "./billing-context";
import { PlanSelector } from "./plan-selector";
import { PLAN_SELECTOR_LABEL } from "./plans";

/** Phone and small-tablet plan selector for the plan cards (hidden from lg). */
export function PlanTabs() {
  const { selectedPlan, setSelectedPlan } = useBilling();
  return (
    <PlanSelector value={selectedPlan} onChange={setSelectedPlan} label={PLAN_SELECTOR_LABEL} idPrefix="plan" className="lg:hidden" />
  );
}
