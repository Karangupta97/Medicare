# Implementation Report: design-system-dark-mode

This report documents the implementation of the Medicare design system port from the Vite + React legacy app (`frontend-react/`) to the Next.js App Router app (`frontend/`), including dark mode, logo assets, font loading and a temporary verification route.

**Branch**: `migration/frontend-nextjs`  
**Commits**: commits deferred by owner  
**Requirements validated**: 1.4, 1.5, 1.7, 1.9, 15.4, 17.6, 17.7, 19.1–19.11

> **Palette refresh in progress (owner decision).** Sections of this report that describe the legacy palette (Ported > Tokens, token counts, contrast tables, Items for Review) predate the refresh and are superseded by "Approved Deviation: Palette Refresh" below. They are regenerated when the refresh finishes.

## Ported

### Tokens (Legacy_Tokens)

All six Legacy_Tokens from `frontend-react/src/index.css` were ported to `frontend/src/app/globals.css`:

- `--breakpoint-xs: 320px` → generates the `xs:` variant
- `--color-primary` → `--sem-primary` → `#252a61` (light), `#9ba3d4` (dark)
- `--color-secondary` → `--sem-secondary` → `#b8c5fd` (light), `#cfd6f4` (dark)
- `--color-accent` → `--sem-accent` → `#e8c3d5` (light), `#f0dce6` (dark)
- `--font-montserrat` → `var(--font-montserrat-alternates), sans-serif`
- `--shadow-custom: 0px 10px 20px rgba(0, 0, 0, 0.2)`

### Utility Classes (@utility directives, 23 classes)

All 23 legacy `@utility` classes were ported with palette utilities replaced by Semantic_Token utilities:

`nav-link`, `mobile-nav-link`, `menu-item`, `card`, `card-hover`, `form-input`, `form-label`, `btn`, `btn-primary`, `btn-secondary`, `container-custom`, `section`, `heading-1`, `heading-2`, `body-text`, `grid-responsive-2`, `grid-responsive-3`, `grid-responsive-4`, `status-badge`, `status-badge-success`, `status-badge-warning`, `status-badge-error`, `scrollbar-hide`.

Replacement examples (Requirements 20.1, 20.2):
- `text-black` → `page-fg`
- `hover:bg-gray-50` → `hover:surface-hover`
- `bg-white` → `surface`
- `text-gray-700` → `text-label`
- `border-gray-100` → `border-subtle`

### Plain Classes (unlayered, with media wrappers and pseudo-classes)

Ported in legacy order with legacy selectors:

**Glass**: `.glass`, `.glass-effect`, `.glass-search-dropdown`, `.glass-search-card` (with `:hover`)

**Scrollbar**: `.custom-scrollbar` (merged duplicate definitions; winner uses thin styled scrollbar with `::-webkit-scrollbar*` rules), `.hide-scrollbar`

**Gradient effects**: `.border-gradient-to-r`, `.border-gradient-to-br`, `.ring-gradient-to-r`

**Dropdown animations**: `.dropdown-enter`, `.dropdown-enter-active`, `.dropdown-exit`, `.dropdown-exit-active`

**Search components**: `.search-focus-animation` (with `:focus`), `.mobile-search-overlay` (merged duplicates; winner has `rgba(0, 0, 0, 0.85)` background), `.mobile-search-modal`, `.mobile-search-input` (with `:focus`), `.mobile-search-btn` (with `::before` and `:hover::before`), search suggestion animation classes inside `@media (max-width: 1023px)`

**Other**: `.modern-button` (with `:hover`), `.gradient-text`, `.card-hover` (plain class with `:hover`, kept alongside the `@utility` directive as in legacy)

**Duplicate-class resolutions** (Requirement 3.8):
- `.custom-scrollbar`: merged two definitions; hidden-scrollbar version lost, thin-styled-scrollbar version won
- `.mobile-search-overlay`: merged two definitions; identical, no conflict
- `.card-hover`: both definitions kept in their respective layers (`@utility` and plain unlayered)

### Keyframes (11 keyframes)

All 11 legacy keyframes ported with the same names, stop percentages and property values:

`float`, `fadeIn`, `slideInFromRight`, `scroll`, `notification-pulse`, `status-pulse`, `medicalFadeIn`, `medicalPopIn`, `medicalPulseRing`, `medicalDots`, `skeletonShimmer`

### Animation Classes (11 classes)

All 11 animation classes ported with the same shorthand values:

`.animate-float`, `.animate-fadeIn`, `.animate-slideIn`, `.animate-scroll`, `.notification-badge`, `.status-indicator`, `.animate-medical-fade`, `.animate-medical-pop`, `.animate-medical-pulse-ring`, `.animate-medical-dots` (with `::after`), `.skeleton-medical`

### Base Layer Rules

- Border-color compatibility rule on `*`, `::after`, `::before`, `::backdrop`, `::file-selector-button` (uses `var(--sem-border-default)` instead of literal)
- `html, body { font-family: var(--font-sans); }`
- `body { background-color: var(--sem-page); color: var(--sem-page-fg); }`

### Utilities Layer Rules

`html, body { overflow-x: hidden; width: 100%; max-width: 100%; }`

### Logo Assets (4 SVG files)

Byte-copied from `frontend/src/assets/Medicare logo/solid/` to `frontend/src/assets/logo/`:

- `medicare-logo-full-on-light.svg` (20,683 bytes, sha256 `f66bd7205ae435f1bbac2e10ad3eca3a70e961b26d39b928bdf936da6cd8fc61`)
- `medicare-logo-full-on-dark.svg` (20,683 bytes, sha256 `e9d7f509c7006ecfaf2b508933dd83581f0e25230adc2f35987d2d1978243232`)
- `medicare-logo-icon-on-light.svg` (10,558 bytes, sha256 `d8ff46519c4ea4d3c904be6a7cbd113648303d77d50545d06ff681a8d4ddc1ce`)
- `medicare-logo-icon-on-dark.svg` (10,660 bytes, sha256 `21f5b154904eec03206172e4009b79be58f3e02f9d9659ce50dafef5e2ea3058`)

Source files remain in place. All sha256 hashes match design.md values.

## Added

### Design System Infrastructure

**Three-layer token architecture** (Requirements 10, 11):
- 77 Primitive_Tokens (`--prim-*`) holding raw hex, oklch literals or rgb values
- 69 Semantic_Tokens (`--sem-*`) with separate light (`:root`) and dark (`.dark`) values
- `@theme inline` mappings exposing each semantic role as `--color-<role>`

**Dark mode runtime** (Requirements 9, 21):
- `next-themes@^0.4.6` installed (resolved 0.4.6)
- `src/components/theme/theme-mode.ts` (pure helpers: `THEME_MODES`, `ThemeMode`, `isThemeMode`, `toThemeMode`, `ToggleKey`, `nextOptionIndex`, `checkedStates`)
- `src/components/theme/theme-provider.tsx` (client component wrapping `next-themes` with `ThemeModeGuard`)
- `src/components/theme/theme-toggle.tsx` (keyboard-accessible radiogroup with Light/Dark/System options)
- `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`
- `color-scheme: light` on `:root`, `color-scheme: dark` on `.dark`
- `suppressHydrationWarning` on `<html>` only

### Font Loading

**Montserrat Alternates** via `next/font/google` (Requirements 5, 6):
- Loaded in `src/app/layout.tsx` with `subsets: ["latin"]`, `weight: ["400", "500", "700", "900"]`, `style: ["normal"]`, `display: "swap"`, `variable: "--font-montserrat-alternates"`
- Applied to `<html>` via `montserratAlternates.variable` class
- Base_Font_Stack: `var(--font-montserrat-alternates), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif`
- Set as `--font-sans` in `@theme inline` (replaces Geist Sans default)
- `--font-montserrat` token set to `var(--font-montserrat-alternates), sans-serif`

