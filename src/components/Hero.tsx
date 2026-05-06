import Link from "next/link";

// Hero v2: imagen ciudad-mar-atardecer como bg + tres palabras gigantes
// titilando ("aprende / conecta / crea") como pulso de la comunidad. Sin sun
// animation ni LowPolyWave layers — más liviano y limpio.

export default function Hero() {
  return (
    <section
      id="inicio"
      className="hero-section relative overflow-hidden min-h-screen flex flex-col justify-center pt-28 pb-32"
    >
      {/* Imagen de fondo: ciudad-faro-mar al atardecer. Va detrás de todo.
          Sin overlay aquí — el oscurecimiento lo aporta .hero-section::after. */}
      <div
        className="hero-bg absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/hero-bg.png')",
        }}
      />

      {/* Annotation labels — estilo "sci-fi infographic" sobre la zona derecha
          del hero (donde está la imagen). Cada uno: leader line + título +
          descripción, con efecto breathe out-of-sync. */}
      <div className="hero-annots absolute inset-0 z-[3] pointer-events-none select-none">
        <div className="hero-annot hero-annot-1">
          <span className="hero-annot-line" />
          <span className="hero-annot-title">aprende</span>
          <span className="hero-annot-desc">talleres, charlas<br />y workshops</span>
        </div>
        <div className="hero-annot hero-annot-2">
          <span className="hero-annot-line" />
          <span className="hero-annot-title">conecta</span>
          <span className="hero-annot-desc">personas, ideas<br />y proyectos</span>
        </div>
        <div className="hero-annot hero-annot-3">
          <span className="hero-annot-line" />
          <span className="hero-annot-title">crea</span>
          <span className="hero-annot-desc">construimos el futuro<br />desde la comunidad</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 w-full">
        {/* Coord strip */}
        <p className="reveal-up coord-line mb-5 text-white/55" style={{ animationDelay: "1500ms" }}>
          BEARING 270° <span className="sep">·</span>
          <span className="num">38°00&apos;S 057°33&apos;W</span> <span className="sep">·</span>
          ATLÁNTICO SUR
        </p>

        {/* Eyebrow */}
        <div
          className="reveal-up mb-12 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "1580ms" }}
        >
          <span className="kicker text-white/70 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02]">
            <span className="dot-amber" />
            comunidad tech · mar del plata
          </span>
          <a
            href="#eventos"
            className="kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-[rgba(170,130,255,0.45)] hover:bg-white/[0.04] transition-colors text-white/65"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[rgba(170,130,255,0.85)] opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[rgba(170,130,255,0.95)]" />
            </span>
            próximo evento
            <span className="text-white/85">ver agenda</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Heading — ahora full-width sin párrafo descriptivo redundante */}
        <h1
          className="display-thin text-white text-[clamp(2.6rem,9vw,8rem)] leading-[1.0] reveal-up max-w-5xl"
          style={{ animationDelay: "1680ms" }}
        >
          El club tech
          <br />
          <span className="text-white/45">de la costa</span>{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgba(140,195,240,1)] via-[rgba(170,130,255,1)] to-[rgba(230,130,220,1)]">
            atlántica.
          </span>
        </h1>

        {/* CTAs */}
        <div
          className="mt-14 flex flex-wrap gap-3 reveal-up"
          style={{ animationDelay: "1960ms" }}
        >
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-app-primary"
          >
            Unirse a la comunidad
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <Link href="/primer-trabajo" className="btn-app-ghost">
            Primer Trabajo OS
          </Link>
          <Link href="/bolsa" className="btn-app-ghost">
            Bolsa de trabajo
          </Link>
        </div>
      </div>
    </section>
  );
}
