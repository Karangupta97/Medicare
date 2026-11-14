# Implementation Plan: design-system-dark-mode

## Overview

The work runs in three stages, each ending at an owner Review_Stop:

1. Stage 1 (tasks 2–9): light tokens, fonts, logos and icons, the starter page fix, and the first Node checks.
2. Stage 2 (tasks 10–16): `next-themes`, dark values, Theme_Provider, Theme_Toggle and the `/design-check` route.
3. Stage 3 (tasks 17–19): `frontend/DESIGN.md`, the final verification run and the Final_Report.

All paths are relative to `frontend/` unless they start with `frontend-react/` or `.kiro/`. Language: TypeScript (Next.js 16.4.6, React 19.3.0, Tailwind CSS 4.3.3). Checks are Node `.mjs` scripts that use only built-ins (Testing Strategy in design.md). No test framework is added (Requirement 8.1).

Owner decisions that shape this plan:

- **Commits deferred (D1).** The tasks contain no `git add`, `git commit` or other staging steps. Creating commits (Requirements 18.1–18.3, 18.5, 18.6, 18.8, 18.11) is deferred by owner decision until D1 is resolved. Each stage still ends with a Review_Stop. The Final_Report states "commits deferred by owner" where commit hashes would go (Requirement 19.4). Only read-only git commands (`git branch --show-current`, `git status --porcelain`, `git diff --stat`) are used.
- **D2 = replace.** The owner approves changing `src/app/page.tsx` under Requirement 1.7. The change replaces its raw hex colors, and the utilities that break once the create-next-app tokens are removed, with Semantic_Token utilities (task 5.2). It is recorded in the Final_Report as an owner-approved file outside the Requirement 1.1 list.

Running notes for the Final_Report go in `.kiro/specs/design-system-dark-mode/final-report-draft.md`. This file is outside the Target_App, so Requirement 1.1 does not limit it.

## Tasks

- [x] 1. Preflight: branch check and baseline
  - [x] 1.1 Verify the branch before any change
    - Run `git branch --show-current` in `/Users/karangupta/Project/Medicare`
    - If the output is not exactly `migration/frontend-nextjs`, make zero file changes, report the branch name and ask the owner how to proceed. Do not continue to 1.2.
    - _Requirements: 18.9_
  - [x] 1.2 Record the baseline state
    - In `frontend/`, run `npm run lint`, `npx tsc --noEmit` and `npm run build` in that order; record each exit code and every error and warning verbatim in `final-report-draft.md`
    - Record a snapshot for later comparison: `git status --porcelain -- frontend-react DESIGN.md`; sha256 of `next.config.ts`, `eslint.config.mjs`, `tsconfig.json` and `src/app/favicon.ico`; the `dependencies` and `devDependencies` entries of `package.json`
    - Read `AGENTS.md` and list the bundled guides under `node_modules/next/dist/docs/01-app/` named in design.md "Bundled Next.js 16.4.6 guides consulted". If one is missing, ask the owner before using that API (1.8)
    - _Requirements: 1.3, 1.5, 1.8, 1.9, 8.2, 15.5_
    - _Design: Testing Strategy (run order step 1)_

### Stage 1: Light tokens

- [x] 2. Install the Tailwind plugins
  - [x] 2.1 Add `@tailwindcss/forms`, `@tailwindcss/typography` and `@tailwindcss/aspect-ratio`
    - Run `npm install -D @tailwindcss/forms@^0.5.10 @tailwindcss/typography@^0.5.16 @tailwindcss/aspect-ratio@^0.4.2` in `frontend/`, with no `--force` and no `--legacy-peer-deps`
    - If npm reports a peer-dependency error, stop and record the package, version, command and full message (8.4). Leave the Next.js, React and Tailwind versions unchanged.
    - Confirm that every pre-existing `package.json` entry has an identical name, section and specifier. Record each added package's section, specifier and resolved lockfile version in `final-report-draft.md`.
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
    - _Design: Architecture › Dependencies_

- [x] 3. Legacy inventory report script
  - [x] 3.1 Write `src/app/design-check/_checks/legacy-inventory.report.mjs`
    - Scans `.js`, `.jsx`, `.ts`, `.tsx`, `.css` and `.html` files under `frontend-react/src` and prints:
      - the hex inventory: normalized value, occurrence count, file count and the CSS properties seen (4.1)
      - single-file values (4.5) and near-duplicate pairs with every channel difference ≤ 4 (4.6)
      - font-weight class and numeric weight counts with file counts (5.10)
      - Legacy_Token usage counts, excluding the `@theme` block and substring matches such as `btn-primary` (17.1); `font-montserrat` usage files (17.5)
    - Reads the first bytes of `frontend-react/public/logo.png` to report its real format for the favicon type mismatch (17.4)
    - Contains no hex color literals (Requirement 10.5 applies to `.mjs` under `src`). The file name ends in `.report.mjs`, so the check runner does not pick it up.
    - Run it. Record the output in `final-report-draft.md`, along with any difference from the design-time inventory in design.md (Data Models › Primitive_Tokens). If a role assignment changes, ask the owner before diverging from design.md.
    - The `src/app/design-check/` folder has no `page.tsx` until task 14.11, so no route is served in stage 1. These files belong to the stage-2 file set.
    - _Requirements: 4.1, 4.5, 4.6, 5.10, 17.1, 17.2, 17.3, 17.4, 17.5_
    - _Design: Data Models › Hex inventory method, Unused Legacy_Tokens, Ambiguous and near-duplicate items_

