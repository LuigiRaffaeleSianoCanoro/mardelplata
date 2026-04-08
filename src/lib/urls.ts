export function normalizeExternalUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  if (!url) return null;

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  return `https://${url.replace(/^\/+/, "")}`;
}
