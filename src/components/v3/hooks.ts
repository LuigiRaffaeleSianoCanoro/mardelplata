"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { THEME_KEY } from "@/lib/v3/theme-boot";

export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** matchMedia reactivo. En SSR devuelve `fallback`. */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const DESKTOP_QUERY = "(min-width: 1024px)";

/* ── Tema (dark por defecto; light opcional) ─────────────────────────── */

export type Theme = "dark" | "light";
const themeListeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-mdp-theme") === "light" ? "light" : "dark";
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const theme = useSyncExternalStore(
    (cb) => {
      themeListeners.add(cb);
      return () => themeListeners.delete(cb);
    },
    readTheme,
    () => "dark" as Theme,
  );
  const setTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-mdp-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {}
    themeListeners.forEach((l) => l());
  }, []);
  return [theme, setTheme];
}

/* ── Sesión (Supabase) ───────────────────────────────────────────────── */

export function useSessionUser(): User | null {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    let unsub: (() => void) | undefined;
    // Diferido: no compite con el primer paint / LCP.
    let cancelled = false;
    const id = window.setTimeout(async () => {
      const { createClient } = await import("@/lib/supabase/client");
      if (cancelled) return;
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null)).catch(() => {});
      const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
      unsub = () => data.subscription.unsubscribe();
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
      unsub?.();
    };
  }, []);
  return user;
}

/* ── Fit: nunca scrollear; se ocultan piezas opcionales si no entran ──── */

/**
 * Dentro de `containerRef`, los hijos con `data-fit="N"` son opcionales.
 * Si el contenido desborda, se ocultan de mayor a menor N hasta que entra.
 * Las media queries de altura (short/shorter) hacen el trabajo grueso; esto
 * cubre los casos raros (landscape, zoom, fuentes grandes).
 */
export function useFitChildren(containerRef: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const frame = useRef(0);
  useIsoLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const run = () => {
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-fit]"));
      nodes.forEach((n) => (n.style.display = ""));
      const ordered = nodes
        .filter((n) => getComputedStyle(n).display !== "none")
        .sort((a, b) => Number(b.dataset.fit) - Number(a.dataset.fit));
      for (const n of ordered) {
        if (el.scrollHeight <= el.clientHeight + 1) break;
        n.style.display = "none";
      }
    };
    run();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(run);
    });
    ro.observe(el);
    // El contenido puede cambiar sin que cambie el contenedor (chunks lazy, fuentes, imágenes).
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(run);
    });
    mo.observe(el, { childList: true, subtree: true });
    document.fonts?.ready.then(() => requestAnimationFrame(run)).catch(() => {});
    return () => {
      mo.disconnect();
      ro.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, deps);
}
