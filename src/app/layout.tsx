import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/unbounded";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import { LeadModalProvider } from "@/components/LeadModal";
import { MotionProvider } from "@/components/MotionProvider";
import { site } from "@/lib/content";

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
    <html lang="uz">
      <body>
        <MotionProvider>
          <LeadModalProvider>{children}</LeadModalProvider>
        </MotionProvider>
        <MetaPixel />
      </body>
    </html>
  );
}
