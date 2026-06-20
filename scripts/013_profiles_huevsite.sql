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
-- Ver 018_profiles_public_security_invoker.sql para la vista con
-- security_invoker = true (reemplaza el modo definer de 010).

COMMENT ON COLUMN public.profiles.huevsite_username IS
  'huevsite.io handle (solo username, ej. "ada"). Se usa para traer la card via la API pública y para embeber el perfil. Público — viaja en profiles_public.';
