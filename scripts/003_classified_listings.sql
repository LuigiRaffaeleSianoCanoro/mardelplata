-- Bolsa de trabajo / clasificados (listings + votos)
-- Ejecutar en el SQL editor de Supabase (o migración).

CREATE TABLE IF NOT EXISTS public.classified_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('job', 'freelance')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  external_url TEXT,
  positions JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_classified_listings_expires ON public.classified_listings (expires_at);
CREATE INDEX IF NOT EXISTS idx_classified_listings_kind ON public.classified_listings (kind);
CREATE INDEX IF NOT EXISTS idx_classified_listings_author ON public.classified_listings (author_id);

CREATE TABLE IF NOT EXISTS public.classified_votes (
  listing_id UUID NOT NULL REFERENCES public.classified_listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (1, -1)),
  PRIMARY KEY (listing_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_classified_votes_listing ON public.classified_votes (listing_id);

ALTER TABLE public.classified_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classified_votes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.classified_listings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classified_votes TO authenticated;

-- Listings: lectura para autenticados — avisos vigentes o propios (p. ej. borrar vencidos)
DROP POLICY IF EXISTS "classified_listings_select" ON public.classified_listings;
CREATE POLICY "classified_listings_select"
  ON public.classified_listings FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      expires_at > NOW()
      OR author_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "classified_listings_insert" ON public.classified_listings;
CREATE POLICY "classified_listings_insert"
  ON public.classified_listings FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND author_id = auth.uid()
  );

DROP POLICY IF EXISTS "classified_listings_delete" ON public.classified_listings;
CREATE POLICY "classified_listings_delete"
  ON public.classified_listings FOR DELETE
  USING (auth.uid() = author_id);

-- Votos: solo sobre avisos vigentes
DROP POLICY IF EXISTS "classified_votes_select" ON public.classified_votes;
CREATE POLICY "classified_votes_select"
  ON public.classified_votes FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.classified_listings cl
      WHERE cl.id = listing_id
        AND (cl.expires_at > NOW() OR cl.author_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "classified_votes_insert" ON public.classified_votes;
CREATE POLICY "classified_votes_insert"
  ON public.classified_votes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.classified_listings cl
      WHERE cl.id = listing_id
        AND cl.expires_at > NOW()
    )
  );

DROP POLICY IF EXISTS "classified_votes_update" ON public.classified_votes;
CREATE POLICY "classified_votes_update"
  ON public.classified_votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "classified_votes_delete" ON public.classified_votes;
CREATE POLICY "classified_votes_delete"
  ON public.classified_votes FOR DELETE
  USING (auth.uid() = user_id);
