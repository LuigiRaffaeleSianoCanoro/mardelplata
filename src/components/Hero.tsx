import Link from "next/link";

export default function Hero() {
  return (
    <section id="inicio" className="hero-bg relative overflow-hidden min-h-screen flex flex-col justify-center pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] dots-bg" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-ocean-400/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ocean-300/10 rounded-full blur-[100px]" />
        {/* Faro Punta Mogotes silhouette */}
        <svg
          className="absolute right-0 bottom-0 h-full opacity-[0.07] hidden lg:block"
          viewBox="0 0 200 700"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Service building at base */}
          <rect x="55" y="590" width="90" height="75" rx="4" />
          <rect x="85" y="575" width="30" height="18" rx="3" />
          {/* Door arch */}
          <rect x="91" y="615" width="18" height="28" rx="9" fill="#020030" opacity="0.4" />

          {/* Tower platform / base ring */}
          <rect x="70" y="560" width="60" height="14" rx="3" />

          {/* Main tower body — cylindrical, uniform width */}
          <rect x="80" y="165" width="40" height="398" />

          {/* Horizontal band pattern (alternating dark = red in reality) */}
          <rect x="79" y="245" width="42" height="55" fill="#020030" opacity="0.55" />
          <rect x="79" y="350" width="42" height="55" fill="#020030" opacity="0.55" />
          <rect x="79" y="455" width="42" height="55" fill="#020030" opacity="0.55" />

          {/* Gallery / balcony at top of tower */}
          <rect x="66" y="156" width="68" height="13" rx="2" />
          {/* Railing */}
          <rect x="68" y="143" width="64" height="16" rx="2" />
          {/* Railing spindles */}
          {[72, 80, 88, 96, 104, 112, 120].map((x) => (
            <rect key={x} x={x} y={143} width="3" height="16" rx="1" fill="#020030" opacity="0.3" />
          ))}

          {/* Lantern room body */}
          <rect x="78" y="92" width="44" height="56" rx="3" />
          {/* Lantern room glass panels (slightly inset) */}
          <rect x="82" y="96" width="36" height="46" rx="2" fill="#020030" opacity="0.25" />

          {/* Lantern room gallery */}
          <rect x="68" y="84" width="64" height="11" rx="2" />

          {/* Dome */}
          <path d="M78,92 Q100,44 122,92 Z" />
          {/* Dome finial rod */}
          <rect x="97" y="28" width="6" height="18" rx="2" />
          {/* Finial ball */}
          <circle cx="100" cy="26" r="6" />

          {/* Light beam */}
          <polygon points="100,72 8,300 34,312" opacity="0.3" />
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
            El Club tech de la Costa Atlantica
          </h1>

          <p className="text-ocean-200 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Crece profesionalmente conectando con quien ya esta trabajando en los desafíos que vos tenes
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-16 max-w-4xl mx-auto">
            <Link
              href="/primer-trabajo"
              className="inline-flex items-center justify-center gap-2.5 bg-ocean-800/90 hover:bg-ocean-800 border border-ocean-300/60 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-ocean-400/25 hover:-translate-y-1 backdrop-blur-sm min-w-[250px] text-center"
            >
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Primer Trabajo OS
              </span>
            </Link>
            <a
              href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-ocean-800/90 hover:bg-ocean-800 border border-ocean-300/60 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-ocean-400/25 hover:-translate-y-1 backdrop-blur-sm min-w-[250px] text-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Unirse a la comunidad
            </a>
            <a
              href="#eventos"
              className="inline-flex items-center justify-center gap-2.5 bg-ocean-800/90 hover:bg-ocean-800 border border-ocean-300/60 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-ocean-400/25 hover:-translate-y-1 backdrop-blur-sm min-w-[250px] text-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Ver Eventos
            </a>
            <Link
              href="/bolsa"
              className="inline-flex items-center justify-center gap-2.5 bg-ocean-800/90 hover:bg-ocean-800 border border-ocean-300/60 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-ocean-400/25 hover:-translate-y-1 backdrop-blur-sm min-w-[250px] text-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Bolsa de trabajo
            </Link>
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
