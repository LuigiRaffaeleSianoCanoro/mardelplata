import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import JsonLd from "@/components/seo/JsonLd";
import SourceTag from "@/components/nomad/SourceTag";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { companies, companyBySlug, type Company } from "@/content/nomad";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return companies.companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = companyBySlug(slug);
  if (!company) return { title: "Empresa no encontrada" };
  return {
    title: `${company.name} — empresa tech en Mar del Plata`,
    description: `${company.name}: ${company.tagline}. Parte del ecosistema tecnológico de Mar del Plata.`,
    alternates: { canonical: `/empresas/${company.slug}` },
    openGraph: {
      title: `${company.name} — MdPDev`,
      description: company.tagline,
      url: `/empresas/${company.slug}`,
      type: "profile",
    },
  };
}

function organizationSchema(company: Company): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.description,
    ...(company.website ? { url: company.website } : {}),
    ...(company.founded ? { foundingDate: String(company.founded) } : {}),
    ...(company.neighborhood
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: company.neighborhood,
            addressLocality: "Mar del Plata",
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
        }
      : {}),
    areaServed: { "@type": "City", name: "Mar del Plata" },
    knowsAbout: company.sectors,
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = companyBySlug(slug);
  if (!company) notFound();

  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Empresas", path: "/empresas" },
      { name: company.name, path: `/empresas/${company.slug}` },
    ]),
    organizationSchema(company),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="empresa-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow">
            <Link href="/empresas" className="shell-link" style={{ marginBottom: "1rem" }}>
              <span aria-hidden>←</span> Volver al directorio
            </Link>
            <h1 className="shell-title shell-title--xl">{company.name}</h1>
            <p className="shell-lead">{company.tagline}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1rem" }}>
              {company.sectors.map((s) => (
                <span key={s} className="shell-tag shell-tag--violet">
                  {s}
                </span>
              ))}
              {company.exports && <span className="shell-tag shell-tag--emerald">Exporta servicios</span>}
            </div>
            {company.website && (
              <div style={{ marginTop: "1.4rem" }}>
                <a className="shell-btn-primary" href={company.website} target="_blank" rel="noopener noreferrer">
                  Visitar sitio web
                </a>
              </div>
            )}
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow">
            <p className="shell-lead">{company.description}</p>
            <div className="shell-grid shell-grid--auto-220" style={{ marginTop: "1.4rem" }}>
              {company.neighborhood && (
                <div className="shell-card">
                  <h3 className="shell-card__title">Ubicación</h3>
                  <p className="shell-card__desc">{company.neighborhood}, Mar del Plata</p>
                </div>
              )}
              {company.founded && (
                <div className="shell-card">
                  <h3 className="shell-card__title">Desde</h3>
                  <p className="shell-card__desc">{company.founded}</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: "1.4rem" }}>
              <SourceTag source={company.source} asOf={companies.updatedAt} url={company.sourceUrl} />
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
