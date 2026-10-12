import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { HAS_SUPABASE_CONFIG } from "@/lib/devMock";
import {
  mergePublicEvents,
  partitionEvents,
  type PublicEvent,
  type SupabaseEventRow,
} from "@/lib/events";
import { loadCuratedEvents } from "@/lib/events/load-curated";
import {
  getAllPressItems,
  hasArchive,
  PRESS_EVENT_LABELS,
  PRESS_TYPE_LABELS,
  type PressItem,
} from "@/content/prensa";
import { MARKETPLACE_NAV_ENABLED } from "@/lib/flags";
import { brandify } from "./brand";
import type {
  EventHostVM,
  EventVM,
  JobVM,
  MemberVM,
  PressVM,
  ProjectVM,
  ShellData,
  ShellLink,
} from "./types";

/** Sólo http(s): evita `javascript:`/`data:` venidos de la base o de Luma. */
function httpUrl(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  try {
    const u = new URL(v.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

const TZ = "America/Argentina/Buenos_Aires";

function parts(iso: string) {
  const d = new Date(iso);
  const get = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-AR", { timeZone: TZ, ...opts }).format(d);
  return {
    weekdayShort: get({ weekday: "short" }).replace(".", ""),
    weekdayLong: get({ weekday: "long" }),
    day: get({ day: "numeric" }),
    day2: get({ day: "2-digit" }),
    month2: get({ month: "2-digit" }),
    monthNum: get({ month: "numeric" }),
    monthShort: get({ month: "short" }).replace(".", ""),
    monthLong: get({ month: "long" }),
    year: get({ year: "numeric" }),
    hour: get({ hour: "2-digit", hourCycle: "h23" }),
    minute: get({ minute: "2-digit" }).padStart(2, "0"),
  };
}

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function hhmm(iso: string) {
  const p = parts(iso);
  return `${p.hour}:${p.minute}`;
}
function hShort(iso: string) {
  const p = parts(iso);
  return p.minute === "00" ? String(Number(p.hour)) : `${Number(p.hour)}:${p.minute}`;
}

export function initials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "·";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

interface CuratedExtras {
  price?: string;
  capacity?: number;
  agenda?: string[];
}

function toEventVM(
  e: PublicEvent,
  extras: Map<string, CuratedExtras>,
  avatars: Map<string, string>,
): EventVM {
  const p = parts(e.date);
  const slug = e.id.startsWith("luma-") ? e.id.slice(5) : e.id;
  const venue = brandify(e.location);
  let venueName: string | null = venue;
  let venueAddress: string | null = null;
  if (venue && venue.includes("·")) {
    const [a, ...rest] = venue.split("·");
    venueName = a.trim();
    venueAddress = rest.join("·").trim();
  }
  const mapsQuery = [venueAddress ?? venueName, e.city].filter(Boolean).join(", ");
  const x = extras.get(slug) ?? {};
  const hosts: EventHostVM[] = (e.hosts ?? []).map((name) => ({
    name: brandify(name),
    initials: initials(name),
    avatarUrl: avatars.get(name.trim().toLowerCase()) ?? null,
  }));
  return {
    slug,
    title: brandify(e.title),
    excerpt: brandify(e.description ?? e.subtitle),
    startISO: e.date,
    endISO: e.end_date,
    dateShort: `${cap(p.weekdayShort)} ${p.day2}/${p.month2}`,
    timeShort: e.end_date
      ? `${hShort(e.date)}–${hShort(e.end_date)} ART`
      : `${hShort(e.date)} ART`,
    dateLong: `${cap(p.weekdayLong)} ${p.day} de ${p.monthLong}`,
    timeLong: e.end_date
      ? `${hhmm(e.date)} – ${hhmm(e.end_date)} ART`
      : `${hhmm(e.date)} ART`,
    month: p.monthShort.toUpperCase(),
    day: p.day,
    monthLong: p.monthLong,
    venueName,
    venueAddress,
    city: e.city,
    mapsUrl: mapsQuery
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
      : null,
    hosts,
    tags: e.tags ?? [],
    registrationUrl: httpUrl(e.registration_url),
    tier: e.tier,
    price: x.price ?? null,
    capacity: typeof x.capacity === "number" ? x.capacity : null,
    agenda: Array.isArray(x.agenda) ? x.agenda.map((a) => brandify(a)) : [],
  };
}

function toPressVM(item: PressItem): PressVM {
  // Las fechas de prensa son días calendario (YYYY-MM-DD): las leemos en UTC.
  const d = new Date(`${item.date}T12:00:00Z`);
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", ...o }).format(d);
  return {
    id: item.id,
    title: brandify(item.title),
    outlet: item.outlet,
    dateShort: `${fmt({ day: "numeric" })}/${fmt({ month: "numeric" })}`,
    dateLong: fmt({ day: "numeric", month: "long", year: "numeric" }),
    excerpt: brandify(item.excerpt),
    url: httpUrl(item.url) ?? "",
    typeLabel: PRESS_TYPE_LABELS[item.type] ?? item.type,
    eventLabels: item.events.map((t) => PRESS_EVENT_LABELS[t]).filter(Boolean),
    hasArchive: hasArchive(item),
    pendingSource: Boolean(item.pendingSource),
  };
}

function shellLinks(): ShellLink[] {
  const links: ShellLink[] = [
    { href: "/eventos", label: "Calendario completo", description: "Todos los eventos", group: "comunidad" },
    { href: "/prensa", label: "Archivo de prensa", description: "Notas sobre la comunidad", group: "comunidad" },
    { href: "/proyectos", label: "Proyectos", description: "Lo que construye la comunidad", group: "comunidad" },
    { href: "/red", label: "Red", description: "Ideas, módulos y proyectos", group: "comunidad" },
    { href: "/bolsa", label: "Bolsa de empleos", description: "Búsquedas y clasificados", group: "comunidad" },
    { href: "/blog", label: "Lectura", description: "Lo que la red está leyendo", group: "comunidad" },
    { href: "/reglamento", label: "Código de conducta", group: "comunidad" },
    { href: "/primer-trabajo", label: "Primer trabajo", description: "Guía para tu primer empleo IT", group: "aprender" },
    { href: "/primer-trabajo/entrevista-hr", label: "Entrevista con HR", description: "Práctica de entrevista", group: "aprender" },
    { href: "/primer-trabajo/entrevista-hr-en", label: "HR interview (EN)", group: "aprender" },
    { href: "/estudiar", label: "Estudiar", description: "Carreras tech en la ciudad", group: "aprender" },
    { href: "/vivir-en-mardelplata", label: "Vivir en Mar del Plata", description: "Costo de vida, internet y visa", group: "ciudad" },
    { href: "/trabajar", label: "Cafés y coworkings", description: "Lugares work-friendly", group: "ciudad" },
    { href: "/que-hacer", label: "Qué hacer", description: "Playas, naturaleza y cultura", group: "ciudad" },
    { href: "/en/live-in-mar-del-plata", label: "Live in Mar del Plata (EN)", group: "ciudad" },
    { href: "/empresas", label: "Empresas", description: "Directorio del ecosistema tech", group: "ecosistema" },
    { href: "/invertir", label: "Invertir", description: "El polo tech para empresas IT", group: "ecosistema" },
  ];
  if (MARKETPLACE_NAV_ENABLED) {
    links.push({ href: "/marketplace", label: "Marketplace", description: "Startups y pedidos de la costa", group: "ecosistema" });
  }
  links.push(
    { href: "/perfil", label: "Mi perfil", group: "cuenta" },
    { href: "/asistencias", label: "Mis asistencias", group: "cuenta" },
  );
  return links;
}

/** Query pública tolerante: sin Supabase configurado o con error → null. */
async function safeData<T>(fn: () => PromiseLike<{ data: unknown; error: unknown }>): Promise<T | null> {
  if (!HAS_SUPABASE_CONFIG) return null;
  try {
    const res = await fn();
    if (res.error) return null;
    return (res.data as T) ?? null;
  } catch {
    return null;
  }
}

export async function getShellData(): Promise<ShellData> {
  const supabase = createPublicClient();

  // Extras opcionales de los JSON curados (precio, cupo, agenda): no se
  // inventan; si el JSON no los trae, la UI no los muestra.
  const extras = new Map<string, CuratedExtras>();
  for (const c of loadCuratedEvents()) {
    extras.set(c.id, { price: c.price, capacity: c.capacity, agenda: c.agenda });
  }

  const [eventRows, jobRows, projectRows, memberRows] = await Promise.all([
    safeData<unknown[]>(
      () =>
        supabase
          .from("events")
          .select("*")
          .eq("is_published", true)
          .order("date", { ascending: false }),
    ),
    safeData<unknown[]>(
      () =>
        supabase
          .from("classified_listings")
          .select("id, title, external_url, tags, created_at, author:profiles_public!author_id(full_name)")
          .eq("kind", "job")
          .gt("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(6),
    ),
    safeData<unknown[]>(
      () =>
        supabase
          .from("projects")
          .select("id, slug, name, description, status, repo_url, demo_url")
          .eq("is_public", true)
          .order("updated_at", { ascending: false })
          .limit(8),
    ),
    safeData<unknown[]>(
      () =>
        supabase
          .from("profiles_public")
          .select("id, full_name, avatar_url")
          .not("full_name", "is", null)
          .order("created_at", { ascending: false })
          .limit(48),
    ),
  ]);

  const events = mergePublicEvents((eventRows as SupabaseEventRow[] | null) ?? null);
  const { upcoming, past } = partitionEvents(events);

  // Fotos reales de los hosts del próximo evento (si tienen perfil).
  const avatars = new Map<string, string>();
  const hostNames = Array.from(new Set(upcoming.slice(0, 3).flatMap((e) => e.hosts ?? [])));
  if (hostNames.length > 0) {
    const rows = await safeData<unknown[]>(
      () => supabase.from("profiles_public").select("full_name, avatar_url").in("full_name", hostNames).limit(20),
    );
    for (const row of (rows as Array<{ full_name: string | null; avatar_url: string | null }> | null) ?? []) {
      const src = httpUrl(row.avatar_url);
      if (row.full_name && src) avatars.set(row.full_name.trim().toLowerCase(), src);
    }
  }

  const jobs: JobVM[] = ((jobRows as Array<Record<string, unknown>> | null) ?? []).map((j) => {
    const author = Array.isArray(j.author) ? j.author[0] : j.author;
    const created = typeof j.created_at === "string" ? new Date(j.created_at) : null;
    return {
      id: String(j.id),
      title: brandify(String(j.title ?? "Búsqueda")),
      author: (author as { full_name?: string } | null)?.full_name ?? null,
      url: httpUrl(j.external_url),
      tags: Array.isArray(j.tags) ? (j.tags as string[]).slice(0, 3) : [],
      dateShort: created
        ? new Intl.DateTimeFormat("es-AR", { timeZone: TZ, day: "numeric", month: "numeric" }).format(created)
        : "",
    };
  });

  const projects: ProjectVM[] = ((projectRows as Array<Record<string, unknown>> | null) ?? []).map((p) => ({
    id: String(p.id),
    slug: String(p.slug ?? p.id),
    name: brandify(String(p.name ?? "Proyecto")),
    description: brandify((p.description as string | null) ?? null),
    status: (p.status as string | null) ?? null,
    repoUrl: httpUrl(p.repo_url),
    demoUrl: httpUrl(p.demo_url),
  }));

  const members: MemberVM[] = ((memberRows as Array<Record<string, unknown>> | null) ?? [])
    .filter((m) => typeof m.full_name === "string" && (m.full_name as string).trim())
    .map((m) => ({
      id: String(m.id),
      name: String(m.full_name).trim(),
      initials: initials(String(m.full_name)),
      avatarUrl: httpUrl(m.avatar_url),
    }));

  return {
    upcoming: upcoming.map((e) => toEventVM(e, extras, avatars)),
    past: past.map((e) => toEventVM(e, extras, avatars)),
    press: getAllPressItems().map(toPressVM),
    jobs,
    projects,
    members,
    links: shellLinks(),
  };
}
