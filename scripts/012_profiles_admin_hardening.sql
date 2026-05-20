-- ─────────────────────────────────────────────────────────────────────────────
-- 012_profiles_admin_hardening.sql
--
-- Endurece profiles más allá de 010/011:
--   - INSERT bloqueado con is_admin = true
--   - Admins pueden UPDATE/DELETE perfiles ajenos (para /admin UI)
--   - SELECT restringido: propia fila + admins ven todo
--   - Trigger handle_new_user() fuerza is_admin = false
--
-- Requiere 010 y 011 aplicados primero. Idempotente.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1) INSERT: no auto-promoción en signup/callback ────────────────────────

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own_no_admin" ON public.profiles;

CREATE POLICY "profiles_insert_own_no_admin"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id AND is_admin = false);

-- ─── 2) SELECT: propia fila + admins ven todo ───────────────────────────────

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ─── 3) Admin: gestionar perfiles ajenos ────────────────────────────────────

DROP POLICY IF EXISTS "profiles_admin_update_others" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_delete_others" ON public.profiles;

GRANT DELETE ON public.profiles TO authenticated;

CREATE POLICY "profiles_admin_update_others"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin() AND auth.uid() != id)
  WITH CHECK (public.is_admin() AND auth.uid() != id);

CREATE POLICY "profiles_admin_delete_others"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin() AND auth.uid() != id);

-- ─── 4) Trigger: perfil nuevo siempre sin admin ─────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, qr_code, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    gen_random_uuid()::TEXT,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
