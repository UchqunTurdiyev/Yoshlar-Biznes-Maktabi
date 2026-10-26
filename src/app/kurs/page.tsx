import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import Icon from "@/components/Icons";
import { CtaButton } from "@/components/LeadModal";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import { format, formatSum, locations, mentors, modules, nextStage, pricing, uniques } from "@/lib/content";
import MentorCarousel from "./MentorCarousel";

// Qisqa sotuv sahifasi: server komponentlar, framer-motion yo‘q — JS faqat forma va mentorlar karuselida
export const metadata: Metadata = {
  title: { absolute: "FAZZA: Yoshlar Biznes Maktabi — 70% grant bilan amaliy biznes dasturi" },
  description: "Yosh tadbirkorlar uchun 12 kunlik oflayn amaliy biznes dasturi. 70% grant, TOP CEO praktik ekspertlar, Andijon va Samarqandda.",
  alternates: { canonical: "/kurs" },
};

const totalDays = modules.reduce((s, m) => s + m.days, 0);

// Rasmdagi tartib: Otabek, Habibullo, Nodirbek, Jamoliddin
const mentorOrder = ["Otabek Umarov", "Habibullo Sadulloev", "Nodirbek Kuzdekov", "Jamoliddin Shodiev"];
const orderedMentors = mentorOrder.map((n) => mentors.find((m) => m.name === n)).filter((m) => m !== undefined);

// Bosh sahifadagi 7 ta muammo o‘rniga — asosiy 3 ta og‘riq
const pains = [
  { title: "Hamma ishni o‘zim qilaman, tizim yo‘q, moliya hisobi chiqmaydi", icon: "system" },
  { title: "Marketing umuman yo‘q, strategiya qilinmagan", icon: "ads" },
  { title: "Sotuv past, mijozlar oqimi barqaror emas", icon: "sales" },
];

const ticker = [
  ...locations.map((l) => ({ icon: "pin", text: `${l.city} — ${l.label} dan boshlanadi` })),
  { icon: "star", text: `${pricing.grantPercent}% grant` },
  { icon: "alert", text: `Grantlar soni cheklangan: ${pricing.grantsTotal} ta` },
];

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${dark ? "bg-white/10 text-sky" : "bg-brand/10 text-brand"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-amber" : "bg-brand"}`} />
      {children}
    </span>
  );
}

const h2 = "mt-4 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-4xl";

