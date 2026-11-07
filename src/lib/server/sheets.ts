import "server-only";
import { env, has } from "./env";

export type SheetLead = {
  id: string;
  createdAt: number;
  name: string;
  phone: string;
  region: string;
  age?: number;
  employees?: number;
  turnover?: string;
  utm?: Record<string, string>;
  pageUrl?: string;
  amoLeadId?: number | null;
};

/** Lidni Google Apps Script (doPost) orqali Google Sheetga qo‘shadi. Xato bo‘lsa lidni to‘xtatmaydi. */
export async function appendLeadToSheet(l: SheetLead): Promise<boolean> {
  if (!has.sheets()) return false;
  const utm = l.utm || {};
  const payload = {
    secret: env.sheetsSecret || undefined,
    id: l.id,
    date: new Date(l.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" }),
    name: l.name,
    phone: l.phone,
    region: l.region,
    age: l.age ?? "",
    employees: l.employees ?? "",
    turnover: l.turnover ?? "",
    utm_source: utm.utm_source ?? "",
    utm_medium: utm.utm_medium ?? "",
    utm_campaign: utm.utm_campaign ?? "",
    utm_content: utm.utm_content ?? "",
    utm_term: utm.utm_term ?? "",
    pageUrl: l.pageUrl ?? "",
    amoLeadId: l.amoLeadId ?? "",
  };
  try {
    const res = await fetch(env.sheetsUrl, {
      method: "POST",
      // text/plain — Apps Script e.postData.contents da JSON sifatida o‘qiydi
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const text = await res.text();
    if (!res.ok || /"ok"\s*:\s*false/.test(text)) {
      console.error(`[Sheets] xato ${res.status}:`, text.slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[Sheets] tarmoq xatosi:", (e as Error).message);
    return false;
  }
}
