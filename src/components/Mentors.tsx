"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { mentors } from "@/lib/content";
import { SectionHeading } from "./Reveal";
import Icon from "./Icons";

export default function Mentors() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="mentorlar" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Dastur mentorlari" title={<>O‘z sohasining <span className="text-gradient-dark">praktik ekspertlari</span>dan o‘rganing</>} sub="Yirik kompaniyalarda TOP lavozimlarda ishlagan, o‘nlab biznesga strategiya tuzgan mutaxassislar." />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mentors.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group card overflow-hidden !rounded-[1.75rem]"
            >
              <div className="relative aspect-[4/4.3] overflow-hidden bg-navy-900">
                <Image src={m.photo} alt={m.name} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover object-top transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-navy-900 backdrop-blur">{m.highlight}</span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-lg font-semibold leading-tight">{m.name}</h3>
                  <p className="mt-1 text-xs font-semibold leading-snug text-white/75">{m.title}</p>
                </div>
              </div>
              <div className="p-5">
                <p className={`text-sm leading-relaxed text-muted ${open === i ? "" : "line-clamp-4"}`}>{m.bio}</p>
                <button onClick={() => setOpen(open === i ? null : i)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand" aria-expanded={open === i}>
                  {open === i ? "Yopish" : "Batafsil"}
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }}><Icon name="plus" className="h-4 w-4" /></motion.span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
