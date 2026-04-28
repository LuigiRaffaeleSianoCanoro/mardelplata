import { createClient } from "@/lib/supabase/client";
import { IS_MOCK } from "@/lib/devMock";
import type { ProjectCardData, IdeaCardData } from "./types";

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
