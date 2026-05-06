"use client";

// Navbar — pill horizontal centrado tipo command palette.
// Logo + links + search + Ingresar + Sumate. Glassmorph dark con
// active-dot indicator debajo del link activo.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type NavLink = { href: string; label: string; match?: (path: string) => boolean };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

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

  return (
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
          <Link href="/reglamento" className="nav-x-link">
            Recursos <ChevronIcon />
          </Link>
        </nav>

        <div className="nav-x-end">
          <button className="nav-x-icon-btn hidden sm:inline-flex" aria-label="Buscar">
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
