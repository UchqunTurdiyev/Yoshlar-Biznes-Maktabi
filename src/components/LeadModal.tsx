"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LeadForm from "./LeadForm";
import Icon from "./Icons";
import { pricing, formatSum } from "@/lib/content";

const Ctx = createContext<{ open: (source?: string) => void }>({ open: () => {} });
export const useLeadModal = () => useContext(Ctx);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; source: string }>({ open: false, source: "modal" });
  const open = useCallback((source = "modal") => setState({ open: true, source }), []);
  const close = () => setState((s) => ({ ...s, open: false }));

  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [state.open]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state.open && (
          <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={close} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lead-modal-title"
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-navy-900 p-6 text-white shadow-2xl sm:rounded-[2rem] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl" />
              <button onClick={close} aria-label="Yopish" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/20">
                <Icon name="x" className="h-5 w-5" />
              </button>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber">
                <Icon name="star" className="h-3.5 w-3.5" /> {pricing.grantPercent}% grant · {pricing.grantsTotal} ta o‘rin
              </span>
              <h3 id="lead-modal-title" className="mt-4 font-display text-2xl font-semibold leading-tight">
                Dasturga ariza qoldiring
              </h3>
              <p className="mt-2 text-sm text-white/65">
                Grant bilan narx: <b className="text-white">{formatSum(pricing.grant)} so‘m</b>. Mutaxassisimiz siz bilan bog‘lanadi.
              </p>
              <div className="mt-6">
                <LeadForm variant="dark" source={state.source} onDone={close} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function CtaButton({ children, source = "cta", className = "", variant = "amber" }: { children: React.ReactNode; source?: string; className?: string; variant?: "amber" | "ghost" | "navy" }) {
  const { open } = useLeadModal();
  const styles = {
    amber: "bg-amber text-navy-950 hover:bg-amber-600 shadow-[0_14px_34px_-12px_rgb(255_181_71/0.75)]",
    ghost: "bg-white/10 text-white hover:bg-white/15 ring-1 ring-inset ring-white/20",
    navy: "bg-navy-900 text-white hover:bg-navy-800 shadow-[0_14px_34px_-14px_rgb(8_25_58/0.7)]",
  }[variant];
  return (
    <button type="button" onClick={() => open(source)} className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 py-4 font-extrabold transition active:scale-[0.98] ${styles} ${className}`}>
      {variant === "amber" && <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md animate-shine" />}
      {children}
      <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
    </button>
  );
}
