import React, { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";

export type ClaimContextValue = {
  uid: string;
  setUid: (v: string) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  isUidValid: boolean;
  canClaim: boolean;
  claim: () => void;
};

const ClaimContext = createContext<ClaimContextValue | undefined>(undefined);

export function ClaimProvider({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isUidValid = useMemo(() => /^\d{10}$/.test(uid), [uid]);
  const canClaim = isUidValid && !!selectedId;

  const claim = () => {
    if (!canClaim) return;
    toast(
      <div className="relative p-4 rounded-xl text-white shadow-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5">
        <div className="text-base font-extrabold tracking-tight">Request Received</div>
        <div className="text-sm text-white/80 mt-1">
          Your items will be credited in 24 hours.
        </div>
        <div className="mt-3 h-px bg-white/10" />
        <div className="mt-3 text-xs text-white/60">UID: {uid} • Bundle #{selectedId}</div>
      </div>,
      { duration: 5000 }
    );
  };

  const value = useMemo(
    () => ({ uid, setUid, selectedId, setSelectedId, isUidValid, canClaim, claim }),
    [uid, selectedId, isUidValid, canClaim]
  );

  return <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>;
}

export function useClaim() {
  const ctx = useContext(ClaimContext);
  if (!ctx) throw new Error("useClaim must be used within <ClaimProvider>");
  return ctx;
}