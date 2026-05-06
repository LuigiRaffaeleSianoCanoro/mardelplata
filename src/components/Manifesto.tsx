// Manifesto — bloque editorial entre la transmission bar y los channels.
// Tres líneas serif que respiran (animation-delay desfasado), con la
// foto del lobo como retrato HUD-framed al costado y bajada con
// telemetría mono.

import Image from "next/image";
import SectionWaveMesh from "./SectionWaveMesh";

export default function Manifesto() {
  return (
    <section className="manifesto" id="manifiesto">
      <SectionWaveMesh
        variant="horizon"
        id="mesh-grad-manifest"
        className="section-wave-mesh--horizon"
        opacity={0.14}
      />
      <div className="manifesto-inner">
        <span className="manifesto-eyebrow">01 / Manifiesto</span>

        <div className="manifesto-grid">
          <div>
            <h2 className="manifesto-headline">
              <span className="manifesto-line">
                Una comunidad de la costa.
              </span>
              <span className="manifesto-line">
                Una <em>red</em> que late en el atlántico.
              </span>
              <span className="manifesto-line">
                Una excusa para <em>construir</em> juntos.
              </span>
            </h2>
          </div>

          {/* Retrato del lobo — frame HUD con corner brackets, glow violeta */}
          <figure className="hud-portrait">
            <span className="hud-portrait-corner hud-portrait-corner--tl" />
            <span className="hud-portrait-corner hud-portrait-corner--tr" />
            <span className="hud-portrait-corner hud-portrait-corner--bl" />
            <span className="hud-portrait-corner hud-portrait-corner--br" />
            <div className="hud-portrait-image">
              <Image
                src="/hero-mdp-lobo.png"
                alt="Lobo marino programador en Mar del Plata"
                fill
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover"
              />
              <span className="hud-portrait-scan" />
            </div>
            <figcaption className="hud-portrait-caption">
              <span className="hud-portrait-caption-id">
                // SPECIMEN A · MDP-EDGE
              </span>
              <span className="hud-portrait-caption-title">
                Lobo marino programador · the locals
              </span>
              <span className="hud-portrait-caption-meta">
                <span>38°00&apos;S</span>
                <span className="dim">·</span>
                <span>057°33&apos;W</span>
                <span className="dim">·</span>
                <span>2024</span>
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="manifesto-body">
          <div className="manifesto-body-aside">
            <div className="manifesto-body-aside-row">
              <span>Inicio · Operación</span>
              <span>2024</span>
            </div>
            <div className="manifesto-body-aside-row">
              <span>Base</span>
              <span>Mar del Plata</span>
            </div>
            <div className="manifesto-body-aside-row">
              <span>Frecuencia</span>
              <span>Permanente</span>
            </div>
            <div className="manifesto-body-aside-row">
              <span>Modelo</span>
              <span>Open · Comunidad</span>
            </div>
            <div className="manifesto-body-aside-row">
              <span>Acceso</span>
              <span>Libre</span>
            </div>
          </div>
          <p className="manifesto-body-text">
            MdPDev nace como una excusa para juntar a los que escriben código
            en la ciudad. Desde 2024 transmitimos desde la costa atlántica:
            talleres, charlas, hackathons, proyectos open source y una bolsa
            de trabajo que de a poco se llena. Si sos dev, diseñador,
            founder, QA o curiosx — esta también es tu radio.
          </p>
        </div>
      </div>
    </section>
  );
}
