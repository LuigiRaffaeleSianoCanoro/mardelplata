export default function Hero() {
  return (
    <section id="inicio" className="hero-bg relative overflow-hidden min-h-screen flex flex-col justify-center pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dots-bg" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-ocean-400/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ocean-300/10 rounded-full blur-[100px]" />
        {/* Lighthouse silhouette */}
        <svg
          className="absolute right-0 bottom-0 h-full opacity-[0.06] hidden lg:block"
          viewBox="0 0 200 600"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="85,120 115,120 125,480 75,480" />
          <rect x="73" y="475" width="54" height="14" rx="3" />
          <rect x="73" y="110" width="54" height="14" rx="3" />
          <rect x="80" y="78" width="40" height="36" rx="3" />
          <rect x="88" y="56" width="24" height="26" />
          <rect x="76" y="51" width="48" height="8" rx="2" />
          <rect x="78" y="200" width="44" height="26" fill="#020030" opacity="0.6" />
          <rect x="78" y="300" width="44" height="26" fill="#020030" opacity="0.6" />
          <rect x="78" y="400" width="44" height="26" fill="#020030" opacity="0.6" />
          <rect x="85" y="490" width="30" height="110" />
          <polygon points="100,66 30,260 50,268" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-ocean-800/70 border border-ocean-500/30 backdrop-blur-sm rounded-full px-5 py-2 text-ocean-200 text-sm font-medium mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-ocean-300 pulse-dot flex-shrink-0" />
            Comunidad marplatense de tecnología
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6">
            El Hub Tech de<br />
            <span className="gradient-text">la Costa Atlántica</span>
          </h1>

          <p className="text-ocean-200 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Conectamos desarrolladores, diseñadores y emprendedores en Mar del Plata.
            Impulsamos el talento local a través de la colaboración, el aprendizaje y eventos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-ocean-400 hover:bg-ocean-300 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-ocean-400/40 hover:-translate-y-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Unirse a la comunidad
            </a>
            <a
              href="#eventos"
              className="inline-flex items-center justify-center gap-2.5 border border-ocean-400/50 text-ocean-200 hover:bg-ocean-800/60 hover:text-white hover:border-ocean-300 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:-translate-y-1 backdrop-blur-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Ver Eventos
            </a>
          </div>

          {/* Member avatars */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="flex -space-x-3">
              {[
                { initials: "MA", from: "from-cyan-400",   to: "to-blue-600"   },
                { initials: "JP", from: "from-teal-400",   to: "to-cyan-600"   },
                { initials: "LG", from: "from-blue-400",   to: "to-indigo-600" },
                { initials: "SR", from: "from-sky-400",    to: "to-blue-600"   },
                { initials: "+",  from: "from-ocean-400",  to: "to-ocean-700"  },
              ].map((a) => (
                <div
                  key={a.initials}
                  className={`w-11 h-11 rounded-full border-2 border-ocean-900 bg-linear-to-br ${a.from} ${a.to} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-tight">+500 miembros</p>
              <p className="text-ocean-300 text-sm">devs en Mar del Plata</p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                anim: "float-1",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48CAE4" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                ),
                label: "EMPLEOS",
                desc: "Compartimos ofertas laborales",
              },
              {
                anim: "float-2",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48CAE4" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                ),
                label: "CURSOS",
                desc: "Compartimos recursos educativos",
              },
              {
                anim: "float-3",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48CAE4" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
                label: "EVENTOS",
                desc: "Organizamos y difundimos eventos",
              },
            ].map((card) => (
              <div
                key={card.label}
                className={`${card.anim} bg-ocean-800/50 backdrop-blur-sm border border-ocean-600/30 rounded-2xl p-5 text-center`}
              >
                <div className="w-12 h-12 bg-ocean-600/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                  {card.icon}
                </div>
                <p className="text-ocean-300 text-xs font-semibold uppercase tracking-widest mb-1">{card.label}</p>
                <p className="text-white font-medium text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated wave bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none" style={{ height: 80 }}>
        <div className="wave-drift">
          <svg
            viewBox="0 0 2880 80"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", width: "100%", height: 80 }}
          >
            <path
              d="M0,40 C240,70 480,15 720,45 C960,75 1200,10 1440,40 C1680,70 1920,15 2160,45 C2400,75 2640,10 2880,40 L2880,80 L0,80 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