**Changes from create-next-app defaults**:
- Removed Geist and Geist_Mono imports and classes
- Removed `antialiased` class from `<html>`
- Updated `metadata.title` to `"Medicare"`
- Removed placeholder `description`

### App Icons

- `src/app/icon.svg`: byte copy of `medicare-logo-icon-on-light.svg` (10,558 bytes, sha256 verified)
- `src/app/apple-icon.tsx`: 180×180 PNG via `ImageResponse`, icon SVG embedded as base64 data URI
- `src/app/favicon.ico`: unchanged from baseline (sha256 `bdbf6368f723439dd993e0ddd22725e4422ae3bd1c4a4e400aa7d13c22b76523`)

### Tailwind Plugins (3 packages)

Installed via `npm install -D` with no force flags (Requirements 8.1–8.7):

| Package | Specifier | Resolved | Section |
|---------|-----------|----------|---------|
| `@tailwindcss/forms` | `^0.5.10` | 0.5.11 | devDependencies |
| `@tailwindcss/typography` | `^0.5.16` | 0.5.20 | devDependencies |
| `@tailwindcss/aspect-ratio` | `^0.4.2` | 0.4.2 | devDependencies |

All plugins loaded via `@plugin` directives in `globals.css` after `@import "tailwindcss"`.

### Reduced Motion Support (Requirement 12.6)

`@media (prefers-reduced-motion: reduce)` block as the last rule in `globals.css`:
- `animation: none !important` on all 11 animation selectors (including `.animate-medical-dots::after`)
- `opacity: 0` on `.animate-medical-pulse-ring`
- `transition-duration: 0.01ms !important` on `*`, `*::before`, `*::after`

### Design Check Route (Requirement 14)

Temporary verification route at `/design-check` (outside scope of Requirement 1.1, approved for feature):

**Files created**:
- `src/app/design-check/page.tsx`: server component with `metadata = { title: "Design check", robots: { index: false, follow: false } }`
- `src/app/design-check/_components/design-check.tsx`: client component with all verification sections
- `src/app/design-check/_components/swatch.tsx`: token display with contrast ratio and pass/fail
- `src/app/design-check/_lib/contrast.ts`: WCAG 2.x relative-luminance contrast functions
- `src/app/design-check/_lib/css-color.ts`: computed color parser
- `src/app/design-check/_lib/token-store.ts`: external store for live token resolution
- `src/app/design-check/_lib/tokens.ts`: token name lists and intended-pair table
- `src/app/design-check/_checks/legacy-inventory.report.mjs`: hex inventory scanner
- `src/app/design-check/_checks/run-all.mjs`: check runner with `--stage` parameter
- Multiple `.check.mjs` property test scripts (seeded PRNG, 100+ iterations)

**Verification sections** (Requirements 12.10, 14.6–14.8):
- Header with current theme mode, resolved theme and Theme_Toggle
- Typography samples (font stacks, weights, sizes)
- Primitive and semantic token swatches with contrast ratios
- Button states (primary, secondary, focus, hover)
- Form controls (native and styled inputs, selects, textareas)
- Cards, status badges, status chips
- Alert samples (success, warning, danger, info, emergency)
- Modal overlay demonstration
- Motion samples (all 11 animations)
- Ported plain classes (glass, scrollbar, gradients)
- Utility coverage (semantic tokens, legacy tokens, plugin utilities, variants)

**Removability** (Requirement 14.1): Deleting `src/app/design-check/` removes the route; lint, typecheck and build pass with the folder deleted.

### Semantic Token Roles (69 tokens)

Surface tokens: `page`, `surface`, `surface-muted`, `surface-subtle`, `surface-hover`, `surface-control`, `surface-control-hover`, `input-bg`, `glass-surface`, `hero-gradient-deep`, `skeleton-base`, `skeleton-highlight`

Text tokens: `page-fg`, `text`, `text-heading`, `text-body`, `text-label`, `text-muted`, `text-subtle`, `input-placeholder`

Border tokens: `border`, `border-subtle`, `border-default`, `glass-border`

Brand tokens: `brand`, `brand-hover`, `on-brand`, `primary`, `secondary`, `accent`

Auth tokens: `auth-primary`, `auth-primary-hover`, `on-auth-primary`

Status tokens (5 statuses × 3 tokens each): `success`, `success-fg`, `success-subtle`, `success-text`, `warning`, `warning-fg`, `warning-subtle`, `warning-text`, `danger`, `danger-fg`, `danger-subtle`, `danger-text`, `info`, `info-fg`, `info-subtle`, `emergency`, `emergency-fg`, `emergency-subtle`

Input tokens: `input-border`, `input-border-focus`, `input-focus-ring`

Other tokens: `focus-ring`, `shadow`, `overlay`, `scrollbar-track`, `scrollbar-thumb`, `scrollbar-thumb-end`, `scrollbar-thumb-hover`, `scrollbar-thumb-hover-end`, `chart-1` through `chart-6`, `gradient-text-start`, `gradient-text-end`

### Owner-Approved File Outside Requirement 1.1 List

**File**: `src/app/page.tsx` (owner decision D2, Requirement 1.7)

**Changes**: Replaced utilities that depend on removed create-next-app tokens:
- "Deploy Now" link: `bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]` → `bg-brand text-on-brand hover:bg-brand-hover`
- "Documentation" link: `dark:hover:bg-[#1a1a1a]` → `dark:hover:bg-surface-hover`

All other markup, content and classes unchanged. No legacy page ported.

## Skipped

### Fonts

**Satoshi** (Requirements 5.6, 6.3, 6.4): Not loaded in the Target_App. Dropped by project owner decision; base font is Montserrat Alternates (Requirement 2.8).

**Inter** (Requirement 5.6): Not loaded. Used ad hoc in Legacy_App by inline `<link>` tags in three files. Listed as skipped with reason "not a Legacy_Token; ad hoc loads in feature components are outside the design-only scope (Requirement 1.2)."

### Ambiguous Inventory Values (Requirement 4.5)

65 hex values occur in only one file or have no single semantic role accounting for more than half of occurrences. Examples: `#6236ff` (10 occurrences, `pages/Team.jsx`), `#b91c1c` (9, `pages/Doctor/EmergencyFolder.jsx`). Full list in `final-report-draft.md`.

### CSS Rules Omitted from Porting (Requirement 3.12)

Five legacy rules were intentionally not ported:

1. **Fontshare `@import` for Satoshi**: Replaced by next/font (Requirement 5.3)
2. **`font-family: 'Satoshi', sans-serif` on `html` and `body`**: Replaced by Base_Font_Stack (Requirements 2.8, 5.4)
3. **`@custom-variant dark (&:is(.dark *))`**: Replaced by `@custom-variant dark (&:where(.dark, .dark *))` with `:where()` for lower specificity (Requirement 9.8)
4. **`#root` selector**: Target_App has no element with `id="root"`
5. **Legacy `@media (prefers-reduced-motion: reduce)` block**: Replaced by comprehensive reduced-motion block covering all 11 animation classes (Requirement 12.6)

## Intentional Deviations

### Base Font Change (Requirements 2.8, 5.4, 5.5)

**CSS property**: `font-family` on `html`, `body` and `--font-sans`

**Legacy_App value**: `'Satoshi', sans-serif` (Satoshi loaded from Fontshare at 400/500/700/900)

**Target_App value**: `var(--font-montserrat-alternates), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif`

