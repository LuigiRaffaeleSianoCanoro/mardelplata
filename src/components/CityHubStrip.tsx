// CityHubStrip — franja de métricas del polo en la home (estilo Ruta N):
// prueba social institucional con link al recorrido B2B. Datos de city-stats
// (con fuente). Ver docs/nomad-it-hub/03-redesign.md §3.

import Link from "next/link";
import { cityStats } from "@/content/nomad";

// Selección compacta de las métricas más contundentes para la home.
const HIGHLIGHT_LABELS = new Set([
  "empresas de tecnología",
  "talentos tech",
  "clúster de IA de Argentina",
  "polo tecnológico del país",
]);

export default function CityHubStrip() {
  const stats = cityStats.stats.filter((s) => HIGHLIGHT_LABELS.has(s.label));

  return (
    <section className="shell-section" aria-label="El polo tech de Mar del Plata">
      <div className="shell-inner">
        <div style={{ textAlign: "center", marginBottom: "1.6rem" }}>
          <p className="shell-eyebrow">EL POLO TECH DE LA COSTA</p>
          <h2 className="shell-title">Mar del Plata en números</h2>
        </div>

        <div className="shell-grid shell-grid--auto-220">
          {stats.map((s) => (
            <div key={s.label} className="shell-card" style={{ alignItems: "center", textAlign: "center" }}>
              <span
                className="gradient-text"
                style={{
                  fontFamily: "var(--shell-font-display)",
                  fontSize: "2.6rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span className="shell-card__title" style={{ textAlign: "center" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.6rem" }}>
          <Link className="shell-btn-primary" href="/invertir">
            Invertir en MdP
          </Link>
          <Link className="shell-btn-ghost" href="/empresas">
            Ver el ecosistema
          </Link>
        </div>
        <p className="shell-card__meta" style={{ textAlign: "center", marginTop: "0.9rem" }}>
          Fuente: ATICMA · {cityStats.updatedAt}
        </p>
      </div>
    </section>
  );
}
