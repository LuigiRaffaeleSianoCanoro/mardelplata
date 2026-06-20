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
