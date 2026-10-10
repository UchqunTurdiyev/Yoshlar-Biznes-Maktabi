import { NextResponse, type NextRequest } from "next/server";
import { safeEqual, sha256 } from "@/lib/server/crypto";
import { env } from "@/lib/server/env";
import { clientIp, sameOrigin } from "@/lib/server/request";
import { rateLimit } from "@/lib/server/store";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SEC } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!env.adminPassword || env.adminPassword.length < 10 || !env.sessionSecret || env.sessionSecret.length < 32) {
    return NextResponse.json({ ok: false, error: "Admin sozlanmagan (ADMIN_PASSWORD ≥ 10, SESSION_SECRET ≥ 32 belgi)" }, { status: 500 });
  }
  const ipKey = sha256(clientIp(req) || "unknown").slice(0, 32);
  if (!(await rateLimit(`login:${ipKey}`, 5, 900))) {
    return NextResponse.json({ ok: false, error: "Juda ko‘p urinish. 15 daqiqadan so‘ng qayta urinib ko‘ring." }, { status: 429 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !safeEqual(password, env.adminPassword)) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "Parol noto‘g‘ri" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(env.sessionSecret), {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
  return res;
}
