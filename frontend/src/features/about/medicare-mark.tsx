import { useId } from "react";
import { MARK_CROSS_PATH, MARK_LEAF_PATHS, MARK_VIEW_BOX } from "./mark-paths";

/** Static Medicare mark (rounded cross with two leaf cut-outs), drawn in currentColor. Decorative. */
export function MedicareMark({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg viewBox={MARK_VIEW_BOX} aria-hidden="true" focusable="false" className={className}>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="375" height="375">
        <rect width="375" height="375" fill="white" />
        {MARK_LEAF_PATHS.map((d) => (
          <path key={d} d={d} fill="black" />
        ))}
      </mask>
      <path d={MARK_CROSS_PATH} fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
