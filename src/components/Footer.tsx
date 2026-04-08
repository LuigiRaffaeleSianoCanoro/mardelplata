import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ocean-900 border-t border-ocean-800/70 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#inicio" className="flex items-center gap-2.5 mb-4 group w-fit">
              <Image
                src="/mdpdev.png"
                alt="MdPDev logo"
                width={40}
                height={40}
                className="rounded-2xl shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="font-display font-bold text-xl text-white">MarDelPlata.dev.ar</span>
            </a>
            <p className="text-ocean-400 text-sm leading-relaxed max-w-xs mb-5">
              Comunidad de tecnología y desarrollo en Mar del Plata. Impulsando el futuro digital de la costa atlántica.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/Mardeldev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-xl bg-ocean-800 hover:bg-ocean-700 flex items-center justify-center text-ocean-400 hover:text-white transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mardelplata.dev.ar/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-ocean-800 hover:bg-ocean-700 flex items-center justify-center text-ocean-400 hover:text-white transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                </svg>
              </a>
              <a
                href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-ocean-800 hover:bg-ocean-700 flex items-center justify-center text-ocean-400 hover:text-white transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Comunidad */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Comunidad</h4>
            <ul className="space-y-2.5 text-sm text-ocean-400">
              <li>
                <a
                  href="https://x.com/Mardeldev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ocean-200 transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mardelplata.dev.ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ocean-200 transition-colors"
                >
                  Instagram
                </a>
              </li>
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
