"use client";

// ScrollDriver — escucha el scroll y publica `--scroll-progress` (0→1) en
// el documentElement. La home usa esa variable para mutar acentos del
// violeta al sapphire a medida que avanzas. Además dibuja un side-rail
// 3D con chapter ticks y un current-chapter label que se actualiza por
// IntersectionObserver.

import { useEffect, useState } from "react";

const CHAPTERS = [
  { id: "inicio", label: "Inicio", num: "00" },
  { id: "eventos", label: "Eventos", num: "01" },
  { id: "colaboradores", label: "Comunidad", num: "02" },
  { id: "manifiesto", label: "Manifiesto", num: "03" },
  { id: "empleos", label: "Empleos", num: "04" },
];

export default function ScrollDriver() {
  const [activeChapter, setActiveChapter] = useState<string>("inicio");

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

  // 2) Anchor warp: click en una tick del rail (o cualquier link in-page)
  //    NO salta de golpe — overlay glitch + teleport instantaneo cuando el
  //    overlay esta a full opacity. Antes vivia en ParallaxProvider con
  //    Lenis; ahora standalone con scrollTo nativo.
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

      const overlay = document.createElement("div");
      overlay.className = "glitch-jump-overlay";
      document.body.appendChild(overlay);

      // Teleport mid-glitch (180ms) — la opacidad esta saturada y enmascara
      // el salto. Despues remueve el overlay cuando termina la animacion.
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

  // 3) IntersectionObserver para detectar capítulo activo
  useEffect(() => {
    const targets = CHAPTERS
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el != null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Tomamos el que tiene mayor intersection ratio
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.intersectionRatio > b.intersectionRatio ? a : b,
        );
        const id = top.target.getAttribute("id");
        if (id) setActiveChapter(id);
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="scroll-driver" aria-hidden>
      {/* Rail 3D vertical con chapter ticks */}
      <div className="scroll-driver-rail">
        <div className="scroll-driver-rail-fill" />
        {CHAPTERS.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`scroll-driver-tick ${activeChapter === c.id ? "is-active" : ""}`}
            style={{ top: `${(i / (CHAPTERS.length - 1)) * 100}%` }}
          >
            <span className="scroll-driver-tick-num">{c.num}</span>
            <span className="scroll-driver-tick-label">{c.label}</span>
            <span className="scroll-driver-tick-dot" />
          </a>
        ))}
      </div>
    </div>
  );
}
