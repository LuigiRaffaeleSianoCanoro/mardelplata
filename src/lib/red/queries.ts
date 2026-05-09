import { createClient } from "@/lib/supabase/client";
import { IS_MOCK, mockProfiles, mockUser } from "@/lib/devMock";
import type {
  ProjectCardData,
  IdeaCardData,
  ProjectContributor,
  ProjectChange,
  ProjectComment,
  IdeaProjectLink,
  ChangeKind,
  IdeaLinkType,
  ProjectStatus,
  IdeaStatus,
  ModuleCardData,
  ModuleKind,
  ModuleUsage,
  RedModule,
} from "./types";

// =====================================================================
// Mock data — used when Supabase isn't configured. Mirrors the shape the
// UI expects so the directory pages render in dev without a backend.
// =====================================================================

const MOCK_PROJECTS: ProjectCardData[] = [
  {
    id: "p-001",
    slug: "puerto-cms",
    name: "Puerto CMS",
    description: "Headless CMS minimalista para sitios de comunidad — eventos, miembros, recursos.",
    status: "active",
    repo_url: "https://github.com/mardelplata-dev/puerto-cms",
    demo_url: null,
    is_public: true,
    created_by: null,
    created_at: "2026-02-10T00:00:00Z",
    updated_at: "2026-04-22T00:00:00Z",
    followers_count: 14,
    contributors_count: 4,
  },
  {
    id: "p-002",
    slug: "faro-auth",
    name: "Faro Auth",
    description: "Wrapper sobre Supabase auth con UI ya-resuelta y soporte de QR de carnet.",
    status: "active",
    repo_url: "https://github.com/mardelplata-dev/faro-auth",
    demo_url: "https://faro.mardelplata.dev",
    is_public: true,
    created_by: null,
    created_at: "2026-03-18T00:00:00Z",
    updated_at: "2026-04-25T00:00:00Z",
    followers_count: 22,
    contributors_count: 6,
  },
  {
    id: "p-003",
    slug: "rompiente-ui",
    name: "Rompiente UI",
    description: "Biblioteca de componentes con la estética de la costa atlántica — bento, glass-night, low-poly waves.",
    status: "paused",
    repo_url: null,
    demo_url: null,
    is_public: true,
    created_by: null,
    created_at: "2026-01-04T00:00:00Z",
    updated_at: "2026-02-14T00:00:00Z",
    followers_count: 9,
    contributors_count: 2,
  },
];

const MOCK_IDEAS: IdeaCardData[] = [
  {
    id: "i-001",
    slug: "ranking-asistencia",
    title: "Ranking de asistencia a eventos",
    description:
      "Mostrar top de miembros más activos del semestre, con un toque editorial — no leaderboard agresivo.",
    tags: ["comunidad", "gamificación"],
    status: "open",
    created_by: null,
    created_at: "2026-04-12T00:00:00Z",
    updated_at: "2026-04-12T00:00:00Z",
    followers_count: 8,
    projects_count: 0,
  },
  {
    id: "i-002",
    slug: "carnet-nfc",
    title: "Carnet NFC además del QR",
    description: "Que el carnet de miembro funcione también vía NFC para acelerar el check-in en eventos.",
    tags: ["carnet", "eventos", "hardware"],
    status: "active",
    created_by: null,
    created_at: "2026-03-20T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
    followers_count: 12,
    projects_count: 1,
  },
  {
    id: "i-003",
    slug: "directorio-freelance",
    title: "Directorio de freelance de la comunidad",
    description: "Página pública con devs/diseñadores que buscan freelo, con badge de miembro verificado.",
    tags: ["bolsa", "perfil"],
    status: "open",
    created_by: null,
    created_at: "2026-04-02T00:00:00Z",
    updated_at: "2026-04-02T00:00:00Z",
    followers_count: 5,
    projects_count: 0,
  },
];

// =====================================================================
// Queries
// =====================================================================

export async function listPublicProjects(): Promise<ProjectCardData[]> {
  if (IS_MOCK) return MOCK_PROJECTS;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `id, slug, name, description, status, repo_url, demo_url, is_public,
       created_by, created_at, updated_at,
       followers:project_followers(count),
       contributors:project_contributors(count)`,
    )
    .eq("is_public", true)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toProjectCardData);
}

export async function listMyProjects(userId: string): Promise<ProjectCardData[]> {
  if (IS_MOCK) return MOCK_PROJECTS;
  const supabase = createClient();
  // Two-step: ids the user follows + ids where contributor.
  const [followsRes, contribRes] = await Promise.all([
    supabase.from("project_followers").select("project_id").eq("user_id", userId),
    supabase.from("project_contributors").select("project_id").eq("user_id", userId),
  ]);
  const ids = new Set<string>([
    ...(followsRes.data ?? []).map((r) => r.project_id),
    ...(contribRes.data ?? []).map((r) => r.project_id),
  ]);
  if (ids.size === 0) return [];
  const { data, error } = await supabase
    .from("projects")
    .select(
      `id, slug, name, description, status, repo_url, demo_url, is_public,
       created_by, created_at, updated_at,
       followers:project_followers(count),
       contributors:project_contributors(count)`,
    )
    .in("id", Array.from(ids))
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toProjectCardData);
}

