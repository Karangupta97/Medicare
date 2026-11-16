/** Joins class names, skipping falsy values. Does not resolve conflicting Tailwind classes. */
export function cn(...classes: ReadonlyArray<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
