// Every semantic token as a small chip. The chip color is the CSS variable, so it follows whichever
// theme scope it is rendered in. Used by compare mode.
import { shortName } from "../_lib/palette";
import { SEMANTIC_NAMES } from "../_lib/tokens";

export function SemanticChips() {
  return (
    <div className="@container">
      <ul className="grid grid-cols-2 gap-3 @md:grid-cols-3 @3xl:grid-cols-4">
        {SEMANTIC_NAMES.map((name) => (
          <li key={name} className="min-w-0">
            <span className="block h-10 rounded-lg border border-border-strong" style={{ backgroundColor: `var(${name})` }} />
            <span className="mt-1 block break-all text-xs text-text">{shortName(name)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
