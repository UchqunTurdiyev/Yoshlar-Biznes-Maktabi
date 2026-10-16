import "server-only";
import { env, has } from "./env";

/**
 * amoCRM (Kommo) integratsiyasi — uzoq muddatli token (long-lived token) orqali.
 * amoCRM → Sozlamalar → Integratsiyalar → "Создать интеграцию" → "Долгосрочный токен".
 */

async function amo<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.amoBaseUrl}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${env.amoToken}`, "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!res.ok) throw new Error(`amoCRM ${res.status}: ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * Saytdagi viloyat → amoCRM "Viloyati:" (select) maydonidagi variant nomi.
 * Select maydonga ro‘yxatda yo‘q qiymat yuborilsa amoCRM butun so‘rovni rad etadi,
 * shuning uchun mos variant bo‘lmasa maydon to‘ldirilmaydi (viloyat baribir izohga yoziladi).
 */
const AMO_REGION: Record<string, string> = {
  "Toshkent shahri": "Toshkent SH",
  "Toshkent viloyati": "Toshkent V",
  Andijon: "Andijon",
  Buxoro: "Buxoro",
  "Farg‘ona": "Farg'ona",
  Jizzax: "Jizzax",
  Namangan: "Namangan",
  Navoiy: "Navoiy",
  Qashqadaryo: "Qashqadaryo",
  Samarqand: "Samarqand",
  Sirdaryo: "Sirdaryo",
  Surxondaryo: "Surxandaryo",
};

export type AmoLeadInput = {
  name: string;
  phone: string;
  region: string;
  age?: number;
  employees?: number;
  turnover?: string;
  utm?: Record<string, string>;
  pageUrl?: string;
  siteLeadId: string;
};

export async function createAmoLead(input: AmoLeadInput): Promise<number | null> {
  if (!has.amo()) return null;

  const leadFields: unknown[] = [];
  const amoRegion = AMO_REGION[input.region];
  if (env.amoRegionFieldId && amoRegion) leadFields.push({ field_id: env.amoRegionFieldId, values: [{ value: amoRegion }] });

  const payload = [
    {
      name: `Sayt: ${input.name} — Yoshlar Biznes Maktabi`,
      price: env.priceGrant,
      ...(env.amoPipelineId ? { pipeline_id: env.amoPipelineId } : {}),
      ...(env.amoStatusId ? { status_id: env.amoStatusId } : {}),
      ...(env.amoResponsibleUserId ? { responsible_user_id: env.amoResponsibleUserId } : {}),
      ...(leadFields.length ? { custom_fields_values: leadFields } : {}),
      _embedded: {
        tags: [{ name: "sayt" }, { name: "yoshlar-biznes-maktabi" }],
        contacts: [
          {
            first_name: input.name,
            custom_fields_values: [{ field_code: "PHONE", values: [{ value: input.phone, enum_code: "WORK" }] }],
          },
        ],
      },
    },
  ];

  const res = await amo<{ id: number }[]>("/api/v4/leads/complex", { method: "POST", body: JSON.stringify(payload) });
  const leadId = res?.[0]?.id;
  if (!leadId) return null;

  // Qo‘shimcha ma’lumotlarni izoh (note) sifatida yozamiz — maxsus maydon bo‘lmasa ham ishlaydi
  const utmText = input.utm && Object.keys(input.utm).length
    ? Object.entries(input.utm).map(([k, v]) => `${k}: ${v}`).join("\n")
    : "—";
  const text = [
    "🌐 Saytdan yangi ariza",
    `Manzil: ${input.region}`,
    `Yoshi: ${input.age ?? "—"}`,
    `Xodimlar soni: ${input.employees ?? "—"}`,
    `Aylanma: ${input.turnover || "—"}`,
    `Sahifa: ${input.pageUrl || "—"}`,
    `Sayt ID: ${input.siteLeadId}`,
    "",
    "UTM:",
    utmText,
  ].join("\n");
  try {
    await amo(`/api/v4/leads/${leadId}/notes`, {
      method: "POST",
      body: JSON.stringify([{ note_type: "common", params: { text } }]),
    });
  } catch (e) {
    console.error("[amoCRM] note xatosi", (e as Error).message);
  }
  return leadId;
}

type AmoLead = { id: number; price?: number; _embedded?: { contacts?: { id: number; is_main?: boolean }[] } };
type AmoContact = {
  id: number;
  name?: string;
  first_name?: string;
  custom_fields_values?: { field_code?: string; values: { value: string }[] }[] | null;
};

/** Saytdan kelmagan lidlar uchun ham Purchase yuborish maqsadida amoCRM’dan kontaktni olamiz */
export async function fetchAmoLeadContact(leadId: number): Promise<{ name?: string; phone?: string; price?: number } | null> {
  if (!has.amo()) return null;
  const lead = await amo<AmoLead>(`/api/v4/leads/${leadId}?with=contacts`);
  const contacts = lead?._embedded?.contacts || [];
  const main = contacts.find((c) => c.is_main) || contacts[0];
  if (!main) return { price: lead?.price };
  const c = await amo<AmoContact>(`/api/v4/contacts/${main.id}`);
  const phone = c?.custom_fields_values?.find((f) => f.field_code === "PHONE")?.values?.[0]?.value;
  return { name: c?.first_name || c?.name, phone, price: lead?.price };
}
