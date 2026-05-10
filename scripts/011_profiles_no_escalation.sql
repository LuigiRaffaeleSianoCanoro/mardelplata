-- ─────────────────────────────────────────────────────────────────────────────
-- 011_profiles_no_escalation.sql
--
-- Cierra la escalada de privilegios via UPDATE de profiles.
--
-- Antes (script 001):
--   CREATE POLICY "Users can update own profile" ON public.profiles
--     FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
--
-- Problema: el WITH CHECK solo verificaba que sigas siendo el dueño de la
-- fila despues del update. Pero NO chequeaba is_admin. Cualquier usuario
-- autenticado podia ejecutar:
--
--   UPDATE profiles SET is_admin = true WHERE id = auth.uid();
--
-- y promoverse solo a administrador, ganando acceso a /admin y a todas
-- las funciones gated por public.is_admin().
--
-- Ahora: el WITH CHECK exige que is_admin POST-update siga siendo igual
-- al valor PRE-update (consultando la propia tabla). El subquery se
-- evalua en el snapshot pre-statement gracias a MVCC, asi que ve el
-- valor original. Si alguien intenta cambiarlo, el WITH CHECK falla y
-- el UPDATE se rechaza.
--
-- Mismo patron tambien protege `email` (sincronizado desde auth.users
-- por trigger) y `id` (PK, nunca debe cambiar desde el cliente).
--
-- Admins siguen pudiendo togglear is_admin de otros via service_role
-- (que bypassa RLS) — eso es el flujo correcto desde /admin/AdminDashboard.
--
-- Idempotente.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_no_escalation" ON public.profiles;

CREATE POLICY "profiles_update_own_no_escalation"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
    AND email    = (SELECT email    FROM public.profiles WHERE id = auth.uid())
    AND id       = (SELECT id       FROM public.profiles WHERE id = auth.uid())
  );
