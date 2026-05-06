"use client";

// Navbar wave-tech v2: una "tira" compacta con módulos hexagonales
// independientes conectados por flujos de energía. Estructura matchea las
// references (MDPDEV brand a la izq, links + chip central, CTA + burger
// a la der). Paleta cyan → violeta → magenta.

import { Fragment, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type NavLink = { href: string; label: string };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const prefix = isHome ? "" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const linksLeft: NavLink[] = [
    { href: "/bolsa", label: "bolsa" },
    { href: "/reglamento", label: "reglamento" },
  ];
  const linksRight: NavLink[] = [
    { href: "/primer-trabajo", label: "primer trabajo" },
    { href: "/red", label: "la red" },
  ];
  const allLinks: NavLink[] = [...linksLeft, ...linksRight];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-3 pt-3 pointer-events-none flex justify-center">
      <nav
        className={`nav-strip pointer-events-auto ${
          scrolled || !isHome ? "is-scrolled" : ""
        }`}
      >
        {/* Links izquierdos con flows entre ellos. md+ */}
        <div className="nav-strip-row hidden md:flex">
          {linksLeft.map((l, i) => (
            <Fragment key={l.href}>
              <LinkModule href={l.href} label={l.label} active={isActive(l.href)} />
              {i < linksLeft.length - 1 && <Flow />}
            </Fragment>
          ))}
          <Flow />
        </div>

        {/* Chip central con el logo y wordmark */}
        <CenterChip prefix={prefix} />

        {/* Links derechos */}
        <div className="nav-strip-row hidden md:flex">
          <Flow />
          {linksRight.map((l, i) => (
            <Fragment key={l.href}>
              <LinkModule href={l.href} label={l.label} active={isActive(l.href)} />
              {i < linksRight.length - 1 && <Flow />}
            </Fragment>
          ))}
        </div>

        {/* CTA: ingresar / perfil con flecha */}
        <Flow className="hidden md:inline-block" />
        <Cta user={user} />

        {/* Burger circular en mobile */}
        <button
          className="nav-burger md:hidden"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            {menuOpen ? <path d="M12 4 4 12M4 4l8 8" /> : <path d="M2 5h12M2 8h12M2 11h12" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-panel mx-auto pointer-events-auto">
          <ul>
            {allLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`nav-mobile-link ${isActive(l.href) ? "is-active" : ""}`}
                >
                  <span className="nav-mobile-prompt">{">"}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/* ---------- subcomponentes ---------- */

function CenterChip({ prefix }: { prefix: string }) {
  return (
    <Link href={`${prefix}#inicio`} className="nav-chip" aria-label="Inicio">
      <span className="nav-chip-bg" aria-hidden />
      <NavGlitchMesh />
      <span className="nav-chip-glyph" aria-hidden>
        <ChipWaveIcon />
      </span>
      <span className="nav-chip-wordmark" data-text="mar_del_plata.dev">
        mar_del_plata<span className="nav-chip-wordmark-accent">.dev</span>
      </span>
    </Link>
  );
}

function LinkModule({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href} className={`nav-link ${active ? "is-active" : ""}`}>
      <span className="nav-link-bg" aria-hidden />
      <NavGlitchMesh />
      <span className="nav-link-text" data-text={label}>{label}</span>
    </Link>
  );
}

function Cta({ user }: { user: User | null }) {
  const href = user ? "/perfil" : "/auth/login";
  const label = user ? "perfil" : "ingresar";
  return (
    <Link href={href} className="nav-cta">
      <span className="nav-cta-bg" aria-hidden />
      <NavGlitchMesh />
      <span className="nav-cta-text" data-text={label}>{label}</span>
      <span className="nav-cta-arrow" aria-hidden>→</span>
    </Link>
  );
}

// Mini-mesh triangulado que se enciende al hover. Los polígonos pulsan con
// stroke alternando cyan/magenta dando lectura de "low-poly glitch tech".
function NavGlitchMesh() {
  return (
    <svg
      className="nav-glitch-mesh"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g>
        <polygon points="0,15 14,2 28,15" />
        <polygon points="14,2 28,15 42,2" />
        <polygon points="28,15 42,2 56,15" />
        <polygon points="42,2 56,15 70,2" />
        <polygon points="56,15 70,2 84,15" />
        <polygon points="70,2 84,15 100,2" />
        <polygon points="86,15 100,2 100,15" />
        <polygon points="0,15 14,28 28,15" />
        <polygon points="14,28 28,15 42,28" />
        <polygon points="28,15 42,28 56,15" />
        <polygon points="42,28 56,15 70,28" />
        <polygon points="56,15 70,28 84,15" />
        <polygon points="70,28 84,15 100,28" />
      </g>
    </svg>
  );
}

function Flow({ className = "" }: { className?: string }) {
  return (
    <span className={`nav-flow ${className}`} aria-hidden>
      <span className="nav-flow-dot" />
    </span>
  );
}

// Icono cyan-violeta tipo wave para el chip central
function ChipWaveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="navChipWaveG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(140, 195, 240, 1)" />
          <stop offset="55%" stopColor="rgba(170, 130, 255, 1)" />
          <stop offset="100%" stopColor="rgba(230, 130, 220, 1)" />
        </linearGradient>
      </defs>
      <path
        d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0"
        stroke="url(#navChipWaveG)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"
        stroke="url(#navChipWaveG)"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
