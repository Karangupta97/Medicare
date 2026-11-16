import type { StaticImageData } from "next/image";
import hospitalRoom from "@/assets/image/hospitalbad.webp";
import nurse from "@/assets/image/nurse.webp";

/** Copied from the old About page: "Our Mission & Vision" heading and subtitle, and the Mission card. */
export interface StoryImage {
  src: StaticImageData;
  alt: string;
}

export const STORY = {
  headingStart: "Our ",
  headingAccent: "Mission",
  subtitle: "We're committed to making healthcare more accessible, transparent, and patient-centered.",
  paragraph:
    "At Medicare, we're dedicated to revolutionizing healthcare management by providing a seamless, secure, and user-friendly platform for managing medical records and healthcare services. We believe that everyone deserves access to efficient, transparent healthcare information.",
  points: [
    "Patient-centered approach in everything we do",
    "Implementing the highest security standards for your data",
    "Making healthcare accessible to everyone, everywhere",
  ],
  images: [
    { src: nurse, alt: "Healthcare Professional" },
    { src: hospitalRoom, alt: "Modern hospital room with a bed and patient monitor" },
  ] satisfies readonly StoryImage[],
} as const;
