# Final Report draft: design-system-dark-mode

Running notes for the Final_Report. Paths are relative to `frontend/` unless stated.

## Preflight

### 1.1 Branch check (Requirement 18.9)

`git branch --show-current` in `/Users/karangupta/Project/Medicare` printed `migration/frontend-nextjs`.

### 1.2 Baseline before any file change (Requirements 1.3, 1.5, 1.8, 1.9, 8.2, 15.5)

#### Baseline commands (run in `frontend/`, in this order)

| Command | Exit code | Errors | Warnings |
| :--- | :--- | :--- | :--- |
| `npm run lint` (`eslint`) | 0 | 0 | 0 |
| `npx tsc --noEmit` | 0 | 0 | 0 |
| `npm run build` (`next build`, Next.js 16.4.6 Turbopack) | 0 | 0 | 1 |

`npm run lint` output, verbatim:

```
> frontend@0.1.0 lint
> eslint
```

`npx tsc --noEmit` output: empty.

`npm run build` warning, verbatim (pre-existing, not introduced by this feature):

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of /Users/karangupta/Project/Medicare/package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * /Users/karangupta/Project/Medicare/frontend/package-lock.json
```

Note for the Final_Report: fixing this warning would require editing `next.config.ts` (frozen by Requirement 1.9) or removing the repository-root `package-lock.json` (outside the Requirement 1.1 scope). Proposed action: left unchanged, pre-existing.

Full `npm run build` output, verbatim:

```
> frontend@0.1.0 build
> next build
▲ Next.js 16.4.6 (Turbopack)
- Environments: .env.local
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of /Users/karangupta/Project/Medicare/package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * /Users/karangupta/Project/Medicare/frontend/package-lock.json
✓ Running next.config.ts took 40ms
  Creating an optimized production build ...
✓ Compiled successfully in 355ms
  Running TypeScript ...
  Finished TypeScript in 551ms ...
  Collecting page data using 5 workers ...
✓ Collecting page data using 5 workers in 203ms
  Generating static pages using 5 workers (0/4) ...
  Generating static pages using 5 workers (1/4) 
  Generating static pages using 5 workers (2/4) 
  Generating static pages using 5 workers (3/4) 
✓ Generating static pages using 5 workers (4/4) in 170ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 5ms
Route (app)
┌ ○ /
└ ○ /_not-found
○  (Static)  prerendered as static content
```

#### Snapshot for later comparison

`git status --porcelain -- frontend-react DESIGN.md`, run from the repository root (`/Users/karangupta/Project/Medicare`). Run from `frontend/` the pathspec resolves to `frontend/frontend-react` and `frontend/DESIGN.md`, which do not exist, so the output is empty; the repository-root run is the meaningful baseline.

```
 M frontend-react/.DS_Store
M  frontend-react/.gitignore
 M frontend-react/dist/aboutus/index.html
 M frontend-react/dist/aboutus2/index.html
 D frontend-react/dist/assets/index-BM94s0S8.js
 D frontend-react/dist/assets/index.C2ztjgw8.css
 M frontend-react/dist/detail-review/index.html
 M frontend-react/dist/index.html
 M frontend-react/dist/pricing/index.html
 M frontend-react/dist/service2/index.html
 M frontend-react/dist/services/index.html
 M frontend-react/dist/team/index.html
 M frontend-react/vite.config.js
?? frontend-react/src/.DS_Store
?? frontend-react/src/assets/.DS_Store
```

All entries are owner changes present before this feature. The root `DESIGN.md` (Root_Design_Doc) has no entry, so it is clean. Compared with design.md "Sources read", the snapshot also shows `frontend-react/.DS_Store` (modified) and two untracked `.DS_Store` files; these are macOS Finder files and also belong to the owner.

sha256 hashes:

| File | sha256 |
| :--- | :--- |
| `next.config.ts` | `bb409e5b989fb255dd2c0f8890ce9f2fd15a7b47af02ac0917ba4f132a336ac3` |
| `eslint.config.mjs` | `870f1adccecf3051cbcd9fd307cef51d7633cf510979c181a81f4b1797273493` |
| `tsconfig.json` | `5c51df4c59f4510d8c7dadf07a5c32132228826a3b331da5e286207b4df7ef9c` |
| `src/app/favicon.ico` | `bdbf6368f723439dd993e0ddd22725e4422ae3bd1c4a4e400aa7d13c22b76523` |
| `../DESIGN.md` (Root_Design_Doc, extra reference) | `5b13f917f69b79591fb2093977a5d801aeb4281f1fc2257c576c1f0bb2e4cb47` |

`package.json` entries before this feature (Requirement 8.2):

```json
{
  "dependencies": {
    "next": "16.4.6",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@tailwindcss/turbopack": "4.3.3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.4.6",
    "tailwindcss": "4.3.3",
    "typescript": "^5"
  }
}
```

#### `next.config.ts` (Requirement 1.9)

`reactCompiler` is enabled and should be reviewed when feature porting starts. (`next.config.ts` hash recorded above; it must stay unchanged.)

#### `AGENTS.md` and bundled guides (Requirements 1.5, 1.8)

`AGENTS.md` contains only the `nextjs-agent-rules` block: this Next.js version has breaking changes, read the relevant guide in `node_modules/next/dist/docs/` before writing code, and heed deprecation notices. The block is re-added by `next dev` (`node_modules/next/dist/server/lib/generate-agent-files.js`).

Bundled guides named in design.md "Bundled Next.js 16.4.6 guides consulted", under `node_modules/next/dist/docs/01-app/`. All are present; none is missing, so no Requirement 1.8 question is needed.

| Guide | Status | Size (bytes) |
| :--- | :--- | :--- |
| `01-getting-started/13-fonts.md` | present | 8705 |
| `03-api-reference/02-components/font.md` | present | 31665 |
| `03-api-reference/03-file-conventions/01-metadata/app-icons.md` | present | 9430 |
| `03-api-reference/04-functions/image-response.md` | present | 5818 |
| `03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` | present | 16658 |
| `03-api-reference/04-functions/generate-metadata.md` | present | 49304 |
| `02-guides/preventing-flash-before-hydration.md` | present | 22709 |
| `03-api-reference/03-file-conventions/layout.md` | present | 21144 |
| `01-getting-started/03-layouts-and-pages.md` | present | 12408 |
| `01-getting-started/11-css.md` | present | 12368 |

## Task 2.1: Tailwind plugins
### Install (Requirements 8.4, 8.6)
Command, run in `frontend/` without `--force` or `--legacy-peer-deps`:
`npm install -D @tailwindcss/forms@^0.5.10 @tailwindcss/typography@^0.5.16 @tailwindcss/aspect-ratio@^0.4.2`
Exit code 0. Output: `added 7 packages, and audited 367 packages`. npm reported no peer-dependency error or warning, so there is no Requirement 8.4 entry for this install.

npm saved the specifiers as `^0.5.11` (forms) and `^0.5.20` (typography), taken from the resolved versions. To match design.md "Dependencies" and Open Question D12 (legacy specifiers recommended), I set them back to `^0.5.10` and `^0.5.16` with `npm pkg set` and ran `npm install` again (`up to date`, no version change). The root entry in `package-lock.json` now shows the same specifiers. If the owner picks "latest" for D12, run `npm pkg set` with `^0.5.11` / `^0.5.20` and run `npm install` again.

### Added packages (Requirements 8.1, 8.5, 8.7)
| Package | `package.json` section | Specifier | Resolved in `package-lock.json` |
| :--- | :--- | :--- | :--- |
| `@tailwindcss/forms` | devDependencies | `^0.5.10` | 0.5.11 |
| `@tailwindcss/typography` | devDependencies | `^0.5.16` | 0.5.20 |
| `@tailwindcss/aspect-ratio` | devDependencies | `^0.4.2` | 0.4.2 |

### Pre-existing entries (Requirement 8.2)
I compared the current `package.json` with a copy taken just before the install. All 12 pre-existing entries (3 in `dependencies`, 9 in `devDependencies`) keep the same name, section and specifier, and none was removed. No other `package.json` field changed. Sections now hold 3 `dependencies` and 12 `devDependencies`, so the only additions are the three plugins. Lockfile versions stay at `next` 16.4.6, `react` 19.3.0, `react-dom` 19.3.0 and `tailwindcss` 4.3.3.

### `npm audit` note
After the install, `npm audit` reports 9 moderate vulnerabilities. Two come from the new plugins: `postcss-selector-parser` 6.0.10 (GHSA-rj75-hqrm-r3gf, a quadratic-complexity CPU exhaustion issue in selector parsing) and `@tailwindcss/typography`, which depends on that package. npm's only fix is `npm audit fix --force`, which would downgrade typography to 0.5.4 (breaking), so I did not apply it. The other 7 come from `minimatch` (GHSA-g3hv-75wg-m249) through `eslint-config-next` → `typescript-eslint`, which predates this feature. These are dev-only, build-time packages.

The `@tailwindcss/aspect-ratio` CSS output check under 4.3.3 and Turbopack, plus lint, tsc and build, belong to the C1 build check and were not run in this task.

## Task 6.1: Logos

### Logo copies (Requirements 7.1, 7.2)
All four sources exist in `frontend/src/assets/Medicare logo/solid/`, so no file is missing (Requirement 7.3: nothing to report, no substitute created). Each was byte-copied with `cp -p` to `frontend/src/assets/logo/`. The sources stay in place. Source and copy sha256 match each other and the design.md value:

| Copy in `frontend/src/assets/logo/` | Bytes | sha256 (source = copy = design.md) |
|---|---|---|
| `medicare-logo-full-on-light.svg` | 20,683 | `f66bd7205ae435f1bbac2e10ad3eca3a70e961b26d39b928bdf936da6cd8fc61` |
| `medicare-logo-full-on-dark.svg` | 20,683 | `e9d7f509c7006ecfaf2b508933dd83581f0e25230adc2f35987d2d1978243232` |
| `medicare-logo-icon-on-light.svg` | 10,558 | `d8ff46519c4ea4d3c904be6a7cbd113648303d77d50545d06ff681a8d4ddc1ce` |
| `medicare-logo-icon-on-dark.svg` | 10,660 | `21f5b154904eec03206172e4009b79be58f3e02f9d9659ce50dafef5e2ea3058` |

### Pending owner decision (Requirement 7.5, decision D3)
Each file below is present, left unchanged, and marked "pending owner decision". Ask the owner whether to keep, delete or rename each one.

| Full path | Bytes | sha256 | Status |
|---|---|---|---|
| `frontend/src/app/favicon1.ico` | 432,254 | `549742813af13845173ec37a7c6595f612bdbb1210654537d16dff1e774047d7` | pending owner decision |
| `frontend/src/app/favicon2.ico` | 4,286 | `7925bf55f3d7415fa20e0483991c9ab6e09c8f9765d32ee20ad498a173250e95` (differs from `favicon.ico` `bdbf6368…6523`) | pending owner decision |
| `frontend/src/assets/Medicare logo/solid/medicare-logo-text-only-on-light.svg` | 12,520 | `fcda2efc65ba53cc2a332867ce2afa07a32c32c4fbfea697e2fe14c55749d569` | pending owner decision |
| `frontend/src/assets/Medicare logo/solid/medicare-logo-text-only-on-dark.svg` | 12,520 | `4133b06f36adf7b502f3438ce306556f02e6a9ab885c68cdc7fdb3cd7c71ecc6` | pending owner decision |
| `frontend/src/assets/Medicare logo/transparent/ medicare-logo-icon-tp-on-white.png` (name starts with a space) | 56,863 | `6cd71b712796c12d7c55dd6bcd848bcef72356c08394e14e5aea8a15fbe065d2` | pending owner decision |
| `frontend/src/assets/Medicare logo/transparent/ medicare-logo-icon-tp-on-white.svg` (name starts with a space) | 7,937 | `7d0b2d9f57f5ac642f7c78e0cd24d46baf710a8f20267cea398cd10116a88c17` | pending owner decision |
| `frontend/src/assets/Medicare logo/medicare_logo_text_only_curve_light copy.png` | 7,642 | `86c4b5855a559c0eecbf806b5774668eed48b2cf7b2df7bcea9e1cca4a973f0a` | pending owner decision |

## Task 3.1: Legacy inventory

Script: `src/app/design-check/_checks/legacy-inventory.report.mjs` (Node built-ins only, no color literals, ESLint clean; the `.report.mjs` suffix keeps it out of the check runner). Run from `frontend/`:
`node src/app/design-check/_checks/legacy-inventory.report.mjs` (exit code 0).

### Comparison with design.md (Data Models)

- Totals match the design-time scan: 99 files, 116 distinct values, 1,070 occurrences, 65 single-file values.
- Every value in the "Primitive_Tokens: inventory hex" table has the same count and file count as design.md (for example `#252a61` 187 / 21, `#ffffff` 68 / 13, `#4318ff` 66 / 4, `#3b3b98` 14 / 7 with 13 `hover:`, `#1a1f4a` 4 / 1, `#1a1f4d` 1 / 1). No role assignment changes, so no owner question is needed.
- Property breakdowns differ by 1 in a few rows because of context classification, not counts: `#ffffff` `color` 38 here versus 39 in design.md (one `color` is the `bgColor` prop of the QR code component), `#f8fafc` `background` 16 versus 17, `#64748b` `color` 40 versus 41, `#e8edf5` `border` 15 plus 5 `border-top`/`border-bottom` versus 16. The dominant property for each value is unchanged.
- Unused Legacy_Tokens match design.md: `primary` 28 in 3 files (`text-primary` 16, `bg-primary` 5, gradient stops 7), `secondary` 0, `accent` 1 (`to-accent`, `pages/NotFound.jsx`), `xs:` 515 in 3 files, `font-montserrat` 0, `shadow-custom` 0. Unused: `secondary`, `font-montserrat`, `shadow-custom`. The `xs:` re-check found no false positives: all 515 raw `xs:` substrings are variant uses (sampled: `xs:hidden`, `xs:block`). Excluded substring matches: `btn-primary` 2, `btn-secondary` 2.
- Font weights match the requirements source table: `font-medium` 849, `font-semibold` 372, `font-bold` 295, `font-extrabold` 12 (7 files), `font-normal` 7, inline `fontWeight` 600 46; weight 600 (class + inline) in 63 files. Additional findings not in design.md: inline weight 800 occurs 21 times in 9 files (900 face), inline 500 50 times in 10 files, inline 700 32 times in 9 files and `font-weight: bold` 2 times in 1 file. `font-thin`, `font-extralight`, `font-light` and weights 100, 200, 300 have 0 uses.
- Near-duplicate pairs: the script lists all 19 pairs with every channel difference ≤ 4. The three same-role pairs in design.md (`#1a1f4a`/`#1a1f4d`, `#f8fafc`/`#fafbfc`, `#0f172a`/`#111827`) are present with the same counts. Pairs that design.md does not name individually, none of which has both values assigned to a Semantic_Token role (so Requirement 4.6 does not apply and no role changes): `#1e1b4b`/`#1a1f4a`, `#1e1b4b`/`#1a1f4d`, `#1c204f`/`#1a1f4d`, `#334155`/`#374151`, `#a1b5fa`/`#a5b4fc`, `#eef1ff`/`#ebf5ff`, `#ebf5ff`/`#eef2ff`, `#f4f7fe`/`#f0f7ff`, `#f4f7fe`/`#f5f3ff`, `#f8fafc`/`#f4f7fe`, `#f4f7fe`/`#f8fafd`, `#f8fafc`/`#f8fafd`, `#f8fafd`/`#fafbfc`. design.md's ambiguous row lists `#1e1b4b`, `#1c204f`, `#f8fafd`, `#f4f7fe`, `#eef1ff`/`#eef2ff`, `#363b7e`/`#3a3f7a`, `#fef2f2`/`#fff1f2`; it does not mention `#334155`/`#374151`, `#a1b5fa`/`#a5b4fc`, `#ebf5ff`, `#f0f7ff` or `#f5f3ff`. Proposed handling: add them to the Final_Report "Ambiguous items" list as near-duplicates without a Semantic_Token (all values stay unported).
- Favicon (17.4): `frontend-react/index.html` declares `type="image/svg+xml"` for `/logo.png`; the file's first bytes are the PNG signature, 500×500, 8-bit RGBA. This matches design.md.
- `font-montserrat` (17.5): no file under `frontend-react/src` uses it outside the `@theme` block.

### Script output (verbatim, headings demoted one level)

Scope: 99 files (`.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.html`) under `frontend-react/src`.

#### Hex inventory (4.1)

116 distinct values, 1070 occurrences, 65 values in only one file.

