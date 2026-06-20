import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import SourceTag from "@/components/nomad/SourceTag";
import CompanyDirectory from "@/components/nomad/CompanyDirectory";
import { breadcrumbSchema, itemListSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { companies, companySectors } from "@/content/nomad";

const WHATSAPP_URL = "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs";

export const metadata: Metadata = {
  title: "Empresas de tecnología en Mar del Plata",
  description:
    "Directorio del ecosistema tech de Mar del Plata: empresas de software, inteligencia artificial, agtech, e-commerce y más. El polo tech de la costa atlántica.",
  alternates: { canonical: "/empresas" },
  openGraph: {
    title: "Empresas de tecnología en Mar del Plata — MdPDev",
    description:
      "Directorio del ecosistema tech: software, IA, agtech, e-commerce y más.",
    url: "/empresas",
    type: "website",
    images: [ogImageUrl("Empresas tech de Mar del Plata", "El ecosistema, en un mapa")],
  },
};

export default function EmpresasPage() {
  const sectors = companySectors();
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Empresas", path: "/empresas" },
    ]),
    itemListSchema(
      companies.companies.map((c) => ({ name: c.name, path: `/empresas/${c.slug}` })),
    ),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="empresas-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">EL ECOSISTEMA, EN UN MAPA</p>
            <h1 className="shell-title shell-title--xl">
              Empresas tech de la <em>costa.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {companies.intro}
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <CompanyDirectory companies={companies.companies} sectors={sectors} />
            </Reveal>

            <div style={{ marginTop: "1.6rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {companies.sources.map((s) => (
                <SourceTag key={s.url} source={s.label} url={s.url} asOf={companies.updatedAt} />
              ))}
            </div>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <Reveal>
              <h2 className="shell-title">¿Falta tu empresa?</h2>
              <p className="shell-lead" style={{ marginInline: "auto" }}>
                Este directorio se construye con la comunidad. Si tenés una empresa tech en Mar del
                Plata, sumala y aparecé en el mapa del ecosistema.
              </p>
              <div style={{ marginTop: "1.2rem" }}>
                <a className="shell-btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Sumar mi empresa
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
