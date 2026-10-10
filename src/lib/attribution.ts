"use client";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;
const STORE_KEY = "ybm_attr";

function readCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function setCookie(name: string, value: string, days: number) {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax${secure}`;
}

/** Sahifa ochilganda UTM va fbclid ni saqlab qo‘yadi (birinchi tashrif atributsiyasi) */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 200);
    });
    if (Object.keys(found).length) {
      const prev = JSON.parse(sessionStorage.getItem(STORE_KEY) || "{}");
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ ...prev, ...found }));
    }
    const fbclid = params.get("fbclid");
    if (fbclid && !readCookie("_fbc")) setCookie("_fbc", `fb.1.${Date.now()}.${fbclid}`, 90);
  } catch {}
}

export function getAttribution() {
  let utm: Record<string, string> = {};
  try {
    utm = JSON.parse(sessionStorage.getItem(STORE_KEY) || "{}");
  } catch {}
  const { fbclid: _f, ...rest } = utm;
  return {
    utm: rest,
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    pageUrl: location.href.slice(0, 1000),
  };
}
