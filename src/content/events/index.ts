// Eventos públicos curados desde Luma — fuente en repo para sync quincenal.
// Ver README.md en esta carpeta. Los JSON se cargan en server via lib/events/load-curated.ts.

export type { CuratedEvent, EventTier } from "./types";

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
