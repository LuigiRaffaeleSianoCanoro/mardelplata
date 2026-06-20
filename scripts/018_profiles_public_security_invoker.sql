-- ─────────────────────────────────────────────────────────────────────────────
-- 018_profiles_public_security_invoker.sql
--
-- Recrea profiles_public con security_invoker = true (Supabase linter 0010).
-- Antes corría en modo definer y bypasseaba RLS de profiles.
--
-- Modelo nuevo:
--   - Vista invoker → respeta RLS + grants de columnas en profiles.
--   - Policy profiles_select_public (anon + authenticated) permite leer
--     el directorio comunitario.
--   - Grants de columna: solo columnas públicas en profiles para anon/auth.
--     email / is_admin / updated_at NO van por REST directo → evita leak post-010.
--   - Admins listan perfiles completos via RPC admin_list_profiles() (definer).
--
-- Requiere 010–013 aplicados. Idempotente.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS huevsite_username TEXT;

-- ─── 1) Vista pública (columnas seguras) ────────────────────────────────────

CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = true) AS
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

REVOKE ALL ON public.profiles_public FROM anon, authenticated;
GRANT SELECT ON public.profiles_public TO anon, authenticated;

COMMENT ON VIEW public.profiles_public IS
  'Public-safe slice of profiles (no email, no is_admin). security_invoker=true — respeta RLS y grants de columna en profiles.';

-- ─── 2) Lectura pública de filas + columnas seguras en la tabla base ────────

DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Quitar SELECT a nivel tabla; re-grant solo columnas públicas.
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.profiles FROM authenticated;

GRANT SELECT (
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
) ON public.profiles TO anon, authenticated;

-- INSERT/UPDATE/DELETE en profiles siguen con los grants de 001/012 (sin cambios).

-- ─── 3) RPC admin: perfiles completos (incl. email) solo para admins ────────

CREATE OR REPLACE FUNCTION public.admin_list_profiles()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  qr_code TEXT,
  bio TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.qr_code,
    p.bio,
    p.is_admin,
    p.created_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_profiles() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_list_profiles() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_profiles() TO authenticated;
