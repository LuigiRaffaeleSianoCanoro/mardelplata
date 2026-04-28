-- Red — proyectos open-source colectivos, ideas y módulos.
-- Reglas clave (ver docs/red.md):
--   • Sin owner. Autoridad = project_contributors. Maintainer arranca en null.
--   • Las ideas no se convierten en projects, se linkean.
--   • Followers solo siguen, no editan.

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'paused', 'archived')),
  repo_url    TEXT,
  demo_url    TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT TRUE,
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_status_idx     ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_is_public_idx  ON public.projects(is_public);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects(created_at DESC);

CREATE TABLE IF NOT EXISTS public.project_followers (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

CREATE INDEX IF NOT EXISTS project_followers_user_idx ON public.project_followers(user_id);

CREATE TABLE IF NOT EXISTS public.project_contributors (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'contributor'
              CHECK (role IN ('contributor', 'maintainer')),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

CREATE INDEX IF NOT EXISTS project_contributors_user_idx ON public.project_contributors(user_id);

CREATE TABLE IF NOT EXISTS public.project_changes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('feature', 'fix', 'chore', 'note')),
  title      TEXT NOT NULL,
  body       TEXT,
  ref_url    TEXT,
  author_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_changes_project_idx ON public.project_changes(project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.project_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES public.project_comments(id) ON DELETE CASCADE,
  author_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS project_comments_project_idx ON public.project_comments(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS project_comments_parent_idx  ON public.project_comments(parent_id);

-- ============================================================
-- IDEAS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ideas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  tags        TEXT[] NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'open'
              CHECK (status IN ('open', 'active', 'archived')),
  created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ideas_status_idx     ON public.ideas(status);
CREATE INDEX IF NOT EXISTS ideas_created_at_idx ON public.ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS ideas_tags_idx       ON public.ideas USING gin(tags);

CREATE TABLE IF NOT EXISTS public.idea_followers (
  idea_id    UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idea_id, user_id)
);

CREATE INDEX IF NOT EXISTS idea_followers_user_idx ON public.idea_followers(user_id);

CREATE TABLE IF NOT EXISTS public.idea_projects (
  idea_id    UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  link_type  TEXT NOT NULL CHECK (link_type IN ('related', 'implements')),
  linked_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  linked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idea_id, project_id)
);

CREATE INDEX IF NOT EXISTS idea_projects_project_idx ON public.idea_projects(project_id);

-- Trigger: cuando aparece un link 'implements' a una idea, pasa su status a 'active'.
CREATE OR REPLACE FUNCTION public.idea_status_from_links() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.link_type = 'implements' THEN
    UPDATE public.ideas
       SET status = 'active', updated_at = NOW()
     WHERE id = NEW.idea_id AND status = 'open';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS idea_status_from_links_trg ON public.idea_projects;
CREATE TRIGGER idea_status_from_links_trg
AFTER INSERT ON public.idea_projects
FOR EACH ROW EXECUTE FUNCTION public.idea_status_from_links();

-- ============================================================
-- updated_at triggers
-- ============================================================

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_touch_updated_at ON public.projects;
CREATE TRIGGER projects_touch_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS ideas_touch_updated_at ON public.ideas;
CREATE TRIGGER ideas_touch_updated_at
BEFORE UPDATE ON public.ideas
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS project_comments_touch_updated_at ON public.project_comments;
CREATE TRIGGER project_comments_touch_updated_at
BEFORE UPDATE ON public.project_comments
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.projects              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_followers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contributors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_changes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_followers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_projects         ENABLE ROW LEVEL SECURITY;

-- Helper: ¿el usuario es contributor del project?
CREATE OR REPLACE FUNCTION public.is_project_contributor(p UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_contributors
    WHERE project_id = p AND user_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: ¿es maintainer?
CREATE OR REPLACE FUNCTION public.is_project_maintainer(p UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_contributors
    WHERE project_id = p AND user_id = auth.uid() AND role = 'maintainer'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ----- projects -----
DROP POLICY IF EXISTS projects_select  ON public.projects;
DROP POLICY IF EXISTS projects_insert  ON public.projects;
DROP POLICY IF EXISTS projects_update  ON public.projects;
DROP POLICY IF EXISTS projects_delete  ON public.projects;

CREATE POLICY projects_select ON public.projects FOR SELECT
  USING (is_public OR public.is_project_contributor(id));
CREATE POLICY projects_insert ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY projects_update ON public.projects FOR UPDATE
  USING (public.is_project_contributor(id))
  WITH CHECK (public.is_project_contributor(id));
CREATE POLICY projects_delete ON public.projects FOR DELETE
  USING (public.is_project_maintainer(id));

-- ----- project_contributors -----
DROP POLICY IF EXISTS contributors_select ON public.project_contributors;
DROP POLICY IF EXISTS contributors_insert ON public.project_contributors;
DROP POLICY IF EXISTS contributors_update ON public.project_contributors;
DROP POLICY IF EXISTS contributors_delete ON public.project_contributors;

CREATE POLICY contributors_select ON public.project_contributors FOR SELECT
  USING (TRUE);
CREATE POLICY contributors_insert ON public.project_contributors FOR INSERT
  WITH CHECK (auth.uid() = user_id);
-- Promover a maintainer: otro maintainer existente, o si no hay ninguno aún, cualquier contributor.
CREATE POLICY contributors_update ON public.project_contributors FOR UPDATE
  USING (
    public.is_project_maintainer(project_id)
    OR (public.is_project_contributor(project_id)
        AND NOT EXISTS (
          SELECT 1 FROM public.project_contributors pc
           WHERE pc.project_id = project_contributors.project_id AND pc.role = 'maintainer'
        ))
  )
  WITH CHECK (
    public.is_project_maintainer(project_id)
    OR (public.is_project_contributor(project_id)
        AND NOT EXISTS (
          SELECT 1 FROM public.project_contributors pc
           WHERE pc.project_id = project_contributors.project_id AND pc.role = 'maintainer'
        ))
  );
CREATE POLICY contributors_delete ON public.project_contributors FOR DELETE
  USING (auth.uid() = user_id OR public.is_project_maintainer(project_id));

-- ----- project_followers -----
DROP POLICY IF EXISTS followers_select ON public.project_followers;
DROP POLICY IF EXISTS followers_insert ON public.project_followers;
DROP POLICY IF EXISTS followers_delete ON public.project_followers;

CREATE POLICY followers_select ON public.project_followers FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY followers_insert ON public.project_followers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY followers_delete ON public.project_followers FOR DELETE
  USING (auth.uid() = user_id);

-- ----- project_changes -----
DROP POLICY IF EXISTS changes_select ON public.project_changes;
DROP POLICY IF EXISTS changes_insert ON public.project_changes;
DROP POLICY IF EXISTS changes_update ON public.project_changes;
DROP POLICY IF EXISTS changes_delete ON public.project_changes;

CREATE POLICY changes_select ON public.project_changes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p
             WHERE p.id = project_id AND (p.is_public OR public.is_project_contributor(p.id)))
  );
CREATE POLICY changes_insert ON public.project_changes FOR INSERT
  WITH CHECK (public.is_project_contributor(project_id) AND auth.uid() = author_id);
CREATE POLICY changes_update ON public.project_changes FOR UPDATE
  USING (auth.uid() = author_id OR public.is_project_maintainer(project_id));
CREATE POLICY changes_delete ON public.project_changes FOR DELETE
  USING (auth.uid() = author_id OR public.is_project_maintainer(project_id));

-- ----- project_comments -----
DROP POLICY IF EXISTS comments_select ON public.project_comments;
DROP POLICY IF EXISTS comments_insert ON public.project_comments;
DROP POLICY IF EXISTS comments_update ON public.project_comments;
DROP POLICY IF EXISTS comments_delete ON public.project_comments;

CREATE POLICY comments_select ON public.project_comments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.projects p
             WHERE p.id = project_id AND (p.is_public OR public.is_project_contributor(p.id)))
  );