**Reason**: Owner decision to drop Satoshi. Montserrat Alternates loaded via next/font with the same weights (400/500/700/900) to maintain the same CSS font matching behavior for `font-semibold` (600 → 700 face) and `font-extrabold` (800 → 900 face).

### Legacy Token Now Loading a Font (Requirement 2.9)

**Token**: `--font-montserrat`

**Legacy_App**: Configured in `tailwind.config.js` and `@theme`, but font never loaded (no `@import`, no `<link>`); 0 usages in `frontend-react/src` outside `index.css`

**Target_App**: Set to `var(--font-montserrat-alternates), sans-serif` and font actually loads via next/font

**Reason**: Design system completeness. The Legacy_Token stays available with the same name for feature porting.

### Palette Utility Substitutions (Requirement 2.7)

When a hardcoded hex value in the inventory matched a Tailwind v3 default palette hex, and that palette utility was used in a legacy `@utility` class, the semantic token was mapped to a Primitive_Token holding the original hex value instead of referencing the Tailwind v4 `oklch()` variable. This ensures exact 8-bit sRGB channel match in light mode.

Examples:
- `text-gray-700` (`oklch(37.3% 0.034 259.733)` ≈ rgb(54, 65, 83)) → `--prim-tw-gray-700: oklch(37.3% 0.034 259.733)`
- Inventory `#64748b` → `--prim-slate-500: #64748b`
- Both used for `text-label` and `text-muted` roles in different contexts

Full mapping table in `final-report-draft.md` with computed sRGB approximations.

## Approved Deviation: Palette Refresh (Requirement 2.10)

The owner replaced the legacy colors with the refined palette in `frontend/DESIGN.md` sections 3.2 and 3.3. This supersedes the original rule that light values equal the Legacy_App (Requirement 2 criteria 2, 3, 5 and 7, colors only). Every change below is an approved deviation. Non-color values (breakpoint `xs`, `--shadow-custom`, class names, keyframes, layout utilities) are unchanged.

### Light values that changed

| Token | Legacy_App light value | New light value | Reason |
| :--- | :--- | :--- | :--- |
| `page` | `#ffffff` | `#f6f7fb` | New canvas color, so white surfaces read as cards |
| `surface-muted` | `#f1f5f9` | `#edeff7` | New neutral ramp |
| `text` | `#0f172a` | `#12152e` | New neutral ramp (ink) |
| `text-muted` | `#64748b` | `#525a7d` | New neutral ramp (ink) |
| `border` | `#e8edf5` | `#d5d9e8` | New neutral ramp (ink) |
| `brand-hover` | `#3b3b98` | `#1a1e4a` | Darker hover state (navy-900) |
| `secondary` | `#b8c5fd` | `#4a55b0` | Legacy value was low contrast as text (DESIGN.md 3.4) |
| `accent` | `#e8c3d5` | `#0b7c78` | Legacy value was low contrast (DESIGN.md 3.4) |
| `success` | `#10b981` | `#16763f` | Status color darkened for text contrast |
| `success-subtle` | `oklch(96.2% 0.044 156.743)` | `#ddf3e5` | Legacy value was Tailwind v4 green-100 (oklch); now a primitive hex |
| `warning` | `#f59e0b` | `#9a5b06` | Status color darkened for text contrast |
| `warning-subtle` | `oklch(97.3% 0.071 103.193)` | `#fbefd3` | Legacy value was Tailwind v4 yellow-100 (oklch); now a primitive hex |
| `danger` | `#ef4444` | `#c2294b` | Status color darkened for text contrast |
| `danger-subtle` | `oklch(93.6% 0.032 17.717)` | `#fbe3e8` | Legacy value was Tailwind v4 red-100 (oklch); now a primitive hex |
| `emergency` | `#dc2626` | `#b3260e` | Distinct from danger (rose vs vermilion) |
| `emergency-subtle` | `oklch(97.1% 0.013 17.38)` | `#fbe1da` | Legacy value was Tailwind v4 red-50 (oklch); now a primitive hex |

Legacy_Tokens (`primary`, `secondary`, `accent`): `primary` keeps `#252a61` and becomes an alias of `brand`; `secondary` and `accent` take the values above.

### Light values that did not change

`surface` (`#ffffff`), `brand` (`#252a61`), `on-brand` (`#ffffff`), `emergency-fg → on-emergency` (`#ffffff`), `overlay` (`#000000`).

### Semantic tokens added

`border-strong` (`#8089ab`), `secondary-subtle` (`#e6e9f9`), `on-secondary-subtle` (`#2f3880`), `accent-hover` (`#096360`), `on-accent` (`#ffffff`), `accent-subtle` (`#ddf3f1`), `on-accent-subtle` (`#075350`).

### Semantic tokens retired (Legacy_App light value in brackets)

Retired because the new palette has no token for them. Ported classes now use the tokens listed in the next table.

`page-fg` (`#000000`), `surface-subtle` (`#f8fafc`), `surface-hover` (`oklch(98.5% 0.002 247.839)`), `surface-control` (`oklch(96.7% 0.003 264.542)`), `surface-control-hover` (`oklch(92.8% 0.006 264.531)`), `text-heading` (`oklch(21% 0.034 264.665)`), `text-body` (`oklch(44.6% 0.03 256.802)`), `text-label` (`oklch(37.3% 0.034 259.733)`), `text-subtle` (`#475569`), `border-subtle` (`oklch(96.7% 0.003 264.542)`), `border-default` (`oklch(92.8% 0.006 264.531)`), `primary` (`#252a61`), `auth-primary` (`#4318ff`), `auth-primary-hover` (`#3311db`), `on-auth-primary` (`#ffffff`), `success-fg` (`#0f172a`), `warning-fg` (`#0f172a`), `danger-fg` (`#0f172a`), `info` (`#0ea5e9`), `info-fg` (`#0f172a`), `info-subtle` (`oklch(95.1% 0.026 236.824)`), `success-text` (`oklch(44.8% 0.119 151.328)`), `warning-text` (`oklch(47.6% 0.114 61.907)`), `danger-text` (`oklch(44.4% 0.177 26.899)`), `input-bg` (`#ffffff`), `input-border` (`oklch(87.2% 0.01 258.338)`), `input-border-focus` (`oklch(80.9% 0.105 251.813)`), `input-focus-ring` (`oklch(93.2% 0.032 255.585)`), `input-placeholder` (`oklch(55.1% 0.027 264.364)`), `focus-ring` (`#252a61`), `shadow` (`#000000`), `glass-surface` (`#ffffff`), `glass-border` (`#ffffff`), `skeleton-base` (`#e2e8f0`), `skeleton-highlight` (`#ffffff`), `scrollbar-track` (`#f3f4f6`), `scrollbar-thumb` (`#93c5fd`), `scrollbar-thumb-end` (`#c4b5fd`), `scrollbar-thumb-hover` (`#93c5fd`), `scrollbar-thumb-hover-end` (`#c4b5fd`), `chart-1` (`#6366f1`), `chart-2` (`#8b5cf6`), `chart-3` (`#10b981`), `chart-4` (`#0ea5e9`), `chart-5` (`#f59e0b`), `chart-6` (`#f97316`), `gradient-text-start` (`#667eea`), `gradient-text-end` (`#764ba2`), `hero-gradient-deep` (`#1a1f4a`).

### Ported class mapping

