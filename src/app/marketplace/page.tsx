import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import Faq from "@/components/nomad/Faq";
import Reveal from "@/components/Reveal";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
import MarketplaceDisclaimer from "@/components/marketplace/MarketplaceDisclaimer";
import MarketplaceEmpty from "@/components/marketplace/MarketplaceEmpty";
import StartupCard from "@/components/marketplace/StartupCard";
import PedidoCard from "@/components/marketplace/PedidoCard";
import { breadcrumbSchema, faqPageSchema, itemListSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import {
  getPublishedPedidos,
  getPublishedStartups,
  MARKETPLACE_FAQ,
} from "@/lib/marketplace";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Marketplace de startups en Mar del Plata",
  description:
    "Tablero de la comunidad: startups de la costa y pedidos de producto, capital o cofounders. Contacto moderado, sin emails públicos.",
  alternates: { canonical: "/marketplace" },
  openGraph: {
    title: "Marketplace de startups — MdPDev",
    description:
      "Oferta y demanda de startups en Mar del Plata. Fichas públicas solo después de aprobación.",
    url: "/marketplace",
    type: "website",
    images: [ogImageUrl("Marketplace de startups", "Oferta y demanda de la costa")],
  },
};

interface PageProps {
  searchParams: Promise<{ cara?: string }>;
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const { cara } = await searchParams;
  const tab = cara === "demanda" ? "demanda" : "oferta";
  const [startups, pedidos] = await Promise.all([getPublishedStartups(), getPublishedPedidos()]);

  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
    ]),
    faqPageSchema(MARKETPLACE_FAQ),
    itemListSchema(
      tab === "demanda"
        ? pedidos.map((p) => ({ name: p.title, path: `/marketplace/pedidos/${p.id}` }))
        : startups.map((s) => ({ name: s.name, path: `/marketplace/startups/${s.slug}` })),
    ),
  ];

  return (
    <MarketplaceShell>
      <JsonLd schema={schemas} />
      <header className="shell-section shell-section--lg">
        <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
          <p className="shell-eyebrow">MARKETPLACE · COMUNIDAD</p>
          <h1 className="shell-title shell-title--xl">
            Startups de la <em>costa.</em>
          </h1>
          <p className="shell-lead" style={{ marginInline: "auto" }}>
            Dos caras del mismo tablero: quiénes están construyendo, y qué se está
            pidiendo. No es un closing de equity. Es señal + contacto moderado.
          </p>
          <div className="marketplace-cta-row">
            <Link className="shell-btn-primary" href="/marketplace/aplicar/startup">
              Publicar startup
            </Link>
            <Link className="shell-btn-ghost" href="/marketplace/aplicar/pedido">
              Publicar pedido
            </Link>
          </div>
          <MarketplaceDisclaimer />
        </div>
      </header>

      <section className="shell-section shell-section--soft">
        <div className="shell-inner">
          <MarketplaceTabs active={tab} />

          {tab === "oferta" ? (
            startups.length === 0 ? (
              <MarketplaceEmpty
                title="Todavía no hay startups publicadas"
                body="Las fichas quedan pendientes hasta que Luigi o un admin las aprueben. Si tenés un proyecto con ancla en MdP, aplicá."
                href="/marketplace/aplicar/startup"
                cta="Aplicar con mi startup"
              />
            ) : (
              <>
                <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.2rem" }}>
                  {startups.slice(0, 9).map((startup) => (
                    <Reveal key={startup.id}>
                      <StartupCard startup={startup} />
                    </Reveal>
                  ))}
                </div>
                <p className="shell-card__meta" style={{ marginTop: "1rem" }}>
                  <Link className="shell-link" href="/marketplace/startups">
                    Ver listado completo de startups
                  </Link>
                </p>
              </>
            )
          ) : pedidos.length === 0 ? (
            <MarketplaceEmpty
              title="Todavía no hay pedidos publicados"
              body="Los requests también pasan por moderación. Si buscás una startup, un cofounder o un piloto en la costa, cargá el pedido."
              href="/marketplace/aplicar/pedido"
              cta="Publicar un pedido"
            />
          ) : (
            <>
              <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.2rem" }}>
                {pedidos.slice(0, 9).map((pedido) => (
                  <Reveal key={pedido.id}>
                    <PedidoCard pedido={pedido} />
                  </Reveal>
                ))}
              </div>
              <p className="shell-card__meta" style={{ marginTop: "1rem" }}>
                <Link className="shell-link" href="/marketplace/pedidos">
                  Ver todos los pedidos
                </Link>
              </p>
            </>
          )}
        </div>
      </section>

      <section className="shell-section">
        <div className="shell-inner shell-inner--narrow">
          <h2 className="shell-title">Preguntas cortas</h2>
          <Faq items={MARKETPLACE_FAQ} />
        </div>
      </section>
    </MarketplaceShell>
  );
}
