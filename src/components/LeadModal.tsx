"use client";

import { createContext, useCallback, useContext } from "react";
import Icon from "./Icons";

const Ctx = createContext<{ open: (source?: string) => void }>({ open: () => {} });
export const useLeadModal = () => useContext(Ctx);

// Saytda bitta forma bor (#ariza-forma) — barcha CTA tugmalari shu formaga olib boradi
export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const open = useCallback(() => {
    const form = document.getElementById("ariza-forma");
    if (!form) return;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => form.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }), 700);
  }, []);

  return <Ctx.Provider value={{ open }}>{children}</Ctx.Provider>;
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
