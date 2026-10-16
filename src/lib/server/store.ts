import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { decrypt, encrypt } from "./crypto";
import { env, has } from "./env";

/**
 * Lid saqlash qatlami.
 *  - UPSTASH_REDIS_REST_URL berilgan bo‘lsa → Upstash Redis (Vercel uchun)
 *  - aks holda → ./data/leads.json (VPS / Eskiz server uchun)
 * Shaxsiy ma’lumotlar (ism, telefon, manzil, IP, brauzer) AES-256-GCM bilan shifrlanib saqlanadi.
 */

export type LeadStatus = "new" | "contacted" | "purchased" | "rejected";

export type LeadPII = {
  name: string;
  phone: string; // +998XXXXXXXXX
  region: string;
  age?: number;
  employees?: number;
  turnover?: string;
  ip?: string;
  ua?: string;
};

export type Lead = {
  id: string;
  createdAt: number;
  status: LeadStatus;
  phoneHash: string;
  pii: string; // shifrlangan LeadPII
  utm?: Record<string, string>;
  meta: { fbp?: string; fbc?: string; eventSourceUrl?: string; leadEventId: string };
  amoLeadId?: number;
  tg?: { chatId: string; messageId: number }[];
  purchase?: {
    at: number;
    valueUzs: number;
    plan: "grant" | "full" | "custom";
    source: "admin" | "telegram" | "amocrm";
    eventId: string;
    capiOk: boolean;
  };
};

export const sealPII = (p: LeadPII) => encrypt(JSON.stringify(p));
export const openPII = (l: Lead): LeadPII => JSON.parse(decrypt(l.pii));

/* ---------------- Upstash Redis (REST) ---------------- */

async function redis<T = unknown>(cmd: (string | number)[]): Promise<T> {
  const res = await fetch(env.upstashUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.upstashToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(`Redis: ${json.error || res.status}`);
  return json.result as T;
}

/* ---------------- Fayl ---------------- */

type FileDB = { leads: Record<string, Lead>; amo: Record<string, string>; kv: Record<string, { v: string; exp: number }> };
const filePath = () => path.resolve(env.dataDir, "leads.json");
let queue: Promise<unknown> = Promise.resolve();

async function readDB(): Promise<FileDB> {
  try {
    return JSON.parse(await fs.readFile(filePath(), "utf8")) as FileDB;
  } catch {
    return { leads: {}, amo: {}, kv: {} };
  }
}

/** Ketma-ket (lock bilan) yozish — bir vaqtdagi so‘rovlar faylni buzmasligi uchun */
function withDB<T>(fn: (db: FileDB) => T | Promise<T>, write = true): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDB();
    const out = await fn(db);
    if (write) {
      await fs.mkdir(path.dirname(filePath()), { recursive: true });
      const tmp = filePath() + ".tmp";
      await fs.writeFile(tmp, JSON.stringify(db), { mode: 0o600 });
      await fs.rename(tmp, filePath());
    }
    return out;
  });
  queue = run.catch(() => undefined);
  return run;
}

/* ---------------- Ommaviy API ---------------- */

export async function saveLead(lead: Lead) {
  if (has.upstash()) {
    await redis(["SET", `lead:${lead.id}`, JSON.stringify(lead)]);
    await redis(["ZADD", "leads:index", lead.createdAt, lead.id]);
    if (lead.amoLeadId) await redis(["SET", `amo:${lead.amoLeadId}`, lead.id]);
    return;
  }
  await withDB((db) => {
    db.leads[lead.id] = lead;
    if (lead.amoLeadId) db.amo[String(lead.amoLeadId)] = lead.id;
  });
}

export async function getLead(id: string): Promise<Lead | null> {
  if (!/^[A-Za-z0-9_-]{8,40}$/.test(id)) return null;
  if (has.upstash()) {
    const raw = await redis<string | null>(["GET", `lead:${id}`]);
    return raw ? (JSON.parse(raw) as Lead) : null;
  }
  return withDB((db) => db.leads[id] ?? null, false);
}

export async function updateLead(id: string, patch: (l: Lead) => Lead | void): Promise<Lead | null> {
  if (has.upstash()) {
    const lead = await getLead(id);
    if (!lead) return null;
    const next = patch(lead) || lead;
    await saveLead(next);
    return next;
  }
  return withDB((db) => {
    const lead = db.leads[id];
    if (!lead) return null;
    const next = patch(lead) || lead;
    db.leads[id] = next;
    if (next.amoLeadId) db.amo[String(next.amoLeadId)] = id;
    return next;
  });
}

export async function findLeadByAmoId(amoId: number): Promise<Lead | null> {
  if (has.upstash()) {
    const id = await redis<string | null>(["GET", `amo:${amoId}`]);
    return id ? getLead(id) : null;
  }
  return withDB((db) => {
    const id = db.amo[String(amoId)];
    return id ? db.leads[id] ?? null : null;
  }, false);
}

export async function listLeads(limit = 300): Promise<Lead[]> {
  if (has.upstash()) {
    const ids = await redis<string[]>(["ZRANGE", "leads:index", 0, limit - 1, "REV"]);
    if (!ids.length) return [];
    const raws = await redis<(string | null)[]>(["MGET", ...ids.map((i) => `lead:${i}`)]);
    return raws.filter(Boolean).map((r) => JSON.parse(r as string) as Lead);
  }
  return withDB(
    (db) =>
      Object.values(db.leads)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit),
    false,
  );
}

/* ---------------- Rate limit va qisqa muddatli kalitlar ---------------- */

const mem = new Map<string, { n: number; exp: number }>();

/** true → ruxsat; false → limit oshdi */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  if (has.upstash()) {
    const n = await redis<number>(["INCR", `rl:${key}`]);
    if (n === 1) await redis(["EXPIRE", `rl:${key}`, windowSec]);
    return n <= limit;
  }
  const now = Date.now();
  const cur = mem.get(key);
  if (!cur || cur.exp < now) {
    mem.set(key, { n: 1, exp: now + windowSec * 1000 });
    if (mem.size > 5000) for (const [k, v] of mem) if (v.exp < now) mem.delete(k);
    return true;
  }
  cur.n++;
  return cur.n <= limit;
}

/** Kalit mavjud bo‘lmasa o‘rnatadi (SET NX). true → yangi o‘rnatildi */
export async function setOnce(key: string, value: string, ttlSec: number): Promise<boolean> {
  if (has.upstash()) {
    const r = await redis<string | null>(["SET", `kv:${key}`, value, "NX", "EX", ttlSec]);
    return r === "OK";
  }
  return withDB((db) => {
    const now = Date.now();
    for (const [k, v] of Object.entries(db.kv)) if (v.exp < now) delete db.kv[k];
    if (db.kv[key]) return false;
    db.kv[key] = { v: value, exp: now + ttlSec * 1000 };
    return true;
  });
}

export async function getKV(key: string): Promise<string | null> {
  if (has.upstash()) return redis<string | null>(["GET", `kv:${key}`]);
  return withDB((db) => {
    const e = db.kv[key];
    return e && e.exp > Date.now() ? e.v : null;
  }, false);
}
