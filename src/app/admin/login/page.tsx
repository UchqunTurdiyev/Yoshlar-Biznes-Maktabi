"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      window.location.href = "/admin";
      return;
    }
    setError(data.error || "Xatolik");
    setLoading(false);
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-navy-950 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-navy-900 p-8 text-white ring-1 ring-white/10">
        <h1 className="font-display text-xl font-semibold">Admin panel</h1>
        <p className="mt-1 text-sm text-white/50">Yoshlar Biznes Maktabi — lidlar</p>
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parol" className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 outline-none focus:border-amber" />
        {error && <p className="mt-3 text-sm font-semibold text-red-400">{error}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-2xl bg-amber py-3.5 font-extrabold text-navy-950 disabled:opacity-70">{loading ? "Tekshirilmoqda…" : "Kirish"}</button>
      </form>
    </main>
  );
}
