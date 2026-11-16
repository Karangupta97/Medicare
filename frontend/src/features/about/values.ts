/** Copied from the old About page: "Our Core Values". The old per-value icons are not used (the cards are numbered). */
export interface ValueItem {
  title: string;
  desc: string;
}

export const VALUES = {
  headingStart: "Our Core ",
  headingAccent: "Values",
  subtitle: "The principles that guide everything we do at Medicare",
  items: [
    { title: "Security", desc: "We prioritize the privacy and security of your medical data above all else." },
    { title: "Excellence", desc: "We strive for excellence in every aspect of our service and support." },
    { title: "Patient-Centric", desc: "Every feature we build is designed with patients' needs in mind." },
    { title: "Compassion", desc: "We approach healthcare with empathy and understanding for all users." },
    { title: "Accessibility", desc: "Making healthcare data available to everyone, whenever they need it." },
    { title: "Integrity", desc: "We maintain the highest ethical standards in everything we do." },
  ] satisfies readonly ValueItem[],
} as const;
