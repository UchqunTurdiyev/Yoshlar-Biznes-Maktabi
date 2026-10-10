import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "./env";

export const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/** Meta talabiga ko‘ra: trim + lowercase + SHA-256 */
export const hashForMeta = (v?: string | null) => {
  const s = (v ?? "").trim().toLowerCase();
  return s ? sha256(s) : undefined;
};

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(sha256(a));
  const bb = Buffer.from(sha256(b));
  return timingSafeEqual(ab, bb) && a.length === b.length;
}

function key(): Buffer {
  const raw = env.encryptionKey || (env.isProd ? "" : "dev-only-insecure-key-change-me");
  if (!raw) throw new Error("DATA_ENCRYPTION_KEY sozlanmagan");
  // Har qanday uzunlikdagi kalitdan 32 baytli AES kalit hosil qilamiz
  return createHash("sha256").update(raw).digest();
}

/** AES-256-GCM bilan shifrlash: iv.tag.ciphertext (base64url) */
export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ct].map((b) => b.toString("base64url")).join(".");
}

export function decrypt(payload: string): string {
  const [iv, tag, ct] = payload.split(".").map((p) => Buffer.from(p, "base64url"));
  const d = createDecipheriv("aes-256-gcm", key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(ct), d.final()]).toString("utf8");
}

export const randomId = (bytes = 12) => randomBytes(bytes).toString("base64url");
