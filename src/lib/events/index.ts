import {
  curatedEvents,
  isExcludedEvent,
  lumaSlug,
  type CuratedEvent,
} from "@/content/events";

/** Evento unificado para UI pública (Luma curado + opcional Supabase). */
export interface PublicEvent {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  city: string | null;
  hosts: string[];
  tags: string[];
  registration_url: string | null;
  is_mystery: boolean;
  codename: string | null;
  teaser: string | null;
  is_published: boolean;
  /** Origen del registro. */
  source: "luma" | "supabase";
  tier: "community" | "city";
}

interface SupabaseEventRow {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  tags: string[] | null;
  registration_url: string | null;
  is_mystery: boolean;
  codename: string | null;
  teaser: string | null;
  is_published: boolean;
}

function curatedToPublic(e: CuratedEvent): PublicEvent {
  return {
    id: `luma-${e.id}`,
    title: e.title,
    subtitle: e.excerpt,
    description: e.excerpt,
    date: e.date,
    end_date: e.endDate ?? null,
    location: e.venue,
    city: e.city,
    hosts: e.hosts,
    tags: e.tags,
    registration_url: e.lumaUrl,
    is_mystery: false,
    codename: null,
    teaser: null,
    is_published: true,
    source: "luma",
    tier: e.tier,
  };
}

function supabaseToPublic(row: SupabaseEventRow): PublicEvent {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    date: row.date,
    end_date: row.end_date,
    location: row.location,
    city: "Mar del Plata",
    hosts: [],
    tags: row.tags ?? [],
    registration_url: row.registration_url,
    is_mystery: row.is_mystery,
    codename: row.codename,
    teaser: row.teaser,
    is_published: row.is_published,
    source: "supabase",
    tier: "community",
  };
}

function mergeEvents(
  curated: CuratedEvent[],
  supabaseRows: SupabaseEventRow[] | null,
): PublicEvent[] {
  const curatedPublic = curated.map(curatedToPublic);
  const curatedSlugs = new Set(
    curatedPublic
      .map((e) => lumaSlug(e.registration_url))
      .filter((s): s is string => Boolean(s)),
  );

  const fromSupabase = (supabaseRows ?? [])
    .filter((row) => row.is_published)
    .filter((row) => !isExcludedEvent({ title: row.title, registration_url: row.registration_url }))
    .filter((row) => {
      const slug = lumaSlug(row.registration_url);
      if (slug && curatedSlugs.has(slug)) return false;
      // Placeholders misteriosos sin Luma real — no mezclar con agenda curada.
      if (row.is_mystery) return false;
      return true;
    })
    .map(supabaseToPublic);

  return [...curatedPublic, ...fromSupabase];
}

export function getCuratedPublicEvents(): PublicEvent[] {
  return curatedEvents().map(curatedToPublic);
}

export function mergePublicEvents(
  supabaseRows: SupabaseEventRow[] | null,
): PublicEvent[] {
  return mergeEvents(curatedEvents(), supabaseRows);
}

export function partitionEvents(events: PublicEvent[], now = Date.now()) {
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = events
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pastCommunity = past.filter((e) => e.tier === "community");
  const pastCity = past.filter((e) => e.tier === "city");

  const nextEvent = upcoming[0] ?? null;

  return { upcoming, past, pastCommunity, pastCity, nextEvent };
}

export type { SupabaseEventRow };
