import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/server/admin-auth";
import { env, has } from "@/lib/server/env";
import { listLeads, openPII } from "@/lib/server/store";
import AdminTable, { type AdminLead } from "./AdminTable";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const leads = await listLeads(500);
  const rows: AdminLead[] = leads.map((l) => {
    let pii: Pick<AdminLead, "name" | "phone" | "region" | "age" | "employees" | "turnover"> = { name: "—", phone: "—", region: "—" };
    try {
      const p = openPII(l);
      pii = { name: p.name, phone: p.phone, region: p.region, age: p.age, employees: p.employees, turnover: p.turnover };
    } catch {}
    return {
      id: l.id,
      createdAt: l.createdAt,
      status: l.status,
      ...pii,
      source: l.utm?.utm_source || "",
      campaign: l.utm?.utm_campaign || "",
      form: l.utm?.form || "",
      amoLeadId: l.amoLeadId,
      purchase: l.purchase ? { valueUzs: l.purchase.valueUzs, plan: l.purchase.plan, source: l.purchase.source, capiOk: l.purchase.capiOk, at: l.purchase.at } : undefined,
    };
  });

  const integrations = [
    { name: "Meta Pixel + CAPI", ok: has.capi(), note: env.capiTestCode ? "TEST rejimi" : "" },
    { name: "amoCRM", ok: has.amo(), note: "" },
    { name: "Telegram bot", ok: has.tg(), note: has.tg() ? `${env.tgChatIds.length} ta chat` : "" },
    { name: "Saqlash", ok: true, note: has.upstash() ? "Upstash Redis" : "Fayl (data/leads.json)" },
    { name: "Shifrlash kaliti", ok: Boolean(env.encryptionKey), note: env.encryptionKey ? "AES-256-GCM" : "DATA_ENCRYPTION_KEY yo‘q!" },
  ];

  return <AdminTable rows={rows} integrations={integrations} prices={{ grant: env.priceGrant, full: env.priceFull }} />;
}
