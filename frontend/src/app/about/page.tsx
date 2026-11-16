import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/layout/footer/footer";
import {
  AboutFaq,
  MilestonesTimeline,
  MissionSection,
  QuoteSection,
  StatsStrip,
  TeamSection,
  ValuesSection,
  VisionSection,
} from "@/features/about/about-sections";
import { AboutHeroScene } from "@/features/about/hero-scene";
import { DitheredStage } from "@/features/about/dithered-stage";
import { ABOUT_HERO } from "@/features/about/hero";
import { MotionRoot, ScrollCurve, ScrollProgress } from "@/features/about/motion";
import { FINAL_CTA } from "@/features/pricing/plans";

export const metadata: Metadata = {
  title: "About Us | Medicare",
  description: ABOUT_HERO.lead,
};

export default function AboutPage() {
  return (
    <MotionRoot>
      <ScrollProgress />
      <main id="main" className="w-full bg-page">
        {/* Logo panel background, commented out to preview: className="bg-hero-from/60 text-on-hero" */}
        <AboutHeroScene stage={<DitheredStage className="text-on-hero" />} />
        <ScrollCurve>
          <StatsStrip />
          <MissionSection />
          <VisionSection />
          <ValuesSection />
          <MilestonesTimeline />
          <QuoteSection />
          {/* TODO: wire auth later (signup route); copy is the Pricing page banner. Placed after the quote, before Team. */}
          <CtaBanner
            id="about-cta-title"
            heading={`${FINAL_CTA.headingStart}${FINAL_CTA.headingAccent}${FINAL_CTA.headingEnd}`}
            body={FINAL_CTA.body}
            href={FINAL_CTA.primary.href}
            label={FINAL_CTA.primary.label}
            spacing="pt-[clamp(72px,9vw,128px)]"
            bottomSpace={false}
          />
          <TeamSection />
          <AboutFaq />
        </ScrollCurve>
      </main>
      <Footer />
    </MotionRoot>
  );
}
