"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Disruptive route transition. Intercepts in-app navigation clicks (any
// internal `<a href="/...">`) and replaces Next's default with:
//   1. terminal panel boots in the bottom-left, types shell-like lines
//   2. router.push fires while the screen flashes a sapphire/magenta tear
//   3. when the new pathname mounts the overlay glitches out
// Hash-only navigations are left to ParallaxProvider's teleport handler.

type Phase = "idle" | "out" | "in";

export default function RouteGlitch() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<string>("");
  const lockedRef = useRef(false);
  const prevPathRef = useRef(pathname);

  // Capture-phase click interceptor. We need capture so we beat Next.js's
  // own Link handler (which lives on the React root).
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (lockedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const t = e.target as HTMLElement | null;
      const link = t?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      const raw = link.getAttribute("href");
      if (!raw) return;
      // Only same-origin internal routes
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, no path change → let other handlers (anchor teleport) take over
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      lockedRef.current = true;
      setTarget(url.pathname);
      setPhase("out");

      // Boot terminal for ~700ms before pushing — enough to read the lines
      window.setTimeout(() => {
        router.push(url.pathname + url.search + url.hash);
      }, 720);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [router]);

  // When pathname actually changes, run the glitch-in and unmount the overlay.
  useEffect(() => {
    if (phase !== "out") {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;
    setPhase("in");
    const t = window.setTimeout(() => {
      setPhase("idle");
      lockedRef.current = false;
    }, 520);
    return () => window.clearTimeout(t);
  }, [pathname, phase]);

  if (phase === "idle") return null;

  return (
    <div className="route-glitch" data-phase={phase} aria-hidden="true">
      <div className="route-glitch-veil" />

      <div className="route-glitch-term">
        <div className="route-glitch-bar">
          <span className="rg-dot" />
          <span className="rg-dot" />
          <span className="rg-dot" />
          <span className="rg-title">mdpdev@navigator: ~</span>
        </div>
        <pre className="route-glitch-lines">
          <span className="rg-line" style={{ animationDelay: "0ms" }}>
            <span className="rg-prompt">$</span> <span className="rg-cmd">route</span>{" "}
            <span className="rg-arg">{target || "/"}</span>
          </span>
          <span className="rg-line" style={{ animationDelay: "100ms" }}>
            <span className="rg-ok">[ok]</span> resolving target...
          </span>
          <span className="rg-line" style={{ animationDelay: "220ms" }}>
            <span className="rg-ok">[ok]</span> handshake @ atlántico.sur:443
          </span>
          <span className="rg-line" style={{ animationDelay: "340ms" }}>
            <span className="rg-ok">[ok]</span> stream open · sonar ping
          </span>
          <span className="rg-line" style={{ animationDelay: "460ms" }}>
            <span className="rg-ok">[ok]</span> mount {target || "/"}
          </span>
          <span className="rg-line" style={{ animationDelay: "580ms" }}>
            <span className="rg-prompt">→</span> compiling page
            <span className="rg-cursor">_</span>
          </span>
        </pre>
      </div>

      <div className="route-glitch-tear" />
      <div className="route-glitch-tear rg-tear-2" />
      <div className="route-glitch-noise" />
    </div>
  );
}
