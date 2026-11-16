"use client";

import { useSyncExternalStore } from "react";

/** True when the media query matches. `serverSnapshot` (default false) is the value used for the server render and hydration. */
export function useMediaQuery(query: string, serverSnapshot = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  );
}
