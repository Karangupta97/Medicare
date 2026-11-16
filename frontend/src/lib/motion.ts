import type { Transition, Variants } from "framer-motion";

/**
 * Motion tokens for the About page. Ease-out for entrances, ease-in-out for position changes. No springs, no bounce,
 * no overshoot. Large reveals run 0.8s and image reveals 0.9s (owner-approved exception to the 600 ms limit); hover feedback is 0.25s.
 */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const DURATION = { reveal: 0.8, image: 0.9, hover: 0.25 } as const;
export const STAGGER = 0.08;
export const REVEAL_DISTANCE = 24;
/** In-view trigger: any part of a static wrapper (threshold 0), with a small bottom margin. Fires once. */
export const REVEAL_ROOT_MARGIN = "0px 0px -6% 0px";
/** If the observer never reports back, show everything after this many milliseconds. */
export const REVEAL_FALLBACK_MS = 1500;

function enter(delay: number, duration: number): Transition {
  return { duration, ease: EASE_OUT_EXPO, delay };
}

/** Fade and rise 24px. Pass the stagger delay (seconds) through `custom`. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE, transition: { duration: 0 } },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, transition: enter(delay, DURATION.reveal) }),
};

/** Headline line: rises from below a clipping mask. */
export const maskRise: Variants = {
  hidden: { y: "100%", transition: { duration: 0 } },
  visible: (delay: number = 0) => ({ y: 0, transition: enter(delay, DURATION.reveal) }),
};

/** Image frame: clip-path inset opens upward to the full frame. */
export const imageClip: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", transition: { duration: 0 } },
  visible: (delay: number = 0) => ({ clipPath: "inset(0% 0% 0% 0%)", transition: enter(delay, DURATION.image) }),
};

/** Image inside the frame: slow scale from 1.08 to 1. */
export const imageScale: Variants = {
  hidden: { scale: 1.08, transition: { duration: 0 } },
  visible: (delay: number = 0) => ({ scale: 1, transition: enter(delay, DURATION.image) }),
};
