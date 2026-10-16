"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type AdminLead = {
  id: string;
  createdAt: number;
  status: "new" | "contacted" | "purchased" | "rejected";
  name: string;
  phone: string;
  region: string;
  age?: number;
  employees?: number;
  turnover?: string;
  source: string;
  campaign: string;
  form: string;
  amoLeadId?: number;
  purchase?: { valueUzs: number; plan: string; source: string; capiOk: boolean; at: number };
};

const STATUS: Record<AdminLead["status"], { label: string; cls: string }> = {
  new: { label: "Yangi", cls: "bg-sky-100 text-sky-700" },
  contacted: { label: "Bog‘lanildi", cls: "bg-amber-100 text-amber-700" },
  purchased: { label: "Sotib oldi", cls: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rad etildi", cls: "bg-zinc-200 text-zinc-600" },
};

const sum = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ");

export default function AdminTable({ rows, integrations, prices }: { rows: AdminLead[]; integrations: { name: string; ok: boolean; note: string }[]; prices: { grant: number; full: number } }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | AdminLead["status"]>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [buy, setBuy] = useState<AdminLead | null>(null);
  const [plan, setPlan] = useState<"grant" | "full" | "custom">("grant");
  const [custom, setCustom] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => (filter === "all" || r.status === filter) && (!s || `${r.name} ${r.phone} ${r.region} ${r.source}`.toLowerCase().includes(s)));
  }, [rows, q, filter]);

  const stats = useMemo(() => {
    const purchased = rows.filter((r) => r.purchase);
    return {
      total: rows.length,
      fresh: rows.filter((r) => r.status === "new").length,
      purchased: purchased.length,
      revenue: purchased.reduce((s, r) => s + (r.purchase?.valueUzs || 0), 0),
      cr: rows.length ? ((purchased.length / rows.length) * 100).toFixed(1) : "0",
    };
  }, [rows]);

  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 3500);
  };

  async function act(id: string, body: Record<string, unknown>) {
    setBusy(id);
    const res = await fetch(`/api/admin/leads/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.status === 401) return router.push("/admin/login");
    if (body.action === "purchase" || body.action === "resend") {
      flash(data.ok ? (data.capiOk ? "✅ Purchase Metaga yuborildi" : "⚠️ Belgilandi, lekin Meta CAPI xato qaytardi") : `Xato: ${data.error || res.status}`);
    } else flash(data.ok ? "Holat yangilandi" : "Xato");
    router.refresh();
  }

  async function setupTg() {
    const res = await fetch("/api/telegram/setup", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    flash(data.ok ? "✅ Telegram webhook o‘rnatildi" : `Xato: ${data.error || res.status}`);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-dvh bg-paper px-4 py-8 text-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Lidlar paneli</h1>
            <p className="text-sm text-muted">Yoshlar Biznes Maktabi</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/api/admin/export" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold ring-1 ring-line hover:bg-zinc-50">CSV yuklab olish</a>
            <button onClick={setupTg} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold ring-1 ring-line hover:bg-zinc-50">Telegram webhookni o‘rnatish</button>
            <button onClick={logout} className="rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-bold text-white">Chiqish</button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {integrations.map((i) => (
            <span key={i.name} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${i.ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
              <span className={`h-2 w-2 rounded-full ${i.ok ? "bg-emerald-500" : "bg-red-500"}`} />
              {i.name}{i.note && ` · ${i.note}`}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["Jami lidlar", stats.total],
            ["Yangi", stats.fresh],
            ["Sotib olgan", stats.purchased],
            ["Konversiya", `${stats.cr}%`],
            ["Tushum (so‘m)", sum(stats.revenue)],
          ].map(([l, v]) => (
            <div key={String(l)} className="card p-4">
              <p className="text-xs font-semibold text-muted">{l}</p>
              <p className="num mt-1 font-display text-xl font-semibold">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ism, telefon, viloyat yoki manba bo‘yicha qidirish…" className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 outline-none focus:border-brand" />
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-white p-1 ring-1 ring-line">
            {(["all", "new", "contacted", "purchased", "rejected"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-bold ${filter === f ? "bg-navy-900 text-white" : "text-muted hover:bg-paper"}`}>
                {f === "all" ? "Hammasi" : STATUS[f].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3">Mijoz</th>
                <th className="px-4 py-3">Manzil</th>
                <th className="px-4 py-3">Biznes</th>
                <th className="px-4 py-3">Manba</th>
                <th className="px-4 py-3">Holat</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((r) => (
                <tr key={r.id} className="align-top hover:bg-paper/60">
                  <td className="num whitespace-nowrap px-4 py-3 text-muted">{new Date(r.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent", dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold">{r.name}</p>
                    <a href={`tel:${r.phone}`} className="num text-brand">{r.phone}</a>
                    {r.amoLeadId && <p className="text-xs text-muted">amoCRM #{r.amoLeadId}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {r.region}
                    {r.age != null && <p className="text-xs text-muted">{r.age} yosh</p>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {r.employees != null ? <p>{r.employees} xodim</p> : <p className="text-muted">—</p>}
                    {r.turnover && <p className="text-muted">{r.turnover}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {r.source || "to‘g‘ridan-to‘g‘ri"}{r.campaign && <><br />{r.campaign}</>}{r.form && <><br />forma: {r.form}</>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS[r.status].cls}`}>{STATUS[r.status].label}</span>
                    {r.purchase && (
                      <p className="mt-1.5 text-xs text-muted">
                        {sum(r.purchase.valueUzs)} so‘m · {r.purchase.source}
                        <br />
                        CAPI: {r.purchase.capiOk ? "✅" : "⚠️ yuborilmadi"}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {!r.purchase ? (
                        <>
                          <button disabled={busy === r.id} onClick={() => { setBuy(r); setPlan("grant"); setCustom(""); }} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">Sotib oldi</button>
                          {r.status !== "contacted" && <button disabled={busy === r.id} onClick={() => act(r.id, { action: "status", status: "contacted" })} className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">Bog‘lanildi</button>}
                          {r.status !== "rejected" && <button disabled={busy === r.id} onClick={() => act(r.id, { action: "status", status: "rejected" })} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700">Rad</button>}
                        </>
                      ) : (
                        !r.purchase.capiOk && <button disabled={busy === r.id} onClick={() => act(r.id, { action: "resend" })} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white">CAPI qayta yuborish</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!list.length && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted">Lidlar topilmadi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {buy && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 p-4" onClick={() => setBuy(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold">Xaridni tasdiqlash</h3>
            <p className="mt-1 text-sm text-muted">{buy.name} · {buy.phone}</p>
            <div className="mt-5 space-y-2">
              {([
                ["grant", `Grant bilan — ${sum(prices.grant)} so‘m`],
                ["full", `To‘liq narx — ${sum(prices.full)} so‘m`],
                ["custom", "Boshqa summa"],
              ] as const).map(([v, l]) => (
                <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold ${plan === v ? "border-brand bg-brand/5" : "border-line"}`}>
                  <input type="radio" name="plan" checked={plan === v} onChange={() => setPlan(v)} className="accent-brand" /> {l}
                </label>
              ))}
              {plan === "custom" && (
                <input inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))} placeholder="Summa (so‘m)" className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand" />
              )}
            </div>
            <p className="mt-4 text-xs text-muted">Tasdiqlangach Metaga <b>Purchase</b> hodisasi (xeshlangan ma’lumotlar bilan) yuboriladi. Bu amalni bir marta bajarish mumkin.</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setBuy(null)} className="flex-1 rounded-xl bg-paper py-3 text-sm font-bold">Bekor</button>
              <button
                disabled={plan === "custom" && !Number(custom)}
                onClick={() => { const b = buy; setBuy(null); act(b.id, { action: "purchase", plan, ...(plan === "custom" ? { valueUzs: Number(custom) } : {}) }); }}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-navy-900 px-5 py-3 text-sm font-bold text-white shadow-2xl">{toast}</div>}
    </main>
  );
}
