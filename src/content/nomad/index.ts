// Índice tipado de los datasets curados del Nomad & IT Hub.
// Contenido de baja rotación en JSON estático (patrón src/content/primer-trabajo).
// Toda métrica lleva fuente + fecha. Ver docs/nomad-it-hub/04-seo.md y la regla
// .cursor/rules/40-nomad-hub-content.mdc.

import cityStatsJson from "./city-stats.json";
import institutionsJson from "./institutions.json";
import activitiesJson from "./activities.json";
import livingJson from "./living.json";
import visaJson from "./visa.json";
import companiesJson from "./companies.json";
import investEnJson from "./invest.en.json";
import livingEnJson from "./living.en.json";

export interface CityStat {
  value: string;
  label: string;
  detail?: string;
  source: string;
  sourceUrl: string;
  asOf: string;
}

export interface CityReason {
  title: string;
  body: string;
}

export interface FlagshipCase {
  name: string;
  description: string;
  url: string;
  source: string;
  sourceUrl: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface CityStatsContent {
  updatedAt: string;
  intro: string;
  stats: CityStat[];
  reasons: CityReason[];
  cases: FlagshipCase[];
  faq: FaqEntry[];
}

export interface Institution {
  name: string;
  kind: string;
  address?: string;
  website?: string;
  careers: string[];
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface InstitutionsContent {
  updatedAt: string;
  intro: string;
  sources: SourceLink[];
  universities: Institution[];
  institutes: Institution[];
}

export const cityStats: CityStatsContent = cityStatsJson;
export const institutions: InstitutionsContent = institutionsJson;

// ─── Actividades (F5 — /que-hacer) ──────────────────────────────────────

export interface ActivityItem {
  name: string;
  description: string;
}

export interface ActivityCategory {
  title: string;
  items: ActivityItem[];
}

export interface ActivitiesContent {
  updatedAt: string;
  intro: string;
  categories: ActivityCategory[];
}

// ─── Vivir en MdP (F4 — /vivir-en-mardelplata) ──────────────────────────

export interface SourcedSummary {
  summary: string;
  source: string;
  sourceUrl: string;
  asOf: string;
}

export interface CostItem {
  label: string;
  value: string;
}

export interface Neighborhood {
  name: string;
  vibe: string;
  forWhom: string;
}

export interface LivingContent {
  updatedAt: string;
  intro: string;
  highlights: string[];
  costOfLiving: SourcedSummary & { items: CostItem[]; disclaimer: string };
  internet: SourcedSummary & { providers: string[] };
  neighborhoods: Neighborhood[];
  faq: FaqEntry[];
}

// ─── Visa nómade (F4 — /vivir-en-mardelplata/visa) ──────────────────────

export interface KeyFact {
  label: string;
  value: string;
}

export interface HowToStep {
  title: string;
  body: string;
}

export interface VisaContent {
  updatedAt: string;
  intro: string;
  official: SourceLink;
  keyFacts: KeyFact[];
  requirements: string[];
  howTo: HowToStep[];
  disclaimer: string;
  faq: FaqEntry[];
}

export const activities: ActivitiesContent = activitiesJson;
export const living: LivingContent = livingJson;
export const visa: VisaContent = visaJson;

// ─── Empresas (F1 — /empresas) ──────────────────────────────────────────

export interface Company {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  sectors: string[];
  website?: string;
  neighborhood?: string;
  founded?: number;
  exports?: boolean;
  source: string;
  sourceUrl: string;
}

export interface CompaniesContent {
  updatedAt: string;
  intro: string;
  sources: SourceLink[];
  companies: Company[];
}

export const companies: CompaniesContent = companiesJson;

/** Lista ordenada de sectores únicos presente en el directorio (para filtros). */
export function companySectors(): string[] {
  const set = new Set<string>();
  for (const c of companies.companies) {
    for (const s of c.sectors) set.add(s);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

export function companyBySlug(slug: string): Company | undefined {
  return companies.companies.find((c) => c.slug === slug);
}

// ─── Contenido en inglés (i18n — rutas /en/*) ───────────────────────────
// Misma forma que sus contrapartes en español; ver docs/nomad-it-hub/04-seo.md §5.

export const cityStatsEn: CityStatsContent = investEnJson;
export const livingEn: LivingContent = livingEnJson;
