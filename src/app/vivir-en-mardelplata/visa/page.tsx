import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { visa } from "@/content/nomad";

export const metadata: Metadata = {
  title: "Visa de nómade digital en Argentina",
  description:
    "Residencia transitoria para nómades digitales en Argentina: duración, requisitos y cómo tramitarla. Resumen práctico para trabajar remoto desde Mar del Plata.",
  alternates: { canonical: "/vivir-en-mardelplata/visa" },
  openGraph: {
    title: "Visa de nómade digital en Argentina — MdPDev",
    description:
      "Residencia transitoria para nómades digitales: duración, requisitos y trámite.",
    url: "/vivir-en-mardelplata/visa",
    type: "article",
  },
};

export default function VisaPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Vivir en MdP", path: "/vivir-en-mardelplata" },
      { name: "Visa", path: "/vivir-en-mardelplata/visa" },
    ]),
    faqPageSchema(visa.faq),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="visa-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">TRABAJAR REMOTO DESDE ARGENTINA</p>
            <h1 className="shell-title shell-title--xl">
              Visa de <em>nómade digital.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {visa.intro}
            </p>
            <div style={{ marginTop: "1.4rem" }}>
              <a
                className="shell-btn-primary"
                href={visa.official.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Portal oficial de Migraciones
              </a>
            </div>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Lo esencial</h2>
              <div className="shell-grid shell-grid--auto-220" style={{ marginTop: "1.4rem" }}>
                {visa.keyFacts.map((f) => (
                  <div key={f.label} className="shell-card">
                    <h3 className="shell-card__title">{f.label}</h3>
                    <p className="shell-card__desc">{f.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <h2 className="shell-title">Requisitos</h2>
              <ul style={{ margin: "1.2rem 0 0", paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {visa.requirements.map((r) => (
                  <li key={r} className="shell-lead" style={{ listStyle: "disc" }}>
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Cómo se tramita</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {visa.howTo.map((step) => (
                  <div key={step.title} className="shell-card">
                    <h3 className="shell-card__title">{step.title}</h3>
                    <p className="shell-card__desc">{step.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <div className="shell-card" style={{ borderColor: "rgba(251, 191, 36, 0.4)" }}>
                <h3 className="shell-card__title">Importante</h3>
                <p className="shell-card__desc">{visa.disclaimer}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <h2 className="shell-title">Preguntas frecuentes</h2>
              <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {visa.faq.map((f) => (
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
