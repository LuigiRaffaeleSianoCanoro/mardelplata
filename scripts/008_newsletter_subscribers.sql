-- Newsletter — captura simple del form del footer.
-- Solo INSERT publico (anon role); las lecturas/updates las hace el
-- admin via service_role offline (export, sync con Resend, etc).

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  email_lc   TEXT NOT NULL GENERATED ALWAYS AS (lower(email)) STORED,
  source     TEXT,
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT newsletter_subscribers_email_format
    CHECK (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

-- Unique sobre email_lc — ON CONFLICT (email_lc) lo hace idempotente.
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_lc_idx
  ON public.newsletter_subscribers(email_lc);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx
  ON public.newsletter_subscribers(created_at DESC);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- anon puede INSERT (form publico). Nadie SELECT/UPDATE/DELETE excepto
-- service_role (que pasa por arriba de RLS).
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;

DROP POLICY IF EXISTS newsletter_subscribers_insert ON public.newsletter_subscribers;
CREATE POLICY newsletter_subscribers_insert
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);