| Value | Count | Files | CSS properties seen | Variants |
| :--- | ---: | ---: | :--- | :--- |
| `#252a61` | 187 | 21 | color 59, background-color 45, gradient-stop 25, border-color 21, ring-color 20, background 11, stop-color 2, --color-primary 1, attr:content 1, box-shadow 1, other 1 | focus 36, hover 6, dark 2, group-hover 1 |
| `#ffffff` | 68 | 13 | color 38, background 21, other 6, key:secondary 2, attr:bgColor 1 | — |
| `#6366f1` | 67 | 11 | color 34, background 23, border-top-color 4, key:accent 3, other 2, key:text 1 | — |
| `#4318ff` | 66 | 4 | color 24, gradient-stop 16, background-color 15, border-color 6, box-shadow 4, ring-color 1 | focus 7, hover 5 |
| `#94a3b8` | 64 | 10 | color 62, other 2 | — |
| `#64748b` | 43 | 10 | color 40, other 3 | — |
| `#707eae` | 38 | 2 | color 28, color (placeholder) 6, border-color 4 | — |
| `#f1f5f9` | 38 | 10 | background 22, border-top 6, border 3, border-bottom 3, other 3, border-right 1 | — |
| `#0f172a` | 35 | 11 | color 26, background 9 | — |
| `#e2e8f0` | 26 | 7 | border 12, background 7, other 7 | — |
| `#e8edf5` | 26 | 11 | border 15, other 5, border-bottom 4, border-top 1, key:none 1 | — |
| `#8b5cf6` | 25 | 11 | background 18, key:accent 2, other 2, color 1, key:gradient 1, key:text 1 | — |
| `#1e293b` | 24 | 6 | color 24 | — |
| `#10b981` | 22 | 10 | color 11, key:text 4, key:accent 3, other 2, key:dot 1, key:gradient 1 | — |
| `#f8fafc` | 22 | 8 | background 16, other 4, border-bottom 1, border-right 1 | — |
| `#f4f7fe` | 16 | 2 | background-color 16 | hover 2 |
| `#ef4444` | 15 | 4 | color 9, key:text 2, other 2, border 1, key:dot 1 | — |
| `#3b3b98` | 14 | 7 | background-color 14 | hover 13 |
| `#dc2626` | 13 | 2 | background 8, color 3, other 2 | — |
| `#0ea5e9` | 12 | 6 | color 6, key:accent 3, background 1, key:gradient 1, key:text 1 | — |
| `#475569` | 11 | 5 | color 11 | — |
| `#1e1b4b` | 10 | 7 | background 10 | — |
| `#6236ff` | 10 | 1 | gradient-stop 10 | dark 2 |
| `#363b7e` | 9 | 3 | background-color 6, color 2, gradient-stop 1 | hover 8 |
| `#b91c1c` | 9 | 1 | background 8, other 1 | — |
| `#f59e0b` | 9 | 4 | color 5, key:text 3, key:dot 1 | — |
| `#2b3674` | 8 | 2 | color 8 | — |
| `#f8fafd` | 8 | 3 | background 7, fill 1 | — |
| `#eef1ff` | 7 | 3 | background-color 3, background 2, gradient-stop 2 | — |
| `#f97316` | 7 | 4 | key:accent 3, color 2, key:gradient 1, key:text 1 | — |
| `#4f46e5` | 6 | 2 | stop-color 3, fill 2, stroke 1 | — |
| `#1e3a5f` | 5 | 3 | background 5 | — |
| `#334155` | 5 | 5 | color 5 | — |
| `#6b7280` | 5 | 2 | fill 4, color 1 | — |
| `#9ca3af` | 5 | 2 | stroke 4, background 1 | — |
| `#f472b6` | 5 | 1 | background 4, color 1 | — |
| `#fef2f2` | 5 | 1 | background 3, key:bg 2 | — |
| `#0a66c2` | 4 | 1 | background-color 3, color 1 | hover 1 |
| `#1a1f4a` | 4 | 1 | gradient-stop 4 | — |
| `#3311db` | 4 | 2 | background-color 2, color 2 | hover 4 |
| `#059669` | 3 | 3 | color 2, other 1 | — |
| `#111827` | 3 | 2 | color 3 | — |
| `#3b82f6` | 3 | 3 | background 1, background-image 1, stop-color 1 | — |
| `#b8c5fd` | 3 | 3 | gradient-stop 2, --color-secondary 1 | — |
| `#cbd5e1` | 3 | 3 | color 3 | — |
| `#e8c3d5` | 3 | 3 | gradient-stop 2, --color-accent 1 | — |
| `#f0f7ff` | 3 | 2 | background-color 3 | — |
| `#facc15` | 3 | 3 | color 3 | — |
| `#000000` | 2 | 2 | attr:fgColor 1, color 1 | — |
| `#06b6d4` | 2 | 2 | key:accent 1, stop-color 1 | — |
| `#1c204f` | 2 | 1 | background-color 1, color 1 | hover 2 |
| `#34d399` | 2 | 2 | color 1, key:gradient 1 | — |
| `#374151` | 2 | 1 | stroke 2 | — |
| `#60a5fa` | 2 | 1 | background 2 | — |
| `#667eea` | 2 | 2 | background 2 | — |
| `#67e8f9` | 2 | 2 | color 2 | — |
| `#764ba2` | 2 | 2 | background 2 | — |
| `#7c3aed` | 2 | 1 | color 2 | — |
| `#87ceeb` | 2 | 1 | key:colors 2 | — |
| `#88220033` | 2 | 1 | key:sm 2 | — |
| `#98fb98` | 2 | 1 | key:colors 2 | — |
| `#a78bfa` | 2 | 1 | background 2 | — |
| `#f43f5e` | 2 | 2 | key:accent 2 | — |
| `#f5f3ff` | 2 | 1 | key:bg 2 | — |
| `#fafbfc` | 2 | 2 | background 2 | — |
| `#fca5a5` | 2 | 2 | color 2 | — |
| `#ff69b4` | 2 | 1 | key:colors 2 | — |
| `#ffd700` | 2 | 1 | key:colors 2 | — |
| `#fff1f2` | 2 | 1 | background 1, key:bg 1 | — |
| `#1a1f4d` | 1 | 1 | gradient-stop 1 | — |
| `#1c1c1c` | 1 | 1 | background-color 1 | — |
| `#1d4ed8` | 1 | 1 | background 1 | — |
| `#1e40af` | 1 | 1 | color 1 | — |
| `#22884455` | 1 | 1 | key:action 1 | — |
| `#2496ed` | 1 | 1 | color 1 | — |
| `#252a80` | 1 | 1 | background-color 1 | hover 1 |
| `#2563eb` | 1 | 1 | stop-color 1 | — |
| `#2a2f6b` | 1 | 1 | gradient-stop 1 | — |
| `#2b3a8c` | 1 | 1 | gradient-stop 1 | — |
| `#2f347c` | 1 | 1 | gradient-stop 1 | — |
| `#33449922` | 1 | 1 | key:action 1 | — |
| `#339933` | 1 | 1 | color 1 | — |
| `#363636` | 1 | 1 | background 1 | — |
| `#38bdf8` | 1 | 1 | key:gradient 1 | — |
| `#3a3f7a` | 1 | 1 | gradient-stop 1 | — |
| `#4338ca` | 1 | 1 | background-color 1 | — |
| `#47a248` | 1 | 1 | color 1 | — |
| `#4c5ec9` | 1 | 1 | gradient-stop 1 | — |
| `#4caf50` | 1 | 1 | key:primary 1 | — |
| `#55662233` | 1 | 1 | key:action 1 | — |
| `#61dafb` | 1 | 1 | color 1 | — |
| `#6d74dd` | 1 | 1 | gradient-stop 1 | — |
| `#6ee7b7` | 1 | 1 | color 1 | — |
| `#88990022` | 1 | 1 | key:action 1 | — |
| `#8b6fff` | 1 | 1 | color 1 | dark 1 |
| `#93c5fd` | 1 | 1 | border 1 | — |
| `#a1b5fa` | 1 | 1 | gradient-stop 1 | — |
| `#a5b4fc` | 1 | 1 | color 1 | — |
| `#d946ef` | 1 | 1 | key:accent 1 | — |
| `#d97706` | 1 | 1 | color 1 | — |
| `#dbeafe` | 1 | 1 | stroke 1 | — |
| `#e11d48` | 1 | 1 | color 1 | — |
| `#e53e3e` | 1 | 1 | key:primary 1 | — |
| `#e5e7eb` | 1 | 1 | border-bottom 1 | — |
| `#ea580c` | 1 | 1 | color 1 | — |
| `#ebf5ff` | 1 | 1 | background 1 | — |
| `#ecfdf5` | 1 | 1 | key:bg 1 | — |
| `#edf0f7` | 1 | 1 | border 1 | — |
| `#eef2ff` | 1 | 1 | gradient-stop 1 | — |
| `#f05032` | 1 | 1 | color 1 | — |
| `#f7df1e` | 1 | 1 | color 1 | — |
| `#fb923c` | 1 | 1 | key:gradient 1 | — |
| `#fecaca` | 1 | 1 | border 1 | — |
| `#fee2e2` | 1 | 1 | background 1 | — |
| `#ff9900` | 1 | 1 | color 1 | — |
| `#fff7ed` | 1 | 1 | key:bg 1 | — |

#### Single-file values (4.5, 17.3 a)

| Value | Count | File |
| :--- | ---: | :--- |
| `#6236ff` | 10 | `frontend-react/src/pages/Team.jsx` |
| `#b91c1c` | 9 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#f472b6` | 5 | `frontend-react/src/pages/Services.jsx` |
| `#fef2f2` | 5 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#0a66c2` | 4 | `frontend-react/src/pages/Team.jsx` |
| `#1a1f4a` | 4 | `frontend-react/src/pages/Service2.jsx` |
| `#1c204f` | 2 | `frontend-react/src/pages/User/VerifyEmail.jsx` |
| `#374151` | 2 | `frontend-react/src/pages/Founder/FounderDashboard.jsx` |
| `#60a5fa` | 2 | `frontend-react/src/pages/Services.jsx` |
| `#7c3aed` | 2 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#87ceeb` | 2 | `frontend-react/src/components/SuccessModal.jsx` |
| `#88220033` | 2 | `frontend-react/src/pages/Admin/Staff/DoctorVerification/DoctorVerification.jsx` |
| `#98fb98` | 2 | `frontend-react/src/components/SuccessModal.jsx` |
| `#a78bfa` | 2 | `frontend-react/src/pages/Services.jsx` |
| `#f5f3ff` | 2 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#ff69b4` | 2 | `frontend-react/src/components/SuccessModal.jsx` |
| `#ffd700` | 2 | `frontend-react/src/components/SuccessModal.jsx` |
| `#fff1f2` | 2 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#1a1f4d` | 1 | `frontend-react/src/pages/Home.jsx` |
| `#1c1c1c` | 1 | `frontend-react/src/pages/User/Reports.jsx` |
| `#1d4ed8` | 1 | `frontend-react/src/pages/User/Reports.jsx` |
| `#1e40af` | 1 | `frontend-react/src/pages/User/PrescriptionReminders.jsx` |
| `#22884455` | 1 | `frontend-react/src/pages/Admin/Staff/Dashboard/StaffDashboard.jsx` |
| `#2496ed` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#252a80` | 1 | `frontend-react/src/pages/Test.jsx` |
| `#2563eb` | 1 | `frontend-react/src/components/ReportAnalysisModal.jsx` |
| `#2a2f6b` | 1 | `frontend-react/src/pages/Home.jsx` |
| `#2b3a8c` | 1 | `frontend-react/src/pages/NotFound.jsx` |
| `#2f347c` | 1 | `frontend-react/src/pages/Home.jsx` |
| `#33449922` | 1 | `frontend-react/src/pages/Admin/Staff/Dashboard/StaffDashboard.jsx` |
| `#339933` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#363636` | 1 | `frontend-react/src/pages/Founder/FounderLogin.jsx` |
| `#38bdf8` | 1 | `frontend-react/src/pages/Doctor/Dashboard.jsx` |
| `#3a3f7a` | 1 | `frontend-react/src/pages/Home.jsx` |
| `#4338ca` | 1 | `frontend-react/src/pages/About2.jsx` |
| `#47a248` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#4c5ec9` | 1 | `frontend-react/src/pages/NotFound.jsx` |
| `#4caf50` | 1 | `frontend-react/src/pages/Founder/FounderLogin.jsx` |
| `#55662233` | 1 | `frontend-react/src/pages/Admin/Staff/Dashboard/StaffDashboard.jsx` |
| `#61dafb` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#6d74dd` | 1 | `frontend-react/src/pages/NotFound.jsx` |
| `#6ee7b7` | 1 | `frontend-react/src/pages/Doctor/Profile.jsx` |
| `#88990022` | 1 | `frontend-react/src/pages/Admin/Staff/Dashboard/StaffDashboard.jsx` |
| `#8b6fff` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#93c5fd` | 1 | `frontend-react/src/pages/User/PrescriptionReminders.jsx` |
| `#a1b5fa` | 1 | `frontend-react/src/pages/NotFound.jsx` |
| `#a5b4fc` | 1 | `frontend-react/src/components/reports/ShareWithDoctorModal.jsx` |
| `#d946ef` | 1 | `frontend-react/src/pages/Doctor/Dashboard.jsx` |
| `#d97706` | 1 | `frontend-react/src/pages/User/SharedReportsManager.jsx` |
| `#dbeafe` | 1 | `frontend-react/src/components/ReportAnalysisModal.jsx` |
| `#e11d48` | 1 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#e53e3e` | 1 | `frontend-react/src/pages/Founder/FounderLogin.jsx` |
| `#e5e7eb` | 1 | `frontend-react/src/pages/User/Reports.jsx` |
| `#ea580c` | 1 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#ebf5ff` | 1 | `frontend-react/src/pages/User/PrescriptionReminders.jsx` |
| `#ecfdf5` | 1 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#edf0f7` | 1 | `frontend-react/src/pages/User/SharedReportsManager.jsx` |
| `#eef2ff` | 1 | `frontend-react/src/pages/About2.jsx` |
| `#f05032` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#f7df1e` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#fb923c` | 1 | `frontend-react/src/pages/Doctor/Dashboard.jsx` |
| `#fecaca` | 1 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#fee2e2` | 1 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#ff9900` | 1 | `frontend-react/src/pages/Team.jsx` |
| `#fff7ed` | 1 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |

#### Near-duplicate pairs: every channel difference ≤ 4 (4.6, 17.3 d)

