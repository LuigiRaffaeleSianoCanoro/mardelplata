function SeaLionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <ellipse cx="8" cy="7.5" rx="4" ry="3.5" stroke="white" strokeWidth="1.8" />
      <circle cx="7" cy="6.5" r="0.8" fill="white" />
      <path d="M11.5 8.5 C13 8 14 8.5 13.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 8 L14.5 7" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M11.5 9 L14.5 9.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M6 11 C5.5 13 6 15 7 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 16 C9 17.5 13 18 17 16.5 C19 15.5 20 13.5 18.5 12 C17 10.5 14 10.5 11 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 14.5 C3.5 15.5 3 17.5 5 18.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17.5 17 C19.5 16 21 17.5 19.5 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 17.5 C17 19.5 19 20.5 18 21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ocean-900 border-t border-ocean-800/70 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#inicio" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-ocean-300 to-ocean-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <SeaLionIcon />
              </div>
              <span className="font-display font-bold text-xl text-white">MdPDev</span>
            </a>
            <p className="text-ocean-400 text-sm leading-relaxed max-w-xs">
              Comunidad de tecnología y desarrollo en Mar del Plata. Impulsando el futuro digital de la costa atlántica.
            </p>
          </div>

          {/* Comunidad */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Comunidad</h4>
            <ul className="space-y-2.5 text-sm text-ocean-400">
              <li>
                <a
                  href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ocean-200 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Recursos + Legal */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2.5 text-sm text-ocean-400 mb-6">
              {[
                { label: "Eventos",       href: "#eventos" },
                { label: "Colaboradores", href: "#colaboradores" },
                { label: "Staff",         href: "#staff" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-ocean-200 transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
            <h4 className="font-display font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2.5 text-sm text-ocean-400">
              <li>
                <a href="/reglamento" className="hover:text-ocean-200 transition-colors">Código de Conducta</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ocean-800/70 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ocean-500 text-sm">© 2026 MdPDev. Todos los derechos reservados.</p>
          <a
            href="#inicio"
            className="inline-flex items-center gap-2 text-ocean-500 hover:text-ocean-300 text-sm transition-colors"
          >
            Volver al inicio
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