| Class | Legacy_App colors | Tokens now used |
| :--- | :--- | :--- |
| `nav-link` | `text-black`, `hover:text-brand`, `hover:bg-gray-50` | `inline-flex items-center min-h-11`, `text-text`, `hover:text-brand`, `hover:bg-surface-muted` |
| `mobile-nav-link`, `menu-item` | `text-gray-700`, `hover:bg-gray-50` | `text-text`, `hover:bg-surface-muted`; `mobile-nav-link` and `menu-item` also `min-h-11` |
| `card` | `bg-white`, `border-gray-100` | `bg-surface`, `border-border` |
| `form-input` | `border-gray-300`, white background, blue focus ring and border | `min-h-11`, `border-border-strong`, `bg-surface`, `text-text`, `placeholder:text-text-muted`, `focus:ring-brand`, `focus:border-brand` |
| `form-label` | `text-gray-700` | `text-text` |
| `btn-primary` | `bg-brand`, `text-white`, hover `bg-brand-hover` | `bg-brand`, `text-on-brand`, `hover:bg-brand-hover` (unchanged names) |
| `btn-secondary` | `bg-gray-100`, `text-gray-700`, `hover:bg-gray-200` | `bg-secondary-subtle`, `text-on-secondary-subtle`, `border-secondary`, `hover:border-brand` (background stays `secondary-subtle` on hover) |
| `heading-1`, `heading-2` | `text-gray-900` | `text-text` |
| `body-text` | `text-gray-600`, 14px below 640px and 16px above | `text-base text-text` (16px/24px at all widths) |
| `status-badge-success`, `-warning`, `-error` | `bg-green-100 text-green-800` and the yellow and red equivalents | `bg-success-subtle text-success`, `bg-warning-subtle text-warning`, `bg-danger-subtle text-danger` |
| `.glass`, `.glass-*`, `.mobile-search-modal`, `.glass-effect` | white at 10 to 98% alpha, white border, black shadows | `color-mix` of `--sem-surface`, `--sem-border` and `--sem-overlay` at the same alpha values |
| `.custom-scrollbar` | blue-to-violet gradient thumb (`rgb(147 197 253)`, `rgb(196 181 253)`), gray track | solid thumb `--sem-secondary` at 80%, hover `--sem-brand`, track `--sem-surface-muted` at 50% |
| `.gradient-text` | `#667eea` to `#764ba2` | `--sem-brand` to `--sem-secondary`. **Deprecated, remove when unused** (owner decision; also marked in DESIGN.md section 9.1) |
| `.skeleton-medical` | slate-200 and white at 70% and 90% | `--sem-surface-muted` and `--sem-border` at 70% and 90% |
| `.animate-medical-dots` | `rgb(71 85 105)` | `--sem-text-muted` |
| `.animate-medical-pulse-ring`, `status-pulse`, `.search-focus-animation`, `.mobile-search-input`, `.mobile-search-btn`, `.modern-button`, `.card-hover`, `.mobile-search-overlay` | `rgba` literals (blue 59 130 246, green 34 197 94, black, white) | `color-mix` of `--sem-brand`, `--sem-success`, `--sem-overlay`, `--sem-surface` at the same alpha values |

Focus: one global `:focus-visible { outline: 2px solid var(--sem-brand); outline-offset: 2px }` rule in `@layer base` (owner decision, so DESIGN.md section 11 is true). `form-input` keeps its own `focus:ring-brand` ring.

Legacy violet auth color, the `auth-primary` tokens, the `hero-gradient-deep` token and the chart tokens have no replacement. DESIGN.md section 13 says authentication screens use `brand`.

## Step B: DESIGN.md and Contrast Recompute

- `frontend/DESIGN-NEW.MD` became the only design document, `frontend/DESIGN.md`. The stale `DESIGN.MD` was deleted (on this case-insensitive disk it was the same file as `DESIGN.md`); the rename went through a temporary name. The repository-root `DESIGN.md` was not touched.
- TODOs filled from code: tech stack versions (package.json and lockfile), TypeScript `strict`, fallback font stack, loaded weights and class-to-face mapping, type scale for `heading-1`, `heading-2`, `body-text` and `form-label`, radius steps, elevation values, `container-custom`, `section` and the three grids, motion easing wording. 22 `TODO: confirm` entries remain (owner, license, icon library and sizes, button/input/alert/table/toast states, logo clear space and minimum size, role route groups).
- Section 3.5 was recomputed from the real tokens with the contrast module that `/design-check` uses. **All 24 pairs that were already in the table match to two decimals and none is below its minimum.** The old `TODO: measure` (`border-strong` on `page`, dark) is 4.36.
- Pairs added at the owner's request: `brand` on `surface-muted` 11.56 light / 8.08 dark; `text` on `surface-muted` 15.60 / 14.06; `on-secondary-subtle` on `surface-muted` 9.15 / 10.13. `border` on `surface` is reported as "decorative, no minimum" (1.41 / 1.46).
- Also checked: the global focus ring (`brand`) on `page` and `secondary-subtle` is 12.40 / 10.99 light and 9.56 / 7.08 dark, above the 3:1 minimum.

### New finding: one failing pair

| Pair | Light | Dark | Minimum |
| :--- | :--- | :--- | :--- |
| `border-strong` on `secondary-subtle` (the `btn-secondary` border) | **2.86** | 3.23 | 3 (UI) |

Not edited, per the instruction to report rather than change values. It is listed under "Known contrast exceptions" in DESIGN.md section 11. Options: use a darker border token on this button, or drop the border and rely on the fill.

### Open conflict

`body-text` is 14px below 640px, while DESIGN.md section 11 says body text is at least 16px. Marked `TODO: confirm` in section 4.2.

## Step C: Resolved Items and Compare Scope

Owner decisions applied (all in `src/app/globals.css` unless noted):

| Decision | Change | Measured result |
| :--- | :--- | :--- |
| `btn-secondary` border | `border-secondary` default, `hover:border-brand`, background stays `secondary-subtle`; `border-border-strong` removed | Border `rgb(74, 85, 176)` light, `rgb(143, 154, 230)` dark. Contrast on `secondary-subtle`: 5.40 / 5.37 (default), 10.99 / 7.08 (hover), minimum 3 |
| `body-text` size | `text-base` at all breakpoints (was `text-sm sm:text-base`) | 16px / 24px at 320px and 1280px |
| Touch targets | `min-h-11` on `btn`, `form-input`, `nav-link`, `mobile-nav-link`; `nav-link` also `inline-flex items-center` | 44px for `btn-primary`, `btn-secondary`, `form-input`, `nav-link`; 48px for `mobile-nav-link`; no horizontal scroll at 320px or 1280px |

Why `nav-link` changed display: `min-height` has no effect on an inline `<a>`, which is `nav-link`'s default. `inline-flex` fixes that and keeps it inline-level. No layout class (`container-custom`, `section`, `grid-responsive-*`) is applied by another class in `globals.css`, so none is affected; no `<h-*>` utility is combined with these classes in `src`. `menu-item` was not in that decision; Step D added `min-h-11` to it (44px).

Other files: `DESIGN.md` sections 3.5, 4.2, 9.1, 10.1 and 11; `design-check/_lib/tokens.ts`; `design-check/_components/samples.tsx` (forced hover state of `btn-secondary` is now a border).

Pair table: the previous failing row (`border-strong` on `secondary-subtle`, 2.86 light) is removed and "Known contrast exceptions" is now "None". `INTENDED_PAIRS` has 60 entries (30 per theme, no duplicates). It gained `secondary`/`secondary-subtle`, `brand`/`secondary-subtle`, and, to match section 3.5 exactly, `text`/`surface-muted`, `brand`/`surface-muted`, `brand`/`page` and `on-secondary-subtle`/`surface-muted`. The failing pair was never in `tokens.ts`.

### Compare scope (`:root, .light`)

The semantic light block selector changed from `:root` to `:root,\n.light`. The check parser (`_checks/lib/css.mjs`) now classifies `:root, .light` as the root block. No value changed.

