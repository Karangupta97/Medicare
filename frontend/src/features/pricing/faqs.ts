/** FAQ copy, copied verbatim from the old page (PricingPage.jsx). */

export interface Faq {
  q: string;
  a: string;
}

export const FAQ = {
  heading: "Frequently asked questions",
  contactLead: "Can't find what you're looking for? ",
  contactLabel: "Contact us",
  contactHref: "/about", // TODO: confirm route (the old page linked here)
  items: [
    {
      q: "Can I switch plans at any time?",
      a: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get instant access to new features. When downgrading, your current plan benefits remain active until the end of your billing cycle.",
    },
    {
      q: "Is there a free trial for paid plans?",
      a: "We offer a 14-day free trial for the Pro plan so you can explore all features before committing. No credit card required to start.",
    },
    {
      q: "How does the Family Vault work?",
      a: "Family Vault lets you manage medical records for your family members under one account. The head member can invite family members via their UMID, and each member's data remains private and secure with OTP-verified access.",
    },
    {
      q: "Are my medical records secure?",
      a: "Absolutely. We use end-to-end encryption, secure cloud storage (AWS S3), and comply with healthcare data protection standards. Your data is never shared without your explicit consent.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets. All payments are processed securely through Razorpay.",
    },
    {
      q: "Can I cancel my subscription?",
      a: "Yes, you can cancel anytime from your account settings. You'll continue to have access to your paid features until the end of your current billing period.",
    },
  ] satisfies readonly Faq[],
} as const;
