"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CtaButton } from "./LeadModal";
import Icon from "./Icons";

const nav = [
  { href: "#dastur", label: "Dastur" },
  { href: "#modullar", label: "Modullar" },
  { href: "#mentorlar", label: "Mentorlar" },
  { href: "#natijalar", label: "Natijalar" },
  { href: "#narx", label: "Narx" },
  { href: "#savollar", label: "Savollar" },
];

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Yoshlar Biznes Maktabi — bosh sahifa">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-400 to-navy-800 font-display text-[11px] font-bold tracking-tight text-white shadow-lg ring-1 ring-white/20">
        YBM
        <span className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-amber" />
      </span>
      <span className={`font-display text-[15px] font-semibold leading-[1.05] ${light ? "text-white" : "text-ink"}`}>
        Yoshlar Biznes
        <br />
        <span className={light ? "text-sky" : "text-brand"}>Maktabi</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy-950/85 py-2.5 shadow-[0_10px_30px_-15px_rgb(0_0_0/0.5)] backdrop-blur-xl" : "py-4"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Asosiy menyu">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block"><CtaButton source="header" className="!px-5 !py-2.5 text-sm">Ariza qoldirish</CtaButton></span>
          <button onClick={() => setOpen((v) => !v)} className="rounded-xl bg-white/10 p-2.5 text-white lg:hidden" aria-label="Menyu" aria-expanded={open}>
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-navy-950/95 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-white/85 hover:bg-white/10">
                  {n.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
