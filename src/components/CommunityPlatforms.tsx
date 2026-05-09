// CommunityPlatforms — terminal log feed. Cada canal es una "log entry"
// con timestamp + prompt + cmd + output (icon + handle + desc + cta).
// Sin cards, sin bento — todo lee como una consola transmitiendo.

import SectionWaveMesh from "./SectionWaveMesh";

type Channel = {
  slot: string;
  handle: string;
  desc: string;
  href: string;
  glow: string;
  time: string;
  icon: React.ReactNode;
};

export default function CommunityPlatforms() {
  const channels: Channel[] = [
    {
      slot: "/principal",
      handle: "WhatsApp",
      desc: "El canal donde late la comunidad. Anuncios, ayudas, oportunidades.",
      href: "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs",
      glow: "37, 211, 102",
      time: "03:14:22",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
    },
    {
      slot: "/visual",
      handle: "Instagram",
      desc: "Cobertura visual de eventos, momentos y atrás de cámara.",
      href: "https://www.instagram.com/mardelplata.dev.ar/",
      glow: "225, 48, 108",
      time: "03:14:23",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
      ),
    },
    {
      slot: "/pulso",
      handle: "X (Twitter)",
      desc: "Pulso del ecosistema en tiempo real, threads y enlaces.",
      href: "https://x.com/Mardeldev",
      glow: "59, 130, 246",
      time: "03:14:24",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="panel-section" id="comunidad">
      <SectionWaveMesh
        variant="scatter"
        id="mesh-grad-channels"
        className="section-wave-mesh--scatter"
        opacity={0.14}
      />
      <div className="panel-section-inner">
        <header className="panel-header">
          <div>
            <span className="panel-id">02 / Canales activos</span>
            <h2 className="panel-title">
              Donde <em>late</em> la comunidad.
            </h2>
          </div>
          <p className="panel-aside">
            Tres canales — distintas vibras, misma red. Elegí el que ya
            tengas abierto y enganchate desde ahí. Todo lo importante se
            anuncia en los tres.
          </p>
        </header>

        <div className="terminal-log">
          {channels.map((ch) => (
            <a
              key={ch.slot}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-log-entry"
            >
              <span className="terminal-log-prefix">
                <span className="terminal-log-prefix-time">[{ch.time}]</span>
                <span className="terminal-log-prefix-prompt">$</span>
                <span>connect</span>
                <span className="text-[var(--c-text-mute)]">{ch.slot}</span>
              </span>

              <span className="terminal-log-body">
                <span
                  className="terminal-log-icon"
                  style={{ color: `rgb(${ch.glow})` }}
                >
                  {ch.icon}
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span className="terminal-log-handle">{ch.handle}</span>
                  <span className="terminal-log-desc">{ch.desc}</span>
                </span>
              </span>

              <span className="terminal-log-cta">
                join
                <span className="terminal-log-cta-arrow">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