export default function Kurs() {
  return (
    <>
      <main>
        {/* Sarlavha + muammolar */}
        <section className="noise relative isolate overflow-hidden bg-navy-950 pb-16 pt-6 text-white sm:pb-20">
          <div className="bg-grid absolute inset-0 -z-10" />
          <div className="absolute -left-40 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-brand/50 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-amber/10 blur-[110px]" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <Logo />
              <CtaButton source="kurs-header" className="!px-4 !py-2.5 text-sm">Ariza qoldirish</CtaButton>
            </div>

            <h1 className="mt-12 max-w-3xl text-[17px] font-semibold leading-[1.9] text-white/85 sm:mt-16 sm:text-[19px] lg:text-[21px]">
              <span className="mb-4 block font-display text-[22px] font-semibold leading-[1.4] tracking-tight sm:text-[28px] lg:text-[32px]"><span className="text-gradient">FAZZA: Yoshlar Biznes Maktabi</span></span>
              yosh tadbirkorlarning biznesni professional boshqarish bo‘yicha amaliy ko‘nikmalarini rivojlantirish va yangi brendlarning yetishib chiqishiga ko‘maklashishga qaratilgan biznes ta’lim dasturi.
            </h1>

            <p className="mt-10 flex items-center gap-3 rounded-2xl bg-amber px-5 py-4 font-display text-lg font-semibold leading-snug text-navy-950 shadow-[0_14px_34px_-12px_rgb(255_181_71/0.75)] sm:inline-flex sm:px-6 sm:text-2xl">
              <Icon name="alert" className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
              Sizda quyidagi muammolar bo‘lsa, sahifani tark etmang
            </p>

            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {pains.map((p) => (
                <li key={p.title} className="glass flex items-center gap-4 rounded-2xl p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-500/15 text-red-300"><Icon name={p.icon} className="h-6 w-6" /></span>
                  <span className="text-base font-bold leading-snug sm:text-lg">{p.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Unikal jihatlari + Keyingi bosqich */}
        <section className="bg-paper py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2">
            <div className="card p-6 sm:p-7">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Icon name="spark" className="h-5 w-5 text-brand" /> Unikal jihatlari</h2>
              <ul className="mt-5 space-y-3">
                {uniques.map((u) => (
                  <li key={u.title} className="flex items-start gap-3.5 rounded-2xl p-2">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber/15 text-amber-600"><Icon name={u.icon} className="h-5 w-5" /></span>
                    <div>
                      <p className="font-bold leading-tight">{u.title}</p>
                      <p className="mt-0.5 text-sm leading-snug text-muted">{u.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-navy-950 p-6 text-white sm:p-7">
              <div className="bg-grid absolute inset-0 opacity-50" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber"><Icon name="bolt" className="h-3.5 w-3.5" /> Keyingi bosqich</span>
                <h2 className="mt-4 font-display text-2xl font-semibold">Eng faol bitiruvchilar uchun</h2>
                <ul className="mt-6 space-y-3">
                  {nextStage.map((n) => (
                    <li key={n.text} className="glass flex items-start gap-3.5 rounded-2xl p-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-sky"><Icon name={n.icon} className="h-5 w-5" /></span>
                      <p className="text-[15px] font-semibold leading-snug text-white/90">{n.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sanalar lentasi */}
        <section aria-label="Oqim sanalari" className="relative overflow-hidden bg-amber py-4">
          <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap hover:[animation-play-state:paused]">
            {[0, 1, 2, 3].flatMap((k) =>
              ticker.map((t, i) => (
                <span key={`${k}-${i}`} aria-hidden={k > 0} className="flex items-center gap-2.5 font-display text-lg font-semibold text-navy-950 sm:text-xl">
                  <Icon name={t.icon} className="h-5 w-5" />
                  {t.text}
                  <span className="ml-7 h-2 w-2 rotate-45 bg-navy-950" />
                </span>
              )),
            )}
          </div>
        </section>

        {/* Modullar */}
        <section className="noise relative isolate overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
          <div className="bg-grid absolute inset-0 -z-10 opacity-60" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Eyebrow dark>O‘quv dasturi</Eyebrow>
            <h2 className={h2}>6 ta modul · <span className="text-gradient">{totalDays} kunlik</span> amaliy dastur</h2>

            <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-2.5">
                {modules.map((m, i) => (
                  <details key={m.n} name="modul" open={i === 0} className="group rounded-2xl bg-white/[0.05] ring-1 ring-inset ring-white/10 transition open:bg-white/[0.09] open:ring-white/20">
                    <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.07] font-display text-lg font-semibold text-white/70 transition group-open:bg-amber group-open:text-navy-950">{String(m.n).padStart(2, "0")}</span>
                      <span className="flex-1">
                        <span className="block font-bold leading-snug">{m.title}</span>
                        <span className="mt-0.5 block text-xs font-semibold text-white/45">{m.days} kun · {m.items.length} ta mavzu</span>
                      </span>
                      <Icon name="plus" className="h-5 w-5 shrink-0 text-white/40 transition group-open:rotate-45 group-open:text-amber" />
                    </summary>
                    <div className="px-4 pb-5 sm:pl-20">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky">Ishtirokchi o‘rganadi:</p>
                      <ul className="mt-3 grid gap-2.5">
                        {m.items.map((it) => (
                          <li key={it} className="flex items-start gap-3 text-[15px] leading-snug text-white/85">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber/20 text-amber"><Icon name="check" className="h-3 w-3" /></span>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>

              <div className="rounded-[1.75rem] bg-white p-6 text-ink sm:p-7 lg:sticky lg:top-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><Icon name="calendar" className="h-5 w-5 text-brand" /> Dastur formati</h3>
                <dl className="mt-4 divide-y divide-line">
                  {format.map((f) => (
                    <div key={f.label} className="flex items-center justify-between py-3">
                      <dt className="text-sm text-muted">{f.label}</dt>
                      <dd className="font-display font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                <CtaButton source="kurs-modules" variant="navy" className="mt-5 w-full !py-3.5 text-sm">Dasturga yozilish</CtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* Mentorlar */}
        <section className="overflow-hidden bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Eyebrow>Dastur mentorlari</Eyebrow>
            <h2 className={h2}>TOP CEO <span className="text-gradient-dark">praktik ekspertlari</span>dan o‘rganing</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">Yirik kompaniyalarda TOP lavozimlarda ishlagan, o‘nlab biznesga strategiya tuzgan mutaxassislar.</p>
            <div className="mt-10">
              <MentorCarousel items={orderedMentors} />
            </div>
          </div>
        </section>

        {/* Narx */}
        <section className="bg-paper py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Dastur narxi</Eyebrow>
              <h2 className={h2}>Grant bilan — <span className="text-gradient-dark">{pricing.grantPercent}% arzon</span></h2>
              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">Saralashdan o‘tgan 30 yoshgacha bo‘lgan tadbirkorlarga Yoshlar tadbirkorligini rivojlantirish jamg‘armasi tomonidan {pricing.grantPercent}% grant beriladi.</p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-[0.85fr_1.15fr]">
              <div className="card flex flex-col justify-between p-7 sm:p-8">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted">Dastur narxi</p>
                  <p className="relative mt-4 inline-block font-display text-4xl font-semibold text-ink/40 sm:text-5xl">
                    <span className="num">{formatSum(pricing.full)}</span>
                    <span className="absolute left-0 top-1/2 h-[3px] w-full bg-red-500" />
                  </p>
                  <p className="mt-1 text-sm font-semibold text-muted">so‘m</p>
                </div>
                <div className="mt-8 flex items-center gap-4 rounded-2xl bg-paper p-4">
                  <span className="rounded-xl bg-brand px-3 py-2 font-display text-xl font-bold text-white">{pricing.grantPercent}%</span>
                  <p className="text-sm font-semibold leading-snug">Saralashdan o‘tgan 30 yoshgacha bo‘lgan tadbirkorlarga {pricing.grantPercent}% grant</p>
                </div>
              </div>

              <div className="noise relative overflow-hidden rounded-[1.75rem] bg-navy-900 p-7 text-white shadow-2xl shadow-navy-900/30 sm:p-9">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-400/40 blur-3xl" />
                <div className="absolute -bottom-24 -left-10 h-60 w-60 rounded-full bg-amber/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky">Grant olgan tadbirkorlar uchun</p>
                    <span className="animate-pulse-ring rounded-full bg-amber px-3 py-1 text-xs font-extrabold text-navy-950">−{pricing.grantPercent}%</span>
                  </div>
                  <p className="mt-5 whitespace-nowrap font-display text-[2.5rem] font-bold leading-none sm:text-6xl">
                    <span className="num">{formatSum(pricing.grant)}</span>
                    <span className="ml-2 text-lg font-semibold text-white/60 sm:text-xl">so‘m</span>
                  </p>
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-inset ring-white/10">
                    <Icon name="alert" className="h-5 w-5 shrink-0 text-amber" />
                    <p className="text-sm font-bold">Grantlar soni cheklangan: <span className="text-amber">{pricing.grantsTotal} ta</span></p>
                  </div>
                  <ul className="mt-6 grid gap-2.5 text-sm font-semibold text-white/85 sm:grid-cols-2">
                    {["12 kun oflayn mashg‘ulot", "6 ta modul", "Mentorlar va kuratorlar", "Amaliy keyslar va mashg‘ulotlar"].map((t) => (
                      <li key={t} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-amber" />{t}</li>
                    ))}
                  </ul>
                  <CtaButton source="kurs-pricing" className="mt-8 w-full">Grantga ariza qoldirish</CtaButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Forma */}
        <section id="ariza-forma" className="noise relative isolate overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
          <div className="bg-grid absolute inset-0 -z-10" />
          <div className="absolute -left-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-brand/50 blur-[120px]" />
          <div className="mx-auto max-w-xl px-4 sm:px-6">
            <div className="relative rounded-[2rem] bg-navy-900/90 p-6 ring-1 ring-inset ring-white/15 sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber">
                <Icon name="alert" className="h-3.5 w-3.5" /> Grantlar soni cheklangan: {pricing.grantsTotal} ta
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Grantga ariza qoldiring</h2>
              <p className="mt-2 text-sm text-white/65">Mutaxassisimiz bog‘lanib, saralash va {pricing.grantPercent}% grant shartlarini tushuntiradi. 1 daqiqadan kam vaqt oladi.</p>
              <div className="mt-6">
                <LeadForm variant="dark" source="kurs" short />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
