"use client";

import { useEffect, useState } from "react";
import { locations } from "@/lib/content";

export function nextLocation(now = Date.now()) {
  return locations.find((l) => new Date(`${l.date}T09:00:00+05:00`).getTime() > now) ?? null;
}

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    d: Math.floor(ms / 864e5),
    h: Math.floor((ms / 36e5) % 24),
    m: Math.floor((ms / 6e4) % 60),
    s: Math.floor((ms / 1e3) % 60),
  };
}

export default function Countdown({ date, compact = false, dark = true }: { date: string; compact?: boolean; dark?: boolean }) {
  const target = new Date(`${date}T09:00:00+05:00`).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const i = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(i);
  }, [target]);

  const units: [keyof ReturnType<typeof diff>, string][] = [["d", "kun"], ["h", "soat"], ["m", "daqiqa"], ["s", "soniya"]];
  return (
    <div className={`grid grid-cols-4 ${compact ? "gap-1.5" : "gap-2"}`} aria-label="Boshlanishiga qolgan vaqt">
      {units.map(([k, label]) => (
        <div key={k} className={`rounded-xl text-center ${compact ? "px-1 py-1.5" : "px-2 py-2.5"} ${dark ? "bg-white/[0.07] ring-1 ring-inset ring-white/10" : "bg-paper ring-1 ring-inset ring-line"}`}>
          <div className={`num font-display font-semibold leading-none ${compact ? "text-lg" : "text-2xl"} ${dark ? "text-white" : "text-ink"}`} suppressHydrationWarning>
            {t ? String(t[k]).padStart(2, "0") : "--"}
          </div>
          <div className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-white/50" : "text-muted"}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}