| Value A (count / files) | Value B (count / files) | ΔR ΔG ΔB ΔA | Files A | Files B |
| :--- | :--- | :--- | :--- | :--- |
| `#0f172a` (35 / 11) | `#111827` (3 / 2) | 2 1 3 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/Appointments.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/Hospitals.jsx`, `frontend-react/src/pages/Doctor/MedicalRecords.jsx`, `frontend-react/src/pages/Doctor/Patients.jsx`, `frontend-react/src/pages/Doctor/Profile.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx`, `frontend-react/src/pages/Services.jsx`, `frontend-react/src/pages/User/SharedReportsManager.jsx` | `frontend-react/src/pages/Founder/FounderDashboard.jsx`, `frontend-react/src/pages/User/Reports.jsx` |
| `#1a1f4a` (4 / 1) | `#1a1f4d` (1 / 1) | 0 0 3 0 | `frontend-react/src/pages/Service2.jsx` | `frontend-react/src/pages/Home.jsx` |
| `#1e1b4b` (10 / 7) | `#1a1f4a` (4 / 1) | 4 4 1 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/Hospitals.jsx`, `frontend-react/src/pages/Doctor/Profile.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx`, `frontend-react/src/pages/Services.jsx` | `frontend-react/src/pages/Service2.jsx` |
| `#1c204f` (2 / 1) | `#1a1f4d` (1 / 1) | 2 1 2 0 | `frontend-react/src/pages/User/VerifyEmail.jsx` | `frontend-react/src/pages/Home.jsx` |
| `#1e1b4b` (10 / 7) | `#1a1f4d` (1 / 1) | 4 4 2 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/Hospitals.jsx`, `frontend-react/src/pages/Doctor/Profile.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx`, `frontend-react/src/pages/Services.jsx` | `frontend-react/src/pages/Home.jsx` |
| `#334155` (5 / 5) | `#374151` (2 / 1) | 4 0 4 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/MedicalRecords.jsx`, `frontend-react/src/pages/Doctor/Patients.jsx`, `frontend-react/src/pages/Services.jsx` | `frontend-react/src/pages/Founder/FounderDashboard.jsx` |
| `#363b7e` (9 / 3) | `#3a3f7a` (1 / 1) | 4 4 4 0 | `frontend-react/src/components/SuccessModal.jsx`, `frontend-react/src/pages/DetailReview.jsx`, `frontend-react/src/pages/Home.jsx` | `frontend-react/src/pages/Home.jsx` |
| `#a1b5fa` (1 / 1) | `#a5b4fc` (1 / 1) | 4 1 2 0 | `frontend-react/src/pages/NotFound.jsx` | `frontend-react/src/components/reports/ShareWithDoctorModal.jsx` |
| `#eef1ff` (7 / 3) | `#ebf5ff` (1 / 1) | 3 4 0 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Home.jsx` | `frontend-react/src/pages/User/PrescriptionReminders.jsx` |
| `#ebf5ff` (1 / 1) | `#eef2ff` (1 / 1) | 3 3 0 0 | `frontend-react/src/pages/User/PrescriptionReminders.jsx` | `frontend-react/src/pages/About2.jsx` |
| `#eef1ff` (7 / 3) | `#eef2ff` (1 / 1) | 0 1 0 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Home.jsx` | `frontend-react/src/pages/About2.jsx` |
| `#f4f7fe` (16 / 2) | `#f0f7ff` (3 / 2) | 4 0 1 0 | `frontend-react/src/pages/User/Login.jsx`, `frontend-react/src/pages/User/Signup.jsx` | `frontend-react/src/pages/Test.jsx`, `frontend-react/src/pages/User/VerifyEmail.jsx` |
| `#f4f7fe` (16 / 2) | `#f5f3ff` (2 / 1) | 1 4 1 0 | `frontend-react/src/pages/User/Login.jsx`, `frontend-react/src/pages/User/Signup.jsx` | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |
| `#f8fafc` (22 / 8) | `#f4f7fe` (16 / 2) | 4 3 2 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/Hospitals.jsx`, `frontend-react/src/pages/Doctor/Patients.jsx`, `frontend-react/src/pages/Doctor/Profile.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx`, `frontend-react/src/pages/User/SharedReportsManager.jsx` | `frontend-react/src/pages/User/Login.jsx`, `frontend-react/src/pages/User/Signup.jsx` |
| `#f4f7fe` (16 / 2) | `#f8fafd` (8 / 3) | 4 3 1 0 | `frontend-react/src/pages/User/Login.jsx`, `frontend-react/src/pages/User/Signup.jsx` | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Services.jsx` |
| `#f8fafc` (22 / 8) | `#f8fafd` (8 / 3) | 0 0 1 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/Hospitals.jsx`, `frontend-react/src/pages/Doctor/Patients.jsx`, `frontend-react/src/pages/Doctor/Profile.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx`, `frontend-react/src/pages/User/SharedReportsManager.jsx` | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Services.jsx` |
| `#f8fafc` (22 / 8) | `#fafbfc` (2 / 2) | 2 1 0 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/Hospitals.jsx`, `frontend-react/src/pages/Doctor/Patients.jsx`, `frontend-react/src/pages/Doctor/Profile.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx`, `frontend-react/src/pages/User/SharedReportsManager.jsx` | `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx` |
| `#f8fafd` (8 / 3) | `#fafbfc` (2 / 2) | 2 1 1 0 | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Services.jsx` | `frontend-react/src/components/reports/ShareWithDoctorModal.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx` |
| `#fef2f2` (5 / 1) | `#fff1f2` (2 / 1) | 1 1 0 0 | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` | `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` |

19 pairs. Value A is the one with the higher occurrence count.

#### Font weights (5.10)

Faces loaded: 400, 500, 700, 900. "Face" is the CSS Fonts weight-matching result against those faces.

| Usage | Weight | Count | Files | Face |
| :--- | ---: | ---: | ---: | ---: |
| `font-normal` | 400 | 7 | 2 | 400 |
| `font-medium` | 500 | 849 | 60 | 500 |
| `font-weight 500` | 500 | 50 | 10 | 500 |
| `font-semibold` | 600 | 372 | 56 | 700 |
| `font-weight 600` | 600 | 46 | 10 | 700 |
| `font-bold` | 700 | 295 | 58 | 700 |
| `font-weight 700` | 700 | 32 | 9 | 700 |
| `font-weight bold` | 700 | 2 | 1 | 700 |
| `font-weight 800` | 800 | 21 | 9 | 900 |
| `font-extrabold` | 800 | 12 | 7 | 900 |

Combined by numeric weight (class + arbitrary + declaration):

| Weight | Count | Files | Face |
| ---: | ---: | ---: | ---: |
| 100 | 0 | 0 | 400 |
| 200 | 0 | 0 | 400 |
| 300 | 0 | 0 | 400 |
| 400 | 7 | 2 | 400 |
| 500 | 899 | 70 | 500 |
| 600 | 418 | 63 | 700 |
| 700 | 329 | 66 | 700 |
| 800 | 33 | 16 | 900 |
| 900 | 0 | 0 | 900 |

#### Legacy_Token usage (17.1, 17.2)

Excludes the `@theme` block in `frontend-react/src/index.css` and class names that contain the token name only as a substring.

| Token | Usages | Files | Forms | Paths |
| :--- | ---: | ---: | :--- | :--- |
| `primary` | 28 | 3 | text-primary 16, bg-primary 5, from-primary 2, from-primary/… 2, to-primary/… 1, via-primary 1, via-primary/… 1 | `frontend-react/src/pages/Home.jsx` (26), `frontend-react/src/components/Footer.jsx` (1), `frontend-react/src/components/Hospital/HospitalDashboardLayout.jsx` (1) |
| `secondary` | 0 | 0 | — | — |
| `accent` | 1 | 1 | to-accent 1 | `frontend-react/src/pages/NotFound.jsx` (1) |
| `xs` | 515 | 3 | xs: 515 | `frontend-react/src/pages/User/Reports.jsx` (485), `frontend-react/src/components/Hospital/HospitalDashboardLayout.jsx` (29), `frontend-react/src/pages/User/SharedReportsManager.jsx` (1) |
| `font-montserrat` | 0 | 0 | — | — |
| `shadow-custom` | 0 | 0 | — | — |

Unused (count 0): `secondary`, `font-montserrat`, `shadow-custom`.

`xs:` false-positive check: 515 raw `xs:` substrings in 3 files; 515 counted as the `xs` variant (no whitespace or quote after the colon, not preceded by a word character, `-` or `@`, plus `--breakpoint-xs`).

Excluded substring matches (class-like names containing `primary`, `secondary` or `accent`):

| Name | Count | Files |
| :--- | ---: | ---: |
| `btn-primary` | 2 | 2 |
| `btn-secondary` | 2 | 2 |

#### `font-montserrat` usage files (17.5)

None: no file under `frontend-react/src` uses `font-montserrat` or `--font-montserrat` outside the `@theme` block.

#### Favicon type mismatch (17.4)

- `frontend-react/index.html` declares `type="image/svg+xml"` for `/logo.png`.
- `frontend-react/public/logo.png` contents: PNG (signature 89 50 4E 47 0D 0A 1A 0A), 500×500, bit depth 8, color type 6 (RGBA).

## Task 8.1: Montserrat Alternates license

For DESIGN.md section 4 (Requirements 6.1, 6.2):

| Field | Value |
| :--- | :--- |
| License name | TODO: confirm |
| License URL | TODO: confirm |

Why "TODO: confirm" (Requirement 6.2): the Google Fonts pages render client-side and returned no readable content to a plain fetch.

- `https://fonts.google.com/specimen/Montserrat+Alternates`: "Could not extract readable content from this webpage."
- `https://fonts.google.com/specimen/Montserrat+Alternates/license`: same result.

Supporting evidence for the owner (not the specimen page, so not recorded as the published license): the Google Fonts metadata endpoint `https://fonts.google.com/metadata/fonts/Montserrat+Alternates` returns `"license": "ofl"` and `"isOpenSource": true`, and its family description says the project is released "under a libre license, the SIL Open Font License". It gives no license URL. To close the TODO, open the specimen page's License tab in a browser and copy the license name and link exactly as shown.

Requirement 6.3: no request was made to Fontshare (`fontshare.com`, `api.fontshare.com`). No Satoshi files, license files or `@font-face` rules were added.

## Task 5.2: Starter page

File: `src/app/page.tsx` (create-next-app starter, outside the Requirement 1.1 file list). Edited under owner decision D2 (option a, "replace raw hex in page.tsx with Semantic_Token utilities"), approved under Requirement 1.7. No legacy page was ported. All other markup, content and classes are unchanged. The page uses `font-sans` and `font-mono` and no Geist variables, so it needed no font change.

| Element | Before | After |
| :--- | :--- | :--- |
| "Deploy Now" link | `bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]` | `bg-brand text-on-brand hover:bg-brand-hover` |
| "Documentation" link | `dark:hover:bg-[#1a1a1a]` | `dark:hover:bg-surface-hover` |

The old utilities `bg-foreground` and `text-background` stopped resolving once task 4.1 removed `--color-foreground` and `--color-background`. The new utilities map to `--color-brand`, `--color-on-brand`, `--color-brand-hover` and `--color-surface-hover` in the `@theme inline` block of `src/app/globals.css`, so the Semantic_Tokens supply both the light and dark values and the `dark:` hover override on "Deploy Now" is no longer needed.

Checks, run in `frontend/`:
- `grep -nE '#[0-9a-fA-F]{3,8}\b' src/app/page.tsx`: no match (exit 1), so no hex literal remains (Requirements 3.9, 10.5).
- `grep -nE 'bg-foreground|text-background|--font-geist|geist' src/app/page.tsx`: no match.
- `npx eslint src/app/page.tsx`: exit 0, no output.
- `npx tsc --noEmit`: exit 0, no output.
## Task 4.5: Plain classes
File: `frontend/src/app/globals.css`, appended after the 23 `@utility` classes, unlayered, in legacy order. Source: `frontend-react/src/index.css` lines 147–155 and 218–506 (plain classes only; keyframes and animation classes are left for task 4.6).
Duplicate classes (Requirements 3.8, 17.3 condition c). Losing and winning strings are copied from `frontend-react/src/index.css` and from the target compiled with `@tailwindcss/node` `compile()` (candidates `card-hover`, `glass`, `custom-scrollbar`, `mobile-search-overlay`):
| Selector | Property | Losing value (location) | Winning value (location) |
| :--- | :--- | :--- | :--- |
| `.custom-scrollbar` | `scrollbar-width` | `none` (`frontend-react/src/index.css:150`) | `thin` (`frontend-react/src/index.css:290`) |
| `.custom-scrollbar` | `-ms-overflow-style` | — | `none` (line 149, no conflict, kept) |
| `.custom-scrollbar` | `scrollbar-color` | — | legacy `rgba(147, 197, 253, 0.8) rgba(243, 244, 246, 0.5)` (line 291), ported as `color-mix(in srgb, var(--sem-scrollbar-thumb) 80%, transparent) color-mix(in srgb, var(--sem-scrollbar-track) 50%, transparent)` |
| `.custom-scrollbar::-webkit-scrollbar` | `display`, `width` | — | `display: none` (line 154) and `width: 6px` (line 295), both kept |
| `.mobile-search-overlay` | `backdrop-filter`, `-webkit-backdrop-filter` | `blur(10px)` (lines 248–249) | `blur(20px) saturate(180%)` (lines 443–444) |
| `.mobile-search-overlay` | `background` | — | legacy `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)` (line 247), ported with `var(--sem-overlay)` 40% / 60% |
| `.card-hover` | `transition-property` | `box-shadow` (`@utility`, `@layer utilities`) | `all` (plain class, line 431) |
| `.card-hover` | `transition-timing-function` | `var(--tw-ease, var(--default-transition-timing-function))` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `.card-hover` | `transition-duration` | `var(--tw-duration, var(--default-transition-duration))` then `300ms` | `0.3s` |
| `.card-hover:hover` | `box-shadow` | `var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)` with `--tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1))` inside `@media (hover: hover)` | `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)` (lines 436–438) |
| `.card-hover:hover` | `transform` | — | `translateY(-4px) scale(1.02)` (no conflict) |
Handling: `.custom-scrollbar` and `.mobile-search-overlay` are each merged into one rule at the position of the later legacy rule. Both `.card-hover` definitions are kept in their legacy layers, so the cascade picks the same winners as the legacy app; `--tw-duration: 300ms` and `--tw-shadow` set by the utility remain.
Color rewrites (Requirements 10.6, 10.7, 11.7, 11.5): every `rgba(…)` in `.glass-search-dropdown`, `.glass-search-card` (and `:hover`), `.mobile-search-overlay`, `.mobile-search-modal`, `.glass-effect` and the `.custom-scrollbar` track/thumb/hover rules is now `color-mix(in srgb, var(--sem-*) N%, transparent)` with N = legacy alpha × 100, using `glass-surface`, `glass-border`, `shadow`, `overlay` and the `scrollbar-*` tokens. `.glass` uses `@apply bg-glass-surface/10 backdrop-blur-lg`. `.gradient-text` uses `var(--sem-gradient-text-start)` / `var(--sem-gradient-text-end)` (was `#667eea` / `#764ba2`). The `rgba` literals in `.modern-button:hover`, `.search-focus-animation:focus`, `.mobile-search-input:focus`, `.mobile-search-btn::before` and `.card-hover:hover` are unchanged, as design.md lists. No new Semantic_Token was needed.
Observation: the Tailwind compiler adds an `@supports (color: color-mix(in lab, red, red))` wrapper to each declaration that contains `color-mix()`, preceded by a fallback that drops the alpha (for example `.mobile-search-overlay` falls back to an opaque `var(--sem-overlay)` gradient). Browsers that support `color-mix()` use the ported value. The legacy `bg-white/10` in `.glass` gets the same kind of fallback from Tailwind.
Checks, run in `frontend/`:
- `@tailwindcss/node` `compile(globals.css).build([...])`: succeeded, 29,415 bytes. Compiled output has one `.custom-scrollbar {` and one `.mobile-search-overlay {` rule, `.card-hover` in `@layer utilities` and the plain `.card-hover` unlayered after it.
- `grep -niE '#[0-9a-f]{3,8}\b' src/app/globals.css | grep -v -- '--prim-'`: no match (Requirement 10.7).

## Stage 1 report items (task 8.2)

Legacy paths below are relative to the repository root. Target paths are relative to `frontend/`. Line numbers for `frontend-react/src/index.css` are from `grep -n` on the current file (613 lines). Throwaway scripts used for this section lived in `/tmp` only (`/tmp/dup-compile.mjs`, `/tmp/report-calc.mjs`); nothing was added to the repository.

### Root_Design_Doc disagreements (Requirements 2.4, 17.3 e)

The Root_Design_Doc (`DESIGN.md` at the repository root, unchanged, sha256 `5b13f917…cb47` from task 1.2) was compared with the legacy code for the values this feature ports or reports. In every row the code value is used.

