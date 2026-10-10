import "server-only";
import { hashForMeta } from "./crypto";
import { env, has } from "./env";

type UserInput = {
  name?: string;
  phone?: string; // +998...
  region?: string;
  externalId?: string;
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
};

const normName = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}]/gu, "");

function userData(u: UserInput) {
  const parts = (u.name || "").trim().split(/\s+/).filter(Boolean);
  const fn = parts[0] ? normName(parts[0]) : "";
  const ln = parts.length > 1 ? normName(parts.slice(1).join("")) : "";
  const ph = (u.phone || "").replace(/\D/g, "");
  const ct = u.region ? normName(u.region.replace(/(shahri|viloyati|respublikasi)/gi, "")) : "";

  const data: Record<string, unknown> = {
    ph: ph ? [hashForMeta(ph)] : undefined,
    fn: fn ? [hashForMeta(fn)] : undefined,
    ln: ln ? [hashForMeta(ln)] : undefined,
    ct: ct ? [hashForMeta(ct)] : undefined,
    country: [hashForMeta("uz")],
    external_id: u.externalId ? [hashForMeta(u.externalId)] : undefined,
    client_ip_address: u.ip || undefined,
    client_user_agent: u.ua || undefined,
    fbp: u.fbp || undefined,
    fbc: u.fbc || undefined,
  };
  Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);
  return data;
}

export type CapiEvent = {
  name: "Lead" | "Purchase" | "CompleteRegistration" | "Contact";
  eventId: string;
  user: UserInput;
  sourceUrl?: string;
  valueUzs?: number;
  contentName?: string;
  eventTime?: number;
};

export function toMetaValue(uzs: number) {
  if (env.currency === "UZS") return Math.round(uzs);
  return Math.round((uzs / env.uzsPerCurrency) * 100) / 100;
}

export async function sendCapi(ev: CapiEvent): Promise<{ ok: boolean; error?: string }> {
  if (!has.capi()) return { ok: false, error: "CAPI sozlanmagan" };

  const custom: Record<string, unknown> = { content_name: ev.contentName || "Yoshlar Biznes Maktabi" };
  if (typeof ev.valueUzs === "number") {
    custom.value = toMetaValue(ev.valueUzs);
    custom.currency = env.currency;
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: ev.name,
        event_time: ev.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: ev.eventId,
        action_source: "website",
        event_source_url: ev.sourceUrl || env.siteUrl,
        user_data: userData(ev.user),
        custom_data: custom,
      },
    ],
  };
  if (env.capiTestCode) body.test_event_code = env.capiTestCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${env.graphVersion}/${env.pixelId}/events?access_token=${encodeURIComponent(env.capiToken)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" },
    );
    if (!res.ok) {
      const t = await res.text();
      console.error("[CAPI] xato", res.status, t.slice(0, 300));
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    console.error("[CAPI] tarmoq xatosi", (e as Error).message);
    return { ok: false, error: "network" };
  }
}
