"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  const navLinks = [
    { href: "#inicio",        label: "Inicio" },
    { href: "#colaboradores", label: "Colaboradores" },
    { href: "#staff",         label: "Staff" },
    { href: "#comunidad",     label: "Comunidad" },
    { href: "#eventos",       label: "Eventos" },
    { href: "#reglamento",    label: "Reglamento" },
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
        <a href="#inicio" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-ocean-300 to-ocean-700 flex items-center justify-center shadow-lg shadow-ocean-700/40 group-hover:scale-105 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v9" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M9.5 5.5L12 3l2.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17c2.5-3.5 5-3.5 7.5 0s5 3.5 7.5 0 4-3 7 0" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
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
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-ocean-400/40"
          >
            Iniciar sesión
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
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
            <a
              href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-5 py-3 rounded-xl font-semibold transition-all"
            >
              Iniciar sesión →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
