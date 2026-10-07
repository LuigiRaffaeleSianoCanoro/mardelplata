/**
 * Marca: siempre «mardelplata.dev.ar». Algunas fuentes externas (títulos de
 * Luma) traen el dominio sin «.ar»; lo normalizamos al mostrar, sin tocar
 * los JSON fuente.
 */
export const BRAND = "mardelplata.dev.ar";
export const BRAND_NAME = "mardelplata";
export const BRAND_TLD = ".dev.ar";

/** Tamaño de la comunidad: el único número de miembros que se muestra. */
export const COMMUNITY_SIZE_LABEL = "~700";

const BARE_DOMAIN = /mardelplata\.dev(?!\.ar)(?![\w.-]*\.[a-z])/gi;

export function brandify(text: string): string;
export function brandify(text: string | null | undefined): string | null;
export function brandify(text: string | null | undefined): string | null {
  if (text == null) return null;
  return text
    .replace(BARE_DOMAIN, BRAND)
    // «Meet Team1 x mardelplata…» → «Meet Team1 × mardelplata…»
    .replace(/(\S) x (?=mardelplata\.dev)/gi, "$1 × ");
}
