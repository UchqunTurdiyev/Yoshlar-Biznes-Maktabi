import { z } from "zod";
import { regions } from "./content";

/** Telefonni +998XXXXXXXXX ko‘rinishiga keltiradi; noto‘g‘ri bo‘lsa null */
export function normalizeUzPhone(input: string): string | null {
  let d = (input || "").replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;
  if (d.length !== 12 || !d.startsWith("998")) return null;
  const op = d.slice(3, 5);
  const valid = ["20", "33", "50", "55", "77", "88", "90", "91", "93", "94", "95", "97", "98", "99", "61", "62", "65", "66", "67", "69", "71", "72", "73", "74", "75", "76", "79"];
  if (!valid.includes(op)) return null;
  return "+" + d;
}

const clean = (s: string) => s.replace(/[\u0000-\u001F\u007F<>]/g, "").replace(/\s+/g, " ").trim();

export const leadSchema = z.object({
  name: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .min(2, "Ismingizni kiriting")
        .max(60, "Ism juda uzun")
        .regex(/^[\p{L}\s'’‘ʻʼ`.-]+$/u, "Ismda faqat harflar bo‘lishi kerak"),
    ),
  phone: z
    .string()
    .max(30)
    .transform((v, ctx) => {
      const p = normalizeUzPhone(v);
      if (!p) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Telefon raqam noto‘g‘ri" });
        return z.NEVER;
      }
      return p;
    }),
  region: z.enum(regions, { errorMap: () => ({ message: "Manzilni tanlang" }) }),
  consent: z.literal(true, { errorMap: () => ({ message: "Rozilik talab qilinadi" }) }),
  // Texnik maydonlar
  eventId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
  website: z.string().max(0).optional().default(""), // honeypot — bo‘sh bo‘lishi shart
  startedAt: z.number().int().positive(),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(400).optional(),
  pageUrl: z.string().max(1000).optional(),
  utm: z.record(z.string().max(40), z.string().max(200)).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
