import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-ocean-900 overflow-hidden">
      {/* Top accent — thin gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-ocean-300/40 to-transparent" />

      {/* Aurora behind the wordmark */}
      <div className="absolute inset-x-0 -bottom-40 h-[500px] pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[120%] h-full rounded-[50%] bg-ocean-400/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Brand block */}
          <div className="col-span-12 lg:col-span-5">
            <a href="#inicio" className="inline-flex items-center gap-3 group">
              <Image
                src="/mdpdev.png"
                alt="MdPDev logo"
                width={44}
                height={44}
                className="rounded-2xl shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                mardelplata<span className="text-ocean-300">.dev</span>
              </span>
            </a>
            <p className="text-ocean-200/70 text-base leading-relaxed max-w-md mt-6">
              Comunidad tech de Mar del Plata. Conectamos developers, diseñadores y emprendedores
              que construyen el ecosistema digital de la costa atlántica.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <SocialBtn href="https://x.com/Mardeldev" label="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialBtn>
              <SocialBtn href="https://www.instagram.com/mardelplata.dev.ar/" label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                </svg>
              </SocialBtn>
              <SocialBtn href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs" label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </SocialBtn>
            </div>
          </div>

          {/* Columns */}
          <div className="col-span-6 lg:col-span-2">
            <FooterColumn
              title="Comunidad"
              links={[
                { label: "WhatsApp", href: "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs", external: true },
                { label: "Instagram", href: "https://www.instagram.com/mardelplata.dev.ar/", external: true },
                { label: "X (Twitter)", href: "https://x.com/Mardeldev", external: true },
              ]}
            />
          </div>
          <div className="col-span-6 lg:col-span-2">
            <FooterColumn
              title="Recursos"
              links={[
                { label: "Eventos", href: "/#eventos" },
                { label: "Bolsa de trabajo", href: "/bolsa" },
                { label: "Primer Trabajo OS", href: "/primer-trabajo" },
                { label: "Brand book", href: "/brand" },
                { label: "Marketing kit", href: "/marketing-kit" },
              ]}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <FooterColumn
              title="Comunidad"
              links={[
                { label: "Reglamento", href: "/reglamento" },
                { label: "Quiénes somos", href: "/#staff" },
              ]}
            />
            <p className="text-xs text-ocean-300/60 mt-6 leading-relaxed">
              Hecho con orgullo en Mar del Plata. Open community, sin fines de lucro.
            </p>
          </div>
        </div>

        {/* Editorial wordmark — clamp leans small to avoid overflow on phones */}
        <div className="mt-20 mb-8 overflow-hidden">
          <p
            className="font-display font-black text-white/95 leading-none select-none whitespace-nowrap"
            style={{
              fontSize: "clamp(2rem, 14vw, 12rem)",
              letterSpacing: "-0.05em",
            }}
          >
            mardelplata<span className="text-ocean-300">.dev</span>
          </p>
        </div>

        <div className="border-t border-ocean-300/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-ocean-300/60">© 2026 MdPDev — Todos los derechos reservados.</p>
          <a
            href="#inicio"
            className="inline-flex items-center gap-2 text-ocean-300/70 hover:text-white transition-colors"
          >
            Volver arriba
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-ocean-300/40 flex items-center justify-center text-ocean-200/80 hover:text-white transition-all"
    >
      {children}
    </a>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <>
      <h4 className="text-xs uppercase tracking-[0.2em] text-ocean-300/60 mb-4 font-semibold">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="text-ocean-200/85 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
