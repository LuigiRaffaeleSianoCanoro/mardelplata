-- Red — módulos: piezas reusables (componentes, helpers, hooks, patterns,
-- integraciones, snippets) que cualquier proyecto de la red puede declarar
-- que está usando. Sin tabla module_versions — la version es texto libre y
-- vive en el módulo. Si después hace falta versionado real se agrega aparte.
--
-- Reglas:
--   • Cualquier user autenticado puede crear un módulo (es de la red).
--   • Solo contributors del proyecto pueden declarar/quitar el uso.
--   • Si is_public = false, lo ven solo contributors de algún proyecto que
--     ya lo esté usando + el creador.

-- ============================================================
-- MODULES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  kind        TEXT NOT NULL DEFAULT 'component'
              CHECK (kind IN ('component', 'helper', 'hook', 'pattern', 'integration', 'snippet')),
  version     TEXT,
  source_url  TEXT,
  license     TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT TRUE,
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS modules_kind_idx       ON public.modules(kind);
CREATE INDEX IF NOT EXISTS modules_is_public_idx  ON public.modules(is_public);
CREATE INDEX IF NOT EXISTS modules_created_at_idx ON public.modules(created_at DESC);

-- ============================================================
-- MODULE_USAGES — relación N:M project ↔ module
-- ============================================================

CREATE TABLE IF NOT EXISTS public.module_usages (
  project_id   UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  module_id    UUID NOT NULL REFERENCES public.modules(id)  ON DELETE CASCADE,
  declared_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  declared_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note         TEXT,
  PRIMARY KEY (project_id, module_id)
);

CREATE INDEX IF NOT EXISTS module_usages_module_idx  ON public.module_usages(module_id);
CREATE INDEX IF NOT EXISTS module_usages_project_idx ON public.module_usages(project_id);

-- ============================================================
-- updated_at trigger
-- ============================================================

DROP TRIGGER IF EXISTS modules_touch_updated_at ON public.modules;
CREATE TRIGGER modules_touch_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.modules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_usages ENABLE ROW LEVEL SECURITY;

-- ----- modules -----
DROP POLICY IF EXISTS modules_select ON public.modules;
DROP POLICY IF EXISTS modules_insert ON public.modules;
DROP POLICY IF EXISTS modules_update ON public.modules;
DROP POLICY IF EXISTS modules_delete ON public.modules;

CREATE POLICY modules_select ON public.modules FOR SELECT
  USING (
    is_public
    OR auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM public.module_usages mu
      WHERE mu.module_id = modules.id
        AND public.is_project_contributor(mu.project_id)
    )
  );
CREATE POLICY modules_insert ON public.modules FOR INSERT
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY modules_update ON public.modules FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY modules_delete ON public.modules FOR DELETE
  USING (auth.uid() = created_by);

-- ----- module_usages -----
DROP POLICY IF EXISTS module_usages_select ON public.module_usages;
DROP POLICY IF EXISTS module_usages_insert ON public.module_usages;
DROP POLICY IF EXISTS module_usages_delete ON public.module_usages;

-- Lectura: cualquier visitante autenticado puede ver qué módulos usa cada
-- proyecto público; para proyectos privados, solo sus contributors.
CREATE POLICY module_usages_select ON public.module_usages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = module_usages.project_id
        AND (p.is_public OR public.is_project_contributor(p.id))
    )
  );

-- Solo contributors del proyecto pueden declarar uso.
CREATE POLICY module_usages_insert ON public.module_usages FOR INSERT
  WITH CHECK (
    public.is_project_contributor(project_id)
    AND auth.uid() = declared_by
  );

CREATE POLICY module_usages_delete ON public.module_usages FOR DELETE
  USING (public.is_project_contributor(project_id));
