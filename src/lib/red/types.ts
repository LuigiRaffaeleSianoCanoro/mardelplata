// Types for the Red feature — projects, ideas, modules. Shape mirrors the
// Supabase tables defined in scripts/006_red.sql.

export type ProjectStatus = "active" | "paused" | "archived";

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  repo_url: string | null;
  demo_url: string | null;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ContributorRole = "contributor" | "maintainer";

export interface ProjectContributor {
  project_id: string;
  user_id: string;
  role: ContributorRole;
  joined_at: string;
}

export interface ProjectFollower {
  project_id: string;
  user_id: string;
  created_at: string;
}

export type ChangeKind = "feature" | "fix" | "chore" | "note";

export interface ProjectChange {
  id: string;
  project_id: string;
  kind: ChangeKind;
  title: string;
  body: string | null;
  ref_url: string | null;
  author_id: string | null;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  parent_id: string | null;
  author_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type IdeaStatus = "open" | "active" | "archived";

export interface Idea {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tags: string[];
  status: IdeaStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type IdeaLinkType = "related" | "implements";

export interface IdeaProjectLink {
  idea_id: string;
  project_id: string;
  link_type: IdeaLinkType;
  linked_by: string | null;
  linked_at: string;
}

/** Card shape — project summary with derived counters. */
export interface ProjectCardData extends Project {
  followers_count: number;
  contributors_count: number;
}

/** Card shape — idea summary with counters and derived link counts. */
export interface IdeaCardData extends Idea {
  followers_count: number;
  projects_count: number;
}

// =====================================================================
// Modules (etapa 3) — piezas reusables que un proyecto declara que usa.
// =====================================================================

export type ModuleKind =
  | "component"
  | "helper"
  | "hook"
  | "pattern"
  | "integration"
  | "snippet";

export interface RedModule {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  kind: ModuleKind;
  version: string | null;
  source_url: string | null;
  license: string | null;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleUsage {
  project_id: string;
  module_id: string;
  declared_by: string | null;
  declared_at: string;
  note: string | null;
}

export interface ModuleCardData extends RedModule {
  usages_count: number;
}
