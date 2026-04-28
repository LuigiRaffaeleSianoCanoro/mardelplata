import { FishSchool, Splash } from "./OceanDoodles";

type Platform = {
  slot: string;
  handle: string;
  desc: string;
  href: string;
  accent: string;
  members?: string;
  icon: React.ReactNode;
};

export default function CommunityPlatforms() {
  const platforms: Platform[] = [
    {
      slot: "/principal",
      handle: "WhatsApp",
      desc: "Día a día, anuncios y ayuda entre devs.",
      href: "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs",
      accent: "#25D366",
      members: "comunidad activa",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
    },
    {
      slot: "/visual",
      handle: "Instagram",
      desc: "Cobertura visual de eventos.",
      href: "https://www.instagram.com/mardelplata.dev.ar/",
      accent: "#E1306C",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
      ),
    },
    {
      slot: "/pulso",
      handle: "X (Twitter)",
      desc: "Pulso del ecosistema en tiempo real.",
      href: "https://x.com/Mardeldev",
      accent: "#0f172a",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  const [whatsapp, instagram, x] = platforms;

  return (
    <section id="comunidad" className="relative py-28 px-6 ocean-tint overflow-hidden">
      <div className="absolute -top-20 right-1/4 w-[480px] h-[480px] rounded-full bg-ocean-200/50 blur-[120px] pointer-events-none boat-drift-soft parallax-back" />

      {/* Floating fish schools */}
      <div className="absolute right-[8%] top-[100px] w-[150px] pointer-events-none text-[#6b8593]/50 boat-drift-soft">
        <FishSchool className="w-full h-auto" />
      </div>
      <div className="absolute left-[12%] bottom-[120px] w-[120px] pointer-events-none text-[#7090a0]/40 boat-drift-soft" style={{ animationDelay: "-6s" }}>
        <FishSchool className="w-full h-auto" />
      </div>
      <div className="absolute left-[58%] top-[60px] w-[100px] pointer-events-none text-[#6b8593]/40 boat-drift-soft" style={{ animationDelay: "-3s" }}>
        <FishSchool className="w-full h-auto" />
      </div>
      <div className="absolute right-[34%] bottom-[60px] w-10 h-10 pointer-events-none text-[#7090a0]/55 splash-pop">
        <Splash className="w-full h-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-6">
            <p className="kicker text-ocean-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3B82F6]" style={{ boxShadow: "0 0 8px rgba(59,130,246,0.7)" }} />
              red · canales
            </p>
            <h2
              className="display-h2 text-ocean-900 text-[clamp(2.5rem,6vw,5rem)]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Donde late <br />
              <span className="gradient-text">la comunidad.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 flex md:items-end">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-md">
              Tres canales — distintas vibras, misma comunidad. Elegí el que ya tengas abierto y enganchate
              desde ahí.
            </p>
          </div>
        </div>

        {/* Bento grid — feature WhatsApp dark tile + 2 light tiles */}
        <div className="grid grid-cols-12 gap-4 md:gap-5 auto-rows-[minmax(170px,_auto)]">
          {/* Feature: WhatsApp (dark) — col-7 row-2 */}
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bento-tile bento-tile-dark col-span-12 md:col-span-7 md:row-span-2 group"
          >
            <div className="relative h-full flex flex-col justify-between p-2">
              <div className="flex items-start justify-between gap-4">
                <span className="kicker text-white/45 flex items-center gap-2">
                  <span className="dot-amber" /> {whatsapp.slot}
                </span>
                <span className="kicker text-white/40">{whatsapp.members}</span>
              </div>

              <div className="my-8 md:my-10">
                <span
                  className="metal-chip w-14 h-14 rounded-2xl mb-5 inline-flex"
                  style={{ color: whatsapp.accent }}
                  aria-hidden
                >
                  {whatsapp.icon}
                </span>
                <h3 className="display-thin text-white text-3xl md:text-4xl mb-3">
                  {whatsapp.handle}
                </h3>
                <p className="text-white/60 text-base max-w-md leading-relaxed font-light">
                  {whatsapp.desc} Sumate y enganchate desde el primer mensaje del día.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                <p className="coord-line">
                  CHANNEL <span className="sep">·</span> <span className="num">PRIMARY</span>
                </p>
                <span className="text-white/65 group-hover:text-white group-hover:translate-x-1 transition-all flex items-center gap-2 text-sm">
                  Unirse
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </a>

          {/* Instagram — col-5 row-1 */}
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bento-tile col-span-12 md:col-span-5 group"
          >
            <div className="flex items-start justify-between mb-5">
              <span className="kicker text-ocean-700/70">{instagram.slot}</span>
              <span
                className="grid place-items-center w-10 h-10 rounded-xl bg-white border border-ocean-200/70 shadow-sm"
                style={{ color: instagram.accent }}
                aria-hidden
              >
                {instagram.icon}
              </span>
            </div>
            <h3 className="font-display font-bold text-ocean-900 text-2xl tracking-tight mb-1">
              {instagram.handle}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{instagram.desc}</p>
            <div className="mt-5 pt-3 border-t border-ocean-300/15 flex items-center justify-between">
              <p className="coord-line text-ocean-700/60">
                FEED <span className="sep">·</span> <span className="num">VISUAL</span>
              </p>
              <span className="text-ocean-700 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>

          {/* X — col-5 row-1 */}
          <a
            href={x.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bento-tile col-span-12 md:col-span-5 group"
          >
            <div className="flex items-start justify-between mb-5">
              <span className="kicker text-ocean-700/70">{x.slot}</span>
              <span
                className="grid place-items-center w-10 h-10 rounded-xl bg-white border border-ocean-200/70 shadow-sm"
                style={{ color: x.accent }}
                aria-hidden
              >
                {x.icon}
              </span>
            </div>
            <h3 className="font-display font-bold text-ocean-900 text-2xl tracking-tight mb-1">
              {x.handle}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{x.desc}</p>
            <div className="mt-5 pt-3 border-t border-ocean-300/15 flex items-center justify-between">
              <p className="coord-line text-ocean-700/60">
                PULSE <span className="sep">·</span> <span className="num">REALTIME</span>
              </p>
              <span className="text-ocean-700 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
