"use client";

import { motion } from "framer-motion";
import { locations } from "@/lib/content";
import Countdown, { nextLocation } from "./Countdown";
import { SectionHeading } from "./Reveal";
import Icon from "./Icons";
import { useLeadModal } from "./LeadModal";

export default function Locations() {
  const next = nextLocation();
  const { open } = useLeadModal();
  return (
    <section className="relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading center eyebrow="Joy va sanalar" title={<>Dastur <span className="text-gradient-dark">2 ta shaharda</span> boshlanadi</>} sub="O‘zingizga qulay shaharni tanlang — o‘rinlar soni har bir oqimda cheklangan." />
        <div className="mt-14 grid gap-5 mx-auto max-w-4xl md:grid-cols-2">
          {locations.map((l, i) => {
            const isNext = next?.city === l.city;
            const past = new Date(`${l.date}T09:00:00+05:00`).getTime() < Date.now();
            return (
              <motion.div
                key={l.city}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className={`relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7 ${isNext ? "bg-navy-900 text-white shadow-2xl shadow-navy-900/30" : "card"}`}
              >
                {isNext && <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber/25 blur-3xl" />}
                <div className="relative flex items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${isNext ? "bg-amber text-navy-950" : "bg-brand/10 text-brand"}`}><Icon name="pin" className="h-6 w-6" /></span>
                  {isNext && <span className="rounded-full bg-amber px-3 py-1 text-xs font-extrabold text-navy-950">Eng yaqin oqim</span>}
                  {past && <span className="rounded-full bg-muted/15 px-3 py-1 text-xs font-bold text-muted">Boshlangan</span>}
                </div>
                <h3 className="relative mt-6 font-display text-2xl font-semibold">{l.city}</h3>
                <p className={`relative mt-1 flex items-center gap-2 text-sm font-semibold ${isNext ? "text-white/70" : "text-muted"}`}>
                  <Icon name="calendar" className="h-4 w-4" /> Boshlanish: <span className="num">{l.label}</span>
                </p>
                <div className="relative mt-6">
                  <Countdown date={l.date} compact dark={isNext} />
                </div>
                <button onClick={() => open(`city-${l.city}`)} className={`relative mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-extrabold transition ${isNext ? "bg-amber text-navy-950 hover:bg-amber-600" : "bg-navy-900 text-white hover:bg-navy-800"}`}>
                  {l.city} oqimiga yozilish <Icon name="arrow" className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