| Item | Root_Design_Doc value | Legacy_App value | Legacy_App file paths | Handling |
| :--- | :--- | :--- | :--- | :--- |
| Hero gradient deep navy ("Brand Deep Navy", root doc §2.2) | One value: `#1a1f4d`, `from-[#1a1f4d]`, "start of the public hero background gradient" | Two values for the deep-navy stop. `#1a1f4a` occurs 4 times, all as the gradient end `to-[#1a1f4a]` after `from-[#252A61]`. `#1a1f4d` occurs once, as `from-[#1a1f4d]` in the Home hero, which the root doc describes correctly. | `#1a1f4a`: `frontend-react/src/pages/Service2.jsx:228, 407, 464, 481`. `#1a1f4d`: `frontend-react/src/pages/Home.jsx:324` | Both kept as primitives (`--prim-hero-navy`, `--prim-hero-navy-alt`). `hero-gradient-deep` → `#1a1f4a` (higher count, Requirement 4.6). Merge decision for the owner (see "Ambiguous items"). |
| File paths (root doc §11, 19 rows) | `/Frontend/tailwind.config.js`, `/Frontend/src/index.css`, … | All 19 files exist at the same relative path under `frontend-react/`. On this case-insensitive disk, `/Frontend` resolves to `frontend/`, which is the new Next.js Target_App, so the root doc paths currently point at the wrong app. | `frontend-react/tailwind.config.js`, `frontend-react/src/index.css`, `frontend-react/postcss.config.js`, `frontend-react/vite.config.js`, `frontend-react/src/config/planConfig.js` and the 14 component and layout files in root doc §11 | Code path `frontend-react/` used. `frontend/DESIGN.md` (task 17) uses repository-relative paths. |
| Doctor deep gradient (root doc §2.2) | Tailwind classes `from-[#0f172a] via-[#1e1b4b]` | No class form (0 uses of `from-[#0f172a]` or `via-[#1e1b4b]`). Inline `style` gradients with 2 to 4 stops: `linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #252A61 100%)`, `linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #252A61 75%, #1e3a5f 100%)`, `linear-gradient(135deg, #0f172a, #1e1b4b)` | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx:105`, `frontend-react/src/components/reports/ShareWithDoctorModal.jsx:150`, `frontend-react/src/pages/Doctor/Profile.jsx:71`, `frontend-react/src/pages/Doctor/SharedReports.jsx:485`, `frontend-react/src/pages/Doctor/Dashboard.jsx:271, 487`, `frontend-react/src/pages/Doctor/Hospitals.jsx:73`, `frontend-react/src/pages/Services.jsx:176, 647` | Page-level gradient, not ported (Requirement 1.4). `#1e1b4b` stays without a Semantic_Token (near-duplicate, see "Ambiguous items"). |
| Inter loading (root doc §3.1) | Loaded by `<link>` with weights 300–900 in `DoctorDashboardLayout.jsx`, `Services.jsx` and `ReportAnalysisModal.jsx` | `<link>` in five files, with two different weight lists: 300;400;500;600;700;800;900 (`DoctorDashboardLayout.jsx:198`, `Doctor/Dashboard.jsx:369`, `Services.jsx:163`), 400;500;600;700;800 (`Doctor/SharedReports.jsx:70`), 400;500;600;700;800;900 (`User/SharedReportsManager.jsx:233`). `ReportAnalysisModal.jsx` has no `<link>`; it sets inline `fontFamily: 'Inter, Poppins, Satoshi, sans-serif'` (lines 284, 350). | `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx`, `frontend-react/src/pages/Doctor/Dashboard.jsx`, `frontend-react/src/pages/Doctor/SharedReports.jsx`, `frontend-react/src/pages/User/SharedReportsManager.jsx`, `frontend-react/src/pages/Services.jsx`, `frontend-react/src/components/ReportAnalysisModal.jsx` | Inter not loaded (Requirement 5.6, below). |
| Shadow scale (root doc §5.2) | `shadow-sm` `0 1px 2px 0 rgb(0 0 0 / 0.05)`; `shadow-md` `0 4px 6px -1px rgb(0 0 0 / 0.1)`; `shadow-lg` `0 10px 15px -3px rgb(0 0 0 / 0.1)`; `shadow-2xl` "0 25px 50px" | Tailwind 4.1.8 `theme.css:358–364`: `--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` (the root doc's `shadow-sm` value is `--shadow-xs`, line 359); `--shadow-md` adds `0 2px 4px -2px rgb(0 0 0 / 0.1)`; `--shadow-lg` adds `0 4px 6px -4px rgb(0 0 0 / 0.1)`; `--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)` | `frontend-react/node_modules/tailwindcss/theme.css:358–364` (used by `shadow-*` classes throughout `frontend-react/src`, and by `@utility card` `shadow-xs`, `btn-primary` `shadow-xs hover:shadow-md`, `card-hover` `hover:shadow-lg` in `frontend-react/src/index.css`) | Target uses the Tailwind default shadows unchanged (4.3.3 `theme.css` has the same values), so the ported classes keep the code values. |
| Palette hex values (root doc §2.2, §2.4) | Tailwind v3 hex next to v4 classes: `bg-gray-900` = `#111827`, `bg-gray-800` = `#1f2937`, `bg-gray-50` = `#f9fafb`, `bg-red-600` = `#dc2626` | The legacy app runs Tailwind 4.1.8, where these classes are OKLCH: `gray-900` `oklch(21% 0.034 264.665)` ≈ 16, 24, 40 (hex 17, 24, 39); `gray-800` `oklch(27.8% 0.033 256.848)` ≈ 30, 41, 57 (hex 31, 41, 55); `gray-50` ≈ 249, 250, 251 (same as hex); `red-600` `oklch(57.7% 0.245 27.325)` ≈ 231, 0, 11 clipped (hex 220, 38, 38). The literal `#dc2626` also occurs 13 times in 2 files. | `frontend-react/node_modules/tailwindcss/theme.css:16, 226, 234, 235`; `#dc2626`: `frontend-react/src/pages/Doctor/EmergencyFolder.jsx` (11), `frontend-react/src/pages/User/SharedReportsManager.jsx` | Classes and hex are kept apart: inventory hex stays hex (Requirement 4.7), palette utilities use the OKLCH literal (Requirement 20.2). |
| Token and dark-mode source (root doc §1, §2.1, §2.4, §5.2) | Tokens and `darkMode: 'class'` "configured in `tailwind.config.js`" | `frontend-react/src/index.css` has no `@config` directive, so Tailwind v4 does not load `tailwind.config.js`. The effective tokens are the `@theme` block (`index.css:11–20`) and the effective dark variant is `@custom-variant dark (&:is(.dark *))` (`index.css:9`). Token values are equal in both files (hex case differs only: `#252A61` vs `#252a61`). | `frontend-react/tailwind.config.js`, `frontend-react/src/index.css:9–20` | Values taken from `@theme`. No value conflict. |

Checked and in agreement (no entry): Satoshi `@import` and weights 400/500/700/900 (`index.css:1`); `--font-montserrat: Montserrat Alternates, sans-serif`; Montserrat Alternates use in `Navbar.jsx:258` and `Test.jsx`; `xs` 320px; `--shadow-custom`; the `@utility` bodies quoted in root doc §4.4, §6.1–6.3, §6.5; the keyframes in §8.2; the reduced-motion block in §9; `hand logo.png` as favicon (`frontend-react/public/logo.png` and `frontend-react/src/assets/Logo/hand logo.png` have the same sha256 `c5f20ca6…575c`).

### Font deviations (Requirements 2.8, 2.9)

| Token or selector | CSS property | Legacy_App value | Target_App value | Requirement |
| :--- | :--- | :--- | :--- | :--- |
| `html`, `body` | `font-family` | `'Satoshi', sans-serif` (`frontend-react/src/index.css:166`, inside `@layer utilities` on `html, body, #root`) | `var(--font-sans)`, which is the Base_Font_Stack `var(--font-montserrat-alternates), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif` (`src/app/globals.css:272–275` in `@layer base`, stack at line 175) | 2.8, 5.4 |
| `--font-sans` (`font-sans`, preflight, `prose`, forms controls) | `font-family` | Tailwind default `ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` (`frontend-react/node_modules/tailwindcss/theme.css:2–4`) | Base_Font_Stack, in `@theme inline` (`src/app/globals.css:175`) | 2.8, 5.5 |
| `--font-montserrat` (`font-montserrat` utility) | `font-family` | `Montserrat Alternates, sans-serif` (`frontend-react/src/index.css:18`). The font was never loaded, so it rendered in a locally installed copy or in the `sans-serif` fallback. | `var(--font-montserrat-alternates), sans-serif` (`src/app/globals.css:176`), with Montserrat Alternates 400/500/700/900 loaded by `next/font/google` in `src/app/layout.tsx` | 2.9, 5.1 (2.6) |

Notes:
- The legacy declaration sits in `@layer utilities`; the target rule sits in `@layer base` (design.md section order, task 4.3). Both use type selectors, so a font class on `html` or `body` wins in both apps.
- `font-montserrat` has 0 uses in `frontend-react/src` (task 3.1). The legacy pages use arbitrary values instead: `font-['Montserrat Alternates']` in `frontend-react/src/pages/Test.jsx:96, 99, 110, 130`, and `font-[Montserrat Alternates]` in `frontend-react/src/components/Navbar.jsx:258`. The Navbar class contains a space, so Tailwind reads it as two invalid candidates; the legacy build `frontend-react/dist/assets/index.BwO1urkQ.css` contains no `Montserrat` rule. Neither file is ported (Requirement 1.2). In the Target_App every element that rendered in Satoshi now renders in Montserrat Alternates (Requirement 17.5).

### Duplicate-class losing and winning values, from compiled CSS (Requirements 3.8, 17.3 c)

Compiled with `@tailwindcss/node` `compile(css, { base }).build(["card-hover", "custom-scrollbar", "mobile-search-overlay", "glass", "shadow-lg"])`:
- legacy: `frontend-react/node_modules/@tailwindcss/node` 4.1.8 on `frontend-react/src/index.css` (23,797 bytes of output)
- target: `frontend/node_modules/@tailwindcss/node` 4.3.3 on `src/app/globals.css` (33,145 bytes)

The strings below are copied from that output. They confirm the task 4.5 table (taken from source): every winner and loser is the same, and the target has one merged `.custom-scrollbar` rule and one merged `.mobile-search-overlay` rule.

| Selector | Property | Losing value (compiled legacy) | Winning value (compiled legacy) | Compiled target |
| :--- | :--- | :--- | :--- | :--- |
| `.custom-scrollbar` | `scrollbar-width` | `none` (1st unlayered rule, source `index.css:150`) | `thin` (2nd unlayered rule, source `index.css:290`) | `scrollbar-width: thin;` in the single merged rule (`globals.css:514`) |
| `.custom-scrollbar` | `-ms-overflow-style` | — | `none` (no conflict) | `-ms-overflow-style: none;` |
| `.custom-scrollbar` | `scrollbar-color` | — | `rgba(147, 197, 253, 0.8) rgba(243, 244, 246, 0.5)` | `scrollbar-color: var(--sem-scrollbar-thumb) var(--sem-scrollbar-track);` then, inside `@supports (color: color-mix(in lab, red, red))`, `color-mix(in srgb, var(--sem-scrollbar-thumb) 80%, transparent) color-mix(in srgb, var(--sem-scrollbar-track) 50%, transparent)` |
| `.custom-scrollbar::-webkit-scrollbar` | `display`, `width` | — | `display: none;` (1st rule) and `width: 6px;` (2nd rule) | `display: none; width: 6px;` in one rule (`globals.css:521`) |
| `.mobile-search-overlay` | `backdrop-filter`, `-webkit-backdrop-filter` | `blur(10px)` (1st rule) | `blur(20px) saturate(180%)` (2nd rule) | `backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);` (`globals.css:674`) |
| `.mobile-search-overlay` | `background` | — | `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)` | `linear-gradient( 135deg, var(--sem-overlay) 0%, var(--sem-overlay) 100% )`, then in `@supports`: `linear-gradient( 135deg, color-mix(in srgb, var(--sem-overlay) 40%, transparent) 0%, color-mix(in srgb, var(--sem-overlay) 60%, transparent) 100% )` |
| `.card-hover` | `transition-property` | `box-shadow` (`@layer utilities`) | `all`, from the unlayered `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);` | Same two rules, same layers. `@layer utilities` body is byte-identical to legacy. Plain rule: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);` (`globals.css:660`) |
| `.card-hover` | `transition-timing-function` | `var(--tw-ease, var(--default-transition-timing-function))` | `cubic-bezier(0.4, 0, 0.2, 1)` (shorthand) | same as legacy |
| `.card-hover` | `transition-duration` | `var(--tw-duration, var(--default-transition-duration))`, then `--tw-duration: 300ms; transition-duration: 300ms;` | `0.3s` (shorthand) | same as legacy |
| `.card-hover:hover` | `box-shadow` | `var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)` with `--tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1))`, inside `&:hover { @media (hover: hover) { … } }` | `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)` | same as legacy (`globals.css:664`) |
| `.card-hover:hover` | `transform` | — | `translateY(-4px) scale(1.02)` (no conflict) | same as legacy |

Production build cross-check (`frontend/.next/static/chunks/05nee3gz2a3dz.css`, built after the last `globals.css` change): `.custom-scrollbar{-ms-overflow-style:none;scrollbar-width:thin;…}` and `.custom-scrollbar::-webkit-scrollbar{width:6px;display:none}` appear once each, and `.card-hover` appears once in the utilities layer and once unlayered.

Observation for the owner, not a change: in the production build, Lightning CSS minification keeps only `-webkit-backdrop-filter` for plain-class rules that declare both the prefixed and unprefixed property with a literal value. Examples: `.mobile-search-overlay{-webkit-backdrop-filter:blur(20px)saturate(180%)}`, `.glass-effect{-webkit-backdrop-filter:blur(20px)saturate(180%);…}`. The legacy production build behaves the same way (`frontend-react/dist/assets/index.BwO1urkQ.css`: `.mobile-search-overlay{-webkit-backdrop-filter:blur(20px)saturate(180%)}`), so the output matches the legacy app. Browsers that support only the unprefixed property would show no blur in either app. This could be confirmed in a browser during the Manual_Browser_Checks.

### Omitted legacy rules (Requirement 3.12)

| Legacy rule | Location | Replaced by |
| :--- | :--- | :--- |
| `@import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap') layer(base);` | `frontend-react/src/index.css:1` | Satoshi dropped. No remote font import (Requirements 5.3, 6.3) |
| `font-family: 'Satoshi', sans-serif;` on `html, body, #root` | `frontend-react/src/index.css:166` (rule at 157–169) | Base_Font_Stack on `html, body` (`src/app/globals.css:272–275`) (Requirements 2.8, 5.4) |
| `@custom-variant dark (&:is(.dark *));` | `frontend-react/src/index.css:9` | Requirement 9.8 (dark variant set up in stage 2) |
| `#root` selector | `frontend-react/src/index.css:162` | The Target_App has no element with id `root`. `overflow-x`, `width`, `max-width` are kept on `html, body` (`src/app/globals.css:284`) |
| `@media (prefers-reduced-motion: reduce)` block (5 selectors, `animation: none !important`) | `frontend-react/src/index.css:606–614` | Replaced by the full block from design.md (all 11 animation selectors) at `src/app/globals.css:829` (Requirement 12.6) |

### Ambiguous items (Requirements 4.5, 4.6, 10.8, 17.3)

| Item | Condition | Paths | Conflicting values | Interim handling |
| :--- | :--- | :--- | :--- | :--- |
| `#1a1f4a` (4 / 1 file) vs `#1a1f4d` (1 / 1 file) | 17.3 (d), (a), (e); 4.6 pair | `frontend-react/src/pages/Service2.jsx`, `frontend-react/src/pages/Home.jsx`; root `DESIGN.md` §2.2 | ΔB 3 | Both primitives (`--prim-hero-navy`, `--prim-hero-navy-alt`). `hero-gradient-deep` → `#1a1f4a` (higher count). Note: `#1a1f4a` is also a single-file value (4.5), so 4.5 ("no Semantic_Token") and 4.6 ("point the token to the higher count") conflict for this value. design.md follows 4.6. Owner: confirm, or drop `hero-gradient-deep`. |
| `#f8fafc` (22 / 8) vs `#fafbfc` (2 / 2) | (d); 4.6 pair | 8 and 2 files listed in task 3.1 near-duplicate table | ΔR 2, ΔG 1 | Both primitives. `surface-subtle` → `#f8fafc` |
| `#0f172a` (35 / 11) vs `#111827` (3 / 2) | (d); 4.6 pair | 11 doctor and report files; `frontend-react/src/pages/Founder/FounderDashboard.jsx`, `frontend-react/src/pages/User/Reports.jsx` | ΔR 2, ΔG 1, ΔB 3 | Both primitives. `text` → `#0f172a` |
| Other near-duplicate pairs (every channel ≤ 4) where at most one value has a Semantic_Token, so 4.6 does not apply: `#1e1b4b`/`#1a1f4a`, `#1e1b4b`/`#1a1f4d`, `#1c204f`/`#1a1f4d`, `#363b7e`/`#3a3f7a`, `#334155`/`#374151`, `#a1b5fa`/`#a5b4fc`, `#eef1ff`/`#eef2ff`, `#eef1ff`/`#ebf5ff`, `#ebf5ff`/`#eef2ff`, `#f4f7fe`/`#f0f7ff`, `#f4f7fe`/`#f5f3ff`, `#f8fafc`/`#f4f7fe`, `#f4f7fe`/`#f8fafd`, `#f8fafc`/`#f8fafd`, `#f8fafd`/`#fafbfc`, `#fef2f2`/`#fff1f2` | (d), informational | Per pair in the task 3.1 near-duplicate table | Channel differences in that table | No new Semantic_Token. Listed for a merge decision. design.md names `#1e1b4b`, `#1c204f`, `#f8fafd`, `#f4f7fe`, `#eef1ff`/`#eef2ff`, `#363b7e`/`#3a3f7a`, `#fef2f2`/`#fff1f2`; the inventory also found `#334155`/`#374151`, `#a1b5fa`/`#a5b4fc`, `#ebf5ff`, `#f0f7ff`, `#f5f3ff`. |
| `#ffffff` (68 / 13) | (b) | 13 files (task 3.1 inventory) | 38 `color`, 21 `background`, other 9 | Mapped to `on-brand`, `on-auth-primary`, `emergency-fg` (text on color) and `page`, `surface`, `input-bg`, `glass-*`, `skeleton-highlight` (surfaces). Owner confirms (D7) |
| `#4318ff` (66 / 4) | (b), by CSS property only | `frontend-react/src/pages/User/Login.jsx`, `frontend-react/src/pages/User/Signup.jsx`, `frontend-react/src/pages/User/PricingPage.jsx`, `frontend-react/src/components/Navbar.jsx` | `color` 24, gradient stop 16, `background-color` 15, border 6, other 5; no property over half | Mapped to `auth-primary`. Correction to design.md, which says all 66 uses are on auth screens: 60 are in `Login.jsx` (30) and `Signup.jsx` (30); the other 6 are `from-[#252A61] to-[#4318FF]` brand gradients in `PricingPage.jsx` (5) and `Navbar.jsx:304` (1). The auth role still covers 91% (more than half), so the mapping holds; the gradient uses stay unported page code. Owner can confirm. |
| The 65 single-file values | (a); 4.5 | One file each: task 3.1 "Single-file values" table (for example `#6236ff` 10 in `frontend-react/src/pages/Team.jsx`, `#b91c1c` 9 and `#fef2f2` 5 in `frontend-react/src/pages/Doctor/EmergencyFolder.jsx`, `#f472b6` 5 in `frontend-react/src/pages/Services.jsx`) | — | No Semantic_Token, except `#1a1f4a` (first row). `#1a1f4d` has a primitive but no token. |
| `.custom-scrollbar`, `.card-hover`, `.mobile-search-overlay` | (c) | `frontend-react/src/index.css:148, 289` / `60, 430` / `246, 442` | See the duplicate-class table above | Winners ported per Requirement 3.8 |
| Root_Design_Doc values and `/Frontend/` paths | (e) | Root `DESIGN.md` §2.2, §3.1, §5.2, §11 | See "Root_Design_Doc disagreements" | Code values used |
| Requirement 10.8 | — | — | — | No items found. The hex values used by ported classes are `#252a61` and `#3b3b98` (`nav-link`, `btn-primary`) and `#667eea` and `#764ba2` (`.gradient-text`, 2 files each: `frontend-react/src/index.css:400` and `frontend-react/src/pages/User/Reports.jsx:179`). None is single-file or has more than one role. |
| Requirement 20.5 | — | — | — | No items found: every replaced palette utility has a single role (Requirement 20.4 table below). |

The favicon type mismatch (17.4) and the `font-montserrat` usage files (17.5) are recorded in the task 3.1 section.

### Palette equivalences (Requirements 2.7, 4.7)

Inventory primitives whose hex equals a Tailwind v3 palette hex keep the hex (comments in `src/app/globals.css:15–35`). The second computed value is the Tailwind v4 palette variable (4.3.3 `theme.css`; 4.1.8 has the same strings), converted with the CSS Color 4 OKLCH → linear sRGB → sRGB formulas, clipped to the sRGB gamut and rounded to 8 bits. Browsers that gamut-map instead of clipping can differ by a few units on clipped rows; the owner can confirm in a browser. The point stands either way: the palette variable does not reproduce the hex, so the Semantic_Token points at the hex primitive.

