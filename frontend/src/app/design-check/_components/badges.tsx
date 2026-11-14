// Pass and fail badges. Result is always a text label plus an icon, never color alone.
import type { PairResult } from "../_lib/evaluate";
import { CheckCircleIcon, WarningIcon, XCircleIcon } from "./icons";

export function ResultBadge({ result }: { result: PairResult }) {
  if (result.status === "unresolved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-subtle px-2.5 py-1 text-xs font-bold text-warning">
        <WarningIcon />
        Unresolved
      </span>
    );
  }
  if (result.pass) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-2.5 py-1 text-xs font-bold text-success">
        <CheckCircleIcon />
        Pass
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-subtle px-2.5 py-1 text-xs font-bold text-danger">
      <XCircleIcon />
      Fail
    </span>
  );
}
