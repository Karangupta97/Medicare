# Medicare Design System

| | |
| :--- | :--- |
| **Status** | Draft v0.1.0 |
| **Owner** | TODO: confirm |
| **Last updated** | YYYY-MM-DD (replace with the commit date) |
| **Applies to** | `frontend/` (Next.js App Router) |
| **Source of truth** | `frontend/src/app/globals.css`. If this document and the code disagree, the code wins; fix this document in the same pull request. |

**Contents:** 1 Purpose and principles · 2 Tech stack · 3 Design tokens · 4 Typography · 5 Spacing, radius, elevation, borders · 6 Breakpoints and layout grid · 7 Iconography · 8 Motion · 9 Components · 10 Dark mode · 11 Accessibility rules · 12 Brand and logo usage · 13 Role themes · 14 Do/Don't · 15 Contribution rules and changelog

**Conventions in this document**

- Values marked `TODO: confirm` could not be verified from code or a cited source. Do not treat them as final.
- Contrast ratios use the WCAG 2.x relative-luminance formula on unrounded values. Re-verify on `/design-check` after any token change.
- Token names are written without prefixes (`surface`). In CSS they appear as `--prim-*` (primitive), `--sem-*` (semantic) and `--color-*` (Tailwind theme).

---

## 1. Purpose and principles

Medicare is a digital health-records platform for patients, doctors, hospitals and staff. The interface handles sensitive data and, at times, emergencies. The design system exists so every screen looks and behaves the same, in light and dark themes, without per-screen color decisions.

| Principle | How it applies to UI decisions |
| :--- | :--- |
| **Clinical** | Neutral surfaces do most of the work. Brand color marks primary actions only, and accent appears once per screen. No decorative gradients or stacked effects. |
| **Trustworthy** | Colors, spacing and component behavior stay predictable. A button looks the same on every page. Status colors keep one meaning across the product. |
| **Secure** | Sensitive states (verification, sharing, expiry) use explicit labels and icons, never color alone. Destructive actions use the `danger` family and are always confirmed. |
| **Accessibility first** | WCAG 2.x AA is the minimum in both themes. Focus is always visible, touch targets are at least 44px, and motion respects the user's reduced-motion setting. |

---

## 2. Tech stack

| Area | Choice | Version |
| :--- | :--- | :--- |
| Framework | Next.js (App Router, Turbopack) | 16.4.6 |
| UI library | React and React DOM | 19.3.0 |
| Styling | Tailwind CSS v4 (`@theme`, `@utility`) | 4.3.3 (`@tailwindcss/turbopack` 4.3.3) |
| Tailwind plugins | `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/aspect-ratio` | `^0.5.10` (installed 0.5.11), `^0.5.16` (installed 0.5.20), `^0.4.2` (installed 0.4.2) |
| Theming | `next-themes` (class strategy) | `^0.4.6` (installed 0.4.6) |
| Fonts | `next/font/google` (Montserrat Alternates) | built into Next.js |
| Language | TypeScript (`strict: true`) | `^5` (installed 5.9.3) |

Versions in this table must match `frontend/package.json` exactly. Update them whenever a dependency changes.

---

## 3. Design tokens

### 3.1 Architecture

Colors use three layers. Components only ever touch the third layer.

| Layer | CSS prefix | Where declared | Contains |
| :--- | :--- | :--- | :--- |
| Primitive | `--prim-*` | `:root` | Raw values. The only place hex literals are allowed. |
| Semantic | `--sem-*` | `:root` (light), `.dark` (dark) | Purpose-named tokens that reference one primitive each. |
| Tailwind theme | `--color-*` | `@theme inline` | Maps each semantic token so `bg-surface`, `text-text-muted` and similar utilities exist. |

### 3.2 Primitive tokens