| Primitive | Hex (8-bit sRGB) | Palette variable | Palette value | Palette computed (8-bit sRGB) | Semantic_Tokens using the primitive |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--prim-white` | `#ffffff` (255, 255, 255) | `--color-white` | `#fff` | 255, 255, 255 (equal) | `page`, `surface`, `on-brand`, `on-auth-primary`, `emergency-fg`, `input-bg`, `glass-surface`, `glass-border`, `skeleton-highlight` |
| `--prim-black` | `#000000` (0, 0, 0) | `--color-black` | `#000` | 0, 0, 0 (equal) | `page-fg`, `shadow`, `overlay` |
| `--prim-ink-900` | `#0f172a` (15, 23, 42) | `--color-slate-900` | `oklch(20.8% 0.042 265.755)` | 15, 23, 43 | `text`, `success-fg`, `warning-fg`, `danger-fg`, `info-fg` |
| `--prim-ink-900-alt` | `#111827` (17, 24, 39) | `--color-gray-900` | `oklch(21% 0.034 264.665)` | 16, 24, 40 | none (near-duplicate) |
| `--prim-slate-600` | `#475569` (71, 85, 105) | `--color-slate-600` | `oklch(44.6% 0.043 257.281)` | 69, 85, 108 | `text-subtle` |
| `--prim-slate-500` | `#64748b` (100, 116, 139) | `--color-slate-500` | `oklch(55.4% 0.046 257.417)` | 98, 116, 142 | `text-muted` |
| `--prim-slate-200` | `#e2e8f0` (226, 232, 240) | `--color-slate-200` | `oklch(92.9% 0.013 255.508)` | 226, 232, 240 (equal after rounding) | `skeleton-base` |
| `--prim-slate-100` | `#f1f5f9` (241, 245, 249) | `--color-slate-100` | `oklch(96.8% 0.007 247.896)` | 241, 245, 249 (equal after rounding) | `surface-muted` |
| `--prim-slate-50` | `#f8fafc` (248, 250, 252) | `--color-slate-50` | `oklch(98.4% 0.003 247.858)` | 248, 250, 252 (equal after rounding) | `surface-subtle` |
| `--prim-emerald-500` | `#10b981` (16, 185, 129) | `--color-emerald-500` | `oklch(69.6% 0.17 162.48)` | 0, 188, 125 (clipped) | `success`, `chart-3` |
| `--prim-amber-500` | `#f59e0b` (245, 158, 11) | `--color-amber-500` | `oklch(76.9% 0.188 70.08)` | 254, 154, 0 (clipped) | `warning`, `chart-5` |
| `--prim-red-500` | `#ef4444` (239, 68, 68) | `--color-red-500` | `oklch(63.7% 0.237 25.331)` | 251, 44, 54 | `danger` |
| `--prim-red-600` | `#dc2626` (220, 38, 38) | `--color-red-600` | `oklch(57.7% 0.245 27.325)` | 231, 0, 11 (clipped) | `emergency` |
| `--prim-sky-500` | `#0ea5e9` (14, 165, 233) | `--color-sky-500` | `oklch(68.5% 0.169 237.323)` | 0, 166, 244 (clipped) | `info`, `chart-4` |
| `--prim-indigo-500` | `#6366f1` (99, 102, 241) | `--color-indigo-500` | `oklch(58.5% 0.233 277.117)` | 97, 95, 255 (clipped) | `chart-1` |
| `--prim-purple-500` | `#8b5cf6` (139, 92, 246) | `--color-violet-500` | `oklch(60.6% 0.25 292.717)` | 142, 81, 255 (clipped) | `chart-2` |
| `--prim-orange-500` | `#f97316` (249, 115, 22) | `--color-orange-500` | `oklch(70.5% 0.213 47.604)` | 255, 105, 0 (clipped) | `chart-6` |

### Inter and Satoshi skipped (Requirements 5.6, 6.4)

- **Inter: skipped (Requirement 5.6).** Inter is an ad-hoc component font, not a Legacy_Token, so it is not loaded in the Target_App. Legacy files that load it with a Google Fonts `<link>`: `frontend-react/src/components/Doctor/DoctorDashboardLayout.jsx:198`, `frontend-react/src/pages/Services.jsx:163`, `frontend-react/src/pages/Doctor/Dashboard.jsx:369`, `frontend-react/src/pages/Doctor/SharedReports.jsx:70`, `frontend-react/src/pages/User/SharedReportsManager.jsx:233`. The report modal code (`frontend-react/src/components/ReportAnalysisModal.jsx:284, 350`) names Inter in an inline `fontFamily` without loading it. No Design_System token, utility or sample needs Inter, so Requirement 5.7 has nothing to ask. `repo.check.mjs` confirms zero `Inter` in `layout.tsx` and `globals.css`.
- **Satoshi: skipped (Requirement 6.4).** Reason: dropped by project-owner decision; base font is Montserrat Alternates. No Satoshi files, license or `@font-face` were added and no request was made to Fontshare (Requirement 6.3, task 8.1).

### Font weight counts (Requirement 5.10)

From the task 3.1 inventory (`frontend-react/src`, `.js`/`.jsx`/`.ts`/`.tsx`/`.css`/`.html`, with or without variant prefixes). Faces loaded: 400, 500, 700, 900.

| Usage | Count | Files | Face it resolves to |
| :--- | ---: | ---: | ---: |
| `font-semibold` | 372 | 56 | 700 |
| `font-extrabold` | 12 | 7 | 900 |
| `font-thin` | 0 | 0 | 400 |
| `font-extralight` | 0 | 0 | 400 |
| `font-light` | 0 | 0 | 400 |
| inline or CSS weight 100 | 0 | 0 | 400 |
| inline or CSS weight 200 | 0 | 0 | 400 |
| inline or CSS weight 300 | 0 | 0 | 400 |
| inline or CSS weight 600 | 46 | 10 | 700 |
| inline or CSS weight 800 | 21 | 9 | 900 |
| weight 600 combined (class + inline) | 418 | 63 | 700 |
| weight 800 combined (class + inline) | 33 | 16 | 900 |

The other weights are in the task 3.1 tables (`font-medium` 849 / 60, `font-bold` 295 / 58, `font-normal` 7 / 2).

### Pending owner decision files (Requirement 7.5)

All seven files listed in the task 6.1 section are still present, unchanged and "pending owner decision". Their sha256 prefixes were re-checked for this task and match task 6.1: `frontend/src/app/favicon1.ico` (`54974281…`), `frontend/src/app/favicon2.ico` (`7925bf55…`), `frontend/src/assets/Medicare logo/solid/medicare-logo-text-only-on-light.svg` (`fcda2efc…`), `frontend/src/assets/Medicare logo/solid/medicare-logo-text-only-on-dark.svg` (`4133b06f…`), `frontend/src/assets/Medicare logo/transparent/ medicare-logo-icon-tp-on-white.png` (`6cd71b71…`), `frontend/src/assets/Medicare logo/transparent/ medicare-logo-icon-tp-on-white.svg` (`7d0b2d9f…`), `frontend/src/assets/Medicare logo/medicare_logo_text_only_curve_light copy.png` (`86c4b585…`). Owner question: keep, delete or rename each one.

### Requirement 20.4 table (light values)

One row per replaced Palette_Utility. Light 8-bit sRGB comes from the same OKLCH conversion as above (`--prim-tw-blue-300` and `--prim-tw-yellow-800` are clipped in one channel). Dark values are the design.md proposals; they are not in `globals.css` until task 11.1.

| Class | Legacy utility | Semantic_Token | Light value (8-bit sRGB; source palette value) | Dark value (hex, proposed) |
| :--- | :--- | :--- | :--- | :--- |
| border-color compat rule | `var(--color-gray-200, currentcolor)` | `border-default` | 229, 231, 235; `oklch(92.8% 0.006 264.531)` | `#2b3263` |
| `nav-link` | `text-black` | `page-fg` | 0, 0, 0; `#000` | `#f2f3fa` |
| `nav-link` | `hover:bg-gray-50` | `surface-hover` | 249, 250, 251; `oklch(98.5% 0.002 247.839)` | `#1e2450` |
| `mobile-nav-link` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef` |
| `mobile-nav-link` | `hover:bg-gray-50` | `surface-hover` | 249, 250, 251; `oklch(98.5% 0.002 247.839)` | `#1e2450` |
| `menu-item` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef` |
| `menu-item` | `hover:bg-gray-50` | `surface-hover` | 249, 250, 251; `oklch(98.5% 0.002 247.839)` | `#1e2450` |
| `card` | `bg-white` | `surface` | 255, 255, 255; `#fff` | `#13173a` |
| `card` | `border-gray-100` | `border-subtle` | 243, 244, 246; `oklch(96.7% 0.003 264.542)` | `#1f2654` |
| `form-input` | `border-gray-300` | `input-border` | 209, 213, 220; `oklch(87.2% 0.01 258.338)` | `#6b74a8` |
| `form-input` | `focus:ring-blue-100` | `input-focus-ring` | 219, 234, 254; `oklch(93.2% 0.032 255.585)` | `#7f8ce0` |
| `form-input` | `focus:border-blue-300` | `input-border-focus` | 142, 197, 255; `oklch(80.9% 0.105 251.813)` | `#9aa8f2` |
| `form-label` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef` |
| `btn-primary` | `text-white` | `on-brand` | 255, 255, 255; `#fff` | `#0b0e24` |
| `btn-secondary` | `bg-gray-100` | `surface-control` | 243, 244, 246; `oklch(96.7% 0.003 264.542)` | `#1f2654` |
| `btn-secondary` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef` |
| `btn-secondary` | `hover:bg-gray-200` | `surface-control-hover` | 229, 231, 235; `oklch(92.8% 0.006 264.531)` | `#242b5b` |
| `heading-1` | `text-gray-900` | `text-heading` | 16, 24, 40; `oklch(21% 0.034 264.665)` | `#f2f3fa` |
| `heading-2` | `text-gray-900` | `text-heading` | 16, 24, 40; `oklch(21% 0.034 264.665)` | `#f2f3fa` |
| `body-text` | `text-gray-600` | `text-body` | 74, 85, 101; `oklch(44.6% 0.03 256.802)` | `#c5cae6` |
| `status-badge-success` | `bg-green-100` | `success-subtle` | 220, 252, 231; `oklch(96.2% 0.044 156.743)` | `#0d2a2c` |
| `status-badge-success` | `text-green-800` | `success-text` | 1, 102, 48; `oklch(44.8% 0.119 151.328)` | `#6ee7b7` |
| `status-badge-warning` | `bg-yellow-100` | `warning-subtle` | 254, 249, 194; `oklch(97.3% 0.071 103.193)` | `#2e2612` |
| `status-badge-warning` | `text-yellow-800` | `warning-text` | 137, 75, 0; `oklch(47.6% 0.114 61.907)` | `#fcd34d` |
| `status-badge-error` | `bg-red-100` | `danger-subtle` | 255, 226, 226; `oklch(93.6% 0.032 17.717)` | `#3a1620` |
| `status-badge-error` | `text-red-800` | `danger-text` | 159, 7, 18; `oklch(44.4% 0.177 26.899)` | `#fca5a5` |

Not palette utilities, listed for completeness: `form-input` also gains `bg-input-bg` (light `#ffffff`, the forms plugin value) and `placeholder:text-input-placeholder` (light 106, 114, 130; `oklch(55.1% 0.027 264.364)`, gray-500). Hex arbitrary values replaced under Requirement 10.6: `nav-link` `hover:text-[#252A61]` → `hover:text-brand`; `btn-primary` `bg-[#252A61]` → `bg-brand` and `hover:bg-[#3b3b98]` → `hover:bg-brand-hover`.

### Light legacy contrast failures (Requirement 12.3)

WCAG 2.x relative luminance and contrast ratio, computed from the light values in `src/app/globals.css` `:root` (hex exact; OKLCH primitives converted as above, unrounded). Pass or fail is decided on the unrounded ratio. Both values in every row are copied from the Legacy_App, so both stay unchanged (Requirement 2) and are listed here and in DESIGN.md section 11. All other light pairs in the design.md contrast table pass, and my computed values match that table to two decimals.

| Token (foreground) | Value | Token (background) | Value | Contrast_Ratio | Required minimum |
| :--- | :--- | :--- | :--- | ---: | ---: |
| `text-muted` | `#64748b` | `surface-muted` | `#f1f5f9` | 4.34 | 4.5 |
| `secondary` | `#b8c5fd` | `surface` | `#ffffff` | 1.69 | 3 |
| `accent` | `#e8c3d5` | `surface` | `#ffffff` | 1.59 | 3 |
| `success` (indicator) | `#10b981` | `surface` | `#ffffff` | 2.54 | 3 |
| `warning` (indicator) | `#f59e0b` | `surface` | `#ffffff` | 2.15 | 3 |
| `info` (indicator) | `#0ea5e9` | `surface` | `#ffffff` | 2.77 | 3 |
| `input-border` | `oklch(87.2% 0.01 258.338)` (≈ 209, 213, 220) | `input-bg` | `#ffffff` | 1.47 | 3 |
| `input-border-focus` | `oklch(80.9% 0.105 251.813)` (≈ 142, 197, 255) | `input-bg` | `#ffffff` | 1.81 | 3 |
| `input-focus-ring` | `oklch(93.2% 0.032 255.585)` (≈ 219, 234, 254) | `input-bg` | `#ffffff` | 1.22 | 3 |
| `chart-3` | `#10b981` | `surface` | `#ffffff` | 2.54 | 3 |
| `chart-4` | `#0ea5e9` | `surface` | `#ffffff` | 2.77 | 3 |
| `chart-5` | `#f59e0b` | `surface` | `#ffffff` | 2.15 | 3 |
| `chart-6` | `#f97316` | `surface` | `#ffffff` | 2.80 | 3 |
| `gradient-text-start` | `#667eea` | `surface` | `#ffffff` | 3.66 | 4.5 (3 if `.gradient-text` is only used for large text) |

Files where these values are defined in the Target_App: `src/app/globals.css` (`--prim-*` at lines 11–64, `--sem-*` in the second `:root` block). Legacy sources: inventory hex in the task 3.1 table; the three input tokens come from `@utility form-input` (`frontend-react/src/index.css`) and the `@tailwindcss/forms` `#fff` background. The chart assignments are proposals (D9), but the values are legacy hex on the legacy white surface, so the exemption applies. Closest passing light pairs, for reference: `chart-2` / `surface` 4.23 (min 3), `danger` / `surface` 3.76 (min 3), `danger-fg` / `danger` 4.74 (min 4.5).

### Build-output check observation: `@tailwindcss/forms` `.form-input` rules

`build-output.check.mjs` (`src/app/design-check/_checks/build-output.check.mjs:297–340`) skips the 18 rules that `@tailwindcss/forms` itself emits for `.form-input`, because they are not part of the `@utility form-input` body. A run against the current build prints: `form-input: plugin color values the @utility does not override: .form-input:focus { --tw-ring-offset-color: #fff }; .form-input:focus { outline: 2px solid #0000 }`. Other plugin literals (`background-color: #fff`, `border-color: #6a7282`/`lab(…)`, `--tw-ring-color: #155dfc`, placeholder `#6a7282`) are overridden by the `@utility` rules that follow (`bg-input-bg`, `border-input-border`, `focus:ring-input-focus-ring`, `placeholder:text-input-placeholder`).

For the owner: in dark mode, `--tw-ring-offset-color: #fff` has no visible effect while the ring offset width stays at the plugin's `0px`. `outline: 2px solid #0000` is transparent, so it shows nothing in either theme. If a later change adds `ring-offset-*` to inputs, the offset would show as white in dark mode. Possible fix, not applied: add `focus:ring-offset-page` (or another surface token) to `@utility form-input`. The legacy app has the same plugin rules, so this matches the legacy light behavior.

## Stage 1 Review_Stop report (task 9)

Branch: `migration/frontend-nextjs` (re-checked). No commit created and nothing staged (D1 deferred). No stage 2 work started. No fix was needed, so no file was changed by this task other than this report.

### Commands (run in `frontend/`, in this order)

| Command | Exit code | Errors | Warnings | Baseline (task 1.2) |
| :--- | :--- | :--- | :--- | :--- |
| `npm run lint` | 0 | 0 | 0 | 0 / 0 / 0, same |
| `npx tsc --noEmit` | 0 | 0 | 0 | 0 / 0 / 0, same |
| `npm run build` | 0 | 0 | 1 | 0 / 0 / 1, same. The one warning is the known workspace-root lockfile warning, verbatim as in the baseline. |
| `node src/app/design-check/_checks/run-all.mjs --stage=1` | 0 | 0 | — | new in stage 1 |

Build route table changed from the baseline as expected: `/`, `/_not-found`, plus the new `/apple-icon` and `/icon.svg` (all `○ Static`). Static pages: 6 (baseline 4).

### Check results (`run-all.mjs --stage=1`: 5 passed, 0 failed)

| Script | Result | Detail |
| :--- | :--- | :--- |
| `build-output.check.mjs` | PASS (4 of 4) | `/` HTML has favicon, `icon.svg` and `apple-touch-icon` links (7.7); the 4 semantic utilities used in `src` (`bg-brand`, `text-on-brand`, `hover:bg-brand-hover`, `dark:hover:bg-surface-hover`) compile to `var(--sem-*)`; 23 of 23 `@utility` classes use `var(--sem-*)` (with the forms-plugin note below); no Google Fonts or Fontshare URL in compiled CSS (5.3) |
| `p04-token-parity.check.mjs` | PASS | 70 `:root` Semantic_Tokens each map to a declared primitive and to `@theme inline --color-<role>` |
| `p05-raw-hex.check.mjs` | PASS | 0 raw hex in 11 files under `src` (excluding `globals.css`); all 29 hex literals in `globals.css` are `--prim-*` declarations |
| `p06-light-values.check.mjs` | PASS | 70 of 70 light tokens match their legacy source; 9 checked against design.md proposals (`info-subtle`, `emergency-subtle`, `focus-ring`, `chart-1`…`chart-6`); none skipped |
| `repo.check.mjs` | PASS (5 of 5) | logo copies and `icon.svg` match source sha256; `favicon.ico` unchanged; no Geist/Inter/Satoshi/Fontshare or disabled font defaults; no remote font import; `next.config.ts` unchanged |

Not written yet (optional tasks 7.5–7.7): `p07-primitive-unique`, `p17-legacy-ported`, `p19-no-palette-utility`.

### Integrity re-checks

