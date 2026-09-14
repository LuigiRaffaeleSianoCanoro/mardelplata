/**
 * Helpers para la API pública no documentada de Luma (api.lu.ma / api2.luma.com).
 * Usado por scripts/sync-luma-events.mjs — no importar desde la app Next.
 */

const LUMA_URL_API = "https://api.lu.ma/url";
const LUMA_DISCOVER_API = "https://api2.luma.com/discover/get-paginated-events";

/** Slugs y patrones — mantener alineado con src/content/events/index.ts */
export const LUMA_EXCLUDE_SLUGS = new Set([
  "fktjzk1y",
  "b8qc0zng",
]);

export const EVENT_EXCLUDE_PATTERNS = [
  /psicoconecta/i,
  /\bpavla\b/i,
  /\bdisro\b/i,
  /builders\s+off\s+the\s+record/i,
  /inauguracion\s+psicoconecta/i,
];

export function lumaSlug(url) {
  if (!url) return null;
  const m = String(url).match(/luma\.com\/(?:event\/)?([a-zA-Z0-9_-]+)/i);
  return m?.[1]?.toLowerCase() ?? null;
}

export function isExcludedEvent({ title = "", hosts = [], lumaUrl = null }) {
  const slug = lumaSlug(lumaUrl);
  if (slug && LUMA_EXCLUDE_SLUGS.has(slug)) return true;
  const haystack = [title, ...(hosts ?? [])].join(" ");
  return EVENT_EXCLUDE_PATTERNS.some((re) => re.test(haystack));
}

export function prosemirrorToText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(prosemirrorToText).join("");
}

/** Convierte UTC ISO de Luma a ISO con offset Argentina (-03:00). */
export function toArgentinaISO(utcIso) {
  if (!utcIso) return null;
  const date = new Date(utcIso);
  if (Number.isNaN(date.getTime())) return null;
  const formatted = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(" ", "T");
  return `${formatted}-03:00`;
}

export function todayArgentina() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());
}

export function venueFromLuma(geo) {
  if (!geo) return "Mar del Plata";
  const localized = geo.localized?.["es-419"] ?? geo.localized?.es ?? geo;
  const short = localized?.short_address ?? geo.short_address;
  if (short) return short;
  const full = localized?.full_address ?? geo.full_address;
  if (full) return full.split(",")[0]?.trim() ?? full;
  return geo.city ?? "Mar del Plata";
}

export function excerptFromLuma(data, maxLen = 220) {
  const dm = data?.description_mirror ?? data?.event?.description_mirror;
  const raw = prosemirrorToText(dm).replace(/\s+/g, " ").trim();
  if (!raw) return null;
  if (raw.length <= maxLen) return raw;
  const cut = raw.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : maxLen - 1).trim()}…`;
}

export function inferTier({ hosts = [], calendarSlug = null }) {
  const haystack = [...hosts, calendarSlug ?? ""].join(" ").toLowerCase();
  if (
    haystack.includes("mar del plata dev") ||
    haystack.includes("luigi") ||
    haystack.includes("spacexai-mar-del-plata")
  ) {
    return "community";
  }
  return "city";
}

export function stableEventId(slug, title) {
  const base = (title ?? slug)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const year = new Date().getFullYear();
  return `${base}-${year}`.replace(/-+/g, "-");
}

export async function fetchLumaBySlug(slug) {
  const url = `${LUMA_URL_API}?url=${encodeURIComponent(slug)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Luma URL API ${res.status} for slug ${slug}`);
  }
  const body = await res.json();
  if (body.kind !== "event" || !body.data?.event) {
    return null;
  }
  return body.data;
}

export async function fetchDiscoverEvents({ latitude, longitude, paginationLimit = 50 }) {
  const events = [];
  let cursor = null;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      pagination_limit: String(paginationLimit),
    });
    if (cursor) params.set("pagination_cursor", cursor);

    const res = await fetch(`${LUMA_DISCOVER_API}?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Luma discover API ${res.status}`);
    }
    const body = await res.json();
    for (const entry of body.entries ?? []) {
      const ev = entry.event ?? entry;
      if (!ev?.url) continue;
      events.push({
        slug: ev.url,
        apiId: ev.api_id,
        title: ev.name,
        startAt: ev.start_at,
        endAt: ev.end_at,
        timezone: ev.timezone,
        visibility: ev.visibility,
      });
    }
    hasMore = Boolean(body.has_more);
    cursor = body.next_cursor ?? null;
    if (!cursor) hasMore = false;
  }

  return events;
}

export function mapLumaDataToEventFields(data, { calendarSlug = null } = {}) {
  const ev = data.event;
  const hosts = (data.hosts ?? []).map((h) =>
    typeof h === "string" ? h : h.name ?? h.user?.name ?? "",
  ).filter(Boolean);

  const lumaUrl = `https://luma.com/${ev.url ?? lumaSlug(data.url)}`;
  const title = ev.name ?? "Evento";
  const excerpt = excerptFromLuma(data) ?? `${title} — evento en Mar del Plata.`;

  return {
    title,
    excerpt,
    date: toArgentinaISO(ev.start_at),
    endDate: toArgentinaISO(ev.end_at),
    venue: venueFromLuma(ev.geo_address_info),
    city: ev.geo_address_info?.city ?? "Mar del Plata",
    hosts,
    lumaUrl,
    tags: inferTags(title, hosts),
    tier: inferTier({ hosts, calendarSlug }),
    verifiedAt: todayArgentina(),
  };
}

function inferTags(title, hosts) {
  const haystack = [title, ...hosts].join(" ").toLowerCase();
  const tags = [];
  if (/hackathon|hack/i.test(haystack)) tags.push("hackathon");
  if (/meetup|café|cafe|networking/i.test(haystack)) tags.push("meetup");
  if (/\bia\b|cursor|tech/i.test(haystack)) tags.push("IA");
  if (tags.length === 0) tags.push("comunidad");
  return [...new Set(tags)].slice(0, 4);
}
