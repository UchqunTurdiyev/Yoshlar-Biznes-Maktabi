"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { partners, pricing } from "@/lib/content";
import Counter from "./Counter";
import { CtaButton } from "./LeadModal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-950 pb-16 pt-28 text-white sm:pb-20 sm:pt-32">
      {/* Fon */}
      <div className="bg-grid absolute inset-0 -z-10" />
      <div className="absolute -left-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-brand/50 blur-[120px] animate-float" />
      <div className="absolute -right-32 top-48 -z-10 h-[420px] w-[420px] rounded-full bg-brand-400/30 blur-[110px] animate-float [animation-delay:-3s]" />
      <div className="absolute bottom-0 left-1/2 -z-10 h-[260px] w-[900px] -translate-x-1/2 rounded-full bg-amber/10 blur-[120px]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-white/80 backdrop-blur">
            <span className="rounded-full bg-amber px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-navy-950">{pricing.grantPercent}% grant</span>
            Yosh tadbirkorlar uchun amaliy biznes ta’lim dasturi
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }} className="mt-6 font-display text-[2.4rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]">
            <span className="text-gradient">Yoshlar Biznes</span>
            <br />
            Maktabi
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease }} className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Biznesingizni <b className="font-bold text-white">tizimli boshqarishga</b> o‘tkazing va <b className="font-bold text-white">keyingi bosqichga</b> olib chiqing. 12 kunlik oflayn dastur — 70% amaliyot, praktik ekspertlar va mentorlar bilan.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton source="hero" className="w-full sm:w-auto">Grantga ariza qoldirish</CtaButton>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease }} className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: <Counter to={12} />, l: "kun (2 oy)" },
              { v: <Counter to={70} suffix="%" />, l: "amaliyot" },
              { v: <Counter to={70} />, l: "ishtirokchi" },
              { v: <Counter to={210} />, l: "ta grant" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl px-4 py-3.5">
                <div className="font-display text-2xl font-semibold text-white sm:text-[1.7rem]">{s.v}</div>
                <div className="mt-0.5 text-xs font-semibold text-white/55">{s.l}</div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }} className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Hamkorlikda tashkil etilgan</p>
            <div className="mt-3 inline-flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl bg-white px-5 py-3 shadow-xl">
              {partners.map((p) => (
                <Image key={p.name} src={p.src} alt={p.name} width={p.w} height={p.h} className="h-7 w-auto sm:h-8" priority />
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
