import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase SIN cookies para lecturas públicas (datos que no dependen
 * del usuario y van por RLS de lectura pública: events, profiles_public,
 * classified_listings vigentes, etc.).
 *
 * Por qué existe: el cliente de `server.ts` usa `cookies()`, lo que fuerza el
 * render dinámico de la ruta. Para que páginas como la home puedan usar ISR
 * (`export const revalidate`), sus queries públicas deben ir por este cliente,
 * que no toca cookies. Ver docs/nomad-it-hub/06-audit-qa-plan.md (P1).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    { auth: { persistSession: false } },
  );
}
