// Constantes globales del sitio para SEO. Fuente única de verdad para URL
// canónica, nombre y descripción de marca. Ver docs/nomad-it-hub/04-seo.md.

export const SITE_URL = "https://mardelplata.dev.ar";

export const SITE_NAME = "MdPDev";

export const SITE_LEGAL_NAME = "MdPDev — Comunidad Dev Mar del Plata";

export const SITE_DESCRIPTION =
  "El Hub Tech de la Costa Atlántica. Conectamos desarrolladores, diseñadores y emprendedores en Mar del Plata.";

export const SITE_LOCALE = "es_AR";

export const SITE_LOGO = `${SITE_URL}/mdpdev.png`;

// Perfiles sociales oficiales de la comunidad (sameAs en JSON-LD).
export const SITE_SOCIALS: string[] = [
  "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs",
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
