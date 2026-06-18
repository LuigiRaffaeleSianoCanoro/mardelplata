// huevsite.io — integración con la API pública de perfiles.
//
// El blog "API pública de perfiles" (https://huevsite.io/blog/api-publica-de-perfiles)
// expone, sin auth y con CORS abierto:
//   - GET https://huevsite.io/api/public/profile/{username}  → card JSON (cachea 5 min)
//   - https://huevsite.io/{username}?embed=1                  → perfil embebible en <iframe>
//
// Guardamos en el perfil del miembro SOLO el username. Acá normalizamos lo que
// pegue (handle, @handle o URL completa) y armamos las URLs derivadas.

export const HUEVSITE_BASE_URL = "https://huevsite.io";

// Handles válidos en huevsite: letras, números, guión y guión bajo. Acotamos
// largo para evitar inputs absurdos. Case se preserva pero la API es case-insensitive.
const USERNAME_RE = /^[a-zA-Z0-9_-]{1,40}$/;

// Rutas reservadas de huevsite.io que NUNCA son un username de perfil — si el
// usuario pega una de estas (ej. copió la URL del blog) la descartamos.
const RESERVED_SEGMENTS = new Set([
  "blog",
  "api",
  "about",
  "login",
  "signup",
  "settings",
  "dashboard",
  "explore",
  "pricing",
  "terms",
  "privacy",
]);

/**
 * Normaliza lo que el usuario ingrese a un username limpio de huevsite.
 * Acepta: "ada", "@ada", "huevsite.io/ada", "https://huevsite.io/ada?embed=1".
 * Devuelve el handle (ej. "ada") o null si no es válido.
 */
export function normalizeHuevsiteUsername(input?: string | null): string | null {
  if (!input) return null;
  let value = input.trim();
  if (!value) return null;

  // Si parece una URL (o un host huevsite), quedarnos con el primer segmento del path.
  if (value.includes("/") || value.includes("huevsite")) {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(withProtocol);
      // Tomamos el primer segmento no vacío del path.
      const segment = url.pathname.split("/").filter(Boolean)[0];
      value = segment ?? "";
    } catch {
      // No era una URL parseable — caemos al saneado de abajo.
      value = value.split("/").filter(Boolean).pop() ?? value;
    }
  }

  value = value.replace(/^@+/, "").trim();
  if (!value) return null;
  if (RESERVED_SEGMENTS.has(value.toLowerCase())) return null;
  if (!USERNAME_RE.test(value)) return null;

  return value;
}

export function huevsiteProfileUrl(username: string): string {
  return `${HUEVSITE_BASE_URL}/${encodeURIComponent(username)}`;
}

export function huevsiteEmbedUrl(username: string): string {
  return `${HUEVSITE_BASE_URL}/${encodeURIComponent(username)}?embed=1`;
}

export function huevsiteApiUrl(username: string): string {
  return `${HUEVSITE_BASE_URL}/api/public/profile/${encodeURIComponent(username)}`;
}

/** Card pública que devuelve la API de huevsite. */
export interface HuevsiteProfile {
  username: string;
  name: string | null;
  headline: string | null;
  avatar: string | null;
  accentColor: string | null;
  builderScore: number | null;
  url: string;
}

export type HuevsiteFetchResult =
  | { status: "ok"; profile: HuevsiteProfile }
  | { status: "not_found" }
  | { status: "error" };

/**
 * Trae la card pública de un huevsite. Pensado para correr en el browser
 * (CORS abierto). Distingue 404 (usuario inexistente → ocultar) de errores
 * de red (mostrar fallback con datos locales).
 */
export async function fetchHuevsiteProfile(
  rawUsername: string,
  signal?: AbortSignal,
): Promise<HuevsiteFetchResult> {
  const username = normalizeHuevsiteUsername(rawUsername);
  if (!username) return { status: "not_found" };

  try {
    const res = await fetch(huevsiteApiUrl(username), {
      signal,
      headers: { Accept: "application/json" },
    });

    if (res.status === 404) return { status: "not_found" };
    if (!res.ok) return { status: "error" };

    const data = (await res.json()) as Partial<HuevsiteProfile> & {
      username?: string;
    };

    return {
      status: "ok",
      profile: {
        username: data.username ?? username,
        name: data.name ?? null,
        headline: data.headline ?? null,
        avatar: data.avatar ?? null,
        accentColor: normalizeAccentColor(data.accentColor),
        builderScore:
          typeof data.builderScore === "number" ? data.builderScore : null,
        url: data.url ?? huevsiteProfileUrl(username),
      },
    };
  } catch {
    // Abort o fallo de red.
    return { status: "error" };
  }
}

// Solo confiamos en colores hex (#RGB / #RRGGBB) para inyectarlos como estilo.
function normalizeAccentColor(value?: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ? v : null;
}
