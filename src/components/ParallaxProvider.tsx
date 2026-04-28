"use client";

import { useEffect } from "react";

// Sets `--scroll-y` (in px) on <html> on every scroll. CSS classes like
// `.parallax-back`, `.parallax-mid`, `.parallax-fore` use it via
// `translate: 0 calc(var(--scroll-y) * 0.x)` for true scroll-driven parallax.
// rAF-throttled and passive-listened for performance.

export default function ParallaxProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const root = document.documentElement;
    let ticking = false;

    const update = () => {
      root.style.setProperty("--scroll-y", `${window.scrollY}px`);
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
  }, []);

  return null;
}