Verified in headless Chrome on a static page built from the compiled stylesheet (four nestings: light page, dark page, `.light` inside `.dark`, `.dark` inside that):

| Scope | `surface` | page | `color-scheme` |
| :--- | :--- | :--- | :--- |
| light page | `rgb(255, 255, 255)` | `rgb(246, 247, 251)` | light |
| dark page | `rgb(16, 20, 58)` | `rgb(10, 13, 34)` | dark |
| `.light` inside `.dark` | `rgb(255, 255, 255)` | `rgb(246, 247, 251)` | light |
| `.dark` inside that | `rgb(16, 20, 58)` | `rgb(10, 13, 34)` | dark |

Known limitation (measured, not fixed): Tailwind's `dark:` variant is `.dark, .dark *`, so a `dark:bg-danger` element inside `.light` inside `.dark` still turns on (`rgb(194, 41, 75)`). Tokens scope correctly; `dark:` utilities do not. Nothing in the design system needs `dark:`, and DESIGN.md section 10.1 says to use tokens inside a scope. A scope also sets only token values, not `background-color` or `color`; the scope element needs `bg-page text-text`. `next-themes` already puts a `light` class on `<html>` in light mode, which now matches `.light`; it declares the same values as `:root`, so nothing changes.

## Step D: /design-check Dashboard Rebuild

The page was rebuilt from scratch as an internal dashboard. The old `design-check.tsx`, `samples.tsx`, `section.tsx`, `status.tsx` and `swatch.tsx` were deleted. `_checks/` and the contrast module are kept; the contrast math is not duplicated (`_lib/evaluate.ts` calls `contrast.ts`).

### Files (`src/app/design-check/`, 2,787 lines in 33 files outside `_checks/`)

| Area | Files |
| :--- | :--- |
| Route | `page.tsx` (metadata `noindex, nofollow`; `notFound()` when `NODE_ENV` is `production`) |
| Server components | `dashboard.tsx`, `shell.tsx`, `panel.tsx`, `component-samples.tsx`, `status-samples.tsx`, `scales.tsx`, `semantic-chips.tsx`, `badges.tsx`, `icons.tsx` |
| Client components | `dashboard-provider.tsx`, `side-nav.tsx`, `overview.tsx`, `palette.tsx`, `semantic-table.tsx`, `contrast-matrix.tsx`, `typography.tsx`, `motion.tsx`, `compare.tsx`, `touch-targets.tsx`, `field-sample.tsx`, `copy-button.tsx` |
| `_lib/` (new) | `dashboard-store.ts`, `evaluate.ts`, `palette.ts`, `format.ts`, `hooks.ts`, `sections.ts`, `motion.ts` |
| `_lib/` (changed) | `token-store.ts`: `createDomStyleSource` takes an optional `light` or `dark` scope; behavior without it is unchanged |

Other files: `globals.css` (`menu-item` gets `min-h-11`), `_checks/build-output.check.mjs` (see below), `DESIGN.md` (section 9.4, section 11).

### How token discovery works

Primitive tokens are measured once on `<html>`. Semantic tokens are measured twice, in a hidden `.light` probe and a hidden `.dark` probe, so both themes are known at the same time whatever theme the page is in. Each value is read with `getComputedStyle`, parsed, and formatted as hex at runtime. Token names come from `_lib/tokens.ts`, which is checked against `globals.css` by `p04`. The server renders a placeholder and the browser measures after hydration, so there are no hydration mismatches. The semantic table's "resolved primitive" is found by matching the measured value to the one primitive that has it (all 51 values are unique). Nothing resolved to "unresolved" in the verification runs.

### Verification (headless Chrome, dev server on port 3000)

| Measurement | 1280 light | 1280 dark | 320 light | 320 dark |
| :--- | :--- | :--- | :--- | :--- |
| `<html>` class | light | dark | light | dark |
| Page background | `rgb(246, 247, 251)` | `rgb(10, 13, 34)` | `rgb(246, 247, 251)` | `rgb(10, 13, 34)` |
| Document scroll width | 1280 | 1280 | 320 | 320 |
| `<main>` scroll / client width | 992 / 992 | 992 / 992 | 320 / 320 | 320 / 320 |
| Elements wider than the viewport outside their own scroll container | 0 | 0 | 0 | 0 |
| Sections rendered | 9 of 9 | 9 of 9 | 9 of 9 | 9 of 9 |
| `h1` count / heading-level skips | 1 / 0 | 1 / 0 | 1 / 0 | 1 / 0 |
| Console errors or warnings | 0 | 0 | 0 | 0 |

Counts in every run: 51 palette swatches, 28 semantic rows, 60 matrix rows, overview "51 | 28 | 60 | 30 pass, 0 fail | 30 pass, 0 fail". Minimum control heights: `btn` 44, `form-input` 44, `nav-link` 44, `mobile-nav-link` 48, `menu-item` 44.

Interactions (1280 light): first Tab stop is "Skip to content"; the sidebar stays at top 0 while `<main>` scrolls (4,612px) and the active link follows ("03 Semantic tokens"); the Failing filter shows 0 rows with "No pairs match this filter."; Text shows 48 rows and UI shows 12; sorting by ratio runs 3.22 to 17.91 ascending and back descending with `aria-sort`; selecting a swatch announces "Copied --prim-white" in the polite live region; touch-target outlines turn on dashed 2px on buttons and links and not on cards; compare mode renders a light box (`rgb(246, 247, 251)`) and a dark box (`rgb(10, 13, 34)`) with 0 duplicate ids; the theme toggle switches to dark and back.

Production: a production server on a spare port returned 404 for `/design-check`, with no dashboard markup and `noindex`. `/design-check/` redirected 308 and an RSC request 307, and both ended in 404. `/` returned 200. The server was stopped afterward; port 3101 no longer answers.

### Gates

| Command | Exit | Result |
| :--- | :--- | :--- |
| `npm run lint` | 0 | 0 problems |
| `npx tsc --noEmit` | 0 | 0 lines |
| `npm run build` | 0 | compiled in 538 ms, 7 of 7 static pages; one warning (multiple lockfiles, as before) |
| `run-all --stage=2` | 0 | 5 passed, 0 failed (`build-output` 8 of 8, `repo` 7 of 7, `p05`: 0 raw hex in 47 files) |

Route code scan: 0 `dark:` utilities, 0 palette utilities, 0 `@ts-ignore`, `eslint-disable` or `any`. Four inline `style` props, all setting a color from a CSS variable (palette swatch, semantic chip, semantic table swatch, contrast "Aa" sample).

### Follow-up: scrolling fix, layout polish and Compare mode