| Family | Primitive | Hex | Used by (light / dark) |
| :--- | :--- | :--- | :--- |
| White | `white` | `#FFFFFF` | `surface` (light), `on-brand` (light), `on-accent` (light), `on-emergency` (light) |
| Ink (light neutrals) | `ink-50` | `#F6F7FB` | `page` (light) |
| | `ink-100` | `#EDEFF7` | `surface-muted` (light) |
| | `ink-200` | `#D5D9E8` | `border` (light) |
| | `ink-400` | `#8089AB` | `border-strong` (light) |
| | `ink-600` | `#525A7D` | `text-muted` (light) |
| | `ink-900` | `#12152E` | `text` (light) |
| Night (dark neutrals) | `night-950` | `#0A0D22` | `page` (dark), `on-brand` (dark), `on-emergency` (dark) |
| | `night-900` | `#10143A` | `surface` (dark) |
| | `night-800` | `#171C47` | `surface-muted` (dark) |
| | `night-700` | `#2A3166` | `border` (dark) |
| | `night-500` | `#6C75AA` | `border-strong` (dark) |
| | `night-300` | `#A3AAD0` | `text-muted` (dark) |
| | `night-50` | `#EDEEF8` | `text` (dark) |
| Navy (primary) | `navy-900` | `#1A1E4A` | `brand-hover` (light) |
| | `navy-700` | `#252A61` | `brand` (light) |
| Periwinkle (primary, dark) | `periwinkle-300` | `#A9B3F5` | `brand` (dark) |
| | `periwinkle-200` | `#C0C8F8` | `brand-hover` (dark) |
| Indigo (secondary) | `indigo-800` | `#2F3880` | `on-secondary-subtle` (light) |
| | `indigo-600` | `#4A55B0` | `secondary` (light) |
| | `indigo-100` | `#E6E9F9` | `secondary-subtle` (light) |
| | `indigo-400` | `#8F9AE6` | `secondary` (dark) |
| | `indigo-200` | `#C3CAF6` | `on-secondary-subtle` (dark) |
| | `indigo-900` | `#1F2658` | `secondary-subtle` (dark) |
| Teal (accent) | `teal-900` | `#075350` | `on-accent-subtle` (light) |
| | `teal-800` | `#096360` | `accent-hover` (light) |
| | `teal-700` | `#0B7C78` | `accent` (light) |
| | `teal-50` | `#DDF3F1` | `accent-subtle` (light) |
| | `teal-200` | `#8CEBE3` | `on-accent-subtle` (dark) |
| | `teal-300` | `#6BDDD4` | `accent-hover` (dark) |
| | `teal-400` | `#3FCFC4` | `accent` (dark) |
| | `teal-950` | `#06211F` | `on-accent` (dark) |
| | `teal-surface-dark` | `#0E2F34` | `accent-subtle` (dark) |
| Green (success) | `green-700` | `#16763F` | `success` (light) |
| | `green-50` | `#DDF3E5` | `success-subtle` (light) |
| | `green-400` | `#52D48A` | `success` (dark) |
| | `green-950` | `#0F2D22` | `success-subtle` (dark) |
| Amber (warning) | `amber-700` | `#9A5B06` | `warning` (light) |
| | `amber-50` | `#FBEFD3` | `warning-subtle` (light) |
| | `amber-400` | `#F2B84B` | `warning` (dark) |
| | `amber-950` | `#33280F` | `warning-subtle` (dark) |
| Rose (danger) | `rose-600` | `#C2294B` | `danger` (light) |
| | `rose-50` | `#FBE3E8` | `danger-subtle` (light) |
| | `rose-400` | `#F4708B` | `danger` (dark) |
| | `rose-950` | `#3A1522` | `danger-subtle` (dark) |
| Vermilion (emergency) | `vermilion-700` | `#B3260E` | `emergency` (light) |
| | `vermilion-50` | `#FBE1DA` | `emergency-subtle` (light) |
| | `vermilion-400` | `#FF7A5C` | `emergency` (dark) |
| | `vermilion-950` | `#44190F` | `emergency-subtle` (dark) |
| Overlay | `black` | `#000000` | `overlay` (light, used at 50%) |
| | `night-1000` | `#05061A` | `overlay` (dark, used at 50%) |

### 3.3 Semantic tokens

