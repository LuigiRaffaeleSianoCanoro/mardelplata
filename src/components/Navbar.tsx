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
type NavMenu = { label: string; items: ResourceLink[] };

// Menús agrupados por recorrido (rediseño T9 — docs/nomad-it-hub/03-redesign.md).
// Brand kit + Marketing kit quedan accesibles por URL pero no expuestos en
// la nav (review Luigi PR #26 punto 4).
const MENUS: NavMenu[] = [
  {
    label: "Vivir acá",
    items: [
      { href: "/vivir-en-mardelplata", label: "Vivir en MdP", description: "Costo de vida, internet y visa" },
      { href: "/que-hacer",  label: "Qué hacer",  description: "Playas, naturaleza y cultura" },
      { href: "/estudiar",   label: "Estudiar",   description: "Carreras tech en la ciudad" },
    ],
  },
  {
    label: "Ecosistema",
    items: [
      { href: "/empresas",   label: "Empresas",   description: "Directorio del ecosistema tech" },
      { href: "/invertir",   label: "Invertir",   description: "El polo tech para empresas IT" },
    ],
  },
  {
    label: "Recursos",
    items: [
      { href: "/blog",       label: "Blog",       description: "Lo que la red está leyendo" },
      { href: "/reglamento", label: "Reglamento", description: "Cómo nos organizamos" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const menusRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const initial = user
    ? (user.user_metadata?.full_name as string | undefined)?.trim().charAt(0).toUpperCase()
      ?? user.email?.trim().charAt(0).toUpperCase()
      ?? "·"
    : "";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfileOpen(false);
  };

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

  // Cerrar el dropdown abierto al click fuera o Escape
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (!menusRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  // Cerrar dropdown Perfil al click fuera o Escape
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

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
    // /proyectos es la entrada publica al directorio (Navbar landing).
    // /red sigue existiendo como app shell para usuarios autenticados.
    { href: "/proyectos", label: "Comunidad", match: (p) => p === "/proyectos" || p.startsWith("/red") },
    { href: "/primer-trabajo", label: "Aprendizaje" },
    { href: "/bolsa", label: "Empleos" },
  ];

  const isActive = (l: NavLink) => {
    if (l.match) return l.match(pathname);
    return pathname === l.href || pathname.startsWith(l.href + "/");
  };

  const isMenuActive = (menu: NavMenu) =>
    menu.items.some((r) => pathname === r.href || pathname.startsWith(r.href + "/"));

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

          <div className="nav-x-menus" ref={menusRef} style={{ display: "contents" }}>
          {MENUS.map((menu) => (
            <div className="nav-x-resources" key={menu.label}>
            <button
              type="button"
              className={`nav-x-link nav-x-link-button ${isMenuActive(menu) ? "is-active" : ""} ${openMenu === menu.label ? "is-open" : ""}`}
              aria-haspopup="menu"
              aria-expanded={openMenu === menu.label}
              onClick={(e) => {
                // stopPropagation para que el click-outside listener
                // (que el useEffect registra apenas openMenu pasa a no-null)
                // NO capture este mismo evento al bubble y cierre el dropdown
                // inmediatamente. Bug clásico React + click outside.
                e.stopPropagation();
                setOpenMenu((o) => (o === menu.label ? null : menu.label));
              }}
            >
              {menu.label} <ChevronIcon />
            </button>
            {openMenu === menu.label && (
              <div className="nav-x-resources-menu" role="menu">
                {menu.items.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    role="menuitem"
                    className="nav-x-resources-item"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span className="nav-x-resources-item-label">{r.label}</span>
                    <span className="nav-x-resources-item-desc">{r.description}</span>
                  </Link>
                ))}
              </div>
            )}
            </div>
          ))}
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
          {user ? (
            <div className="nav-x-profile" ref={profileRef}>
              <button
                type="button"
                className={`nav-x-profile-btn hidden sm:inline-flex ${profileOpen ? "is-open" : ""}`}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label="Perfil"
                onClick={() => setProfileOpen((o) => !o)}
              >
                {initial}
              </button>
              {profileOpen && (
                <div className="nav-x-profile-menu" role="menu">
                  <p className="nav-x-profile-meta">
                    {(user.user_metadata?.full_name as string | undefined)
                      ?? user.email
                      ?? "Tu perfil"}
                  </p>
                  <Link
                    href="/perfil"
                    role="menuitem"
                    className="nav-x-profile-item"
                    onClick={() => setProfileOpen(false)}
                  >
                    Mi perfil
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="nav-x-profile-item nav-x-profile-item--danger"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="nav-x-ingresar hidden sm:inline-flex">
              Ingresar
            </Link>
          )}
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
          {MENUS.map((menu) => (
            <div className="nav-x-mobile-section" key={menu.label}>
              <span className="nav-x-mobile-section-title">{menu.label}</span>
              {menu.items.map((r) => (
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
          ))}
          {user ? (
            <>
              <Link
                href="/perfil"
                onClick={() => setMenuOpen(false)}
                className="nav-x-mobile-link"
              >
                Mi perfil
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="nav-x-mobile-link nav-x-mobile-link--danger"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="nav-x-mobile-link"
            >
              Ingresar
            </Link>
          )}
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
