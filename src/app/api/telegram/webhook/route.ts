import { NextResponse, type NextRequest } from "next/server";
import { safeEqual } from "@/lib/server/crypto";
import { env } from "@/lib/server/env";
import { markPurchased, setLeadStatus } from "@/lib/server/purchase";
import { getLead } from "@/lib/server/store";
import { confirmKeyboard, leadKeyboard, tg } from "@/lib/server/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Update = {
  callback_query?: {
    id: string;
    data?: string;
    from: { id: number; first_name?: string };
    message?: { message_id: number; chat: { id: number } };
  };
  message?: { chat: { id: number }; text?: string };
};

export async function POST(req: NextRequest) {
  // Telegram yuborgan maxfiy token tekshiruvi (setWebhook secret_token)
  const secret = req.headers.get("x-telegram-bot-api-secret-token") || "";
  if (!env.tgWebhookSecret || !safeEqual(secret, env.tgWebhookSecret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = (await req.json().catch(() => null)) as Update | null;
  if (!update) return NextResponse.json({ ok: true });

  // /start yoki /id — chat ID ni bilib olish uchun
  if (update.message?.text && /^\/(start|id)/.test(update.message.text)) {
    await tg("sendMessage", {
      chat_id: update.message.chat.id,
      text: `Chat ID: ${update.message.chat.id}\nUshbu ID ni TELEGRAM_CHAT_IDS ga qo‘shing.`,
    });
    return NextResponse.json({ ok: true });
  }

  const cq = update.callback_query;
  if (!cq?.data || !cq.message) return NextResponse.json({ ok: true });

  // Faqat ruxsat etilgan chatlardan kelgan tugmalar ishlaydi
  const chatId = String(cq.message.chat.id);
  if (!env.tgChatIds.includes(chatId)) {
    await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Ruxsat yo‘q", show_alert: true });
    return NextResponse.json({ ok: true });
  }

  const [action, arg, id] = cq.data.split(":");
  const lead = id ? await getLead(id) : null;
  if (!lead) {
    await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Lid topilmadi", show_alert: true });
    return NextResponse.json({ ok: true });
  }

  const editMarkup = (markup: unknown) =>
    tg("editMessageReplyMarkup", { chat_id: chatId, message_id: cq.message!.message_id, reply_markup: markup });

  switch (action) {
    case "p": // xaridni tasdiqlash so‘rovi
      if (lead.purchase) {
        await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Bu mijoz allaqachon sotib olgan deb belgilangan" });
        break;
      }
      await editMarkup(confirmKeyboard(arg === "f" ? "f" : "g", id));
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Tasdiqlang" });
      break;
    case "pc": {
      const r = await markPurchased(id, arg === "f" ? "full" : "grant", "telegram");
      const text = r.ok
        ? r.capiOk
          ? "✅ Sotib oldi. Purchase Metaga yuborildi."
          : "✅ Belgilandi, lekin Metaga yuborishda xato (admin panelda qayta yuboring)."
        : "Bu mijoz allaqachon belgilangan.";
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text, show_alert: true });
      break;
    }
    case "b":
      await editMarkup(leadKeyboard(lead));
      await tg("answerCallbackQuery", { callback_query_id: cq.id });
      break;
    case "s":
      await setLeadStatus(id, arg === "r" ? "rejected" : "contacted");
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Holat yangilandi" });
      break;
    default:
      await tg("answerCallbackQuery", { callback_query_id: cq.id });
  }
  return NextResponse.json({ ok: true });
}
