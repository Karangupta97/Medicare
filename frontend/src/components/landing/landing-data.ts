import type { LandingIconName } from "./landing-icons";

export interface FeatureItem {
  icon: LandingIconName;
  title: string;
  description: string;
}

export interface ServiceItem {
  icon: LandingIconName;
  title: string;
  desc: string;
  comingSoon?: boolean;
}

export interface SocialLink {
  icon: LandingIconName;
  href: string;
  label: string;
}

export const FEATURES: readonly FeatureItem[] = [
  {
    icon: "shield-check",
    title: "Secure & Certified",
    description:
      "Your medical data is encrypted and protected with the highest security standards. We comply with all healthcare privacy regulations.",
  },
  {
    icon: "device",
    title: "Accessible Anywhere",
    description:
      "Access your health records on any device, anytime, anywhere. Your medical history is always at your fingertips when you need it most.",
  },
  {
    icon: "cursor",
    title: "Easy to Use",
    description:
      "Our intuitive interface makes managing your healthcare simple. No technical expertise required—just sign up and get started.",
  },
  {
    icon: "users",
    title: "Connect with Healthcare Providers",
    description:
      "Seamlessly share your medical records with doctors and hospitals. Improve the quality of care with complete medical history access.",
  },
  {
    icon: "clock",
    title: "Time-Saving",
    description:
      "No more filling out the same forms repeatedly. Your information is readily available, saving time for both you and healthcare providers.",
  },
  {
    icon: "bolt",
    title: "Always Up-to-Date",
    description:
      "Our platform is continuously updated with the latest features and security measures to provide you with the best healthcare management experience.",
  },
];

export const VISION_POINTS: readonly string[] = [
  "Universal access to medical records anytime, anywhere",
  "Simplified communication between patients and providers",
  "Data-driven healthcare for personalized treatment plans",
  "Elimination of administrative barriers to quality care",
];

export const SERVICES: readonly ServiceItem[] = [
  {
    title: "Digital Health Records",
    desc: "Securely store and manage your medical records in one place, accessible anytime.",
    icon: "document",
  },
  {
    title: "Appointment Management",
    desc: "Schedule and manage your medical appointments with ease and receive reminders.",
    icon: "calendar",
    comingSoon: true,
  },
  {
    title: "Digital Prescription",
    desc: "Access and manage digital prescriptions securely, with automated reminders for medications and easy sharing with pharmacies.",
    icon: "flask",
  },
  {
    title: "Health Analytics",
    desc: "Get insights into your health data and trends to make informed decisions.",
    icon: "chart",
  },
];

export const FOUNDER_SOCIALS: readonly SocialLink[] = [
  { icon: "linkedin", href: "https://www.linkedin.com/in/karan-gupta-14a0a4260", label: "LinkedIn" },
  { icon: "github", href: "https://github.com/Karangupta97", label: "GitHub" },
  { icon: "mail", href: "mailto:karangupta3319@gmail.com", label: "Email" },
  { icon: "instagram", href: "https://www.instagram.com/karangupta.19/", label: "Instagram" },
];

export const ROLE_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital-staff", label: "Hospital Staff" },
  { value: "healthcare-admin", label: "Healthcare Admin" },
  { value: "medical-student", label: "Medical Student" },
  { value: "medical-store", label: "Medical Store" },
  { value: "other", label: "Other" },
];

export const BASE_URL = "https://www.medicares.in";
