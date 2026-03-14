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

        {/* Coming soon card */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="event-header p-6 text-white text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Próximamente
            </div>
            <h3 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
              CURSOR CAFE
            </h3>
          </div>
          <div className="p-8 text-center">
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto mb-6">
              Un espacio informal para encontrarnos, tomar un café y hablar de tecnología.
              Networking real, en persona, en Mar del Plata. Los detalles se anunciarán en la comunidad.
            </p>
            <a
              href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-ocean-600/30"
            >
              Enterarme por WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
