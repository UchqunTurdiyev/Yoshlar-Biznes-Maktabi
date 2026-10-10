"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { faq } from "@/lib/content";
import { SectionHeading } from "./Reveal";
import Icon from "./Icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="savollar" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow="Savol-javob" title="Ko‘p beriladigan savollar" sub="Javob topa olmadingizmi? Ariza qoldiring — mutaxassisimiz barcha savollaringizga javob beradi." />
        <div className="space-y-3">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`card overflow-hidden !rounded-2xl transition ${isOpen ? "ring-2 ring-brand/20" : ""}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left" aria-expanded={isOpen}>
                  <span className="font-bold leading-snug">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isOpen ? "bg-brand text-white" : "bg-paper text-ink"}`}>
                    <Icon name="plus" className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                      <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
