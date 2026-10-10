# Yoshlar Biznes Maktabi — sotuv sayti

Next.js 15 (App Router) · Tailwind CSS 4 · Framer Motion · amoCRM · Telegram bot · Meta Pixel + Conversions API

## Imkoniyatlar

| Yo‘nalish | Nima qiladi |
|---|---|
| **Sotuv sahifasi** | Prezentatsiyadagi barcha ma’lumotlar: muammolar, kimlar uchun, format, 3 shahar + countdown, 6 modul (interaktiv), 4 mentor, natijalar, narx (grant), FAQ, 3 ta lid forma + modal + mobil pastki panel |
| **Lid forma** | Ism, telefon (+998 maska va operator tekshiruvi), manzil (viloyat), rozilik |
| **amoCRM** | Har bir arizadan lid + kontakt (telefon) yaratiladi, teglar, viloyat, UTM va sahifa izoh sifatida |
| **Telegram** | Har bir arizada adminlarga xabar + tugmalar: «Sotib oldi (grant / to‘liq)», «Bog‘lanildi», «Rad etildi». Xarid tasdiqlansa Metaga Purchase ketadi |
| **Meta Pixel + CAPI** | `PageView`, `Lead` (Pixel + server, bitta `event_id` bilan deduplikatsiya), `Purchase`. fbp/fbc, IP, user agent, xeshlangan telefon/ism/shahar/external_id |
| **Purchase (sotib olganlar)** | 3 yo‘l: ① amoCRM’da lid «Успешно реализовано»ga o‘tsa (webhook), ② Telegram tugmasi, ③ Admin panel. Har bir lid uchun faqat 1 marta yuboriladi. Saytdan kelmagan amoCRM lidlari uchun ham ishlaydi |
| **Admin panel** `/admin` | Lidlar ro‘yxati, qidiruv, filtr, statistika (konversiya, tushum), xaridni belgilash, CAPI’ni qayta yuborish, CSV eksport, integratsiyalar holati |

## Xavfsizlik va maxfiylik

- Shaxsiy ma’lumotlar (ism, telefon, manzil, IP, brauzer) **AES-256-GCM** bilan shifrlangan holda saqlanadi
- Metaga faqat **SHA-256 xesh** yuboriladi; barcha tokenlar faqat serverda
- Bot himoyasi: honeypot maydon + to‘ldirish vaqti tekshiruvi + IP bo‘yicha rate limit (10 daqiqada 5 ta)
- 24 soat ichida bir xil raqamdan takroriy ariza CRMga tushmaydi
- CSRF: API faqat o‘z domeningizdan qabul qiladi (Origin tekshiruvi)
- Telegram webhook — `secret_token`, amoCRM webhook — maxfiy kalit, Telegram tugmalari faqat ruxsat berilgan chatlardan
- Admin: parol + HMAC imzoli `httpOnly / Secure / SameSite=strict` cookie (12 soat), login’ga 15 daqiqada 5 urinish, timing-safe taqqoslash
- Qattiq HTTP headerlar: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- CSV eksportda formula-injection himoyasi, `/admin` va `/api` indekslanmaydi
- `/maxfiylik` sahifasi — maxfiylik siyosati

## O‘rnatish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to‘ldiring
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Kalitlarni yaratish:
```bash
openssl rand -base64 48   # SESSION_SECRET
openssl rand -base64 32   # DATA_ENCRYPTION_KEY  (keyin O‘ZGARTIRMANG)
openssl rand -hex 24      # TELEGRAM_WEBHOOK_SECRET va AMO_WEBHOOK_SECRET
```

### 1. Meta
1. Events Manager → Pixel ID → `NEXT_PUBLIC_META_PIXEL_ID`
2. Settings → Conversions API → **Generate access token** → `META_CAPI_ACCESS_TOKEN`
3. Sinov: Test events kodini `META_TEST_EVENT_CODE` ga yozing, forma yuboring, Lead (Browser + Server, «Deduplicated») ko‘rinishini tekshiring. **Keyin kodni o‘chiring.**
4. `META_CURRENCY` — reklama akkauntingiz valyutasi. USD bo‘lsa, `META_UZS_RATE` ga joriy kursni yozing (so‘m → USD konvertatsiya qilinadi).

### 2. amoCRM
1. amoCRM → Sozlamalar → Integratsiyalar → «Создать интеграцию» → **Долгосрочный токен** → `AMO_LONG_LIVED_TOKEN`
2. `AMO_BASE_URL=https://kompaniya.amocrm.ru`
3. Voronka va bosqich ID lari (`AMO_PIPELINE_ID`, `AMO_STATUS_ID`) — voronka sozlamalari URL’ida yoki `GET /api/v4/leads/pipelines` orqali
4. Purchase uchun webhook: Sozlamalar → Integratsiyalar → **Web hooks** →
   `https://SAYT/api/amocrm/webhook?secret=AMO_WEBHOOK_SECRET`, hodisa: «Статус сделки изменен»
5. `AMO_PURCHASE_STATUS_IDS` — qaysi bosqich «sotib oldi» hisoblanadi (standart `142`). Lid narxi (budjet) 15 900 000 bo‘lsa «to‘liq», boshqa summa bo‘lsa o‘sha summa yuboriladi.

### 3. Telegram
1. @BotFather → yangi bot → `TELEGRAM_BOT_TOKEN`
2. Botni guruhga qo‘shing, sayt ishga tushgach `/admin` → **«Telegram webhookni o‘rnatish»** tugmasini bosing
3. Guruhda `/id` yozing — bot chat ID ni qaytaradi → `TELEGRAM_CHAT_IDS` (bir nechta bo‘lsa vergul bilan), serverni qayta ishga tushiring

### 4. Saqlash
- **Eskiz / VPS:** hech narsa kerak emas — lidlar `./data/leads.json` da (shifrlangan, 600 huquq bilan). `data/` papkasini zaxiralab turing.
- **Vercel:** fayl tizimi saqlanmaydi → [Upstash Redis](https://upstash.com) yarating va `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` ni kiriting.

## Deploy

**Vercel:** repo’ni ulang → Environment Variables ga `.env.example` dagi qiymatlarni kiriting (Upstash majburiy) → Deploy.

**Eskiz (VPS, Node 20+):**
```bash
npm ci && npm run build
pm2 start npm --name ybm -- start      # PORT=3000
```
Nginx (HTTPS majburiy — admin cookie `Secure`):
```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Matnlarni o‘zgartirish
Barcha matnlar, sanalar, narxlar, mentorlar va modullar bitta faylda: `src/lib/content.ts`.
Mentor rasmlari: `public/images/mentors/`, hamkor logolari: `public/images/partners/`.

## Tuzilma
```
src/app/page.tsx                 — sotuv sahifasi
src/app/rahmat, /maxfiylik       — rahmat va maxfiylik sahifalari
src/app/admin                    — admin panel
src/app/api/lead                 — lid qabul qilish
src/app/api/telegram/*           — bot webhook va sozlash
src/app/api/amocrm/webhook       — amoCRM → Purchase
src/app/api/admin/*              — admin API
src/lib/server/*                 — amoCRM, CAPI, Telegram, shifrlash, saqlash
src/components/*                 — UI bo‘limlari
```
# Yoshlar-Biznes-Maktabi
