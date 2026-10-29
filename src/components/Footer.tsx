import Image from "next/image";
import Link from "next/link";
import { partners, site } from "@/lib/content";
import { Logo } from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 pb-28 pt-14 text-white sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-white/55">{site.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl bg-white px-5 py-3">
            {partners.map((p) => (
              <Image key={p.name} src={p.src} alt={p.name} width={p.w} height={p.h} className="h-7 w-auto" unoptimized />
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-5">
            {site.phone && <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a>}
            {site.telegram && <a href={`https://t.me/${site.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram</a>}
            <Link href="/maxfiylik" className="hover:text-white">Maxfiylik siyosati</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