- sha256 of `next.config.ts`, `eslint.config.mjs`, `tsconfig.json` and `src/app/favicon.ico` equal the task 1.2 baseline. Root `DESIGN.md` sha256 unchanged (`5b13f917…cb47`); `frontend/DESIGN.md` does not exist yet (task 17).
- `git status --porcelain -- frontend-react DESIGN.md` (repository root) is identical to the task 1.2 snapshot (owner changes only).
- `grep -rnE 'eslint-disable|@ts-ignore|@ts-expect-error|@ts-nocheck' src`: no match (15.7).
- `package.json`: the 12 pre-existing entries are unchanged; the only additions are `@tailwindcss/forms ^0.5.10`, `@tailwindcss/typography ^0.5.16`, `@tailwindcss/aspect-ratio ^0.4.2` (devDependencies).

### Files changed

`git status --porcelain -- frontend` (run from `/Users/karangupta/Project/Medicare`) prints only `?? frontend/`: the whole Target_App is untracked (0 tracked files under `frontend/`), so git cannot show per-file changes. Files created or modified by stage 1 tasks:

| File (relative to `frontend/`) | Change | Task |
| :--- | :--- | :--- |
| `package.json`, `package-lock.json` | modified (3 plugins added) | 2.1 |
| `src/app/globals.css` | rewritten (light primitives, semantic tokens, theme mappings, base/utilities layers, 23 `@utility`, plain classes, keyframes, reduced motion) | 4.1–4.7 |
| `src/app/layout.tsx` | modified (Montserrat Alternates, Geist removed, `metadata.title`) | 5.1 |
| `src/app/page.tsx` | modified (4 classes tokenized, owner decision D2, 1.7) | 5.2 |
| `src/assets/logo/medicare-logo-{full,icon}-on-{light,dark}.svg` | created (4 byte copies) | 6.1 |
| `src/app/icon.svg` | created (byte copy) | 6.2 |
| `src/app/apple-icon.tsx` | created | 6.3 |
| `src/app/design-check/_checks/legacy-inventory.report.mjs` | created | 3.1 |
| `src/app/design-check/_checks/lib/css.mjs`, `run-all.mjs` | created | 7.1 |
| `src/app/design-check/_checks/p05-raw-hex.check.mjs` | created | 7.2 |
| `src/app/design-check/_checks/p04-token-parity.check.mjs` | created | 7.3 |
| `src/app/design-check/_checks/p06-light-values.check.mjs` | created | 7.4 |
| `src/app/design-check/_checks/repo.check.mjs` | created | 7.8 |
| `src/app/design-check/_checks/build-output.check.mjs` | created | 7.9 |

Outside `frontend/`: `.kiro/specs/design-system-dark-mode/final-report-draft.md` (this file). Build output in `frontend/.next/` is regenerated and not listed.

### Open report items and owner decisions so far

1. **Montserrat Alternates license (6.1, 6.2):** "TODO: confirm". Google Fonts pages were not readable by fetch; the metadata endpoint says `ofl` (SIL Open Font License). Owner to copy the name and URL from the specimen page's License tab.
2. **`#1a1f4a` vs `#1a1f4d` (4.5 vs 4.6 conflict):** `hero-gradient-deep` points to `#1a1f4a` (single-file value, so 4.5 says no token; 4.6 says use the higher count). Confirm, or drop `hero-gradient-deep`.
3. **Near-duplicate merge decisions (4.6, 17.3 d):** same-role pairs `#f8fafc`/`#fafbfc` and `#0f172a`/`#111827` kept as separate primitives; 16 further pairs listed in "Ambiguous items", including 5 the design.md list did not name (`#334155`/`#374151`, `#a1b5fa`/`#a5b4fc`, `#ebf5ff`, `#f0f7ff`, `#f5f3ff`). Merge or keep.
4. **`#ffffff` multi-role mapping (D7)** and **`#4318ff` correction**: 6 of 66 uses are brand gradients in `PricingPage.jsx`/`Navbar.jsx`, not auth screens; mapping to `auth-primary` still holds (91%). Confirm.
5. **Chart token assignments (D9):** `chart-1`…`chart-6` are proposals.
6. **D12 plugin specifiers:** legacy-matching `^0.5.10` / `^0.5.16` used; switch to `^0.5.11` / `^0.5.20` if "latest" is preferred.
7. **`npm audit`:** 9 moderate, dev-only. 2 from `postcss-selector-parser` via `@tailwindcss/typography` (GHSA-rj75-hqrm-r3gf; only fix is a breaking `--force` downgrade, not applied); 7 pre-existing from `minimatch` via `eslint-config-next` (GHSA-g3hv-75wg-m249).
8. **Forms plugin `.form-input` observation:** plugin keeps `--tw-ring-offset-color: #fff` and a transparent `outline` on `.form-input:focus`. No visible effect now; would show white in dark mode if `ring-offset-*` is added later. Possible fix (not applied): `focus:ring-offset-page` in `@utility form-input`.
9. **Pending owner decision files (7.5, D3):** 7 files (`favicon1.ico`, `favicon2.ico`, two text-only SVGs, two leading-space `transparent/` files, one `copy.png`). Keep, delete or rename each.
10. **Light legacy contrast failures (12.3):** 14 pairs kept unchanged as legacy values (table above), for DESIGN.md section 11.
11. **Workspace-root lockfile build warning:** pre-existing; fixing it needs `next.config.ts` (frozen, 1.9) or removing the repository-root lockfile (out of scope). Left unchanged.
12. **`-webkit-backdrop-filter` minification observation:** production CSS keeps only the prefixed property for literal values, same as the legacy build. Confirm in Manual_Browser_Checks.
13. **`reactCompiler` enabled in `next.config.ts`:** review when feature porting starts.
14. **Commits deferred (D1):** no commits for C1; the Final_Report will say "commits deferred by owner".

Waiting for the owner to reply "continue" before stage 2.

## Task 10.1: next-themes

### Install (Requirements 8.4, 8.6)
Command, run in `frontend/` without `--force` or `--legacy-peer-deps`:
`npm install next-themes@^0.4.6`
Exit code 0. Output: `added 1 package, and audited 368 packages`. npm reported no peer-dependency error or warning, so there is no Requirement 8.4 entry for this install. The `next-themes` 0.4.6 lockfile entry declares peers `react` and `react-dom` `^16.8 || ^17 || ^18 || ^19 || ^19.0.0-rc`, which 19.3.0 satisfies. npm saved the specifier as `^0.4.6`, so no `npm pkg set` correction was needed.

### Added package (Requirements 8.1, 8.5, 8.7, 21.1)
| Package | `package.json` section | Specifier | Resolved in `package-lock.json` |
| :--- | :--- | :--- | :--- |
| `next-themes` | dependencies | `^0.4.6` | 0.4.6 (`https://registry.npmjs.org/next-themes/-/next-themes-0.4.6.tgz`, license MIT) |

The root entry in `package-lock.json` lists `"next-themes": "^0.4.6"` under `dependencies`. Requirement 21.1 also asks for this version in Design_Doc section 2; that belongs to the Design_Doc task, not this one.

### Pre-existing entries (Requirement 8.2)
I compared `package.json` after the install with the copy read just before it. The only change is the new `"next-themes": "^0.4.6"` line in `dependencies`. All 15 earlier entries (12 pre-existing plus the three task 2.1 plugins) keep the same name, section and specifier, and no other field changed. Sections now hold 4 `dependencies` and 12 `devDependencies`. `next` 16.4.6, `react` 19.3.0 and `react-dom` 19.3.0 are unchanged. `npm audit` still reports the same 9 moderate vulnerabilities as after task 2.1; `next-themes` adds none.

Requirement 21.2 to 21.5 (console warnings) are checked later, in the Manual_Browser_Check.

## Task 15.10: Route removability

Requirement 14.1. Result: deleting `frontend/src/app/design-check/` removes the `/design-check` route, and lint, type check and build all pass without it.

### Method
- Temporary directory: `/tmp/dc-removal.rvLUK8` (from `mktemp -d`), outside the repository.
- Copied `frontend/` with `rsync -a`, excluding `node_modules`, `.next` and `tsconfig.tsbuildinfo`. The tsbuildinfo file was excluded so stale design-check paths could not affect the type check.
- `npm ci`: exit 0, 367 packages added. Same 9 moderate `npm audit` vulnerabilities as before.
- Deleted `src/app/design-check/` in the copy. A `grep -rn "design-check"` over `src`, `next.config.ts`, `tsconfig.json` and `eslint.config.mjs` returned no matches, so no remaining file references the route.
- No file in `frontend/` itself was modified. The temporary directory was deleted after the run, and its absence was confirmed.

### Results (copy without the route)
| Command | Exit code | Errors | Warnings |
|---|---|---|---|
| `npm run lint` | 0 | 0 | 0 |
| `npx tsc --noEmit` (first run, before any build) | 2 | 1 | 0 |
| `npm run build` | 0 | 0 | 0 |
| `npx tsc --noEmit` (re-run after build) | 0 | 0 | 0 |

- First `tsc` error: `src/app/layout.tsx:18:50 - error TS2304: Cannot find name 'LayoutProps'.` `LayoutProps` is a global type that Next.js generates into `.next/types/` during `next build` (or `next typegen`). `tsconfig.json` includes `.next/types/**/*.ts`. The copy started without `.next`, so the type did not exist yet. Removing the route did not cause this error: once the build had generated `.next/types/`, `tsc --noEmit` exited 0, and none of the generated type files mention `design-check`. Any fresh clone has the same ordering dependency: run `npm run build` (or `npx next typegen`) before running `tsc --noEmit` on its own.
- Build route list without the route: `/`, `/_not-found`, `/apple-icon`, `/icon.svg` (all static). `/design-check` is absent.
- Build warnings: none. The build printed `Environments: .env.local` as information. The workspace-root lockfile warning seen inside the repository does not appear outside it, as expected.

## Stage 2 report items (task 15.11)

Requirements 19.2, 19.5, 20.4, 21.1, 21.3, 21.5. Dark values below are read from `frontend/src/app/globals.css` (dark `--prim-*` at lines 68–116, `.dark` Semantic_Tokens at lines 222–323), resolved `.dark --sem-*` → `--prim-*` → hex with `resolvePrimitive(sheet, name, "dark")` from `src/app/design-check/_checks/lib/css.mjs`. No file under `frontend/src` was changed for this task.

### Requirement 20.4 table: dark column

Every dark value in `globals.css` equals the design.md proposal in the stage 1 table above, so the "Dark value (hex, proposed)" column is now confirmed. Light columns are unchanged from "Requirement 20.4 table (light values)".

| Class | Legacy utility | Semantic_Token | Light value (8-bit sRGB; source palette value) | Dark value (hex; `--prim-*`) |
| :--- | :--- | :--- | :--- | :--- |
| border-color compat rule | `var(--color-gray-200, currentcolor)` | `border-default` | 229, 231, 235; `oklch(92.8% 0.006 264.531)` | `#2b3263`; `--prim-navy-d-600` |
| `nav-link` | `text-black` | `page-fg` | 0, 0, 0; `#000` | `#f2f3fa`; `--prim-mist-d-50` |
| `nav-link` | `hover:bg-gray-50` | `surface-hover` | 249, 250, 251; `oklch(98.5% 0.002 247.839)` | `#1e2450`; `--prim-navy-d-750` |
| `mobile-nav-link` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef`; `--prim-mist-d-200` |
| `mobile-nav-link` | `hover:bg-gray-50` | `surface-hover` | 249, 250, 251; `oklch(98.5% 0.002 247.839)` | `#1e2450`; `--prim-navy-d-750` |
| `menu-item` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef`; `--prim-mist-d-200` |
| `menu-item` | `hover:bg-gray-50` | `surface-hover` | 249, 250, 251; `oklch(98.5% 0.002 247.839)` | `#1e2450`; `--prim-navy-d-750` |
| `card` | `bg-white` | `surface` | 255, 255, 255; `#fff` | `#13173a`; `--prim-navy-d-850` |
| `card` | `border-gray-100` | `border-subtle` | 243, 244, 246; `oklch(96.7% 0.003 264.542)` | `#1f2654`; `--prim-navy-d-700` |
| `form-input` | `border-gray-300` | `input-border` | 209, 213, 220; `oklch(87.2% 0.01 258.338)` | `#6b74a8`; `--prim-indigo-d-400` |
| `form-input` | `focus:ring-blue-100` | `input-focus-ring` | 219, 234, 254; `oklch(93.2% 0.032 255.585)` | `#7f8ce0`; `--prim-indigo-d-300` |
| `form-input` | `focus:border-blue-300` | `input-border-focus` | 142, 197, 255; `oklch(80.9% 0.105 251.813)` | `#9aa8f2`; `--prim-indigo-d-250` |
| `form-label` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef`; `--prim-mist-d-200` |
| `btn-primary` | `text-white` | `on-brand` | 255, 255, 255; `#fff` | `#0b0e24`; `--prim-navy-d-950` |
| `btn-secondary` | `bg-gray-100` | `surface-control` | 243, 244, 246; `oklch(96.7% 0.003 264.542)` | `#1f2654`; `--prim-navy-d-700` |
| `btn-secondary` | `text-gray-700` | `text-label` | 54, 65, 83; `oklch(37.3% 0.034 259.733)` | `#d4d8ef`; `--prim-mist-d-200` |
| `btn-secondary` | `hover:bg-gray-200` | `surface-control-hover` | 229, 231, 235; `oklch(92.8% 0.006 264.531)` | `#242b5b`; `--prim-navy-d-650` |
| `heading-1` | `text-gray-900` | `text-heading` | 16, 24, 40; `oklch(21% 0.034 264.665)` | `#f2f3fa`; `--prim-mist-d-50` |
| `heading-2` | `text-gray-900` | `text-heading` | 16, 24, 40; `oklch(21% 0.034 264.665)` | `#f2f3fa`; `--prim-mist-d-50` |
| `body-text` | `text-gray-600` | `text-body` | 74, 85, 101; `oklch(44.6% 0.03 256.802)` | `#c5cae6`; `--prim-mist-d-300` |
| `status-badge-success` | `bg-green-100` | `success-subtle` | 220, 252, 231; `oklch(96.2% 0.044 156.743)` | `#0d2a2c`; `--prim-emerald-d-subtle` |
| `status-badge-success` | `text-green-800` | `success-text` | 1, 102, 48; `oklch(44.8% 0.119 151.328)` | `#6ee7b7`; `--prim-emerald-d-text` |
| `status-badge-warning` | `bg-yellow-100` | `warning-subtle` | 254, 249, 194; `oklch(97.3% 0.071 103.193)` | `#2e2612`; `--prim-amber-d-subtle` |
| `status-badge-warning` | `text-yellow-800` | `warning-text` | 137, 75, 0; `oklch(47.6% 0.114 61.907)` | `#fcd34d`; `--prim-amber-d-text` |
| `status-badge-error` | `bg-red-100` | `danger-subtle` | 255, 226, 226; `oklch(93.6% 0.032 17.717)` | `#3a1620`; `--prim-red-d-subtle` |
| `status-badge-error` | `text-red-800` | `danger-text` | 159, 7, 18; `oklch(44.4% 0.177 26.899)` | `#fca5a5`; `--prim-red-d-text` |

Not palette utilities, for completeness (dark): `form-input` `bg-input-bg` → `#0f1330` (`--prim-navy-d-900`), `placeholder:text-input-placeholder` → `#959cc4` (`--prim-mist-d-600`); `nav-link` `hover:text-brand` and `btn-primary` `bg-brand` → `#9ba3d4` (`--prim-brand-d`); `btn-primary` `hover:bg-brand-hover` → `#b3b9e0` (`--prim-brand-d-hover`).

### `next-themes` version (Requirement 21.1)

| Package | `frontend/package.json` (dependencies) | Resolved in `frontend/package-lock.json` |
| :--- | :--- | :--- |
| `next-themes` | `^0.4.6` | `0.4.6` (`https://registry.npmjs.org/next-themes/-/next-themes-0.4.6.tgz`, MIT, integrity `sha512-pZvgD5L0…NF6XNA==`) |

`node_modules/next-themes/package.json` also reports `0.4.6`. The Design_Doc section 2 entry is task 17's job.

### D10: React script warning (Requirements 21.3–21.5, 9.7)

Implemented, in `frontend/src/components/theme/theme-provider.tsx`:

- Line 10: `const SCRIPT_TYPE = typeof window === "undefined" ? "text/javascript" : "text/plain";`, and line 21 passes `scriptProps={{ type: SCRIPT_TYPE }}` to `NextThemesProvider`. The server HTML carries an executable script (runs before paint, Requirement 9.6). The client render gives React a `text/plain` script, which is the pattern from the bundled Next guide `preventing-flash-before-hydration.md` for avoiding React 19's "script tag inside a React component" dev warning ([next-themes issue #385](https://github.com/pacocoursey/next-themes/issues/385)).
- I confirmed in `node_modules/next-themes/dist/index.mjs` (0.4.6) that the script element is rendered as `"script",{...scriptProps,suppressHydrationWarning:!0,…}`, so the `type` mismatch between server and client is covered by next-themes' own attribute. No `suppressHydrationWarning` was added except on `<html>` in `src/app/layout.tsx:20` (21.4). No `console` patch, no change to next-themes source, no Next.js or React config change.

Remains a Manual_Browser_Check (19.10 b): whether React 19.3.0 / Next.js 16.4.6 still prints a warning about the script in `npm run dev`. The Implementer cannot run the dev server (15.4), so this is not verified. Result so far: **not observed; Requirement 9.7 is unverified, not passed.**

Decision D10 for the owner (Decisions needed): if check (b) shows no warning, keep the `scriptProps` switch. If a warning appears, record its exact text, the `next-themes` version (0.4.6) and the conditions (which saved Theme_Mode, first load or navigation), and note whether the no-flash check (a) still passes. Options then: (1) keep the switch and accept the warning; (2) remove the switch and accept the upstream warning; (3) another documented option, such as waiting for a next-themes release that fixes issue #385. Requirement 9.7 stays failed for that warning until the owner decides (21.5).

