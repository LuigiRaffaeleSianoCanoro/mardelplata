const events = [
  {
    date: "12 de Abril",
    time: "19:00 hs · Presencial",
    venue: "Club de Pesca · MdP",
    title: "DevMeetup MdP #1",
    desc: "Primer meetup presencial del año. Charlas relámpago, networking y cerveza con vista al mar. Traé tus proyectos y conocé a la comunidad.",
    href: "#",
  },
  {
    date: "3 y 4 de Mayo",
    time: "09:00 hs · 48 horas",
    venue: "UTN Mar del Plata · IRL + Virtual",
    title: "Hackathon Costa Atlántica",
    desc: "48 horas construyendo soluciones para los desafíos de nuestra ciudad. IA, turismo inteligente y sostenibilidad costera son los ejes temáticos.",
    href: "#",
  },
  {
    date: "14 de Junio",
    time: "10:00 hs · Presencial",
    venue: "UNMDP · Facultad de Ciencias Exactas",
    title: "Workshop de IA para Devs",
    desc: "Taller práctico sobre integración de LLMs en aplicaciones reales. Cupos limitados. Traé tu laptop y ganas de aprender.",
    href: "#",
  },
];

function LocationPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Events() {
  return (
    <section id="eventos" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-ocean-50 text-ocean-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              📅 Próximos Eventos
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-ocean-900">
              Lo que se viene<br />
              <span className="gradient-text">en La Feliz</span>
            </h2>
          </div>
          <a
            href="#"
            className="flex-shrink-0 inline-flex items-center gap-2 border border-ocean-500 text-ocean-600 hover:bg-ocean-50 px-5 py-3 rounded-full font-semibold text-sm transition-all"
          >
            Ver calendario completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.title}
              className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="event-header p-5 text-white">
                <div className="flex items-center gap-2 text-ocean-200 text-xs font-semibold uppercase tracking-wide mb-2">
                  <LocationPin />
                  {ev.venue}
                </div>
                <p className="font-display font-bold text-2xl leading-tight">{ev.date}</p>
                <p className="text-ocean-200 text-sm mt-0.5">{ev.time}</p>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-slate-800 mb-3">{ev.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{ev.desc}</p>
                <a
                  href={ev.href}
                  className="inline-flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-ocean-600/30"
                >
                  Registrarme →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
