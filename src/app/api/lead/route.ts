import { NextResponse, type NextRequest } from "next/server";
import { leadSchema } from "@/lib/validation";
import { createAmoLead } from "@/lib/server/amocrm";
import { randomId, sha256 } from "@/lib/server/crypto";
import { sendCapi } from "@/lib/server/meta-capi";
import { clientIp, sameOrigin } from "@/lib/server/request";
import { rateLimit, saveLead, sealPII, setOnce, updateLead, type Lead } from "@/lib/server/store";
import { notifyNewLead } from "@/lib/server/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

export async function POST(req: NextRequest) {
  try {
    return await handle(req);
  } catch (e) {
    console.error("[lead] kutilmagan xato:", (e as Error).stack || e);
    return json({ ok: false, error: "Serverda xatolik. Iltimos, birozdan so‘ng qayta urinib ko‘ring." }, 500);
  }
}

async function handle(req: NextRequest) {
  // 1. CSRF: faqat o‘z saytimizdan
  if (!sameOrigin(req)) return json({ ok: false, error: "forbidden" }, 403);

  // 2. Hajm cheklovi
  const len = Number(req.headers.get("content-length") || 0);
  if (len > 8192) return json({ ok: false, error: "too_large" }, 413);

  // 3. Rate limit (IP bo‘yicha)
  const ip = clientIp(req);
  const ipKey = sha256(ip || "unknown").slice(0, 32);
  if (!(await rateLimit(`lead:${ipKey}`, 5, 600))) {
    return json({ ok: false, error: "Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring." }, 429);
  }

  let body: unknown;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    // Honeypot to‘ldirilgan bo‘lsa — botga "muvaffaqiyat" qaytaramiz, lekin hech narsa saqlamaymiz
    if (fieldErrors.website) return json({ ok: true });
    return json({ ok: false, error: "validation", fieldErrors }, 422);
  }
  const d = parsed.data;

  // 4. Bot himoyasi: forma juda tez to‘ldirilgan bo‘lsa (3 soniyadan kam)
  const elapsed = Date.now() - d.startedAt;
  if (elapsed < 3000 || elapsed > 1000 * 60 * 60 * 24) return json({ ok: true });

  // 5. Takroriy arizalar (24 soat ichida bir xil raqam) — CRMni ifloslantirmaymiz
  const phoneHash = sha256(d.phone);
  const id = randomId(12);
  // Saqlash ishlamasa ham lid yo‘qolmasin — takror tekshiruvini o‘tkazib yuboramiz
  const isNew = await setOnce(`dup:${phoneHash}`, id, 60 * 60 * 24).catch((e) => {
    console.error("[lead] takror tekshiruvi ishlamadi:", (e as Error).message);
    return true;
  });
  if (!isNew) return json({ ok: true, duplicate: true });

  const ua = (req.headers.get("user-agent") || "").slice(0, 400);
  let fbc = d.fbc;
  if (!fbc && d.pageUrl) {
    try {
      const fbclid = new URL(d.pageUrl).searchParams.get("fbclid");
      if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    } catch {}
  }

  const lead: Lead = {
    id,
    createdAt: Date.now(),
    status: "new",
    phoneHash,
    pii: "",
    utm: d.utm,
    meta: { fbp: d.fbp, fbc, eventSourceUrl: d.pageUrl, leadEventId: d.eventId },
  };
  // Saqlash (shifrlash + baza) xato bersa ham Telegram/amoCRM/Metaga baribir yuboramiz
  let stored = false;
  try {
    lead.pii = sealPII({ name: d.name, phone: d.phone, region: d.region, ip, ua });
    await saveLead(lead);
    stored = true;
  } catch (e) {
    console.error("[lead] saqlanmadi (UPSTASH_* va DATA_ENCRYPTION_KEY ni tekshiring):", (e as Error).message);
  }

  // 6. Integratsiyalar (parallel): Meta CAPI ‖ amoCRM → Telegram
  const capiTask = sendCapi({
    name: "Lead",
    eventId: d.eventId, // Pixel bilan bir xil — deduplikatsiya
    sourceUrl: d.pageUrl,
    user: { name: d.name, phone: d.phone, region: d.region, externalId: id, ip, ua, fbp: d.fbp, fbc },
  });

  const crmTask = (async () => {
    let amoLeadId: number | null = null;
    try {
      amoLeadId = await createAmoLead({ name: d.name, phone: d.phone, region: d.region, utm: d.utm, pageUrl: d.pageUrl, siteLeadId: id });
    } catch (e) {
      console.error("[amoCRM] lid yaratilmadi:", (e as Error).message);
    }
    const withAmo = amoLeadId ? { ...lead, amoLeadId } : lead;
    const tgMsgs = await notifyNewLead(withAmo, { name: d.name, phone: d.phone, region: d.region });
    if (!stored) return;
    await updateLead(id, (l) => {
      if (amoLeadId) l.amoLeadId = amoLeadId;
      if (tgMsgs.length) l.tg = tgMsgs;
    }).catch((e) => console.error("[lead] yangilanmadi:", (e as Error).message));
  })();

  await Promise.allSettled([capiTask, crmTask]);
  return json({ ok: true });
}

export function GET() {
  return json({ ok: false }, 405);
}
