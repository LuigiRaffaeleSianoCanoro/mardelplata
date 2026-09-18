import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";
import LeadForm from "@/components/marketplace/LeadForm";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { normalizeExternalUrl } from "@/lib/urls";
import {
  getPublishedStartupBySlug,
  getPublishedStartups,
  initialsFromName,
  LOOKING_FOR_LABELS,
  STARTUP_STAGE_LABELS,
} from "@/lib/marketplace";
import type { MarketplaceStartupPublic } from "@/lib/types/marketplace";

export const revalidate = 300;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const startups = await getPublishedStartups();
  return startups.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getPublishedStartupBySlug(slug);
  if (!startup) return { title: "Startup no encontrada" };
  return {
    title: `${startup.name} — startup en Mar del Plata`,
    description: startup.one_liner,
    alternates: { canonical: `/marketplace/startups/${startup.slug}` },
    openGraph: {
      title: `${startup.name} — MdPDev`,
      description: startup.one_liner,
      url: `/marketplace/startups/${startup.slug}`,
      type: "website",
      images: [ogImageUrl(startup.name, "Marketplace · startup")],
    },
  };
}

function startupSchema(startup: MarketplaceStartupPublic): JsonLdObject {
  const website = normalizeExternalUrl(startup.website);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: startup.name,
    description: startup.description,
    ...(website ? { url: website } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: startup.city,
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    knowsAbout: startup.tags,
  };
}

export default async function MarketplaceStartupPage({ params }: PageProps) {
  const { slug } = await params;
  const startup = await getPublishedStartupBySlug(slug);
  if (!startup) notFound();

  const website = normalizeExternalUrl(startup.website);
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "Startups", path: "/marketplace/startups" },
      { name: startup.name, path: `/marketplace/startups/${startup.slug}` },
    ]),
    startupSchema(startup),
  ];

  return (
    <MarketplaceShell>
      <JsonLd schema={schemas} />
      <article className="shell-section shell-section--lg">
        <div className="shell-inner shell-inner--narrow">
          <Link href="/marketplace/startups" className="shell-link">
            ← Startups
          </Link>
          <div className="marketplace-card-head" style={{ marginTop: "1.2rem" }}>
            <div className="marketplace-avatar marketplace-avatar--lg" aria-hidden>
              {startup.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={startup.logo_url} alt="" />
              ) : (
                <span>{initialsFromName(startup.name)}</span>
              )}
            </div>
            <div>
              <p className="shell-eyebrow">{STARTUP_STAGE_LABELS[startup.stage]}</p>
              <h1 className="shell-title">{startup.name}</h1>
              <p className="shell-lead">{startup.one_liner}</p>
            </div>
          </div>

          <p className="shell-card__desc" style={{ marginTop: "1.2rem" }}>
            {startup.description}
          </p>

          <dl className="marketplace-dl">
            <div>
              <dt>Ancla</dt>
              <dd>{startup.city}</dd>
            </div>
            {website && (
              <div>
                <dt>Web</dt>
                <dd>
                  <a className="shell-link" href={website} target="_blank" rel="noopener noreferrer">
                    {website.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            )}
            {startup.looking_for.length > 0 && (
              <div>
                <dt>Buscando</dt>
                <dd>{startup.looking_for.map((item) => LOOKING_FOR_LABELS[item]).join(" · ")}</dd>
              </div>
            )}
            {startup.ticket_range && (
              <div>
                <dt>Ticket</dt>
                <dd>{startup.ticket_range}</dd>
              </div>
            )}
            {startup.has_deck && (
              <div>
                <dt>Deck</dt>
                <dd>Disponible bajo pedido — no está linkeado acá.</dd>
              </div>
            )}
          </dl>

          {startup.tags.length > 0 && (
            <div className="marketplace-chip-row">
              {startup.tags.map((tag) => (
                <span key={tag} className="marketplace-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {startup.founders.length > 0 && (
            <section style={{ marginTop: "1.6rem" }}>
              <h2 className="shell-card__title">Fundadores</h2>
              <ul className="marketplace-founders">
                {startup.founders.map((founder) => (
                  <li key={founder.name}>
                    <strong>{founder.name}</strong>
                    {founder.role ? ` · ${founder.role}` : ""}
                    <span className="shell-card__meta">
                      {founder.linkedin && (
                        <a
                          className="shell-link"
                          href={normalizeExternalUrl(founder.linkedin) ?? founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      )}
                      {founder.x && (
                        <a
                          className="shell-link"
                          href={
                            founder.x.startsWith("http")
                              ? (normalizeExternalUrl(founder.x) ?? founder.x)
                              : `https://x.com/${founder.x.replace(/^@/, "")}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          X
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div style={{ marginTop: "2rem" }}>
            <LeadForm variant="startup" startupId={startup.id} hasDeck={startup.has_deck} />
          </div>
        </div>
      </article>
    </MarketplaceShell>
  );
}
