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
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  const close = () => setMenuOpen(false);
  const prefix = isHome ? "" : "/";
  const links = [
    { href: `${prefix}#inicio`, label: "Inicio" },
    { href: "/bolsa", label: "Bolsa" },
    { href: "/primer-trabajo", label: "Primer Trabajo OS" },
    { href: "/reglamento", label: "Reglamento" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
      <nav
        className={`mx-auto max-w-5xl flex items-center justify-between gap-2 px-3 py-2 rounded-full transition-all duration-500 ${
          scrolled || !isHome ? "glass-pill" : "bg-transparent border border-transparent"
        }`}
      >
        {/* Logo */}
        <Link href={`${prefix}#inicio`} className="flex items-center gap-2.5 pl-1 group">
          <span className="metal-chip w-8 h-8 rounded-xl group-hover:scale-105 transition-transform">
            <Image src="/mdpdev.png" alt="MdPDev" width={20} height={20} className="opacity-90" priority />
          </span>
          <span className="font-display text-white text-[1rem] font-medium hidden sm:inline">
            mardelplata<span className="text-[#3B82F6]">.dev</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-0.5 text-[0.875rem]">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3.5 py-1.5 rounded-full text-white/75 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/perfil" className="btn-app-primary hidden sm:inline-flex !text-[0.78rem] !py-1.5 !px-4">
              Mi perfil
            </Link>
          ) : (
            <Link href="/auth/login" className="btn-app-ghost hidden sm:inline-flex !text-[0.78rem] !py-1.5 !px-4">
              Ingresar
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-white/85 p-2 rounded-full hover:bg-white/[0.06] transition-colors"
            aria-label="Abrir menú"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mx-auto max-w-5xl mt-2 glass-pill rounded-3xl p-3">
          <ul className="flex flex-col text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={close}
                  className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors font-light"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2 pt-2 border-t border-white/[0.06]">
              {user ? (
                <Link href="/perfil" onClick={close} className="btn-app-primary w-full">
                  Mi perfil
                </Link>
              ) : (
                <Link href="/auth/login" onClick={close} className="btn-app-primary w-full">
                  Ingresar
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
