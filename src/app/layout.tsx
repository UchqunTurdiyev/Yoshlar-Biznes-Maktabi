import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import { LeadModalProvider } from "@/components/LeadModal";
import { site } from "@/lib/content";

// Faqat latin qismi (o‘zbek lotin yozuvi uchun yetarli) — preload bilan, boshqa subsetlar yuklanmaydi
const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});
const unbounded = localFont({
  src: "../../node_modules/@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2",
  weight: "200 900",
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — 70% grant bilan amaliy biznes dasturi`, template: `%s · ${site.name}` },
  description: site.description,
  keywords: ["Yoshlar Biznes Maktabi", "biznes ta'lim", "yosh tadbirkorlar", "grant", "FAZZA Management School", "Samarqand", "Andijon"],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    title: `${site.name} — biznesingizni keyingi bosqichga olib chiqing`,
    description: "12 kunlik oflayn dastur · 70% amaliyot · 70% grant · Andijon, Samarqand",
    siteName: site.name,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#050f22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${manrope.variable} ${unbounded.variable}`}>
      <body>
        <LeadModalProvider>{children}</LeadModalProvider>
        <MetaPixel />
      </body>
    </html>
  );
}
