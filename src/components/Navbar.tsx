"use client";

// Navbar HUD — tira fina mono-style con brand + status dot a la izq,
// links centrales separados por puntos, UTC + perfil/ingresar a la der.
// Lenguaje visual unificado con la intro (mono labels, sapphire accents,
// thin borders).

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

  const links: NavLink[] = [
    { href: "/red", label: "RED" },
    { href: "/bolsa", label: "BOLSA" },
    { href: "/primer-trabajo", label: "TRABAJO" },
    { href: "/reglamento", label: "REGLAMENTO" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={`nav-hud ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-hud-inner">
        <Link href="/#inicio" className="nav-hud-brand" aria-label="Inicio">
          <span className="hud-status-dot" />
          <span className="nav-hud-brand-text">
            mardelplata<span className="nav-hud-brand-accent">.dev</span>
          </span>
        </Link>

        <nav className="nav-hud-links hidden md:flex" aria-label="Principal">
          {links.map((l, i) => (
            <Fragment key={l.href}>
              <Link
                href={l.href}
                className={`nav-hud-link ${isActive(l.href) ? "is-active" : ""}`}
              >
                {l.label}
              </Link>
              {i < links.length - 1 && (
                <span className="nav-hud-sep" aria-hidden>
                  ·
                </span>
              )}
            </Fragment>
          ))}
        </nav>

        <Link
          href={user ? "/perfil" : "/auth/login"}
          className="nav-hud-cta hidden md:inline-flex"
        >
          {user ? "PERFIL" : "INGRESAR"}
          <span className="nav-hud-arrow" aria-hidden>
            →
          </span>
        </Link>

        <button
          className="nav-hud-burger md:hidden"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <path d="M12 4 4 12M4 4l8 8" />
            ) : (
              <path d="M2 5h12M2 8h12M2 11h12" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="nav-hud-mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`nav-hud-mobile-link ${
                isActive(l.href) ? "is-active" : ""
              }`}
            >
              <span className="nav-hud-mobile-prompt" aria-hidden>
                ›
              </span>
              {l.label}
            </Link>
          ))}
          <Link
            href={user ? "/perfil" : "/auth/login"}
            onClick={() => setMenuOpen(false)}
            className="nav-hud-mobile-cta"
          >
            {user ? "PERFIL" : "INGRESAR"} <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </header>
  );
}
