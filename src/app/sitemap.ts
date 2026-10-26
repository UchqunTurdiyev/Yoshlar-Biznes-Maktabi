import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/kurs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/maxfiylik`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
