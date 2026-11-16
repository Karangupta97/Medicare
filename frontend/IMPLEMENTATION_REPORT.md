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

### About page redesign (editorial layout; supersedes the layout notes above)
- Copy and imagery are unchanged. Structure: split hero (title, lead and the two buttons left; dithered stage right; hero tokens with glows; concave bottom curve; min-height min(88svh, 760px)), then 01 Mission, 02 Vision, 03 Values, quote, 04 Team, 05 Questions, closing banner. Eyebrows are 12px uppercase text-secondary. Headings are left-aligned and sticky from lg where they sit in a two-column grid.
- Mission: existing paragraph at 20 to 24px, the three commitments as hairline rows with check icons, two photos (nurse 4:5, hospital 4:3) in rounded-2xl frames with a hero-token overlay (bg-hero-from/15), overlapping on desktop and about 40px of parallax each.
- Vision: the existing paragraph as one statement; words fade from 25% to full opacity as it scrolls.
- Values: bg-surface-muted band with curved top and bottom (shared CurveDivider), cards with outline icons (shield, award, users, heart, globe, check-circle as stand-ins for the old icons) and the specified hover.
- Quote: the existing quote with a decorative quote mark; attribution is Karan Gupta, Founder & CEO of Medicare (added at the owner's request; the old page gave the quote no attribution).
- Team: data-driven. One member renders the founder feature (photo, name, role and the existing landing bio); three or more render a card grid. The earlier carousel was removed (team-carousel.tsx deleted).
- FAQ: Pricing accordion in a two-column layout (sticky heading left). Closing banner: shared CtaBanner.
- New: src/components/curve-divider.tsx, src/lib/motion.ts (expo-out [0.22, 1, 0.36, 1], ease-in-out [0.65, 0, 0.35, 1], 0.8s reveals, 0.9s image reveals, 0.25s hover, 0.08s stagger; no springs), src/features/about/motion.tsx (LazyMotion with domAnimation and m components: MotionRoot, Reveal, RevealLines, ImageFrame, ScrollProgress, ScrollCurve, PullStatement). Client components on this page: those wrappers, the dithered stage and the accordion.
- Motion behavior: the server HTML is plain and visible. After hydration each element arms itself, hides, and animates once at 20% in view (opacity, transform, clip-path only). A 2px bg-brand progress bar sits at the very top of the viewport (the navbar scrolls away, so there is nothing to sit under). A 1px curved line draws itself beside the content from md. Reduced motion: no animation, parallax, word fading, path drawing or canvas; everything is visible.
- Owner-approved exception: durations up to 0.9s for large and image reveals (the system limit is 600 ms). Documented in motion.ts.
- Dither tuning: the source SVG now fills the cross with a dark-to-mid gray diagonal gradient, so error diffusion produces a stippled density gradient instead of a solid fill (the previous pure-black cross filled every cell). Settings: gridSize 190 (130 on phones), scale 0.78, dotScale 0.72 (gaps between dots), blur 1.5, contrast 25, threshold 176, invert on. I could not view it; adjust threshold and dotScale first if it looks off. The "Medicare" caption is removed.
- package.json: framer-motion ^14.14.0 is now declared. It was already in node_modules (14.14.0) but missing from package.json and the lockfile; run `npm install` to update the lockfile.
- TODO: owner to supply real data for src/features/about/stats.ts (stats strip) and milestones.ts (timeline). Both render nothing while empty.
- Not run (per request): lint, tests, build, browser checks.

### About page fix (hidden sections, spacing, hero motion, banner position)
- Root cause of the missing headings, photos and statement: the in-view trigger watched the element that was being hidden. Heading lines were translated 100% below their overflow-hidden mask and images were clipped to inset(100%), so the watched element never intersected the viewport and its "visible" state never ran. Reveal states also started hidden in the server markup. The Vision statement used framer's target-based scroll progress for word opacity, which could stay at its start value.
- Fix (src/features/about/motion.tsx, src/lib/motion.ts): every reveal now observes a static wrapper (the mask span, the image frame, the content block) with an IntersectionObserver at threshold 0 (any part) and a -6% bottom margin; the animated child only follows a boolean. Server markup and the first client render are in the final visible state. After hydration, and only without reduced motion, elements switch to the hidden state with a zero-duration transition and animate in when seen. If IntersectionObserver is missing, or never reports back within 1.5 s, everything is shown. The Vision statement computes its own scroll progress from getBoundingClientRect (scroll and resize, one rAF), starts correct on first paint, and words only lighten from 40% to 100% opacity, never lower.
- Spacing scale (one rhythm): section padding clamp(72px, 9vw, 128px) applied as top padding only (so two sections have one gap, not two); eyebrow to heading 12px, heading to lead 16px, heading block to content clamp(40px, 5vw, 64px); two-column sections use 5/7 columns with a clamp(32px, 6vw, 96px) column gap and a top-aligned heading block. The hero keeps min-height min(88svh, 760px). Removed the old margin-based gaps. Mission photos (4:5, 4:3) and the founder photo (4:5) have fixed aspect ratios.
- Hero (src/features/about/hero-scene.tsx, client): eyebrow "About Medicare" (the old About2 heading), title masked rise, lead, buttons and stage enter on load staggered 0.08s. While scrolling out: title and lead drift up 80px and fade to 55%, the stage scales to 92% and rises 48px, the rings expand to 135% and fade, the curve scales up from its bottom edge (so it rises without exposing a gap). A "Scroll" cue with a thin line loops down slowly (shown from sm). Transform and opacity only; static under reduced motion.
- Banner moved: Quote, then the closing banner, then Team, then FAQ (page ends with the FAQ). Eyebrow numbers are unchanged (01 to 05). There are no anchor links or nav entries for these sections, so nothing else needed updating. CtaBanner got `spacing` and `bottomSpace` props; Pricing keeps its old defaults.
- Not run (per request): lint, tests, build, browser checks.

## Landing page upgrade (/)
### Motion system
- src/lib/motion.ts (tokens: expo-out [0.22, 1, 0.36, 1], ease-in-out [0.65, 0, 0.35, 1], 0.7s base reveal, 0.8s mask rise, 0.9s image reveal, 0.08s stagger) and src/components/motion/primitives.tsx: MotionRoot (LazyMotion, domAnimation, m components), Reveal, Stagger and StaggerItem, RevealLines (masked rise), DrawCheck, ParallaxImage, ScrollProgress, useMotionOn, useShown. The About page now imports the shared hooks and ScrollProgress from here.
- Triggers observe a static wrapper (threshold 0, -6% bottom margin, once), never the element being moved or clipped. Server markup and the first client render are the final visible state; after hydration, without reduced motion, elements switch to hidden (zero duration) and animate in when seen. If IntersectionObserver is missing or silent for 1.5 s, everything shows. Only transform, opacity, clip-path and stroke length animate. Reduced motion: no animation.
- 2px bg-brand scroll progress bar at the top of the viewport (z-60, above the navbar).
- Navbar is now sticky (top-0, z-50). Past 8px of scroll its background layer turns bg-surface/80 with a backdrop blur and a hairline border. The blur is on a sibling layer, not the navbar content, because backdrop-filter on an ancestor would trap the fixed logout modal. Side effect: the navbar now stays visible on every page.
### Sections
- Spacing: SECTION_PAD clamp(72px, 9vw, 128px) top and bottom; eyebrow 12px; lead 16px; heading block to content clamp(40px, 5vw, 64px). Backgrounds alternate: hero card on page, Why Choose surface-muted, Vision page, Services surface-muted, Team page, Feedback surface-muted. The old gradients (tint to surface) are gone.
- Headings are left-aligned with an eyebrow (Why Choose Us, Our Vision, Services, Our Team, Feedback). New eyebrow words for Services, Our Team and Feedback are labels, not new content.
- Hero: logo chip removed; lead in a lighter glass panel with a hairline border; "Join Medicare" (/signup) and "Explore Features" (/dashboard) buttons reuse the About page labels and the btn class (primary is bg-surface text-brand, because bg-brand would vanish on the navy card). Entrance order: headline (masked rise), lead, buttons, badges, nurse. From md: text rises 90px and fades to 85%, the nurse rises 40px, scales to 96%, the glows drift. "Scroll" cue with a looping line (from sm).
- Why Choose: bento. lg: 3 columns, the first card spans 2 columns and 2 rows, so the rows are [wide, card 2], [wide, card 3], [card 4, 5, 6]: every row is full. A single wide card with 5 singles is 7 cells and cannot fill rows any other way. Below lg all cards are equal (1 then 2 columns). Card: surface, 1px border, 12px radius, hover lifts 4px and strengthens the border.
- Vision: 7/5 grid with the text top-aligned; heading uses text-brand italic for "Reimagined" (violet removed); 4:5 photo at 24px radius with grayscale plus hero-token multiply and screen tints, 8% inner parallax from md; checklist reveals one by one and each check draws in.
- Services: four numbered cards (01 to 04) in a row from the container's @4xl width under a hairline with dots; "Coming Soon" is now an inline badge next to the title; the hover overlay is kept (flat token color instead of a gradient).
- Team: founder card kept; photo has a bottom clip reveal (0.9s ease-in-out) and 6% parallax; social icons stay 44px.
- Feedback: narrower (max-w-2xl) card on surface-muted, 12px radius controls, ring offset on focus, fades in. The result message now sits in a reserved-height region below the form and the character hint has a reserved line, so nothing shifts.
- Footer: one grid (1.5fr / 1fr / 1fr / 1fr), eyebrow-style column headings, 14px links on 44px rows, hairline top border, the same spacing scale.
### Removed
- components/landing/reveal.tsx and its data-reveal CSS; the old hero CSS (animate-hero-shrink, animate-rise, animate-slide-in-left, animate-scale-in and keyframes); text-fluid-hero.
### Notes
- Not run (per request): lint, tests, build, browser checks. Parallax is off below md and under reduced motion.

## Landing page redesign: midnight ink, porcelain and champagne (supersedes the earlier landing upgrade where they differ)
### Palette (globals.css, DESIGN.md section 3)
- New primitives: void-950 #070A1C, void-900 #0E1330, void-800 #171D44 (ink navy), champagne-300 #C9A66B, bronze-700 #8A6A2F. Changed the light neutrals to warm porcelain: ink-50 #F8F7F4 (page), ink-100 #EFEDE7 (muted), ink-200 #E3E0D8 (hairline), ink-400 #8A857A (control border, 3.4:1). Hero tokens now map to void-950/900/800 in both themes; hero-glow-b is champagne. New semantic tokens: champagne (fixed, for ink surfaces) and champagne-text (bronze on light for AA, champagne in dark). --sem-tint no longer holds a raw hex.
- This is a site-wide token change: Pricing, About and the shared footer pick up porcelain and ink too. design-check: p06 expected values updated for the changed tokens, tokens.ts lists the two new tokens and their contrast pairs. Check results are unverified (not run).
- Depth: --shadow-soft, --shadow-lift and --shadow-inner-light tokens; `surface-texture` utility (dot texture at 3.5% opacity) on the hero frame, Vision, closing CTA and footer.
- Also fixed: html and body used overflow-x: hidden, which turns body into a scroll container and breaks position: sticky; now overflow-x: clip.
### Scroll system
- Lenis 1.3.27 added to package.json (the owner asked for it). src/components/motion/smooth-scroll.tsx, mounted once in the root layout: duration 1.1, expo-out easing, autoRaf; disabled on touch (hover: none or pointer: coarse) and under reduced motion; destroyed on unmount or when those preferences change; anything inside [role="dialog"] or [data-lenis-prevent] scrolls natively. It drives the real window scroll, so framer-motion's useScroll sees the smoothed value with no extra wiring.
- Motion primitives stay in src/components/motion/primitives.tsx (they are components; src/lib/motion.ts holds the tokens and variants, since .ts cannot hold JSX): Reveal and Stagger at 0.8s, 24px, expo-out, 0.08s stagger, observed on a static wrapper (threshold 0), visible by default with a 1.5s fallback; masked heading rise; ParallaxImage; PullStatement (scroll words, now shared with About); ScrollProgress. New src/components/motion/interactions.tsx: Magnetic (6px pull), SpotlightCard (cursor glow moved with transform, champagne hairline that draws across the top, 4px lift), TiltCard (max 4 degrees). All mouse-only and off under reduced motion.
### Hero: Scroll Split Card
- Installed with `npx shadcn@latest add @componentry/scroll-split-card` (framer-motion already present). Moved to src/components/landing/scroll-split-card/scroll-split-card.tsx, "use client", strict TypeScript. The registry file has no license header (docs: MIT, verify before production); a comment records this. API kept (imageSrc, cards, containerRef, className); I added imageAlt and an optional `content` node per card.
- Scene: ink gradient, champagne rim light, nurse photo, sliced across three panels. Framed in a 28px-radius container inset from the viewport, with a thin champagne progress line, and a "Scroll" cue that fades once scrolling starts. Pin: 250svh on md and up, 180svh on phones (panels stack vertically and flip on the X axis). Reduced motion and short landscape screens show the revealed state statically with no pin.
- Cards: 1 "Healthcare Reimagined for the Digital Age" (h1, champagne underline under "Reimagined") with Join Medicare and Explore Features; 2 the lead paragraph on a porcelain card; 3 the Secure & Certified and End-to-End Encrypted badges. The headline is clamp(20px, 0.9rem + 1.6vw, 36px), not the 44 to 96px of a full-width hero, because it sits in a card about 290px wide. Before the scroll starts the first screen is the image only; the h1 is in the DOM on the first card's back face.
### Sections
- Why Choose Us: porcelain bento (wide card 2 columns x 2 rows on lg, rows always full), spotlight cards, icon ring 1.06 on hover.
- Vision: ink band with a curved top edge (CurveDivider), scroll-lit paragraph (never below 55% opacity), sticky 4:5 photo with clip reveal, 8% parallax and navy duotone, checklist with drawing checks in champagne.
- Services: sticky stack from lg (each card pins, the next slides over; the covered card scales to 0.96 and dims 35%); 01 to 04 in champagne; Coming Soon badge inline. Below lg a plain list. The old hover overlay is replaced by its message shown under the description.
- Team: founder card with clip photo reveal, 6% parallax, pointer tilt (4 degrees max), 44px socials with lift and a brand ring.
- Closing CTA (new): ink band with champagne glow, existing "Ready to take control of your health records?" copy, hero buttons. Feedback: porcelain card, reserved message space. Footer: ink, champagne top hairline, 4 columns, link underlines draw on hover. Nav links draw an underline from the left (also for the current page). Primary buttons: magnetic pull and arrow slide; secondary lift 1px.
### Not done or unverified
- Not run (per request): lint, tests, build, browser checks. Section headings are clamp(32px, 4.5vw, 56px); the hero card headline deviation is above. The lenis dependency changed package.json and package-lock.json.

### Landing fix: palette revert, full-bleed hero, layout fixes (supersedes the palette and hero notes above)
- Palette reverted completely. Removed the void, champagne and bronze primitives, the champagne and champagne-text semantic tokens and theme mappings, and every usage. Restored ink-50/100/200/400 (#F6F7FB, #EDEFF7, #D5D9E8, #8089AB), the hero tokens (light: navy-900/700/500/400; dark: night-900, navy-900/700/500), hero-glow-b (lilac-400 light, lilac-dusk dark), the #eef1ff tint, and the brand-surface focus outline (on-hero). design-check (p06 values, tokens list and pairs) and DESIGN.md are back to the old values. Kept from the last step: layouts, spacing, motion, Lenis, reveals, hover effects, the soft shadow tokens (re-tinted with the text ink rgb(18 21 46)), the dot texture, the nav and footer underline draws, and overflow-x: clip (sticky fix).
- Where champagne was: eyebrows and dots are brand (violet dot) on light and the lilac hero accent on navy; section numbers and Coming Soon badges use violet and secondary; hairlines and the progress line use brand, violet or the lilac accent; "Reimagined" is the violet gradient again (hero-accent-from to hero-accent-to). Sections: page and tint (cool lavender), white cards, navy footer and closing band, standard brand navy buttons.
- Hero: the Scroll Split Card is now the whole hero. A sticky stage fills the viewport under the navbar (100svh minus the navbar; on phones also minus the fixed bottom bar) with no frame, inset or padding, pinned for 300svh (200svh on phones). The nurse photo on the navy gradient fills the stage with object-cover and splits into three full-height panels (three full-width rows on phones) that flip to full-panel navy-gradient cards with a violet glow: 1 the headline (clamp(36px, 5vw, 72px) from md) with the two buttons, 2 the lead (20 to 24px from md), 3 the two trust badges. Before the split a "Healthcare Reimagined" headline and "Experience healthcare evolved." (the lead's first sentence) sit at the bottom left and fade out as the split begins; a brand/lilac progress line runs along the bottom and the "Scroll" cue fades after the first scroll. The hero section has no padding, so the next section starts right after the pinned stage. Reduced motion and short landscape screens: static photo plus cards, no pin.
- Note on the photo: nurse.webp is 429 x 628 px and a cutout. object-cover across a wide stage magnifies it about 3x, so on desktop it will look soft; a larger source image would fix that.
- Services: cards are sized to content (min-height 240px from lg): number, title with the Coming Soon badge and description on the left, the icon on the right, vertically centered. Stack offset is 0.75rem per card with 14svh spacing; only the covered card scales to 0.96 and dims, with the navy hero-via token.
- Navbar logo: removed the opaque white background path from src/assets/logo/medicare-logo-full-on-light.svg (the dark variant is already a transparent webp).
- Vision photo: clip reveal and duotone kept, tinted from the navy and sky tokens (grayscale, hero-via multiply, hero-glow-a screen). Curved dark edges use hero-via (navy).
- Dev overlay "1 Issue": the likely cause is Next.js 16's warning for `scroll-behavior: smooth` on the html element without `data-scroll-behavior="smooth"` (globals.css sets it, see the Next 16 upgrade guide). I added the attribute to the html element in layout.tsx. I could not see the overlay's text, so if the issue is still there, send me the message.
- Not run (per request): lint, tests, build, browser checks.

### Landing hero: compact card (supersedes the full-bleed hero above)
- The hero is a rounded card (32px outer corners) with a 12px inset under the navbar, sized to the viewport below the navbar (like the reference image), pinned for 250svh (180svh on phones). The nurse photo is contained at the right at its natural size (no object-cover magnification), on the navy gradient with the lilac glow, and the left shows the previous hero layout (headline, "for the Digital Age", lead panel, trust badges) before the split; it fades out as the split begins and the three panels flip to the full-panel cards.
- The pinned box and the stage have no background and no texture. Only the panels carry color, so when they separate the page shows through the gaps. The progress line sits inside the card at the bottom.
- Not run (per request): lint, tests, build, browser checks.
- Hero height trimmed: the pinned box now has 16px above and 24px below the card (was 4px and 12px), so the card is about 36px shorter and fully visible while it splits; the tilt of the outer panels is 2 degrees (was 3).
- Hero follow-up: the progress line is removed. The card is now sized like the legacy React hero: at most 650px tall (the old card's minimum height at md and up), centered in the pinned area with at least 20px above and below, and rounder (24px phones, 30px md, 50px lg, the old values; separated panels use 24px). Scroll order: the progress offset now starts when the hero region's top reaches the bottom edge of the sticky navbar (it used to start at the viewport top, about 72px later), and the split and flip stops moved up (separate 0 to 30%, flip 30 to 65%), so the hero animates from the first scroll and the page below only moves after the pinned stage ends.
- Hero size copied from the legacy React hero (Home.jsx): 20px side margins (px-5), card 4px under the navbar, height 800px from md (capped to the viewport so the whole card stays in view while pinned), radius 30px at md and 50px at lg, rounded-2xl on phones, shadow-2xl. The legacy phone hero is a compact box of about 180px that cannot hold three stacked cards, so phones use 32rem.
- Hero moved 12px lower (mt-3 on the card) so it no longer touches the sticky navbar while pinned; its height formula is unchanged.
- Hero: moved 24px lower (mt-6; on capped viewports the height cap is now 100% minus 1.5rem so the bottom stays flush); the split and flip now run until 90% of the pin (separate 0 to 35%, flip 35 to 90%), so the hero unpins as soon as the cards finish and the page scrolls only after that.

### Services: Case Study Flip Stack
- Installed with `npx shadcn@latest add @componentry/case-study-flip-stack` (framer-motion already present; package.json unchanged). Moved to src/components/landing/case-study-flip-stack/case-study-flip-stack.tsx, "use client", strict TypeScript; the registry file has no license header (verify before production). Replaces the earlier sticky service stack (service-stack.tsx deleted).
- Behavior: a sticky stage under the navbar; as you scroll the top card tilts on X and lifts away while the next rises from the stack; position dots below. Changes from the registry file: demo chrome (hint, heading, "The End") removed, the last card stays, the useSpring smoothing removed (Lenis smooths), tokens instead of hex, next/image, static list under reduced motion. Scroll distance is 90svh per transition.
- Content: the four existing services; card colors are hero-from, hero-via, hero-to and secondary tokens. "Coming Soon" is a pill by the number and the old overlay message is the note under the description.
- Image slot: each card has an empty dashed slot on the right showing the service icon. TODO (owner): import a photo in landing-data.ts and set `image` (and `imageAlt`) on a service to fill its slot.
- Not run (per request): lint, tests, build, browser checks.
- Services colors and size: each card has its own hue from tokens, mixed with the navy hero token so white text stays readable in both themes: navy (hero-from), indigo (secondary 58%), teal (accent 52%) and violet (violet 52%), plus a top-left sheen and a violet glow. The card box is about 80% of the viewport: 80svh tall (capped to the stage minus 3rem) and min(80vw, 1200px) wide from sm; full width on phones.

### Footer: particle "Medicare"
- Installed with `npx shadcn@latest add @componentry/cursor-driven-particle-typography` (no new dependency). Moved to src/components/landing/particle-typography/cursor-driven-particle-typography.tsx; the registry file has no license header (docs: verify before production). Props kept; added maxFontRatio. Changes: the pointer is tracked on the window so the canvas can ignore pointer events; DPR capped at 2; waits for the font; the loop stops when the particles settle and restarts on pointer movement; paused off screen and in hidden tabs; one static frame under reduced motion; no touch listeners; canvas aria-hidden; font family Satoshi.
- Footer: a big particle "Medicare" (text color on-hero, set in the footer's bottom 200 to 420px) sits above the footer content with mix-blend-overlay and pointer-events none, so the footer links and legal row stay readable and clickable through it while the letters blend into them. Not run (per request): lint, tests, build, browser checks.
- Footer wordmark font: Lilita One through next/font/google (weight 400, self-hosted by Next at build time); the component now takes fontWeight and explicitly loads the font before drawing, because a canvas-only font is never requested by the page.
- Footer wordmark: the dot of the "i" is a heart (heartForI): the letter is drawn as a dotless i (U+0131, which Lilita One's latin subset includes) and a heart path is drawn above its stem, so it becomes particles with the rest. Position and size are derived from the glyph metrics; adjust the 1.6 (width) and 0.3 (gap) factors in the component to taste.
- Footer wordmark, cross-browser: the particle grid is now sampled from an offscreen canvas at 1 CSS pixel per pixel (before, the spacing was floor(density x devicePixelRatio) / devicePixelRatio, so it differed per browser, zoom and screen), text is placed with an alphabetic baseline from measured ascent and descent (textBaseline middle differs between browsers), the display canvas is no longer willReadFrequently, and the physics is scaled by frame time so it moves the same at 60 and 120 Hz. Remaining differences are the browsers' own text rasterization at glyph edges.
- Hero on phones and small tablets (below md): no split. They get the revealed layout (photo with the intro overlay, then the three cards stacked) with no pin, like reduced motion. The hook takes a server snapshot, so the server renders the desktop version and desktop has no flash; small screens switch right after hydration.
- Hero on phones and small tablets (below md): the Scroll Split Card is not used. A plain hero card (headline, lead, both buttons, trust badges and the nurse photo, legacy compact proportions) is shown instead, with no pin and no split. md and up keep the split card. The server renders the desktop version and phones switch on hydration.
- Hero below md: only the compact hero card (headline, "for the Digital Age", nurse photo at the right, fluid from 320px, 20px side margins, rounded-2xl and 30px from sm). The lead panel, the Join Medicare and Explore Features buttons and the trust badges are no longer shown on phones and small tablets; the split card starts at md.
- Hero below md, redesigned from the owner's reference: a tall rounded card that fills the screen between the navbar and the fixed bottom bar (100svh minus navbar, bottom bar and safe-area inset, minimum 26rem), navy-to-violet gradient with a violet glow, headline at the top left, the nurse photo anchored to the bottom (68% of the card height, contained), and a "Scroll" cue with a thin line at the bottom. No split card, no lead, buttons or badges.
- Navbar: the Sign up button is hidden below md (max-md:hidden) in the top bar; phones and small tablets show only Login. The desktop navbar (lg and up) is unchanged.
