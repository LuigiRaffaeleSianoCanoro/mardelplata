// Events — vertical depth-ladder timeline. Cada evento es un "ping" en
// la línea, con tick marker, depth marker (-005m, -010m...) y la info
// del evento. Mystery events con borde dashed violeta.

import SectionWaveMesh from "./SectionWaveMesh";

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

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

function formatBadge(dateStr: string) {
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .toUpperCase();
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Events({ events }: EventsProps) {
  const all = [...events];

  return (
    <section className="panel-section" id="eventos">
      <SectionWaveMesh
        variant="horizon"
        id="mesh-grad-events"
        className="section-wave-mesh--horizon"
        opacity={0.14}
      />
      <div className="panel-section-inner">
        <header className="panel-header">
          <div>
            <span className="panel-id">03 / Schedule</span>
            <h2 className="panel-title">
              Lo que se viene{" "}
              <em>en La Feliz</em>.
            </h2>
          </div>
          <p className="panel-aside">
            Meetups, hackathons y encuentros pensados para conectar a
            quienes ya están construyendo desde la costa. Sin aforo
            mínimo — venís y armás.
          </p>
        </header>

        {events.length === 0 ? (
          <EmptySchedule />
        ) : (
          <div className="depth-timeline">
            {all.map((event, i) => (
              <DepthEvent
                key={event.id}
                event={event}
                depth={(i + 1) * 5}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptySchedule() {
  return (
    <div className="depth-timeline">
      <div className="depth-event">
        <span
          className="depth-event-depth"
          style={{ color: "var(--c-text-mute)" }}
        >
          −005m
        </span>
        <p className="depth-event-meta">
          <span className="depth-event-status-dot" />
          // EMPTY SCHEDULE · COCINANDO
        </p>
        <h3 className="depth-event-title">
          Estamos cocinando el próximo encuentro.
        </h3>
        <p className="depth-event-desc">
          Seguinos en redes para enterarte cuando se anuncie. Si tenés
          ganas de organizar algo, escribinos al WhatsApp.
        </p>
      </div>
    </div>
  );
}

function DepthEvent({ event, depth }: { event: Event; depth: number }) {
  const past = isPast(event.date);
  const depthLabel = `−${String(depth).padStart(3, "0")}m`;

  if (event.is_mystery) {
    return (
      <article className="depth-event">
        <span className="depth-event-depth">{depthLabel}</span>
        <div className="depth-event-classified">
          <p className="depth-event-meta">
            <span className="depth-event-status-dot" />
            // CLASSIFIED · COMING SOON
          </p>
          <h3 className="depth-event-title">
            {event.codename ?? event.title}
          </h3>
          {event.teaser && <p className="depth-event-desc">{event.teaser}</p>}
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-log-cta"
            style={{ marginTop: "1.2em", display: "inline-flex" }}
          >
            Avisarme
            <span className="terminal-log-cta-arrow">→</span>
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="depth-event">
      <span className="depth-event-depth">{depthLabel}</span>
      <p className="depth-event-meta">
        {past ? (
          <>
            <span
              className="depth-event-status-dot"
              style={{ background: "var(--c-text-mute)", boxShadow: "none" }}
            />
            // FINALIZADO
          </>
        ) : (
          <>
            <span className="depth-event-status-dot" />
            {formatBadge(event.date)} · {formatTime(event.date)}
          </>
        )}
      </p>
      <h3 className="depth-event-title">{event.title}</h3>
      {event.subtitle && (
        <p className="depth-event-subtitle">{event.subtitle}</p>
      )}
      {event.description && (
        <p className="depth-event-desc">{event.description}</p>
      )}
      <div className="depth-event-footer">
        {event.location && (
          <span className="depth-event-footer-item">
            <span style={{ color: "var(--c-sky)" }}>◉</span> {event.location}
          </span>
        )}
        {event.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="depth-event-footer-item">
            #{tag}
          </span>
        ))}
        {event.registration_url && !past && (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-log-cta"
            style={{ marginLeft: "auto" }}
          >
            Registrarme
            <span className="terminal-log-cta-arrow">→</span>
          </a>
        )}
      </div>
    </article>
  );
}