- [x] 4. Globals_Stylesheet light layer (`src/app/globals.css`)
  - [x] 4.1 Replace the create-next-app defaults and add imports, plugins and light primitives
    - Remove `--background`, `--foreground`, the Geist `@theme inline` entries, the `prefers-color-scheme: dark` block and the Arial body rule
    - Write `@import "tailwindcss";` followed by one `@plugin` line each for forms, typography and aspect-ratio. Add no Fontshare or other remote `@import`.
    - Declare a `:root` block of `--prim-*` light primitives: the inventory hex values (lowercase 6-digit), the palette-derived `oklch()` literals copied from Tailwind `theme.css`, and the three scrollbar `rgb()` literals. Use the names in design.md. Values must be unique.
    - Add a CSS comment with the Tailwind v3 palette name next to each primitive that matches one (4.7)
    - _Requirements: 3.2, 3.9, 3.12, 4.2, 4.6, 4.7, 5.3, 10.7, 20.2_
    - _Design: Architecture › globals.css section order (1, 3); Data Models › Primitive_Tokens (inventory hex, palette-derived)_
  - [x] 4.2 Add the light Semantic_Tokens and the Tailwind theme mappings
    - In a second `:root` block, add every `--sem-*` token from the design.md Semantic_Tokens table with its light value as a single `var(--prim-*)` reference. This includes `primary`, `secondary`, `accent`, `on-brand`, `on-auth-primary`, the 15 status tokens, `{status}-text`, the input, scrollbar, glass, skeleton, chart, gradient, focus-ring, shadow and overlay tokens, and the Requirement 20 tokens.
    - Add `@theme { --breakpoint-xs: 320px; --shadow-custom: 0px 10px 20px rgba(0, 0, 0, 0.2); }`
    - Add `@theme inline` with `--font-sans` (the Base_Font_Stack), `--font-montserrat: var(--font-montserrat-alternates), sans-serif`, and one `--color-<role>: var(--sem-<role>)` line per Semantic_Token, including `--color-primary`, `--color-secondary` and `--color-accent`. Leave `--font-mono` alone.
    - Dark values come in task 11.1
    - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.7, 3.1, 4.3, 4.4, 5.2, 5.5, 10.1, 10.3, 10.7, 11.10, 11.11, 20.2_
    - _Design: Architecture › Layer model, skeleton; Data Models › Semantic_Tokens; Fonts_
  - [x] 4.3 Add the base and utilities layers
    - `@layer base`: the border-color compatibility rule on `*, ::after, ::before, ::backdrop, ::file-selector-button` using `var(--sem-border-default)`; `html, body { font-family: var(--font-sans); }`; `body { background-color: var(--sem-page); color: var(--sem-page-fg); }`
    - `@layer utilities`: `html, body { overflow-x: hidden; width: 100%; max-width: 100%; }`, with no `#root` rule
    - _Requirements: 3.3, 3.7, 3.11, 3.12, 5.4, 20.1_
    - _Design: Architecture › globals.css section order (7, 8)_
  - [x] 4.4 Port the 23 `@utility` classes in legacy order
    - Replace each Palette_Utility and hex arbitrary value with the Semantic_Token utility from the design.md "`@utility` classes after replacement" block and the Requirement 20 mapping table, keeping variant prefixes
    - `form-input` gains `bg-input-bg` and `placeholder:text-input-placeholder`. `btn`, `container-custom`, `section`, `grid-responsive-2/3/4`, `status-badge` and `scrollbar-hide` are copied unchanged.
    - _Requirements: 2.3, 3.4, 10.6, 20.1, 20.2, 20.6_
    - _Design: Ported Classes › Approach, `@utility` classes after replacement; Data Models › Requirement 20 mapping table_
  - [x] 4.5 Port the plain classes, unlayered, in legacy order
    - Port the glass, scrollbar, gradient border and ring, dropdown, search (including the `@media (max-width: 1023px)` suggestion classes), `.modern-button`, `.gradient-text` and plain `.card-hover` rules with the legacy selectors, pseudo-classes, pseudo-elements and media wrappers
    - Merge the duplicate `.custom-scrollbar` and `.mobile-search-overlay` rules using the winners in the design.md "Duplicate-class winners" table. Keep both `.card-hover` definitions in their legacy layers.
    - Rewrite `rgba` and hex colors in the classes covered by Requirement 11.7 and 11.5 as `color-mix(in srgb, var(--sem-*) N%, transparent)` with the legacy alpha. Leave the other `rgba` literals as listed in design.md.
    - _Requirements: 2.3, 3.6, 3.8, 10.6, 10.7, 11.7_
    - _Design: Ported Classes › Duplicate-class winners; Glass, overlay and scrollbar classes in dark mode_
  - [x] 4.6 Port the 11 keyframes and 11 animation classes
    - Keep the same names, stop percentages and values. The animation shorthands match Requirement 3.10. `.animate-medical-dots` uses `var(--sem-text-subtle)` and `.skeleton-medical` uses the skeleton tokens.
    - _Requirements: 3.5, 3.10, 10.6_
    - _Design: Ported Classes; Data Models › Semantic_Tokens (`text-subtle`, `skeleton-*`)_
  - [x] 4.7 Add the reduced-motion block as the last rule
    - Use the design.md "Reduced motion" block: `animation: none !important` on all 11 animation selectors (including `.animate-medical-dots::after`), `opacity: 0` for `.animate-medical-pulse-ring`, and `transition-duration: 0.01ms !important` on `*, *::before, *::after`. Do not port the legacy reduced-motion block.
    - The owner placed this in stage 1. design.md lists it under C2, which matters only when commits resume.
    - _Requirements: 3.12, 12.6_
    - _Design: Ported Classes › Reduced motion_

