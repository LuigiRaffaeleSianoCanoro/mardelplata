"use client";

// Hero v4: atmosfera + tipografía. Sin imagen fullscreen — la imagen
// del lobo va al Manifesto como polaroid. Acá: aurora violeta arriba,
// línea de horizonte sapphire al medio, malla low-poly debajo.
// Tagline serif italic con respiración. HUD overlay completo.

import Link from "next/link";
import { useEffect, useState } from "react";
import SectionWaveMesh from "./SectionWaveMesh";

export default function Hero() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="inicio"
      className="hero-v4 relative min-h-screen overflow-hidden"
    >
      {/* Capa 1 — gradient atmosférico (aurora violet arriba, deep navy abajo) */}
      <div className="hero-v4-bg-atmosphere absolute inset-0 z-0" />

      {/* Capa 2 — orbes sapphire/violet drifteando */}
      <div className="hero-v4-orbs absolute inset-0 z-0 pointer-events-none">
        <span className="hero-v4-orb hero-v4-orb--1" />
        <span className="hero-v4-orb hero-v4-orb--2" />
        <span className="hero-v4-orb hero-v4-orb--3" />
      </div>

      {/* Capa 3 — sun/moon disc apenas visible al horizonte (sunset hint) */}
      <div className="hero-v4-sun absolute z-0 pointer-events-none" />

      {/* Capa 4 — línea de horizonte sapphire */}
      <div className="hero-v4-horizon absolute z-[1] pointer-events-none" />

      {/* Capa 5 — wave mesh low-poly llenando la mitad inferior */}
      <div className="hero-v4-mesh-wrapper absolute z-[1] pointer-events-none">
        <SectionWaveMesh
          variant="horizon"
          id="hero-v4-mesh"
          opacity={0.5}
        />
      </div>

      {/* HUD overlay: corners + bearing scale */}
      <div className="hero-v4-hud absolute inset-0 z-10 pointer-events-none">
        <div className="hud-corner hud-corner--tl" />
        <div className="hud-corner hud-corner--tr" />
        <div className="hud-corner hud-corner--bl" />
        <div className="hud-corner hud-corner--br" />

        <div className="hero-v3-bearing">
          <span>270</span>
          <span>280</span>
          <span>290</span>
          <span className="n">N</span>
          <span>010</span>
          <span>020</span>
          <span>030</span>
        </div>
      </div>

      {/* Contenido principal centrado */}
      <div className="hero-v4-content relative z-20 max-w-6xl mx-auto px-6 py-32 min-h-screen flex flex-col items-start justify-center">
        <p className="hero-v3-eyebrow hud-label">
          <span className="hud-status-dot" />
          MARDELPLATA.DEV <span className="hud-label--dim">·</span>{" "}
          <span className="hud-ok">LIVE NODE</span>
        </p>

        <h1 className="hero-v3-tagline">
          <span className="hero-word hero-word--1">aprende</span>
          <span className="hero-dot">·</span>
          <span className="hero-word hero-word--2">conecta</span>
          <span className="hero-dot">·</span>
          <span className="hero-word hero-word--3">crea</span>
        </h1>

        <p className="hero-v3-tagline-sub">
          La comunidad tech de la costa atlántica. Talleres, charlas,
          open source y proyectos donde aprendemos construyendo —
          desde Mar del Plata para todo el sur.
        </p>

        <div className="hero-v3-ctas">
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-v3-cta-primary"
          >
            <span className="hud-status-dot" />
            UNIRME A LA COMUNIDAD
            <span className="hero-cta-arrow">→</span>
          </a>
          <Link href="/red" className="hero-v3-cta-ghost">
            EXPLORAR LA RED
          </Link>
          <Link href="/bolsa" className="hero-v3-cta-ghost">
            BOLSA DE TRABAJO
          </Link>
        </div>
      </div>

      {/* Footer HUD */}
      <div className="hero-v3-footer-hud absolute inset-x-0 bottom-8 z-10 px-10 flex justify-between items-center pointer-events-none flex-wrap gap-3">
        <div className="hud-label">
          <span className="hud-label--dim">POSITION </span>
          38°00&apos;18.4&quot;S{" "}
          <span className="hud-label--dim">·</span> 057°33&apos;09.7&quot;W{" "}
          <span className="hud-label--dim">·</span> ATLÁNTICO SUR
        </div>
        <div className="hud-label">
          <span className="hud-label--dim">UTC </span>
          <span className="hud-accent">
            {now ? now.toISOString().slice(11, 19) : "00:00:00"}
          </span>
        </div>
      </div>
    </section>
  );
}
