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
  if (!url) return false;
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
