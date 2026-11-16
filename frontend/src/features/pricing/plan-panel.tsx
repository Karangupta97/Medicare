"use client";

import type { ReactNode } from "react";
import { useBilling } from "./billing-context";
import type { PlanKey } from "./plans";
import { useMediaQuery } from "./use-media-query";

/**
 * Grid placement per plan from lg: a 3 x 3 grid with rows 1fr / auto / 1fr. Free and Premium sit in the middle row
 * (equal height, centered); Pro spans all three rows, so it extends equally above and below them.
 */
const PLACEMENT: Record<PlanKey, string> = {
  free: "lg:col-start-1 lg:row-start-2",
  pro: "lg:col-start-2 lg:row-span-3 lg:row-start-1",
  premium: "lg:col-start-3 lg:row-start-2",
};

/**
 * Wraps one plan card. Below lg the three panels share one grid cell (the area keeps the tallest card's height)
 * and only the selected one is visible; the others are `invisible`, so they are out of the tab order and hidden
 * from assistive technology.
 */
export function PlanPanel({ planKey, children }: { planKey: PlanKey; children: ReactNode }) {
  const { selectedPlan } = useBilling();
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const selected = planKey === selectedPlan;
  return (
    <div
      id={`plan-panel-${planKey}`}
      role={isDesktop ? undefined : "tabpanel"}
      aria-labelledby={isDesktop ? undefined : `plan-tab-${planKey}`}
      className={`flex min-w-0 flex-col transition-[opacity,visibility] duration-150 ease-out motion-reduce:transition-none max-lg:col-start-1 max-lg:row-start-1 ${PLACEMENT[planKey]} ${
        selected ? "opacity-100" : "max-lg:invisible max-lg:opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
