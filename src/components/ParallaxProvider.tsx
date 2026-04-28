"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

// Smooth scroll powered by Lenis. Hijacks native scroll, lerps toward the
// target each frame and emits a `scroll` event we mirror onto CSS variables
// (`--scroll-y`, `--reveal-progress`, `--reveal-inv-progress`) so the hero's
// parallax layers, sky overlay and dark→light fade keep working unchanged.
//
// Bandwidth-aware: skipped (and Lenis lazy-loaded) on save-data / 2G / slow-3G
// so cellular users don't pay for ~25KB of JS for an effect they wouldn't
// notice anyway. They get plain native scroll instead.

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

function isLowBandwidth(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  if (conn.effectiveType === "slow-2g" || conn.effectiveType === "2g") return true;
  return false;
}

export default function ParallaxProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // On low-bandwidth connections: skip Lenis entirely, fall back to a
    // lightweight rAF-throttled native scroll listener that just feeds the
    // CSS vars (no smoothing, no library cost).
    if (isLowBandwidth()) {
      const root = document.documentElement;
      let ticking = false;
      const update = () => {
        const y = window.scrollY;
        const h = window.innerHeight || 1;
        const range = h * 0.35;
        const progress = Math.min(1, Math.max(0, 1 - y / range));
        const sunRange = h * 0.95;
        const sunLin = Math.min(1, Math.max(0, y / sunRange));
        const sunRise = 1 - Math.pow(1 - sunLin, 3);
        root.style.setProperty("--scroll-y", `${y}px`);
        root.style.setProperty("--reveal-progress", `${progress}`);
        root.style.setProperty("--reveal-inv-progress", `${1 - progress}`);
        root.style.setProperty("--sun-rise", `${sunRise}`);
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    let raf = 0;
    let lenis: Lenis | null = null;
    let cleanedUp = false;
    let removeAnchorListener: (() => void) | null = null;

    // Dynamic import so Lenis isn't in the initial JS bundle for low-data
    // visitors who hit the early-return above.
    import("lenis").then(({ default: LenisCtor }) => {
      if (cleanedUp) return;
      const root = document.documentElement;

      lenis = new LenisCtor({
      // Lerp mode (per-frame interpolation) — snappier than duration mode,
      // no long residual tail that smears text. 0.12 = responsive but smooth.
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

      const sync = (scroll: number) => {
        const h = window.innerHeight || 1;
        const range = h * 0.35;
        const progress = Math.min(1, Math.max(0, 1 - scroll / range));
        // Sun rise — eased curve (ease-out cubic). The sun pops up fast at
        // the start of the scroll and slowly settles toward its max height,
        // so the animation reads as quick without feeling jumpy.
        const sunRange = h * 0.95;
        const sunLin = Math.min(1, Math.max(0, scroll / sunRange));
        const sunRise = 1 - Math.pow(1 - sunLin, 3);
        root.style.setProperty("--scroll-y", `${scroll}px`);
        root.style.setProperty("--reveal-progress", `${progress}`);
        root.style.setProperty("--reveal-inv-progress", `${1 - progress}`);
        root.style.setProperty("--sun-rise", `${sunRise}`);
      };

      lenis.on("scroll", ({ scroll }: { scroll: number }) => sync(scroll));
      sync(window.scrollY);

      const tick = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Disruptive anchor jumps — intercept in-page hash links and replace
      // the smooth scroll with a glitch tear + instant teleport. Feels like
      // a system cut rather than a slide.
      const handleAnchorClick = (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        const t = e.target as HTMLElement | null;
        const link = t?.closest('a[href*="#"]') as HTMLAnchorElement | null;
        if (!link) return;
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname !== window.location.pathname) return;
        const id = url.hash.slice(1);
        if (!id) return;
        const dest = document.getElementById(id);
        if (!dest) return;
        e.preventDefault();

        const overlay = document.createElement("div");
        overlay.className = "glitch-jump-overlay";
        document.body.appendChild(overlay);

        window.setTimeout(() => {
          lenis?.scrollTo(dest, { immediate: true });
          history.replaceState(null, "", `#${id}`);
        }, 180);

        window.setTimeout(() => {
          overlay.remove();
        }, 520);
      };
      document.addEventListener("click", handleAnchorClick);
      removeAnchorListener = () => document.removeEventListener("click", handleAnchorClick);
    });

    return () => {
      cleanedUp = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      removeAnchorListener?.();
    };
  }, []);

  return null;
}
