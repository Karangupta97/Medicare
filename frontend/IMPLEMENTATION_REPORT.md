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
