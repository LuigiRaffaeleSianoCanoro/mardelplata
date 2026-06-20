import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import SourceTag from "@/components/nomad/SourceTag";
import { breadcrumbSchema, faqPageSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { living } from "@/content/nomad";
import { roomixUrl, ROOMIX_PRESETS } from "@/lib/integrations/roomix";

export const metadata: Metadata = {
  title: "Vivir y trabajar remoto en Mar del Plata",
  description:
    "Guía honesta para nómades digitales: costo de vida, internet, barrios y visa en Mar del Plata. Trabajá remoto con vista al mar, en el huso horario de las Américas.",
  alternates: { canonical: "/vivir-en-mardelplata" },
  openGraph: {
    title: "Vivir y trabajar remoto en Mar del Plata — MdPDev",
    description:
      "Costo de vida, internet, barrios y visa para nómades digitales en la costa atlántica.",
    url: "/vivir-en-mardelplata",
    type: "website",
  },
};

const ROUTES = [
  { href: "/vivir-en-mardelplata/visa", label: "Visa de nómade", desc: "Residencia, requisitos y trámite." },
  { href: "/que-hacer", label: "Qué hacer", desc: "Playas, naturaleza y cultura." },
  { href: "/estudiar", label: "Estudiar", desc: "Carreras tech en la ciudad." },
];

export default function VivirPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Vivir en MdP", path: "/vivir-en-mardelplata" },
    ]),
    faqPageSchema(living.faq),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="vivir-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">REMOTO, CON VISTA AL MAR</p>
            <h1 className="shell-title shell-title--xl">
              Vivir en <em>Mar del Plata.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {living.intro}
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "1.4rem",
              }}
            >
              {living.highlights.map((h) => (
                <span key={h} className="shell-tag shell-tag--cyan">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <div className="shell-grid shell-grid--auto-280">
                {ROUTES.map((r) => (
                  <Link key={r.href} href={r.href} className="shell-card">
                    <h3 className="shell-card__title">{r.label}</h3>
                    <p className="shell-card__desc">{r.desc}</p>
                    <span className="shell-link" style={{ marginTop: "0.3rem" }}>
                      Ver <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Costo de vida</h2>
              <p className="shell-lead">{living.costOfLiving.summary}</p>
              <div className="shell-grid shell-grid--auto-220" style={{ marginTop: "1.2rem" }}>
                {living.costOfLiving.items.map((item) => (
                  <div key={item.label} className="shell-card">
                    <span className="shell-card__title">{item.value}</span>
                    <p className="shell-card__desc">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="shell-card__desc" style={{ marginTop: "1rem", fontStyle: "italic" }}>
                {living.costOfLiving.disclaimer}
              </p>
              <div style={{ marginTop: "0.6rem" }}>
                <SourceTag
                  source={living.costOfLiving.source}
                  asOf={living.costOfLiving.asOf}
                  url={living.costOfLiving.sourceUrl}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Internet y conectividad</h2>
              <p className="shell-lead">{living.internet.summary}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
                {living.internet.providers.map((p) => (
                  <span key={p} className="shell-tag shell-tag--violet">
                    {p}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "0.8rem" }}>
                <SourceTag
                  source={living.internet.source}
                  asOf={living.internet.asOf}
                  url={living.internet.sourceUrl}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Barrios</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {living.neighborhoods.map((n) => (
                  <div key={n.name} className="shell-card">
                    <h3 className="shell-card__title">{n.name}</h3>
                    <p className="shell-card__desc">{n.vibe}</p>
                    <p className="shell-card__meta">{n.forWhom}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Dónde vivir: encontrá tu alquiler</h2>
              <p className="shell-lead">
                Usamos <strong>Roomix</strong>, el metabuscador inmobiliario con IA nacido en Mar del
                Plata: indexa los principales portales y ordena por relevancia. Tipeá tu búsqueda
                como si chatearas.
              </p>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {ROOMIX_PRESETS.map((p) => (
                  <a
                    key={p.preset}
                    className="shell-card"
                    href={roomixUrl({ preset: p.preset })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="shell-card__title">{p.label}</h3>
                    <p className="shell-card__desc">{p.hint}</p>
                    <span className="shell-link" style={{ marginTop: "0.3rem" }}>
                      Buscar en Roomix <span aria-hidden>→</span>
                    </span>
                  </a>
                ))}
              </div>
              <p className="shell-card__meta" style={{ marginTop: "0.8rem" }}>
                Roomix es un servicio externo e independiente de MdPDev.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <h2 className="shell-title">Preguntas frecuentes</h2>
              <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {living.faq.map((f) => (
                  <details key={f.question} className="shell-card" style={{ cursor: "pointer" }}>
                    <summary className="shell-card__title" style={{ listStyle: "none" }}>
                      {f.question}
                    </summary>
                    <p className="shell-card__desc" style={{ marginTop: "0.6rem" }}>
                      {f.answer}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
