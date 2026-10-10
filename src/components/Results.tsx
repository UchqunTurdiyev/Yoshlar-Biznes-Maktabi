"use client";

import { motion } from "framer-motion";
import { nextStage, results } from "@/lib/content";
import Counter from "./Counter";
import Reveal, { SectionHeading } from "./Reveal";
import Icon from "./Icons";

export default function Results() {
  return (
    <section id="natijalar" className="relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="bg-grid-light absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Dastur natijalari" title={<>Dastur yakunida <span className="text-gradient-dark">sizda bo‘ladi</span></>} />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((r, i) => (
                <motion.div key={r} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.55 }} className="card flex items-start gap-3.5 p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600"><Icon name="checkCircle" className="h-5 w-5" /></span>
                  <p className="pt-1.5 font-bold leading-snug">{r}</p>
                </motion.div>
              ))}
            </div>
            <Reveal delay={0.1} className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-brand p-7 text-white sm:p-8">
              <div className="absolute -bottom-20 -right-10 h-60 w-60 rounded-full bg-amber/30 blur-3xl" />
              <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/65">O‘rtacha kutilayotgan o‘sish</p>
                  <p className="mt-2 max-w-xs text-sm text-white/70">Dasturda o‘rganilgan tizimlarni biznesga joriy qilish natijasida</p>
                </div>
                <div className="font-display text-6xl font-bold leading-none text-amber sm:text-7xl">
                  <Counter to={20} prefix="+" suffix="%" />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative overflow-hidden rounded-[1.75rem] bg-navy-950 p-7 text-white sm:p-8">
            <div className="bg-grid absolute inset-0 opacity-50" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber"><Icon name="bolt" className="h-3.5 w-3.5" /> Keyingi bosqich</span>
              <h3 className="mt-4 font-display text-2xl font-semibold">Eng faol bitiruvchilar uchun</h3>
              <ul className="mt-6 space-y-3">
                {nextStage.map((n, i) => (
                  <motion.li key={n.text} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }} className="glass flex items-start gap-3.5 rounded-2xl p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-sky"><Icon name={n.icon} className="h-5 w-5" /></span>
                    <p className="text-[15px] font-semibold leading-snug text-white/90">{n.text}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
