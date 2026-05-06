"use client";

// Events — "Lo que se viene en la costa". Layout horizontal con 4 cards
// minimalistas: date strip (DD/MMM big), título, hora + ubicación, tag pill.

import Link from "next/link";

interface Event {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  tags: string[];
  registration_url: string | null;
  is_mystery: boolean;
  codename: string | null;
  teaser: string | null;
  is_published: boolean;
}

interface EventsProps {
  events: Event[];
}

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", { day: "2-digit" });
}
function formatMonth(dateStr: string) {
  return new Date(dateStr)
    .toLocaleDateString("es-AR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTagFlavor(tags: string[]): { label: string; color: "violet" | "cyan" | "amber" | "rose" } {
  const t = (tags?.[0] ?? "meetup").toLowerCase();
  if (t.includes("taller") || t.includes("workshop")) return { label: "TALLER", color: "cyan" };
  if (t.includes("charla") || t.includes("talk")) return { label: "CHARLA", color: "violet" };
  if (t.includes("hackat")) return { label: "HACKATÓN", color: "rose" };
  if (t.includes("meetup")) return { label: "MEETUP", color: "violet" };
  return { label: t.toUpperCase(), color: "amber" };
}

export default function Events({ events }: EventsProps) {
  const now = Date.now();
  const upcoming = [...events]
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <section className="events-x" id="eventos">
      <div className="events-x-inner">
        <header className="events-x-header">
          <h2 className="events-x-title">
            Lo que se viene en la <em>costa.</em>
          </h2>
          <Link href="#" className="events-x-link">
            Ver calendario completo <span aria-hidden>→</span>
          </Link>
        </header>

        <div className="events-x-rail">
          <button className="events-x-nav events-x-nav--left" aria-label="Anterior">
            <ArrowIcon dir="left" />
          </button>

          <div className="events-x-track">
            {upcoming.length === 0 ? (
              <EmptyState />
            ) : (
              upcoming.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>

          <button className="events-x-nav events-x-nav--right" aria-label="Siguiente">
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event }: { event: Event }) {
  const day = formatDay(event.date);
  const month = formatMonth(event.date);
  const time = formatTime(event.date);
  const tag = getTagFlavor(event.tags);
  const isMystery = event.is_mystery;

  const inner = (
    <>
      <div className="event-card-date">
        <span className="event-card-day">{day}</span>
        <span className="event-card-month">{month}</span>
      </div>
      <div className="event-card-body">
        <h3 className="event-card-title">
          {isMystery ? event.codename ?? event.title : event.title}
        </h3>
        <p className="event-card-meta">
          <ClockIcon /> {time}
          {event.location && (
            <>
              <span className="event-card-meta-sep">·</span>
              <PinIcon /> {event.location}
            </>
          )}
        </p>
        <span className="event-card-tag" data-flavor={tag.color}>
          {tag.label}
        </span>
      </div>
    </>
  );

  if (event.registration_url) {
    return (
      <a
        href={event.registration_url}
        target="_blank"
        rel="noopener noreferrer"
        className="event-card"
      >
        {inner}
      </a>
    );
  }
  return <article className="event-card">{inner}</article>;
}

function EmptyState() {
  return (
    <div className="events-x-empty">
      <p className="events-x-empty-eyebrow">// SCHEDULE EN PAUSA</p>
      <h3 className="events-x-empty-title">
        Estamos cocinando el próximo encuentro.
      </h3>
      <p className="events-x-empty-desc">
        Seguinos en redes para enterarte cuando se anuncie.
      </p>
    </div>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
