import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer/footer";
import { Comparison, FaqSection, FinalCta, PricingHero, TrustBadges } from "@/features/pricing/plan-sections";
import { PLANS, SEO } from "@/features/pricing/plans";

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: SEO.url },
  robots: { index: true, follow: true },
  openGraph: { type: "website", title: SEO.ogTitle, description: SEO.ogDescription, url: SEO.url },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: SEO.schemaName,
  url: SEO.url,
  description: SEO.schemaDescription,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: PLANS.map((plan) => ({
      "@type": "Offer",
      name: `${plan.name} Plan`,
      description: plan.tagline,
      price: String(plan.monthlyPrice),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: SEO.url,
    })),
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c") }}
      />
      <main id="main" className="w-full bg-page">
        <PricingHero />
        <Comparison />
        <TrustBadges />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
