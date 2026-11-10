# Medicare Design System Specification

> **Source of Truth**: This document reflects the design system as *actually implemented* across the codebase (`tailwind.config.js`, `src/index.css`, layouts, modals, and representative pages). Every token, class, and component rule is extracted directly from working source code.

---

## 1. Overview

- **Product**: **Medicare** — A full-stack digital healthcare management platform connecting patients, healthcare providers (doctors), and hospital organizations. Key capabilities include encrypted medical records storage, AI-assisted medical report analysis, public emergency folder access (via UMID and dynamic QR codes), digital prescriptions, prescription reminders, family vaults, and administrative staff/team management.
- **Visual Personality**: Clinical, modern, trustworthy, and security-centric. It pairs deep corporate navy tones with crisp white surfaces, soft pastel status accents, gentle card elevations, and backdrop-blur glassmorphic overlays.
- **UI Stack**:
  - **Framework**: React 18.2.0 (Single Page Application via Vite 6.3.5)
  - **CSS Architecture**: Tailwind CSS v4 (`@tailwindcss/vite`, `@tailwindcss/postcss`, `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/aspect-ratio`) with backward-compatible configuration in `tailwind.config.js` and `@theme` definitions in `src/index.css`
  - **Component Libraries**: Custom handcrafted component suite; Headless UI (`@headlessui/react`) and MUI (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`) available in `package.json`
  - **Icons**: `react-icons` (`fi` / Feather, `fa` / Font Awesome, `si` / Simple Icons) and `lucide-react`
  - **Motion & Interactions**: `framer-motion` (v12.16.0), Lenis smooth scrolling (`@studio-freight/lenis`), `canvas-confetti`
  - **Data Visualization**: `chart.js`, `react-chartjs-2`, `recharts`
  - **Toast Notifications**: `react-hot-toast` and `react-toastify`

---

## 2. Color Palette

### 2.1 Core Brand Tokens (Tailwind `@theme` & `tailwind.config.js`)

| Token Name | Hex Code | CSS Variable | Implementation & Usage |
| :--- | :--- | :--- | :--- |
| **Primary Navy** | `#252A61` | `--color-primary` | Main brand identity, desktop hero background, desktop/mobile navbar buttons, patient sidebar, footer background, primary buttons |
| **Secondary Lavender** | `#B8C5FD` | `--color-secondary` | Soft brand pastel accent, light badges, secondary highlights |
| **Accent Soft Rose** | `#E8C3D5` | `--color-accent` | Subtle decorative accents, pill tags |

### 2.2 Functional & Extended Color Palette

| Role | Color / Hex | Tailwind Classes / Inline Values | Real-World Usage in Codebase |
| :--- | :--- | :--- | :--- |
| **Brand Hover Navy** | `#3b3b98` | `hover:bg-[#3b3b98]` | Hover state for `#252A61` buttons, links, and active nav highlights |
| **Brand Deep Navy** | `#1a1f4d` | `from-[#1a1f4d]` | Start of the public hero background gradient |
| **Brand Dark Navy** | `#2f347c` / `#363b7e` | `to-[#2f347c]`, `hover:bg-[#363b7e]` | Hero gradient endpoints and alternate button hover states |
| **Horizon Indigo (Auth)** | `#4318FF` | `bg-[#4318FF]`, `text-[#4318FF]` | Login & Signup primary action buttons, focus borders, active indicators |
| **Horizon Indigo Hover** | `#3311DB` | `hover:bg-[#3311DB]` | Hover state for auth submit buttons |
| **Horizon Deep Navy Text**| `#2B3674` | `text-[#2B3674]` | Login & Signup primary headings and input text color |
| **Horizon Muted Purple** | `#707EAE` | `text-[#707EAE]`, `border-[#707EAE]/20` | Auth subtitles, placeholders, form labels, input icons |
| **Horizon Surface Light** | `#F4F7FE` | `bg-[#F4F7FE]` | Background for Auth pages, OTP boxes, and auth input fields |
| **Doctor Surface Slate** | `#f8fafd` | `style={{ background: '#f8fafd' }}` | Doctor portal & Services page base background |
| **Doctor Deep Gradient** | `#0f172a` → `#1e1b4b` | `from-[#0f172a] via-[#1e1b4b]` | Doctor sidebar and Services hero gradient background |
| **Emergency Red** | `#dc2626` / `bg-red-600` | `bg-red-600`, `text-red-600` | Blood group pills, emergency alert cards, high-risk flags |
| **Success Emerald/Green**| `#10b981` / `bg-green-600` | `bg-green-500`, `text-green-700` | Verified status badges, completion banners, confirmed analysis |
| **Warning Amber/Orange** | `#f59e0b` / `bg-orange-500`| `bg-orange-100`, `text-orange-600` | Storage usage warning, moderate-risk flags |
| **Information Blue** | `#2563eb` / `#3b82f6` | `bg-blue-600`, `text-blue-600` | Links, progress indicators, info banners, secondary CTAs |

### 2.3 Status Indicators & Badges

| State | Background Class | Text Class | Border Class |
| :--- | :--- | :--- | :--- |
| **Success** | `bg-green-100` / `bg-emerald-100` | `text-green-800` / `text-emerald-700` | `border-green-200` / `border-emerald-200` |
| **Warning** | `bg-yellow-100` / `bg-amber-100` | `text-yellow-800` / `text-amber-800` | `border-yellow-200` / `border-amber-200` |
| **Error / Critical** | `bg-red-100` / `bg-red-50` | `text-red-800` / `text-red-700` | `border-red-200` / `border-red-100` |
| **Informational / UMID**| `bg-blue-50` / `bg-blue-100` | `text-blue-700` / `text-blue-800` | `border-blue-100` / `border-blue-200` |
| **Pending / Feature Soon**| `bg-purple-100` / `bg-purple-500` | `text-purple-700` / `text-white` | `border-purple-200` |

### 2.4 Dark Mode Palette

Dark mode is configured via class strategy (`darkMode: 'class'`) and activated dynamically in the Founder Portal and User Settings:

| Element | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Page Background** | `bg-gray-50` (`#f9fafb`) | `dark:bg-gray-900` (`#111827`) |
| **Card / Surface** | `bg-white` (`#ffffff`) | `dark:bg-gray-800` / `dark:bg-gray-800/80` (`#1f2937`) |
| **Drawer / Sidebar** | `bg-white/80` | `dark:bg-gray-900/90` |
| **Card Borders** | `border-gray-100` / `border-gray-200` | `dark:border-gray-700` / `dark:border-gray-800` |
| **Primary Text** | `text-gray-900` / `text-gray-800` | `dark:text-white` / `dark:text-gray-100` |
| **Muted Text** | `text-gray-600` / `text-gray-500` | `dark:text-gray-300` / `dark:text-gray-400` |
| **Input Background** | `bg-white` / `bg-gray-100` | `dark:bg-gray-700` |
| **Input Focus Ring** | `focus:ring-blue-500` | `dark:focus:ring-blue-600` |

---

## 3. Typography

### 3.1 Font Families & Loading

1. **Satoshi** (Primary Base Sans-Serif Font):
   - **How it's loaded**: Loaded in `src/index.css` (Line 1) via Fontshare CDN:
     ```css
     @import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap') layer(base);
     ```
   - **Application**: Applied globally in `src/index.css`:
     ```css
     html, body, #root {
       font-family: 'Satoshi', sans-serif;
     }
     ```
   - **Weights available**: 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black).

