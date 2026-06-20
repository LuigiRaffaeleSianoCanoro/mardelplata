import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

// Metadata route de Next 15. Permite el crawl general y bloquea rutas privadas
// o sin valor SEO. Apunta al sitemap. Ver docs/nomad-it-hub/04-seo.md §1.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/auth",
          "/perfil",
          "/asistencias",
          "/preview",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