- [x] 5. Root_Layout font and starter page
  - [x] 5.1 Load Montserrat Alternates in `src/app/layout.tsx`
    - Read the bundled `13-fonts.md`, `font.md`, `layout.md` and `generate-metadata.md` guides first
    - Import `Montserrat_Alternates` from `next/font/google` with `subsets: ["latin"]`, `weight: ["400", "500", "700", "900"]`, `style: ["normal"]`, `display: "swap"` and `variable: "--font-montserrat-alternates"`. Do not set `preload` or `adjustFontFallback`.
    - Remove the Geist and Geist_Mono imports and classes, and remove `antialiased`. Keep `h-full` on `<html>` and `min-h-full flex flex-col` on `<body>`. Apply `montserratAlternates.variable` to `<html>`. Set `metadata` to `{ title: "Medicare" }`. Use no deprecated API.
    - _Requirements: 1.5, 1.6, 2.6, 5.1, 5.3, 5.4, 5.5, 5.8, 5.11_
    - _Design: Architecture › Root_Layout changes (C1 block); Fonts_
  - [x] 5.2 Tokenize the starter `src/app/page.tsx` (owner decision D2, Requirement 1.7 approval)
    - Replace `bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]` on the "Deploy Now" link with `bg-brand text-on-brand hover:bg-brand-hover`. These utilities break once task 4.1 removes `--color-foreground` and `--color-background`.
    - Replace `dark:hover:bg-[#1a1a1a]` on the "Documentation" link with `dark:hover:bg-surface-hover`
    - Keep all other markup, content and classes unchanged. The page uses `font-sans` and `font-mono` and no Geist variables, so it needs no font change. Port no legacy page.
    - Record in `final-report-draft.md`: the file path, the owner approval (D2, 1.7) and the before and after classes
    - _Requirements: 1.2, 1.7, 3.9, 10.5_
    - _Design: Open Questions › D2_

- [x] 6. Logo and app icon assets
  - [x] 6.1 Copy the four logo SVGs to `src/assets/logo/`
    - Byte-copy `medicare-logo-{full,icon}-on-{light,dark}.svg` from `src/assets/Medicare logo/solid/`. Leave the sources in place.
    - Verify that each copy's sha256 equals the source hash in design.md. If a source is missing, list it and create no substitute (7.3).
    - List every file covered by Requirement 7.5 as "pending owner decision" in `final-report-draft.md`. Do not touch those files.
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
    - _Design: Architecture › Target file layout, source logo hashes_
  - [x] 6.2 Add `src/app/icon.svg`
    - Byte-copy `src/assets/logo/medicare-logo-icon-on-light.svg` and verify its sha256. Verify that `src/app/favicon.ico` still matches its baseline hash from task 1.2.
    - _Requirements: 7.4_
    - _Design: Components and Interfaces › App icons_
  - [x] 6.3 Add `src/app/apple-icon.tsx`
    - Read the bundled `app-icons.md` and `image-response.md` guides first
    - Implement the design.md `ImageResponse` component: 180 × 180 PNG, the SVG read as base64 into an `<img>` data URI, exported `size` and `contentType`
    - If it cannot render without a dependency outside the Allowed_Dependencies, delete the file and record the blocker (7.6)
    - _Requirements: 7.4, 7.6, 1.5_
    - _Design: Components and Interfaces › App icons_

