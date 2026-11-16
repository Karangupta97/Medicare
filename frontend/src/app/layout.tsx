import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar/navbar";
import type { NavbarUser } from "@/components/layout/navbar/navbar-data";
import "./globals.css";

// Satoshi (Fontshare, ITF Free Font License) is self-hosted: the two variable files are served from this
// app's own origin. The files are used exactly as downloaded; the license forbids editing, subsetting or
// converting them. The weight axis runs from 300 to 900, so every Tailwind weight is a real face.
// next/font names the font family after this constant, so it is spelled with a capital S.
const Satoshi = localFont({
  src: [
    { path: "../assets/fonts/satoshi/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "../assets/fonts/satoshi/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-satoshi",
  preload: true,
  adjustFontFallback: "Arial",
});

// viewport-fit=cover lets env(safe-area-inset-*) report the notch and home-indicator sizes.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export const metadata: Metadata = {
  title: "Medicare",
};

// TODO: wire auth later. Both navbar states of the old app, as typed placeholders:
// SIGNED_IN shows the bell (with unread count) and the avatar menu; SIGNED_OUT (null) shows Login and Sign up.
const SIGNED_IN: NavbarUser = {
  name: "Placeholder User",
  email: "user@example.com",
  avatarUrl: null,
  notificationCount: 3,
};
const SIGNED_OUT = null;
const NAVBAR_USER: NavbarUser | null = process.env.NEXT_PUBLIC_NAVBAR_PREVIEW === "signed-in" ? SIGNED_IN : SIGNED_OUT;
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${Satoshi.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar user={NAVBAR_USER} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
