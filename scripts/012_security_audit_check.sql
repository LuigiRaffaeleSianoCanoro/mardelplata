-- ─────────────────────────────────────────────────────────────────────────────
-- 012_security_audit_check.sql
--
-- Diagnóstico read-only del estado de seguridad de public.profiles.
-- Correr en Supabase SQL Editor o via scripts/run-sql.mjs.
-- Idempotente — no modifica datos ni schema.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Policies activas en profiles
SELECT
  policyname,
  cmd,
  roles,
  qual AS using_expr,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 2) Grants de tabla profiles por rol
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY grantee, privilege_type;

-- 3) Grants de la vista profiles_public
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'profiles_public'
ORDER BY grantee, privilege_type;

-- 4) Checks booleanos (esperado post-hardening)
SELECT
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'profiles_update_own_no_escalation'
  ) AS has_no_escalation_update,

  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'Users can update own profile'
  ) AS has_legacy_permissive_update,

  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'Public profiles are viewable by everyone'
  ) AS has_legacy_public_select,

  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'profiles_insert_own_no_admin'
  ) AS has_insert_no_admin,

  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'profiles_admin_update_others'
  ) AS has_admin_update_others,

  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'profiles_admin_delete_others'
  ) AS has_admin_delete_others,

  EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' AND table_name = 'profiles_public'
  ) AS has_profiles_public_view,

  NOT has_table_privilege('anon', 'public.profiles', 'SELECT') AS anon_select_revoked;

-- 5) Conteo de admins actuales (solo metadata, no PII)
SELECT count(*) FILTER (WHERE is_admin) AS admin_count,
       count(*) AS total_profiles
FROM public.profiles;
