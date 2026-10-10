"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { pricing, formatSum } from "@/lib/content";
import { useLeadModal } from "./LeadModal";
import Icon from "./Icons";

export default function MobileBar() {
  const [show, setShow] = useState(false);
  const { open } = useLeadModal();
  useEffect(() => {
    const on = () => {
      const form = document.getElementById("ariza-forma");
      const nearForm = form ? form.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setShow(window.scrollY > 560 && !nearForm);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", damping: 24, stiffness: 260 }} className="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <div className="flex items-center gap-3 rounded-2xl bg-navy-900/95 p-2.5 pl-4 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-white/55">Grant bilan</p>
              <p className="num truncate font-display text-base font-semibold">{formatSum(pricing.grant)} so‘m</p>
            </div>
            <button onClick={() => open("mobile-bar")} className="inline-flex items-center gap-1.5 rounded-xl bg-amber px-4 py-3 text-sm font-extrabold text-navy-950">
              Ariza qoldirish <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
