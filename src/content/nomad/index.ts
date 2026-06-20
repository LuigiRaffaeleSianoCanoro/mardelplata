// Índice tipado de los datasets curados del Nomad & IT Hub.
// Contenido de baja rotación en JSON estático (patrón src/content/primer-trabajo).
// Toda métrica lleva fuente + fecha. Ver docs/nomad-it-hub/04-seo.md y la regla
// .cursor/rules/40-nomad-hub-content.mdc.

import cityStatsJson from "./city-stats.json";
import institutionsJson from "./institutions.json";

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