CREATE POLICY comments_insert ON public.project_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY comments_update ON public.project_comments FOR UPDATE
  USING (auth.uid() = author_id);
CREATE POLICY comments_delete ON public.project_comments FOR DELETE
  USING (auth.uid() = author_id OR public.is_project_maintainer(project_id));

-- ----- ideas -----
DROP POLICY IF EXISTS ideas_select ON public.ideas;
DROP POLICY IF EXISTS ideas_insert ON public.ideas;
DROP POLICY IF EXISTS ideas_update ON public.ideas;
DROP POLICY IF EXISTS ideas_delete ON public.ideas;

CREATE POLICY ideas_select ON public.ideas FOR SELECT USING (TRUE);
CREATE POLICY ideas_insert ON public.ideas FOR INSERT
  WITH CHECK (auth.uid() = created_by);
-- Editar idea: el creador, o cualquier contributor de un project linkeado con 'implements'.
CREATE POLICY ideas_update ON public.ideas FOR UPDATE
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM public.idea_projects ip
        JOIN public.project_contributors pc ON pc.project_id = ip.project_id
       WHERE ip.idea_id = ideas.id AND ip.link_type = 'implements' AND pc.user_id = auth.uid()
    )
  );
CREATE POLICY ideas_delete ON public.ideas FOR DELETE
  USING (auth.uid() = created_by);

-- ----- idea_followers -----
DROP POLICY IF EXISTS idea_followers_select ON public.idea_followers;
DROP POLICY IF EXISTS idea_followers_insert ON public.idea_followers;
DROP POLICY IF EXISTS idea_followers_delete ON public.idea_followers;

CREATE POLICY idea_followers_select ON public.idea_followers FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY idea_followers_insert ON public.idea_followers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY idea_followers_delete ON public.idea_followers FOR DELETE
  USING (auth.uid() = user_id);

-- ----- idea_projects -----
DROP POLICY IF EXISTS idea_projects_select ON public.idea_projects;
DROP POLICY IF EXISTS idea_projects_insert ON public.idea_projects;
DROP POLICY IF EXISTS idea_projects_delete ON public.idea_projects;

CREATE POLICY idea_projects_select ON public.idea_projects FOR SELECT USING (TRUE);
CREATE POLICY idea_projects_insert ON public.idea_projects FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY idea_projects_delete ON public.idea_projects FOR DELETE
  USING (
    auth.uid() = linked_by
    OR public.is_project_contributor(project_id)
    OR EXISTS (SELECT 1 FROM public.ideas WHERE id = idea_id AND created_by = auth.uid())
  );

-- ============================================================
-- Auto-add creator as contributor (no maintainer)
-- ============================================================

CREATE OR REPLACE FUNCTION public.project_creator_as_contributor() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO public.project_contributors (project_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'contributor')
    ON CONFLICT (project_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS projects_creator_as_contributor_trg ON public.projects;
CREATE TRIGGER projects_creator_as_contributor_trg
AFTER INSERT ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.project_creator_as_contributor();
