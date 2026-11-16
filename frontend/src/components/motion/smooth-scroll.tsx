"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { useEffect, useState, type ReactNode } from "react";

/** Expo-out easing for Lenis. */
const easeOutExpo = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** Anything inside a dialog or marked data-lenis-prevent scrolls natively (modals and menus are never trapped). */
const preventSmooth = (node: HTMLElement): boolean => node.closest('[role="dialog"], [data-lenis-prevent]') !== null;

/**
 * Lenis smooth scrolling, mounted once. It drives the real window scroll position, so framer-motion's useScroll and
 * every scroll listener see the smoothed scroll without any extra wiring. Disabled on touch devices and under
 * prefers-reduced-motion, and destroyed on unmount or when either preference changes.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setEnabled(!reduced.matches && !touch.matches);
    update();
    reduced.addEventListener("change", update);
    touch.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      touch.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ duration: 1.1, easing: easeOutExpo, smoothWheel: true, autoRaf: true, prevent: preventSmooth });
    return () => lenis.destroy();
  }, [enabled]);

  return <>{children}</>;
}