- [x] 7. Stage 1 Node checks (`src/app/design-check/_checks/`)
  - [x] 7.1 Write the shared helpers and the runner
    - `_checks/lib/css.mjs`: read and parse `src/app/globals.css`, legacy `frontend-react/src/index.css` and both Tailwind `theme.css` files into blocks (`:root`, `.dark`, `@theme`, `@theme inline`, `@utility`, plain rules, keyframes, media wrappers) and declarations
    - `_checks/run-all.mjs`: run every `*.check.mjs` in `_checks/` in sequence, pass a `--stage=1|2` argument through, print pass or fail per script, and exit non-zero if any script fails
    - Scripts compare colors as number triples and contain no hex literals
    - _Requirements: 10.5, 15.1_
    - _Design: Testing Strategy_
  - [x] 7.2 Write the raw hex check `_checks/p05-raw-hex.check.mjs`
    - **Property 5: Raw hex appears only in Primitive_Token declarations**
    - Search every `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs` and `.css` file under `src`, excluding `globals.css` and `.svg`, case-insensitively for `#` followed by 3, 4, 6 or 8 hex digits not followed by `[0-9A-Za-z_]`. Expect zero matches. Every match inside `globals.css` must sit in a `--prim-*` declaration.
    - **Validates: Requirements 10.5, 10.7, 13.7, 14.5**
  - [x] 7.3 Write the token mapping check `_checks/p04-token-parity.check.mjs` (light mode)
    - **Property 4: Semantic tokens are complete in both themes and fully mapped**
    - With `--stage=1`, check that every `:root` `--sem-*` value is a single `var(--prim-*)` that resolves to a declared primitive, and that `@theme inline` has `--color-<role>: var(--sem-<role>)` for every Semantic_Token. Task 15.1 adds the `.dark` parity part.
    - **Validates: Requirements 4.4, 10.1, 10.3**
  - [x] 7.4 Write the light-value check `_checks/p06-light-values.check.mjs`
    - **Property 6: Light values equal legacy values**
    - Keep a table of Semantic_Token → legacy source: an inventory value as a number triple, a Tailwind palette variable name read from the 4.1.8 `theme.css`, or an `rgb` triple. Resolve each `:root` value through its primitive and compare it with the source: channels for hex and `rgb`, the exact `oklch()` string for palette values. Cover `primary`, `secondary` and `accent` against the legacy `@theme` values.
    - **Validates: Requirements 2.2, 2.5, 2.7, 4.3, 4.7, 10.6, 11.10, 20.2**
  - [ ]* 7.5 Write `_checks/p07-primitive-unique.check.mjs`
    - **Property 7: Primitive values are unique**
    - **Validates: Requirements 4.2, 4.6**
  - [ ]* 7.6 Write `_checks/p17-legacy-ported.check.mjs`
    - **Property 17: Every legacy class, keyframe and animation is ported with the same definition**
    - Skip the five rules omitted by Requirement 3.12
    - **Validates: Requirements 3.4, 3.5, 3.6, 3.10**
  - [ ]* 7.7 Write `_checks/p19-no-palette-utility.check.mjs`
    - **Property 19: No palette utility remains in ported utility classes**
    - **Validates: Requirements 20.1**
  - [x] 7.8 Write the repository check `_checks/repo.check.mjs`
    - Verify:
      - logo copies and `icon.svg` match their source sha256 values, and `favicon.ico` is unchanged
      - zero occurrences of `Geist`, `Geist_Mono`, `--font-geist-`, `Inter`, `Satoshi`, `fontshare`, `preload: false` or `adjustFontFallback: false` in `layout.tsx` and `globals.css`
      - zero remote font `@import` or `<link>`
      - `next.config.ts` matches its baseline hash
    - _Requirements: 1.9, 5.3, 5.5, 5.6, 5.8, 6.3, 7.2, 7.4_
  - [x] 7.9 Write the build output check `_checks/build-output.check.mjs` (stage 1 part)
    - Runs after `npm run build`. It reads `.next` output and checks:
      - the prerendered `/` HTML has `rel="icon"` links to `/favicon.ico` and to `icon` with `type="image/svg+xml"`, and, if `apple-icon` exists, `rel="apple-touch-icon"` with `sizes="180x180"`
      - compiled semantic color utilities contain `var(--sem-` and no literal color
      - the compiled CSS has no Fontshare or Google Fonts URLs
    - Task 15.8 adds the utility coverage and robots checks
    - _Requirements: 3.1, 5.3, 7.7, 10.3_

- [x] 8. Stage 1 report items
  - [x] 8.1 Record the Montserrat Alternates license
    - Fetch the Montserrat Alternates page on Google Fonts and record the license name and URL exactly as published in `final-report-draft.md`, for DESIGN.md section 4. If the page cannot be read or states no license, record "TODO: confirm". Make no request to Fontshare.
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 8.2 Compile the stage 1 Final_Report items in `final-report-draft.md`
    - Compile:
      - Root_Design_Doc disagreements (2.4)
      - the font deviations for `html`/`body` and `--font-sans` (2.8) and the `font-montserrat` deviation (2.9)
      - duplicate-class losing and winning strings copied from the compiled legacy and target CSS (3.8)
      - the five omitted rules (3.12)
      - ambiguous and near-duplicate values (4.5, 4.6, 10.8, 17.3)
      - palette equivalences with computed values (2.7, 4.7)
      - Inter skipped (5.6) and Satoshi skipped (6.4)
      - the weight counts (5.10)
      - pending files (7.5)
      - the Requirement 20.4 table with light values
      - light legacy contrast failures (12.3)
    - _Requirements: 2.4, 2.7, 2.8, 2.9, 3.8, 3.12, 4.5, 4.6, 4.7, 5.6, 5.10, 6.4, 7.5, 10.8, 12.3, 17.3, 19.5, 20.4_

- [x] 9. Checkpoint: stage 1 Review_Stop
  - In `frontend/`, run `npm run lint`, `npx tsc --noEmit`, `npm run build`, then `node src/app/design-check/_checks/run-all.mjs --stage=1`. Fix failures without `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck` or config changes (15.7).
  - Give the owner a stage report: files changed (`git status --porcelain -- frontend`), each command's exit code, error and warning counts, each check result, and the report items so far. Do not create a commit (D1 deferred).
  - Ensure all tests pass, ask the user if questions arise. Make no further changes until the owner replies "continue".
  - _Requirements: 15.1, 15.2, 15.3, 15.7, 18.10_

