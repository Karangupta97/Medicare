# Implementation Report

The original report (.kiro/specs/design-system-dark-mode/IMPLEMENTATION_REPORT.md) is deleted in the working tree, so this file holds only Step G.

## Step G: Navbar port (frontend-react to frontend)

### Source files (frontend-react/src)
| File | Lines | Ported |
| :--- | ---: | :--- |
| components/Navbar.jsx | 626 | yes |
| components/User/LogoutModal.jsx | 63 | yes |
| store/Patient/authStore.js | 637 | no (auth logic) |
| store/Patient/patientstore.js | 926 | no (API/notifications) |
| assets/Logo/Whitebgtextlogo.jpg, assets/user.png | n/a | replaced by frontend/src/assets/logo/medicare-logo-full-on-{light,dark}.svg |
| index.css (nav-link, mobile-nav-link, btn) | n/a | already in globals.css |

### New files (frontend/src/components/layout/navbar/)
navbar.tsx (382, client), navbar-data.ts (83), icons.tsx (112, server-safe), profile-picture.tsx (43, client), logout-modal.tsx (77, client). Edited: src/app/layout.tsx (Navbar + placeholder user), src/app/globals.css (two utilities, logo-for-light and logo-for-dark), DESIGN.md.

### Conversions
1. JSX to strict TypeScript, typed props, no any.
2. react-router Link to next/link, useLocation/useNavigate to usePathname/useRouter. aria-current="page" from usePathname (same isActive rule as the old file: "/" exact, others by prefix, so /dashboard/upload also marks Dashboard).
3. "use client" on navbar, profile-picture, logout-modal only. icons.tsx and navbar-data.ts have none.
4. Logo: next/image, two images swapped by logo-for-light / logo-for-dark. Avatar: next/image with unoptimized.
5. Colors: gray/blue/red/hex/white to tokens (bg-surface, text-text, text-text-muted, border-border, bg-brand, text-brand, bg-danger, bg-danger-subtle, bg-overlay/50, hover:bg-surface-muted). Login button is btn btn-primary rounded-full. Dropdown items use menu-item. Shadow of the bottom bar is color-mix of --sem-text at 5%.
6. Icons: react-icons/fi is not installed, so the same Feather icons are inline SVG.
7. framer-motion is not installed: replaced with CSS transitions (opacity/translate/scale, motion-reduce:transition-none). Dropdown, modal and slide-in menu keep enter and exit animation. Lost: the shared layoutId slide of the bottom-bar indicator (now appears in place).
8. font-semibold on desktop links became font-bold (owner rule: weights 400/500/700/900 only). The old font-[Montserrat Alternates] was an invalid value and is now font-sans.
9. Auth: NavbarUser { name, avatarUrl, notificationCount, email? } prop. Added optional email because the old menu showed it. Logout confirm does router.push("/") only.
10. Old motion.nav outer element became a div (it nested a nav in a nav); inner navs have aria-labels.
11. Old avatar default image user.png (not in frontend assets) is dropped: no avatarUrl shows the old initial-on-gradient fallback.
12. Old icon-button state (open menus) closes on route change by comparing the open pathname, not an effect.

### Rule fixes (old look kept)
- 44px targets: avatar button (40 to 44 wrapper), bell, logo links, drawer close button, Login buttons (min-h-11 via btn), dropdown items (menu-item).
- aria-expanded, aria-controls, aria-haspopup on both avatar buttons. aria-label on icon-only controls.
- Escape closes avatar menu (focus returns to its button), slide-in menu and logout modal. Outside click closes the avatar menu. Logout modal got role="dialog", aria-modal, focus to Cancel.
- Visible focus comes from the global :focus-visible rule.

### TODO: wire auth later
layout.tsx (PLACEHOLDER_USER), navbar.tsx (logout confirm, both Login hrefs), profile-picture.tsx (avatar host, photo cache-busting, default image).

### Open items
- The old slide-in menu (Services, Profile links) has no control that opens it (setIsMenuOpen(true) is never called). It is ported but unreachable, so no menu button with aria-expanded exists for it.
- medicare-logo-full-on-dark.svg draws a filled navy rectangle behind the logo, visible on the dark navbar background.

