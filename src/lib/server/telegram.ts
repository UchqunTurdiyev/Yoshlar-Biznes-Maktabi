import "server-only";
import { env, has } from "./env";
import type { Lead, LeadPII } from "./store";
import { formatSum } from "../content";

const api = (method: string) => `https://api.telegram.org/bot${env.tgToken}/${method}`;

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(api(method), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = (await res.json()) as {
      ok: boolean;
      result?: T;
      description?: string;
      parameters?: { migrate_to_chat_id?: number };
    };
    // Guruh supergroupga aylansa chat ID o‘zgaradi — lid yo‘qolmasin, yangi ID ga qayta yuboramiz
    const migrated = json.parameters?.migrate_to_chat_id;
    if (!json.ok && migrated && body.chat_id !== migrated) {
      console.error(`[TG] chat ${body.chat_id} supergroupga aylangan → TELEGRAM_CHAT_IDS ni ${migrated} ga almashtiring`);
      return tg<T>(method, { ...body, chat_id: migrated });
    }
    if (!json.ok) {
      console.error(`[TG] ${method} xato:`, json.description);
      return null;
    }
    return json.result ?? null;
  } catch (e) {
    console.error(`[TG] ${method} tarmoq xatosi`, (e as Error).message);
    return null;
  }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const STATUS_LABEL: Record<Lead["status"], string> = {
  new: "🆕 Yangi",
  contacted: "📞 Bog‘lanildi",
  purchased: "✅ Sotib oldi",
  rejected: "❌ Rad etildi",
};

export function leadText(lead: Lead, pii: LeadPII) {
  const utm = lead.utm && Object.keys(lead.utm).length
    ? "\n\n<b>UTM:</b>\n" + Object.entries(lead.utm).map(([k, v]) => `• ${esc(k)}: ${esc(v)}`).join("\n")
    : "";
  const date = new Date(lead.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" });
  let purchase = "";
  if (lead.purchase) {
    purchase = `\n\n💰 <b>Xarid:</b> ${formatSum(lead.purchase.valueUzs)} so‘m (${lead.purchase.plan === "grant" ? "grant bilan" : lead.purchase.plan === "full" ? "to‘liq narx" : "boshqa"})\nMeta CAPI: ${lead.purchase.capiOk ? "yuborildi ✅" : "yuborilmadi ⚠️"}`;
  }
  return [
    "🎓 <b>Yoshlar Biznes Maktabi — yangi ariza</b>",
    "",
    `👤 <b>Ism:</b> ${esc(pii.name)}`,
    `📱 <b>Telefon:</b> <code>${esc(pii.phone)}</code>`,
    `📍 <b>Manzil:</b> ${esc(pii.region)}`,
    pii.age != null ? `🎂 <b>Yoshi:</b> ${pii.age}` : "",
    pii.employees != null ? `👥 <b>Xodimlar soni:</b> ${pii.employees}` : "",
    pii.turnover ? `💵 <b>Aylanma:</b> ${esc(pii.turnover)}` : "",
    `🕒 ${date}`,
    `🔖 Holat: <b>${STATUS_LABEL[lead.status]}</b>`,
    lead.amoLeadId ? `🗂 amoCRM: #${lead.amoLeadId}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n") + utm + purchase;
}

export function leadKeyboard(lead: Lead) {
  if (lead.status === "purchased") return { inline_keyboard: [] };
  return {
    inline_keyboard: [
      [
        { text: `✅ Sotib oldi (grant · ${formatSum(env.priceGrant)})`, callback_data: `p:g:${lead.id}` },
      ],
      [
        { text: `✅ Sotib oldi (to‘liq · ${formatSum(env.priceFull)})`, callback_data: `p:f:${lead.id}` },
      ],
      [
        { text: "📞 Bog‘lanildi", callback_data: `s:c:${lead.id}` },
        { text: "❌ Rad etildi", callback_data: `s:r:${lead.id}` },
      ],
    ],
  };
}

export function confirmKeyboard(plan: "g" | "f", id: string) {
  return {
    inline_keyboard: [
      [{ text: "✔️ Ha, tasdiqlayman — Metaga Purchase yuborish", callback_data: `pc:${plan}:${id}` }],
      [{ text: "↩️ Ortga", callback_data: `b:x:${id}` }],
    ],
  };
}

export async function notifyNewLead(lead: Lead, pii: LeadPII) {
  if (!has.tg()) return [];
  const sent: { chatId: string; messageId: number }[] = [];
  await Promise.all(
    env.tgChatIds.map(async (chatId) => {
      const r = await tg<{ message_id: number }>("sendMessage", {
        chat_id: chatId,
        text: leadText(lead, pii),
        parse_mode: "HTML",
        reply_markup: leadKeyboard(lead),
        disable_web_page_preview: true,
      });
      if (r) sent.push({ chatId, messageId: r.message_id });
    }),
  );
  return sent;
}

/** Barcha adminlardagi xabarni yangilaydi (holat o‘zgarganda) */
export async function refreshLeadMessages(lead: Lead, pii: LeadPII) {
  if (!has.tg() || !lead.tg?.length) return;
  await Promise.all(
    lead.tg.map((m) =>
      tg("editMessageText", {
        chat_id: m.chatId,
        message_id: m.messageId,
        text: leadText(lead, pii),
        parse_mode: "HTML",
        reply_markup: leadKeyboard(lead),
        disable_web_page_preview: true,
      }),
    ),
  );
}