2. **Montserrat Alternates** (Configured Display Font):
   - **Configuration**: Defined in `tailwind.config.js` (`fontFamily: { montserrat: ['Montserrat Alternates', 'sans-serif'] }`) and in `src/index.css` (`--font-montserrat: Montserrat Alternates, sans-serif;`).
   - **Usage in code**: Referenced in `Navbar.jsx` (`font-[Montserrat Alternates]`) and `Test.jsx` (`font-['Montserrat Alternates']`).
   - **Implementation note**: Montserrat Alternates is *not* imported via `<link>` or `@import` in `index.html` or `index.css`; it relies on local system installation or falls back to system sans-serif.

3. **Inter** (Ad-hoc Sectional Font):
   - **Usage**: Explicitly injected via `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />` and set via inline `style={{ fontFamily: "'Inter', sans-serif" }}` in `DoctorDashboardLayout.jsx`, `Services.jsx`, and `ReportAnalysisModal.jsx`.

4. **Monospace**:
   - Used for UMID identification and code blocks: `font-mono tracking-wide text-slate-900`.

### 3.2 Type Scale & Utilities

| Typographic Level | Utility / Classes | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | `text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold` | 36px → 72px | 700 / 800 | `leading-tight` (1.15 - 1.2) |
| **Auth Screen H1** | `text-[32px] sm:text-[46px] font-bold tracking-tight` | 32px → 46px | 700 | Tight |
| **Heading 1** | `@utility heading-1` (`text-2xl sm:text-3xl lg:text-4xl`) | 24px → 36px | 700 | 1.25 |
| **Heading 2** | `@utility heading-2` (`text-xl sm:text-2xl lg:text-3xl`) | 20px → 30px | 700 | 1.3 |
| **Section Title** | `text-2xl md:text-4xl font-bold` | 24px → 36px | 700 | Normal |
| **Card / Modal Heading**| `text-lg sm:text-xl font-semibold` | 18px → 20px | 600 | Normal |
| **Body Large / Lead** | `text-base sm:text-lg text-gray-600` | 16px → 18px | 400 | `leading-relaxed` (1.6) |
| **Body Regular** | `@utility body-text` (`text-sm sm:text-base text-gray-600`)| 14px → 16px | 400 | Normal |
| **Auth Subtitle** | `text-[16px] sm:text-[19px] text-[#707EAE]` | 16px → 19px | 400 | `leading-relaxed` |
| **Caption / Subtext** | `text-xs sm:text-sm text-gray-500` | 12px → 14px | 400 / 500 | Normal |
| **Micro Labels / Tags** | `text-[10px]` or `text-[11px] uppercase tracking-wider` | 10px → 11px | 600 | 1 |
| **Buttons / CTAs** | `text-sm sm:text-base font-medium` or `text-lg font-medium` | 14px → 18px | 500 / 600 | 1 |