| Group | Token | Light value | Dark value | Role |
| :--- | :--- | :--- | :--- | :--- |
| Neutral | `page` | `#F6F7FB` | `#0A0D22` | App background |
| | `surface` | `#FFFFFF` | `#10143A` | Cards, modals, inputs |
| | `surface-muted` | `#EDEFF7` | `#171C47` | Panels, table headers |
| | `border` | `#D5D9E8` | `#2A3166` | Dividers (decorative) |
| | `border-strong` | `#8089AB` | `#6C75AA` | Input and control borders |
| | `text` | `#12152E` | `#EDEEF8` | Body text |
| | `text-muted` | `#525A7D` | `#A3AAD0` | Secondary text |
| | `overlay` | `#000000` | `#05061A` | Modal backdrop (use at 50% alpha) |
| Primary | `brand` | `#252A61` | `#A9B3F5` | Primary buttons, nav, links, focus ring |
| | `brand-hover` | `#1A1E4A` | `#C0C8F8` | Hover state |
| | `on-brand` | `#FFFFFF` | `#0A0D22` | Text and icons on `brand` |
| Secondary | `secondary` | `#4A55B0` | `#8F9AE6` | Secondary actions, selected state, info |
| | `secondary-subtle` | `#E6E9F9` | `#1F2658` | Soft backgrounds |
| | `on-secondary-subtle` | `#2F3880` | `#C3CAF6` | Text on `secondary-subtle` |
| Accent | `accent` | `#0B7C78` | `#3FCFC4` | One highlight per screen |
| | `accent-hover` | `#096360` | `#6BDDD4` | Hover state |
| | `on-accent` | `#FFFFFF` | `#06211F` | Text on `accent` |
| | `accent-subtle` | `#DDF3F1` | `#0E2F34` | Chips and soft panels |
| | `on-accent-subtle` | `#075350` | `#8CEBE3` | Text on `accent-subtle` |
| Status | `success` / `success-subtle` | `#16763F` / `#DDF3E5` | `#52D48A` / `#0F2D22` | Verified, confirmed |
| | `warning` / `warning-subtle` | `#9A5B06` / `#FBEFD3` | `#F2B84B` / `#33280F` | Moderate risk, limits |
| | `danger` / `danger-subtle` | `#C2294B` / `#FBE3E8` | `#F4708B` / `#3A1522` | Errors, destructive actions |
| | `emergency` / `emergency-subtle` | `#B3260E` / `#FBE1DA` | `#FF7A5C` / `#44190F` | Medical alerts only |
| | `on-emergency` | `#FFFFFF` | `#0A0D22` | Text on solid `emergency` |

The focus ring uses `brand` in both themes. There is no separate `info` token; information uses `secondary`.

### 3.4 Legacy token mapping

| Legacy token | New token | Note |
| :--- | :--- | :--- |
| `--color-primary` | `brand` | Same name kept as an alias. Light value is unchanged (`#252A61`). |
| `--color-secondary` | `secondary` | Value changed from `#B8C5FD` (low contrast) to `#4A55B0`. |
| `--color-accent` | `accent` | Value changed from `#E8C3D5` (low contrast) to `#0B7C78`. |

### 3.5 Measured contrast (WCAG 2.x)

Recomputed from the real tokens in `globals.css` with the contrast module used by `/design-check` (unrounded WCAG 2.x relative luminance, shown to two decimals). Every row of the previous table matched.

| Foreground on background | Light | Dark | Minimum |
| :--- | :--- | :--- | :--- |
| `text` on `surface` | 17.91 | 15.37 | 4.5 |
| `text` on `page` | 16.73 | 16.63 | 4.5 |
| `text` on `surface-muted` | 15.60 | 14.06 | 4.5 |
| `text-muted` on `surface` | 6.74 | 7.79 | 4.5 |
| `text-muted` on `surface-muted` | 5.87 | 7.13 | 4.5 |
| `on-brand` on `brand` | 13.27 | 9.56 | 4.5 |
| `on-brand` on `brand-hover` | 15.81 | 11.76 | 4.5 |
| `brand` on `surface` | 13.27 | 8.84 | 3 (UI) |
| `brand` on `surface-muted` (nav-link hover) | 11.56 | 8.08 | 4.5 |
| `brand` (focus ring) on `page` / `secondary-subtle` | 12.40 / 10.99 | 9.56 / 7.08 | 3 (UI) |
| `secondary` on `surface` | 6.53 | 6.70 | 4.5 |
| `on-secondary-subtle` on `secondary-subtle` | 8.70 | 8.87 | 4.5 |
| `on-secondary-subtle` on `surface-muted` (btn-secondary hover) | 9.15 | 10.13 | 4.5 |
| `on-accent` on `accent` | 5.04 | 8.78 | 4.5 |
| `on-accent` on `accent-hover` | 7.08 | 10.38 | 4.5 |
| `accent` on `surface` | 5.04 | 9.24 | 4.5 |
| `on-accent-subtle` on `accent-subtle` | 7.69 | 10.24 | 4.5 |
| `success` on `surface` / `success-subtle` | 5.68 / 4.88 | 9.42 / 7.85 | 4.5 |
| `warning` on `surface` / `warning-subtle` | 5.42 / 4.75 | 9.92 / 8.09 | 4.5 |
| `danger` on `surface` / `danger-subtle` | 5.66 / 4.65 | 6.37 / 5.75 | 4.5 |
| `emergency` on `surface` / `emergency-subtle` | 6.56 / 5.28 | 6.92 / 5.88 | 4.5 |
| `on-emergency` on `emergency` | 6.56 | 7.49 | 4.5 |
| `border-strong` on `surface` | 3.45 | 4.03 | 3 (UI) |
| `border-strong` on `page` | 3.22 | 4.36 | 3 (UI) |
| `secondary` (btn-secondary border) on `secondary-subtle` | 5.40 | 5.37 | 3 (UI) |
| `brand` (btn-secondary hover border) on `secondary-subtle` | 10.99 | 7.08 | 3 (UI) |
| `border` on `surface` | 1.41 | 1.46 | decorative, no minimum |