### Stage 2: Dark mode, Theme_Toggle and /design-check

- [x] 10. Install next-themes
  - [x] 10.1 Add `next-themes` to `dependencies`
    - Run `npm install next-themes@^0.4.6` with no force flags. Record the specifier and the resolved lockfile version in `final-report-draft.md`. Apply the 8.4 rules to any peer error.
    - _Requirements: 8.1, 8.4, 8.5, 8.6, 8.7, 21.1_
    - _Design: Architecture › Dependencies_

- [x] 11. Dark values in `src/app/globals.css`
  - [x] 11.1 Add the dark primitives, the `.dark` block, `color-scheme` and the dark variant
    - Add `@custom-variant dark (&:where(.dark, .dark *));` after the plugins
    - Add the dark `--prim-*` primitives from design.md (Primitive_Tokens: dark values), with a v3 palette name comment where one applies
    - Add `color-scheme: light` to the `:root` semantic block. Add `.dark { color-scheme: dark; … }` declaring exactly the same `--sem-*` names, each as a single `var(--prim-*)` dark value from the Semantic_Tokens table.
    - _Requirements: 9.8, 10.1, 10.2, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 11.11, 12.4, 12.5, 20.3_
    - _Design: Architecture › globals.css section order (2, 5); Data Models › Primitive_Tokens: dark values, Semantic_Tokens, Contrast table_

