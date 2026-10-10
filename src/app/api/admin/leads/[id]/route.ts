import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/server/admin-auth";
import { sendCapi } from "@/lib/server/meta-capi";
import { markPurchased, setLeadStatus } from "@/lib/server/purchase";
import { sameOrigin } from "@/lib/server/request";
import { getLead, openPII, updateLead } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("purchase"), plan: z.enum(["grant", "full", "custom"]), valueUzs: z.number().int().min(0).max(1_000_000_000).optional() }),
  z.object({ action: z.literal("status"), status: z.enum(["new", "contacted", "rejected"]) }),
  z.object({ action: z.literal("resend") }),
]);

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req) || !(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  const body = parsed.data;

  if (body.action === "purchase") {
    const r = await markPurchased(id, body.plan, "admin", body.valueUzs);
    if (!r.ok) return NextResponse.json({ ok: false, error: r.reason }, { status: r.reason === "not_found" ? 404 : 409 });
    return NextResponse.json({ ok: true, capiOk: r.capiOk });
  }

  if (body.action === "status") {
    const l = await setLeadStatus(id, body.status);
    return NextResponse.json({ ok: Boolean(l) }, { status: l ? 200 : 404 });
  }

  // Purchase’ni qayta yuborish (avvalgi urinish xato bo‘lgan bo‘lsa). event_id bir xil — Meta dublikat qilmaydi.
  const lead = await getLead(id);
  if (!lead?.purchase) return NextResponse.json({ ok: false, error: "no_purchase" }, { status: 400 });
  const pii = openPII(lead);
  const r = await sendCapi({
    name: "Purchase",
    eventId: lead.purchase.eventId,
    valueUzs: lead.purchase.valueUzs,
    sourceUrl: lead.meta.eventSourceUrl,
    user: { name: pii.name, phone: pii.phone, region: pii.region, externalId: id, ip: pii.ip, ua: pii.ua, fbp: lead.meta.fbp, fbc: lead.meta.fbc },
  });
  if (r.ok) await updateLead(id, (l) => { if (l.purchase) l.purchase.capiOk = true; });
  return NextResponse.json({ ok: r.ok, capiOk: r.ok });
}