## Step J: Pricing page (/pricing)
### Files added
- src/app/pricing/page.tsx (server component: metadata, canonical, Open Graph, JSON-LD from the old page).
- src/features/pricing/plans.ts: all copy and prices (plans, intro, comparison rows, trust items, FAQ, final CTA, SEO) plus formatPrice (Intl.NumberFormat en-IN, INR, 0 decimals), planPrice, originalAnnualPrice (monthly x 12, as on the old page).
- src/features/pricing/plan-sections.tsx (PricingHero, Comparison, TrustBadges, FaqSection, FinalCta, all server), plan-card.tsx (server), pricing-icons.tsx (inline SVG).
- Client components: billing-context.tsx (provider, annual default as before), billing-toggle.tsx (radiogroup), plan-price.tsx (price display).
- globals.css: added text-fluid-display, text-fluid-price, animate-price-in (200 ms ease-out, off under reduced motion).
- DESIGN.md Components table: Pricing card, Pricing toggle, Most Popular frame.
### Token mapping
- Page bg-page; cards bg-surface, border-border, shadow-xs; recommended frame bg-secondary-subtle with border-secondary, label text-on-secondary-subtle.
- h1 text-text with "right plan" in text-brand; subtitle text-text-muted.
- Icon tiles: Free bg-surface-muted text-text-muted, Pro bg-brand text-on-brand, Premium bg-accent-subtle text-on-accent-subtle.
- Prices text-text, struck price text-text-muted, discount and "Save up to" badges status-badge-success (bg-success-subtle text-success).
- Check icons: Free and Pro text-brand, Premium text-accent. CTAs: Pro btn-primary, Free and Premium btn-secondary.
- No gradients, hex or dark: utilities. Comparison, trust and FAQ sections use the same surface, border and muted tokens. The closing CTA panel is bg-brand with text-on-brand (the old page used a gradient).
### Decisions and differences
- The reference screenshot was not available to me; the layout follows the written description.
- The "Save up to 35%" badge is always visible (the old page showed it only on Annual), so the toggle does not change width.
- FAQ uses native details/summary instead of the old JS accordion; the comparison table stacks into per-row cards below md instead of the old show/hide button and horizontal scroll. Both need no client JS.
- Old amber/violet highlights ("health records", Premium column) now use brand/underline and neutral tokens.
- Navbar: the existing Pricing link already gets aria-current="page" on /pricing (startsWith match), so no navbar edit was needed.
- Not ported: Razorpay checkout, auth checks, toasts, Helmet robots/googlebot and og:image tags.
### One-frame layout (Step J-fix)
- The frame (badge, h1, subtitle, billing toggle, plan cards) is one section with min-height calc(100svh - var(--navbar-h)), flex column, vertically centered. --navbar-h is declared in globals.css (64px, 72px from lg) and the navbar's inner bar has min-height var(--navbar-h). Gaps use clamp(8px, 1.6svh, 20px). Below lg the section also keeps the bottom-bar padding (pb-bottom-bar).
- Headline: clamp(1.75rem, 1rem + 2.6vw, 2.75rem), line-height 1.1, one line from sm. Subtitle text-sm (lg: text-base), max 64ch. The toggle and "Save up to 35%" share one row.
- lg and up: three compact cards side by side. Pro's raise is a -8px translate (no extra layout height); its tab is 32px.
- Below lg: a Free | Pro | Premium tablist (default Pro) shows one card at a time. The three panels share one grid cell, so the area keeps the tallest card's height; the others are invisible and fade (150 ms ease-out).
- Short screens: custom variant `fold` (viewport under 784px tall, or below lg and under 896px tall) shows the first 5 features and a 44px "+N more features" button (aria-expanded, aria-controls). Taller screens show every feature. Free has exactly 5 features, so it has no button.
- No overflow-hidden on the frame; if content cannot fit (extreme zoom) the page scrolls. Not run (per request): lint, tests, build, browser checks, so the "fits one screen" claim is unmeasured.
### Polish pass (Step J-polish)
- Replaces the one-frame notes above where they differ: the `fold` variant and height-based feature collapse are removed. Every card now shows 5 features and a "View all N features" button (Free has exactly 5, so no button).
- lg and up: max-width 1120px, three equal cards, 24px gap, rounded-2xl (approved for pricing cards only). The grid has four rows and each card spans them with subgrid (header, price, CTA, features), so names, prices, CTAs and dividers align; the discount row keeps its height on every card.
- Pro is one card (2px border-secondary, shadow-md, label strip attached above its top edge, -8px transform). The grid reserves the strip height at the top.
- Toggle and phone plan selector share one soft segmented style (segmented.ts); the save badge sits inside the Annual option.
- Price: 36 to 56px numerals (clamp with svh and vw), tabular-nums, symbol and period 15px muted on the baseline. Price fade is 150 ms ease-out.
- Deviations: weights use 700 where the brief said 600; the subtitle is limited to 56ch below lg and runs full width from lg (its 140 characters cannot fit one line in 56ch); the headline is 700 (was 900).
- Fit estimate (not measured): desktop 700px tall comes to roughly 15 to 30px over the available height, so it may scroll slightly there; taller desktops fit. Phones in portrait are likely over the available height by roughly 60 to 100px, because the header, selector, strip and a 5-feature card are taller than 100svh minus navbar and bottom bar. Verify and tell me which sizes to compress.
### Reference rebuild (supersedes the two layout notes above)
- The reference screenshot was not visible to me again; I built from the measurements in the brief, so compare it against the image.
- Airy look: no card borders, shadows, dividers or arrow icons; the "View all features" expander and the 2px Pro border are removed; every feature shows. Plan icon tiles are gone (the reference has none); plans.ts still carries the icon field.
- Cards: 28px radius (documented as the pricing-card exception), 26px padding (20px on short screens), left-aligned. Weights are 400 and 500 only in this section.
- Desktop grid (lg+): max-width 1000px, three columns with a 20px gap, rows 1fr/auto/1fr. Free and Premium sit in the middle row (equal height, centered); Pro spans all rows inside a lavender frame (34px radius) with a "Most Popular" header. The overhang is whatever the Pro content adds (header row plus a little extra padding), roughly 25 to 35px each side, not the reference's 50px, because Pro and Premium both have 8 features.
- Header: badge (secondary-subtle), single-colour 500-weight headline (no brand-colored "right plan"), 450px subtitle, soft toggle with the save pill inside Annual. Annual stays the default billing, so the discount row shows on load.
- Fit: font sizes are fixed; gaps use svh clamps. My estimate is that it fits viewports about 790px tall and up (including the navbar); shorter ones scroll. Not measured.
- Pill buttons use their own classes instead of btn-primary/btn-secondary (the system buttons are rounded-xl with a border).
### Sections below the cards (minimal restyle)
- Copy, rows, values, questions, answers and links are unchanged. Data moved out of plans.ts into comparison.ts and faqs.ts (FAQ answers are verbatim from the old page; none were missing).
- Shared SectionHeading (h2 28 to 36px/500, muted subtitle, 40px to content) and section gaps of clamp(64px, 9svh, 112px). Widths: table 960px, trust strip 960px, FAQ 720px, banner 960px.
- Table: one white card with a sticky header and a tinted Pro column; below md a plan selector (new shared plan-selector.tsx, also used by the card tabs) with a two-column list instead of sideways scrolling. The mobile list is three tabpanels, so the table is rendered twice in the DOM (one hidden per breakpoint).
- Trust strip: hairline-separated, no tiles. FAQ: native-button accordion (client), none open at first. Banner: one button; the old secondary "Learn More" link is still in FINAL_CTA data but is no longer rendered, and the old amber/underline highlight on "health records" is gone.
- Not run (per request): lint, tests, build, browser checks.
### TODO
- Wire auth later: Free CTA /signup; Pro and Premium CTAs /login (old page opened Razorpay checkout for signed-in users); final CTA /signup.
- Confirm /aboutus route (FAQ "Contact us" and "Learn More"), og:image, and whether the old Pro price (11) is correct versus 399 for Premium.
- Not run (per request): lint, tests, build, browser checks.

