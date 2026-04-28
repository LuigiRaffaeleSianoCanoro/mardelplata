import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="hero-bg relative overflow-hidden min-h-screen flex flex-col justify-center pt-28 pb-32"
    >
      {/* Aurora glow + grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[680px] h-[680px] rounded-full bg-ocean-400/15 blur-[140px] aurora parallax-deep-back" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] rounded-full bg-ocean-300/10 blur-[120px] parallax-back" />
        {/* Faint horizon line */}
        <div className="absolute left-0 right-0 top-[68%] h-px bg-gradient-to-r from-transparent via-ocean-300/40 to-transparent parallax-mid" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 w-full">
        {/* Eyebrow row — primary status + live agenda chip together */}
        <div className="reveal-up mb-10 flex flex-wrap items-center gap-3">
          <span className="eyebrow-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-ocean-300 pulse-dot" />
            Comunidad tech · Mar del Plata
          </span>
          <a
            href="#eventos"
            className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-ocean-300/25 bg-ocean-900/40 backdrop-blur-sm hover:border-ocean-300/60 transition-colors text-xs"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-ocean-300 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-ocean-300" />
            </span>
            <span className="text-ocean-200/80">Próximo evento</span>
            <span className="text-white font-medium">Ver agenda</span>
            <svg
              className="text-ocean-300 group-hover:translate-x-0.5 transition-transform"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Editorial heading */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-end">
          <div className="col-span-12 lg:col-span-9">
            <h1
              className="display-h1 text-white text-[clamp(2.6rem,9vw,8rem)] reveal-up"
              style={{ animationDelay: "120ms" }}
            >
              El club tech
              <br />
              <span className="gradient-text">de la costa</span>{" "}
              <span className="outline-text">atlántica.</span>
            </h1>
          </div>

          <div
            className="col-span-12 lg:col-span-3 reveal-up"
            style={{ animationDelay: "240ms" }}
          >
            <p className="text-ocean-200/90 text-base sm:text-lg leading-relaxed max-w-md lg:max-w-none">
              Conectamos developers, diseñadores y emprendedores que ya están construyendo el ecosistema
              digital de Mar del Plata.
            </p>
          </div>
        </div>

        {/* CTAs — single cohesive row aligned with the editorial column */}
        <div
          className="mt-12 flex flex-wrap gap-3 reveal-up"
          style={{ animationDelay: "360ms" }}
        >
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary shimmer-overlay"
          >
            Unirse a la comunidad
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <Link href="/primer-trabajo" className="cta-ghost">
            Primer Trabajo OS
          </Link>
          <Link href="/bolsa" className="cta-ghost">
            Bolsa de trabajo
          </Link>
        </div>

        {/* Bottom stats / pillars */}
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 reveal-up"
          style={{ animationDelay: "520ms" }}
        >
          {[
            { kicker: "01", label: "Empleos", desc: "Ofertas y freelance local" },
            { kicker: "02", label: "Eventos", desc: "Meetups en La Feliz" },
            { kicker: "03", label: "Recursos", desc: "Cursos y guías curadas" },
            { kicker: "04", label: "Networking", desc: "Devs, founders y diseño" },
          ].map((p) => (
            <div key={p.label} className="border-l border-ocean-300/20 pl-4">
              <p className="font-mono text-[0.65rem] tracking-[0.3em] text-ocean-300/70 mb-2">
                / {p.kicker}
              </p>
              <p className="text-white font-display font-semibold text-lg leading-tight">{p.label}</p>
              <p className="text-ocean-200/60 text-sm mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-layer waves at the bottom — each layer rocks vertically (boat
          metaphor) on top of its horizontal drift, and parallaxes on scroll. */}
      <div className="absolute inset-x-0 bottom-0 h-[180px] pointer-events-none">
        <div className="absolute inset-0 boat-bob-deep-1">
          <WaveStrip className="wave-layer-deep parallax-deep-back" fill="rgba(2, 62, 138, 0.5)" baseY={120} />
        </div>
        <div className="absolute inset-0 boat-bob-deep-2">
          <WaveStrip className="wave-layer-mid parallax-back" fill="rgba(0, 119, 182, 0.65)" baseY={140} />
        </div>
        <div className="absolute inset-0 boat-bob-deep-3">
          <WaveStrip className="wave-layer-fore parallax-mid" fill="white" baseY={160} />
        </div>
      </div>
    </section>
  );
}

function WaveStrip({
  className,
  fill,
  baseY,
}: {
  className: string;
  fill: string;
  baseY: number;
}) {
  return (
    <div className={`absolute inset-x-0 bottom-0 ${className}`} style={{ height: 180 }}>
      <svg
        viewBox="0 0 2880 180"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "200%", height: 180 }}
      >
        <path
          d={`M0,${baseY} C240,${baseY - 30} 600,${baseY + 30} 1080,${baseY} C1560,${baseY - 30} 1920,${baseY + 30} 2400,${baseY} C2640,${baseY - 15} 2880,${baseY + 15} 2880,${baseY} L2880,180 L0,180 Z`}
          fill={fill}
        />
      </svg>
    </div>
  );
}
