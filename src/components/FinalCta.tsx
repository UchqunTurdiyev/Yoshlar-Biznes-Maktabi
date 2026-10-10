"use client";

import { locations, pricing, formatSum } from "@/lib/content";
import LeadForm from "./LeadForm";
import Reveal from "./Reveal";
import Icon from "./Icons";

export default function FinalCta() {
  return (
    <section id="ariza-forma" className="noise relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <div className="bg-grid absolute inset-0 -z-10" />
      <div className="absolute -left-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-brand/50 blur-[120px]" />
      <div className="absolute -right-20 top-0 -z-10 h-[360px] w-[360px] rounded-full bg-amber/15 blur-[120px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber">
            <Icon name="alert" className="h-3.5 w-3.5" /> Grantlar soni cheklangan: {pricing.grantsTotal} ta
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.1] sm:text-5xl">
            Biznesingizni <span className="text-gradient">keyingi bosqichga</span> olib chiqishga tayyormisiz?
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/70">
            Ariza qoldiring — mutaxassisimiz bog‘lanib, saralash va {pricing.grantPercent}% grant shartlarini tushuntiradi. Grant bilan narx: <b className="text-white">{formatSum(pricing.grant)} so‘m</b>.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {locations.map((l) => (
              <li key={l.city} className="glass rounded-2xl p-4">
                <p className="flex items-center gap-1.5 text-sm font-bold"><Icon name="pin" className="h-4 w-4 text-amber" />{l.city}</p>
                <p className="num mt-1 text-xs font-semibold text-white/60">{l.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-white/30 via-white/5 to-amber/30" />
            <div className="relative rounded-[2rem] bg-navy-900/90 p-6 backdrop-blur-xl sm:p-8">
              <h3 className="font-display text-xl font-semibold">Ariza qoldirish</h3>
              <p className="mt-1 text-sm text-white/60">1 daqiqadan kam vaqt oladi</p>
              <div className="mt-6">
                <LeadForm variant="dark" source="final" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
