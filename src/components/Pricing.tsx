"use client";

import { motion } from "framer-motion";
import { pricing, formatSum } from "@/lib/content";
import Counter from "./Counter";
import { SectionHeading } from "./Reveal";
import Icon from "./Icons";
import { CtaButton } from "./LeadModal";

export default function Pricing() {
  return (
    <section id="narx" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading center eyebrow="Dastur narxi" title={<>Grant bilan — <span className="text-gradient-dark">ikki baravar arzon</span></>} sub="Saralashdan o‘tgan 30 yoshgacha bo‘lgan tadbirkorlarga Yoshlar tadbirkorligini rivojlantirish jamg‘armasi tomonidan 50% grant beriladi." />

        <div className="mt-14 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="card flex flex-col justify-between p-7 sm:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted">Dastur narxi</p>
              <p className="relative mt-4 inline-block font-display text-4xl font-semibold text-ink/40 sm:text-5xl">
                <span className="num">{formatSum(pricing.full)}</span>
                <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 }} className="absolute left-0 top-1/2 h-[3px] w-full origin-left bg-red-500" />
              </p>
              <p className="mt-1 text-sm font-semibold text-muted">so‘m</p>
            </div>
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-paper p-4">
              <span className="rounded-xl bg-brand px-3 py-2 font-display text-xl font-bold text-white">{pricing.grantPercent}%</span>
              <p className="text-sm font-semibold leading-snug">Saralashdan o‘tgan 30 yoshgacha bo‘lgan tadbirkorlarga {pricing.grantPercent}% grant</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="noise relative overflow-hidden rounded-[1.75rem] bg-navy-900 p-7 text-white shadow-2xl shadow-navy-900/30 sm:p-9">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-400/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-60 w-60 rounded-full bg-amber/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky">Grant olgan tadbirkorlar uchun</p>
                <span className="animate-pulse-ring rounded-full bg-amber px-3 py-1 text-xs font-extrabold text-navy-950">−{pricing.grantPercent}%</span>
              </div>
              <p className="mt-5 whitespace-nowrap font-display text-[2.5rem] font-bold leading-none sm:text-6xl">
                <Counter to={pricing.grant} duration={2} />
                <span className="ml-2 text-lg font-semibold text-white/60 sm:text-xl">so‘m</span>
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-inset ring-white/10">
                <Icon name="alert" className="h-5 w-5 shrink-0 text-amber" />
                <p className="text-sm font-bold">Grantlar soni cheklangan: <span className="text-amber">{pricing.grantsTotal} ta</span></p>
              </div>
              <ul className="mt-6 grid gap-2.5 text-sm font-semibold text-white/85 sm:grid-cols-2">
                {["12 kun oflayn mashg‘ulot", "6 ta modul", "Mentorlar va kuratorlar", "Amaliy keyslar va mashg‘ulotlar"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-amber" />{t}</li>
                ))}
              </ul>
              <CtaButton source="pricing" className="mt-8 w-full">Grantga ariza qoldirish</CtaButton>
            </div>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mt-10 max-w-3xl rounded-2xl bg-brand/5 px-6 py-5 text-center font-display text-lg font-medium leading-snug text-navy-800 sm:text-xl">
          Yoshlar Biznes Maktabi — bu shunchaki o‘qish emas. <span className="text-brand">Bu biznesingizni keyingi bosqichga olib chiqish imkoniyati.</span>
        </motion.p>
      </div>
    </section>
  );
}
