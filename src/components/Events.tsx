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
    year: "numeric",
  });
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }) + " · " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export default function Events({ events }: EventsProps) {
  const confirmed = events.filter((e) => !e.is_mystery);
  const mystery = events.filter((e) => e.is_mystery);

  return (
    <section id="eventos" className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-ocean-50 text-ocean-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            📅 Próximos Eventos
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ocean-900">
            Lo que se viene<br />
            <span className="gradient-text">en La Feliz</span>
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg">No hay eventos publicados por el momento.</p>
            <p className="text-sm mt-2">Seguinos en redes para enterarte cuando se anuncie el próximo.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Confirmed events */}
            {confirmed.map((event) => {
              const past = isPast(event.date);
              return (
                <div
                  key={event.id}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
                >
                  <div className="event-header-hackathon p-6 text-white">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {past ? (
                        <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                          ✓ Finalizado
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-ocean-300 pulse-dot inline-block" />
                          {formatBadge(event.date)}
                        </div>
                      )}
                      {event.location && (
                        <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold">
                          📍 {event.location}
                        </div>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-none">
                      {event.title}
                    </h3>
                    {event.subtitle && (
                      <p className="text-ocean-200 text-lg font-medium mt-1">{event.subtitle}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {past && (
                        <span className="bg-white/15 border border-white/20 rounded-full px-3 py-0.5 text-xs font-semibold">
                          Finalizado
                        </span>
                      )}
                      {event.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/15 border border-white/20 rounded-full px-3 py-0.5 text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-ocean-600 text-sm font-semibold mb-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatFullDate(event.date)}
                    </div>
                    {event.description && (
                      <p className="text-slate-500 text-base leading-relaxed mb-6">
                        {event.description}
                      </p>
                    )}
                    {event.registration_url && !past && (
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-ocean-600/30"
                        >
                          Registrarme →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Mystery events */}
            {mystery.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="event-header-mystery p-6 text-white">
                  <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                    Próximamente
                  </div>
                  <h3 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-none text-white/90">
                    {event.codename ?? event.title}
                  </h3>
                  <div className="flex gap-2 mt-4">
                    <span className="bg-white/10 border border-white/10 rounded-full px-10 py-0.5 text-xs mystery-blur text-slate-300">
                      ████████
                    </span>
                    <span className="bg-white/10 border border-white/10 rounded-full px-8 py-0.5 text-xs mystery-blur text-slate-300">
                      ██████
                    </span>
                  </div>
                </div>
                <div className="p-8 text-center">
                  {event.teaser && (
                    <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto mb-6">
                      {event.teaser}
                    </p>
                  )}
                  <a
                    href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-slate-200 text-slate-500 hover:border-ocean-300 hover:text-ocean-600 px-6 py-3 rounded-full text-sm font-semibold transition-all"
                  >
                    Avisarme cuando se anuncie →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
