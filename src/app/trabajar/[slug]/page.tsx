import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import JsonLd from "@/components/seo/JsonLd";
import SourceTag from "@/components/nomad/SourceTag";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { workSpots, workSpotBySlug, type WorkSpot } from "@/content/nomad";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return workSpots.spots.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = workSpotBySlug(slug);
  if (!spot) return { title: "Lugar no encontrado" };
  const kind = spot.kind === "coworking" ? "coworking" : "café para trabajar";
  return {
    title: `${spot.name} — ${kind} en Mar del Plata`,
    description: `${spot.name}: ${kind} work-friendly en Mar del Plata${spot.zona ? ` (${spot.zona})` : ""}. WiFi y lugar para trabajar con la laptop.`,
    alternates: { canonical: `/trabajar/${spot.slug}` },
    openGraph: {
      title: `${spot.name} — MdPDev`,
      description: `${kind} work-friendly en Mar del Plata.`,
      url: `/trabajar/${spot.slug}`,
      type: "website",
    },
  };
}

function localBusinessSchema(spot: WorkSpot): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": spot.kind === "cafe" ? "CafeOrCoffeeShop" : "LocalBusiness",
    name: spot.name,
    ...(spot.website ? { url: spot.website } : {}),
    ...(spot.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: spot.address,
            addressLocality: "Mar del Plata",
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
        }
      : {}),
    ...(spot.hours ? { openingHours: spot.hours } : {}),
    amenityFeature: spot.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    areaServed: { "@type": "City", name: "Mar del Plata" },
  };
}

export default async function WorkSpotPage({ params }: PageProps) {
  const { slug } = await params;
  const spot = workSpotBySlug(slug);
  if (!spot) notFound();

  const kindLabel = spot.kind === "coworking" ? "Coworking" : "Café work-friendly";
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Trabajar", path: "/trabajar" },
      { name: spot.name, path: `/trabajar/${spot.slug}` },
    ]),
    localBusinessSchema(spot),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="work-spot-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow">
            <Link href="/trabajar" className="shell-link" style={{ marginBottom: "1rem" }}>
              <span aria-hidden>←</span> Volver a los lugares
            </Link>
            <span className={`shell-tag ${spot.kind === "coworking" ? "shell-tag--cyan" : "shell-tag--amber"}`}>
              {kindLabel}
            </span>
            <h1 className="shell-title shell-title--xl" style={{ marginTop: "0.6rem" }}>
              {spot.name}
            </h1>
            {(spot.address || spot.zona) && (
              <p className="shell-lead">{[spot.address, spot.zona].filter(Boolean).join(" · ")}</p>
            )}
            {spot.website && (
              <div style={{ marginTop: "1.2rem" }}>
                <a className="shell-btn-primary" href={spot.website} target="_blank" rel="noopener noreferrer">
                  Visitar sitio web
                </a>
              </div>
            )}
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow">
            {spot.note && <p className="shell-lead">{spot.note}</p>}

            <div className="shell-grid shell-grid--auto-220" style={{ marginTop: "1.4rem" }}>
              {spot.hours && (
                <div className="shell-card">
                  <h3 className="shell-card__title">Horario</h3>
                  <p className="shell-card__desc">{spot.hours}</p>
                </div>
              )}
              <div className="shell-card">
                <h3 className="shell-card__title">Para trabajar</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.3rem" }}>
                  {spot.amenities.map((a) => (
                    <span key={a} className="shell-tag shell-tag--violet">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1.4rem" }}>
              <SourceTag source={spot.source} asOf={workSpots.updatedAt} url={spot.sourceUrl} />
            </div>
            <p className="shell-card__meta" style={{ marginTop: "0.8rem" }}>
              Los datos pueden cambiar — confirmá horarios y servicios antes de ir.
            </p>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
