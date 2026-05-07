"use client";

// Navbar — pill horizontal centrado tipo command palette.
// Logo + links + search + Ingresar + Sumate. Glassmorph dark con
// active-dot indicator debajo del link activo.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import CommandPalette from "./CommandPalette";

type NavLink = { href: string; label: string; match?: (path: string) => boolean };
type ResourceLink = { href: string; label: string; description: string };

const RESOURCES: ResourceLink[] = [
  { href: "/blog",          label: "Blog",          description: "Lo que la red está leyendo" },
  { href: "/reglamento",    label: "Reglamento",    description: "Cómo nos organizamos" },
  { href: "/brand",         label: "Brand kit",     description: "Logo, paleta, assets" },
  { href: "/marketing-kit", label: "Marketing kit", description: "Para sponsors y partners" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const resourcesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null),
    );
    return () => subscription.unsubscribe();
  }, []);

  // Cerrar dropdown Recursos al click fuera o Escape
  useEffect(() => {
    if (!resourcesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!resourcesRef.current?.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResourcesOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [resourcesOpen]);

  // Cmd+K / Ctrl+K abre el palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links: NavLink[] = [
    { href: "/", label: "Inicio", match: (p) => p === "/" },
    { href: "/red", label: "Comunidad" },
    { href: "/primer-trabajo", label: "Aprendizaje" },
    { href: "/bolsa", label: "Empleos" },
  ];

  const isActive = (l: NavLink) => {
    if (l.match) return l.match(pathname);
    return pathname === l.href || pathname.startsWith(l.href + "/");
  };

  const resourcesActive = RESOURCES.some(
    (r) => pathname === r.href || pathname.startsWith(r.href + "/"),
  );

  return (
    <>
    <header className={`nav-x ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-x-pill">
        <Link href="/" className="nav-x-brand" aria-label="Inicio">
          <span className="nav-x-brand-mark" aria-hidden>&lt;/&gt;</span>
          <span className="nav-x-brand-text">
            mardelplata<span className="nav-x-brand-accent">.dev</span>
          </span>
        </Link>

        <nav className="nav-x-links hidden lg:flex" aria-label="Principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-x-link ${isActive(l) ? "is-active" : ""}`}
            >
              {l.label}
            </Link>
          ))}

          <div className="nav-x-resources" ref={resourcesRef}>
            <button
              type="button"
              className={`nav-x-link nav-x-link-button ${resourcesActive ? "is-active" : ""} ${resourcesOpen ? "is-open" : ""}`}
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
              onClick={() => setResourcesOpen((o) => !o)}
            >
              Recursos <ChevronIcon />
            </button>
            {resourcesOpen && (
              <div className="nav-x-resources-menu" role="menu">
                {RESOURCES.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    role="menuitem"
                    className="nav-x-resources-item"
                    onClick={() => setResourcesOpen(false)}
                  >
                    <span className="nav-x-resources-item-label">{r.label}</span>
                    <span className="nav-x-resources-item-desc">{r.description}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="nav-x-end">
          <button
            type="button"
            className="nav-x-icon-btn hidden sm:inline-flex"
            aria-label="Buscar (Cmd+K)"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </button>
          <Link href={user ? "/perfil" : "/auth/login"} className="nav-x-ingresar hidden sm:inline-flex">
            {user ? "Perfil" : "Ingresar"}
          </Link>
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-x-sumate"
          >
            Sumate
          </a>
          <button
            className={`nav-x-burger lg:hidden ${menuOpen ? "is-open" : ""}`}
            aria-label="Menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="nav-x-burger-bar" />
            <span className="nav-x-burger-bar" />
            <span className="nav-x-burger-bar" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-x-mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-x-mobile-link ${isActive(l) ? "is-active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <div className="nav-x-mobile-section">
            <span className="nav-x-mobile-section-title">Recursos</span>
            {RESOURCES.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setMenuOpen(false)}
                className="nav-x-mobile-link nav-x-mobile-link-sub"
              >
                {r.label}
              </Link>
            ))}
          </div>
          <Link
            href={user ? "/perfil" : "/auth/login"}
            onClick={() => setMenuOpen(false)}
            className="nav-x-mobile-link"
          >
            {user ? "Perfil" : "Ingresar"}
          </Link>
        </div>
      )}
    </header>

    <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
