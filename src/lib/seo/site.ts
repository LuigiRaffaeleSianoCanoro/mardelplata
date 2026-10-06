// Constantes globales del sitio para SEO. Fuente única de verdad para URL
// canónica, nombre y descripción de marca. Ver docs/nomad-it-hub/04-seo.md.

import { COMMUNITY_SOCIAL } from "@/lib/community";

export const SITE_URL = "https://mardelplata.dev.ar";

export const SITE_NAME = "mardelplata.dev.ar";

export const SITE_LEGAL_NAME = "mardelplata.dev.ar — Comunidad dev de Mar del Plata";

export const SITE_DESCRIPTION =
  "La comunidad dev de Mar del Plata: meetups, hackathons, empleos y lo que sale en los medios. Arrancamos en Fauno, Olavarría, y seguimos juntándonos.";

export const SITE_LOCALE = "es_AR";

export const SITE_LOGO = `${SITE_URL}/brand/mardelplata-dev-ar-icon-512.png`;

// Perfiles sociales oficiales de la comunidad (sameAs en JSON-LD).
export const SITE_SOCIALS: string[] = [
  COMMUNITY_SOCIAL.instagram,
  COMMUNITY_SOCIAL.x,
  COMMUNITY_SOCIAL.linkedin,
];

/** Construye una URL absoluta a partir de un path relativo ("/eventos"). */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return new URL(path, SITE_URL).toString();
}

/**
 * URL de la OG image dinámica (ver src/app/api/og/route.tsx). Relativa: Next la
 * resuelve a absoluta con metadataBase. Ver docs/nomad-it-hub/06-audit-qa-plan.md (S1).
 */
export function ogImageUrl(title: string, eyebrow?: string): string {
  const params = new URLSearchParams({ title });
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/api/og?${params.toString()}`;
}
