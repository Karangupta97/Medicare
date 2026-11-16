import { cn } from "@/lib/utils";

interface CurveDividerProps {
  /**
   * "top": the shape below rises toward the middle, so it is the top edge of a band (or a page-colored cover over the
   * bottom of a hero). "bottom": the same curve turned upside down, the bottom edge of a band.
   */
  orientation: "top" | "bottom";
  /** Sets the fill through currentColor: pass a token text color, for example "text-surface-muted". */
  className?: string;
}

/** Decorative SVG wave. The fill is currentColor, so a token class on the wrapper colors it. Scales with the width. */
export function CurveDivider({ orientation, className }: CurveDividerProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none block w-full leading-[0]", className)}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        focusable="false"
        className={cn("block h-[clamp(48px,8vw,120px)] w-full fill-current", orientation === "bottom" && "rotate-180")}
      >
        <path d="M0 121 L0 82 C360 -12 1080 -12 1440 82 L1440 121 Z" />
      </svg>
    </div>
  );
}
