import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import SourceTag from "@/components/nomad/SourceTag";
import Faq from "@/components/nomad/Faq";
import { breadcrumbSchema, faqPageSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { institutions, type Institution } from "@/content/nomad";

const ESTUDIAR_FAQ = [
  {
    question: "¿Dónde estudiar programación o sistemas en Mar del Plata?",
    answer:
      "Mar del Plata tiene cinco universidades con carreras tech (UNMDP, UTN, CAECE, FASTA y Atlántida Argentina) más varios institutos terciarios. La UNMDP ofrece carreras de grado gratuitas en Ingeniería en Computación e Informática.",
  },
  {
    question: "¿Hay carreras tech gratuitas en Mar del Plata?",
    answer:
      "Sí. La Universidad Nacional de Mar del Plata (Facultad de Ingeniería) es pública y gratuita, con Ingeniería en Computación e Ingeniería en Informática. También hay institutos terciarios gratuitos como el Instituto Superior de Estudios Técnicos (MGP).",
  },
  {
    question: "¿Se puede estudiar tecnología a distancia en Mar del Plata?",
    answer:
      "Sí. La UTN Facultad Regional Mar del Plata ofrece la Tecnicatura Universitaria en Programación y la Tecnicatura en Tecnologías de la Información en modalidad a distancia.",
  },
];

export const metadata: Metadata = {
  title: "Estudiar tecnología en Mar del Plata",
  description:
    "Universidades e institutos de Mar del Plata con carreras de programación, sistemas, informática, ciberseguridad e IA. La oferta local de formación tech.",
  alternates: { canonical: "/estudiar" },
  openGraph: {
    title: "Estudiar tecnología en Mar del Plata — MdPDev",
    description:
      "Carreras de programación, sistemas, informática y ciberseguridad en las universidades e institutos de Mar del Plata.",
    url: "/estudiar",
    type: "website",
    images: [ogImageUrl("Estudiar tech en Mar del Plata", "El talento se forma acá")],
  },
};

function educationalOrgSchema(inst: Institution): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: inst.name,
    ...(inst.website ? { url: inst.website } : {}),
    ...(inst.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: inst.address,
            addressLocality: "Mar del Plata",
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
        }
      : {}),
    areaServed: { "@type": "City", name: "Mar del Plata" },
  };
}

function InstitutionCard({ inst }: { inst: Institution }) {
  const inner = (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "baseline", justifyContent: "space-between" }}>
        <h3 className="shell-card__title">{inst.name}</h3>
        <span className="shell-tag shell-tag--cyan">{inst.kind}</span>
      </div>
      {inst.address && <p className="shell-card__meta">{inst.address}</p>}
      <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {inst.careers.map((c) => (
          <li key={c} className="shell-card__desc" style={{ listStyle: "disc" }}>
            {c}
          </li>
        ))}
      </ul>
    </>
  );

  if (inst.website) {
    return (
      <a className="shell-card" href={inst.website} target="_blank" rel="noopener noreferrer">
        {inner}
        <span className="shell-link" style={{ marginTop: "0.3rem" }}>
          Visitar sitio <span aria-hidden>→</span>
        </span>
      </a>
    );
  }
  return <div className="shell-card">{inner}</div>;
}

export default function EstudiarPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Estudiar", path: "/estudiar" },
    ]),
    ...institutions.universities.map(educationalOrgSchema),
    ...institutions.institutes.map(educationalOrgSchema),
    faqPageSchema(ESTUDIAR_FAQ),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="estudiar-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">EL TALENTO SE FORMA ACÁ</p>
            <h1 className="shell-title shell-title--xl">
              Estudiar tech en la <em>costa.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {institutions.intro}
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Universidades</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {institutions.universities.map((u) => (
                  <InstitutionCard key={u.name} inst={u} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Institutos y terciarios</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {institutions.institutes.map((i) => (
                  <InstitutionCard key={i.name} inst={i} />
                ))}
              </div>
              <div style={{ marginTop: "1.6rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {institutions.sources.map((s) => (
                  <SourceTag key={s.url} source={s.label} url={s.url} asOf={institutions.updatedAt} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <h2 className="shell-title">Preguntas frecuentes</h2>
              <div style={{ marginTop: "1.2rem" }}>
                <Faq items={ESTUDIAR_FAQ} />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