Every pair meets its minimum. There are no known contrast exceptions (section 11).
---

## 4. Typography

### 4.1 Font families

| Role | Family | CSS variable | Loading | Fallback stack |
| :--- | :--- | :--- | :--- | :--- |
| Primary (all UI text) | Montserrat Alternates | `--font-montserrat` (token), next/font variable set in `layout.tsx` | `next/font/google`, `latin` subset, `display: swap` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif` (as written in `globals.css`) |

- Weights loaded: 400, 500, 700, 900 (`layout.tsx`, `weight` option). Tailwind classes `font-normal` (400), `font-medium` (500), `font-bold` (700) and `font-black` (900) map to a loaded face; `font-semibold` (600) and `font-extrabold` (800) use the nearest loaded face (browser matching).
- `--font-sans` points to the same stack, so default `font-sans` text and form controls use Montserrat Alternates.
- No font is loaded from a third-party origin at runtime. All font files are served from the app's own origin.
- Montserrat Alternates is wider than most UI fonts. Test long labels, buttons and table headers for wrapping.
- License: TODO: confirm (name and URL as published on the font's Google Fonts page).

### 4.2 Type scale

| Level | Class | Size | Weight | Line height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Heading 1 | `heading-1` | 24px, 30px at `sm`, 36px at `lg` | 700 | 32px, 36px, 40px | Page titles |
| Heading 2 | `heading-2` | 20px, 24px at `sm`, 30px at `lg` | 700 | 28px, 32px, 36px | Section titles |
| Body | `body-text` | 16px at all breakpoints | inherited (400) | 24px | Paragraph text |
| Label | `form-label` | 14px | 500 | 20px | Form labels |

Sizes and line heights come from the `@apply` text utilities in `globals.css` and the Tailwind 4.3.3 type scale (`text-sm` 14px/20px, `text-base` 16px/24px (used by `body-text`), `text-xl` 20px/28px, `text-2xl` 24px/32px, `text-3xl` 30px/36px, `text-4xl` 36px/40px). All four classes use the `text` color token.

Text rules: body text is at least 16px; large text (24px, or 18.66px at weight 700 or more) may use the 3:1 contrast minimum, all other text needs 4.5:1.

---

## 5. Spacing, radius, elevation, borders

| Category | Token / scale | Value | Usage |
| :--- | :--- | :--- | :--- |
| Spacing | Tailwind default scale | 4px base unit (`1` = 0.25rem) | All padding, margin and gap |
| Radius | `rounded-lg` | 0.5rem (8px) | `nav-link`, theme toggle options |
| Radius | `rounded-xl` | 0.75rem (12px) | `card`, `btn`, `form-input`, `mobile-nav-link` |
| Radius | `rounded-full` | pill | `status-badge` |
| Elevation | `shadow-custom` | `0px 10px 20px rgba(0, 0, 0, 0.2)` | Floating surfaces |
| Elevation | `shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` (Tailwind 4.3.3) | `card`, `btn-primary` |
| Elevation | `shadow-md`, `shadow-lg` | Tailwind 4.3.3 defaults | `btn-primary` hover, `card-hover` |
| Border width | default | 1px | Dividers, inputs |
| Border color | `border`, `border-strong` | see 3.3 | Decorative lines and control edges |

Default border color uses the `border` token, so borders adapt to the theme.

---

## 6. Breakpoints and layout grid

| Name | Min width | Notes |
| :--- | :--- | :--- |
| `xs` | 320px | Custom breakpoint (legacy token `--breakpoint-xs`) |
| `sm` | 640px | Tailwind default |
| `md` | 768px | Tailwind default |
| `lg` | 1024px | Tailwind default |
| `xl` | 1280px | Tailwind default |
| `2xl` | 1536px | Tailwind default |

| Layout class | Behavior |
| :--- | :--- |
| `container-custom` | Centered page container: max width 80rem (1280px), horizontal padding 16px, 24px at `sm`, 32px at `lg`. |
| `section` | Vertical padding 24px, 32px at `sm`, 48px at `lg`. |
| `grid-responsive-2` | 1 column, 2 columns at `sm`. Gap 16px, 24px at `sm`. |
| `grid-responsive-3` | 1 column, 2 at `sm`, 3 at `lg`. Same gap. |
| `grid-responsive-4` | 1 column, 2 at `sm`, 4 at `lg`. Same gap. |

Design mobile first. Every screen must work at 320px without horizontal scrolling.

---

## 7. Iconography

| Item | Rule |
| :--- | :--- |
| Icon library | TODO: confirm which library is kept. The legacy app uses `lucide-react` (14 imports), `react-icons` (63 files) and `@heroicons/react`. The new app has no icon library installed. Use one library for new work. |
| Sizes | TODO: confirm (suggested 16, 20, 24px) |
| Color | Icons use `currentColor` so they follow the text token they sit next to. |
| Status | Every status chip or alert includes an icon or a text label. Color is never the only signal. |
| Decorative icons | Hidden from screen readers (`aria-hidden="true"`). Meaningful icons have an accessible name. |

---

## 8. Motion

| Class | Keyframe | Duration | Easing | Iteration |
| :--- | :--- | :--- | :--- | :--- |
| `animate-float` | `float` | 3s | ease-in-out | infinite |
| `animate-fadeIn` | `fadeIn` | 0.5s | ease-out | once, forwards |
| `animate-slideIn` | `slideInFromRight` | 0.4s | ease-out | once, forwards |
| `animate-scroll` | `scroll` | 8s | linear | infinite |
| `notification-badge` | `notification-pulse` | 2s | ease (CSS default) | infinite |
| `status-indicator` | `status-pulse` | 2s | ease (CSS default) | infinite |
| `animate-medical-fade` | `medicalFadeIn` | 240ms | ease-out | once |
| `animate-medical-pop` | `medicalPopIn` | 360ms | cubic-bezier(0.2, 0.8, 0.2, 1) | once |
| `animate-medical-pulse-ring` | `medicalPulseRing` | 2.2s | ease-out | infinite |
| `animate-medical-dots` | `medicalDots` | 1.4s | steps(1, end) | infinite |
| `skeleton-medical` | `skeletonShimmer` | 1.7s | linear | infinite |

**Reduced motion:** when the user's system requests reduced motion, all animation classes above stop (the element shows its final state; the pulse ring is hidden) and transition durations drop to 0.01ms or less.

**Theme switching:** transitions are disabled for the instant the theme class changes, so no element visibly fades between themes.

---

## 9. Components

State coverage is required for every component: default, hover, focus-visible, active, disabled (and error for inputs).

### 9.1 Component specification

| Component | Class | Tokens (light and dark switch automatically) | Variants | Status |
| :--- | :--- | :--- | :--- | :--- |
| Primary button | `btn-primary` | `bg-brand`, `text-on-brand`, hover `bg-brand-hover` | default | TODO: confirm active/disabled styles |
| Secondary button | `btn-secondary` | `bg-secondary-subtle`, `text-on-secondary-subtle`, border `border-secondary`, hover border `border-brand` (background unchanged on hover) | default | TODO: confirm active/disabled styles |
| Input | `form-input` | `bg-surface`, `border-border-strong`, `text-text`, focus ring `brand`, error `border-danger` | default, error, disabled | TODO: confirm error and disabled |
| Label | `form-label` | `text-text` | default | Confirmed |
| Card | `card` | `bg-surface`, `border-border`, `shadow-xs` | static, `card-hover` | Confirmed |
| Modal | overlay and dialog | overlay `bg-overlay/50`; dialog uses `card` tokens | default | Confirmed |
| Status badge | `status-badge-success`, `-warning`, `-error` | subtle background plus matching text token | 3 | Confirmed |
| Alert | TODO: define class | `success`, `warning`, `danger`, `secondary` (info), `emergency` families | 5 | TODO: confirm |
| Nav link | `nav-link`, `mobile-nav-link`, `menu-item` | `text-text`, hover `text-brand` with `bg-surface-muted` | default, active | Confirmed |
| Table | native elements | `bg-surface`, header `bg-surface-muted`, `border-border` | default | TODO: confirm |
| Toast | custom | TODO: define | success, error, info | TODO: confirm |
| Gradient text | `gradient-text` | gradient from `brand` to `secondary` | default | **Deprecated, remove when unused.** Kept only because it was ported from the legacy app. Do not use in new work. |

### 9.2 Status treatment rules

| Status | Appearance | Required companion |
| :--- | :--- | :--- |
| Success, warning, danger, info | Subtle background with colored text | Icon or text label |
| Emergency | **Solid** `emergency` fill with `on-emergency` text | Alert icon and text label |

`emergency` and `danger` use different colors and different treatment. Emergency is reserved for medical alerts that need immediate action. Danger covers errors and destructive actions.

### 9.3 Adding a component

1. Use only semantic-token utilities for color.
2. Provide every required state and document it above.
3. Add a sample to the Components or Status section of `/design-check` (section 9.4). Compare mode shows it in both themes.
4. Confirm the pair contrast in section 3.5 style (4.5:1 text, 3:1 UI).

### 9.4 The `/design-check` dashboard

`/design-check` is an internal page that displays this system from the running code. It is not a source of truth: if it disagrees with `globals.css`, the code wins and the page has a bug.

| Item | Rule |
| :--- | :--- |
| Access | Internal only. The route calls `notFound()` when `NODE_ENV` is `production`, so the production build answers 404. It sends `noindex, nofollow` metadata and no page links to it. |
| Location | Everything lives in `src/app/design-check/`. Nothing outside that folder imports from it. Deleting the folder removes the page and leaves lint, type check and build passing. |
| Where values come from | Colors are read from the page's computed styles in the browser, once per theme (a `.light` and a `.dark` probe, see section 10.1), so both themes are shown at the same time. Counts and token names come from `src/app/design-check/_lib/tokens.ts`. Nothing on the page is typed in by hand except the documented spacing, radius and motion tables. |
| Contrast | Every pair in `INTENDED_PAIRS` is measured with the WCAG 2.x formula on unrounded values. The Overview shows pass and fail totals per theme and lists each failing pair. |
| Colors in its own code | Semantic-token utilities only. No raw hex, no palette utilities, no `dark:` utilities. The only inline styles set a swatch background to a CSS variable. |

| Section | What it shows |
| :--- | :--- |
| 01 Overview | Token counts, pass and fail totals per theme, and a success, warning or danger banner. |
| 02 Palette | Primitive tokens by family. Selecting a swatch copies its CSS variable name. |
| 03 Semantic tokens | Every token with its light value, dark value, resolved primitive and Tailwind variable. |
| 04 Contrast matrix | Every intended pair with ratio, minimum, a pass or fail label with an icon, and a live "Aa" sample. Filters: All, Failing, Text, UI. Sortable by ratio. |
| 05 Typography | The four text classes measured at the current viewport, the font stack and the loaded weights. |
| 06 Components | Every ported class in default, forced hover, forced focus and disabled states. A touch-target toggle outlines each control. States the system does not define are marked TODO. |
| 07 Status and emergency | Success, warning, danger, info and emergency as badges and alerts, each with an icon and a text label. |
| 08 Spacing, radius, elevation, motion | The steps the ported classes use, and every animation with its timing and a Replay button for one-shot animations. |
| 09 Compare mode | One group at a time (buttons, inputs, navigation, cards, surfaces, layout helpers, legacy utilities, status, semantic colors) in a `.light` box next to a `.dark` box, in a wider area than the rest of the page. A switch turns the comparison on and off, and a second control chooses side by side or stacked. Each box header shows the theme's measured page, surface, text and brand colors. |

Limits to know:

- A dev server can serve stale CSS after `globals.css` changes. If the page shows old values, restart `next dev` or use "Measure again" in the Overview after saving.
- The `dark:` variant still matches inside a `.light` element nested in `.dark`. The page never uses `dark:`; keep it that way in anything shown in compare mode.
- The component samples size themselves by the width of their own box (container queries), so they stay readable in a half-width column. Classes that are viewport-based by definition (`grid-responsive-*`, `sm:card`, `sm:heading-1`) still follow the viewport.
- The page is a fixed-height shell: the sidebar does not scroll with the page and only the main area scrolls, which also stops at its end. Do not make the document itself scrollable.
- A forced state is drawn with classes, so it approximates the real state. The `card-hover` sample is labeled as an approximation.

---

## 10. Dark mode

### 10.1 Strategy

| Item | Decision |
| :--- | :--- |
| Mechanism | `next-themes`, class strategy. The `dark` class is set on `<html>`. |
| Modes | `light`, `dark`, `system` (default: `system`) |
| Persistence | Saved in `localStorage`. If storage is unavailable, the choice applies for the page lifetime and falls back to `system` on next load. |
| Flash prevention | The saved theme is applied before first paint. No flash of the wrong theme. |
| Variant selector | `@custom-variant dark (&:where(.dark, .dark *))` |
| Native controls | `color-scheme: light` on `:root`, `color-scheme: dark` on `.dark` |
| Compare scope | The light tokens are declared on `:root, .light` and the dark tokens on `.dark`, so a `.light` or `.dark` element shows that theme inside a page of the other theme (used by `/design-check` to show both side by side). A scope sets token values only; it does not set `background-color` or `color`, so put `bg-page text-text` on the scope element. The `dark:` variant still matches inside a `.light` element that sits inside `.dark`, so use tokens, not `dark:`, in anything shown in a scope. |

### 10.2 Token mapping pattern

Every semantic token is declared twice, with the same name, and referenced through one primitive.

```css
:root {
  color-scheme: light;
  --sem-surface: var(--prim-white);
  --sem-text: var(--prim-ink-900);
}

