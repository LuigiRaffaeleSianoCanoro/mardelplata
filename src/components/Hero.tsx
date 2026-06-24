"use client";

// Hero v5 — layout estilo mock: imagen panorámica del lobo + faro + skyline
// + mesh ocean a la derecha, texto a la izquierda. Cards glassmorph
// flotando sobre la imagen (Eventos, Empleos, Aprendizaje, Comunidad,
// Marea de talento). Avatar stack + scroll cue al pie.

import Image from "next/image";
import Link from "next/link";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/community";

export interface HeroProps {
  nextEvent: { id: string; title: string; date: string } | null;
  membersCount: number;
  jobsCount: number;
}

function formatNextEventText(ev: HeroProps["nextEvent"]) {
  if (!ev) return "Próximo meetup\nen agenda pronto";
  const d = new Date(ev.date);
  const day = d.getDate();
  const month = d.toLocaleDateString("es-AR", { month: "long" });
  return `Próximo meetup\n${day} de ${month}`;
}

function formatJobsText(n: number) {
  if (n === 0) return "Sumate o publicá\nuna búsqueda";
  if (n === 1) return "1 oportunidad\nactiva";
  return `+${n} oportunidades\nactivas`;
}

function formatMembersText(n: number) {
  if (n === 0) return "Comunidad\nen formación";
  return `+${n} miembros\nactivos`;
}

export default function Hero({ nextEvent, membersCount, jobsCount }: HeroProps) {
  return (
    <section className="hero-x" id="inicio">
      {/* Imagen wide cinematic — panorama lobo + faro + skyline */}
      <div className="hero-x-bg">
        <Image
          src="/hero-wide.webp"
          alt="Mar del Plata al atardecer con lobo programador"
          fill
          priority
          quality={65}
          sizes="100vw"
          className="hero-x-bg-img"
        />
        <div className="hero-x-bg-overlay" />
        <div className="hero-x-bg-fade" />
      </div>

      <div className="hero-x-inner">
        {/* Texto izquierda */}
        <div className="hero-x-text">
          <p className="hero-x-eyebrow">
            <span className="hero-x-eyebrow-dot" />
            COMUNIDAD IT · MAR DEL PLATA
          </p>

          <h1 className="hero-x-title">
            Donde el <em>talento</em> de
            <br />
            Mar del Plata se <em>encuentra.</em>
          </h1>

          <p className="hero-x-sub">
            Aprendemos, creamos y construimos juntos el futuro tecnológico
            de Mar del Plata y la costa atlántica.
          </p>

          <div className="hero-x-ctas">
            <TrackedOutboundLink
              href={WHATSAPP_COMMUNITY_URL}
              trackSource="hero_cta"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-x-cta-primary"
            >
              Sumate a la comunidad
              <span aria-hidden>→</span>
            </TrackedOutboundLink>
            <Link href="#manifiesto" className="hero-x-cta-ghost">
              Conocé más
            </Link>
          </div>

        </div>

        {/* Floating cards sobre la imagen */}
        <FloatingCard
          className="hero-x-card hero-x-card--events"
          icon={<CalendarIcon />}
          label="Eventos"
          text={formatNextEventText(nextEvent)}
          glowColor="violet"
        />
        <FloatingCard
          className="hero-x-card hero-x-card--jobs"
          icon={<BriefcaseIcon />}
          label="Empleos"
          text={formatJobsText(jobsCount)}
          glowColor="cyan"
        />
        <FloatingCard
          className="hero-x-card hero-x-card--learning"
          icon={<BookIcon />}
          label="Aprendizaje"
          text={"Cursos, talleres\ny recursos"}
          glowColor="violet"
        />
        <FloatingCard
          className="hero-x-card hero-x-card--community"
          icon={<PeopleIcon />}
          label="Comunidad"
          text={formatMembersText(membersCount)}
          glowColor="cyan"
        />

        {/* Card especial — chart "Marea de talento" */}
        <div className="hero-x-card hero-x-card--chart">
          <div className="hero-x-card-chart-head">
            <span className="hero-x-card-label">Marea de talento</span>
            <span className="hero-x-card-arrow">→</span>
          </div>
          <MiniWaveChart />
          <p className="hero-x-card-text" style={{ fontSize: 11 }}>
            En crecimiento
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-x-scroll" aria-hidden>
        <span>SCROLL PARA EXPLORAR</span>
        <span className="hero-x-scroll-line" />
      </div>
    </section>
  );
}

/* ─── Floating card ─── */

function FloatingCard({
  className,
  icon,
  label,
  text,
  glowColor,
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  text: string;
  glowColor?: "violet" | "cyan";
}) {
  return (
    <div className={className} data-glow={glowColor}>
      <span className="hero-x-card-icon">{icon}</span>
      <div className="hero-x-card-body">
        <span className="hero-x-card-label">{label}</span>
        <p className="hero-x-card-text">
          {text.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 ? <br /> : null}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ─── Iconos inline (basados en el icon-pack de referencia) ─── */

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="8" cy="14" r="0.7" fill="currentColor" />
      <circle cx="12" cy="14" r="0.7" fill="currentColor" />
      <circle cx="16" cy="14" r="0.7" fill="currentColor" />
      <circle cx="8" cy="17.5" r="0.7" fill="currentColor" />
      <circle cx="12" cy="17.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12h18" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
      <path d="M11 4v16M7 9h2M7 12h2M15 9h2M15 12h2" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.4" />
      <path d="M15.5 13.6c2.5.4 4.5 2.6 4.5 5.4" />
    </svg>
  );
}

/* ─── Mini wave chart para la card "Marea de talento" ─── */

function MiniWaveChart() {
  // Curva sinusoidal con tendencia al alza
  const points = [
    [0, 22],
    [12, 18],
    [24, 24],
    [36, 16],
    [48, 22],
    [60, 14],
    [72, 18],
    [84, 10],
    [96, 14],
    [108, 6],
    [120, 8],
  ];
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ");
  const area = `${path} L 120 32 L 0 32 Z`;

  return (
    <svg
      width="120"
      height="32"
      viewBox="0 0 120 32"
      className="hero-x-card-chart"
    >
      <defs>
        <linearGradient id="chart-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
          <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#chart-fill)" />
      <path
        d={path}
        fill="none"
        stroke="url(#chart-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