### Strict Mode dev remount (design.md "Hydration and console warnings")

`frontend/next.config.ts` does not set `reactStrictMode` (file unchanged, 1.9), so the App Router default applies and Strict Mode is on in development. In dev, React remounts components once and the bundled guide warns this can reset `<html>` attributes; next-themes 0.4.6 re-runs its apply effect on the remount, so the `light`/`dark` class and `color-scheme` style come back. Nothing extra was implemented for this. Manual check (a) uses `npm run build` + `npm run start`, where Strict Mode does not double-mount. If the owner sees a brief theme flip only under `npm run dev`, that is this dev-only behavior, not a Requirement 9.6 failure.

### D11: invalid stored Theme_Mode with OS dark (Requirements 9.3, 9.6)

Implemented: `ThemeModeGuard` in `theme-provider.tsx` (layout effect at line 32) calls `setTheme("system")` when the stored `theme` is not `light`, `dark` or `system`; the rule is `isThemeMode`/`toThemeMode` in `src/components/theme/theme-mode.ts`. Residual behavior: next-themes' inline script applies an invalid value such as `"foo"` as the class, so with the OS in dark mode the page paints light until hydration, then the guard switches to `system` (dark). This case is outside the Requirement 9.6 matrix (valid modes and no saved mode). Not verified in a browser. Decision D11: accept, or add an owner-approved inline guard script.

### Dark contrast results (Requirements 11, 12, 20.3; for 19.5)

**Result: all 68 dark intended pairs pass. No dark pair fails.** No dark pair is marked `legacyExempt` (0 of 68), as required.

Method: every `theme: "dark"` entry of `INTENDED_PAIRS` in `frontend/src/app/design-check/_lib/tokens.ts`, colors resolved from `globals.css` as above, ratio from `contrastRatio` and pass/fail from `meetsMinimum` in `frontend/src/app/design-check/_lib/contrast.ts` (WCAG 2.x, unrounded decision). All dark values are opaque hex, so no compositing was needed. Run from a throwaway script `/tmp/dark-contrast-15-11.mjs` with Node 24.20.0 type stripping. Every ratio matches the design.md Contrast table "Dark" column to two decimals. The design.md range "12.50–13.33" for `text` on `*-subtle` is confirmed (12.50 to 13.33).

| Token | Value | Pair | Value | Usage | Ratio | Min | Result |
| :--- | :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `page-fg` | `#f2f3fa` | `page` | `#0b0e24` | text | 17.21 | 4.5 | Pass |
| `page-fg` | `#f2f3fa` | `surface-hover` | `#1e2450` | text (nav-link) | 13.33 | 4.5 | Pass |
| `text` | `#e8eaf6` | `surface` | `#13173a` | text | 14.47 | 4.5 | Pass |
| `text` | `#e8eaf6` | `surface-muted` | `#1b2047` | text | 13.04 | 4.5 | Pass |
| `text` | `#e8eaf6` | `page` | `#0b0e24` | text | 15.90 | 4.5 | Pass |
| `text-heading` | `#f2f3fa` | `surface` | `#13173a` | large bold text | 15.67 | 3 | Pass |
| `text-body` | `#c5cae6` | `surface` | `#13173a` | text | 10.70 | 4.5 | Pass |
| `text-label` | `#d4d8ef` | `surface` | `#13173a` | text | 12.27 | 4.5 | Pass |
| `text-label` | `#d4d8ef` | `surface-hover` | `#1e2450` | text | 10.45 | 4.5 | Pass |
| `text-label` | `#d4d8ef` | `surface-control` | `#1f2654` | text | 10.16 | 4.5 | Pass |
| `text-label` | `#d4d8ef` | `surface-control-hover` | `#242b5b` | text | 9.46 | 4.5 | Pass |
| `text-label` | `#d4d8ef` | `surface-muted` | `#1b2047` | text | 11.06 | 4.5 | Pass |
| `text-label` | `#d4d8ef` | `input-bg` | `#0f1330` | text | 12.86 | 4.5 | Pass |
| `text-muted` | `#a6acd0` | `surface` | `#13173a` | text | 7.79 | 4.5 | Pass |
| `text-muted` | `#a6acd0` | `surface-muted` | `#1b2047` | text | 7.02 | 4.5 | Pass |
| `text-subtle` | `#b8bddd` | `surface` | `#13173a` | text | 9.38 | 4.5 | Pass |
| `input-placeholder` | `#959cc4` | `input-bg` | `#0f1330` | placeholder text | 6.77 | 4.5 | Pass |
| `brand` | `#9ba3d4` | `surface-hover` | `#1e2450` | text (nav-link:hover) | 6.03 | 4.5 | Pass |
| `brand` | `#9ba3d4` | `surface` | `#13173a` | control background | 7.09 | 3 | Pass |
| `brand` | `#9ba3d4` | `surface-muted` | `#1b2047` | control background | 6.39 | 3 | Pass |
| `brand-hover` | `#b3b9e0` | `surface` | `#13173a` | control background | 9.03 | 3 | Pass |
| `on-brand` | `#0b0e24` | `brand` | `#9ba3d4` | text | 7.79 | 4.5 | Pass |
| `on-brand` | `#0b0e24` | `brand-hover` | `#b3b9e0` | text | 9.92 | 4.5 | Pass |
| `primary` | `#9ba3d4` | `surface` | `#13173a` | text | 7.09 | 4.5 | Pass |
| `secondary` | `#cfd6f4` | `surface` | `#13173a` | UI component (text in dark) | 12.03 | 4.5 | Pass |
| `accent` | `#f0dce6` | `surface` | `#13173a` | UI component (text in dark) | 13.28 | 4.5 | Pass |
| `auth-primary` | `#a091f0` | `surface` | `#13173a` | control background | 6.44 | 3 | Pass |
| `auth-primary-hover` | `#b6abf3` | `surface` | `#13173a` | control background | 8.34 | 3 | Pass |
| `on-auth-primary` | `#0b0e24` | `auth-primary` | `#a091f0` | text | 7.08 | 4.5 | Pass |
| `on-auth-primary` | `#0b0e24` | `auth-primary-hover` | `#b6abf3` | text | 9.17 | 4.5 | Pass |
| `success-fg` | `#0b0e24` | `success` | `#34d399` | text | 9.91 | 4.5 | Pass |
| `success` | `#34d399` | `surface` | `#13173a` | status indicator | 9.02 | 3 | Pass |
| `success` | `#34d399` | `success-subtle` | `#0d2a2c` | text | 7.89 | 4.5 | Pass |
| `success-text` | `#6ee7b7` | `success-subtle` | `#0d2a2c` | text | 9.95 | 4.5 | Pass |
| `warning-fg` | `#0b0e24` | `warning` | `#fbbf24` | text | 11.41 | 4.5 | Pass |
| `warning` | `#fbbf24` | `surface` | `#13173a` | status indicator | 10.38 | 3 | Pass |
| `warning` | `#fbbf24` | `warning-subtle` | `#2e2612` | text | 8.97 | 4.5 | Pass |
| `warning-text` | `#fcd34d` | `warning-subtle` | `#2e2612` | text | 10.39 | 4.5 | Pass |
| `danger-fg` | `#0b0e24` | `danger` | `#f87171` | text | 6.89 | 4.5 | Pass |
| `danger` | `#f87171` | `surface` | `#13173a` | status indicator, input error border | 6.27 | 3 | Pass |
| `danger` | `#f87171` | `input-bg` | `#0f1330` | status indicator, input error border | 6.57 | 3 | Pass |
| `danger` | `#f87171` | `danger-subtle` | `#3a1620` | text | 5.77 | 4.5 | Pass |
| `danger-text` | `#fca5a5` | `danger-subtle` | `#3a1620` | text | 8.41 | 4.5 | Pass |
| `info-fg` | `#0b0e24` | `info` | `#38bdf8` | text | 8.89 | 4.5 | Pass |
| `info` | `#38bdf8` | `surface` | `#13173a` | status indicator | 8.09 | 3 | Pass |
| `info` | `#38bdf8` | `info-subtle` | `#0c2540` | text | 7.24 | 4.5 | Pass |
| `emergency-fg` | `#0b0e24` | `emergency` | `#ff5c5c` | text | 6.29 | 4.5 | Pass |
| `emergency` | `#ff5c5c` | `surface` | `#13173a` | status indicator | 5.73 | 3 | Pass |
| `emergency` | `#ff5c5c` | `emergency-subtle` | `#46111c` | text | 5.11 | 4.5 | Pass |
| `text` | `#e8eaf6` | `success-subtle` | `#0d2a2c` | alert body text | 12.66 | 4.5 | Pass |
| `text` | `#e8eaf6` | `warning-subtle` | `#2e2612` | alert body text | 12.50 | 4.5 | Pass |
| `text` | `#e8eaf6` | `danger-subtle` | `#3a1620` | alert body text | 13.33 | 4.5 | Pass |
| `text` | `#e8eaf6` | `info-subtle` | `#0c2540` | alert body text | 12.94 | 4.5 | Pass |
| `text` | `#e8eaf6` | `emergency-subtle` | `#46111c` | alert body text | 12.92 | 4.5 | Pass |
| `input-border` | `#6b74a8` | `input-bg` | `#0f1330` | input border | 4.06 | 3 | Pass |
| `input-border-focus` | `#9aa8f2` | `input-bg` | `#0f1330` | input border (focus) | 8.01 | 3 | Pass |
| `input-focus-ring` | `#7f8ce0` | `input-bg` | `#0f1330` | input focus ring | 5.82 | 3 | Pass |
| `focus-ring` | `#a9b3f5` | `surface` | `#13173a` | focus ring | 8.63 | 3 | Pass |
| `focus-ring` | `#a9b3f5` | `page` | `#0b0e24` | focus ring | 9.48 | 3 | Pass |
| `focus-ring` | `#a9b3f5` | `surface-muted` | `#1b2047` | focus ring | 7.78 | 3 | Pass |
| `chart-1` | `#a5b4fc` | `surface` | `#13173a` | chart series | 8.70 | 3 | Pass |
| `chart-2` | `#c4b5fd` | `surface` | `#13173a` | chart series | 9.39 | 3 | Pass |
| `chart-3` | `#34d399` | `surface` | `#13173a` | chart series | 9.02 | 3 | Pass |
| `chart-4` | `#38bdf8` | `surface` | `#13173a` | chart series | 8.09 | 3 | Pass |
| `chart-5` | `#fbbf24` | `surface` | `#13173a` | chart series | 10.38 | 3 | Pass |
| `chart-6` | `#fb923c` | `surface` | `#13173a` | chart series | 7.66 | 3 | Pass |
| `gradient-text-start` | `#9aa8f2` | `surface` | `#13173a` | gradient text | 7.64 | 4.5 | Pass |
| `gradient-text-end` | `#b996e0` | `surface` | `#13173a` | gradient text | 7.02 | 4.5 | Pass |

Closest dark margins, for reference: `input-border` / `input-bg` 4.06 (min 3), `emergency` / `emergency-subtle` 5.11 (min 4.5), `danger` / `danger-subtle` 5.77 (min 4.5).

## Stage 2 Review_Stop report (task 16)

Branch: `migration/frontend-nextjs` (re-checked). No commit created and nothing staged by this feature (D1 deferred). The only staged entry in the repository, `frontend-react/.gitignore`, was already staged by the owner in the task 1.2 snapshot (`M  `). No stage 3 work started. No `npm run dev` or `npm run start` was run. No fix was needed, so this task changed no file except this report.

### Commands (run in `frontend/`, in this order)

| Command | Exit code | Errors | Warnings | Baseline (task 1.2) |
| :--- | :--- | :--- | :--- | :--- |
| `npm run lint` | 0 | 0 | 0 | 0 / 0 / 0, same |
| `npx tsc --noEmit` | 0 | 0 | 0 | 0 / 0 / 0, same (run with `.next/types` already present; see the `LayoutProps` item below) |
| `npm run build` | 0 | 0 | 1 | 0 / 0 / 1, same. The one warning is the known workspace-root lockfile warning, verbatim as in the baseline. |
| `node src/app/design-check/_checks/run-all.mjs --stage=2` | 0 | 0 | — | stage 1 run: 0 |

Build route table: `/`, `/_not-found`, `/apple-icon`, `/design-check`, `/icon.svg` (all `○ Static`). Static pages: 7 (stage 1: 6, baseline: 4). The new route is `/design-check`.

### Check results (`run-all.mjs --stage=2`: 5 passed, 0 failed)

| Script | Result | Detail |
| :--- | :--- | :--- |
| `build-output.check.mjs` | PASS (8 of 8) | icon links on `/` (7.7); 59 semantic color utilities used in `src` compile to `var(--sem-*)` with no literal color; 23 of 23 `@utility` classes use `var(--sem-*)` (forms-plugin note carried over); no Google Fonts or Fontshare URL; `bg-primary`, `text-secondary`, `bg-accent`, `xs:flex`, `font-montserrat`, `shadow-custom`, `prose`, `aspect-w-16`, `aspect-h-9` present (9 of 9); 23 `@utility` classes plus the variant forms `sm:card`, `hover:btn-primary`, `sm:heading-1`; forms base rules for `[type='text']`, `select`, `textarea`; `/design-check` HTML has `<meta name="robots" content="noindex, nofollow"/>` (14.9) |
| `p04-token-parity.check.mjs` | PASS | 70 `:root` Semantic_Tokens map to declared primitives and to `@theme inline`; one top-level `.dark` rule declares the same 70 names, each a single declared `var(--prim-*)`; all 248 `--prim-*`/`--sem-*` references name declared tokens |
| `p05-raw-hex.check.mjs` | PASS | 0 raw hex in 24 files under `src` (excluding `globals.css`); all 77 hex literals in `globals.css` are `--prim-*` declarations |
| `p06-light-values.check.mjs` | PASS | 70 of 70 light tokens match their legacy source; 9 checked against design.md proposals; none skipped. Light values are unchanged by stage 2. |
| `repo.check.mjs` | PASS (7 of 7) | logo and `icon.svg` hashes; `favicon.ico` unchanged; no Geist/Inter/Satoshi/Fontshare or disabled font defaults; no remote font import; `next.config.ts` unchanged; no `/design-check` reference or route-folder import outside the route (14.1); `suppressHydrationWarning` only on `<html>` (21.4) |

Not written (optional tasks): `p01`, `p02`, `p03`, `p07`, `p08`, `p09`, `p10`, `p11`, `p12`, `p13`, `p14`, `p15`, `p16`, `p17`, `p18`, `p19` (tasks 7.5–7.7, 12.2–12.4, 14.2–14.4, 14.7, 15.2–15.7). The dark contrast pairs were verified once by the throwaway script in task 15.11 (68 of 68 pass), not by a committed check.

### Integrity re-checks

- sha256 equal to the task 1.2 baseline: `next.config.ts` `bb409e5b…6ac3`, `eslint.config.mjs` `870f1adc…3493`, `tsconfig.json` `5c51df4c…ef9c`, `src/app/favicon.ico` `bdbf6368…6523`, root `DESIGN.md` `5b13f917…cb47`. `frontend/DESIGN.md` does not exist yet (task 17).
- `git status --porcelain -- frontend-react DESIGN.md` (repository root): identical to the task 1.2 snapshot, 15 lines, owner changes only.
- `grep -rnE 'eslint-disable|@ts-ignore|@ts-expect-error|@ts-nocheck' frontend/src`: no match (15.7).
- `package.json`: the 12 pre-existing entries are unchanged. The only additions are `@tailwindcss/forms ^0.5.10`, `@tailwindcss/typography ^0.5.16`, `@tailwindcss/aspect-ratio ^0.4.2` (devDependencies) and `next-themes ^0.4.6` (dependencies). Totals: 4 `dependencies`, 12 `devDependencies`.

### Files changed in stage 2

`git status --porcelain -- frontend` still prints only `?? frontend/` (0 tracked files under `frontend/`), so files are listed by task:

| File (relative to `frontend/`) | Change | Task |
| :--- | :--- | :--- |
| `package.json`, `package-lock.json` | modified (`next-themes` added) | 10.1 |
| `src/app/globals.css` | modified (`@custom-variant dark`, dark primitives, `color-scheme`, `.dark` block) | 11.1 |
| `src/components/theme/theme-mode.ts` | created | 12.1 |
| `src/components/theme/theme-provider.tsx` | created | 12.5 |
| `src/app/layout.tsx` | modified (`suppressHydrationWarning` on `<html>`, `<ThemeProvider>`) | 12.6 |
| `src/components/theme/theme-toggle.tsx` | created | 13.1 |
| `src/app/design-check/_lib/contrast.ts` | created | 14.1 |
| `src/app/design-check/_lib/css-color.ts` | created | 14.5 |
| `src/app/design-check/_lib/token-store.ts` | created | 14.6 |
| `src/app/design-check/_lib/tokens.ts` | created | 14.8 |
| `src/app/design-check/_components/swatch.tsx` | created | 14.9 |
| `src/app/design-check/_components/design-check.tsx`, `samples.tsx`, `section.tsx`, `status.tsx` | created (the last three are helper files split out of the 14.10 component) | 14.10 |
| `src/app/design-check/page.tsx` | created | 14.11 |
| `src/app/design-check/_checks/p04-token-parity.check.mjs` | modified (dark parity) | 15.1 |
| `src/app/design-check/_checks/build-output.check.mjs` | modified (utility coverage, forms base, robots) | 15.8 |
| `src/app/design-check/_checks/repo.check.mjs` | modified (route references, `suppressHydrationWarning`) | 15.9 |

