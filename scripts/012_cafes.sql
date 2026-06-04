-- Cafés aptos a nómades digitales (cafés + votos lobito + comodidades)
-- Ejecutar en el SQL editor de Supabase (o como migración).

CREATE TABLE IF NOT EXISTS public.cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  neighborhood TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  google_place_id TEXT UNIQUE,
  google_rating NUMERIC,
  google_reviews_count INTEGER,
  maps_url TEXT,
  source TEXT NOT NULL CHECK (source IN ('seed', 'community')),
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cafes_neighborhood ON public.cafes (neighborhood);
CREATE INDEX IF NOT EXISTS idx_cafes_source ON public.cafes (source);
CREATE INDEX IF NOT EXISTS idx_cafes_added_by ON public.cafes (added_by);

CREATE TABLE IF NOT EXISTS public.cafe_votes (
  cafe_id UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (1, -1)),
  has_wifi BOOLEAN,
  has_power BOOLEAN,
  good_seating BOOLEAN,
  is_quiet BOOLEAN,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (cafe_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cafe_votes_cafe ON public.cafe_votes (cafe_id);

-- Vista de agregación (lectura pública vía security_invoker sobre tablas públicas)
CREATE OR REPLACE VIEW public.cafe_scores
WITH (security_invoker = true) AS
SELECT
  c.id AS cafe_id,
  COALESCE(SUM(v.vote), 0)                              AS net_votes,
  COUNT(*) FILTER (WHERE v.vote = 1)                    AS up_count,
  COUNT(*) FILTER (WHERE v.vote = -1)                   AS down_count,
  COUNT(v.user_id)                                      AS votes_count,
  COUNT(*) FILTER (WHERE v.has_wifi)                    AS wifi_count,
  COUNT(*) FILTER (WHERE v.has_power)                   AS power_count,
  COUNT(*) FILTER (WHERE v.good_seating)                AS seating_count,
  COUNT(*) FILTER (WHERE v.is_quiet)                    AS quiet_count
FROM public.cafes c
LEFT JOIN public.cafe_votes v ON v.cafe_id = c.id
GROUP BY c.id;

-- Triggers updated_at. La función public.set_updated_at() ya está definida en
-- 001_create_profiles_and_events.sql (la usan profiles/events) con cuerpo idéntico;
-- no la redefinimos acá para no pisar la versión existente.
DROP TRIGGER IF EXISTS set_cafes_updated_at ON public.cafes;
CREATE TRIGGER set_cafes_updated_at
  BEFORE UPDATE ON public.cafes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_cafe_votes_updated_at ON public.cafe_votes;
CREATE TRIGGER set_cafe_votes_updated_at
  BEFORE UPDATE ON public.cafe_votes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_votes ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.cafes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cafes TO authenticated;
GRANT SELECT ON public.cafe_votes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cafe_votes TO authenticated;
GRANT SELECT ON public.cafe_scores TO anon, authenticated;

-- cafes: lectura pública
DROP POLICY IF EXISTS "cafes_select" ON public.cafes;
CREATE POLICY "cafes_select" ON public.cafes
  FOR SELECT USING (true);

-- cafes: alta solo logueado, como community y a nombre propio
DROP POLICY IF EXISTS "cafes_insert" ON public.cafes;
CREATE POLICY "cafes_insert" ON public.cafes
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND source = 'community'
    AND added_by = auth.uid()
  );

-- cafes: editar/borrar dueño (sin poder cambiar source a 'seed') o admin
DROP POLICY IF EXISTS "cafes_update" ON public.cafes;
CREATE POLICY "cafes_update" ON public.cafes
  FOR UPDATE USING (added_by = auth.uid() OR public.is_admin())
  WITH CHECK (
    (added_by = auth.uid() AND source = 'community')
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "cafes_delete" ON public.cafes;
CREATE POLICY "cafes_delete" ON public.cafes
  FOR DELETE USING (added_by = auth.uid() OR public.is_admin());

-- cafe_votes: lectura pública
DROP POLICY IF EXISTS "cafe_votes_select" ON public.cafe_votes;
CREATE POLICY "cafe_votes_select" ON public.cafe_votes
  FOR SELECT USING (true);

-- cafe_votes: escribir/editar/borrar solo el voto propio
DROP POLICY IF EXISTS "cafe_votes_insert" ON public.cafe_votes;
CREATE POLICY "cafe_votes_insert" ON public.cafe_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

DROP POLICY IF EXISTS "cafe_votes_update" ON public.cafe_votes;
CREATE POLICY "cafe_votes_update" ON public.cafe_votes
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cafe_votes_delete" ON public.cafe_votes;
CREATE POLICY "cafe_votes_delete" ON public.cafe_votes
  FOR DELETE USING (user_id = auth.uid());
