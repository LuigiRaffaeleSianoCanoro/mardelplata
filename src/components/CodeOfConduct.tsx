// CodeOfConduct — directive panel. Centro de la pantalla, panel
// bordeado con corner brackets, lista de protocols mono y CTA.

import SectionWaveMesh from "./SectionWaveMesh";

const PROTOCOLS = [
  "Respeto mutuo",
  "Cero discriminación",
  "Colaboración",
  "Aprendizaje compartido",
  "Crítica constructiva",
  "Datos personales protegidos",
  "Espacio libre de spam",
];

export default function CodeOfConduct() {
  return (
    <section className="panel-section" id="reglamento">
      <SectionWaveMesh
        variant="scatter"
        id="mesh-grad-protocol"
        className="section-wave-mesh--scatter"
        opacity={0.12}
      />
      <div className="panel-section-inner" style={{ maxWidth: 1080 }}>
        <div className="directive-panel">
          <div className="directive-panel-grid" />
          <div className="directive-corner directive-corner--tl" />
          <div className="directive-corner directive-corner--tr" />
          <div className="directive-corner directive-corner--bl" />
          <div className="directive-corner directive-corner--br" />

          <div className="relative">
            <span className="directive-id">Directive 06 / Protocol</span>
            <h2 className="directive-title">
              Un espacio <em>seguro</em> e inclusivo.
            </h2>
            <p
              className="font-serif-display"
              style={{
                fontStyle: "italic",
                fontSize: "1.15rem",
                color: "var(--c-text-dim)",
                marginTop: "0.5em",
                maxWidth: 580,
                lineHeight: 1.6,
                fontVariationSettings: '"opsz" 60',
              }}
            >
              Respeto mutuo, colaboración y aprendizaje compartido. Eso es
              todo lo que pedimos para que la comunidad funcione. Las 7
              reglas están escritas en simple y se respetan.
            </p>

            <ul className="directive-list">
              {PROTOCOLS.map((p, i) => (
                <li key={p}>
                  <span style={{ color: "var(--c-text-mute)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <a href="/reglamento" className="directive-cta">
              Leer protocolo completo
              <span className="directive-cta-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
