"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { BillingPeriod, PlanKey } from "./plans";

interface BillingContextValue {
  billing: BillingPeriod;
  setBilling: (next: BillingPeriod) => void;
  /** Plan shown below lg (one card at a time). Pro is the default. */
  selectedPlan: PlanKey;
  setSelectedPlan: (next: PlanKey) => void;
}

const BillingContext = createContext<BillingContextValue | null>(null);

/** Holds the Monthly/Annual choice (monthly by default) and the phone plan selection. */
export function BillingProvider({ children }: { children: ReactNode }) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("pro");
  const value = useMemo(() => ({ billing, setBilling, selectedPlan, setSelectedPlan }), [billing, selectedPlan]);
  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
}

export function useBilling(): BillingContextValue {
  const value = useContext(BillingContext);
  if (value === null) throw new Error("useBilling must be used inside BillingProvider");
  return value;
}
