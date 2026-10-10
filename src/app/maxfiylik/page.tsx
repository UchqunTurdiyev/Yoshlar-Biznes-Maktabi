import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Maxfiylik siyosati" };

const sections = [
  {
    h: "1. Qanday ma’lumotlar yig‘iladi",
    p: "Ariza formasini to‘ldirganingizda ismingiz, telefon raqamingiz va yashash manzilingiz (viloyat) yig‘iladi. Shuningdek, xizmat sifatini oshirish va firibgarlikning oldini olish uchun IP-manzil, brauzer turi hamda reklama manbasi (UTM belgilari) avtomatik qayd etiladi.",
  },
  {
    h: "2. Ma’lumotlardan foydalanish maqsadi",
    p: "Ma’lumotlaringiz faqat siz bilan bog‘lanish, dastur va grant shartlari haqida ma’lumot berish, saralash jarayonini tashkil etish hamda reklama samaradorligini o‘lchash uchun ishlatiladi. Ma’lumotlaringiz uchinchi shaxslarga sotilmaydi.",
  },
  {
    h: "3. Ma’lumotlarni himoya qilish",
    p: "Barcha ma’lumotlar HTTPS orqali shifrlangan holda uzatiladi va serverda AES-256 algoritmi bilan shifrlangan ko‘rinishda saqlanadi. Ma’lumotlarga faqat vakolatli xodimlar parol bilan himoyalangan tizim orqali kira oladi.",
  },
  {
    h: "4. Meta (Facebook/Instagram) reklama vositalari",
    p: "Saytda Meta Pixel va Conversions API qo‘llaniladi. Metaga telefon raqam va ism kabi ma’lumotlar faqat bir tomonlama SHA-256 xesh ko‘rinishida yuboriladi — ularni qayta tiklab bo‘lmaydi. Bu reklamani tegishli auditoriyaga ko‘rsatish va natijalarini o‘lchash uchun zarur.",
  },
  {
    h: "5. CRM va bildirishnomalar",
    p: "Arizangiz murojaatlarni boshqarish uchun CRM tizimiga (amoCRM) va mas’ul xodimlarning yopiq Telegram kanaliga yuboriladi.",
  },
  {
    h: "6. Saqlash muddati va huquqlaringiz",
    p: "Ma’lumotlar dastur bilan bog‘liq aloqa yakunlangunga qadar, lekin ko‘pi bilan 3 yil saqlanadi. Siz istalgan vaqtda ma’lumotlaringizni ko‘rish, tuzatish yoki o‘chirishni so‘rashingiz mumkin. Buning uchun quyidagi aloqa vositalari orqali murojaat qiling.",
  },
  {
    h: "7. Qonunchilik",
    p: "Shaxsiy ma’lumotlar O‘zbekiston Respublikasining “Shaxsga doir ma’lumotlar to‘g‘risida”gi Qonuni talablariga muvofiq qayta ishlanadi.",
  },
];

export default function Privacy() {
  return (
    <main className="min-h-dvh bg-paper px-4 py-16 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-brand">← Bosh sahifa</Link>
        <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Maxfiylik siyosati</h1>
        <p className="mt-3 text-muted">{site.name} veb-sayti foydalanuvchilarining shaxsiy ma’lumotlarini qayta ishlash tartibi.</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.h} className="card p-6">
              <h2 className="font-display text-lg font-semibold">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
            </section>
          ))}
          {(site.phone || site.telegram) && (
            <p className="text-sm text-muted">
              Aloqa: {site.phone} {site.telegram && <>· Telegram: {site.telegram}</>}
            </p>
          )}
        </div>
      </article>
    </main>
  );
}
