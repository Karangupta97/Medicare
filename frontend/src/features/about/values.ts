import type { PricingIconName } from "@/features/pricing/pricing-icons";

/** Copied from the old About page: "Our Core Values". Icons are outline stand-ins for the old per-value icons. */
export interface ValueItem {
  icon: PricingIconName;
  title: string;
  desc: string;
}

export const VALUES = {
  headingStart: "Our Core ",
  headingAccent: "Values",
  subtitle: "The principles that guide everything we do at Medicare",
  items: [
    { icon: "shield", title: "Security", desc: "We prioritize the privacy and security of your medical data above all else." },
    { icon: "award", title: "Excellence", desc: "We strive for excellence in every aspect of our service and support." },
    { icon: "users", title: "Patient-Centric", desc: "Every feature we build is designed with patients' needs in mind." },
    { icon: "heart", title: "Compassion", desc: "We approach healthcare with empathy and understanding for all users." },
    { icon: "globe", title: "Accessibility", desc: "Making healthcare data available to everyone, whenever they need it." },
    { icon: "check-circle", title: "Integrity", desc: "We maintain the highest ethical standards in everything we do." },
  ] satisfies readonly ValueItem[],
} as const;