---

## 4. Spacing, Layout & Grid

### 4.1 Responsive Breakpoints

| Breakpoint | Value | Origin | Usage |
| :--- | :--- | :--- | :--- |
| `xs` | `320px` | Custom (`@theme` / `tailwind.config.js`) | Ultra-compact mobile screens (sidebar collapsed width) |
| `sm` | `640px` | Tailwind Default | Mobile landscape & phablets |
| `md` | `768px` | Tailwind Default | Tablet portrait; hero section desktop/mobile switch |
| `lg` | `1024px` | Tailwind Default | Desktop navigation threshold; dashboard sidebar toggle |
| `xl` | `1280px` | Tailwind Default | Large monitors, multi-column dashboard layouts |
| `2xl` | `1536px` | Tailwind Default | Widescreen displays |

### 4.2 Layout Containers & Max Widths

- **Site Container (`@utility container-custom`)**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px max)
- **Wide Header / Footer Container**: `max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 md:px-10`
- **Auth Card Container**: `max-w-[1400px] mx-auto`
- **Modal Containers**:
  - Small / Confirmation: `max-w-sm` (384px)
  - Medium / Alert: `max-w-md` (448px)
  - Large / Forms & Storage: `max-w-2xl` (672px)
  - Extra Large / Medical Analysis: `max-w-4xl` (896px)
- **Mobile Bottom Nav Container**: `max-w-md mx-auto px-2 sm:px-4`

### 4.3 Sidebar Dimensions

| Portal | Desktop Expanded | Desktop Collapsed | Mobile Behavior |
| :--- | :--- | :--- | :--- |
| **Patient Portal** | `w-72` (288px) | `w-20` (80px) | Fixed full-height drawer with dark backdrop (`z-50`) |
| **Doctor Portal** | `w-[264px]` | *Not collapsible* | `w-[280px]` off-canvas drawer with spring slide-in |
| **Founder Portal** | `w-64` (`16rem`) | `w-20` (`5rem`) | `w-64` slide-over with spring transition |
| **Hospital Portal**| `w-72` | `w-16 sm:w-20 lg:w-20` | Responsive slide drawer (`w-[75%] sm:w-[65%]`) |

### 4.4 Grid System Utilities (`src/index.css`)

```css
@utility grid-responsive-2 {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6;
}

@utility grid-responsive-3 {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6;
}

@utility grid-responsive-4 {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6;
}
```

---

## 5. Shape, Elevation & Effects

### 5.1 Border Radius Scale

