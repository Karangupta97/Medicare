import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/layout/footer/footer";
import {
  AboutFaq,
  AboutHero,
  QuoteSection,
  StorySection,
  TeamSection,
  ValuesSection,
  VisionSection,
} from "@/features/about/about-sections";
import { ABOUT_HERO } from "@/features/about/hero";
import { FINAL_CTA } from "@/features/pricing/plans";

export const metadata: Metadata = {
  title: "About Us | Medicare",
  description: ABOUT_HERO.lead,
};

export default function AboutPage() {
  return (
    <>
      <main id="main" className="w-full bg-page">
        <AboutHero />
        <StorySection />
        <VisionSection />
        <ValuesSection />
        <QuoteSection />
        <TeamSection />
        <AboutFaq />
        {/* TODO: wire auth later (signup route); copy is the Pricing page banner */}
        <CtaBanner
          id="about-cta-title"
          heading={`${FINAL_CTA.headingStart}${FINAL_CTA.headingAccent}${FINAL_CTA.headingEnd}`}
          body={FINAL_CTA.body}
          href={FINAL_CTA.primary.href}
          label={FINAL_CTA.primary.label}
        />
      </main>
      <Footer />
    </>
  );
}
