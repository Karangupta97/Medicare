"use client";
// Tracks which section is current (scroll-spy) and restores deep links. Shared by the sidebar and the top bar.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MAIN_ID, SECTIONS, type SectionId } from "../_lib/sections";

type ActiveSectionValue = { readonly active: SectionId; readonly select: (id: SectionId) => void };

const ActiveSectionContext = createContext<ActiveSectionValue | null>(null);

export function useActiveSection(): ActiveSectionValue {
  const value = useContext(ActiveSectionContext);
  if (value === null) throw new Error("useActiveSection must be used inside ActiveSectionProvider");
  return value;
}

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>("overview");

  useEffect(() => {
    const root = document.getElementById(MAIN_ID);
    if (root === null) return;
    const visible = new Set<string>();
    // A section is current while any part of it is in the top 40% of the scrolling area.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // The current section is the last one that has started: when the next section's top enters the band, it takes over.
        const current = SECTIONS.findLast((section) => visible.has(section.id));
        if (current !== undefined) setActive(current.id);
      },
      { root, rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );
    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);
      if (element !== null) observer.observe(element);
    }

    // At the very end of the page the last section may never reach the band, so select it there.
    const onScroll = () => {
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 2) setActive(SECTIONS[SECTIONS.length - 1].id);
    };
    root.addEventListener("scroll", onScroll, { passive: true });

    // Deep links: the browser scrolls to the hash before fonts load and values are measured, so
    // scroll to it again once the layout has settled.
    let cancelled = false;
    const scrollToHash = () => {
      if (cancelled) return;
      const target = window.location.hash.slice(1);
      if (target !== "") document.getElementById(target)?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
    void document.fonts.ready.then(scrollToHash);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("scroll", onScroll);
    };
  }, []);

  const value = useMemo<ActiveSectionValue>(() => ({ active, select: setActive }), [active]);
  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}
