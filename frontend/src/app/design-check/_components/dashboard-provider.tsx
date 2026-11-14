"use client";
// Holds the measured tokens, the evaluated contrast pairs and the copy action for every
// interactive section. The server renders the placeholder snapshot (nothing measured), so
// hydration matches; the browser measures right after.
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createDashboardStore, type DashboardSnapshot } from "../_lib/dashboard-store";
import { evaluateAll, type PairResult } from "../_lib/evaluate";

// Creating the store reads nothing from the DOM, so a module-level store is safe here.
const store = createDashboardStore();

type DashboardContextValue = {
  readonly snapshot: DashboardSnapshot;
  readonly results: readonly PairResult[];
  readonly copy: (text: string) => void;
  readonly refresh: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const value = useContext(DashboardContext);
  if (value === null) throw new Error("useDashboard must be used inside DashboardProvider");
  return value;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const results = useMemo(() => evaluateAll(snapshot), [snapshot]);
  const [message, setMessage] = useState("");
  const timer = useRef<number | null>(null);

  const copy = useCallback((text: string) => {
    const announce = (note: string) => {
      setMessage(note);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMessage(""), 3000);
    };
    navigator.clipboard.writeText(text).then(
      () => announce(`Copied ${text}`),
      () => announce(`Could not copy ${text}. Select the text and copy it manually.`),
    );
  }, []);

  const value = useMemo<DashboardContextValue>(
    () => ({ snapshot, results, copy, refresh: store.refresh }),
    [snapshot, results, copy],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
      {/* Announces each copy to screen readers. The visible toast below is hidden from them to avoid a double announcement. */}
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
      {message !== "" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 mx-auto w-fit max-w-full rounded-xl bg-text px-4 py-3 text-sm font-medium text-page break-words sm:left-auto sm:right-6"
        >
          {message}
        </div>
      )}
    </DashboardContext.Provider>
  );
}