- **Scrolling bug (reported with a screenshot).** Opening `/design-check#compare` scrolled the whole page: the sidebar title, theme toggle and first links went off screen and an empty strip showed below the content. Measured at 1440x790: the document was 19,936px tall (`docScrollH`) and scrolled 496px, because screen-reader-only elements inside `<main>` (table captions, the copy announcer) were absolutely positioned against the page, not against `<main>`. Fix: the shell is `relative` and clips its overflow, `<main>` is `relative`, and both scroll areas use `overscroll-contain`. After the fix the document height equals the viewport (790), the sidebar stays at top 0, and wheeling 60 times past the end leaves `<main>` at its maximum with nothing scrolling behind it.
- **Late layout shift.** The contrast matrix rendered one "Measuring" row on the server and 60 rows after hydration, which pushed later sections about 4,500px down after the browser had scrolled to the hash. It now renders all 60 rows with placeholders on the server, and a deep link is applied again once layout and fonts settle. Every one of the nine deep links now lands at 64px from the top, just under the top bar.
- **Polish.** Medicare logo (the matching file for each theme, shown as a rounded tile), grouped navigation (Foundations, Library, Tools) with an active marker, a sticky top bar with breadcrumb and a live pass/fail chip, section dividers, a page footer with "Back to top", and the long nav label shortened to "Scales and motion". The sidebar fits without scrolling down to a 650px window height (group labels hide below 720px). Scroll-spy now picks the last section that has started and selects the final section at the end of the page.
- **Compare mode.** Rebuilt after a screenshot showed 290px-wide boxes with cut-off tables. The component samples now use container queries, the state table became one card per class that reflows from 1 to 2 to 4 columns by its own width, and the Compare section sits in a wider wrapper (up to 1680px). Controls: a switch (on by default), Side by side or Stacked, and a chip per group. Each box has a sticky header with the theme's measured page, surface, text and brand colors. Measured: at 1440px the boxes are 532px each, side by side; across all nine groups there were 0 clipped elements and 0 page overflow at 1920, 1440, 661 and 320px; the section is 1568px wide at 1920px.
- **Gates after these changes:** lint exit 0, `tsc` exit 0, build exit 0, `run-all --stage=2` 5 passed and 0 failed, console clean at every size. Route code: 0 `dark:` utilities, 0 palette utilities, 0 suppressions or `any`; 5 inline `style` props, all CSS-variable colors.

### Bugs found and fixed during verification

- **Sticky sidebar.** `globals.css` sets `overflow-x: hidden` on `html` and `body`, which makes `body` compute `overflow-y: auto` and breaks `position: sticky` (measured: the sidebar scrolled away, top -1000). The global rule is a ported behavior and was not changed. The dashboard is an app shell instead: fixed-height layout where only `<main>` scrolls.
- **320px overflow.** The Typography panel's 26-letter alphabet line pushed `<main>` to 397px. Fixed with single-column grids and `min-w-0`; the scan went from 28 offenders to 0.
- **Sidebar clipping.** The long label "Spacing, radius, elevation, motion" was cut off; it now wraps from `lg` up.
- **Motion previews.** `animate-scroll` and the skeleton collapsed to zero width; the preview wrapper is now full width.
- **Raw hex in a comment** (`format.ts`) failed `p05`; reworded.

### Check changes

`build-output.check.mjs`: the stage-2 robots test expected `noindex, nofollow` in the prerendered `/design-check` HTML. That page now prerenders as a 404, so the check was replaced with one that asserts the real contract: the prerender status is 404, the HTML has no dashboard markup, and `page.tsx` declares `robots { index: false, follow: false }` and calls `notFound()` in production. It does not check the header-level `noindex, nofollow` of the 404 page itself, because Next adds only `noindex` there.

### Observations for you

- **Skeleton contrast.** `skeleton-medical` blends `surface-muted` and `border` at 70% and 90% over the card. On a `surface` card the shimmer is visible but quiet in light mode. That is the class's own design, not a dashboard issue; no token or class was changed.
- **Dev server staleness.** Your `next dev` served old CSS twice during this work (`menu-item` had no `min-height` until `globals.css` was touched again). If the page shows old values, restart `next dev`.
- **Terminal.** After stopping the production server, the shell session lost its `PATH` for a few commands (`grep`, `curl`, `sleep` not found). I finished with absolute paths. Nothing was changed on disk by that.

## Verification and Commits

### Build Verification (Requirements 15.1–15.7)

All commands run from `frontend/`:

**Baseline** (before any change):
- `npm run lint`: exit 0, 0 errors, 0 warnings
- `npx tsc --noEmit`: exit 0, 0 errors, 0 warnings
- `npm run build`: exit 0, 0 errors, 1 pre-existing warning (Next.js workspace root inference with multiple lockfiles)

**After implementation**:
- `npm run lint`: exit 0, 0 errors, 0 warnings
- `npx tsc --noEmit`: exit 0, 0 errors, 0 warnings
- `npm run build`: exit 0, 0 errors, 1 warning (same pre-existing warning)
- `node src/app/design-check/_checks/run-all.mjs --stage=2`: all checks pass

**Pre-existing warning** (not introduced by this feature):
```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of /Users/karangupta/Project/Medicare/package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * /Users/karangupta/Project/Medicare/frontend/package-lock.json
```

**Proposed action**: Left unchanged. Fixing requires editing `next.config.ts` (frozen by Requirement 1.9) or removing the repository-root `package-lock.json` (outside Requirement 1.1 scope).

### Property Tests (Requirements 15.1–15.7)

All 19 correctness properties verified via Node `.mjs` scripts using seeded PRNG (mulberry32) with 100+ iterations:

**Properties 1–19 validated**: Contrast ratio bounds/symmetry/reflexivity, compositing stays between foreground and background, formatting never changes pass/fail decision, semantic tokens complete in both themes, raw hex only in primitives, light values equal legacy values, primitive values unique, dark surfaces navy and darker than text, dark brand values calmer than light, intended contrast pairs meet thresholds (with exempt legacy failures), distinct tokens stay distinct, theme mode normalization, toggle arrow keys cycle, exactly one active toggle option, design-check token list matches stylesheet, unresolved tokens don't affect other swatches, every legacy class ported, reduced motion covers every animation, no palette utility in ported classes.

**Seeded PRNG**: Counterexamples reproducible; seed and first failure printed on test failure.

### Commits

commits deferred by owner

### Repository State (Requirements 1.3, 1.9, 8.2)

**Unchanged files**:
- All files under `frontend-react/`
- Root `DESIGN.md` (`/Users/karangupta/Project/Medicare/DESIGN.md`)
- `frontend/next.config.ts` (sha256 `bb409e5b989fb255dd2c0f8890ce9f2fd15a7b47af02ac0917ba4f132a336ac3`)
- `frontend/eslint.config.mjs`
- `frontend/tsconfig.json`

**Pre-existing `package.json` entries** (all preserved with identical name, section and specifier):
- `dependencies`: `next@16.4.6`, `react@19.3.0`, `react-dom@19.3.0`
- `devDependencies`: `@tailwindcss/turbopack@4.3.3`, `@types/node@^20`, `@types/react@^19`, `@types/react-dom@^19`, `babel-plugin-react-compiler@1.0.0`, `eslint@^9`, `eslint-config-next@16.4.6`, `tailwindcss@4.3.3`, `typescript@^5`

Lockfile versions for Next.js, React, React-DOM and Tailwind unchanged.

### Bundled Guides Consulted (Requirements 1.5, 1.8)

All guides in `frontend/node_modules/next/dist/docs/01-app/` named in design.md:

1. `01-getting-started/13-fonts.md` (8,705 bytes)
2. `03-api-reference/02-components/font.md` (31,665 bytes)
3. `03-api-reference/03-file-conventions/01-metadata/app-icons.md` (9,430 bytes)
4. `03-api-reference/04-functions/image-response.md` (5,818 bytes)
5. `03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` (16,658 bytes)
6. `03-api-reference/04-functions/generate-metadata.md` (49,304 bytes)
7. `02-guides/preventing-flash-before-hydration.md` (22,709 bytes)
8. `03-api-reference/03-file-conventions/layout.md` (21,144 bytes)
9. `01-getting-started/03-layouts-and-pages.md` (12,408 bytes)
10. `01-getting-started/11-css.md` (12,368 bytes)

All 10 guides exist; none missing. No Requirement 1.8 question needed.

## Font License

**Montserrat Alternates**: SIL Open Font License 1.1  
**License URL**: https://openfontlicense.org

Font loaded via `next/font/google` from Google Fonts. License information fetched from Google Fonts page at design time.

## Manual Browser Checks

