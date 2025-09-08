import React, { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";

export type ClaimContextValue = {
  uid: string;
  setUid: (v: string) => void;
  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  isUidValid: boolean;
  canClaim: boolean;
  claim: () => void;
};

const ClaimContext = createContext<ClaimContextValue | undefined>(undefined);

export function ClaimProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isUidValid = useMemo(() => /^\d{10}$/.test(uid), [uid]);
  const canClaim = isUidValid && selectedIds.length > 0;

  const claim = () => {
    if (!canClaim) return;
    const summary = selectedIds.join(", ");
    toast(
      <div className="relative p-4 rounded-xl text-white shadow-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5">
        <div className="text-base font-extrabold tracking-tight">Request Received</div>
        <div className="text-sm text-white/80 mt-1">Your items will be credited in 24 hours.</div>
        <div className="mt-3 h-px bg-white/10" />
        <div className="mt-3 text-xs text-white/60">UID: {uid} • Bundles: {summary}</div>
      </div>,
      { duration: 5000 }
    );
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const clearSelected = () => setSelectedIds([]);

  const value = useMemo(
    () => ({ uid, setUid, selectedIds, toggleSelected, clearSelected, isUidValid, canClaim, claim }),
    [uid, selectedIds, isUidValid, canClaim]
  );

  return <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>;
}

export function useClaim() {
  const ctx = useContext(ClaimContext);
  if (!ctx) throw new Error("useClaim must be used within <ClaimProvider>");
  return ctx;
}
