/** Shared soft segmented-control styles (billing toggle and phone plan selector). */
export const SEGMENT_TRACK = "inline-flex max-w-full items-center rounded-full bg-surface-muted p-1";

export function segmentClass(selected: boolean): string {
  // 44px tap target below lg, 30px option (38px track) from lg, as in the reference.
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none lg:min-h-[30px] ${
    selected ? "bg-surface text-text shadow-xs" : "text-text-muted hover:text-text"
  }`;
}
