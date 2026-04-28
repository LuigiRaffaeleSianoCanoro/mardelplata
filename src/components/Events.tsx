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
  return d.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }) +
    " · " +
    d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function Events({ events }: EventsProps) {
  const confirmed = events.filter((e) => !e.is_mystery);
  const mystery = events.filter((e) => e.is_mystery);
  const [featured, ...rest] = confirmed;

  return (
    <section id="eventos" className="relative py-28 px-6 bg-white overflow-hidden">
      {/* Background drift glow */}
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-ocean-100/60 blur-[120px] pointer-events-none boat-drift-soft parallax-rise" />
      <div className="absolute bottom-1/4 -right-32 w-[420px] h-[420px] rounded-full bg-sand-200/60 blur-[120px] pointer-events-none boat-drift-soft parallax-back" style={{ animationDelay: "-7s" }} />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header — editorial */}
        <div className="grid grid-cols-12 gap-6 items-end mb-14">
          <div className="col-span-12 md:col-span-8">
            <span className="eyebrow">
              <span className="w-1.5 h-1.5 rounded-full bg-ocean-500" />
              Próximos eventos
            </span>
            <h2 className="display-h2 mt-5 text-ocean-900 text-[clamp(2.5rem,6vw,5rem)]">
              Lo que se viene <br />
              <span className="gradient-text">en La Feliz.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <p className="text-slate-500 text-base leading-relaxed">
              Meetups, hackathons y encuentros pensados para conectar a quienes ya están construyendo desde
              la costa.
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="bento-card text-center py-20 px-8">
            <p className="text-slate-700 text-xl font-display font-semibold mb-2">
              Estamos cocinando el próximo encuentro.
            </p>
            <p className="text-slate-500">
              Seguinos en redes para enterarte cuando se anuncie.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured event — full bleed */}
            {featured && <FeaturedEvent event={featured} />}

            {/* Rest of events + mystery in bento */}
            {(rest.length > 0 || mystery.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rest.map((event) => (
                  <CompactEvent key={event.id} event={event} />
                ))}
                {mystery.map((event) => (
                  <MysteryCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedEvent({ event }: { event: Event }) {
  const past = isPast(event.date);
  return (
    <article className="relative overflow-hidden rounded-[32px] event-header-hackathon text-white p-10 md:p-14">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="relative grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 md:col-span-8">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              {past ? (
                <>✓ Finalizado</>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-ocean-300 pulse-dot" />
                  {formatBadge(event.date)}
                </>
              )}
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold">
                📍 {event.location}
              </span>
            )}
            {event.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[0.7rem] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="display-h2 text-[clamp(2.2rem,5vw,4rem)]">{event.title}</h3>
          {event.subtitle && (
            <p className="text-ocean-100/90 text-lg mt-3">{event.subtitle}</p>
          )}
          {event.description && (
            <p className="text-ocean-100/70 text-base leading-relaxed mt-6 max-w-2xl">
              {event.description}
            </p>
          )}
        </div>
        <div className="col-span-12 md:col-span-4 md:text-right">
          <div className="inline-flex flex-col items-start md:items-end gap-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ocean-200/70">
              {formatFullDate(event.date)}
            </p>
            {event.registration_url && !past && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-primary"
              >
                Registrarme
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactEvent({ event }: { event: Event }) {
  const past = isPast(event.date);
  return (
    <article className="bento-card p-7">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-50 text-ocean-700 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
          {past ? "✓ Finalizado" : formatBadge(event.date)}
        </span>
        {event.location && (
          <span className="text-xs text-slate-500 truncate">📍 {event.location}</span>
        )}
      </div>
      <h3 className="font-display font-bold text-2xl text-ocean-900 leading-tight">
        {event.title}
      </h3>
      {event.subtitle && (
        <p className="text-slate-500 text-sm mt-2">{event.subtitle}</p>
      )}
      {event.description && (
        <p className="text-slate-600 text-sm leading-relaxed mt-4 line-clamp-3">
          {event.description}
        </p>
      )}
      {event.registration_url && !past && (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-ocean-600 hover:text-ocean-700 text-sm font-semibold"
        >
          Registrarme
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </article>
  );
}

function MysteryCard({ event }: { event: Event }) {
  return (
    <article className="relative overflow-hidden rounded-[28px] event-header-mystery text-white p-7">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-300 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Próximamente
        </span>
        <h3 className="font-display font-bold text-2xl tracking-tight leading-tight text-white/95">
          {event.codename ?? event.title}
        </h3>
        {event.teaser && (
          <p className="text-slate-400 text-sm leading-relaxed mt-4">{event.teaser}</p>
        )}
        <a
          href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-sm font-semibold"
        >
          Avisarme cuando se anuncie
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  );
}
