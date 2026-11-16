import Link from "next/link";
import { FeatureList } from "./feature-list";
import { PlanPanel } from "./plan-panel";
import { PlanPrice } from "./plan-price";
import { PricingIcon } from "./pricing-icons";
import { POPULAR_LABEL, type Plan } from "./plans";

const BUTTON_BASE =
  "mt-[clamp(10px,2svh,16px)] inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium transition-[background-color,opacity] duration-150 ease-out motion-reduce:transition-none lg:min-h-10";

/**
 * White card: no border, no shadow, 28px radius (26px when inside the Pro frame). Left-aligned content:
 * name, price, discount row, tagline, pill button, features.
 */
function Card({ plan, inFrame }: { plan: Plan; inFrame: boolean }) {
  const popular = plan.popular === true;
  const nameId = `plan-${plan.key}-name`;
  return (
    <article
      aria-labelledby={nameId}
      aria-describedby={popular ? `plan-${plan.key}-popular` : undefined}
      className={`flex flex-1 flex-col bg-surface p-[clamp(20px,3.2svh,26px)] ${inFrame ? "rounded-[26px]" : "rounded-[28px]"} ${
        popular ? "lg:py-[calc(clamp(20px,3.2svh,26px)+clamp(0px,1.4svh,12px))]" : ""
      }`}
    >
      <h3 id={nameId} className="mb-[clamp(6px,1.4svh,12px)] text-xl font-medium leading-tight text-text">
        {plan.name}
      </h3>
      <PlanPrice plan={plan} />
      <p className="mt-1 text-sm font-normal leading-snug text-text-muted">{plan.tagline}</p>
      <Link
        href={plan.ctaHref}
        className={`${BUTTON_BASE} ${popular ? "bg-brand text-on-brand hover:bg-brand-hover" : "bg-secondary-subtle text-on-secondary-subtle hover:opacity-80"}`}
      >
        {plan.cta}
      </Link>
      <FeatureList features={plan.features} />
    </article>
  );
}

/**
 * The recommended plan sits in a lavender frame (34px radius, 4px padding) under a "Most Popular" header row.
 * No transforms: the frame is taller than its neighbours because the grid row spans.
 */
export function PlanCard({ plan }: { plan: Plan }) {
  if (plan.popular !== true) {
    return (
      <PlanPanel planKey={plan.key}>
        <Card plan={plan} inFrame={false} />
      </PlanPanel>
    );
  }
  return (
    <PlanPanel planKey={plan.key}>
      <div className="flex flex-1 flex-col rounded-[34px] border border-secondary/30 bg-secondary-subtle px-1 pb-1">
        <p
          id={`plan-${plan.key}-popular`}
          className="flex min-h-10 items-center justify-center gap-1.5 text-[15px] font-medium text-on-secondary-subtle"
        >
          <PricingIcon name="zap" className="size-3.5" />
          {POPULAR_LABEL}
        </p>
        <Card plan={plan} inFrame />
      </div>
    </PlanPanel>
  );
}