- [x] 12. Theme runtime
  - [x] 12.1 Write `src/components/theme/theme-mode.ts`
    - Exports `THEME_MODES`, `ThemeMode`, `isThemeMode`, `toThemeMode`, `ToggleKey`, `nextOptionIndex` and `checkedStates` as specified. No imports and only erasable TypeScript syntax, so Node type stripping can import it.
    - _Requirements: 9.2, 9.3, 13.3, 13.9_
    - _Design: Dark Mode Runtime › Theme_Provider configuration; Components and Interfaces › Theme_Toggle (pure helpers)_
  - [ ]* 12.2 Write `_checks/p12-theme-mode.check.mjs`
    - **Property 12: Theme mode normalization**
    - Seeded PRNG, at least 100 iterations; print the seed and the first counterexample on failure
    - **Validates: Requirements 9.2, 9.3**
  - [ ]* 12.3 Write `_checks/p13-toggle-keys.check.mjs`
    - **Property 13: Theme_Toggle arrow keys cycle with wrap-around**
    - **Validates: Requirements 13.3**
  - [ ]* 12.4 Write `_checks/p14-checked-states.check.mjs`
    - **Property 14: Exactly one active toggle option**
    - **Validates: Requirements 13.9**
  - [x] 12.5 Write `src/components/theme/theme-provider.tsx`
    - Read `preventing-flash-before-hydration.md` first
    - `"use client"`. Configure `NextThemesProvider` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`, `themes={["light", "dark"]}`, `storageKey="theme"` and `scriptProps={{ type: SCRIPT_TYPE }}`. Add `ThemeModeGuard`, which resets invalid stored modes to `system` in a layout effect.
    - Do not patch `console` and do not change `next-themes` source
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.9, 9.10, 9.11, 9.12, 21.4_
    - _Design: Dark Mode Runtime_
  - [x] 12.6 Wire the provider into `src/app/layout.tsx`
    - Add `suppressHydrationWarning` on `<html>` only, and wrap the body content in `<ThemeProvider>`
    - _Requirements: 9.6, 9.7, 21.4_
    - _Design: Architecture › Root_Layout changes (C2 block)_

- [x] 13. Theme_Toggle
  - [x] 13.1 Write `src/components/theme/theme-toggle.tsx`
    - `"use client"`. A `role="radiogroup"` element with `aria-label="Theme"` holding three `role="radio"` buttons (Light, Dark, System), icon-only with `aria-label`. Icons are inline SVGs with `stroke="currentColor"`.
    - Roving `tabIndex`. Arrow keys call `nextOptionIndex`, select and focus, and call `preventDefault`. Space selects. Selection calls `setTheme` synchronously.
    - Mount detection uses `useSyncExternalStore`. The placeholder uses the same markup and size with every option `aria-checked="false"`.
    - Options are `size-11`. Colors come only from Semantic_Token utilities. The active option gets a 2px `border-brand`. The focus outline is `focus-visible:outline-2 outline-offset-2 outline-focus-ring`.
    - _Requirements: 12.7, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.9, 13.10_
    - _Design: Components and Interfaces › Theme_Toggle_

- [x] 14. Design_Check_Route (`src/app/design-check/`)
  - [x] 14.1 Write `_lib/contrast.ts`
    - `relativeLuminance`, `contrastRatio`, `compositeOver`, `meetsMinimum`, `formatRatio` and `toHexLabel` on `Rgb`/`Rgba` number triples. Throw `RangeError` on out-of-range input. No imports.
    - _Requirements: 12.9, 14.4, 14.5, 14.11_
    - _Design: Components and Interfaces › Contrast and color interfaces_
  - [ ]* 14.2 Write `_checks/p01-contrast.check.mjs`
    - **Property 1: Contrast ratio is bounded, symmetric and reflexive**
    - Include the examples (255, 255, 255) vs (0, 0, 0) → 21 and a equals b → 1, written as number triples
    - **Validates: Requirements 14.5, 12.9**
  - [ ]* 14.3 Write `_checks/p02-composite.check.mjs`
    - **Property 2: Compositing stays between foreground and background**
    - **Validates: Requirements 12.9, 14.11**
  - [ ]* 14.4 Write `_checks/p03-format.check.mjs`
    - **Property 3: Formatting never changes the pass/fail decision**
    - Include `r = 4.495` with `m = 4.5`
    - **Validates: Requirements 12.9, 14.4**
  - [x] 14.5 Write `_lib/css-color.ts`
    - `parseComputedColor` accepts `rgb()`, `rgba()`, `rgb(r g b / a)` and `color(srgb …)`, and returns `null` otherwise
    - _Requirements: 14.4, 14.12_
    - _Design: Components and Interfaces › Contrast and color interfaces_
  - [x] 14.6 Write `_lib/token-store.ts`
    - External store following the design.md resolution steps: custom property read, probe element, parser, and the 1×1 sRGB canvas fallback for `oklch`. Unresolved results carry a reason.
    - The snapshot is cached. `subscribe` uses a `MutationObserver` on the `<html>` `class` and `style` attributes and recomputes in the next `requestAnimationFrame`. `getServerSnapshot` returns a constant empty map. The store also reads typography computed styles.
    - Keep the resolver logic in a function that takes a style source as a parameter, so a fake style source can test it
    - _Requirements: 14.2, 14.8, 14.11, 14.12_
    - _Design: Components and Interfaces › Design_Check_Route (resolution steps, store behavior)_
  - [ ]* 14.7 Write `_checks/p16-unresolved.check.mjs`
    - **Property 16: Unresolved tokens do not affect other swatches**
    - Run the resolver against a fake style source
    - **Validates: Requirements 14.12**
  - [x] 14.8 Write `_lib/tokens.ts`
    - Lists every `--prim-*` and `--sem-*` name, and the intended-pair table `(token, pair, theme, minimum, legacyExempt)` from the design.md Contrast table. Holds no color values.
    - _Requirements: 12.1, 12.2, 12.3, 12.8, 14.2, 14.3_
    - _Design: Data Models › Contrast table; Components and Interfaces › Design_Check_Route_
  - [x] 14.9 Write `_components/swatch.tsx`
    - Shows the token name, the resolved value (hex via `toHexLabel` for opaque colors, rgba otherwise), the pair, `formatRatio` output and a text Pass/Fail label (including "Fail (legacy pair, kept per Req 12.3)"). For alpha below 1, it names the composited surface. Unresolved tokens get a text label and no ratio.
    - _Requirements: 12.9, 14.2, 14.3, 14.4, 14.11, 14.12_
    - _Design: Components and Interfaces › Design_Check_Route (swatch label format)_
  - [x] 14.10 Write `_components/design-check.tsx`
    - Client Component with all sections in design.md order: header with the current Theme_Mode, the Resolved_Theme and the Theme_Toggle; typography; primitive and semantic swatches; buttons, form, cards, status badges and chips, alerts, modal overlay, motion, ported plain classes; and the utility coverage section (`bg-primary`, `text-secondary`, `bg-accent`, `border-accent`, `xs:flex`, `font-montserrat`, `shadow-custom`, `prose`, `aspect-w-16 aspect-h-9`, native form controls, `sm:card`, `hover:btn-primary`, `sm:heading-1`)
    - Every state is a separate labeled static sample. Every status sample has a text label or icon. Interactive elements have a focus-visible outline. Use no hex-like element ids.
    - _Requirements: 2.3, 3.1, 3.2, 3.4, 10.4, 12.7, 12.10, 14.6, 14.7, 14.8_
    - _Design: Components and Interfaces › Design_Check_Route (sections table)_
  - [x] 14.11 Write `page.tsx` for the route
    - Server Component exporting `metadata = { title: "Design check", robots: { index: false, follow: false } }` and rendering `<DesignCheck />`
    - Add no link to `/design-check` from any other page
    - _Requirements: 14.1, 14.9, 14.10_
    - _Design: Components and Interfaces › Design_Check_Route (file table)_

- [x] 15. Stage 2 checks and report items
  - [x] 15.1 Extend `_checks/p04-token-parity.check.mjs` with dark parity
    - **Property 4: Semantic tokens are complete in both themes and fully mapped**
    - With `--stage=2`, also require identical `--sem-*` name sets in `:root` and `.dark`, every `.dark` value a single declared `var(--prim-*)`, and zero undeclared references
    - **Validates: Requirements 4.4, 10.1, 10.2, 10.3, 11.5, 20.3**
  - [ ]* 15.2 Write `_checks/p08-dark-surfaces.check.mjs`
    - **Property 8: Dark surfaces are navy and darker than all dark text**
    - **Validates: Requirements 11.1, 11.2**
  - [ ]* 15.3 Write `_checks/p09-dark-brand.check.mjs`
    - **Property 9: Dark brand values are calmer versions of the light values**
    - **Validates: Requirements 11.3, 11.10**
  - [ ]* 15.4 Write `_checks/p10-contrast-pairs.check.mjs`
    - **Property 10: Every intended pair meets its threshold unless it is an exempt light legacy pair**
    - Import `contrast.ts` and `tokens.ts`, and resolve primitives from `globals.css` (sRGB conversion for `oklch` values)
    - **Validates: Requirements 11.2, 11.4, 11.6, 11.8, 11.11, 12.1, 12.2, 12.3, 13.10, 20.3**
  - [ ]* 15.5 Write `_checks/p11-distinct.check.mjs`
    - **Property 11: Distinct tokens stay distinct**
    - **Validates: Requirements 11.6, 11.9, 12.4**
  - [ ]* 15.6 Write `_checks/p15-token-list.check.mjs`
    - **Property 15: The design-check token list matches the stylesheet**
    - **Validates: Requirements 14.2, 14.3**
  - [ ]* 15.7 Write `_checks/p18-reduced-motion.check.mjs`
    - **Property 18: Reduced motion covers every animation class**
    - **Validates: Requirements 12.6**
  - [x] 15.8 Extend `_checks/build-output.check.mjs`
    - Check that the built CSS contains `.bg-primary`, `.xs\:flex`, `.font-montserrat`, `.shadow-custom`, `.prose`, `.aspect-w-16`, each `@utility` class and its variant forms, and the `@tailwindcss/forms` base rules
    - Check that the prerendered `/design-check` HTML has `<meta name="robots" content="noindex, nofollow">`
    - _Requirements: 3.1, 3.2, 3.4, 14.9_
  - [x] 15.9 Extend `_checks/repo.check.mjs`
    - Check for zero `/design-check` references and zero imports from `src/app/design-check` outside the route folder, and confirm that `suppressHydrationWarning` appears only on `<html>`
    - _Requirements: 14.1, 14.10, 21.4_
  - [x] 15.10 Verify that the route can be removed
    - Copy `frontend/` (excluding `node_modules` and `.next`) to a temporary directory outside the repository, run `npm ci`, delete `src/app/design-check/`, and run `npm run lint`, `npx tsc --noEmit` and `npm run build` there. Record the results, then delete the temporary directory.
    - _Requirements: 14.1_
  - [x] 15.11 Compile the stage 2 report items in `final-report-draft.md`
    - Compile the dark column of the Requirement 20.4 table, the `next-themes` version (21.1), the D10 and D11 notes, and the dark contrast results
    - _Requirements: 19.2, 19.5, 20.4, 21.1, 21.3, 21.5_

- [ ] 16. Checkpoint: stage 2 Review_Stop
  - Run `npm run lint`, `npx tsc --noEmit`, `npm run build` and `node src/app/design-check/_checks/run-all.mjs --stage=2` in `frontend/`. Fix failures under the 15.7 rules.
  - Give the stage report: files changed, exit codes, error and warning counts, check results, and report items so far. Do not create a commit (D1 deferred). Do not run `npm run dev` or `npm run start`.
  - Ensure all tests pass, ask the user if questions arise. Make no further changes until the owner replies "continue".
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.7, 18.10_

### Stage 3: DESIGN.md and Final_Report

- [x] 17. Write `frontend/DESIGN.md`
  - [x] 17.1 Write sections 1 to 8
    - 1 Purpose and principles (clinical, trustworthy, secure, accessibility first, each with a UI rule)
    - 2 Tech stack (versions from `package.json`, the resolved `next-themes` version)
    - 3 Design tokens (primitive, semantic, light and dark tables with pairs and ratios, palette equivalences, the Requirement 20 table)
    - 4 Typography (fonts, Base_Font_Stack fallbacks "TODO: confirm", weights "TODO: confirm", weight mapping and counts, type scale, license, the Satoshi deviation)
    - 5 Spacing, radius, elevation, borders (including `shadow-custom`)
    - 6 Breakpoints (including `xs` at 320px)
    - 7 Iconography
    - 8 Motion (keyframe table and reduced-motion rule)
    - Present values as tables
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.10, 16.11, 16.12, 16.14, 16.15, 5.1, 5.4, 17.2, 21.1_
    - _Design: DESIGN.md plan; Data Models; Fonts; Ported Classes › Reduced motion_
  - [x] 17.2 Write sections 9 to 15
    - 9 Components (card, button, input, modal, badge, nav, table, toast, with states and tokens per theme; "TODO: confirm" where no class exists; status shown by label or icon)
    - 10 Dark mode (strategy, `:root` → `.dark` mapping, steps to add a token, testing checklist)
    - 11 Accessibility rules (thresholds, focus, 44px targets, emergency vs danger, light legacy failures with ratios)
    - 12 Brand and logo usage (four files, variants, backgrounds, naming pattern, clear space and minimum size "TODO: confirm")
    - 13 Role themes (patient, doctor, hospital, founder, staff, with legacy values and file paths)
    - 14 Do/Don't
    - 15 Contribution rules and changelog. Use today's date in `YYYY-MM-DD` and note that it must equal the commit date once commits resume (D1).
    - _Requirements: 12.3, 12.8, 12.10, 16.6, 16.7, 16.8, 16.9, 16.10, 16.11, 16.12, 16.13, 16.16_
    - _Design: DESIGN.md plan; Dark Mode Runtime; Contrast table_
  - [ ]* 17.3 Write `_checks/doc-values.check.mjs`
    - Check that DESIGN.md has exactly the 15 numbered level-2 headings in order, and that every `--prim-*` and `--sem-*` value it states matches `globals.css` after hex case normalization
    - _Requirements: 16.1, 16.11_

- [x] 18. Final verification and Final_Report
  - [x] 18.1 Run the final verification
    - In `frontend/`, run `npm run lint`, `npx tsc --noEmit`, `npm run build` and `run-all.mjs --stage=2`. Record exit codes, error and warning counts, and whether each issue is pre-existing (baseline from 1.2) or new.
    - Compare `git status --porcelain -- frontend-react DESIGN.md` with the baseline (expect no change by this feature), and confirm that `next.config.ts`, `eslint.config.mjs` and `tsconfig.json` match their baseline hashes
    - If a command still fails, mark build verification failed and the port not shippable (15.6)
    - _Requirements: 1.3, 1.9, 15.1, 15.2, 15.3, 15.6, 15.7_
  - [x] 18.2 Write the Final_Report from `final-report-draft.md`
    - Use the sections in this order: Ported, Added, Skipped, Intentional deviations, Verification and commits, Font license, Manual browser checks, Items for review, Decisions needed, Notes for feature porting, Cleanup
    - Write "commits deferred by owner" instead of commit hashes
    - List `src/app/page.tsx` as an owner-approved file outside the Requirement 1.1 list (D2, 1.7)
    - List the bundled guides consulted (1.5)
    - Give the manual check steps (a) to (f) with expected results, and the commands the owner runs (`npm run dev`, `npm run build && npm run start`)
    - Include the `reactCompiler: true` line
    - State that `src/app/design-check/` is temporary and that deleting it removes the route
    - Write "None" under any empty section. Keep the "Unused tokens" and "Ambiguous items" sections.
    - _Requirements: 1.4, 1.5, 1.7, 1.9, 15.4, 17.6, 17.7, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.10, 19.11_

- [x] 19. Final checkpoint: stage 3 Review_Stop
  - Ensure all tests pass, ask the user if questions arise. Give the owner the stage report and the Final_Report. Make no further changes until the owner replies "continue" or resolves D1.
  - _Requirements: 18.10, 19.7_

## Notes

- Tasks marked with `*` are optional property checks and can be skipped for a faster run. These core checks are required: the raw hex check (7.2), token parity (7.3, 15.1), light-value equality (7.4), repository checks (7.8, 15.9), build output checks (7.9, 15.8) and route removability (15.10).
- Commit creation (Requirements 18.1–18.3, 18.5, 18.6, 18.8, 18.11) is deferred by owner decision until D1 is resolved. The stage boundaries match the planned commits C1, C2 and C3, so commits can be cut later without regrouping files. Exception: the `_checks/` scripts written in stage 1 live in the stage-2 route folder.
- The owner placed the reduced-motion block (4.7) in stage 1. design.md places it in C2. This matters only when commits are created.
- The Implementer never runs `npm run dev`, `npm run start` or watch commands (15.4). Browser-only criteria (2.3, 5.9, 9.4–9.7, 9.9–9.11, 10.4, 13.4, 14.7, 14.8) are Manual_Browser_Checks for the owner (19.10).
- Open decisions D3–D14 in design.md stay open and appear under "Decisions needed" in the Final_Report.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1", "3.1", "6.1"] },
    { "id": 3, "tasks": ["4.1", "6.2", "8.1"] },
    { "id": 4, "tasks": ["4.2", "6.3"] },
    { "id": 5, "tasks": ["4.3", "5.1"] },
    { "id": 6, "tasks": ["4.4", "5.2"] },
    { "id": 7, "tasks": ["4.5"] },
    { "id": 8, "tasks": ["4.6"] },
    { "id": 9, "tasks": ["4.7", "7.1"] },
    { "id": 10, "tasks": ["7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9"] },
    { "id": 11, "tasks": ["8.2"] },
    { "id": 12, "tasks": ["10.1", "11.1", "12.1", "14.1", "14.5"] },
    { "id": 13, "tasks": ["12.2", "12.3", "12.4", "12.5", "14.2", "14.3", "14.4", "14.6", "14.8"] },
    { "id": 14, "tasks": ["12.6", "13.1", "14.7", "14.9"] },
    { "id": 15, "tasks": ["14.10"] },
    { "id": 16, "tasks": ["14.11", "15.1", "15.2", "15.3", "15.4", "15.5", "15.6", "15.7"] },
    { "id": 17, "tasks": ["15.8", "15.9"] },
    { "id": 18, "tasks": ["15.10", "15.11"] },
    { "id": 19, "tasks": ["17.1"] },
    { "id": 20, "tasks": ["17.2"] },
    { "id": 21, "tasks": ["17.3"] },
    { "id": 22, "tasks": ["18.1"] },
    { "id": 23, "tasks": ["18.2"] }
  ]
}
```