export async function listIdeas(): Promise<IdeaCardData[]> {
  if (IS_MOCK) return MOCK_IDEAS;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ideas")
    .select(
      `id, slug, title, description, tags, status, created_by, created_at, updated_at,
       followers:idea_followers(count),
       projects:idea_projects(count)`,
    )
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map(toIdeaCardData);
}

// =====================================================================
// Shape helpers — Supabase returns counts as `[{ count: N }]` arrays.
// =====================================================================

type CountWrapper = { count: number }[] | { count: number } | null | undefined;
function pickCount(c: CountWrapper): number {
  if (Array.isArray(c)) return c[0]?.count ?? 0;
  if (c && typeof c === "object" && "count" in c) return c.count ?? 0;
  return 0;
}

interface ProjectRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: ProjectCardData["status"];
  repo_url: string | null;
  demo_url: string | null;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  followers?: CountWrapper;
  contributors?: CountWrapper;
}

function toProjectCardData(row: ProjectRow): ProjectCardData {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: row.status,
    repo_url: row.repo_url,
    demo_url: row.demo_url,
    is_public: row.is_public,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    followers_count: pickCount(row.followers),
    contributors_count: pickCount(row.contributors),
  };
}

interface IdeaRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tags: string[];
  status: IdeaCardData["status"];
  created_by: string | null;
  created_at: string;
  updated_at: string;
  followers?: CountWrapper;
  projects?: CountWrapper;
}

function toIdeaCardData(row: IdeaRow): IdeaCardData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    status: row.status,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    followers_count: pickCount(row.followers),
    projects_count: pickCount(row.projects),
  };
}

// =====================================================================
// Detail fetchers — used by Project/Idea sheets.
// =====================================================================

