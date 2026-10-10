"use client";

import { motion } from "framer-motion";
import { audience, format, uniques } from "@/lib/content";
import Reveal, { SectionHeading } from "./Reveal";
import Icon from "./Icons";

export default function Program() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Dastur haqida" title={<>Kimlar uchun, qanday formatda va <span className="text-gradient-dark">nimasi bilan unikal</span></>} />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Kimlar uchun */}
          <Reveal className="card p-6 sm:p-7">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><Icon name="users" className="h-5 w-5 text-brand" /> Kimlar uchun?</h3>
            <ul className="mt-5 space-y-3">
              {audience.map((a, i) => (
                <motion.li key={a} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-start gap-3 rounded-2xl bg-paper p-3.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-white"><Icon name="check" className="h-3.5 w-3.5" /></span>
                  <span className="text-[15px] font-semibold leading-snug">{a}</span>
                </motion.li>
              ))}
            </ul>
          </Reveal>

          {/* Format */}
          <Reveal delay={0.1} className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 text-white sm:p-7">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/30 blur-3xl" />
            <h3 className="relative flex items-center gap-2 font-display text-lg font-semibold"><Icon name="calendar" className="h-5 w-5 text-amber" /> Dastur formati</h3>
            <dl className="relative mt-5 divide-y divide-white/10">
              {format.map((f) => (
                <div key={f.label} className="flex items-center justify-between py-4">
                  <dt className="text-sm text-white/60">{f.label}</dt>
                  <dd className="font-display text-lg font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="relative mt-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-inset ring-white/10">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/60">
                <span>Nazariya 30%</span><span>Amaliyot 70%</span>
              </div>
              <div className="mt-2.5 flex h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "30%" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} className="bg-sky" />
                <motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }} className="bg-amber" />
              </div>
            </div>
            <p className="relative mt-4 flex items-center gap-2 text-sm font-semibold text-white/80"><Icon name="users" className="h-4 w-4 text-sky" /> Mentorlar va kuratorlar bilan ishlash</p>
          </Reveal>

          {/* Unikal jihatlar */}
          <Reveal delay={0.2} className="card p-6 sm:p-7">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><Icon name="spark" className="h-5 w-5 text-brand" /> Unikal jihatlari</h3>
            <ul className="mt-5 space-y-3">
              {uniques.map((u) => (
                <li key={u.title} className="group flex items-start gap-3.5 rounded-2xl p-2 transition hover:bg-paper">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber/15 text-amber-600 transition group-hover:scale-110"><Icon name={u.icon} className="h-5 w-5" /></span>
                  <div>
                    <p className="font-bold leading-tight">{u.title}</p>
                    <p className="mt-0.5 text-sm leading-snug text-muted">{u.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
