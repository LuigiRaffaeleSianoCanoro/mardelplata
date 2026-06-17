-- ─────────────────────────────────────────────────────────────────────────────
-- 013_profiles_huevsite.sql
--
-- Suma el handle de huevsite (https://huevsite.io) al perfil de cada miembro.
-- La idea (ver el blog "API pública de perfiles" de huevsite.io): cada miembro
-- conecta su huevsite y la comunidad lo muestra con una card custom + el perfil
-- embebido, mandando tráfico de vuelta a cada builder.
--
-- Guardamos SOLO el username (ej. "ada"), no la URL completa. El front normaliza
-- lo que el usuario pegue (acepta "ada", "@ada" o "https://huevsite.io/ada") y
-- arma las URLs de card (API), perfil y embed a partir del handle.
--
-- Idempotente: se puede correr varias veces sin romper nada.
-- Requiere 010 (vista profiles_public) aplicado primero.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Columna en la tabla base. El handle público no es sensible.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS huevsite_username TEXT;

-- 2) Re-exponer la vista pública incluyendo el nuevo handle. CREATE OR REPLACE
--    solo permite AGREGAR columnas al final, por eso huevsite_username va último.
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  id,
  full_name,
  avatar_url,
  qr_code,
  bio,
  github_url,
  linkedin_url,
  twitter_url,
  created_at,
  huevsite_username
FROM public.profiles;

-- Mantener el modo definer + grants tal como los dejó 010 (ver ese script para
-- el racional de seguridad). CREATE OR REPLACE preserva estos settings, pero los
-- re-aplicamos para que este script sea autosuficiente e idempotente.
ALTER VIEW public.profiles_public SET (security_invoker = false);
REVOKE ALL ON public.profiles_public FROM anon, authenticated;
GRANT SELECT ON public.profiles_public TO anon, authenticated;

COMMENT ON COLUMN public.profiles.huevsite_username IS
  'huevsite.io handle (solo username, ej. "ada"). Se usa para traer la card via la API pública y para embeber el perfil. Público — viaja en profiles_public.';
