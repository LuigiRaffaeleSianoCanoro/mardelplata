/**
 * Rutas donde corre el middleware de sesión Supabase (edge).
 * El resto del sitio no invoca Fluid / edge middleware: páginas públicas ISR/CDN.
 */

/** Redirige a login si no hay usuario (defensa en profundidad con layout RSC). */
export const PROTECTED_PATH_PREFIXES = ["/admin", "/perfil", "/asistencias"] as const;

/**
 * Prefijos donde hace falta refrescar cookies de sesión aunque la ruta no esté protegida:
 * flujo de auth y API que usa `createClient()` server.
 */
export const SESSION_REFRESH_PREFIXES = ["/auth", "/api"] as const;

export function isProtectedPathname(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function shouldRunSessionMiddleware(pathname: string): boolean {
  if (isProtectedPathname(pathname)) return true;
  return SESSION_REFRESH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Matcher de Next.js — solo estas rutas ejecutan middleware (menos invocaciones en Vercel). */
export const SESSION_MIDDLEWARE_MATCHER = [
  "/admin/:path*",
  "/perfil",
  "/perfil/:path*",
  "/asistencias",
  "/asistencias/:path*",
  "/auth/:path*",
  "/api/:path*",
] as const;