## About page (/about)
### Files added or changed
- src/app/about/page.tsx (server component, metadata). Navbar needed no code change for the active state: isActivePath("/about") already sets aria-current. I changed every internal "/aboutus" link to "/about" (navbar-data.ts x3, footer.tsx, landing why-choose.tsx, pricing plans.ts and faqs.ts). The old route name was /aboutus; nothing redirects it yet.
- src/features/about/: about-sections.tsx (server), dithered-stage.tsx (client), team-carousel.tsx (client), medicare-mark.tsx, mark-paths.ts, and data files hero.ts, story.ts, vision.ts, values.ts, faqs.ts, team.ts.
- src/components/landing/dithered-logo/dithered-logo.tsx (generated component, adapted), src/components/cta-banner.tsx (shared closing banner, now also used by Pricing), src/lib/utils.ts (hand-written cn(), recreated because src/lib was empty), components.json (recreated, @componentry registry), public/medicare-mark-dither.svg.
- faq-accordion.tsx (pricing) now takes an items prop and is reused for the About FAQ.
### Dependencies and install
- `npx shadcn@latest add @componentry/dithered-logo -o -y` created only src/components/ui/dithered-logo.tsx (moved and edited). package.json, the lockfile and globals.css were unchanged. The docs list clsx and tailwind-merge as dependencies; I did not install them because the component only needs cn(), which is the hand-written helper.
- License: the registry file has no license header. The docs say it is inspired by various open-source patterns and to verify licenses before production use. A comment in the component records this.
- Changes to the component: devicePixelRatio capped at 2, touch-action pan-y (was none), `interactive` prop (false = no cursor or ripples), onReady and onError callbacks (the original only logged errors), aria-hidden canvas, root classes no longer fixed to h-60 w-60 when className is given.
### Dither mark
- public/medicare-mark-dither.svg: black rounded cross with two white leaves on a transparent background, traced from the icon SVG (cross from its clip path, leaves from the two leaf paths); no wordmark, tile or clip paths. The same paths (mark-paths.ts) draw the static fallback, with the leaves cut out through a mask.
- Settings: invert on, threshold 180, blur 2, scale 0.7, gridSize 160 from sm and 120 below (matchMedia hook, server snapshot false, canvas is client-only so there is no hydration mismatch). I could not view the result, so the silhouette is untested; adjust blur and threshold first if it looks muddy.
- Stage is mounted only near the viewport (IntersectionObserver, 200px margin) and while the tab is visible; static mark with reduced motion, until ready, and on error (error boundary plus onError). "Medicare" stays real text under the stage.
### Content mapping (source: frontend-react/src/pages/About.jsx, route /aboutus)
- Hero "About us": title is the page label; lead is the old hero paragraph; the two old hero buttons (Join Medicare, Explore Features) are kept as pills (TODO: wire auth later).
- Our story slot: titled "Our Mission" with the old "Our Mission & Vision" subtitle, the old Mission paragraph and its three points. Photos: the old page's nurse image and the hospital-room image already in frontend/ (two images, both portrait, shown as two in a row).
- What sets us apart slot: titled "Our Vision" with the dithered stage and the old Vision paragraph.
- Values: the six old Core Values, numbered; the old icons are dropped.
- Quote: the old Vision card's quote, with no attribution (the old page had none).
- Team: the old About page has no team. I used the existing landing "Meet Our Team" content (Karan Gupta, Founder & CEO of Medicare, existing photo); with one member the carousel buttons stay hidden because nothing overflows.
- Added in the same visual language (old page has it, reference does not): FAQ (4 questions, verbatim) with the pricing accordion.
- Closing banner: the Pricing page copy and component (the old About page has no closing copy). TODO: wire auth later.
### Omitted (no old content)
- "Why brands choose us", "Industries and clients we serve", a third story photo, and a team beyond the founder. The old stats block is commented out in the old file, so it is not ported. About2.jsx (/aboutus2) was not used.
### Not done
- Not run (per request): lint, tests, build, browser checks. Photo-circles in the hero were skipped.
