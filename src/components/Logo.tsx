import Link from "next/link";

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
