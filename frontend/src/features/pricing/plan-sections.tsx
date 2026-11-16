import Link from "next/link";
import { CtaBanner } from "@/components/cta-banner";
import { PricingIcon } from "./pricing-icons";
import { BillingProvider } from "./billing-context";
import { BillingToggle } from "./billing-toggle";
import { PlanCard } from "./plan-card";
import { PlanTabs } from "./plan-tabs";
import { COMPARISON } from "./comparison";
import { ComparisonTable } from "./comparison-table";
import { FaqAccordion } from "./faq-accordion";
import { FAQ } from "./faqs";
import { FINAL_CTA, INTRO, PLANS, TRUST_ITEMS } from "./plans";
import { SectionHeading } from "./section-heading";

/**
 * The pricing frame: badge, headline, subtitle, billing toggle and plan cards. Sizes stay fixed (never below 14px);
 * vertical gaps compress with svh-based clamp() so it fits typical laptop heights, and the page scrolls on shorter ones.
 * From lg the cards sit in a 3 x 3 grid (rows 1fr / auto / 1fr) so Pro extends above and below its neighbours;
 * below lg a Free | Pro | Premium selector shows one card.
 */
export function PricingHero() {
  return (
    <BillingProvider>
      <section
        aria-labelledby="pricing-title"
        className="container-custom flex min-h-[calc(100svh-var(--navbar-h))] flex-col items-center justify-center pt-[clamp(8px,1.5svh,16px)] pb-bottom-bar lg:pb-[clamp(8px,2svh,24px)]"
      >
        <div className="flex max-w-full flex-col items-center text-center">
          <h1
            id="pricing-title"
            className="text-fluid-display font-medium text-text sm:whitespace-nowrap"
          >
            {INTRO.headingStart}
            {INTRO.headingAccent}
            {INTRO.headingEnd}
          </h1>
          <p className="mt-[clamp(8px,1.8svh,14px)] max-w-[450px] text-sm font-normal leading-normal text-text-muted sm:text-[15px]">
            {INTRO.subtitle}
          </p>
          <div className="mt-[clamp(14px,4.6svh,36px)]">
            <BillingToggle />
          </div>
        </div>
        <div className="mt-[clamp(12px,2.4svh,20px)] w-full lg:hidden">
          <PlanTabs />
        </div>
        <h2 className="sr-only">Pricing plans</h2>
        <div className="mx-auto mt-[clamp(12px,3.2svh,32px)] grid w-full max-w-[26rem] grid-cols-1 lg:max-w-[1000px] lg:grid-cols-3 lg:grid-rows-[1fr_auto_1fr] lg:gap-x-5">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </div>
      </section>
    </BillingProvider>
  );
}

const SECTION_GAP = "mt-[clamp(64px,9svh,112px)]";

export function Comparison() {
  return (
    <section aria-labelledby="comparison-title" className={`${SECTION_GAP} mx-auto w-full max-w-[960px] px-4 sm:px-6`}>
      <SectionHeading id="comparison-title" title={COMPARISON.heading}>
        {COMPARISON.subtitle}
      </SectionHeading>
      <ComparisonTable />
    </section>
  );
}

/** Quiet strip: hairline lines above and below, centered outline icons, no tiles or hover effects. */
export function TrustBadges() {
  return (
    <section aria-label="Why Medicare" className={`${SECTION_GAP} mx-auto w-full max-w-[960px] px-4 sm:px-6`}>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 border-y border-border py-10 md:grid-cols-4">
        {TRUST_ITEMS.map((item) => (
          <li key={item.title} className="flex flex-col items-center text-center">
            <PricingIcon name={item.icon} strokeWidth={1.5} className="mb-3 size-[22px] text-text-muted" />
            <h3 className="text-[15px] font-medium text-text">{item.title}</h3>
            <p className="mt-1 text-sm font-normal text-text-muted">{item.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className={`${SECTION_GAP} mx-auto w-full max-w-[720px] px-4 sm:px-6`}>
      <SectionHeading id="faq-title" title={FAQ.heading}>
        {FAQ.contactLead}
        <Link
          href={FAQ.contactHref}
          className="inline-flex min-h-11 items-center text-brand hover:underline focus-visible:underline"
        >
          {FAQ.contactLabel}
        </Link>
      </SectionHeading>
      <FaqAccordion items={FAQ.items} />
    </section>
  );
}

/** Closing banner (shared CtaBanner). The old secondary "Learn More" link is not rendered. */
export function FinalCta() {
  return (
    <CtaBanner
      id="final-cta-title"
      heading={`${FINAL_CTA.headingStart}${FINAL_CTA.headingAccent}${FINAL_CTA.headingEnd}`}
      body={FINAL_CTA.body}
      href={FINAL_CTA.primary.href}
      label={FINAL_CTA.primary.label}
    />
  );
}
