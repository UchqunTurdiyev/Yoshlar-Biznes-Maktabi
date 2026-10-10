"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { modules } from "@/lib/content";
import { SectionHeading } from "./Reveal";
import Icon from "./Icons";
import { CtaButton } from "./LeadModal";

const totalDays = modules.reduce((s, m) => s + m.days, 0);

export default function Modules() {
  const [active, setActive] = useState(0);
  const m = modules[active];

  return (
    <section id="modullar" className="noise relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <div className="bg-grid absolute inset-0 -z-10 opacity-60" />
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand/40 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading dark eyebrow="O‘quv dasturi" title={<>6 ta modul · <span className="text-gradient">{totalDays} kunlik</span> amaliy dastur</>} sub="Strategiyadan moliyagacha — biznesni tizimli boshqarish uchun kerakli barcha yo‘nalishlar." />

        {/* 12 kunlik vaqt chizig‘i */}
        <div className="mt-12 grid grid-cols-3 gap-1.5 sm:flex sm:h-16" role="tablist" aria-label="Modullar">
          {modules.map((mod, i) => (
            <button
              key={mod.n}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              style={{ flexGrow: mod.days }}
              className={`relative h-14 overflow-hidden rounded-xl text-left transition sm:h-auto sm:basis-0 ${active === i ? "bg-amber text-navy-950" : "bg-white/[0.07] text-white/70 hover:bg-white/[0.12]"}`}
            >
              <span className="absolute left-2.5 top-1.5 text-[10px] font-extrabold uppercase tracking-wider sm:left-3 sm:text-[11px]">{mod.n}-modul</span>
              <span className="absolute bottom-1.5 left-2.5 text-xs font-bold sm:left-3 sm:text-sm">{mod.days} kun</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden space-y-2 lg:block">
            {modules.map((mod, i) => (
              <button key={mod.n} onClick={() => setActive(i)} className={`group relative flex w-full items-center gap-4 rounded-2xl p-4 text-left transition ${active === i ? "" : "hover:bg-white/[0.05]"}`}>
                {active === i && <motion.span layoutId="mod-bg" className="absolute inset-0 rounded-2xl bg-white/[0.09] ring-1 ring-inset ring-white/15" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-lg font-semibold transition ${active === i ? "bg-amber text-navy-950" : "bg-white/[0.07] text-white/70"}`}>{String(mod.n).padStart(2, "0")}</span>
                <span className="relative flex-1">
                  <span className={`block font-bold leading-snug ${active === i ? "text-white" : "text-white/70"}`}>{mod.title}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-white/45">{mod.days} kun · {mod.items.length} ta mavzu</span>
                </span>
                <Icon name="arrow" className={`relative h-4 w-4 transition ${active === i ? "text-amber" : "text-white/30 group-hover:translate-x-1"}`} />
              </button>
            ))}
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] bg-white p-6 text-ink sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={m.n} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">{m.n}-modul</span>
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{m.days} kun</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl">{m.title}</h3>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-brand">Ishtirokchi o‘rganadi:</p>
                <ul className="mt-3 grid gap-2.5">
                  {m.items.map((it, i) => (
                    <motion.li key={it} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.035 }} className="flex items-start gap-3 text-[15px] leading-snug">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber/20 text-amber-600"><Icon name="check" className="h-3 w-3" /></span>
                      {it}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
              <div className="flex gap-2">
                <button onClick={() => setActive((a) => (a + modules.length - 1) % modules.length)} className="rounded-xl bg-paper p-2.5 transition hover:bg-line" aria-label="Oldingi modul"><Icon name="arrow" className="h-4 w-4 rotate-180" /></button>
                <button onClick={() => setActive((a) => (a + 1) % modules.length)} className="rounded-xl bg-paper p-2.5 transition hover:bg-line" aria-label="Keyingi modul"><Icon name="arrow" className="h-4 w-4" /></button>
              </div>
              <CtaButton source={`module-${m.n}`} variant="navy" className="!px-5 !py-3 text-sm">Dasturga yozilish</CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
