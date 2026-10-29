"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Mentor = { name: string; title: string; photo: string; highlight: string };

// Telefonda 2 tadan, kompyuterda 4 tadan ko‘rinadi; sig‘masa o‘zi aylanadi (framer-motion’siz, scroll-snap)
export default function MentorCarousel({ items }: { items: Mentor[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (paused.current || document.hidden || el.scrollWidth <= el.clientWidth + 4) return;
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <div
      ref={ref}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onTouchStart={pause}
      onTouchEnd={() => setTimeout(resume, 4000)}
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] lg:gap-5 [&::-webkit-scrollbar]:hidden"
    >
      {items.map((m) => (
        <article key={m.name} className="relative w-[calc(50%-6px)] shrink-0 snap-start overflow-hidden rounded-3xl bg-navy-900 lg:w-[calc(25%-15px)]">
          <div className="relative aspect-[3/4]">
            <Image src={m.photo} alt={m.name} fill sizes="(min-width:1024px) 280px, 50vw" unoptimized className="object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/20 to-transparent" />
            <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-navy-900 sm:left-4 sm:top-4 sm:text-xs">{m.highlight}</span>
            <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
              <h3 className="font-display text-sm font-semibold leading-tight sm:text-lg">{m.name}</h3>
              <p className="mt-1 text-[11px] font-semibold leading-snug text-white/75 sm:text-xs">{m.title}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
