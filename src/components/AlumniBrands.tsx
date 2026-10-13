import Image from "next/image";
import { alumniBrands } from "@/lib/content";

export default function AlumniBrands() {
  // Keng ekranda ham bo'shliq qolmasligi uchun ro'yxat 4 marta takrorlanadi; animatsiya -50% ga siljiydi
  const row = [...alumniBrands, ...alumniBrands, ...alumniBrands, ...alumniBrands];
  return (
    <section aria-labelledby="alumni-title" className="relative overflow-hidden bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 id="alumni-title" className="font-display text-2xl font-bold text-navy-800 sm:text-3xl">
          Yoshlar Biznes Maktabini quyidagi brendlar asoschilari bitirgan
        </h2>
      </div>
      <div className="relative mt-8">
        <ul className="flex w-max animate-marquee items-center gap-5 hover:[animation-play-state:paused] sm:gap-6">
          {row.map((b, i) => (
            <li
              key={i}
              aria-hidden={i >= alumniBrands.length || undefined}
              className="relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl border border-line bg-white shadow-sm sm:h-28 sm:w-48"
            >
              <Image
                src={b.src}
                alt={i < alumniBrands.length ? b.name : ""}
                fill
                sizes="(min-width: 640px) 192px, 160px"
                className={b.fit === "contain" ? "object-contain p-3" : "object-cover"}
              />
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white sm:w-24" />
      </div>
    </section>
  );
}
