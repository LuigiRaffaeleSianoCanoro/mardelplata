-- ─────────────────────────────────────────────────────────────────────────────
-- 010_profiles_lock_down.sql
--
-- Cierra el leak de emails sobre public.profiles.
-- Antes: la policy "Public profiles are viewable by everyone" + GRANT SELECT
-- a anon hacian que cualquiera con la anon key pudiera traerse la tabla
-- entera (id, email, full_name, ...). Demostrado por un tester con un GET
-- a /rest/v1/profiles?select=*.
--
-- Despues:
--   - profiles solo deja SELECT a sesiones autenticadas (la RLS sigue
--     activa, pero cualquier auth.uid() puede leer la tabla — necesario
--     para joins de /red, scanner admin, etc).
--   - anon pierde el SELECT directo sobre profiles.
--   - Se expone una vista profiles_public con SOLO columnas seguras
--     (sin email, sin is_admin) que tanto anon como authenticated pueden
--     leer. Las pages publicas (landing, /miembro, command palette,
--     embeds del classified) consumen la vista en vez de la tabla.
--
-- Idempotente: se puede correr varias veces sin romper nada.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Drop la policy permisiva vieja
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2) Quitar el GRANT a anon. authenticated mantiene SELECT/INSERT/UPDATE.
REVOKE SELECT ON public.profiles FROM anon;

-- 3) Nueva policy: solo sesiones autenticadas pueden leer profiles
DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 4) Vista publica — columnas no sensibles. NO incluye email ni is_admin.
--    SECURITY DEFINER (security_invoker = false) para que la vista corra
--    con los permisos de su owner y no aplique la RLS de profiles —
--    esto es deliberado: el filtro de seguridad de la vista es la
--    seleccion de columnas, no RLS por fila.
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
  created_at
FROM public.profiles;

ALTER VIEW public.profiles_public SET (security_invoker = false);

-- IMPORTANTE: la vista en modo definer corre con permisos del owner
-- (postgres) y bypassea la RLS de la tabla base. Si dejaramos los
-- privilegios DML (INSERT/UPDATE/DELETE) que se otorgan por default
-- en supabase a anon/authenticated, cualquier anon podria UPDATE
-- profiles_public SET full_name='X' y modificar TODA la tabla.
-- Por eso revocamos todo y solo regrantamos SELECT.
REVOKE ALL ON public.profiles_public FROM anon, authenticated;
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 5) Hint para que PostgREST resuelva embeds tipo
--    classified_listings.author:profiles_public!author_id(...)
--    inferiendo el FK desde la tabla base profiles.
COMMENT ON VIEW public.profiles_public IS
  'Public-safe slice of profiles (no email, no is_admin). Used by anonymous and unauthenticated reads. Read-only — DML privileges are revoked because the view runs in definer mode and would bypass RLS.';
