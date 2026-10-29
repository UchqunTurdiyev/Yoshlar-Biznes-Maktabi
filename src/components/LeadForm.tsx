"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { regions, site, turnoverOptions } from "@/lib/content";
import { getAttribution } from "@/lib/attribution";
import { newEventId, track } from "@/lib/pixel";
import Icon from "./Icons";

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  d = d.slice(0, 9);
  let out = "+998";
  if (d.length) out += " (" + d.slice(0, 2);
  if (d.length >= 2) out += ")";
  if (d.length > 2) out += " " + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  return out;
}

type Errors = Partial<Record<"name" | "phone" | "age" | "region" | "employees" | "turnover" | "consent" | "form", string>>;

// short: faqat ism, telefon, yosh va manzil (/kurs sahifasi uchun)
export default function LeadForm({ variant = "light", source = "form", short = false, onDone }: { variant?: "light" | "dark"; source?: string; short?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [employees, setEmployees] = useState("");
  const [turnover, setTurnover] = useState("");
  const [consent, setConsent] = useState(true);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const dark = variant === "dark";
  // 30 yoshdan kattalar uchun forma yopiladi — faqat qo‘ng‘iroq qilish mumkin
  const over30 = Number(age) > 30;
  const field = `w-full rounded-2xl border px-4 py-3.5 text-[15px] outline-none transition placeholder:text-current/40 focus:ring-4 ${
    dark
      ? "border-white/15 bg-white/[0.06] text-white focus:border-amber focus:ring-amber/20"
      : "border-line bg-white text-ink focus:border-brand focus:ring-brand/15"
  }`;
  const label = `mb-1.5 block text-sm font-semibold ${dark ? "text-white/85" : "text-ink/80"}`;
  const err = "mt-1.5 text-xs font-semibold text-red-500";

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Ismingizni kiriting";
    if (phone.replace(/\D/g, "").length !== 12) e.phone = "Telefon raqamni to‘liq kiriting";
    const a = Number(age);
    if (!age || a < 14 || a > 99) e.age = "Yoshingizni kiriting";
    if (!region) e.region = "Manzilni tanlang";
    if (!short && employees === "") e.employees = "Xodimlar sonini kiriting";
    if (!short && !turnover) e.turnover = "Aylanmani tanlang";
    if (!consent) e.consent = "Rozilik talab qilinadi";
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (loading || over30) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const eventId = newEventId("lead");
    try {
      const attr = getAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          age: Number(age),
          region,
          ...(short ? {} : { employees: Number(employees), turnover }),
          consent,
          website,
          eventId,
          startedAt: startedAt.current || Date.now() - 5000,
          ...attr,
          utm: { ...attr.utm, form: source },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; duplicate?: boolean; error?: string; fieldErrors?: Errors };
      if (!res.ok || !data.ok) {
        setErrors({ ...(data.fieldErrors || {}), form: data.error && data.error !== "validation" ? data.error : "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring." });
        setLoading(false);
        return;
      }
      if (!data.duplicate) track("Lead", { content_name: "Yoshlar Biznes Maktabi" }, eventId);
      try { sessionStorage.setItem("ybm_name", name.trim().split(" ")[0]); } catch {}
      onDone?.();
      router.push("/rahmat");
    } catch {
      setErrors({ form: "Internet aloqasini tekshirib, qayta urinib ko‘ring." });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label="Ariza formasi">
      <div>
        <label htmlFor={`age-${source}`} className={label}>Yoshingiz</label>
        <input id={`age-${source}`} name="age" type="text" inputMode="numeric" maxLength={2} placeholder="Masalan: 24" value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 2))} className={`${field} num`} aria-invalid={!!errors.age} />
        {errors.age && <p className={err}>{errors.age}</p>}
      </div>
      {over30 ? (
        <div className={`rounded-2xl border p-4 text-center ${dark ? "border-white/15 bg-white/[0.06]" : "border-line bg-white"}`}>
          <p className={`text-sm leading-relaxed ${dark ? "text-white/80" : "text-ink/80"}`}>
            Grant 30 yoshgacha bo‘lgan tadbirkorlar uchun. Dastur haqida batafsil ma’lumot olish uchun bizga qo‘ng‘iroq qiling.
          </p>
          {site.phone && (
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber px-6 py-4 text-base font-extrabold text-navy-950 transition hover:bg-amber-600">
              <Icon name="phone" className="h-5 w-5" /> Qo‘ng‘iroq qilish: {site.phone}
            </a>
          )}
        </div>
      ) : <>
      <div>
        <label htmlFor={`name-${source}`} className={label}>Ismingiz</label>
        <input id={`name-${source}`} name="name" autoComplete="given-name" maxLength={60} placeholder="Masalan: Jasur" value={name} onChange={(e) => setName(e.target.value)} className={field} aria-invalid={!!errors.name} />
        {errors.name && <p className={err}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={`phone-${source}`} className={label}>Telefon raqamingiz</label>
        <input id={`phone-${source}`} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} onFocus={() => phone.length < 5 && setPhone("+998 ")} className={`${field} num`} placeholder="+998 (90) 123-45-67" aria-invalid={!!errors.phone} />
        {errors.phone && <p className={err}>{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor={`region-${source}`} className={label}>Manzilingiz (viloyat)</label>
        <div className="relative">
          <select id={`region-${source}`} name="region" value={region} onChange={(e) => setRegion(e.target.value)} className={`${field} appearance-none pr-10 ${!region ? (dark ? "text-white/45" : "text-ink/45") : ""}`} aria-invalid={!!errors.region}>
            <option value="" disabled>Viloyatni tanlang</option>
            {regions.map((r) => (
              <option key={r} value={r} className="text-ink">{r}</option>
            ))}
          </select>
          <svg className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-white/60" : "text-ink/50"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
        </div>
        {errors.region && <p className={err}>{errors.region}</p>}
      </div>
      {!short && <>
      <div>
        <label htmlFor={`employees-${source}`} className={label}>Xodimlar soni</label>
        <input id={`employees-${source}`} name="employees" type="text" inputMode="numeric" maxLength={6} placeholder="Masalan: 5" value={employees} onChange={(e) => setEmployees(e.target.value.replace(/\D/g, "").slice(0, 6))} className={`${field} num`} aria-invalid={!!errors.employees} />
        {errors.employees && <p className={err}>{errors.employees}</p>}
      </div>
      <div>
        <label htmlFor={`turnover-${source}`} className={label}>Aylanma</label>
        <div className="relative">
          <select id={`turnover-${source}`} name="turnover" value={turnover} onChange={(e) => setTurnover(e.target.value)} className={`${field} appearance-none pr-10 ${!turnover ? (dark ? "text-white/45" : "text-ink/45") : ""}`} aria-invalid={!!errors.turnover}>
            <option value="" disabled>Aylanmani tanlang</option>
            {turnoverOptions.map((t) => (
              <option key={t} value={t} className="text-ink">{t}</option>
            ))}
          </select>
          <svg className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-white/60" : "text-ink/50"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
        </div>
        {errors.turnover && <p className={err}>{errors.turnover}</p>}
      </div>
      </>}

      {/* Honeypot: odamlarga ko‘rinmaydi, botlar to‘ldiradi */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} name="website" /></label>
      </div>

      <label className={`flex cursor-pointer items-start gap-3 text-xs leading-relaxed ${dark ? "text-white/65" : "text-muted"}`}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-amber-600" />
        <span>
          Shaxsiy ma’lumotlarim qayta ishlanishiga roziman.{" "}
          <Link href="/maxfiylik" target="_blank" className={`font-semibold underline underline-offset-2 ${dark ? "text-white" : "text-brand"}`}>Maxfiylik siyosati</Link>
        </span>
      </label>
      {errors.consent && <p className={err}>{errors.consent}</p>}

      {errors.form && (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-500" role="alert">
          {errors.form}
        </p>
      )}

      <button type="submit" disabled={loading} className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-amber px-6 py-4 text-base font-extrabold text-navy-950 shadow-[0_12px_30px_-10px_rgb(255_181_71/0.7)] transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-80">
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md animate-shine" />
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
            Yuborilmoqda…
          </>
        ) : (
          <>
            Grantga ariza qoldirish
            <Icon name="arrow" className="h-5 w-5 transition group-hover:translate-x-1" />
          </>
        )}
      </button>
      <p className={`flex items-center justify-center gap-1.5 text-[11px] ${dark ? "text-white/45" : "text-muted/80"}`}>
        <Icon name="lock" className="h-3.5 w-3.5" /> Ma’lumotlaringiz shifrlangan holda saqlanadi
      </p>
      </>}
    </form>
  );
}
