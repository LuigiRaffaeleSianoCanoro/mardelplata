-- [DEPRECADO] Superado por la convergencia sobre las tablas `cafes` + `cafe_votes`
-- (alta self-service con source='community' y votos por usuario). Esta tabla quedó
-- sin uso en la app; se puede DROP cuando quieras. Se mantiene el archivo por
-- historial de migraciones. Ver scripts/015_cafes_public_view.sql.
--
-- Work spots (cafés / coworkings) — sugerencias de la comunidad.
-- Mismo patrón que newsletter_subscribers (008): solo INSERT público (anon),
-- las lecturas/moderación las hace el admin vía service_role offline. Las
-- sugerencias aprobadas se curan luego al JSON src/content/nomad/work-spots.json
-- (o a un listado Supabase en F3c). Ver docs/nomad-it-hub/02-feature-plan.md §F3.

CREATE TABLE IF NOT EXISTS public.work_spot_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  kind         TEXT NOT NULL DEFAULT 'cafe'
               CHECK (kind IN ('cafe', 'coworking', 'biblioteca', 'hotel', 'otro')),
  address      TEXT,
  zona         TEXT,
  wifi         BOOLEAN,
  outlets      BOOLEAN,
  notes        TEXT,
  submitter    TEXT,                                  -- contacto opcional de quien sugiere
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS work_spot_submissions_created_at_idx
  ON public.work_spot_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS work_spot_submissions_status_idx
  ON public.work_spot_submissions(status);

ALTER TABLE public.work_spot_submissions ENABLE ROW LEVEL SECURITY;

-- anon/authenticated pueden INSERT (form público). Nadie SELECT/UPDATE/DELETE
-- excepto service_role (que pasa por arriba de RLS).
GRANT INSERT ON public.work_spot_submissions TO anon, authenticated;

DROP POLICY IF EXISTS work_spot_submissions_insert ON public.work_spot_submissions;
CREATE POLICY work_spot_submissions_insert
  ON public.work_spot_submissions FOR INSERT
  WITH CHECK (true);
