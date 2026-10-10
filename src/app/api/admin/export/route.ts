import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/admin-auth";
import { listLeads, openPII } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s) && !/^\+\d{7,15}$/.test(s)) s = "'" + s; // CSV formula injection himoyasi (telefon raqamlardan tashqari)
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const leads = await listLeads(5000);
  const rows = [["Sana", "Ism", "Telefon", "Manzil", "Holat", "Xarid (so‘m)", "amoCRM ID", "utm_source", "utm_campaign"]];
  for (const l of leads) {
    const p = openPII(l);
    rows.push([
      new Date(l.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" }),
      p.name, p.phone, p.region, l.status,
      String(l.purchase?.valueUzs ?? ""), String(l.amoLeadId ?? ""),
      l.utm?.utm_source ?? "", l.utm?.utm_campaign ?? "",
    ]);
  }
  const csv = "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lidlar-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