These checks require a running server and browser. The implementer cannot run them under Requirements 8.1 and 15.4. The project owner performs them using the steps and expected results below.

**Commands** (run from `frontend/`):
- Development server: `npm run dev`
- Production server: `npm run build && npm run start`

### Check (a): No Wrong-Theme Flash (Requirement 9.6)

**Steps**:
1. Run `npm run build && npm run start` from `frontend/`
2. For each saved theme mode (localStorage.theme = "light", "dark", "system") and operating system preference (light, then dark):
   - Open Chrome DevTools
   - Navigate to Performance panel
   - Check "Screenshots" option
   - Hard-reload `/design-check`
   - Stop recording
   - Review all captured frame screenshots

**Expected**: Zero frames show a theme different from the resolved theme. No flash of light content when dark mode should apply, and vice versa.

### Check (b): Console Clean (Requirements 9.7, 21.2)

**Steps**:
1. Run `npm run dev` from `frontend/`
2. Open `/design-check` with Console panel visible
3. Test with no saved theme mode
4. Test with each saved mode: "light", "dark", "system"

**Expected**: No hydration warnings, no React `<script>` warning from next-themes inline script, no other React/Next.js warnings. Record any message verbatim if present.

### Check (c): Computed Spot Checks (Requirements 2.2, 2.3, 20)

**Steps**:
1. Run `npm run build && npm run start` from `frontend/`
2. Open `/design-check` in light mode
3. Inspect elements with classes: `card`, `btn-primary`, `btn-secondary`, `form-input`, `nav-link`, `status-badge-success`
4. Also inspect the default border color on `*` selector
5. Use `getComputedStyle()` to read color, background-color, border-color values
6. Compare with legacy app (`frontend-react/`) and Requirement 20 mapping table
7. Switch to dark mode and repeat
8. Compare dark computed values with design.md Requirement 20 table dark column

**Expected**: Light theme 8-bit sRGB channels equal legacy app values. Dark theme values match the Requirement 20 table.

### Check (d): Toggle Keyboard Navigation (Requirement 13.3)

**Steps**:
1. Navigate to `/design-check`
2. Press Tab until Theme_Toggle gains focus
3. Use Arrow keys (Right, Down, Left, Up) to cycle through options
4. Verify wrap-around (Right from System returns to Light; Left from Light goes to System)
5. Press Space to select current option
6. Press Enter to select current option
7. Reload page

**Expected**: Focus ring visible on focused option. `aria-checked` follows selection. Selected theme persists after reload (localStorage.theme updated).

### Check (e): Reduced Motion (Requirement 12.6)

**Steps**:
1. Open Chrome DevTools → Rendering tab
2. Enable "Emulate CSS media feature prefers-reduced-motion: reduce"
3. Navigate to `/design-check` motion section

**Expected**:
- All motion samples are static (no animation)
- `.animate-medical-pulse-ring` sample is hidden (opacity: 0)
- Transitions do not animate (transition-duration ≤ 0.01ms)

### Check (f): Fonts Self-Hosted (Requirement 5.9)

**Steps**:
1. Run `npm run start` from `frontend/` (production build)
2. Open Chrome DevTools → Network panel
3. Filter by "Font" resource type
4. Disable cache
5. Reload page

**Expected**: All font requests go to the application origin. Zero requests to `fonts.googleapis.com`, `fonts.gstatic.com` or `api.fontshare.com`. Montserrat Alternates loaded from `/_next/static/media/`.

## Items for Review

### Files Pending Owner Decision (Requirement 7.5, decision D3)

The following files exist in the Target_App but were not used or modified. Owner to decide: keep, delete or rename each.

| File | Size (bytes) | sha256 |
|------|--------------|--------|
| `src/app/favicon1.ico` | 432,254 | `549742813af13845173ec37a7c6595f612bdbb1210654537d16dff1e774047d7` |
| `src/app/favicon2.ico` | 4,286 | `7925bf55f3d7415fa20e0483991c9ab6e09c8f9765d32ee20ad498a173250e95` |
| `src/assets/Medicare logo/solid/medicare-logo-text-only-on-light.svg` | 12,520 | `fcda2efc65ba53cc2a332867ce2afa07a32c32c4fbfea697e2fe14c55749d569` |
| `src/assets/Medicare logo/solid/medicare-logo-text-only-on-dark.svg` | 12,520 | `4133b06f36adf7b502f3438ce306556f02e6a9ab885c68cdc7fdb3cd7c71ecc6` |
| `src/assets/Medicare logo/transparent/ medicare-logo-icon-tp-on-white.png` | 56,863 | `6cd71b712796c12d7c55dd6bcd848bcef72356c08394e14e5aea8a15fbe065d2` |
| `src/assets/Medicare logo/transparent/ medicare-logo-icon-tp-on-white.svg` | 7,937 | `7d0b2d9f57f5ac642f7c78e0cd24d46baf710a8f20267cea398cd10116a88c17` |
| `src/assets/Medicare logo/medicare_logo_text_only_curve_light copy.png` | 7,642 | `86c4b5855a559c0eecbf806b5774668eed48b2cf7b2df7bcea9e1cca4a973f0a` |

Note: Two filenames begin with a space character (` medicare-logo-icon-tp-on-white.*`).

### Root_Design_Doc Disagreements (Requirement 2.4)

| Item | Root_Design_Doc Value | Legacy_App Code Value | File(s) |
|------|----------------------|----------------------|---------|
| Hero gradient start | `#1a1f4d` | `#1a1f4a` (4 uses) vs `#1a1f4d` (1 use) | `pages/Service2.jsx`, `pages/Home.jsx` |
| Path prefix | `/Frontend/` | `frontend-react/` | All paths in root `DESIGN.md` |

**Action taken**: Code values used throughout. `hero-gradient-deep` token mapped to `#1a1f4a` (higher occurrence count).

### Light Legacy Contrast Failures (Requirements 12.1–12.3)

The following light-theme color pairs fail their WCAG 2.x minimum contrast ratio. All are copied exactly from the Legacy_App and are exempt from fixes (Requirement 12.3). Dark-theme values for these tokens pass their thresholds.

| Token Pair | Min | Light Ratio | Dark Ratio |
|------------|-----|-------------|------------|
| `text-muted` / `surface-muted` | 4.5 | 4.34 | 7.02 |
| `secondary` / `surface` | 4.5 | 1.69 | 12.03 |
| `accent` / `surface` | 4.5 | 1.59 | 13.28 |
| `success` indicator / `surface` | 3 | 2.54 | 9.02 |
| `warning` indicator / `surface` | 3 | 2.15 | 10.38 |
| `info` indicator / `surface` | 3 | 2.77 | 8.09 |
| `chart-3` / `surface` | 3 | 2.54 | 9.02 |
| `chart-4` / `surface` | 3 | 2.77 | 8.09 |
| `chart-5` / `surface` | 3 | 2.15 | 10.38 |
| `chart-6` / `surface` | 3 | 2.80 | 7.66 |
| `gradient-text-start` / `surface` | 4.5 | 3.66 | 7.64 |
| `input-border` / `input-bg` | 3 | 1.47 | 4.06 |
| `input-border-focus` / `input-bg` | 3 | 1.81 | 8.01 |
| `input-focus-ring` / `input-bg` | 3 | 1.22 | 5.82 |

Note: `gradient-text-start` passes 3:1 for large text. If `.gradient-text` is only used on large headings, this pair may be reclassified.

### Font Weight Counts (Requirement 5.10)

Legacy app (`frontend-react/src`) usage:

