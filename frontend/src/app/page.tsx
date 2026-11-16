import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer/footer";
import { ClosingCta } from "@/components/landing/closing-cta";
import { Hero } from "@/components/landing/hero";
import { MotionRoot, ScrollProgress } from "@/components/motion/primitives";
import { BASE_URL } from "@/components/landing/landing-data";
import { ReviewForm } from "@/components/landing/review-form";
import { Services } from "@/components/landing/services";
import { Team } from "@/components/landing/team";
import { Vision } from "@/components/landing/vision";
import { WhyChoose } from "@/components/landing/why-choose";

const OG_IMAGE = `${BASE_URL}/logo.png`;
const SHARE_TITLE = "Medicare - Healthcare Management Platform";
const SHARE_DESCRIPTION =
  "Access your medical records, find hospitals, and manage your healthcare journey with our secure platform.";

// Replaces react-helmet-async from the old page. The old theme-color meta (a hex value) is left out because
// raw hex is only allowed in globals.css (DESIGN.md section 3).
export const metadata: Metadata = {
  title: "Medicare",
  description:
    "Medicare is a secure healthcare platform connecting patients, doctors, and hospitals. Access medical records, find hospitals, and manage your healthcare journey efficiently.",
  keywords:
    "healthcare platform, medical records, hospital finder, digital health, patient care, healthcare management, hospital locator, medical reports",
  authors: [{ name: "Medicare" }],
  applicationName: "Medicare",
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: BASE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: "Medicare", statusBarStyle: "default" },
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [OG_IMAGE],
    url: BASE_URL,
    type: "website",
    siteName: "Medicare",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Medicares_india",
    creator: "@Medicares_india",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: { "mobile-web-app-capable": "yes" },
};

// Copied from the old page. TODO: confirm with the owner that the rating and review below are real before publishing,
// because search engines treat made-up review markup as spam.
const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Medicare",
    description:
      "A secure healthcare platform that connects patients, doctors, and hospitals, providing instant access to medical records and expert care.",
    url: BASE_URL,
    logo: OG_IMAGE,
    sameAs: ["https://twitter.com/Medicares_india", "https://instagram.com/medicaresindia"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      email: "support@medicares.in",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    address: { "@type": "PostalAddress", addressCountry: "IN" },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Medicare",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/find-hospital?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "Medicare Platform",
    image: OG_IMAGE,
    url: BASE_URL,
    description:
      "A comprehensive healthcare management platform providing digital health records and hospital finding services.",
    priceRange: "Free",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2000",
      bestRating: "5",
      worstRating: "1",
    },
    review: {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      author: { "@type": "Person", name: "Dr. Rajesh Sharma" },
      reviewBody:
        "Being a doctor in one of Delhi's busiest hospitals, Medicare has helped me access patient records efficiently. The platform is reliable and user-friendly even during peak hours.",
    },
  },
];

export default function Home() {
  return (
    <MotionRoot>
      <ScrollProgress />
      {STRUCTURED_DATA.map((data) => (
        <script
          key={data["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
      ))}
      <main id="main" className="w-full bg-page">
        <Hero />
        <WhyChoose />
        <Vision />
        <Services />
        <Team />
        <ClosingCta />
        <ReviewForm />
      </main>
      <Footer />
    </MotionRoot>
  );
}
