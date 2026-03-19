const confirmedEvents = [
  {
    badge: "Sáb 21 · Mar 2026",
    title: "ALEPH HACKATHON",
    subtitle: "Mar del Plata",
    date: "Sábado 21 de Marzo · 09:00 – 17:30",
    location: "Bar Fauno · Olavarría 3232",
    tags: ["AI", "Crypto", "Biotech", "1 día", "Gratis"],
    description:
      "Construí algo real en un solo día. Equipos de hasta 4 personas compiten en tracks de IA, cripto y biotecnología con un prize pool de $10.000 USD. Abierto a developers, diseñadores, PMs y builders de todos los niveles.",
    ctas: [
      {
        label: "Registrarme en Luma →",
        href: "https://lu.ma/78n9t2fp",
        primary: true,
      },
      {
        label: "Ver guía completa",
        href: "https://aleph-hackathon-mardelplata.vercel.app/",
        primary: false,
      },
    ],
  },
];

const mysteryEvents = [
  {
    codename: "COFFEE CRYPTO RAVE",
    teaser: "Café, cripto y algo que todavía no podemos revelar. Algo se está cocinando en La Feliz.",
  },
  {
    codename: "MDP DEV DAY",
    teaser: "Un día entero para la comunidad tech de Mar del Plata. Fecha, lugar y agenda: pronto.",
  },
];

export default function Events() {
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

        <div className="flex flex-col gap-6">
          {/* Confirmed events */}
          {confirmedEvents.map((event) => (
            <div
              key={event.title}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="event-header-hackathon p-6 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-ocean-300 pulse-dot inline-block" />
                    {event.badge}
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold">
                    📍 {event.location}
                  </div>
                </div>
                <h3 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-none">
                  {event.title}
                </h3>
                <p className="text-ocean-200 text-lg font-medium mt-1">{event.subtitle}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.tags.map((tag) => (
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
                  {event.date}
                </div>
                <p className="text-slate-500 text-base leading-relaxed mb-6">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {event.ctas.map((cta) => (
                    <a
                      key={cta.label}
                      href={cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        cta.primary
                          ? "inline-flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-ocean-600/30"
                          : "inline-flex items-center gap-2 border border-ocean-200 text-ocean-700 hover:border-ocean-400 px-6 py-3 rounded-full text-sm font-semibold transition-all"
                      }
                    >
                      {cta.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Mystery events */}
          {mysteryEvents.map((event) => (
            <div
              key={event.codename}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="event-header-mystery p-6 text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                  Próximamente
                </div>
                <h3 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-none text-white/90">
                  {event.codename}
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
                <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto mb-6">
                  {event.teaser}
                </p>
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
      </div>
    </section>
  );
}
