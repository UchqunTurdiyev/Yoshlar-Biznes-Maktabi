import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pains from "@/components/Pains";
import Program from "@/components/Program";
import Locations from "@/components/Locations";
import Modules from "@/components/Modules";
import Mentors from "@/components/Mentors";
import Results from "@/components/Results";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { faq, locations, pricing, site } from "@/lib/content";

// Eng yaqin oqim/sanalar yangilanib turishi uchun har soatda qayta generatsiya
export const revalidate = 3600;

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: site.name,
        description: site.description,
        inLanguage: "uz",
        provider: { "@type": "Organization", name: "FAZZA Management School" },
        offers: { "@type": "Offer", price: pricing.grant, priceCurrency: "UZS", category: "Grant bilan" },
        hasCourseInstance: locations.map((l) => ({
          "@type": "CourseInstance",
          courseMode: "Onsite",
          startDate: l.date,
          location: { "@type": "Place", name: l.city, address: { "@type": "PostalAddress", addressLocality: l.city, addressCountry: "UZ" } },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pains />
        <Marquee />
        <Program />
        <Locations />
        <Modules />
        <Mentors />
        <Results />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
