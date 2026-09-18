import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";
import MarketplaceEmpty from "@/components/marketplace/MarketplaceEmpty";
import StartupCard from "@/components/marketplace/StartupCard";
import { breadcrumbSchema, itemListSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { getPublishedStartups } from "@/lib/marketplace";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Startups de Mar del Plata",
  description:
    "Listado público de startups aprobadas de Mar del Plata y la costa. Contacto moderado, decks privados.",
  alternates: { canonical: "/marketplace/startups" },
  openGraph: {
    title: "Startups — Marketplace MdPDev",
    description: "Fichas públicas de startups de la costa, solo después de aprobación.",
    url: "/marketplace/startups",
    type: "website",
    images: [ogImageUrl("Startups de la costa", "Marketplace · Oferta")],
  },
};

export default async function MarketplaceStartupsPage() {
  const startups = await getPublishedStartups();
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "Startups", path: "/marketplace/startups" },
    ]),
    itemListSchema(startups.map((s) => ({ name: s.name, path: `/marketplace/startups/${s.slug}` }))),
  ];

  return (
    <MarketplaceShell>
      <JsonLd schema={schemas} />
      <header className="shell-section shell-section--lg">
        <div className="shell-inner shell-inner--narrow">
          <Link href="/marketplace" className="shell-link">
            ← Marketplace
          </Link>
          <h1 className="shell-title shell-title--xl">Oferta · startups</h1>
          <p className="shell-lead">
            Solo fichas aprobadas. Emails y decks no están en esta página.
          </p>
        </div>
      </header>
      <section className="shell-section shell-section--soft">
        <div className="shell-inner">
          {startups.length === 0 ? (
            <MarketplaceEmpty
              title="Listado vacío, a propósito"
              body="Hasta que Luigi apruebe la primera startup, acá no hay cards. Aplicá y queda en pending."
              href="/marketplace/aplicar/startup"
              cta="Aplicar"
            />
          ) : (
            <div className="shell-grid shell-grid--auto-280">
              {startups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          )}
        </div>
      </section>
    </MarketplaceShell>
  );
}
