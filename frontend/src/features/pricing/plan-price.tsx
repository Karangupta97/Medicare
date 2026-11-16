"use client";

import { useBilling } from "./billing-context";
import { FREE_PRICE_LABEL, PERIOD_LABEL, formatPrice, originalAnnualPrice, planPrice, type Plan } from "./plans";

/**
 * Price block: symbol and numerals at one size (medium weight), period 20px muted on the same baseline.
 * The discount row (struck-through price and badge) keeps its height on every card, so cards line up and toggling
 * never shifts the layout. Changed values fade in over 150 ms (off under reduced motion).
 */
export function PlanPrice({ plan }: { plan: Plan }) {
  const { billing } = useBilling();
  const price = planPrice(plan, billing);
  const showDiscount = billing === "annual" && plan.monthlyPrice > 0;

  return (
    <div>
      <p className="flex h-[1em] items-baseline gap-1.5 text-[clamp(2.5rem,1.2rem+3.4vw,3.9rem)] font-medium leading-none tracking-[-0.03em] text-text">
        <span key={`${billing}-${price}`} className="animate-price-in">
          {price === 0 ? FREE_PRICE_LABEL : formatPrice(price)}
        </span>
        {price !== 0 && (
          <span key={`period-${billing}`} className="animate-price-in text-xl font-normal tracking-normal text-text-muted">
            {PERIOD_LABEL[billing]}
          </span>
        )}
      </p>
      <div className="mt-2 flex min-h-5 flex-wrap items-center gap-2 text-[13px]">
        {showDiscount && (
          <>
            <span key={`original-${billing}`} className="animate-price-in text-text-muted line-through">
              {formatPrice(originalAnnualPrice(plan))}
              {PERIOD_LABEL.annual}
            </span>
            {plan.savePct !== undefined && (
              <span key={`pct-${billing}`} className="status-badge status-badge-success animate-price-in">
                {plan.savePct}% OFF
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