| Radius Value | Classes | Real Code Usage |
| :--- | :--- | :--- |
| `rounded-none sm:rounded-[40px]` | Custom | Outer Auth Container card |
| `rounded-[30px] lg:rounded-[50px]`| Custom | Homepage Hero Container |
| `rounded-3xl` (24px) | `rounded-3xl`, `rounded-tr-3xl rounded-br-3xl` | Patient and Hospital Sidebar outer corners |
| `rounded-2xl` (16px) | `rounded-2xl` | Dashboard Cards, Prescription Cards, Modals, Emergency Cards |
| `rounded-xl` (12px) | `rounded-xl` | Card utility, input fields, action buttons, icon tiles |
| `rounded-lg` (8px) | `rounded-lg` | Secondary buttons, dropdown items, filter chips |
| `rounded-full` (9999px)| `rounded-full` | Pills, status badges, avatars, floating action button, CTA pills |

### 5.2 Shadows & Elevation

| Token / Shadow Level | Value / CSS | Usage |
| :--- | :--- | :--- |
| `--shadow-custom` | `0px 10px 20px rgba(0, 0, 0, 0.2)` | Theme token configured in `tailwind.config.js` |
| `shadow-xs` | Tailwind default | Card utility default base elevation |
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Stat cards, table rows, badges |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Hovered buttons, floating pill elements |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Overview panels, primary CTAs, dropdown menus |
| `shadow-xl` / `shadow-2xl` | `0 20px 25px -5px / 0 25px 50px` | Floating Action Button, Modals, Drawers |
| **Auth Card Shadow** | `shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]` | Elevated container on `/login` and `/signup` |
| **Auth Button Glow** | `shadow-lg shadow-[#4318FF]/20 hover:shadow-xl hover:shadow-[#4318FF]/30` | Horizon UI action button glow |
| **Report Modal Elevation**| `shadow-[0_22px_64px_rgba(15,23,42,0.16)]` | AI Medical Report Analysis modal |
| **Bottom Bar Elevation** | `shadow-[0_-4px_20px_rgba(0,0,0,0.05)]` | Mobile bottom navigation top shadow |

### 5.3 Glassmorphism & Blur Effects

