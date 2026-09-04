// Eventos públicos curados desde Luma — fuente en repo para sync quincenal.
// Ver README.md en esta carpeta.

import type { CuratedEvent } from "./types";
import aticmaEmprendeLaunch2026 from "./items/aticma-emprende-launch-2026.json";
import aticmaEmprendeUtn2026 from "./items/aticma-emprende-utn-2026.json";
import aticmaIaTalks2025 from "./items/aticma-ia-talks-2025.json";
import aticmaModeloNegocio2026 from "./items/aticma-modelo-negocio-2026.json";
import bitBeatMdp2026 from "./items/bit-beat-mdp-2026.json";
import bnbBuilderSessionMdp2026 from "./items/bnb-builder-session-mdp-2026.json";
import cafeCursorMdp2026 from "./items/cafe-cursor-mdp-2026.json";
import coworkAticmaMdpTech2026 from "./items/cowork-aticma-mdp-tech-2026.json";
import crecimientoAlephMdp2026 from "./items/crecimiento-aleph-mdp-2026.json";
import cursorHackathonMdp2026 from "./items/cursor-hackathon-mdp-2026.json";
import ieeeUnmdpIaFalla2026 from "./items/ieee-unmdp-ia-falla-2026.json";
import mdpDataChallenge2026 from "./items/mdp-data-challenge-2026.json";

export type { CuratedEvent, EventTier } from "./types";

const ALL_CURATED: CuratedEvent[] = [
  cafeCursorMdp2026 as CuratedEvent,
  crecimientoAlephMdp2026 as CuratedEvent,
  bitBeatMdp2026 as CuratedEvent,
  cursorHackathonMdp2026 as CuratedEvent,
  aticmaIaTalks2025 as CuratedEvent,
  aticmaEmprendeLaunch2026 as CuratedEvent,
  aticmaModeloNegocio2026 as CuratedEvent,
  coworkAticmaMdpTech2026 as CuratedEvent,
  aticmaEmprendeUtn2026 as CuratedEvent,
  bnbBuilderSessionMdp2026 as CuratedEvent,
  mdpDataChallenge2026 as CuratedEvent,
  ieeeUnmdpIaFalla2026 as CuratedEvent,
];

/** Slugs de Luma que nunca deben publicarse (privados, no tech, embudos ajenos). */
export const LUMA_EXCLUDE_SLUGS = new Set([
  "fktjzk1y", // Grok Bot Meetup — privado hasta que Luigi publique
  "b8qc0zng", // Inauguración PSICOCONECTA Castelli
]);

/** Títulos o hosts que indican evento fuera de scope (case-insensitive). */
export const EVENT_EXCLUDE_PATTERNS = [
  /psicoconecta/i,
  /\bpavla\b/i,
  /\bdisro\b/i,
  /builders\s+off\s+the\s+record/i,
  /inauguracion\s+psicoconecta/i,
];

export function lumaSlug(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/luma\.com\/(?:event\/)?([a-zA-Z0-9_-]+)/i);
  return m?.[1]?.toLowerCase() ?? null;
}

export function isExcludedEvent(input: {
  title?: string;
  hosts?: string[];
  lumaUrl?: string | null;
  registration_url?: string | null;
}): boolean {
  const slug = lumaSlug(input.lumaUrl ?? input.registration_url);
  if (slug && LUMA_EXCLUDE_SLUGS.has(slug)) return true;

  const haystack = [
    input.title ?? "",
    ...(input.hosts ?? []),
  ].join(" ");
  return EVENT_EXCLUDE_PATTERNS.some((re) => re.test(haystack));
}

/** Lista curada en repo, ya filtrada por exclusiones. */
export function curatedEvents(): CuratedEvent[] {
  return ALL_CURATED.filter((e) => !isExcludedEvent(e));
}
