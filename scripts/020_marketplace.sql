-- Marketplace de startups — oferta (startups) + demanda (pedidos) + leads.
-- Idempotente. RLS estricto: lo público sale por vistas DEFINER (solo published,
-- sin emails ni decks). Inserts anónimos quedan en `pending` hasta que un
-- admin (Luigi) apruebe. Ver ARCHITECTURE.md § Marketplace.
--
-- Aplicar en el SQL Editor de Supabase (staging primero). No hay seed público:
-- el listado arranca vacío a propósito.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.marketplace_slugify(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT trim(both '-' FROM regexp_replace(
    regexp_replace(
      lower(translate(
        coalesce(input, ''),
        'ÁÀÄÂáàäâÉÈËÊéèëêÍÌÏÎíìïîÓÒÖÔóòöôÚÙÜÛúùüûÑñÇç',
        'AAAAaaaaEEEEeeeeIIIIiiiiOOOOooooUUUUuuuuNnCc'
      )),
      '[^a-z0-9]+',
      '-',
      'g'
    ),
    '-{2,}',
    '-',
    'g'
  ));
$$;

CREATE OR REPLACE FUNCTION public.marketplace_sanitize_founders(input jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  item jsonb;
  cleaned jsonb;
  out jsonb := '[]'::jsonb;
  n int;
  i int;
BEGIN
  IF input IS NULL OR jsonb_typeof(input) <> 'array' THEN
    RETURN '[]'::jsonb;
  END IF;
  n := jsonb_array_length(input);
  IF n > 12 THEN
    n := 12;
  END IF;
  FOR i IN 0 .. n - 1 LOOP
    item := input -> i;
    IF jsonb_typeof(item) <> 'object' THEN
      CONTINUE;
    END IF;
    cleaned := jsonb_strip_nulls(jsonb_build_object(
      'name', nullif(left(btrim(coalesce(item->>'name', '')), 80), ''),
      'role', nullif(left(btrim(coalesce(item->>'role', '')), 80), ''),
      'linkedin', nullif(left(btrim(coalesce(item->>'linkedin', '')), 200), ''),
      'x', nullif(left(btrim(coalesce(item->>'x', '')), 200), '')
    ));
    IF cleaned ? 'name' THEN
      out := out || jsonb_build_array(cleaned);
    END IF;
  END LOOP;
  RETURN out;
END;
$$;

REVOKE ALL ON FUNCTION public.marketplace_slugify(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.marketplace_sanitize_founders(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marketplace_slugify(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.marketplace_sanitize_founders(jsonb) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- marketplace_startups
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_startups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL,
  name            TEXT NOT NULL,
  one_liner       TEXT NOT NULL,
  description     TEXT NOT NULL,
  stage           TEXT NOT NULL
                    CHECK (stage IN ('idea', 'mvp', 'early_revenue', 'growth')),
  tags            TEXT[] NOT NULL DEFAULT '{}',
  city            TEXT NOT NULL DEFAULT 'Mar del Plata',
  website         TEXT,
  logo_url        TEXT,
  founders        JSONB NOT NULL DEFAULT '[]'::jsonb,
  looking_for     TEXT[] NOT NULL DEFAULT '{}',
  ticket_range    TEXT,
  contact_email   TEXT NOT NULL,
  email_lc        TEXT GENERATED ALWAYS AS (lower(contact_email)) STORED,
  contact_phone   TEXT,
  deck_url        TEXT,
  extra_docs_url  TEXT,
  has_deck        BOOLEAN GENERATED ALWAYS AS (
                    deck_url IS NOT NULL AND length(btrim(deck_url)) > 0
                  ) STORED,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  admin_notes     TEXT,
  reviewed_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT marketplace_startups_name_len
    CHECK (char_length(btrim(name)) BETWEEN 2 AND 80),
  CONSTRAINT marketplace_startups_one_liner_len
    CHECK (char_length(one_liner) BETWEEN 1 AND 120),
  CONSTRAINT marketplace_startups_description_len
    CHECK (char_length(description) BETWEEN 1 AND 600),
  CONSTRAINT marketplace_startups_tags_len
    CHECK (cardinality(tags) <= 8),
  CONSTRAINT marketplace_startups_looking_for
    CHECK (looking_for <@ ARRAY['capital','clientes','talento','partners','mentores']::text[]),
  CONSTRAINT marketplace_startups_email_format
    CHECK (contact_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  CONSTRAINT marketplace_startups_founders_array
    CHECK (jsonb_typeof(founders) = 'array'),
  CONSTRAINT marketplace_startups_website_url
    CHECK (website IS NULL OR website ~* '^https?://'),
  CONSTRAINT marketplace_startups_logo_url
    CHECK (logo_url IS NULL OR logo_url ~* '^https?://'),
  CONSTRAINT marketplace_startups_deck_url
    CHECK (deck_url IS NULL OR deck_url ~* '^https?://'),
  CONSTRAINT marketplace_startups_docs_url
    CHECK (extra_docs_url IS NULL OR extra_docs_url ~* '^https?://')
);

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_startups_slug_idx
  ON public.marketplace_startups (slug);

CREATE INDEX IF NOT EXISTS marketplace_startups_status_idx
  ON public.marketplace_startups (status, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_startups_email_day_idx
  ON public.marketplace_startups (
    email_lc,
    ((timezone('America/Argentina/Buenos_Aires', created_at))::date)
  )
  WHERE status IN ('pending', 'published');

CREATE OR REPLACE FUNCTION public.marketplace_startups_before_write()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  base text;
  candidate text;
  i int := 2;
BEGIN
  NEW.name := btrim(NEW.name);
  NEW.one_liner := btrim(NEW.one_liner);
  NEW.description := btrim(NEW.description);
  NEW.city := coalesce(nullif(btrim(NEW.city), ''), 'Mar del Plata');
  NEW.contact_email := lower(btrim(NEW.contact_email));
  NEW.founders := public.marketplace_sanitize_founders(NEW.founders);
  NEW.tags := coalesce(NEW.tags, '{}');
  NEW.looking_for := coalesce(NEW.looking_for, '{}');

  IF NEW.id IS NULL THEN
    NEW.id := gen_random_uuid();
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    NEW.admin_notes := NULL;
    NEW.reviewed_by := NULL;
    NEW.reviewed_at := NULL;
    NEW.published_at := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN
      NEW.reviewed_at := coalesce(NEW.reviewed_at, now());
      NEW.reviewed_by := coalesce(NEW.reviewed_by, auth.uid());
      NEW.published_at := coalesce(NEW.published_at, now());
    END IF;
    IF NEW.status IS DISTINCT FROM 'published' THEN
      NEW.published_at := NULL;
    END IF;
  END IF;

  IF NEW.slug IS NULL OR btrim(NEW.slug) = '' OR TG_OP = 'INSERT' THEN
    base := public.marketplace_slugify(NEW.name);
    IF base IS NULL OR base = '' THEN
      base := 'startup';
    END IF;
    candidate := base;
    WHILE EXISTS (
      SELECT 1 FROM public.marketplace_startups s
      WHERE s.slug = candidate AND s.id IS DISTINCT FROM NEW.id
    ) LOOP
      candidate := base || '-' || i::text;
      i := i + 1;
    END LOOP;
    NEW.slug := candidate;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS marketplace_startups_before_write ON public.marketplace_startups;
CREATE TRIGGER marketplace_startups_before_write
  BEFORE INSERT OR UPDATE ON public.marketplace_startups
  FOR EACH ROW EXECUTE FUNCTION public.marketplace_startups_before_write();

ALTER TABLE public.marketplace_startups ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.marketplace_startups FROM PUBLIC;
REVOKE ALL ON public.marketplace_startups FROM anon, authenticated;

GRANT INSERT (
  name, one_liner, description, stage, tags, city, website, logo_url,
  founders, looking_for, ticket_range, contact_email, contact_phone,
  deck_url, extra_docs_url
) ON public.marketplace_startups TO anon, authenticated;

GRANT SELECT, UPDATE, DELETE ON public.marketplace_startups TO authenticated;

DROP POLICY IF EXISTS marketplace_startups_insert_pending ON public.marketplace_startups;
CREATE POLICY marketplace_startups_insert_pending
  ON public.marketplace_startups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS marketplace_startups_admin_select ON public.marketplace_startups;
CREATE POLICY marketplace_startups_admin_select
  ON public.marketplace_startups
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS marketplace_startups_admin_update ON public.marketplace_startups;
CREATE POLICY marketplace_startups_admin_update
  ON public.marketplace_startups
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS marketplace_startups_admin_delete ON public.marketplace_startups;
CREATE POLICY marketplace_startups_admin_delete
  ON public.marketplace_startups
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Vista pública: SECURITY DEFINER a propósito. Anon no tiene SELECT sobre la
-- tabla base (para no filtrar emails). La vista solo proyecta columnas públicas
-- de filas `published`. No agregar columnas privadas acá.
CREATE OR REPLACE VIEW public.marketplace_startups_public
WITH (security_invoker = false) AS
SELECT
  id,
  slug,
  name,
  one_liner,
  description,
  stage,
  tags,
  city,
  website,
  logo_url,
  founders,
  looking_for,
  ticket_range,
  has_deck,
  published_at,
  created_at
FROM public.marketplace_startups
WHERE status = 'published';

REVOKE ALL ON public.marketplace_startups_public FROM PUBLIC;
GRANT SELECT ON public.marketplace_startups_public TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- marketplace_pedidos
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_pedidos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  kind                TEXT NOT NULL
                        CHECK (kind IN (
                          'invertiria',
                          'necesito_producto',
                          'busco_cofounder',
                          'corporate_challenge',
                          'otro'
                        )),
  description         TEXT NOT NULL,
  publisher_display   TEXT NOT NULL,
  organization        TEXT,
  tags                TEXT[] NOT NULL DEFAULT '{}',
  budget              TEXT,
  deadline            TEXT,
  preferred_contact   TEXT NOT NULL DEFAULT 'email_via_platform'
                        CHECK (preferred_contact IN ('email_via_platform', 'form_reply')),
  contact_email       TEXT NOT NULL,
  email_lc            TEXT GENERATED ALWAYS AS (lower(contact_email)) STORED,
  linkedin_url        TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  admin_notes         TEXT,
  reviewed_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at         TIMESTAMPTZ,
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT marketplace_pedidos_title_len
    CHECK (char_length(btrim(title)) BETWEEN 4 AND 140),
  CONSTRAINT marketplace_pedidos_description_len
    CHECK (char_length(description) BETWEEN 20 AND 2000),
  CONSTRAINT marketplace_pedidos_publisher_len
    CHECK (char_length(btrim(publisher_display)) BETWEEN 2 AND 80),
  CONSTRAINT marketplace_pedidos_tags_len
    CHECK (cardinality(tags) <= 8),
  CONSTRAINT marketplace_pedidos_email_format
    CHECK (contact_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  CONSTRAINT marketplace_pedidos_linkedin_url
    CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://')
);

CREATE INDEX IF NOT EXISTS marketplace_pedidos_status_idx
  ON public.marketplace_pedidos (status, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_pedidos_email_day_idx
  ON public.marketplace_pedidos (
    email_lc,
    ((timezone('America/Argentina/Buenos_Aires', created_at))::date)
  )
  WHERE status IN ('pending', 'published');

CREATE OR REPLACE FUNCTION public.marketplace_pedidos_before_write()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.title := btrim(NEW.title);
  NEW.description := btrim(NEW.description);
  NEW.publisher_display := btrim(NEW.publisher_display);
  NEW.contact_email := lower(btrim(NEW.contact_email));
  NEW.tags := coalesce(NEW.tags, '{}');

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    NEW.admin_notes := NULL;
    NEW.reviewed_by := NULL;
    NEW.reviewed_at := NULL;
    NEW.published_at := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published' THEN
      NEW.reviewed_at := coalesce(NEW.reviewed_at, now());
      NEW.reviewed_by := coalesce(NEW.reviewed_by, auth.uid());
      NEW.published_at := coalesce(NEW.published_at, now());
    END IF;
    IF NEW.status IS DISTINCT FROM 'published' THEN
      NEW.published_at := NULL;
    END IF;
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS marketplace_pedidos_before_write ON public.marketplace_pedidos;
CREATE TRIGGER marketplace_pedidos_before_write
  BEFORE INSERT OR UPDATE ON public.marketplace_pedidos
  FOR EACH ROW EXECUTE FUNCTION public.marketplace_pedidos_before_write();

ALTER TABLE public.marketplace_pedidos ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.marketplace_pedidos FROM PUBLIC;
REVOKE ALL ON public.marketplace_pedidos FROM anon, authenticated;

GRANT INSERT (
  title, kind, description, publisher_display, organization, tags,
  budget, deadline, preferred_contact, contact_email, linkedin_url
) ON public.marketplace_pedidos TO anon, authenticated;

GRANT SELECT, UPDATE, DELETE ON public.marketplace_pedidos TO authenticated;

DROP POLICY IF EXISTS marketplace_pedidos_insert_pending ON public.marketplace_pedidos;
CREATE POLICY marketplace_pedidos_insert_pending
  ON public.marketplace_pedidos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS marketplace_pedidos_admin_select ON public.marketplace_pedidos;
CREATE POLICY marketplace_pedidos_admin_select
  ON public.marketplace_pedidos
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS marketplace_pedidos_admin_update ON public.marketplace_pedidos;
CREATE POLICY marketplace_pedidos_admin_update
  ON public.marketplace_pedidos
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS marketplace_pedidos_admin_delete ON public.marketplace_pedidos;
CREATE POLICY marketplace_pedidos_admin_delete
  ON public.marketplace_pedidos
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE VIEW public.marketplace_pedidos_public
WITH (security_invoker = false) AS
SELECT
  id,
  title,
  kind,
  description,
  publisher_display,
  organization,
  tags,
  budget,
  deadline,
  preferred_contact,
  published_at,
  created_at
FROM public.marketplace_pedidos
WHERE status = 'published';

REVOKE ALL ON public.marketplace_pedidos_public FROM PUBLIC;
GRANT SELECT ON public.marketplace_pedidos_public TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.marketplace_startup_is_published(p_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.marketplace_startups s
    WHERE s.id = p_id AND s.status = 'published'
  );
$$;

CREATE OR REPLACE FUNCTION public.marketplace_pedido_is_published(p_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.marketplace_pedidos p
    WHERE p.id = p_id AND p.status = 'published'
  );
$$;

REVOKE ALL ON FUNCTION public.marketplace_startup_is_published(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.marketplace_pedido_is_published(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marketplace_startup_is_published(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.marketplace_pedido_is_published(uuid) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- marketplace_leads (Contactar / Pedir deck / Me interesa)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind          TEXT NOT NULL
                  CHECK (kind IN ('startup_contact', 'startup_deck', 'pedido_interest')),
  startup_id    UUID REFERENCES public.marketplace_startups(id) ON DELETE CASCADE,
  pedido_id     UUID REFERENCES public.marketplace_pedidos(id) ON DELETE CASCADE,
  from_name     TEXT NOT NULL,
  from_email    TEXT NOT NULL,
  message       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'notified', 'archived')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT marketplace_leads_name_len
    CHECK (char_length(btrim(from_name)) BETWEEN 2 AND 80),
  CONSTRAINT marketplace_leads_message_len
    CHECK (char_length(btrim(message)) BETWEEN 10 AND 1000),
  CONSTRAINT marketplace_leads_email_format
    CHECK (from_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  CONSTRAINT marketplace_leads_target
    CHECK (
      (kind IN ('startup_contact', 'startup_deck') AND startup_id IS NOT NULL AND pedido_id IS NULL)
      OR
      (kind = 'pedido_interest' AND pedido_id IS NOT NULL AND startup_id IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS marketplace_leads_created_idx
  ON public.marketplace_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS marketplace_leads_startup_idx
  ON public.marketplace_leads (startup_id)
  WHERE startup_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS marketplace_leads_pedido_idx
  ON public.marketplace_leads (pedido_id)
  WHERE pedido_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.marketplace_leads_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.from_name := btrim(NEW.from_name);
  NEW.from_email := lower(btrim(NEW.from_email));
  NEW.message := btrim(NEW.message);
  NEW.status := 'new';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS marketplace_leads_before_insert ON public.marketplace_leads;
CREATE TRIGGER marketplace_leads_before_insert
  BEFORE INSERT ON public.marketplace_leads
  FOR EACH ROW EXECUTE FUNCTION public.marketplace_leads_before_insert();

ALTER TABLE public.marketplace_leads ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.marketplace_leads FROM PUBLIC;
REVOKE ALL ON public.marketplace_leads FROM anon, authenticated;

GRANT INSERT (
  kind, startup_id, pedido_id, from_name, from_email, message
) ON public.marketplace_leads TO anon, authenticated;

GRANT SELECT, UPDATE, DELETE ON public.marketplace_leads TO authenticated;

DROP POLICY IF EXISTS marketplace_leads_insert_published ON public.marketplace_leads;
CREATE POLICY marketplace_leads_insert_published
  ON public.marketplace_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND (
      (
        kind IN ('startup_contact', 'startup_deck')
        AND public.marketplace_startup_is_published(startup_id)
      )
      OR
      (
        kind = 'pedido_interest'
        AND public.marketplace_pedido_is_published(pedido_id)
      )
    )
  );

DROP POLICY IF EXISTS marketplace_leads_admin_select ON public.marketplace_leads;
CREATE POLICY marketplace_leads_admin_select
  ON public.marketplace_leads
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS marketplace_leads_admin_update ON public.marketplace_leads;
CREATE POLICY marketplace_leads_admin_update
  ON public.marketplace_leads
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS marketplace_leads_admin_delete ON public.marketplace_leads;
CREATE POLICY marketplace_leads_admin_delete
  ON public.marketplace_leads
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
