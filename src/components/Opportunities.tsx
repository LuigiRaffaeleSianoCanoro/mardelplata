// Opportunities — "Oportunidades para crecer". Job board con 4 cards
// (logo letterform + rol + stack + modalidad) + 1 card CTA "¿Buscás
// talento?".

type Job = {
  company: string;
  companyMark: string; // letras o símbolo para el placeholder
  companyColor: string;
  role: string;
  stack: string[];
  mode: "Remoto" | "Híbrido" | "Presencial";
  schedule: "Full-time" | "Part-time";
};

const JOBS: Job[] = [
  {
    company: "Globant",
    companyMark: "G›",
    companyColor: "#A1FF00",
    role: "Frontend Developer",
    stack: ["React", "TypeScript", "Next.js"],
    mode: "Remoto",
    schedule: "Full-time",
  },
  {
    company: "PedidosYa",
    companyMark: "PY",
    companyColor: "#FA0050",
    role: "Backend Engineer",
    stack: ["Go", "Kubernetes", "AWS"],
    mode: "Remoto",
    schedule: "Full-time",
  },
  {
    company: "Naranja X",
    companyMark: "NX",
    companyColor: "#FF7A00",
    role: "Data Analyst",
    stack: ["SQL", "Python", "Looker"],
    mode: "Híbrido",
    schedule: "Full-time",
  },
  {
    company: "Auth0",
    companyMark: "A0",
    companyColor: "#EB5424",
    role: "DevRel Engineer",
    stack: ["JavaScript", "APIs", "Docs"],
    mode: "Remoto",
    schedule: "Part-time",
  },
];

export default function Opportunities() {
  return (
    <section className="jobs-x" id="empleos">
      <div className="jobs-x-inner">
        <header className="jobs-x-header">
          <h2 className="jobs-x-title">Oportunidades para crecer</h2>
          <a className="jobs-x-link" href="/bolsa">
            Ver todas las oportunidades <span aria-hidden>→</span>
          </a>
        </header>

        <div className="jobs-x-grid">
          {JOBS.map((job) => (
            <article key={job.company + job.role} className="job-card">
              <header className="job-card-header">
                <span
                  className="job-card-logo"
                  style={{ color: job.companyColor }}
                  aria-hidden
                >
                  {job.companyMark}
                </span>
                <span className="job-card-company">{job.company}</span>
              </header>
              <h3 className="job-card-role">{job.role}</h3>
              <p className="job-card-stack">{job.stack.join(" · ")}</p>
              <div className="job-card-tags">
                <span className="job-tag job-tag--mode">{job.mode}</span>
                <span className="job-tag job-tag--schedule">{job.schedule}</span>
              </div>
            </article>
          ))}

          <a className="job-card job-card--cta" href="/bolsa#publicar">
            <h3 className="job-card-cta-title">¿Buscás talento?</h3>
            <p className="job-card-cta-desc">
              Publicá tu búsqueda y encontrá perfiles de nuestra comunidad.
            </p>
            <span className="job-card-cta-btn">
              Publicar oportunidad <span aria-hidden>→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
