import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import StatCard from "@/components/nomad/StatCard";
import { breadcrumbSchema, faqPageSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { cityStats } from "@/content/nomad";

const WHATSAPP_URL = "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs";
const ATICMA_URL = "https://www.aticma.org.ar/";

export const metadata: Metadata = {
  title: "Invertir en tecnología en Mar del Plata",
  description:
    "Por qué instalar tu empresa de tecnología en Mar del Plata: 3er polo tech de Argentina y 1er clúster de IA del país. 200+ empresas, 10.000+ talentos, USD 600M de facturación (fuente: ATICMA).",
  alternates: { canonical: "/invertir" },
  openGraph: {
    title: "Invertir en tecnología en Mar del Plata — MdPDev",
    description:
      "3er polo tecnológico de Argentina y 1er clúster de IA. Talento, costos competitivos y calidad de vida costera.",
    url: "/invertir",
    type: "website",
  },
};

export default function InvertirPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Invertir", path: "/invertir" },
    ]),
    faqPageSchema(cityStats.faq),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="invertir-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">EL POLO DE IA FRENTE AL MAR</p>
            <h1 className="shell-title shell-title--xl">
              Llevá tu empresa tech a la <em>costa.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              Mar del Plata es el tercer polo tecnológico de Argentina y el primer clúster de
              inteligencia artificial del país. Talento que se renueva, costos competitivos en
              dólares y calidad de vida costera, en el huso horario de las Américas.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.8rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "1.6rem",
              }}
            >
              <a className="shell-btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Hablemos
              </a>
              <a className="shell-btn-ghost" href={ATICMA_URL} target="_blank" rel="noopener noreferrer">
                Conocé ATICMA
              </a>
            </div>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <p className="shell-eyebrow">LOS NÚMEROS DEL POLO</p>
              <p className="shell-lead" style={{ marginBottom: "1.6rem" }}>
                {cityStats.intro}
              </p>
              <div className="shell-grid shell-grid--auto-220">
                {cityStats.stats.map((s) => (
                  <StatCard
                    key={s.label}
                    value={s.value}
                    label={s.label}
                    detail={s.detail}
                    source={s.source}
                    asOf={s.asOf}
                    sourceUrl={s.sourceUrl}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">¿Por qué Mar del Plata?</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {cityStats.reasons.map((r) => (
                  <div key={r.title} className="shell-card">
                    <h3 className="shell-card__title">{r.title}</h3>
                    <p className="shell-card__desc">{r.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Casos que ya escalaron desde acá</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {cityStats.cases.map((c) => (
                  <a
                    key={c.name}
                    className="shell-card"
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="shell-card__title">{c.name}</h3>
                    <p className="shell-card__desc">{c.description}</p>
                    <span className="shell-card__meta">{c.source} ↗</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <h2 className="shell-title">Preguntas frecuentes</h2>
              <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {cityStats.faq.map((f) => (
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

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <Reveal>
              <h2 className="shell-title">¿Pensás traer tu empresa a la costa?</h2>
              <p className="shell-lead" style={{ marginInline: "auto" }}>
                Conectamos con la comunidad, las universidades y ATICMA. Escribinos y te ayudamos a
                aterrizar en el ecosistema.
              </p>
              <div style={{ marginTop: "1.4rem" }}>
                <a className="shell-btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Hablemos por WhatsApp
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
