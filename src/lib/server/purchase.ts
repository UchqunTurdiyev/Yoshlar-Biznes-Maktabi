import "server-only";
import { env } from "./env";
import { sendCapi } from "./meta-capi";
import { getLead, openPII, setOnce, updateLead, type Lead, type LeadStatus } from "./store";
import { refreshLeadMessages } from "./telegram";

type Plan = "grant" | "full" | "custom";
type Source = "admin" | "telegram" | "amocrm";

export type PurchaseResult =
  | { ok: true; lead: Lead; capiOk: boolean }
  | { ok: false; reason: "not_found" | "already" };

/**
 * Sotib olgan mijozni belgilaydi va Metaga Purchase hodisasini yuboradi.
 * Idempotent: bitta lid uchun Purchase faqat bir marta yuboriladi (event_id = purchase_<id>).
 */
export async function markPurchased(id: string, plan: Plan, source: Source, customUzs?: number): Promise<PurchaseResult> {
  const lead = await getLead(id);
  if (!lead) return { ok: false, reason: "not_found" };
  if (lead.purchase) return { ok: false, reason: "already" };

  const first = await setOnce(`purchase:${id}`, String(Date.now()), 60 * 60 * 24 * 365);
  if (!first) return { ok: false, reason: "already" };

  const valueUzs =
    plan === "full" ? env.priceFull : plan === "grant" ? env.priceGrant : Math.max(0, Math.round(customUzs || env.priceGrant));
  const pii = openPII(lead);
  const eventId = `purchase_${id}`;

  const capi = await sendCapi({
    name: "Purchase",
    eventId,
    valueUzs,
    sourceUrl: lead.meta.eventSourceUrl,
    contentName: plan === "full" ? "Yoshlar Biznes Maktabi — to‘liq narx" : "Yoshlar Biznes Maktabi — grant bilan",
    user: {
      name: pii.name,
      phone: pii.phone,
      region: pii.region,
      externalId: id,
      ip: pii.ip,
      ua: pii.ua,
      fbp: lead.meta.fbp,
      fbc: lead.meta.fbc,
    },
  });

  const updated = await updateLead(id, (l) => {
    l.status = "purchased";
    l.purchase = { at: Date.now(), valueUzs, plan, source, eventId, capiOk: capi.ok };
  });
  if (updated) await refreshLeadMessages(updated, pii);
  return { ok: true, lead: updated!, capiOk: capi.ok };
}

export async function setLeadStatus(id: string, status: Exclude<LeadStatus, "purchased">) {
  const updated = await updateLead(id, (l) => {
    if (l.status !== "purchased") l.status = status;
  });
  if (updated) await refreshLeadMessages(updated, openPII(updated));
  return updated;
}

/** Saytda bo‘lmagan (to‘g‘ridan-to‘g‘ri amoCRM’ga tushgan) mijoz uchun Purchase */
export async function purchaseFromAmoOnly(amoLeadId: number, data: { name?: string; phone?: string; priceUzs?: number }) {
  const first = await setOnce(`purchase:amo:${amoLeadId}`, String(Date.now()), 60 * 60 * 24 * 365);
  if (!first) return { ok: false as const, reason: "already" as const };
  const res = await sendCapi({
    name: "Purchase",
    eventId: `purchase_amo_${amoLeadId}`,
    valueUzs: data.priceUzs && data.priceUzs > 0 ? data.priceUzs : env.priceGrant,
    user: { name: data.name, phone: data.phone, externalId: `amo_${amoLeadId}` },
  });
  return { ok: true as const, capiOk: res.ok };
}
