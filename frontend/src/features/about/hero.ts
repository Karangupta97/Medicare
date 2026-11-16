/** Copied from the old About page (frontend-react/src/pages/About.jsx), hero section. */
export const ABOUT_HERO = {
  /** Brand name from the old About2 page heading ("About Medicare"). */
  eyebrow: "About Medicare",
  title: "About us",
  lead: "At Medicare, we're on a mission to transform healthcare through technology, placing patients at the center of their medical journey with security, transparency, and ease of access.",
  // TODO: wire auth later (old links: /signup and /dashboard)
  primary: { label: "Join Medicare", href: "/signup" },
  secondary: { label: "Explore Features", href: "/dashboard" },
} as const;