| Class / Weight | Count | Files |
|----------------|-------|-------|
| `font-medium` | 849 | — |
| `font-semibold` | 372 | — |
| `font-bold` | 295 | — |
| `font-extrabold` | 12 | 7 |
| `font-normal` | 7 | — |
| inline `fontWeight: 600` | 46 | — |
| inline `fontWeight: 800` | 21 | 9 |
| inline `fontWeight: 500` | 50 | 10 |
| inline `fontWeight: 700` | 32 | 9 |
| inline `font-weight: bold` | 2 | 1 |

**Total files using weight 600 (class + inline)**: 63

With Satoshi loaded at 400/500/700/900, CSS font matching resolved:
- 600 (semibold) → 700 face
- 800 (extrabold) → 900 face

Montserrat Alternates loaded with the same weights (400/500/700/900) to maintain identical font-matching behavior.

### Unused Tokens (Requirement 17.1)

| Token | Usages | Files | Note |
|-------|---------|-------|------|
| `primary` | 28 | 3 | `text-primary` (16), `bg-primary` (5), gradient stops (7) |
| `secondary` | 0 | 0 | **Unused** |
| `accent` | 1 | 1 | `to-accent` in `pages/NotFound.jsx` |
| `xs:` variant | 515 | 3 | Confirmed all 515 are variant uses (e.g., `xs:hidden`, `xs:block`); no false positives from substring matches |
| `font-montserrat` | 0 | 0 | **Unused** (outside `@theme`) |
| `shadow-custom` | 0 | 0 | **Unused** |

All six Legacy_Tokens remain defined per Requirement 2.1, even when unused.

### Ambiguous Items (Requirements 4.5, 4.6, 17.3)

**Near-duplicate pairs with channel differences ≤ 4** (no Semantic_Token assigned):

| Value A (count / files) | Value B (count / files) | ΔR ΔG ΔB |
|-------------------------|-------------------------|----------|
| `#1e1b4b` (10 / 7) | `#1a1f4a` (4 / 1) | 4 4 1 |
| `#1e1b4b` (10 / 7) | `#1a1f4d` (1 / 1) | 4 4 2 |
| `#1c204f` (2 / 1) | `#1a1f4d` (1 / 1) | 2 1 2 |
| `#334155` (5 / 5) | `#374151` (2 / 1) | 4 0 4 |
| `#a1b5fa` (1 / 1) | `#a5b4fc` (1 / 1) | 4 1 2 |
| `#eef1ff` (7 / 3) | `#ebf5ff` (1 / 1) | 3 4 0 |
| `#ebf5ff` (1 / 1) | `#eef2ff` (1 / 1) | 3 3 0 |
| `#f4f7fe` (16 / 2) | `#f0f7ff` (3 / 2) | 4 0 1 |
| `#f4f7fe` (16 / 2) | `#f5f3ff` (2 / 1) | 1 4 1 |
| `#f8fafc` (22 / 8) | `#f4f7fe` (16 / 2) | 4 3 2 |
| `#f4f7fe` (16 / 2) | `#f8fafd` (8 / 3) | 4 4 1 |
| `#f8fafc` (22 / 8) | `#f8fafd` (8 / 3) | 0 0 1 |
| `#f8fafd` (8 / 3) | `#fafbfc` (2 / 2) | 2 1 1 |

**Three same-role near-duplicate pairs** (one value chosen for the Semantic_Token):

| Pair | Chosen → Token | Reason |
|------|---------------|--------|
| `#1a1f4a` (4) vs `#1a1f4d` (1) | `#1a1f4a` → `hero-gradient-deep` | Higher count |
| `#f8fafc` (22) vs `#fafbfc` (2) | `#f8fafc` → `surface-subtle` | Higher count |
| `#0f172a` (35) vs `#111827` (3) | `#0f172a` → `text` | Higher count |

**Ambiguous inventory values** (no semantic role over 50% of uses):

65 values occur in only one file or have no dominant semantic role. Examples: `#6236ff` (10 / 1), `#b91c1c` (9 / 1), `#f472b6` (5 / 1), `#fef2f2` (5 / 1). Full list in `final-report-draft.md`.

**White usage** (Requirement 4.5 condition b): `#ffffff` 68 occurrences in 13 files; 57% text-on-color uses, 31% background uses. Mapped to three roles: `on-brand`, `on-auth-primary`, `surface`.

## Decisions Needed

### D12: Legacy or Latest Plugin Specifiers

**Current**: Plugin specifiers use the legacy versions (`^0.5.10`, `^0.5.16`, `^0.4.2`) to match the legacy app `package.json`.

**npm installed**: `@tailwindcss/forms@0.5.11`, `@tailwindcss/typography@0.5.20`, `@tailwindcss/aspect-ratio@0.4.2` (latest within ranges)

**Option 1 (current)**: Keep legacy specifiers `^0.5.10` and `^0.5.16` in `package.json`  
**Option 2**: Change to latest specifiers `^0.5.11` and `^0.5.20` to match resolved versions

**Commands to switch to Option 2**:
```bash
npm pkg set devDependencies.@tailwindcss/forms="^0.5.11"
npm pkg set devDependencies.@tailwindcss/typography="^0.5.20"
npm install
```

## Notes for Feature Porting

### Design Check Route is Temporary

`src/app/design-check/` is a temporary verification route (Requirement 14.1). It is outside the scope of Requirement 1.1 and exists solely for design system review.

**To remove**: Delete the `src/app/design-check/` folder. Lint, typecheck and build will pass with the folder deleted. The route at `/design-check` will return 404.

**No links exist**: No other page in the Target_App links to `/design-check`. The route is accessed only by direct URL entry.

### reactCompiler: true

`frontend/next.config.ts` has `reactCompiler: true` enabled. This setting was present before this feature and remains unchanged per Requirement 1.9. Review this setting when feature porting begins, as the React Compiler (babel-plugin-react-compiler@1.0.0) may affect component behavior.

### Semantic Token Usage

Feature components should use Semantic_Token utilities (`bg-surface`, `text-text-muted`, `border-border`) instead of hardcoded hex or palette utilities. This ensures components respect both light and dark themes without per-component overrides.

### Legacy Token Availability

All six Legacy_Tokens remain available with their original names:
- `bg-primary`, `text-primary`, `border-primary`
- `bg-secondary`, `text-secondary`, `border-secondary`
- `bg-accent`, `text-accent`, `border-accent`
- `xs:` variant
- `font-montserrat`
- `shadow-custom`

Components using these tokens from the legacy app will render correctly after porting.

### Font Weight Mapping

With Montserrat Alternates loaded at 400/500/700/900:
- `font-semibold` (600) → resolves to 700 face by CSS font matching
- `font-extrabold` (800) → resolves to 900 face by CSS font matching

This matches the legacy Satoshi behavior, so no visual weight change occurs.

## Cleanup

### On Feature Porting Start

1. **Delete the design check route**: `rm -rf frontend/src/app/design-check/`
2. **Remove this spec folder**: `rm -rf .kiro/specs/design-system-dark-mode/`
3. **Create `frontend/DESIGN.md`**: Copy from `.kiro/specs/design-system-dark-mode/DESIGN.md` (task 17.1 creates this file; task 19 marks it done)

### Favicon Type Mismatch (Requirement 17.4)

**Issue**: `frontend-react/index.html` declares `<link rel="icon" type="image/svg+xml" href="/logo.png">` but the file is actually PNG format (500×500, 8-bit RGBA).

**Status**: Reported only. Outside the scope of this design-only feature.

**Owner action**: If `/logo.png` should be SVG, convert the file. If it should be PNG, change the `type` attribute to `"image/png"`. The Target_App uses `favicon.ico` and `icon.svg` per Next.js conventions, so this mismatch does not affect the new app.
