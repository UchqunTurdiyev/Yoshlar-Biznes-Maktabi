import "server-only";
import { cookies } from "next/headers";
import { env } from "./env";
import { SESSION_COOKIE, verifySessionToken } from "../session";

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifySessionToken(c.get(SESSION_COOKIE)?.value, env.sessionSecret);
}
