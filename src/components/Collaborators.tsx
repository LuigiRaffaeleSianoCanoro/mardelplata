// Collaborators — habitantes ticker. Marquee horizontal, cada miembro
// como una "data point" sutil con avatar + nombre serif + rol mono.
// Sin cards individuales — toda la fila es el contenedor.

import { resolveAvatarDisplayUrl } from "@/lib/avatarPresets";
import SectionWaveMesh from "./SectionWaveMesh";

interface CommunityMember {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

export default function Collaborators({
  members = [],
}: {
  members?: CommunityMember[];
}) {
  const seq = members.length > 0 ? [...members, ...members] : [];

  return (
    <section className="panel-section" id="colaboradores">
      <SectionWaveMesh
        variant="scatter"
        id="mesh-grad-collab"
        className="section-wave-mesh--scatter"
        opacity={0.14}
      />
      <div className="panel-section-inner">
        <header className="panel-header">
          <div>
            <span className="panel-id">04 / Habitantes activos</span>
            <h2 className="panel-title">
              Quiénes <em>la habitan</em>.
            </h2>
          </div>
          <p className="panel-aside">
            Devs, diseñadores, founders, QAs. Una muestra de quiénes
            están construyendo desde la costa. Si todavía no aparecés
            acá, sumá tu perfil al portal.
          </p>
        </header>
      </div>

      {members.length === 0 ? (
        <div className="panel-section-inner">
          <div className="depth-event-classified" style={{ maxWidth: 600, margin: "0 auto" }}>
            <p className="depth-event-meta">
              <span className="depth-event-status-dot" />
              // EMPTY · BE THE FIRST
            </p>
            <p
              className="depth-event-desc"
              style={{ marginTop: "0.6em" }}
            >
              Todavía no hay perfiles públicos. Sé la primera persona en
              poblar la red — creá tu perfil y dejá tu marca.
            </p>
          </div>
        </div>
      ) : (
        <div className="habitantes-ticker">
          <div className="habitantes-track">
            {seq.map((m, i) => (
              <div
                key={`${m.id}-${i}`}
                className="habitante-entry"
              >
                <div className="habitante-avatar">
                  <img
                    src={resolveAvatarDisplayUrl(
                      m.avatar_url,
                      m.full_name || m.id,
                    )}
                    alt={m.full_name || "Miembro"}
                  />
                </div>
                <div className="habitante-text">
                  <span className="habitante-name">
                    {m.full_name || "Miembro anónimo"}
                  </span>
                  <span className="habitante-bio">
                    {m.bio || "Member · MdPDev"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
