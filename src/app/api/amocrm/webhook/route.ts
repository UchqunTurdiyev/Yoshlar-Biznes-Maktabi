import { NextResponse, type NextRequest } from "next/server";
import { fetchAmoLeadContact } from "@/lib/server/amocrm";
import { safeEqual } from "@/lib/server/crypto";
import { env } from "@/lib/server/env";
import { markPurchased, purchaseFromAmoOnly } from "@/lib/server/purchase";
import { findLeadByAmoId } from "@/lib/server/store";
import { normalizeUzPhone } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * amoCRM webhook: Sozlamalar → Integratsiyalar → Web hooks
 * URL: https://SAYT/api/amocrm/webhook?secret=AMO_WEBHOOK_SECRET
 * Hodisa: "Статус сделки изменен" (lid holati o‘zgardi)
 * Lid AMO_PURCHASE_STATUS_IDS dagi bosqichga o‘tganda (standart: 142 — "Успешно реализовано")
 * Metaga Purchase hodisasi yuboriladi.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") || "";
  if (!env.amoWebhookSecret || !safeEqual(secret, env.amoWebhookSecret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const raw = await req.text();
  if (raw.length > 200_000) return NextResponse.json({ ok: false }, { status: 413 });
  const form = new URLSearchParams(raw);

  // leads[status][0][id], leads[status][0][status_id], leads[status][0][price] ...
  const events: { id: number; statusId: number; price?: number }[] = [];
  for (const group of ["status", "update", "add"]) {
    for (let i = 0; i < 50; i++) {
      const id = Number(form.get(`leads[${group}][${i}][id]`));
      if (!id) break;
      events.push({
        id,
        statusId: Number(form.get(`leads[${group}][${i}][status_id]`)),
        price: Number(form.get(`leads[${group}][${i}][price]`)) || undefined,
      });
    }
  }

  const results: unknown[] = [];
  for (const ev of events) {
    if (!env.amoPurchaseStatusIds.includes(ev.statusId)) continue;
    const local = await findLeadByAmoId(ev.id);
    if (local) {
      const plan = ev.price && ev.price >= env.priceFull ? "full" : ev.price && ev.price !== env.priceGrant ? "custom" : "grant";
      results.push(await markPurchased(local.id, plan, "amocrm", ev.price));
    } else {
      // Saytdan kelmagan lid — kontakt ma’lumotini amoCRM’dan olib yuboramiz
      try {
        const c = await fetchAmoLeadContact(ev.id);
        const phone = c?.phone ? normalizeUzPhone(c.phone) || c.phone : undefined;
        results.push(await purchaseFromAmoOnly(ev.id, { name: c?.name, phone, priceUzs: ev.price || c?.price }));
      } catch (e) {
        console.error("[amoCRM webhook]", (e as Error).message);
      }
    }
  }
  return NextResponse.json({ ok: true, processed: results.length });
}
