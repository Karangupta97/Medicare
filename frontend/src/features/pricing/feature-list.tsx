import { PricingIcon } from "./pricing-icons";

/** Every feature of a plan: 14px, thin outlined circle-check in text-text-muted (the same on all cards). */
export function FeatureList({ features }: { features: readonly string[] }) {
  return (
    <ul className="mt-[clamp(14px,3.6svh,28px)] flex flex-col gap-[clamp(0px,0.4svh,3px)]">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5">
          <PricingIcon name="circle-check" strokeWidth={1.25} className="mt-[3px] size-3.5 shrink-0 text-text-muted" />
          <span className="min-w-0 break-words text-sm font-normal leading-[1.4] text-text">{feature}</span>
        </li>
      ))}
    </ul>
  );
}
