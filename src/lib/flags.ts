/**
 * Flags de producto que Luigi tiene que prender a mano.
 * Default: apagados. No poner links públicos de Marketplace en la nav
 * hasta que haya OK explícito (NEXT_PUBLIC_MARKETPLACE_NAV=true en Vercel).
 */
export const MARKETPLACE_NAV_ENABLED =
  process.env.NEXT_PUBLIC_MARKETPLACE_NAV === "true";
