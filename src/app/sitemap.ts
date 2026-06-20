import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";
import { companies, workSpots } from "@/content/nomad";

// Metadata route de Next 15. Rutas públicas estáticas + fecha dinámica de
// /eventos según el último evento publicado. A medida que se sumen rutas-entidad
// (/empresas/[slug], /trabajar/[slug]) se generan acá desde su fuente.
// Ver docs/nomad-it-hub/04-seo.md §1 y §3.

interface StaticRoute {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/eventos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/vivir-en-mardelplata", changeFrequency: "monthly", priority: 0.9 },
  { path: "/vivir-en-mardelplata/visa", changeFrequency: "monthly", priority: 0.7 },
  { path: "/trabajar", changeFrequency: "weekly", priority: 0.8 },
  { path: "/que-hacer", changeFrequency: "monthly", priority: 0.6 },
  { path: "/invertir", changeFrequency: "monthly", priority: 0.9 },
  { path: "/empresas", changeFrequency: "weekly", priority: 0.9 },
  { path: "/estudiar", changeFrequency: "monthly", priority: 0.7 },
  { path: "/bolsa", changeFrequency: "daily", priority: 0.8 },
  { path: "/proyectos", changeFrequency: "weekly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { path: "/primer-trabajo", changeFrequency: "monthly", priority: 0.7 },
  { path: "/primer-trabajo/diagnostico", changeFrequency: "monthly", priority: 0.5 },
  { path: "/primer-trabajo/plan", changeFrequency: "monthly", priority: 0.5 },
  { path: "/primer-trabajo/empresas", changeFrequency: "monthly", priority: 0.5 },
  { path: "/primer-trabajo/entrevista-hr", changeFrequency: "monthly", priority: 0.5 },
  { path: "/primer-trabajo/guia/cv", changeFrequency: "monthly", priority: 0.5 },
  { path: "/primer-trabajo/guia/linkedin", changeFrequency: "monthly", priority: 0.5 },
  { path: "/reglamento", changeFrequency: "yearly", priority: 0.3 },
  { path: "/brand", changeFrequency: "yearly", priority: 0.3 },
  { path: "/marketing-kit", changeFrequency: "yearly", priority: 0.3 },
];

async function latestEventDate(): Promise<Date | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("date, updated_at")
      .eq("is_published", true)
      .order("date", { ascending: false })
      .limit(1);
    const row = data?.[0];
    if (!row) return null;
    const d = new Date(row.updated_at ?? row.date);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const eventsLastMod = (await latestEventDate()) ?? now;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.path === "/eventos" ? eventsLastMod : now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Rutas-entidad de empresas (curadas en JSON; se generan desde su fuente).
  const companyEntries: MetadataRoute.Sitemap = companies.companies.map((c) => ({
    url: absoluteUrl(`/empresas/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Rutas-entidad de cafés/coworkings.
  const workSpotEntries: MetadataRoute.Sitemap = workSpots.spots.map((s) => ({
    url: absoluteUrl(`/trabajar/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...companyEntries, ...workSpotEntries];
}
