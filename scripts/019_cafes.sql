-- Tablas base de cafés/coworkings (F3) + votos comunitarios.
-- Idempotente. Correr antes de 015_cafes_public_view.sql en entornos nuevos.
-- En producción las tablas ya existen con seed; este script documenta el DDL en repo.

-- ---------------------------------------------------------------------------
-- cafes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cafes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  address               TEXT,
  neighborhood          TEXT,
  lat                   DOUBLE PRECISION,
  lng                   DOUBLE PRECISION,
  google_place_id       TEXT,
  google_rating         NUMERIC(2,1),
  google_reviews_count  INTEGER,
  maps_url              TEXT,
  source                TEXT NOT NULL DEFAULT 'seed'
                          CHECK (source IN ('seed', 'community')),
  kind                  TEXT NOT NULL DEFAULT 'cafe'
                          CHECK (kind IN ('cafe', 'cowork')),
  description           TEXT,
  added_by              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cafes_neighborhood_idx ON public.cafes (neighborhood);
CREATE INDEX IF NOT EXISTS cafes_kind_idx ON public.cafes (kind);

-- Trigger updated_at (reusa función si existe de migraciones previas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at'
  ) THEN
    CREATE OR REPLACE FUNCTION public.set_updated_at()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $fn$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $fn$;
  END IF;
END $$;

DROP TRIGGER IF EXISTS set_cafes_updated_at ON public.cafes;
CREATE TRIGGER set_cafes_updated_at
  BEFORE UPDATE ON public.cafes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;

-- Lectura pública de todos los cafés (la vista cafes_public agrega señales)
DROP POLICY IF EXISTS cafes_select_public ON public.cafes;
CREATE POLICY cafes_select_public ON public.cafes
  FOR SELECT TO anon, authenticated
  USING (true);

-- Alta comunitaria: autenticados, source=community, added_by = auth.uid()
DROP POLICY IF EXISTS cafes_insert_community ON public.cafes;
CREATE POLICY cafes_insert_community ON public.cafes
  FOR INSERT TO authenticated
  WITH CHECK (
    source = 'community'
    AND added_by = auth.uid()
  );

-- Solo admin modifica/borra (seed y moderación)
DROP POLICY IF EXISTS cafes_update_admin ON public.cafes;
CREATE POLICY cafes_update_admin ON public.cafes
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS cafes_delete_admin ON public.cafes;
CREATE POLICY cafes_delete_admin ON public.cafes
  FOR DELETE TO authenticated
  USING (public.is_admin());

GRANT SELECT ON public.cafes TO anon, authenticated;
GRANT INSERT ON public.cafes TO authenticated;
GRANT UPDATE, DELETE ON public.cafes TO authenticated;

-- ---------------------------------------------------------------------------
-- cafe_votes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cafe_votes (
  cafe_id       UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote          SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  has_wifi      BOOLEAN NOT NULL DEFAULT false,
  has_power     BOOLEAN NOT NULL DEFAULT false,
  good_seating  BOOLEAN NOT NULL DEFAULT false,
  is_quiet      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (cafe_id, user_id)
);

DROP TRIGGER IF EXISTS set_cafe_votes_updated_at ON public.cafe_votes;
CREATE TRIGGER set_cafe_votes_updated_at
  BEFORE UPDATE ON public.cafe_votes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.cafe_votes ENABLE ROW LEVEL SECURITY;

-- Lectura pública (agregada vía cafes_public)
DROP POLICY IF EXISTS cafe_votes_select_public ON public.cafe_votes;
CREATE POLICY cafe_votes_select_public ON public.cafe_votes
  FOR SELECT TO anon, authenticated
  USING (true);

-- Upsert del voto propio
DROP POLICY IF EXISTS cafe_votes_insert_own ON public.cafe_votes;
CREATE POLICY cafe_votes_insert_own ON public.cafe_votes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS cafe_votes_update_own ON public.cafe_votes;
CREATE POLICY cafe_votes_update_own ON public.cafe_votes
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS cafe_votes_delete_own ON public.cafe_votes;
CREATE POLICY cafe_votes_delete_own ON public.cafe_votes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

GRANT SELECT ON public.cafe_votes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cafe_votes TO authenticated;

-- Después de aplicar este script, correr scripts/015_cafes_public_view.sql
-- si la vista cafes_public aún no existe o hay que recrearla.
