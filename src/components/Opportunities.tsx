// Opportunities — "Oportunidades para crecer". Lista jobs reales desde
// classified_listings (review Luigi PR #26 punto 6). Si no hay nada
// vigente, mostramos un CTA para que alguien publique la primera.

import Link from "next/link";

export type OpportunityJob = {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  external_url: string | null;
  tags: string[];
  created_at: string;
  author: { full_name: string | null; avatar_url: string | null } | null;
};

interface OpportunitiesProps {
  jobs: OpportunityJob[];
}

// Letterform a partir del nombre del autor o del titulo. Reemplaza el
// company-mark hardcodeado del diseño anterior — ahora estos avisos los
// publican personas de la red, no marcas.
function deriveMark(j: OpportunityJob): string {
  const source = j.author?.full_name?.trim() || j.title.trim();
  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Paleta deterministica por id — hash simple a un acento de nuestra paleta.
const ACCENT_PALETTE = [
  "#a855f7", // violet
  "#22d3ee", // cyan
  "#FF7A00", // orange
  "#3B82F6", // sapphire
  "#FF2DAA", // magenta
  "#A1FF00", // lime
];
function deriveAccent(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ACCENT_PALETTE[Math.abs(h) % ACCENT_PALETTE.length];
}

export default function Opportunities({ jobs }: OpportunitiesProps) {
  return (
    <section className="jobs-x" id="empleos">
      <div className="jobs-x-inner">
        <header className="jobs-x-header">
          <h2 className="jobs-x-title">Oportunidades para crecer</h2>
          <Link className="jobs-x-link" href="/bolsa">
            Ver todas las oportunidades <span aria-hidden>→</span>
          </Link>
        </header>

        <div className="jobs-x-grid">
          {jobs.length === 0 ? (
            <article className="job-card job-card--empty">
              <h3 className="job-card-role">Aún no hay búsquedas activas</h3>
              <p className="job-card-stack">
                La bolsa está abierta. Si tu equipo busca talento, publicá
                la primera y aparece acá.
              </p>
            </article>
          ) : (
            jobs.map((job) => {
              const accent = deriveAccent(job.id);
              const mark = deriveMark(job);
              const author = job.author?.full_name || "Comunidad";
              return (
                <Link
                  key={job.id}
                  href={job.external_url || "/bolsa"}
                  target={job.external_url ? "_blank" : undefined}
                  rel={job.external_url ? "noopener noreferrer" : undefined}
                  className="job-card"
                >
                  <header className="job-card-header">
                    <span
                      className="job-card-logo"
                      style={{ color: accent }}
                      aria-hidden
                    >
                      {mark}
                    </span>
                    <span className="job-card-company">{author}</span>
                  </header>
                  <h3 className="job-card-role">{job.title}</h3>
                  {job.tags.length > 0 && (
                    <p className="job-card-stack">{job.tags.slice(0, 4).join(" · ")}</p>
                  )}
                </Link>
              );
            })
          )}

          <Link className="job-card job-card--cta" href="/bolsa#publicar">
            <h3 className="job-card-cta-title">¿Buscás talento?</h3>
            <p className="job-card-cta-desc">
              Publicá tu búsqueda y encontrá perfiles de nuestra comunidad.
            </p>
            <span className="job-card-cta-btn">
              Publicar oportunidad <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
