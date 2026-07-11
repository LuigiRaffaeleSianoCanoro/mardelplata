"use client";

// ScrollDriver — efectos sin UI. Publica `--scroll-progress` (0→1) en el
// documentElement (la home muta acentos a partir de esa var) e intercepta
// clicks en links con hash para hacer un anchor-warp con overlay glitch.
//
// Antes ademas dibujaba un side-rail con chapter ticks y un IntersectionObserver
// para resaltar el capitulo activo. Lo removimos en la review del PR #26
// porque se solapaba con el contenido y generaba missclicks.

import { useEffect } from "react";

export default function ScrollDriver() {
  // 1) Escuchar scroll → escribir --scroll-progress en :root
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        p.toFixed(4),
      );
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  // 2) Anchor warp: click en cualquier link in-page → overlay glitch +
  //    teleport instantaneo cuando la opacidad esta saturada.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
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

      // Reduced-motion: teleport inmediato, sin overlay glitch ni delay.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const top = dest.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
        history.replaceState(null, "", `#${id}`);
        return;
      }

      const overlay = document.createElement("div");
      overlay.className = "glitch-jump-overlay";
      document.body.appendChild(overlay);

      window.setTimeout(() => {
        const top = dest.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
        history.replaceState(null, "", `#${id}`);
      }, 180);

      window.setTimeout(() => {
        overlay.remove();
      }, 520);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
