// Capa de datos de cafés/coworkings (F3, convergido sobre Supabase).
// Lee de la vista `cafes_public` (cafes + señales agregadas de cafe_votes).
// Ver scripts/015_cafes_public_view.sql y docs/nomad-it-hub/02-feature-plan.md §F3.

import { createPublicClient } from "@/lib/supabase/public";

export type CafeKind = "cafe" | "cowork";
export type CafeSource = "seed" | "community";

export interface Cafe {
  id: string;
  name: string;
  address: string | null;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  google_place_id: string | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  maps_url: string | null;
  source: CafeSource;
  kind: CafeKind;
  description: string | null;
  created_at: string;
  updated_at: string;
  votes_total: number;
  score: number;
  wifi_yes: number;
  power_yes: number;
  seating_yes: number;
  quiet_yes: number;
}

/** Slug estable derivado del nombre (la tabla no tiene columna slug). */
export function cafeSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Etiqueta legible del tipo. */
export function cafeKindLabel(kind: CafeKind): string {
  return kind === "cowork" ? "Coworking" : "Café";
}

/** Zonas únicas presentes (para el filtro). */
export function cafeZonas(cafes: Cafe[]): string[] {
  const set = new Set<string>();
  for (const c of cafes) if (c.neighborhood) set.add(c.neighborhood);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

/** Trae todos los cafés publicados, ordenados por nombre. */
export async function getCafes(): Promise<Cafe[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("cafes_public")
    .select("*")
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data as Cafe[];
}

/** Busca un café por su slug derivado (dataset chico → match en memoria). */
export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  const cafes = await getCafes();
  return cafes.find((c) => cafeSlug(c.name) === slug) ?? null;
}
