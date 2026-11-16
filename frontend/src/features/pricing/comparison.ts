/** Comparison table copy, copied from the old page (PricingPage.jsx). */

export type ComparisonValue = string | boolean;

export interface ComparisonRow {
  name: string;
  free: ComparisonValue;
  pro: ComparisonValue;
  premium: ComparisonValue;
}

export const COMPARISON = {
  heading: "Compare all features",
  subtitle: "See exactly what's included in each plan to find the best fit for your needs.",
  featuresLabel: "Features",
  popularNote: "Popular",
  included: "Included",
  notIncluded: "Not included",
  rows: [
    { name: "Storage", free: "50 MB", pro: "500 MB", premium: "2 GB" },
    { name: "Health Records", free: "Basic", pro: "Full + Analytics", premium: "Full + Analytics" },
    { name: "Emergency Folder", free: "Limited", pro: true, premium: true },
    { name: "Digital Prescriptions", free: "Unlimited", pro: "Unlimited", premium: "Unlimited" },
    { name: "Prescription Reminders", free: false, pro: true, premium: true },
    { name: "Share Reports with Doctors", free: false, pro: true, premium: true },
    { name: "Family Vault Members", free: false, pro: "Up to 3 (1+2)", premium: "Up to 7 (1+6)" },
    { name: "AI Health Insights", free: false, pro: false, premium: true },
    { name: "Video Consultations", free: false, pro: false, premium: "Coming Soon" },
    { name: "Data Export (PDF/CSV)", free: false, pro: "Basic", premium: "Advanced" },
    { name: "Support Level", free: "Email", pro: "Priority", premium: "24/7 Priority" },
  ] satisfies readonly ComparisonRow[],
} as const;
