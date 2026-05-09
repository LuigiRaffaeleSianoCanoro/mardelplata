import Link from "next/link";

// ── Motion — animation-heavy variant ──────────────────────────────────────
//
// Strong scroll-driven motion, multi-direction marquees, letter-by-letter
// title reveal, parallax wave layers, 3D tilt cards, hue-shifting accents.
// Intentionally maximalist — the opposite of the mono variant.

const HERO_TITLE_LINES = ["EL CLUB", "TECH DE", "LA COSTA."];

function splitToLetters(text: string, baseDelay = 0) {
  return text.split("").map((char, i) => ({
    char: char === " " ? " " : char,
    delay: baseDelay + i * 50,
  }));
}

export default function MotionHomePreview() {
  return (
    <>
      <MotionNav />
      <MotionMarqueeStrip
        text="● JOIN THE WAVE  ·  MAR DEL PLATA  ·  COSTA ATLÁNTICA  ·  ● BUILT BY THE COMMUNITY"
        direction="ltr"
      />
      <MotionHero />
      <MotionFeatures />
      <MotionMarqueeStrip
        text="MEETUPS  /  HACKATHONS  /  WORKSHOPS  /  COFFEE  /  CRYPTO  /  AI  /  DEV  /  DESIGN"
        direction="rtl"
        size="big"
      />
      <MotionTeam />
      <MotionCTA />
      <MotionFooter />
    </>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────
function MotionNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 pt-4">
      <nav className="mx-auto max-w-5xl flex items-center justify-between gap-2 px-3 py-2 rounded-full glass-pill">
        <Link href="/" className="flex items-center gap-2.5 pl-1">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-ocean-300 to-ocean-700 shadow-md hue-shift" />
          <span className="font-display font-bold text-white text-[0.95rem] tracking-tight">
            mardelplata<span className="text-ocean-300">.dev</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 text-sm">
          {[
            ["Inicio", "#"],
            ["Bolsa", "/bolsa"],
            ["Primer Trabajo", "/primer-trabajo"],
            ["Reglamento", "/reglamento"],
          ].map(([l, h]) => (
            <li key={l}>
              <a
                href={h}
                className="px-3.5 py-1.5 rounded-full text-ocean-100/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-ocean-400 hover:bg-ocean-300 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
        >
          Unirse →
        </a>
      </nav>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function MotionHero() {
  let globalDelay = 200;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-32 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[520px] h-[520px] rounded-full bg-ocean-400/30 blur-[140px] aurora" />
        <div className="absolute bottom-[15%] right-[10%] w-[480px] h-[480px] rounded-full bg-ocean-300/25 blur-[120px] aurora" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[40%] right-[35%] w-[300px] h-[300px] rounded-full bg-sand-300/15 blur-[120px] aurora hue-shift" style={{ animationDelay: "6s" }} />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        {/* Top status with letter intro */}
        <div className="reveal-up flex items-center justify-center gap-3 mb-12 text-xs font-mono uppercase tracking-[0.3em] text-ocean-200/80">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-ocean-300 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-ocean-300" />
          </span>
          <span>Live · Mar del Plata · Costa Atlántica</span>
        </div>

        {/* Letter-by-letter heading */}
        <h1
          className="font-display font-black text-center text-white text-[clamp(3.5rem,12vw,11rem)]"
          style={{ letterSpacing: "-0.06em", lineHeight: 0.9 }}
        >
          {HERO_TITLE_LINES.map((line, lineIdx) => {
            const letters = splitToLetters(line, globalDelay);
            globalDelay += letters.length * 50 + 200;
            const isMid = lineIdx === 1;
            return (
              <span key={lineIdx} className="block">
                {letters.map((l, i) => (
                  <span
                    key={i}
                    className={`letter-rise ${isMid ? "gradient-text" : ""}`}
                    style={{ animationDelay: `${l.delay}ms` }}
                  >
                    {l.char}
                  </span>
                ))}
              </span>
            );
          })}
        </h1>

        {/* Sub line + CTAs */}
        <div
          className="mt-12 flex flex-col items-center gap-8 reveal-up"
          style={{ animationDelay: "1.6s" }}
        >
          <p className="text-center text-lg md:text-xl text-ocean-100/85 max-w-xl leading-relaxed">
            Devs, diseñadores y founders construyendo en paralelo desde la costa atlántica. Acá nos
            encontramos los que estamos en lo mismo.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary shimmer-overlay"
            >
              Unirse a la ola
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <Link href="/primer-trabajo" className="cta-ghost">
              Primer Trabajo OS
            </Link>
          </div>
        </div>
      </div>

      {/* Heavy multi-layer waves */}
      <div className="absolute inset-x-0 bottom-0 h-[280px] pointer-events-none">
        <WaveStrip className="wave-layer-deep" fill="rgba(2, 0, 48, 0.85)" baseY={170} amp={50} />
        <WaveStrip className="wave-layer-mid" fill="rgba(2, 62, 138, 0.7)" baseY={200} amp={45} />
        <WaveStrip className="wave-layer-fore" fill="rgba(0, 119, 182, 0.85)" baseY={235} amp={35} />
        <WaveStrip className="wave-layer-fore" fill="rgba(0, 180, 216, 0.6)" baseY={260} amp={20} />
      </div>
    </section>
  );
}

function WaveStrip({
  className,
  fill,
  baseY,
  amp,
}: {
  className: string;
  fill: string;
  baseY: number;
  amp: number;
}) {
  return (
    <div className={`absolute inset-x-0 bottom-0 ${className}`} style={{ height: 280 }}>
      <svg
        viewBox="0 0 2880 280"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "200%", height: 280 }}
      >
        <path
          d={`M0,${baseY} C240,${baseY - amp} 600,${baseY + amp} 1080,${baseY} C1560,${baseY - amp} 1920,${baseY + amp} 2400,${baseY} C2640,${baseY - amp / 2} 2880,${baseY + amp / 2} 2880,${baseY} L2880,280 L0,280 Z`}
          fill={fill}
        />
      </svg>
    </div>
  );
}

// ── Marquee strip ─────────────────────────────────────────────────────────
function MotionMarqueeStrip({
  text,
  direction,
  size = "small",
}: {
  text: string;
  direction: "ltr" | "rtl";
  size?: "small" | "big";
}) {
  const className = direction === "ltr" ? "marquee-ltr" : "marquee-rtl";
  const isBig = size === "big";
  const repeated = Array(isBig ? 4 : 6).fill(text).join("    ★    ");

  return (
    <div
      className={`relative overflow-hidden border-y border-white/5 ${
        isBig ? "py-8 bg-ocean-800/40" : "py-4 bg-ocean-900/60"
      }`}
    >
      <div className={`flex ${className} whitespace-nowrap`}>
        <span
          className={`${
            isBig
              ? "font-display font-black text-white/85 text-[clamp(2.2rem,7vw,6rem)]"
              : "font-mono text-xs uppercase tracking-[0.3em] text-ocean-200/70"
          } pr-12`}
          style={isBig ? { letterSpacing: "-0.04em" } : undefined}
        >
          {repeated}
        </span>
        <span
          aria-hidden
          className={`${
            isBig
              ? "font-display font-black text-white/85 text-[clamp(2.2rem,7vw,6rem)]"
              : "font-mono text-xs uppercase tracking-[0.3em] text-ocean-200/70"
          } pr-12`}
          style={isBig ? { letterSpacing: "-0.04em" } : undefined}
        >
          {repeated}
        </span>
      </div>
    </div>
  );
}

// ── Features — tilt cards ─────────────────────────────────────────────────
function MotionFeatures() {
  const cards = [
    {
      kicker: "01",
      title: "Bolsa",
      desc: "Empleo y freelance publicado por la propia comunidad.",
      gradient: "from-ocean-400/25 to-ocean-700/40",
      href: "/bolsa",
    },
    {
      kicker: "02",
      title: "Primer Trabajo OS",
      desc: "Diagnóstico, plan, simulador HR y guía de mercado real.",
      gradient: "from-sand-300/20 to-ocean-500/30",
      href: "/primer-trabajo",
    },
    {
      kicker: "03",
      title: "Eventos",
      desc: "Meetups en La Feliz con check-in QR para miembros.",
      gradient: "from-ocean-300/30 to-ocean-800/40",
      href: "#",
    },
    {
      kicker: "04",
      title: "Network",
      desc: "Conexión directa entre devs, founders y diseño local.",
      gradient: "from-ocean-500/30 to-ocean-900/40",
      href: "/#colaboradores",
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow-dark">Stack</span>
          <h2
            className="display-h2 mt-5 text-white text-[clamp(2.5rem,7vw,5.5rem)]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Todo lo que <span className="gradient-text">construimos.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((c) => (
            <Link
              key={c.kicker}
              href={c.href}
              className="tilt-card relative overflow-hidden bento-card-dark p-8 md:p-10 group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-10">
                  <p className="font-mono text-[0.65rem] tracking-[0.25em] text-white/60">
                    / {c.kicker}
                  </p>
                  <span className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
                <h3
                  className="font-display font-bold text-white text-3xl md:text-4xl mb-3"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {c.title}
                </h3>
                <p className="text-ocean-100/80 text-base leading-relaxed max-w-md">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Team ──────────────────────────────────────────────────────────────────
function MotionTeam() {
  const team = [
    { name: "Luigi Canoro", role: "Co-founder · QA", n: "01" },
    { name: "Franco Petruccelli", role: "Co-founder · QA", n: "02" },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-ocean-400/10 blur-[140px] aurora" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="eyebrow-dark">Team</span>
          <h2
            className="display-h2 mt-5 text-white text-[clamp(2.5rem,7vw,5.5rem)]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Quiénes <span className="gradient-text">somos.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {team.map((t) => (
            <article key={t.n} className="tilt-card bento-card-dark p-8 md:p-10">
              <p className="font-mono text-[0.65rem] tracking-[0.25em] text-ocean-300 mb-8">
                / {t.n} · CO-FOUNDER
              </p>
              <h3
                className="font-display font-bold text-white text-3xl md:text-4xl"
                style={{ letterSpacing: "-0.03em" }}
              >
                {t.name}
              </h3>
              <p className="text-ocean-200/80 text-sm mt-3">{t.role}</p>
              <div className="mt-8 h-px bg-gradient-to-r from-ocean-300/40 via-transparent to-transparent" />
              <p className="mt-6 text-ocean-100/70 text-sm leading-relaxed">
                Construyendo MdPDev desde la costa atlántica. Apasionado por la calidad del software y
                por el ecosistema tech local.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────
function MotionCTA() {
  return (
    <section className="relative overflow-hidden py-32 px-6 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] bg-gradient-to-r from-ocean-400/20 via-sand-300/10 to-ocean-400/20 blur-[120px] hue-shift" />
      </div>
      <div className="relative max-w-4xl mx-auto">
        <h2
          className="font-display font-black text-white text-[clamp(3rem,11vw,9rem)]"
          style={{ letterSpacing: "-0.06em", lineHeight: 0.92 }}
        >
          ¿Te <span className="gradient-text">sumás?</span>
        </h2>
        <p className="text-lg text-ocean-100/80 max-w-xl mx-auto mt-8 leading-relaxed">
          La costa tiene su propia escena tech, y está creciendo rápido. Sumate antes de que se ponga obvio.
        </p>
        <div className="mt-10">
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-primary shimmer-overlay"
          >
            Unirse al grupo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function MotionFooter() {
  return (
    <footer className="relative bg-ocean-900 border-t border-white/5 overflow-hidden">
      <div className="overflow-hidden border-b border-white/5">
        <div className="marquee-ltr marquee-fast flex whitespace-nowrap py-6">
          <span
            className="font-display font-black text-white/90 text-[clamp(3rem,9vw,7rem)] pr-12"
            style={{ letterSpacing: "-0.05em" }}
          >
            mardelplata.dev · mardelplata.dev · mardelplata.dev ·
          </span>
          <span
            aria-hidden
            className="font-display font-black text-white/90 text-[clamp(3rem,9vw,7rem)] pr-12"
            style={{ letterSpacing: "-0.05em" }}
          >
            mardelplata.dev · mardelplata.dev · mardelplata.dev ·
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-ocean-300/60">
        <p>© 2026 MdPDev — Todos los derechos reservados.</p>
        <div className="flex items-center gap-5">
          <a href="https://x.com/Mardeldev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
          <a href="https://www.instagram.com/mardelplata.dev.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
        <p className="font-mono">v0.1.0 — preview/motion</p>
      </div>
    </footer>
  );
}