```css
/* Standard Glass Utility */
.glass {
  @apply bg-white/10 backdrop-blur-lg;
}

/* Enhanced Glass Container */
.glass-effect {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
}

/* Glass Search Dropdown */
.glass-search-dropdown {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

---

## 6. Components

### 6.1 Buttons

#### Variants & Classes

- **Primary Brand Button (`@utility btn-primary`)**:
  ```css
  @utility btn-primary {
    @apply bg-[#252A61] text-white hover:bg-[#3b3b98] shadow-xs hover:shadow-md;
  }
  ```
- **Secondary Button (`@utility btn-secondary`)**:
  ```css
  @utility btn-secondary {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  }
  ```
- **Pill CTA (Navbar & Hero)**:
  ```html
  <Link to="/login" className="px-8 py-3 bg-[#252A61] text-white rounded-full text-lg hover:bg-[#3b3b98] transition-all duration-300 hover:shadow-lg">
    Login
  </Link>
  ```
- **Outline Pill CTA**:
  ```html
  <Link to="/dashboard" className="px-8 py-3.5 bg-white border-2 border-[#252A61] text-[#252A61] rounded-full text-lg font-medium hover:bg-[#252A61]/5 transition-all duration-300">
    Explore Features
  </Link>
  ```
- **Horizon Auth Action Button**:
  ```html
  <button className="w-full bg-[#4318FF] text-white py-4 sm:py-5 rounded-[12px] sm:rounded-[16px] hover:bg-[#3311DB] transition-all duration-300 font-semibold text-[16px] sm:text-[17px] shadow-lg shadow-[#4318FF]/20 hover:shadow-xl hover:shadow-[#4318FF]/30 disabled:opacity-70">
    Sign In Securely
  </button>
  ```
- **Gradient Upgrade CTA**:
  ```html
  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
    Upgrade Plan
  </button>
  ```
- **Destructive / Danger Button**:
  ```html
  <button className="btn btn-primary bg-red-600! hover:bg-red-700! text-white">
    Delete
  </button>
  ```

#### Code Snippet (Base Button Utility from `src/index.css`)
```css
@utility btn {
  @apply px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex items-center justify-center gap-2;
}
```

---

### 6.2 Form Inputs & Controls

#### Variants & Classes

- **Standard Form Input (`@utility form-input`)**:
  ```css
  @utility form-input {
    @apply w-full px-4 py-2 text-sm sm:text-base rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all;
  }
  @utility form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  ```
- **Horizon Auth Form Input**:
  ```html
  <div className="relative">
    <FaUserMd className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[#707EAE] text-xl" />
    <input
      type="email"
      className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 text-[16px] sm:text-[17px] rounded-[12px] sm:rounded-[16px] bg-[#F4F7FE] border-2 border-transparent focus:border-[#4318FF] focus:bg-white transition-all duration-300 text-[#2B3674] placeholder-[#707EAE]"
      placeholder="Enter your email"
    />
  </div>
  ```
- **Toggle Switch (from `Settings.jsx`)**:
  ```jsx
  const ToggleSwitch = ({ enabled, onChange, size = "default" }) => {
    const sizeClasses = size === "small" ? "w-8 h-4" : "w-11 h-6";
    const toggleClasses = size === "small" ? "h-3 w-3 translate-x-3" : "h-5 w-5 translate-x-5";

    return (
      <button
        type="button"
        className={`${
          enabled ? "bg-indigo-600" : "bg-gray-200"
        } relative inline-flex ${sizeClasses} flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
      >
        <span
          className={`${
            enabled ? toggleClasses : "translate-x-0"
          } pointer-events-none inline-block ${
            size === "small" ? "h-3 w-3" : "h-5 w-5"
          } transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    );
  };
  ```

---

### 6.3 Cards

#### Variants & Classes

- **Standard Base Card (`@utility card`)**:
  ```css
  @utility card {
    @apply bg-white rounded-xl shadow-xs p-4 sm:p-6 border border-gray-100;
  }
  @utility card-hover {
    @apply hover:shadow-lg transition-shadow duration-300;
  }
  ```
- **Digital Prescription Card (`DigitalPrescriptionCard.jsx`)**:
  ```jsx
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
  >
    {/* Colored Top Status Bar */}
    <div className={`w-full h-1 ${
      prescription.status === "Active" ? "bg-gradient-to-r from-emerald-500 to-green-500" : "bg-gradient-to-r from-gray-400 to-gray-500"
    }`} />
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
      {/* ... Content ... */}
    </div>
  </motion.div>
  ```
- **Dashboard Stat Metric Card**:
  ```html
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-4">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
      <FileText className="w-5 h-5 text-blue-600" />
    </div>
    <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
      24
    </p>
  </div>
  ```

---

### 6.4 Modals & Drawers

#### Variants & Classes

- **Standard Confirmation / Alert Modal (`LogoutModal.jsx`)**:
  ```jsx
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {/* Modal Header & Content */}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  ```
- **Off-Canvas Slide Drawer (`TeamDetailDrawer.jsx`)**:
  ```jsx
  <motion.div
    initial={{ x: "100%" }}
    animate={{ x: 0 }}
    exit={{ x: "100%" }}
    transition={{ type: "spring", stiffness: 400, damping: 40 }}
    className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl flex flex-col z-50"
  >
    {/* Drawer Header, Tab Navigation, and Content */}
  </motion.div>
  ```

---

### 6.5 Navigation Elements

#### Navbar Desktop Links (`src/index.css`)
```css
@utility nav-link {
  @apply text-black hover:text-[#252A61] transition-all duration-300 hover:scale-110 hover:bg-gray-50 px-4 py-2 rounded-lg;
}

@utility mobile-nav-link {
  @apply block w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-base font-medium;
}
```

#### Mobile Bottom Navigation Bar (`Navbar.jsx`)
```jsx
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
  <div className="max-w-md mx-auto px-2 sm:px-4">
    <nav className="flex justify-between items-center h-[60px] sm:h-[65px] relative">
      {/* 5-item Nav: Home, Records, Central Upload Button, About, Dashboard */}
      <Link to="/dashboard/upload" className="relative flex flex-col items-center -mt-8 group">
        <div className="w-16 h-16 rounded-full bg-[#3b3b98] flex items-center justify-center shadow-lg border-4 border-white/80 backdrop-blur-lg transition-all duration-300 hover:shadow-xl group-hover:scale-105">
          <FiPlus className="w-7 h-7 text-white" />
        </div>
        <span className="text-xs font-medium mt-1">Upload</span>
      </Link>
    </nav>
  </div>
</div>
```

---

### 6.6 Tables & Lists

- **Data Tables (`DoctorVerification.jsx`)**:
  ```html
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dr. Rajesh Sharma</td>
        </tr>
      </tbody>
    </table>
  </div>
  ```

---

## 7. Iconography & Imagery

### 7.1 Icon Libraries
Medicare leverages two primary icon libraries across its features:
1. **`react-icons`**:
   - `Fi*` (Feather Icons via `react-icons/fi`): Dominant in public pages, `Navbar`, `Reports`, `DoctorDashboard`, modals, and buttons.
   - `Fa*` (Font Awesome via `react-icons/fa`): Used for medical symbols (`FaUserMd`, `FaStethoscope`, `FaHeartbeat`, `FaNotesMedical`) and social icons (`FaTwitter`, `FaInstagram`).
2. **`lucide-react`**:
   - Used heavily across the **Patient Dashboard Layout**, **Family Vault**, **Emergency Folder**, **Settings**, and **Admin/Team Management**.
   - Standard icons include: `LayoutDashboard`, `FileText`, `Upload`, `Shield`, `Heart`, `Calendar`, `Users`, `Search`, `Bell`, `Settings`.

### 7.2 Icon Sizing Standards

| Context | Icon Dimension | Tailwind Class | Container Style |
| :--- | :--- | :--- | :--- |
| **Micro Badges / Inline Meta** | 12px – 14px | `w-3.5 h-3.5` / `size={14}` | None / bare |
| **Buttons & Action Items** | 16px – 18px | `w-4 h-4` to `w-5 h-5` | In-button flex gap |
| **Sidebar & Nav Items** | 20px – 24px | `w-5 h-5` / `w-6 h-6` | `w-10 h-10` rounded container |
| **Feature / Metric Tiles** | 24px – 32px | `w-6 h-6` to `w-8 h-8` | `w-12 h-12` rounded-xl pastel container |
| **Modal Attention Indicators**| 48px – 64px | `w-12 h-12` to `w-16 h-16` | Circle container with soft glow |

### 7.3 Imagery & Asset Guidelines

- **Logos**:
  - `Whitebgtextlogo.jpg`: Horizontal logo for public top navigation
  - `hand logo.png`: Compact symbol mark used in collapsed sidebars, footers, and favicon
  - `Medicare logo 1.png`: Full logo for expanded patient sidebars
- **Medical Character Illustrations**:
  - `nurse.png`: Transparent cut-out hero image with drop shadow (`drop-shadow-2xl`)
  - `Login.png` & `Sing.png`: Vector illustrations used on auth screens
- **User Avatars (`DashboardProfilePicture`, `MemberAvatar`)**:
  - Standard user image with graceful initials fallback:
  ```jsx
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#252A61] to-[#4318FF] flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
    {user?.name?.charAt(0) || "U"}
  </div>
  ```

---

## 8. Motion & Interaction

### 8.1 Motion Libraries
- **Framer Motion (`framer-motion`)**: Primary declarative animation engine for entering/exiting modals, layout changes (`layoutId`), tabs, and page transitions.
- **Lenis Smooth Scroll (`@studio-freight/lenis`)**: Implemented on `Home.jsx` with easing formula `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`.

### 8.2 CSS Keyframe Animations (`src/index.css`)

```css
/* Floating Hero Elements */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }

/* Subtle Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

/* Notification Pulse */
@keyframes notification-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
.notification-badge { animation: notification-pulse 2s infinite; }

/* AI Report Analysis Pop-In */
@keyframes medicalPopIn {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-medical-pop { animation: medicalPopIn 360ms cubic-bezier(0.2, 0.8, 0.2, 1); }

/* Shimmer Loading Skeleton */
@keyframes skeletonShimmer {
  0% { background-position: -240px 0; }
  100% { background-position: 240px 0; }
}
.skeleton-medical {
  background: linear-gradient(90deg, rgba(226, 232, 240, 0.7) 25%, rgba(255, 255, 255, 0.9) 50%, rgba(226, 232, 240, 0.7) 75%);
  background-size: 240px 100%;
  animation: skeletonShimmer 1.7s linear infinite;
}
```

### 8.3 Interaction Patterns

- **Hover Elevation**: `whileHover={{ y: -4, scale: 1.02 }}` on cards.
- **Button Press Feedback**: `whileTap={{ scale: 0.98 }}` or `whileTap={{ scale: 0.95 }}` on interactive buttons.
- **Draggable Elements**: `FloatingActionButton` supports free viewport dragging with momentum bounds clamping and coordinate persistence in `localStorage`.
- **Spring Configurations**: Modals and dropdowns use spring damping `20` to `30`, stiffness `400` to `500`.

---

## 9. Accessibility

- **Touch Targets**:
  - Primary mobile buttons and bottom navigation icons maintain `min-h-[44px]` up to `min-h-[56px]`.
  - Emergency responder cards on `/emergency-folder` enforce a minimum height of `min-h-[52px]` to `min-h-[56px]` for fast action under emergency stress.
- **ARIA & Role Specifications**:
  - Modals include `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.
  - Toggles include `role="switch"` and `aria-checked={enabled}`.
  - Screen reader text is provided via `<span className="sr-only">`.
- **Focus Rings & Visibility**:
  - Focusable elements utilize high-visibility rings: `focus:ring-2 focus:ring-blue-500` or `focus:border-[#4318FF]`.
- **Reduced Motion Support**:
  - Explicitly defined in `src/index.css`:
    ```css
    @media (prefers-reduced-motion: reduce) {
      .animate-medical-fade,
      .animate-medical-pop,
      .animate-medical-pulse-ring,
      .animate-medical-dots::after,
      .skeleton-medical {
        animation: none !important;
      }
    }
    ```

---

## 10. Do's and Don'ts

### Do's
1. **DO** use `#252A61` (`--color-primary`) for main branding, public navbars, footers, and patient sidebars.
2. **DO** use `@utility card`, `btn`, `btn-primary`, and `btn-secondary` from `index.css` for consistent surface rendering.
3. **DO** maintain 44px+ minimum clickable dimensions for all interactive elements on mobile viewports.
4. **DO** provide full `dark:` Tailwind variant classes when building components for the Founder Dashboard or Settings.
5. **DO** pair icons with explicit labels or `aria-label` attributes for accessibility.
6. **DO** support both collapsed (`w-20`) and expanded (`w-72`) responsive views for dashboard sidebars.

### Don'ts
1. **DON'T** introduce arbitrary hex colors when standard Tailwind tokens or existing palette tokens (`#252A61`, `#4318FF`, etc.) apply.
2. **DON'T** mix Horizon UI auth styling (`#4318FF`, `#2B3674`, `#707EAE`, `rounded-[40px]`) into standard patient/clinical dashboards.
3. **DON'T** use `font-['Montserrat Alternates']` or `font-['Inter']` assuming they load everywhere without ensuring the font source is imported.
4. **DON'T** use inline `style={{ background: '...' }}` for styles that can be achieved cleanly using Tailwind utility classes.
5. **DON'T** remove `overflow-x: hidden` safeguards on root containers to prevent mobile horizontal blowout.

---

## 11. File Reference

| Purpose | File Path |
| :--- | :--- |
| **Tailwind Configuration** | `/Frontend/tailwind.config.js` |
| **Global Styles & CSS Theme**| `/Frontend/src/index.css` |
| **PostCSS Setup** | `/Frontend/postcss.config.js` |
| **Vite Configuration** | `/Frontend/vite.config.js` |
| **Plan Configuration & Limits**| `/Frontend/src/config/planConfig.js` |
| **Public Navbar Component** | `/Frontend/src/components/Navbar.jsx` |
| **Public Footer Component** | `/Frontend/src/components/Footer.jsx` |
| **Patient Dashboard Layout** | `/Frontend/src/layouts/Patient/DashboardLayout.jsx` |
| **Doctor Dashboard Layout** | `/Frontend/src/components/Doctor/DoctorDashboardLayout.jsx` |
| **Founder Dashboard Layout**| `/Frontend/src/components/Founder/FounderDashboardLayout.jsx`|
| **Hospital Dashboard Layout**| `/Frontend/src/components/Hospital/HospitalDashboardLayout.jsx`|
| **Floating Action Button** | `/Frontend/src/components/FloatingActionButton.jsx` |
| **Storage Limit Modal** | `/Frontend/src/components/StorageLimitModal.jsx` |
| **Report Analysis Modal** | `/Frontend/src/components/ReportAnalysisModal.jsx` |
| **Share With Doctor Modal** | `/Frontend/src/components/reports/ShareWithDoctorModal.jsx` |
| **Digital Prescription Card**| `/Frontend/src/components/User/DigitalPrescriptionCard.jsx` |
| **QR Code Modal** | `/Frontend/src/components/User/QRCodeModal.jsx` |
| **Logout Confirmation Modal**| `/Frontend/src/components/User/LogoutModal.jsx` |
| **Success Modal & Confetti** | `/Frontend/src/components/SuccessModal.jsx` |

