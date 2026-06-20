// AudienceSwitchboard — resuelve la IA de "3 audiencias, 1 home": tres caminos
// claros (comunidad / nómade / empresa) en el primer scroll. Usa el sistema
// shell-* (foundation tokens) para matchear el resto del hub.
// Ver docs/nomad-it-hub/03-redesign.md §3.

import Link from "next/link";

type Audience = {
  href: string;
  eyebrow: string;
  title: string;
  desc: string;
  links: { href: string; label: string }[];
};

const AUDIENCES: Audience[] = [
  {
    href: "/eventos",
    eyebrow: "SOY DE LA COMUNIDAD",
    title: "La escena tech, en persona",
    desc: "Meetups, hackatones, bolsa de trabajo y una red que conecta a quien construye en la costa.",
    links: [
      { href: "/eventos", label: "Eventos" },
      { href: "/bolsa", label: "Empleos" },
      { href: "/proyectos", label: "Comunidad" },
    ],
  },
  {
    href: "/vivir-en-mardelplata",
    eyebrow: "TRABAJO REMOTO",
    title: "Vivir y trabajar desde el mar",
    desc: "Costo de vida, internet, barrios y visa de nómade digital. Todo lo que necesitás para mudarte a la costa.",
    links: [
      { href: "/vivir-en-mardelplata", label: "Vivir en MdP" },
      { href: "/que-hacer", label: "Qué hacer" },
      { href: "/vivir-en-mardelplata/visa", label: "Visa" },
    ],
  },
  {
    href: "/invertir",
    eyebrow: "TENGO UNA EMPRESA",
    title: "El polo de IA frente al mar",
    desc: "Talento, costos competitivos y calidad de vida. El 3er polo tech de Argentina te espera.",
    links: [
      { href: "/invertir", label: "Invertir" },
      { href: "/empresas", label: "Empresas" },
      { href: "/estudiar", label: "Talento" },
    ],
  },
];

export default function AudienceSwitchboard() {
  return (
    <section className="shell-section shell-section--soft" aria-label="Recorridos">
      <div className="shell-inner">
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <p className="shell-eyebrow">¿QUÉ TE TRAE A LA COSTA?</p>
          <h2 className="shell-title">Elegí tu camino</h2>
        </div>
        <div className="shell-grid shell-grid--auto-280">
          {AUDIENCES.map((a) => (
            <div key={a.href} className="shell-card">
              <p className="shell-card__meta">{a.eyebrow}</p>
              <h3 className="shell-card__title" style={{ fontSize: "1.15rem" }}>
                {a.title}
              </h3>
              <p className="shell-card__desc">{a.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                {a.links.map((l) => (
                  <Link key={l.href} href={l.href} className="shell-tag shell-tag--violet" style={{ textDecoration: "none" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
