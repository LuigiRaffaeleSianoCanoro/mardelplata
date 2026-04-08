export const AVATAR_PRESETS = [
  "/avatars/tech-01.svg",
  "/avatars/tech-02.svg",
  "/avatars/tech-03.svg",
  "/avatars/tech-04.svg",
  "/avatars/tech-05.svg",
] as const;

export function isFounderName(name?: string | null) {
  const normalized = (name || "").trim().toLowerCase();
  return normalized === "luigi canoro" || normalized === "franco petruccelli";
}

export function getFallbackAvatar(seed?: string | null) {
  const key = (seed || "miembro").trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PRESETS.length;
  return AVATAR_PRESETS[index];
}
