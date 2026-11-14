"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { isThemeMode } from "./theme-mode";

// Server renders an executable script; the client renders text/plain so React
// does not warn about a <script> element. next-themes already marks its script
// suppressHydrationWarning, which covers the type mismatch.
const SCRIPT_TYPE = typeof window === "undefined" ? "text/javascript" : "text/plain";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark"]}
      storageKey="theme"
      scriptProps={{ type: SCRIPT_TYPE }}
    >
      <ThemeModeGuard />
      {children}
    </NextThemesProvider>
  );
}

// Resets an invalid stored Theme_Mode (for example "foo") to "system".
function ThemeModeGuard() {
  const { theme, setTheme } = useTheme();
  useLayoutEffect(() => {
    if (theme !== undefined && !isThemeMode(theme)) setTheme("system");
  }, [theme, setTheme]);
  return null;
}
