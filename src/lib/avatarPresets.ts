/** Sponsor logos withdrawn from the preset picker; still matched for display + DB cleanup. */
const NEXTSOLUTION_RETIRED_PATH =
  "/avatar-icons/avatar_WhatsApp Image 2026-04-15 at 11.55.46.png";
const NEXTSOLUTION_RETIRED_ENCODED =
  "/avatar-icons/avatar_WhatsApp%20Image%202026-04-15%20at%2011.55.46.png";

/** Unique substring of the sponsor filename; matches relative paths, Supabase Storage URLs, and mixed encoding. */
const NEXTSOLUTION_URL_SNIPPET = "whatsapp image 2026-04-15 at 11.55.46";

export const RETIRED_PRESET_AVATAR_URLS = [
  NEXTSOLUTION_RETIRED_PATH,
  NEXTSOLUTION_RETIRED_ENCODED,
] as const;

function normalizeAvatarPathUrl(url: string): string {
  const trimmed = url.trim();
  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    decoded = trimmed;
  }
  const withSlash = decoded.startsWith("/") ? decoded : `/${decoded}`;
  return withSlash.replace(/\/+/g, "/");
}

function pathMatchesRetired(normalizedPath: string): boolean {
  for (const r of RETIRED_PRESET_AVATAR_URLS) {
    if (normalizeAvatarPathUrl(r) === normalizedPath) return true;
  }
  return false;
}

function urlLooksLikeNextsolutionAsset(url: string): boolean {
  let decoded = url;
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded.toLowerCase().includes(NEXTSOLUTION_URL_SNIPPET);
}

export function isRetiredPresetAvatarUrl(url?: string | null): boolean {
  if (!url) return false;
  if (urlLooksLikeNextsolutionAsset(url)) return true;
  try {
    if (/^https?:\/\//i.test(url)) {
      return pathMatchesRetired(new URL(url).pathname);
    }
  } catch {
    return false;
  }
  return pathMatchesRetired(normalizeAvatarPathUrl(url));
}

export const FLATICON_AVATARS = [
  "/avatar-icons/sea-snail.png",
  "/avatar-icons/sea-lion.png",
  "/avatar-icons/starfish.png",
  "/avatar-icons/lighthouse.png",
  "/avatar-icons/summer.png",
  "/avatar-icons/wallbit.png",
  "/avatar-icons/softbox.png",
  "/avatar-icons/whatsapp-01.png",
  "/avatar-icons/whatsapp-02.png",
] as const;

export const TECH_AVATARS = [
  "/avatars/tech-01.svg",
  "/avatars/tech-02.svg",
  "/avatars/tech-03.svg",
  "/avatars/tech-04.svg",
  "/avatars/tech-05.svg",
] as const;

export const AVATAR_PRESETS = [...FLATICON_AVATARS, ...TECH_AVATARS] as const;

const PHOTO_ALLOWED_EMAILS = new Set([
  "phoenix_luigi@hotmail.com",
  "petruu.fi@gmail.com",
]);

export function isAvatarPhotoAuthorizedEmail(email?: string | null) {
  const normalized = (email || "").trim().toLowerCase();
  return PHOTO_ALLOWED_EMAILS.has(normalized);
}

export function isAllowedPresetAvatarUrl(url?: string | null) {
  if (!url || isRetiredPresetAvatarUrl(url)) return false;
  return AVATAR_PRESETS.includes(url as (typeof AVATAR_PRESETS)[number]);
}

export function getFallbackAvatar(seed?: string | null) {
  const key = (seed || "miembro").trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FLATICON_AVATARS.length;
  return FLATICON_AVATARS[index];
}

/** Public avatar src: retired sponsor URLs map to a deterministic coast preset. */
export function resolveAvatarDisplayUrl(
  avatar_url: string | null | undefined,
  seed?: string | null,
): string {
  if (!avatar_url || isRetiredPresetAvatarUrl(avatar_url)) {
    return getFallbackAvatar(seed);
  }
  return avatar_url;
}
