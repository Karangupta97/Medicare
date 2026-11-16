/**
 * Pricing content, copied from the old page (frontend-react/src/pages/User/PricingPage.jsx).
 * All copy and prices live here so the JSX holds none.
 */

export type BillingPeriod = "monthly" | "annual";
export type PlanKey = "free" | "pro" | "premium";
export type IconName =
  | "heart"
  | "zap"
  | "star"
  | "shield"
  | "upload-cloud"
  | "users"
  | "activity"
  | "arrow-right"
  | "chevron-down";

export interface Plan {
  key: PlanKey;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  /** Discount shown on annual billing (the old page's "30% OFF" badge). */
  savePct?: number;
  icon: IconName;
  popular?: boolean;
  cta: string;
  /** TODO: wire auth later. The old page opened Razorpay checkout for signed-in users and sent others to /login. */
  ctaHref: string;
  features: readonly string[];
}

export const PLANS: readonly Plan[] = [
  {
    key: "free",
    name: "Free",
    tagline: "Get started with essentials",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: "heart",
    cta: "Get Started Free",
    ctaHref: "/signup", // TODO: wire auth later
    features: [
      "50 MB cloud storage",
      "Basic health records",
      "Emergency folder (limited)",
      "Email support",
      "Unlimited digital prescriptions",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    tagline: "For individuals who want more",
    monthlyPrice: 11,
    annualPrice: 92,
    savePct: 30,
    icon: "zap",
    popular: true,
    cta: "Buy Pro Plan",
    ctaHref: "/login", // TODO: wire auth later
    features: [
      "500 MB cloud storage",
      "Full health records & analytics",
      "Emergency folder (full)",
      "Priority email & chat support",
      "Unlimited digital prescriptions",
      "Prescription reminders",
      "Share reports with doctors",
      "Family Vault — up to 3 members (1+2)",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    tagline: "Complete family healthcare",
    monthlyPrice: 399,
    annualPrice: 3112,
    savePct: 35,
    icon: "star",
    cta: "Go Premium",
    ctaHref: "/login", // TODO: wire auth later
    features: [
      "Everything in Pro + 2 GB storage",
      "Family Vault — up to 7 members (1+6)",
      "AI health insights & trends",
      "Video consultations (coming soon)",
      "Dedicated account manager",
      "Advanced data export (PDF/CSV)",
      "Priority 24/7 support",
      "Early access to new features",
    ],
  },
];

export const INTRO = {
  badge: "Transparent Pricing",
  headingStart: "Choose the ",
  headingAccent: "right plan",
  headingEnd: " for you",
  subtitle:
    "Start for free, upgrade when you need to. All plans include secure cloud storage and access to your medical records anytime, anywhere.",
  monthlyLabel: "Monthly",
  annualLabel: "Annual",
  billingLabel: "Billing period",
} as const;

/** Largest annual discount, shown beside "Annual" ("Save up to 35%"). */
export const MAX_SAVE_PCT: number = Math.max(...PLANS.map((plan) => plan.savePct ?? 0));

export const PLAN_SELECTOR_LABEL = "Choose a plan";

export const POPULAR_LABEL = "Most Popular";

export const PERIOD_LABEL: Record<BillingPeriod, string> = {
  monthly: "/month",
  annual: "/year",
};

export const FREE_PRICE_LABEL = "Free";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return inr.format(amount);
}

/** Currency symbol and digits of a formatted price, so the symbol can be styled apart from the number. */
export function formatPriceParts(amount: number): { symbol: string; number: string } {
  const parts = inr.formatToParts(amount);
  const symbol = parts.filter((part) => part.type === "currency").map((part) => part.value).join("");
  const number = parts.filter((part) => part.type !== "currency").map((part) => part.value).join("");
  return { symbol, number };
}

export function planPrice(plan: Plan, billing: BillingPeriod): number {
  return billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
}

/** Struck-through price on annual billing: twelve months at the monthly price (as on the old page). */
export function originalAnnualPrice(plan: Plan): number {
  return plan.monthlyPrice * 12;
}

export interface TrustItem {
  icon: IconName;
  title: string;
  desc: string;
}

export const TRUST_ITEMS: readonly TrustItem[] = [
  { icon: "shield", title: "Secure & Private", desc: "End-to-end encrypted" },
  { icon: "upload-cloud", title: "Cloud Storage", desc: "Access from anywhere" },
  { icon: "users", title: "Family Vault", desc: "Manage for loved ones" },
  { icon: "activity", title: "Health Insights", desc: "AI-powered analytics" },
];

export const FINAL_CTA = {
  headingStart: "Ready to take control of your ",
  headingAccent: "health records",
  headingEnd: "?",
  body: "Join thousands of patients who trust Medicare to store, manage, and share their medical records securely.",
  primary: { label: "Get Started Free", href: "/signup" }, // TODO: wire auth later
  secondary: { label: "Learn More", href: "/about" }, // TODO: confirm route (the old page linked here)
} as const;

export const SEO = {
  title: "Pricing Plans | Medicare - Affordable Health Coverage India",
  description: "Explore Medicare pricing plans starting at INR 0/month. Transparent pricing for individuals and families.",
  ogTitle: "Pricing | Medicare",
  ogDescription: "Affordable health plans with clear pricing. Choose the right plan for you.",
  url: "https://www.medicares.in/pricing",
  schemaName: "Pricing - Medicare",
  schemaDescription: "Affordable Medicare health plans with transparent pricing. Choose the plan that fits your needs.",
} as const;
