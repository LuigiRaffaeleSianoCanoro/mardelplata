import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import SourceTag from "@/components/nomad/SourceTag";
import LangSwitcher from "@/components/nomad/LangSwitcher";
import Faq from "@/components/nomad/Faq";
import { breadcrumbSchema, faqPageSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { livingEn } from "@/content/nomad";
import { roomixUrl, ROOMIX_PRESETS } from "@/lib/integrations/roomix";

export const metadata: Metadata = {
  title: "Living and working remotely in Mar del Plata",
  description:
    "Honest guide for digital nomads: cost of living, internet, neighborhoods and visa in Mar del Plata. Work remotely with an ocean view, in the Americas time zone.",
  alternates: {
    canonical: "/en/live-in-mar-del-plata",
    languages: {
      es: "/vivir-en-mardelplata",
      en: "/en/live-in-mar-del-plata",
      "x-default": "/vivir-en-mardelplata",
    },
  },
  openGraph: {
    title: "Living and working remotely in Mar del Plata — MdPDev",
    description:
      "Cost of living, internet, neighborhoods and visa for digital nomads on the Atlantic coast.",
    url: "/en/live-in-mar-del-plata",
    locale: "en_US",
    type: "website",
    images: [ogImageUrl("Living in Mar del Plata", "Remote, with an ocean view")],
  },
};

export default function LivePage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Live in Mar del Plata", path: "/en/live-in-mar-del-plata" },
    ]),
    faqPageSchema(livingEn.faq),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="vivir-x" lang="en">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <LangSwitcher es="/vivir-en-mardelplata" en="/en/live-in-mar-del-plata" current="en" />
            </div>
            <p className="shell-eyebrow">REMOTE, WITH AN OCEAN VIEW</p>
            <h1 className="shell-title shell-title--xl">
              Living in <em>Mar del Plata.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {livingEn.intro}
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
              {livingEn.highlights.map((h) => (
                <span key={h} className="shell-tag shell-tag--cyan">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </header>

        <section className="shell-section">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Cost of living</h2>
              <p className="shell-lead">{livingEn.costOfLiving.summary}</p>
              <div className="shell-grid shell-grid--auto-220" style={{ marginTop: "1.2rem" }}>
                {livingEn.costOfLiving.items.map((item) => (
                  <div key={item.label} className="shell-card">
                    <span className="shell-card__title">{item.value}</span>
                    <p className="shell-card__desc">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="shell-card__desc" style={{ marginTop: "1rem", fontStyle: "italic" }}>
                {livingEn.costOfLiving.disclaimer}
              </p>
              <div style={{ marginTop: "0.6rem" }}>
                <SourceTag
                  source={livingEn.costOfLiving.source}
                  asOf={livingEn.costOfLiving.asOf}
                  url={livingEn.costOfLiving.sourceUrl}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Internet & connectivity</h2>
              <p className="shell-lead">{livingEn.internet.summary}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
                {livingEn.internet.providers.map((p) => (
                  <span key={p} className="shell-tag shell-tag--violet">
                    {p}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "0.8rem" }}>
                <SourceTag
                  source={livingEn.internet.source}
                  asOf={livingEn.internet.asOf}
                  url={livingEn.internet.sourceUrl}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner">
            <Reveal>
              <h2 className="shell-title">Neighborhoods</h2>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                {livingEn.neighborhoods.map((n) => (
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
              <h2 className="shell-title">Where to live: find your rental</h2>
              <p className="shell-lead">
                We use <strong>Roomix</strong>, the AI-powered real-estate metasearch born in Mar del
                Plata: it indexes the major portals and ranks by relevance. Search like you’d chat.
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
                      Search on Roomix <span aria-hidden>→</span>
                    </span>
                  </a>
                ))}
              </div>
              <p className="shell-card__meta" style={{ marginTop: "0.8rem" }}>
                Roomix is an external service, independent from MdPDev.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <h2 className="shell-title">FAQ</h2>
              <div style={{ marginTop: "1.2rem" }}>
                <Faq items={livingEn.faq} />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
