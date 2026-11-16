import type { StaticImageData } from "next/image";
import founder from "@/assets/image/founder-image/Self.webp";

/**
 * The old About page has no team section. This is the existing landing-page "Meet Our Team" content
 * (frontend/src/components/landing/team.tsx, ported from the old Home page): one member.
 */
export interface TeamMember {
  name: string;
  role: string;
  photo: StaticImageData;
  photoAlt: string;
  /** Existing bio from the landing "Meet Our Team" card. */
  bio?: string;
  highlighted?: boolean;
}

export const TEAM = {
  headingStart: "Meet Our ",
  headingAccent: "Team",
  subtitle: "The passionate minds behind Medicare's mission to revolutionize healthcare management",
  members: [
    {
      name: "Karan Gupta",
      role: "Founder & CEO of Medicare",
      photo: founder,
      photoAlt: "Karan Gupta - Founder & CEO",
      bio: "Passionate about healthcare technology and committed to creating innovative solutions that improve patient care and medical record management. Specialized in building secure, scalable, and user-friendly healthcare applications.",
      highlighted: true,
    },
  ] satisfies readonly TeamMember[],
} as const;