Task 15.10 ran in a temporary copy (deleted afterwards) and changed no file in `frontend/`. Task 15.11 and this task changed only `.kiro/specs/design-system-dark-mode/final-report-draft.md`. Stage 1 `_checks/` files (`lib/css.mjs`, `run-all.mjs`, `p05`, `p06`, `legacy-inventory.report.mjs`) live in the stage-2 route folder but were not changed in stage 2. `.next/` is build output and not listed.

### Open report items and owner decisions so far

Carried over from stage 1 (details in "Stage 1 Review_Stop report (task 9)"):

1. **Montserrat Alternates license:** "TODO: confirm" (metadata endpoint says `ofl`). Owner to copy the name and URL from the Google Fonts License tab.
2. **`#1a1f4a` vs `#1a1f4d`** for `hero-gradient-deep` (4.5 vs 4.6): confirm, or drop the token.
3. **Near-duplicate merges:** 18 pairs kept separate, 5 not named in design.md. Merge or keep.
4. **`#ffffff` multi-role mapping (D7)** and the `#4318ff` → `auth-primary` mapping: confirm.
5. **Chart token assignments (D9):** proposals, in both themes.
6. **D12 plugin specifiers:** `^0.5.10` / `^0.5.16` (legacy) or `^0.5.11` / `^0.5.20` (latest).
7. **`npm audit`:** 9 moderate, dev-only, unchanged by `next-themes`.
8. **Forms plugin `.form-input:focus`:** `--tw-ring-offset-color: #fff` and a transparent outline stay. No visible effect now; it would show white in dark mode if `ring-offset-*` is added. Possible fix (not applied): `focus:ring-offset-page`.
9. **Pending owner decision files (7.5, D3):** 7 files. Keep, delete or rename each.
10. **Light legacy contrast failures (12.3):** 14 pairs kept as legacy values.
11. **Workspace-root lockfile build warning:** pre-existing, left unchanged (fixing it needs `next.config.ts` or the root lockfile).
12. **`-webkit-backdrop-filter` minification:** confirm in Manual_Browser_Checks.
13. **`reactCompiler: true` in `next.config.ts`:** review when feature porting starts.
14. **Commits deferred (D1):** no commits for C1 or C2.

New in stage 2:

15. **D10, React script warning (9.7, 21.3–21.5):** `scriptProps` type switch in `src/components/theme/theme-provider.tsx:10,21`. Unverified until Manual_Browser_Check (b) under `npm run dev`. If a warning appears, the owner picks: keep the switch, remove it, or wait for an upstream fix (next-themes issue #385).
16. **D11, invalid stored Theme_Mode with OS dark (9.3, 9.6):** the page paints light until hydration, then `ThemeModeGuard` switches to `system` (dark). Accept, or approve an inline guard script.
17. **Strict Mode dev remount:** a brief theme flip seen only under `npm run dev` is dev-only behavior, not a 9.6 failure. Check (a) uses `npm run build && npm run start`.
18. **`prose` readability in dark mode:** the `/design-check` sample (`src/app/design-check/_components/samples.tsx:411–417`) uses `prose prose-sm` without `dark:prose-invert`, so the typography plugin's own gray text colors apply in both themes. In dark mode that text may be hard to read on the navy surface. The sample only proves the plugin compiles (3.2). The legacy app has no dark mode, so there is no legacy rule to copy. Options: map `--tw-prose-*` to Semantic_Tokens in `globals.css`, or use `dark:prose-invert` where prose is used in ported pages. Owner decision; not changed.
19. **`LayoutProps` typegen order (task 15.10):** on a fresh clone, `npx tsc --noEmit` exits 2 with `src/app/layout.tsx:18:50 - error TS2304: Cannot find name 'LayoutProps'` until `npm run build` or `npx next typegen` creates `.next/types/`. In the repository the 15.1 order (lint, tsc, build) passes because `.next/types/` already exists from earlier builds. CI or a fresh clone should run `npx next typegen` before `tsc --noEmit`. Not a config change; documentation item for the Final_Report "Notes for feature porting".
20. **`card-hover` forced hover sample:** `samples.tsx:166–167` approximates `.card-hover:hover` with utilities (`-translate-y-1 scale-[1.02] shadow-2xl shadow-shadow/15 ring-1 ring-glass-border/5`). It is not the compiled rule, so the owner should compare it with a real hover in Manual_Browser_Checks.
21. **Button and input states "TODO: confirm":** the legacy `btn-primary`/`btn-secondary` have no active or disabled style. The samples show the default look under "active (legacy has no active style)" and "disabled (legacy has no disabled style; TODO: confirm)" (`samples.tsx:59–67`). `form-input` error (proposed `border-danger`) and disabled (native) are also marked "TODO: confirm" (`samples.tsx:105`, `122`). Owner to define these states or accept "none" for DESIGN.md section 9.
22. **Dark contrast:** 68 of 68 dark intended pairs pass. Closest margins: `input-border`/`input-bg` 4.06 (min 3), `emergency`/`emergency-subtle` 5.11 (min 4.5).
23. **Optional property checks not written** (list above). Add any before stage 3 if wanted.
24. **Manual_Browser_Checks still pending (19.10):** no-flash per Theme_Mode (a), console warnings (b), Theme_Toggle keyboard and focus, `/design-check` swatch resolution in both themes, reduced motion.

Waiting for the owner to reply "continue" before stage 3.


## Task 18.1: Final verification

All commands run from `/Users/karangupta/Project/Medicare/frontend/`.

### Command results

| Command | Exit code | Errors | Warnings |
| :--- | :--- | :--- | :--- |
| `npm run lint` | 0 | 0 | 0 |
| `npx tsc --noEmit` | 0 | 0 | 0 |
| `npm run build` | 0 | 0 | 1 |
| `node src/app/design-check/_checks/run-all.mjs --stage=2` | 0 | 0 | 0 |

#### `npm run lint` output

```
> frontend@0.1.0 lint
> eslint
```

No errors, no warnings. Output is empty (ESLint prints nothing when all files pass).

#### `npx tsc --noEmit` output

Empty. No TypeScript errors.

#### `npm run build` output

Full output, verbatim:

```
> frontend@0.1.0 build
> next build
▲ Next.js 16.4.6 (Turbopack)
- Environments: .env.local
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of /Users/karangupta/Project/Medicare/package-lock.json as the root directory.
 To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles: 
   * /Users/karangupta/Project/Medicare/frontend/package-lock.json
✓ Running next.config.ts took 81ms
  Creating an optimized production build ...
✓ Compiled successfully in 677ms
  Running TypeScript ...
  Finished TypeScript in 481ms ...
  Collecting page data using 8 workers ...
✓ Collecting page data using 8 workers in 261ms
  Generating static pages using 8 workers (0/7) ...
  Generating static pages using 8 workers (1/7) 
  Generating static pages using 8 workers (3/7) 
  Generating static pages using 8 workers (5/7) 
✓ Generating static pages using 8 workers (7/7) in 282ms
  Finalizing page optimization ...
✓ Finalizing page optimization in 6ms
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /apple-icon
├ ○ /design-check
└ ○ /icon.svg
○  (Static)  prerendered as static content
```

The warning is identical to the baseline (task 1.2). Routes now include `/apple-icon`, `/design-check` and `/icon.svg` added by this feature.

#### `node src/app/design-check/_checks/run-all.mjs --stage=2` output

Summary: 5 of 5 checks passed. Full output:

```
run-all: stage 2, 5 script(s)
--- build-output.check.mjs ---
build-output.check: stage 2, root /Users/karangupta/Project/Medicare/frontend/
  ...  prerendered / HTML has the favicon, icon.svg and apple-touch-icon links (7.7)
  ok   prerendered / HTML has the favicon, icon.svg and apple-touch-icon links (7.7)
  ...  semantic color utilities used in src compile to var(--sem-*) with no literal color (3.1, 10.3)
       59 semantic color utilities used in src: bg-page text-page-fg text-text-heading text-text text-text-muted bg-brand-hover! bg-surface-control-hover! outline-focus-ring ring-input-focus-ring! border-input-border-focus! border-danger! text-danger-text shadow-shadow/15 ring-glass-border/5 bg-overlay/50 border-border bg-surface-muted bg-surface-control text-text-label bg-danger text-danger-fg bg-success bg-info from-brand to-accent text-on-brand bg-surface bg-primary text-secondary bg-accent border-accent border-input-border bg-input-bg focus-visible:outline-focus-ring text-success-fg bg-success-subtle border-success bg-warning text-warning-fg bg-warning-subtle border-warning bg-danger-subtle border-danger text-info-fg bg-info-subtle border-info bg-emergency text-emergency-fg bg-emergency-subtle border-emergency text-success-text text-warning-text bg-brand hover:bg-brand-hover dark:hover:bg-surface-hover aria-checked:border-brand aria-checked:bg-surface aria-checked:text-text border-border-default
  ok   semantic color utilities used in src compile to var(--sem-*) with no literal color (3.1, 10.3)
  ...  compiled @utility classes set colors through var(--sem-*) with no literal color (10.3)
       form-input: 18 @tailwindcss/forms plugin rules skipped (not part of the @utility body)
       form-input: plugin color values the @utility does not override: .form-input:focus { --tw-ring-offset-color: #fff }; .form-input:focus { outline: 2px solid #0000 }
       23 of 23 @utility classes in the compiled CSS
  ok   compiled @utility classes set colors through var(--sem-*) with no literal color (10.3)
  ...  compiled CSS has no Google Fonts or Fontshare URL (5.3)
  ok   compiled CSS has no Google Fonts or Fontshare URL (5.3)
  ...  compiled CSS has bg-primary, text-secondary, bg-accent, xs:flex, font-montserrat, shadow-custom, prose, aspect-w-16 (3.1, 3.2)
       9 of 9 classes found: bg-primary text-secondary bg-accent xs:flex font-montserrat shadow-custom prose aspect-w-16 aspect-h-9
  ok   compiled CSS has bg-primary, text-secondary, bg-accent, xs:flex, font-montserrat, shadow-custom, prose, aspect-w-16 (3.1, 3.2)
  ...  compiled CSS has all 23 @utility classes and their variant forms used in src (3.4)
       23 of 23 @utility classes in the compiled CSS
       3 variant forms used in src: sm:card hover:btn-primary sm:heading-1
  ok   compiled CSS has all 23 @utility classes and their variant forms used in src (3.4)
  ...  compiled CSS has the @tailwindcss/forms base rules for input, select and textarea (3.2)
       an input type such as [type='text']: .next/static/chunks/3rr4xt_lmcd9j.css:1
       select: .next/static/chunks/3rr4xt_lmcd9j.css:1
       textarea: .next/static/chunks/3rr4xt_lmcd9j.css:1
  ok   compiled CSS has the @tailwindcss/forms base rules for input, select and textarea (3.2)
  ...  prerendered /design-check HTML has <meta name="robots" content="noindex, nofollow"> (14.9)
       found <meta name="robots" content="noindex, nofollow"/>
  ok   prerendered /design-check HTML has <meta name="robots" content="noindex, nofollow"> (14.9)
build-output.check: 8 of 8 checks passed
PASS build-output.check.mjs
--- p04-token-parity.check.mjs ---
p04-token-parity: OK, 70 :root Semantic_Tokens each map to a declared Primitive_Token and to @theme inline --color-<role>.
p04-token-parity: OK (stage 2), one top-level .dark rule declares the same 70 Semantic_Tokens, each a single declared var(--prim-*); 248 --prim-*/--sem-* references in src/app/globals.css all name declared tokens.
PASS p04-token-parity.check.mjs
--- p05-raw-hex.check.mjs ---
PASS Property 5 (stage 2): 0 raw hex literals in 24 files under src (globals.css excluded); all 77 literals in src/app/globals.css are in --prim-* declarations.
PASS p05-raw-hex.check.mjs
--- p06-light-values.check.mjs ---
p06-light-values: 70 light Semantic_Token(s) match their legacy source
[... 70 token validations all passed ...]
PASS p06-light-values
PASS p06-light-values.check.mjs
--- repo.check.mjs ---
repo.check: stage 2, root /Users/karangupta/Project/Medicare/frontend/
  ok   logo copies match source sha256 (7.2)
  ok   icon.svg copy and favicon.ico unchanged (7.4)
  ok   no Geist, Inter, Satoshi, Fontshare or disabled font defaults (5.5, 5.6, 5.8, 6.3)
  ok   no remote font @import or <link> (5.3)
  ok   next.config.ts unchanged (1.9)
  ok   no /design-check reference or route-folder import outside the route (14.1, 21.4)
  ok   suppressHydrationWarning only on <html> in layout.tsx (14.10)
repo.check: 7 of 7 checks passed
PASS repo.check.mjs
Summary:
  PASS build-output.check.mjs
  PASS p04-token-parity.check.mjs
  PASS p05-raw-hex.check.mjs
  PASS p06-light-values.check.mjs
  PASS repo.check.mjs
5 passed, 0 failed
```

### Comparison with baseline (task 1.2)

#### Command results comparison

| Command | Baseline exit code | Final exit code | Baseline errors | Final errors | Baseline warnings | Final warnings | Match? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `npm run lint` | 0 | 0 | 0 | 0 | 0 | 0 | ✓ |
| `npx tsc --noEmit` | 0 | 0 | 0 | 0 | 0 | 0 | ✓ |
| `npm run build` | 0 | 0 | 0 | 0 | 1 | 1 | ✓ |
| Design checks | — | 0 | — | 0 | — | 0 | new (stage 2) |

**Result:** All three baseline commands have identical exit codes, error counts and warning counts. The single `npm run build` warning is pre-existing (Turbopack workspace root inference) and matches the baseline verbatim.

**New issues:** None. Every issue present in the final verification was present in the baseline.

**Pre-existing issues confirmed:**
- The Turbopack workspace root warning (present in both baseline and final, not introduced by this feature)

#### Git status comparison

`git status --porcelain -- frontend-react DESIGN.md` run from `/Users/karangupta/Project/Medicare`:

**Baseline (task 1.2):**
```
 M frontend-react/.DS_Store
M  frontend-react/.gitignore
 M frontend-react/dist/aboutus/index.html
 M frontend-react/dist/aboutus2/index.html
 D frontend-react/dist/assets/index-BM94s0S8.js
 D frontend-react/dist/assets/index.C2ztjgw8.css
 M frontend-react/dist/detail-review/index.html
 M frontend-react/dist/index.html
 M frontend-react/dist/pricing/index.html
 M frontend-react/dist/service2/index.html
 M frontend-react/dist/services/index.html
 M frontend-react/dist/team/index.html
 M frontend-react/vite.config.js
?? frontend-react/src/.DS_Store
?? frontend-react/src/assets/.DS_Store
```

**Final (task 18.1):**
```
 M frontend-react/.DS_Store
M  frontend-react/.gitignore
 M frontend-react/dist/aboutus/index.html
 M frontend-react/dist/aboutus2/index.html
 D frontend-react/dist/assets/index-BM94s0S8.js
 D frontend-react/dist/assets/index.C2ztjgw8.css
 M frontend-react/dist/detail-review/index.html
 M frontend-react/dist/index.html
 M frontend-react/dist/pricing/index.html
 M frontend-react/dist/service2/index.html
 M frontend-react/dist/services/index.html
 M frontend-react/dist/team/index.html
 M frontend-react/vite.config.js
?? frontend-react/src/.DS_Store
?? frontend-react/src/assets/.DS_Store
```

**Result:** Snapshots are identical character-for-character. No changes to `frontend-react/` or root `DESIGN.md` by this feature (Requirement 1.3).

#### Frozen file hash comparison

| File | Baseline sha256 | Final sha256 | Match? |
| :--- | :--- | :--- | :--- |
| `next.config.ts` | `bb409e5b989fb255dd2c0f8890ce9f2fd15a7b47af02ac0917ba4f132a336ac3` | `bb409e5b989fb255dd2c0f8890ce9f2fd15a7b47af02ac0917ba4f132a336ac3` | ✓ |
| `eslint.config.mjs` | `870f1adccecf3051cbcd9fd307cef51d7633cf510979c181a81f4b1797273493` | `870f1adccecf3051cbcd9fd307cef51d7633cf510979c181a81f4b1797273493` | ✓ |
| `tsconfig.json` | `5c51df4c59f4510d8c7dadf07a5c32132228826a3b331da5e286207b4df7ef9c` | `5c51df4c59f4510d8c7dadf07a5c32132228826a3b331da5e286207b4df7ef9c` | ✓ |

**Result:** All three frozen files (Requirement 1.9) match their baseline hashes exactly. No modifications.

### Build verification status (Requirement 15.6)

**Status:** ✓ PASSED

All commands succeeded with exit code 0. No command failure. Build verification passed. The port is shippable per Requirement 15.6.

### Summary

| Category | Status | Details |
| :--- | :--- | :--- |
| Lint | ✓ Match baseline | Exit 0, 0 errors, 0 warnings |
| TypeScript | ✓ Match baseline | Exit 0, 0 errors, 0 warnings |
| Build | ✓ Match baseline | Exit 0, 0 errors, 1 pre-existing warning |
| Design checks | ✓ All passed | 5 of 5 checks passed (stage 2) |
| Git status | ✓ Match baseline | No changes to `frontend-react/` or `DESIGN.md` |
| Frozen files | ✓ Match baseline | All 3 hashes unchanged |
| Build verification | ✓ PASSED | Port is shippable (15.6) |
| New issues | ✓ None | Every issue is pre-existing |

**Conclusion:** Final verification confirms all baseline conditions remain unchanged. Every metric matches task 1.2. No regressions introduced. All stage-2 design checks pass. The feature is ready for stage 3.