export interface ContributorWithProfile extends ProjectContributor {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

export interface CommentWithAuthor extends ProjectComment {
  author: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface LinkedProjectSummary {
  link: Pick<IdeaProjectLink, "project_id" | "idea_id" | "link_type" | "linked_at">;
  project: Pick<ProjectCardData, "id" | "slug" | "name" | "status">;
}

export interface LinkedIdeaSummary {
  link: Pick<IdeaProjectLink, "project_id" | "idea_id" | "link_type" | "linked_at">;
  idea: Pick<IdeaCardData, "id" | "slug" | "title" | "status">;
}

// ---------------- Mock detail tables ----------------

const MOCK_CONTRIBUTORS: Record<string, ContributorWithProfile[]> = {
  "p-001": [
    {
      project_id: "p-001",
      user_id: mockProfiles[1].id,
      role: "maintainer",
      joined_at: "2026-02-10T00:00:00Z",
      profile: { ...mockProfiles[1] },
    },
    {
      project_id: "p-001",
      user_id: mockProfiles[2].id,
      role: "contributor",
      joined_at: "2026-02-22T00:00:00Z",
      profile: { ...mockProfiles[2] },
    },
  ],
  "p-002": [
    {
      project_id: "p-002",
      user_id: mockProfiles[0].id,
      role: "contributor",
      joined_at: "2026-03-18T00:00:00Z",
      profile: { ...mockProfiles[0] },
    },
    {
      project_id: "p-002",
      user_id: mockProfiles[2].id,
      role: "contributor",
      joined_at: "2026-03-25T00:00:00Z",
      profile: { ...mockProfiles[2] },
    },
  ],
  "p-003": [
    {
      project_id: "p-003",
      user_id: mockProfiles[1].id,
      role: "contributor",
      joined_at: "2026-01-04T00:00:00Z",
      profile: { ...mockProfiles[1] },
    },
  ],
};

const MOCK_CHANGES: Record<string, ProjectChange[]> = {
  "p-001": [
    {
      id: "c-101",
      project_id: "p-001",
      kind: "feature",
      title: "Editor inline para páginas estáticas",
      body: "Soporte de bloques tipo Notion con drag & drop.",
      ref_url: null,
      author_id: mockProfiles[1].id,
      created_at: "2026-04-22T00:00:00Z",
    },
    {
      id: "c-102",
      project_id: "p-001",
      kind: "fix",
      title: "Race condition al guardar revisiones",
      body: null,
      ref_url: "https://github.com/mardelplata-dev/puerto-cms/pull/42",
      author_id: mockProfiles[2].id,
      created_at: "2026-04-15T00:00:00Z",
    },
  ],
  "p-002": [
    {
      id: "c-201",
      project_id: "p-002",
      kind: "feature",
      title: "Magic link con QR firmado",
      body: "Generación de QR efímero (5 min) que sirve como segundo factor.",
      ref_url: null,
      author_id: mockProfiles[0].id,
      created_at: "2026-04-25T00:00:00Z",
    },
    {
      id: "c-202",
      project_id: "p-002",
      kind: "chore",
      title: "Update Supabase SDK a 2.46",
      body: null,
      ref_url: null,
      author_id: mockProfiles[2].id,
      created_at: "2026-04-12T00:00:00Z",
    },
  ],
  "p-003": [
    {
      id: "c-301",
      project_id: "p-003",
      kind: "note",
      title: "Pausando hasta resolver licenciamiento de fuentes",
      body: "Estamos viendo si podemos rotar a una display alternativa.",
      ref_url: null,
      author_id: mockProfiles[1].id,
      created_at: "2026-02-14T00:00:00Z",
    },
  ],
};

const MOCK_COMMENTS: Record<string, CommentWithAuthor[]> = {
  "p-001": [
    {
      id: "cm-101",
      project_id: "p-001",
      parent_id: null,
      author_id: mockProfiles[1].id,
      body: "Estaría bueno arrancar con un esquema mínimo de bloques antes del editor inline. ¿Definimos los 4 o 5 más importantes?",
      created_at: "2026-04-20T14:00:00Z",
      updated_at: "2026-04-20T14:00:00Z",
      deleted_at: null,
      author: { id: mockProfiles[1].id, full_name: mockProfiles[1].full_name, avatar_url: mockProfiles[1].avatar_url },
    },
    {
      id: "cm-102",
      project_id: "p-001",
      parent_id: "cm-101",
      author_id: mockProfiles[2].id,
      body: "Para mí: párrafo, heading, imagen, code, callout. Suficiente para arrancar.",
      created_at: "2026-04-20T15:30:00Z",
      updated_at: "2026-04-20T15:30:00Z",
      deleted_at: null,
      author: { id: mockProfiles[2].id, full_name: mockProfiles[2].full_name, avatar_url: mockProfiles[2].avatar_url },
    },
  ],
  "p-002": [
    {
      id: "cm-201",
      project_id: "p-002",
      parent_id: null,
      author_id: mockProfiles[0].id,
      body: "Idea: que el QR firmado también sirva como onboarding al primer evento.",
      created_at: "2026-04-25T10:00:00Z",
      updated_at: "2026-04-25T10:00:00Z",
      deleted_at: null,
      author: { id: mockProfiles[0].id, full_name: mockProfiles[0].full_name, avatar_url: mockProfiles[0].avatar_url },
    },
  ],
  "p-003": [],
};

const MOCK_LINKS: Array<{ project_id: string; idea_id: string; link_type: "related" | "implements"; linked_at: string }> = [
  { project_id: "p-002", idea_id: "i-002", link_type: "implements", linked_at: "2026-04-01T00:00:00Z" },
];

// ---------------- Detail queries ----------------

export async function getProjectBySlug(slug: string): Promise<ProjectCardData | null> {
  if (IS_MOCK) return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `id, slug, name, description, status, repo_url, demo_url, is_public,
       created_by, created_at, updated_at,
       followers:project_followers(count),
       contributors:project_contributors(count)`,
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toProjectCardData(data as ProjectRow);
}

export async function getIdeaBySlug(slug: string): Promise<IdeaCardData | null> {
  if (IS_MOCK) return MOCK_IDEAS.find((i) => i.slug === slug) ?? null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ideas")
    .select(
      `id, slug, title, description, tags, status, created_by, created_at, updated_at,
       followers:idea_followers(count),
       projects:idea_projects(count)`,
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toIdeaCardData(data as IdeaRow);
}

export async function listProjectContributors(projectId: string): Promise<ContributorWithProfile[]> {
  if (IS_MOCK) return MOCK_CONTRIBUTORS[projectId] ?? [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_contributors")
    .select(`project_id, user_id, role, joined_at, profile:profiles(id, full_name, email, avatar_url)`)
    .eq("project_id", projectId)
    .order("joined_at", { ascending: true });
  if (error || !data) return [];
  return (data as unknown as ContributorWithProfile[]) ?? [];
}

export async function listProjectChanges(projectId: string): Promise<ProjectChange[]> {
  if (IS_MOCK) return MOCK_CHANGES[projectId] ?? [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_changes")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as ProjectChange[];
}

export async function listProjectComments(projectId: string): Promise<CommentWithAuthor[]> {
  if (IS_MOCK) return (MOCK_COMMENTS[projectId] ?? []).filter((c) => !c.deleted_at);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_comments")
    .select(`*, author:profiles(id, full_name, avatar_url)`)
    .eq("project_id", projectId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as unknown as CommentWithAuthor[];
}

export async function addProjectComment(args: {
  projectId: string;
  authorId: string;
  body: string;
  parentId?: string | null;
}): Promise<CommentWithAuthor | null> {
  const trimmed = args.body.trim();
  if (!trimmed) return null;
  if (IS_MOCK) {
    const author = mockProfiles.find((p) => p.id === args.authorId) ?? mockProfiles[0];
    const fresh: CommentWithAuthor = {
      id: `cm-mock-${Date.now()}`,
      project_id: args.projectId,
      parent_id: args.parentId ?? null,
      author_id: author.id,
      body: trimmed,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      author: { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url },
    };
    MOCK_COMMENTS[args.projectId] = [...(MOCK_COMMENTS[args.projectId] ?? []), fresh];
    return fresh;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_comments")
    .insert({
      project_id: args.projectId,
      author_id: args.authorId,
      body: trimmed,
      parent_id: args.parentId ?? null,
    })
    .select(`*, author:profiles(id, full_name, avatar_url)`)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as CommentWithAuthor;
}

export async function listLinkedIdeas(projectId: string): Promise<LinkedIdeaSummary[]> {
  if (IS_MOCK) {
    return MOCK_LINKS.filter((l) => l.project_id === projectId).map((l) => {
      const idea = MOCK_IDEAS.find((i) => i.id === l.idea_id);
      if (!idea) return null;
      return {
        link: { project_id: l.project_id, idea_id: l.idea_id, link_type: l.link_type, linked_at: l.linked_at },
        idea: { id: idea.id, slug: idea.slug, title: idea.title, status: idea.status },
      };
    }).filter((x): x is LinkedIdeaSummary => x !== null);
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("idea_projects")
    .select(`project_id, idea_id, link_type, linked_at, idea:ideas(id, slug, title, status)`)
    .eq("project_id", projectId);
  if (error || !data) return [];
  return (data as unknown as Array<{
    project_id: string;
    idea_id: string;
    link_type: "related" | "implements";
    linked_at: string;
    idea: { id: string; slug: string; title: string; status: IdeaCardData["status"] } | null;
  }>)
    .filter((r) => r.idea !== null)
    .map((r) => ({
      link: { project_id: r.project_id, idea_id: r.idea_id, link_type: r.link_type, linked_at: r.linked_at },
      idea: r.idea!,
    }));
}

export async function listLinkedProjects(ideaId: string): Promise<LinkedProjectSummary[]> {
  if (IS_MOCK) {
    return MOCK_LINKS.filter((l) => l.idea_id === ideaId).map((l) => {
      const project = MOCK_PROJECTS.find((p) => p.id === l.project_id);
      if (!project) return null;
      return {
        link: { project_id: l.project_id, idea_id: l.idea_id, link_type: l.link_type, linked_at: l.linked_at },
        project: { id: project.id, slug: project.slug, name: project.name, status: project.status },
      };
    }).filter((x): x is LinkedProjectSummary => x !== null);
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("idea_projects")
    .select(`project_id, idea_id, link_type, linked_at, project:projects(id, slug, name, status)`)
    .eq("idea_id", ideaId);
  if (error || !data) return [];
  return (data as unknown as Array<{
    project_id: string;
    idea_id: string;
    link_type: "related" | "implements";
    linked_at: string;
    project: { id: string; slug: string; name: string; status: ProjectCardData["status"] } | null;
  }>)
    .filter((r) => r.project !== null)
    .map((r) => ({
      link: { project_id: r.project_id, idea_id: r.idea_id, link_type: r.link_type, linked_at: r.linked_at },
      project: r.project!,
    }));
}

// =====================================================================
// Mock membership state — kept here so toggle/join mutations and the
// directory queries share the same source of truth in dev.
// =====================================================================

const MOCK_PROJECT_FOLLOWERS = new Set<string>([
  // demo user already follows puerto-cms
  `p-001:${mockUser.id}`,
]);
const MOCK_IDEA_FOLLOWERS = new Set<string>([
  `i-001:${mockUser.id}`,
]);
const memberKey = (entityId: string, userId: string) => `${entityId}:${userId}`;

// =====================================================================
// Memberships — small helpers used by the sheets to drive the header CTAs.
// =====================================================================

export interface ProjectMembership {
  is_follower: boolean;
  is_contributor: boolean;
  role: "contributor" | "maintainer" | null;
}

export async function getProjectMembership(
  projectId: string,
  userId: string,
): Promise<ProjectMembership> {
  if (!userId) return { is_follower: false, is_contributor: false, role: null };
  if (IS_MOCK) {
    const isFollower = MOCK_PROJECT_FOLLOWERS.has(memberKey(projectId, userId));
    const contributor = (MOCK_CONTRIBUTORS[projectId] ?? []).find((c) => c.user_id === userId);
    return {
      is_follower: isFollower,
      is_contributor: !!contributor,
      role: contributor ? contributor.role : null,
    };
  }
  const supabase = createClient();
  const [followRes, contribRes] = await Promise.all([
    supabase
      .from("project_followers")
      .select("user_id")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("project_contributors")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);
  return {
    is_follower: !!followRes.data,
    is_contributor: !!contribRes.data,
    role: (contribRes.data?.role as "contributor" | "maintainer" | undefined) ?? null,
  };
}

export interface IdeaMembership {
  is_follower: boolean;
}

export async function getIdeaMembership(
  ideaId: string,
  userId: string,
): Promise<IdeaMembership> {
  if (!userId) return { is_follower: false };
  if (IS_MOCK) {
    return { is_follower: MOCK_IDEA_FOLLOWERS.has(memberKey(ideaId, userId)) };
  }
  const supabase = createClient();
  const { data } = await supabase
    .from("idea_followers")
    .select("user_id")
    .eq("idea_id", ideaId)
    .eq("user_id", userId)
    .maybeSingle();
  return { is_follower: !!data };
}

// =====================================================================
// Mutations
// =====================================================================

export async function toggleFollowProject(
  projectId: string,
  userId: string,
  follow: boolean,
): Promise<boolean> {
  if (!userId) return false;
  if (IS_MOCK) {
    const key = memberKey(projectId, userId);
    if (follow) MOCK_PROJECT_FOLLOWERS.add(key);
    else MOCK_PROJECT_FOLLOWERS.delete(key);
    const target = MOCK_PROJECTS.find((p) => p.id === projectId);
    if (target) target.followers_count += follow ? 1 : -1;
    return true;
  }
  const supabase = createClient();
  if (follow) {
    const { error } = await supabase
      .from("project_followers")
      .upsert({ project_id: projectId, user_id: userId });
    return !error;
  }
  const { error } = await supabase
    .from("project_followers")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", userId);
  return !error;
}

export async function joinAsContributor(
  projectId: string,
  userId: string,
): Promise<boolean> {
  if (!userId) return false;
  if (IS_MOCK) {
    const list = MOCK_CONTRIBUTORS[projectId] ?? [];
    if (list.some((c) => c.user_id === userId)) return true;
    const profile = mockProfiles.find((p) => p.id === userId) ?? mockProfiles[0];
    list.push({
      project_id: projectId,
      user_id: userId,
      role: "contributor",
      joined_at: new Date().toISOString(),
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
      },
    });
    MOCK_CONTRIBUTORS[projectId] = list;
    const target = MOCK_PROJECTS.find((p) => p.id === projectId);
    if (target) target.contributors_count += 1;
    return true;
  }
  const supabase = createClient();
  const { error } = await supabase
    .from("project_contributors")
    .upsert({ project_id: projectId, user_id: userId, role: "contributor" });
  return !error;
}

export async function toggleFollowIdea(
  ideaId: string,
  userId: string,
  follow: boolean,
): Promise<boolean> {
  if (!userId) return false;
  if (IS_MOCK) {
    const key = memberKey(ideaId, userId);
    if (follow) MOCK_IDEA_FOLLOWERS.add(key);
    else MOCK_IDEA_FOLLOWERS.delete(key);
    const target = MOCK_IDEAS.find((i) => i.id === ideaId);
    if (target) target.followers_count += follow ? 1 : -1;
    return true;
  }
  const supabase = createClient();
  if (follow) {
    const { error } = await supabase
      .from("idea_followers")
      .upsert({ idea_id: ideaId, user_id: userId });
    return !error;
  }
  const { error } = await supabase
    .from("idea_followers")
    .delete()
    .eq("idea_id", ideaId)
    .eq("user_id", userId);
  return !error;
}

export async function linkIdeaToProject(args: {
  ideaId: string;
  projectId: string;
  linkType: IdeaLinkType;
  userId: string;
}): Promise<boolean> {
  if (IS_MOCK) {
    if (
      MOCK_LINKS.some(
        (l) => l.idea_id === args.ideaId && l.project_id === args.projectId,
      )
    ) {
      return true;
    }
    MOCK_LINKS.push({
      idea_id: args.ideaId,
      project_id: args.projectId,
      link_type: args.linkType,
      linked_at: new Date().toISOString(),
    });
    const idea = MOCK_IDEAS.find((i) => i.id === args.ideaId);
    if (idea) {
      idea.projects_count += 1;
      if (args.linkType === "implements" && idea.status === "open") idea.status = "active";
    }
    return true;
  }
  const supabase = createClient();
  const { error } = await supabase.from("idea_projects").upsert({
    idea_id: args.ideaId,
    project_id: args.projectId,
    link_type: args.linkType,
    linked_by: args.userId,
  });
  return !error;
}

export async function createProject(args: {
  slug: string;
  name: string;
  description: string | null;
  repo_url: string | null;
  demo_url: string | null;
  userId: string;
}): Promise<ProjectCardData | null> {
  const slug = args.slug.trim().toLowerCase();
  const name = args.name.trim();
  if (!slug || !name) return null;
  if (IS_MOCK) {
    if (MOCK_PROJECTS.some((p) => p.slug === slug)) return null;
    const profile = mockProfiles.find((p) => p.id === args.userId) ?? mockProfiles[0];
    const now = new Date().toISOString();
    const fresh: ProjectCardData = {
      id: `p-mock-${Date.now()}`,
      slug,
      name,
      description: args.description?.trim() || null,
      status: "active",
      repo_url: args.repo_url?.trim() || null,
      demo_url: args.demo_url?.trim() || null,
      is_public: true,
      created_by: args.userId,
      created_at: now,
      updated_at: now,
      followers_count: 0,
      contributors_count: 1,
    };
    MOCK_PROJECTS.unshift(fresh);
    MOCK_CONTRIBUTORS[fresh.id] = [
      {
        project_id: fresh.id,
        user_id: args.userId,
        role: "contributor",
        joined_at: now,
        profile: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
        },
      },
    ];
    return fresh;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug,
      name,
      description: args.description,
      repo_url: args.repo_url,
      demo_url: args.demo_url,
      created_by: args.userId,
    })
    .select(
      `id, slug, name, description, status, repo_url, demo_url, is_public,
       created_by, created_at, updated_at,
       followers:project_followers(count),
       contributors:project_contributors(count)`,
    )
    .maybeSingle();
  if (error || !data) return null;
  return toProjectCardData(data as ProjectRow);
}

export async function createIdea(args: {
  slug: string;
  title: string;
  description: string | null;
  tags: string[];
  userId: string;
}): Promise<IdeaCardData | null> {
  const slug = args.slug.trim().toLowerCase();
  const title = args.title.trim();
  if (!slug || !title) return null;
  if (IS_MOCK) {
    if (MOCK_IDEAS.some((i) => i.slug === slug)) return null;
    const now = new Date().toISOString();
    const fresh: IdeaCardData = {
      id: `i-mock-${Date.now()}`,
      slug,
      title,
      description: args.description?.trim() || null,
      tags: args.tags.filter(Boolean),
      status: "open",
      created_by: args.userId,
      created_at: now,
      updated_at: now,
      followers_count: 0,
      projects_count: 0,
    };
    MOCK_IDEAS.unshift(fresh);
    return fresh;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ideas")
    .insert({
      slug,
      title,
      description: args.description,
      tags: args.tags,
      created_by: args.userId,
    })
    .select(
      `id, slug, title, description, tags, status, created_by, created_at, updated_at,
       followers:idea_followers(count),
       projects:idea_projects(count)`,
    )
    .maybeSingle();
  if (error || !data) return null;
  return toIdeaCardData(data as IdeaRow);
}

export async function addProjectChange(args: {
  projectId: string;
  kind: ChangeKind;
  title: string;
  body: string | null;
  refUrl: string | null;
  authorId: string;
}): Promise<ProjectChange | null> {
  const title = args.title.trim();
  if (!title) return null;
  if (IS_MOCK) {
    const fresh: ProjectChange = {
      id: `c-mock-${Date.now()}`,
      project_id: args.projectId,
      kind: args.kind,
      title,
      body: args.body?.trim() || null,
      ref_url: args.refUrl?.trim() || null,
      author_id: args.authorId,
      created_at: new Date().toISOString(),
    };
    const list = MOCK_CHANGES[args.projectId] ?? [];
    MOCK_CHANGES[args.projectId] = [fresh, ...list];
    return fresh;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_changes")
    .insert({
      project_id: args.projectId,
      kind: args.kind,
      title,
      body: args.body,
      ref_url: args.refUrl,
      author_id: args.authorId,
    })
    .select("*")
    .maybeSingle();
  if (error || !data) return null;
  return data as ProjectChange;
}

export async function updateProjectComment(args: {
  commentId: string;
  body: string;
}): Promise<boolean> {
  const body = args.body.trim();
  if (!body) return false;
  if (IS_MOCK) {
    for (const list of Object.values(MOCK_COMMENTS)) {
      const c = list.find((c) => c.id === args.commentId);
      if (c) {
        c.body = body;
        c.updated_at = new Date().toISOString();
        return true;
      }
    }
    return false;
  }
  const supabase = createClient();
  const { error } = await supabase
    .from("project_comments")
    .update({ body, updated_at: new Date().toISOString() })
    .eq("id", args.commentId);
  return !error;
}

export async function deleteProjectComment(commentId: string): Promise<boolean> {
  if (IS_MOCK) {
    for (const list of Object.values(MOCK_COMMENTS)) {
      const idx = list.findIndex((c) => c.id === commentId);
      if (idx >= 0) {
        list[idx] = { ...list[idx], deleted_at: new Date().toISOString() };
        return true;
      }
    }
    return false;
  }
  const supabase = createClient();
  const { error } = await supabase
    .from("project_comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId);
  return !error;
}

// =====================================================================
// Modules (etapa 3) — registro reusable + uso por proyecto.
// =====================================================================

const MOCK_MODULES: ModuleCardData[] = [
  {
    id: "m-001",
    slug: "low-poly-waves",
    name: "Low-poly waves SVG",
    description: "Componente SVG con triangulación procedural para fondos costeros — el del landing.",
    kind: "component",
    version: "1.2.0",
    source_url: "https://github.com/mardelplata-dev/aeterna/blob/main/components/LowPolyWaves.tsx",
    license: "MIT",
    is_public: true,
    created_by: null,
    created_at: "2026-02-04T00:00:00Z",
    updated_at: "2026-04-10T00:00:00Z",
    usages_count: 1,
  },
  {
    id: "m-002",
    slug: "lenis-smooth",
    name: "Lenis smooth scroll provider",
    description: "Wrapper sobre Lenis con bandwidth-aware fallback (saveData / 2G). Carga dinámica.",
    kind: "integration",
    version: "0.3.1",
    source_url: null,
    license: "MIT",
    is_public: true,
    created_by: null,
    created_at: "2026-03-12T00:00:00Z",
    updated_at: "2026-04-22T00:00:00Z",
    usages_count: 2,
  },
  {
    id: "m-003",
    slug: "use-current-user",
    name: "useCurrentUserId hook",
    description: "Hook tiny que resuelve el id del usuario actual con fallback a mock-mode.",
    kind: "hook",
    version: "1.0.0",
    source_url: null,
    license: "MIT",
    is_public: true,
    created_by: null,
    created_at: "2026-04-02T00:00:00Z",
    updated_at: "2026-04-02T00:00:00Z",
    usages_count: 0,
  },
];

const MOCK_MODULE_USAGES: ModuleUsage[] = [
  {
    project_id: "p-001",
    module_id: "m-002",
    declared_by: mockProfiles[1].id,
    declared_at: "2026-04-10T00:00:00Z",
    note: "Para parallax en /eventos.",
  },
  {
    project_id: "p-002",
    module_id: "m-001",
    declared_by: mockProfiles[0].id,
    declared_at: "2026-03-20T00:00:00Z",
    note: null,
  },
  {
    project_id: "p-002",
    module_id: "m-002",
    declared_by: mockProfiles[0].id,
    declared_at: "2026-03-22T00:00:00Z",
    note: null,
  },
];

interface ModuleRow {
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
  usages?: CountWrapper;
}

function toModuleCardData(row: ModuleRow): ModuleCardData {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    kind: row.kind,
    version: row.version,
    source_url: row.source_url,
    license: row.license,
    is_public: row.is_public,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
    usages_count: pickCount(row.usages),
  };
}

export async function listModules(): Promise<ModuleCardData[]> {
  if (IS_MOCK) {
    return MOCK_MODULES.map((m) => ({
      ...m,
      usages_count: MOCK_MODULE_USAGES.filter((u) => u.module_id === m.id).length,
    }));
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `id, slug, name, description, kind, version, source_url, license, is_public,
       created_by, created_at, updated_at,
       usages:module_usages(count)`,
    )
    .eq("is_public", true)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as ModuleRow[]).map(toModuleCardData);
}

export async function getModuleBySlug(slug: string): Promise<ModuleCardData | null> {
  if (IS_MOCK) {
    const m = MOCK_MODULES.find((mm) => mm.slug === slug);
    if (!m) return null;
    return { ...m, usages_count: MOCK_MODULE_USAGES.filter((u) => u.module_id === m.id).length };
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `id, slug, name, description, kind, version, source_url, license, is_public,
       created_by, created_at, updated_at,
       usages:module_usages(count)`,
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toModuleCardData(data as ModuleRow);
}

export interface ModuleUsageWithProject {
  usage: ModuleUsage;
  project: Pick<ProjectCardData, "id" | "slug" | "name" | "status">;
}

export interface ModuleUsageWithModule {
  usage: ModuleUsage;
  module: Pick<ModuleCardData, "id" | "slug" | "name" | "kind" | "version">;
}

export async function listModuleUsagesByModule(moduleId: string): Promise<ModuleUsageWithProject[]> {
  if (IS_MOCK) {
    return MOCK_MODULE_USAGES.filter((u) => u.module_id === moduleId)
      .map((u) => {
        const project = MOCK_PROJECTS.find((p) => p.id === u.project_id);
        if (!project) return null;
        return {
          usage: u,
          project: { id: project.id, slug: project.slug, name: project.name, status: project.status },
        };
      })
      .filter((x): x is ModuleUsageWithProject => x !== null);
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("module_usages")
    .select(`project_id, module_id, declared_by, declared_at, note, project:projects(id, slug, name, status)`)
    .eq("module_id", moduleId);
  if (error || !data) return [];
  return (data as unknown as Array<{
    project_id: string;
    module_id: string;
    declared_by: string | null;
    declared_at: string;
    note: string | null;
    project: { id: string; slug: string; name: string; status: ProjectCardData["status"] } | null;
  }>)
    .filter((r) => r.project !== null)
    .map((r) => ({
      usage: {
        project_id: r.project_id,
        module_id: r.module_id,
        declared_by: r.declared_by,
        declared_at: r.declared_at,
        note: r.note,
      },
      project: r.project!,
    }));
}

export async function listModuleUsagesByProject(projectId: string): Promise<ModuleUsageWithModule[]> {
  if (IS_MOCK) {
    return MOCK_MODULE_USAGES.filter((u) => u.project_id === projectId)
      .map((u) => {
        const m = MOCK_MODULES.find((mm) => mm.id === u.module_id);
        if (!m) return null;
        return {
          usage: u,
          module: { id: m.id, slug: m.slug, name: m.name, kind: m.kind, version: m.version },
        };
      })
      .filter((x): x is ModuleUsageWithModule => x !== null);
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("module_usages")
    .select(`project_id, module_id, declared_by, declared_at, note, module:modules(id, slug, name, kind, version)`)
    .eq("project_id", projectId);
  if (error || !data) return [];
  return (data as unknown as Array<{
    project_id: string;
    module_id: string;
    declared_by: string | null;
    declared_at: string;
    note: string | null;
    module: { id: string; slug: string; name: string; kind: ModuleKind; version: string | null } | null;
  }>)
    .filter((r) => r.module !== null)
    .map((r) => ({
      usage: {
        project_id: r.project_id,
        module_id: r.module_id,
        declared_by: r.declared_by,
        declared_at: r.declared_at,
        note: r.note,
      },
      module: r.module!,
    }));
}

export async function createModule(args: {
  slug: string;
  name: string;
  description: string | null;
  kind: ModuleKind;
  version: string | null;
  sourceUrl: string | null;
  license: string | null;
  userId: string;
}): Promise<ModuleCardData | null> {
  const slug = args.slug.trim().toLowerCase();
  const name = args.name.trim();
  if (!slug || !name) return null;
  if (IS_MOCK) {
    if (MOCK_MODULES.some((m) => m.slug === slug)) return null;
    const now = new Date().toISOString();
    const fresh: ModuleCardData = {
      id: `m-mock-${Date.now()}`,
      slug,
      name,
      description: args.description?.trim() || null,
      kind: args.kind,
      version: args.version?.trim() || null,
      source_url: args.sourceUrl?.trim() || null,
      license: args.license?.trim() || null,
      is_public: true,
      created_by: args.userId,
      created_at: now,
      updated_at: now,
      usages_count: 0,
    };
    MOCK_MODULES.unshift(fresh);
    return fresh;
  }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("modules")
    .insert({
      slug,
      name,
      description: args.description,
      kind: args.kind,
      version: args.version,
      source_url: args.sourceUrl,
      license: args.license,
      created_by: args.userId,
    })
    .select(
      `id, slug, name, description, kind, version, source_url, license, is_public,
       created_by, created_at, updated_at,
       usages:module_usages(count)`,
    )
    .maybeSingle();
  if (error || !data) return null;
  return toModuleCardData(data as ModuleRow);
}

export async function declareModuleUsage(args: {
  projectId: string;
  moduleId: string;
  userId: string;
  note: string | null;
}): Promise<boolean> {
  if (!args.userId) return false;
  if (IS_MOCK) {
    if (MOCK_MODULE_USAGES.some((u) => u.project_id === args.projectId && u.module_id === args.moduleId)) {
      return true;
    }
    MOCK_MODULE_USAGES.push({
      project_id: args.projectId,
      module_id: args.moduleId,
      declared_by: args.userId,
      declared_at: new Date().toISOString(),
      note: args.note?.trim() || null,
    });
    const m = MOCK_MODULES.find((mm) => mm.id === args.moduleId);
    if (m) m.usages_count = MOCK_MODULE_USAGES.filter((u) => u.module_id === m.id).length;
    return true;
  }
  const supabase = createClient();
  const { error } = await supabase.from("module_usages").upsert({
    project_id: args.projectId,
    module_id: args.moduleId,
    declared_by: args.userId,
    note: args.note,
  });
  return !error;
}

export async function removeModuleUsage(args: {
  projectId: string;
  moduleId: string;
}): Promise<boolean> {
  if (IS_MOCK) {
    const before = MOCK_MODULE_USAGES.length;
    const idx = MOCK_MODULE_USAGES.findIndex(
      (u) => u.project_id === args.projectId && u.module_id === args.moduleId,
    );
    if (idx >= 0) MOCK_MODULE_USAGES.splice(idx, 1);
    const m = MOCK_MODULES.find((mm) => mm.id === args.moduleId);
    if (m) m.usages_count = MOCK_MODULE_USAGES.filter((u) => u.module_id === m.id).length;
    return MOCK_MODULE_USAGES.length < before;
  }
  const supabase = createClient();
  const { error } = await supabase
    .from("module_usages")
    .delete()
    .eq("project_id", args.projectId)
    .eq("module_id", args.moduleId);
  return !error;
}

// Re-exported for callers that want to stay shallow.
export type { ChangeKind, IdeaLinkType, ProjectStatus, IdeaStatus, ModuleKind };
export type { RedModule };
