// App shell: a fixed-height layout where the sidebar never scrolls with the page and only <main>
// scrolls. The shell is relative and clips its overflow, and <main> is relative too, so absolutely
// positioned content (screen-reader-only text, the toast) can never stretch the document.
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MAIN_ID } from "../_lib/sections";
import { Brand } from "./brand";
import { SideNav } from "./side-nav";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-dvh w-full min-w-0 flex-col overflow-hidden bg-page text-text lg:flex-row">
      <a
        href={`#${MAIN_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-brand focus:px-4 focus:py-3 focus:font-bold focus:text-on-brand"
      >
        Skip to content
      </a>
      <header className="flex shrink-0 flex-col overscroll-contain border-b border-border bg-surface lg:w-72 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 pt-3 lg:flex-col lg:items-start lg:gap-4 lg:px-6 lg:pt-6">
          <Brand />
          <ThemeToggle />
        </div>
        <SideNav />
        <p className="mt-auto hidden px-6 pb-16 pt-6 text-xs text-text-muted [@media(min-height:900px)]:block">
          Internal tool. It reads src/app/globals.css and is not served in production.
        </p>
      </header>
      <main
        id={MAIN_ID}
        tabIndex={-1}
        className="relative min-w-0 flex-1 overflow-y-auto overscroll-contain motion-safe:scroll-smooth"
      >
        {children}
      </main>
    </div>
  );
}
