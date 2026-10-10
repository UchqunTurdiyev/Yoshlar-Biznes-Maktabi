"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export default function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, sub, dark = false, center = false }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; dark?: boolean; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${dark ? "bg-white/10 text-sky" : "bg-brand/10 text-brand"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-amber" : "bg-brand"}`} />
        {eyebrow}
      </span>
      <h2 className={`mt-4 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem] ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-white/70" : "text-muted"}`}>{sub}</p>}
    </Reveal>
  );
}
