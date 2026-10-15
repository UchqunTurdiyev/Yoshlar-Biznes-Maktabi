import "server-only";

const read = (k: string, fallback = "") => (process.env[k] ?? fallback).trim();

export const env = {
  siteUrl: read("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  isProd: process.env.NODE_ENV === "production",

  // Meta
  pixelId: read("NEXT_PUBLIC_META_PIXEL_ID"),
  capiToken: read("META_CAPI_ACCESS_TOKEN"),
  capiTestCode: read("META_TEST_EVENT_CODE"),
  graphVersion: read("META_GRAPH_VERSION", "v21.0"),
  currency: read("META_CURRENCY", "USD"),
  uzsPerCurrency: Number(read("META_UZS_RATE", "1")) || 1,

  // amoCRM
  amoBaseUrl: read("AMO_BASE_URL").replace(/\/+$/, ""),
  amoToken: read("AMO_LONG_LIVED_TOKEN"),
  amoPipelineId: Number(read("AMO_PIPELINE_ID")) || undefined,
  amoStatusId: Number(read("AMO_STATUS_ID")) || undefined,
  amoResponsibleUserId: Number(read("AMO_RESPONSIBLE_USER_ID")) || undefined,
  amoRegionFieldId: Number(read("AMO_REGION_FIELD_ID")) || undefined,
  amoPurchaseStatusIds: read("AMO_PURCHASE_STATUS_IDS", "142")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter(Boolean),
  amoWebhookSecret: read("AMO_WEBHOOK_SECRET"),

  // Telegram
  tgToken: read("TELEGRAM_BOT_TOKEN"),
  tgChatIds: read("TELEGRAM_CHAT_IDS")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  tgWebhookSecret: read("TELEGRAM_WEBHOOK_SECRET"),

  // Xavfsizlik
  adminPassword: read("ADMIN_PASSWORD"),
  sessionSecret: read("SESSION_SECRET"),
  encryptionKey: read("DATA_ENCRYPTION_KEY"),

  // Saqlash
  upstashUrl: read("UPSTASH_REDIS_REST_URL").replace(/\/+$/, ""),
  upstashToken: read("UPSTASH_REDIS_REST_TOKEN"),
  // Vercel'da faqat /tmp yoziladi (vaqtinchalik) — doimiy saqlash uchun Upstash kerak
  dataDir: read("DATA_DIR", process.env.VERCEL ? "/tmp/ybm-data" : "./data"),

  // Narxlar (so‘m)
  priceGrant: Number(read("PRICE_GRANT_UZS", "7950000")),
  priceFull: Number(read("PRICE_FULL_UZS", "15900000")),
};

export const has = {
  capi: () => Boolean(env.pixelId && env.capiToken),
  amo: () => Boolean(env.amoBaseUrl && env.amoToken),
  tg: () => Boolean(env.tgToken && env.tgChatIds.length),
  upstash: () => Boolean(env.upstashUrl && env.upstashToken),
};