.dark {
  color-scheme: dark;
  --sem-surface: var(--prim-night-900);
  --sem-text: var(--prim-night-50);
}

@theme inline {
  --color-surface: var(--sem-surface);
  --color-text: var(--sem-text);
}
```

### 10.3 Adding a new token

1. Add a primitive in `:root` only if the value does not exist yet (raw hex goes here and nowhere else).
2. Declare `--sem-<role>` in `:root` and in `.dark`, each as a single `var(--prim-*)`.
3. Add `--color-<role>: var(--sem-<role>);` in `@theme inline`.
4. Use `bg-<role>`, `text-<role>` or `border-<role>` in components.
5. Add the token to section 3 of this document and to `/design-check`.

### 10.4 Dark-mode design rules

- Dark surfaces are dark navy, never pure black.
- Brand colors are lighter and less saturated in dark mode so they reach at least 3:1 against `surface`.
- Text on brand, accent and emergency fills uses dedicated `on-*` tokens (dark text on the lighter dark-mode fills).
- Components use tokens, so they do not need `dark:` overrides. Use `dark:` only for rare cases a token cannot express.

### 10.5 Testing checklist

- [ ] Every semantic token exists in both `:root` and `.dark`
- [ ] Contrast thresholds met in both themes (section 11)
- [ ] No flash of the wrong theme on hard reload, for `light`, `dark` and `system` with the OS in both modes
- [ ] No hydration warnings in the browser console
- [ ] Native controls (scrollbars, date pickers, select) follow the theme
- [ ] Reduced-motion setting stops animations
- [ ] No raw hex literals outside the `globals.css` primitive block

---

## 11. Accessibility rules

| Rule | Requirement |
| :--- | :--- |
| Text contrast | At least 4.5:1 for normal text; 3:1 for large text (24px, or 18.66px at weight 700 or more) |
| UI contrast | At least 3:1 for control borders, focus rings, status indicators and toggle states |
| Focus | Visible indicator on every interactive element: 2px outline, 2px offset, `brand` color, at least 3:1 against the adjacent surface, never clipped. Implemented by one global `:focus-visible` rule in `globals.css` (`@layer base`). `form-input` keeps its own 2px `brand` focus ring in addition. |
| Touch targets | At least 44px by 44px, including the theme toggle options. Implemented with `min-h-11` on `btn`, `form-input`, `nav-link`, `mobile-nav-link` and `menu-item` (measured: 44px, and 48px for `mobile-nav-link`). |
| Color alone | Never the only signal. Status uses text or an icon as well. Must be readable in grayscale. |
| Emergency vs danger | Separate tokens with different values in both themes |
| Motion | Respect reduced motion (section 8) |
| Keyboard | Everything reachable and operable by keyboard. The theme toggle follows the WAI-ARIA radio-group pattern. |
| Disabled controls | Excluded from contrast minimums, but still clearly distinguishable |

### Known contrast exceptions

None. Every pair in section 3.5 meets its minimum in both themes. List any pair that falls below its minimum here with both token names, both hex values, the measured ratio and the required minimum, and open a ticket to fix it.

---

## 12. Brand and logo usage

| File | Variant | Background | Path |
| :--- | :--- | :--- | :--- |
| `medicare-logo-full-on-light.svg` | Icon and wordmark | Light | `src/assets/logo/` |
| `medicare-logo-full-on-dark.svg` | Icon and wordmark | Dark | `src/assets/logo/` |
| `medicare-logo-icon-on-light.svg` | Icon only | Light | `src/assets/logo/` |
| `medicare-logo-icon-on-dark.svg` | Icon only | Dark | `src/assets/logo/` |

**Naming pattern:** `medicare-logo-{full|icon}-on-{light|dark}.svg` (lowercase, hyphenated).

| Rule | Value |
| :--- | :--- |
| Choosing a file | Pick by the background it sits on, not by the page theme name. |
| Format | SVG for in-app use. PNG only for places that require it (apple touch icon, social share image, emails). |
| Favicon and app icons | `src/app/favicon.ico`, `icon.svg`, `apple-icon` (Next.js file conventions) |
| Emails | PNG hosted at a stable public URL (many email clients do not render SVG) |
| Clear space | TODO: confirm with the design team |
| Minimum size | TODO: confirm with the design team |
| Do not | Recolor, stretch, rotate, add effects, or redraw the logo |

---

## 13. Role themes

All roles share one palette. A role is identified by layout, navigation and labels, not by its own colors.

| Role | Entry area | Role-specific colors | Notes |
| :--- | :--- | :--- | :--- |
| Patient | TODO: confirm route group | None. Uses default tokens. | |
| Doctor | TODO: confirm | None. Uses default tokens. | Legacy gradients were retired with the palette refresh. |
| Hospital | TODO: confirm | None. Uses default tokens. | |
| Founder | TODO: confirm | None. Uses default tokens. | |
| Staff | TODO: confirm | None. Uses default tokens. | |

Authentication screens for all roles use `brand` for the primary action. The legacy violet auth color is retired.

If a role later needs its own surface or accent, add it as a documented semantic token with light and dark values, and list the screens that use it here.

---

## 14. Do/Don't

| Do | Don't |
| :--- | :--- |
| Use semantic tokens: `bg-surface`, `text-text`, `border-border` | Use hex literals outside the `:root` primitive block |
| Test every change in light and dark | Use Tailwind palette utilities such as `bg-gray-100` or `text-blue-500` in new code |
| Keep brand for primary actions, accent once per screen | Add new colors without a light and a dark mapping |
| Pair status color with an icon or label | Rely on color alone to show status |
| Use `on-*` tokens for text on filled backgrounds | Put white text on a token without checking its `on-*` pair |
| Keep touch targets at 44px or more | Remove focus outlines |
| Reuse existing component classes | Use `@apply` with palette utilities in new classes |
| Respect reduced motion | Add infinite animations without a reduced-motion fallback |
| Use inline color styles only for user-provided colors | Hardcode role-specific gradients |

---

## 15. Contribution rules and changelog

### 15.1 Rules

1. Raw hex is allowed only in primitive token definitions.
2. Every new semantic token needs both a light and a dark value.
3. Every new color pair needs a measured contrast ratio added to section 3.5.
4. Every new component needs documented states and a `/design-check` sample in both themes.
5. Update this document in the same pull request as the code change.
6. Values you cannot confirm stay marked `TODO: confirm`. Do not guess.

### 15.2 Pull request checklist

- [ ] Tokens exist in `:root` and `.dark` and in `@theme inline`
- [ ] No new raw hex outside the primitive block
- [ ] Contrast measured and recorded
- [ ] Verified in light, dark and system modes
- [ ] Lint, typecheck and build pass
- [ ] This document updated

### 15.3 Changelog

| Date | Change | Author |
| :--- | :--- | :--- |
| YYYY-MM-DD | Initial design system: refreshed palette (primary, secondary, accent, neutral, status), light and dark themes, Montserrat Alternates as primary font, ported utilities and keyframes. Date must equal the commit date. | TODO: confirm |