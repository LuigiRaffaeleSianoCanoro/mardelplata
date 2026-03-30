"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const close = () => setMenuOpen(false);

  const prefix = isHome ? "" : "/";
  const navLinks = [
    { href: `${prefix}#inicio`,        label: "Inicio" },
    { href: `${prefix}#colaboradores`, label: "Colaboradores" },
    { href: `${prefix}#staff`,         label: "Staff" },
    { href: `${prefix}#comunidad`,     label: "Comunidad" },
    { href: `${prefix}#eventos`,       label: "Eventos" },
    { href: "/reglamento",             label: "Reglamento" },
    { href: "/bolsa",                  label: "Bolsa" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        scrolled
          ? "bg-ocean-800/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href={`${prefix}#inicio`} className="flex items-center gap-2.5 group">
          <Image
            src="/mdpdev.png"
            alt="MdPDev logo"
            width={40}
            height={40}
            className="rounded-2xl shadow-lg shadow-ocean-700/40 group-hover:scale-105 transition-transform"
          />
          <span className="font-display font-bold text-xl text-white tracking-tight">MdPDev</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-ocean-200 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/perfil"
              className="hidden md:inline-flex items-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-ocean-400/40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
              Mi Perfil
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:inline-flex items-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-ocean-400/40"
            >
              Ingresar
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-ocean-800/50 transition-colors"
            aria-label="Abrir menú"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 mx-2 bg-ocean-900/97 backdrop-blur-xl rounded-2xl p-4 border border-ocean-700/40 shadow-2xl">
          <div className="flex flex-col gap-1 text-sm">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="text-ocean-200 hover:text-white hover:bg-ocean-800/60 px-4 py-2.5 rounded-xl transition-all"
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <Link
                href="/perfil"
                onClick={close}
                className="mt-2 flex items-center justify-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-5 py-3 rounded-xl font-semibold transition-all"
              >
                Mi Perfil
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={close}
                className="mt-2 flex items-center justify-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-5 py-3 rounded-xl font-semibold transition-all"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
