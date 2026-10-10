import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/server/admin-auth";
import { env, has } from "@/lib/server/env";
import { sameOrigin } from "@/lib/server/request";
import { tg } from "@/lib/server/telegram";

export const runtime = "nodejs";

/** Admin paneldan bir marta bosiladi: Telegram webhook’ni maxfiy token bilan o‘rnatadi */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req) || !(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  if (!env.tgToken || !env.tgWebhookSecret) return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN / TELEGRAM_WEBHOOK_SECRET yo‘q" }, { status: 400 });
  const r = await tg("setWebhook", {
    url: `${env.siteUrl.replace(/\/+$/, "")}/api/telegram/webhook`,
    secret_token: env.tgWebhookSecret,
    allowed_updates: ["callback_query", "message"],
    drop_pending_updates: true,
  });
  return NextResponse.json({ ok: Boolean(r), chats: has.tg() ? env.tgChatIds.length : 0 });
}
