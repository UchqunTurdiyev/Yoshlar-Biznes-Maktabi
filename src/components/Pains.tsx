"use client";

import { motion } from "framer-motion";
import { painPoints, site } from "@/lib/content";
import Reveal, { SectionHeading } from "./Reveal";
import Icon from "./Icons";
import { CtaButton } from "./LeadModal";

export default function Pains() {
  return (
    <section id="dastur" className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32 lg:pt-36">
      <div className="bg-grid-light absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Bu dastur kim uchun"
              title={<>Sizda quyidagi muammolar bo‘lsa, bu dastur <span className="text-gradient-dark">aynan Siz uchun</span></>}
            />
            <Reveal delay={0.1}>
              <div className="mt-8 rounded-3xl bg-navy-900 p-6 text-white sm:p-7">
                <p className="text-[15px] leading-relaxed text-white/80">
                  <b className="text-white">{site.name}</b> — Yoshlar ishlari agentligi qoshidagi Yoshlar tadbirkorligini rivojlantirish jamg‘armasi hamda FAZZA Management School hamkorligida tashkil etilgan, <b className="text-white">yosh tadbirkorlarning biznesni professional boshqarish bo‘yicha amaliy ko‘nikmalarini rivojlantirish</b> va yangi brendlarning yetishib chiqishiga ko‘maklashishga qaratilgan biznes ta’lim dasturi.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {painPoints.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.08 + Math.floor(i / 2) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className={`card group flex items-start gap-4 p-5 transition-colors hover:border-brand/40 ${i === painPoints.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-500/10 text-red-500 transition group-hover:bg-brand group-hover:text-white">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <p className="pt-2 text-[15px] font-bold leading-snug text-ink">{p.title}</p>
              </motion.div>
            ))}
            <Reveal className="sm:col-span-2" delay={0.15}>
              <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border-2 border-dashed border-brand/30 bg-brand/5 p-5 sm:flex-row sm:items-center">
                <p className="font-display text-lg font-semibold text-ink">Shulardan qaysi biri sizga tanish?</p>
                <CtaButton source="pains" variant="navy" className="!py-3 text-sm">Yechimni olish</CtaButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
