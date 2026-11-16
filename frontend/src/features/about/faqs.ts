import type { Faq } from "@/features/pricing/faqs";

/** Copied verbatim from the old About page ("Frequently Asked Questions"). */
export const ABOUT_FAQ = {
  headingStart: "Frequently Asked ",
  headingAccent: "Questions",
  subtitle: "Common questions about Medicare and our services",
  items: [
    {
      q: "How secure is my medical data on Medicare?",
      a: "Medicare employs bank-level encryption to ensure your medical data is completely secure. We implement advanced security measures including end-to-end encryption, regular security audits, and strict access controls.",
    },
    {
      q: "Can I share my medical records with my doctor?",
      a: "Yes, Medicare makes it easy to share your medical records with healthcare providers. You can grant temporary or permanent access to specific doctors or healthcare facilities, and revoke access at any time.",
    },
    {
      q: "Is Medicare available on mobile devices?",
      a: "Medicare is fully responsive and works perfectly on any mobile device. We also offer dedicated mobile apps for iOS and Android that provide additional features like offline access and push notifications.",
    },
    {
      q: "How do I upload my existing medical reports?",
      a: "You can easily upload your existing medical reports through our user-friendly interface. Simply navigate to the Upload section, select your files, add relevant details, and submit. We support various file formats including PDF, JPEG, and DICOM.",
    },
  ] satisfies readonly Faq[],
} as const;
