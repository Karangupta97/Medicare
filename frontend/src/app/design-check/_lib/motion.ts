// Animation classes and their timing, as listed in DESIGN.md section 8 (keyframes and
// classes are defined in src/app/globals.css). `oneShot` classes run once and get a Replay button.
export type MotionEntry = {
  readonly className: string;
  readonly keyframe: string;
  readonly duration: string;
  readonly easing: string;
  readonly iteration: string;
  readonly oneShot: boolean;
};

export const MOTION: readonly MotionEntry[] = [
  { className: "animate-float", keyframe: "float", duration: "3s", easing: "ease-in-out", iteration: "infinite", oneShot: false },
  { className: "animate-fadeIn", keyframe: "fadeIn", duration: "0.5s", easing: "ease-out", iteration: "once, forwards", oneShot: true },
  { className: "animate-slideIn", keyframe: "slideInFromRight", duration: "0.4s", easing: "ease-out", iteration: "once, forwards", oneShot: true },
  { className: "animate-scroll", keyframe: "scroll", duration: "8s", easing: "linear", iteration: "infinite", oneShot: false },
  { className: "notification-badge", keyframe: "notification-pulse", duration: "2s", easing: "ease (default)", iteration: "infinite", oneShot: false },
  { className: "status-indicator", keyframe: "status-pulse", duration: "2s", easing: "ease (default)", iteration: "infinite", oneShot: false },
  { className: "animate-medical-fade", keyframe: "medicalFadeIn", duration: "240ms", easing: "ease-out", iteration: "once", oneShot: true },
  { className: "animate-medical-pop", keyframe: "medicalPopIn", duration: "360ms", easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", iteration: "once", oneShot: true },
  { className: "animate-medical-pulse-ring", keyframe: "medicalPulseRing", duration: "2.2s", easing: "ease-out", iteration: "infinite", oneShot: false },
  { className: "animate-medical-dots", keyframe: "medicalDots", duration: "1.4s", easing: "steps(1, end)", iteration: "infinite", oneShot: false },
  { className: "skeleton-medical", keyframe: "skeletonShimmer", duration: "1.7s", easing: "linear", iteration: "infinite", oneShot: false },
];
