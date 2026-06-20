import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import JsonLd from "@/components/seo/JsonLd";
import CafeVote from "@/components/cafes/CafeVote";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { getCafes, getCafeBySlug, cafeSlug, cafeKindLabel, type Cafe } from "@/lib/cafes";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const cafes = await getCafes();
  return cafes.map((c) => ({ slug: cafeSlug(c.name) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) return { title: "Lugar no encontrado" };
  const kind = cafe.kind === "cowork" ? "coworking" : "café para trabajar";
  return {
    title: `${cafe.name} — ${kind} en Mar del Plata`,
    description: `${cafe.name}: ${kind} work-friendly en Mar del Plata${cafe.neighborhood ? ` (${cafe.neighborhood})` : ""}. WiFi y enchufes verificados por la comunidad.`,
    alternates: { canonical: `/trabajar/${cafeSlug(cafe.name)}` },
    openGraph: {
      title: `${cafe.name} — MdPDev`,
      description: `${kind} work-friendly en Mar del Plata.`,
      url: `/trabajar/${cafeSlug(cafe.name)}`,
      type: "website",
      images: [ogImageUrl(cafe.name, cafeKindLabel(cafe.kind) + " · Mar del Plata")],
    },
  };
}

function localBusinessSchema(cafe: Cafe): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": cafe.kind === "cafe" ? "CafeOrCoffeeShop" : "LocalBusiness",
    name: cafe.name,
    ...(cafe.maps_url ? { hasMap: cafe.maps_url } : {}),
    ...(cafe.description ? { description: cafe.description } : {}),
    ...(cafe.lat != null && cafe.lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: cafe.lat, longitude: cafe.lng } }
      : {}),
    address: {
      "@type": "PostalAddress",
      ...(cafe.address ? { streetAddress: cafe.address } : {}),
      addressLocality: "Mar del Plata",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    ...(cafe.google_rating != null && cafe.google_reviews_count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: cafe.google_rating,
            reviewCount: cafe.google_reviews_count,
          },
        }
      : {}),
    areaServed: { "@type": "City", name: "Mar del Plata" },
  };
}

function Signal({ label, yes, total }: { label: string; yes: number; total: number }) {
  const pct = total > 0 ? Math.round((yes / total) * 100) : 0;
  return (
    <div className="shell-card">
      <h3 className="shell-card__title">{label}</h3>
      <p className="shell-card__desc">
        {total === 0 ? "Sin votos todavía" : `${pct}% lo confirma (${yes}/${total})`}
      </p>
    </div>
  );
}

export default async function CafePage({ params }: PageProps) {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) notFound();

  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Trabajar", path: "/trabajar" },
      { name: cafe.name, path: `/trabajar/${cafeSlug(cafe.name)}` },
    ]),
    localBusinessSchema(cafe),
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
            <span className={`shell-tag ${cafe.kind === "cowork" ? "shell-tag--cyan" : "shell-tag--amber"}`}>
              {cafeKindLabel(cafe.kind)}
            </span>
            <h1 className="shell-title shell-title--xl" style={{ marginTop: "0.6rem" }}>
              {cafe.name}
            </h1>
            {(cafe.address || cafe.neighborhood) && (
              <p className="shell-lead">{[cafe.address, cafe.neighborhood].filter(Boolean).join(" · ")}</p>
            )}
            {cafe.description && <p className="shell-card__desc">{cafe.description}</p>}
            {cafe.maps_url && (
              <div style={{ marginTop: "1.2rem" }}>
                <a className="shell-btn-primary" href={cafe.maps_url} target="_blank" rel="noopener noreferrer">
                  Ver en Google Maps
                </a>
              </div>
            )}
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow">
            <h2 className="shell-title">Señales de la comunidad</h2>
            <div className="shell-grid shell-grid--auto-220" style={{ marginTop: "1.2rem" }}>
              <Signal label="WiFi" yes={cafe.wifi_yes} total={cafe.votes_total} />
              <Signal label="Enchufes" yes={cafe.power_yes} total={cafe.votes_total} />
              <Signal label="Buenos asientos" yes={cafe.seating_yes} total={cafe.votes_total} />
              <Signal label="Tranquilo" yes={cafe.quiet_yes} total={cafe.votes_total} />
            </div>
            {cafe.votes_total === 0 && (
              <p className="shell-card__meta" style={{ marginTop: "0.8rem" }}>
                Todavía nadie votó este lugar. ¡Sé el primero!
              </p>
            )}
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <CafeVote cafeId={cafe.id} />
          </div>
        </section>
      </main>
    </AppShell>
  );
}
