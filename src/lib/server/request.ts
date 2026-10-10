import "server-only";
import type { NextRequest } from "next/server";
import { env } from "./env";

export function clientIp(req: NextRequest): string {
  const h = req.headers;
  const ip =
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0] ||
    "";
  return ip.trim().slice(0, 64);
}

/** So‘rov faqat o‘z saytimizdan kelganini tekshiradi (CSRF himoyasi) */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const o = new URL(origin);
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    if (o.host === host) return true;
    const site = new URL(env.siteUrl);
    return o.host === site.host;
  } catch {
    return false;
  }
}
