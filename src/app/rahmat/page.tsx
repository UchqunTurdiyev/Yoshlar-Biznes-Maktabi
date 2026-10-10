import type { Metadata } from "next";
import Link from "next/link";
import { ThankYouName } from "./ThankYouName";
import { locations, site } from "@/lib/content";

export const metadata: Metadata = { title: "Arizangiz qabul qilindi", robots: { index: false, follow: false } };

export default function Rahmat() {
  return (
    <main className="noise relative isolate grid min-h-dvh place-items-center overflow-hidden bg-navy-950 px-4 py-16 text-white">
      <div className="bg-grid absolute inset-0 -z-10" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-brand/50 blur-[120px]" />
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber text-navy-950 shadow-[0_0_0_12px_rgb(255_181_71/0.15)]">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
        </div>
        <h1 className="mt-8 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Rahmat<ThankYouName />! Arizangiz qabul qilindi
        </h1>
        <p className="mt-4 text-lg text-white/70">
          Tez orada mutaxassisimiz siz bilan bog‘lanib, saralash bosqichlari va 50% grant shartlari haqida batafsil ma’lumot beradi. Iltimos, telefoningiz yoqilgan bo‘lsin.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {locations.map((l) => (
            <div key={l.city} className="glass rounded-2xl p-3">
              <p className="text-sm font-bold">{l.city}</p>
              <p className="num text-xs text-white/60">{l.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          {site.telegram && (
            <a href={`https://t.me/${site.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-amber px-6 py-3.5 font-extrabold text-navy-950 transition hover:bg-amber-600">
              Telegram kanalimiz
            </a>
          )}
          <Link href="/" className="rounded-2xl bg-white/10 px-6 py-3.5 font-bold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/15">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </main>
  );
}
