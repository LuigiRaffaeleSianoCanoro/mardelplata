import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import StatCard from "@/components/nomad/StatCard";
import LangSwitcher from "@/components/nomad/LangSwitcher";
import { breadcrumbSchema, faqPageSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { cityStatsEn } from "@/content/nomad";

const WHATSAPP_URL = "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs";
const ATICMA_URL = "https://www.aticma.org.ar/";

export const metadata: Metadata = {
  title: "Invest in tech in Mar del Plata, Argentina",
  description:
    "Why open your tech company in Mar del Plata: Argentina's 3rd tech hub and 1st AI cluster. 200+ companies, 10,000+ tech professionals, USD 600M revenue (source: ATICMA).",
  alternates: {
    canonical: "/en/invest",
    languages: { es: "/invertir", en: "/en/invest", "x-default": "/invertir" },
  },
  openGraph: {
    title: "Invest in tech in Mar del Plata — MdPDev",
    description:
      "Argentina's 3rd tech hub and 1st AI cluster. Talent, competitive costs and coastal quality of life.",
    url: "/en/invest",
    locale: "en_US",
    type: "website",
  },
};

export default function InvestPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Invest", path: "/en/invest" },
    ]),
    faqPageSchema(cityStatsEn.faq),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="invertir-x" lang="en">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <LangSwitcher es="/invertir" en="/en/invest" current="en" />
            </div>
            <p className="shell-eyebrow">THE AI HUB BY THE SEA</p>
            <h1 className="shell-title shell-title--xl">
              Bring your tech company to the <em>coast.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              Mar del Plata is Argentina’s third-largest tech hub and the country’s first artificial-
              intelligence cluster. Renewing talent, competitive costs in USD and coastal quality of
              life — in the Americas time zone.
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
                Let’s talk
              </a>
              <a className="shell-btn-ghost" href={ATICMA_URL} target="_blank" rel="noopener noreferrer">
                Meet ATICMA
              </a>
            </div>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <p className="shell-eyebrow">THE HUB IN NUMBERS</p>
              <p className="shell-lead" style={{ marginBottom: "1.6rem" }}>
                {cityStatsEn.intro}
              </p>
              <div className="shell-grid shell-grid--auto-220">
                {cityStatsEn.stats.map((s) => (
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
              <h2 className="shell-title">Why Mar del Plata?</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {cityStatsEn.reasons.map((r) => (
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
              <h2 className="shell-title">Companies already scaling from here</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {cityStatsEn.cases.map((c) => (
                  <a key={c.name} className="shell-card" href={c.url} target="_blank" rel="noopener noreferrer">
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
              <h2 className="shell-title">FAQ</h2>
              <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {cityStatsEn.faq.map((f) => (
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
              <h2 className="shell-title">Thinking of moving your company to the coast?</h2>
              <p className="shell-lead" style={{ marginInline: "auto" }}>
                We connect you with the community, the universities and ATICMA. Write to us and we’ll
                help you land in the ecosystem.
              </p>
              <div style={{ marginTop: "1.4rem" }}>
                <a className="shell-btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Let’s talk on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
