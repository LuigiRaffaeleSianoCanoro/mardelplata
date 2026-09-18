import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";
import MarketplaceEmpty from "@/components/marketplace/MarketplaceEmpty";
import PedidoCard from "@/components/marketplace/PedidoCard";
import { breadcrumbSchema, itemListSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { getPublishedPedidos } from "@/lib/marketplace";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pedidos / requests for startups",
  description:
    "Pedidos de la comunidad: invertiría, necesito un producto, busco cofounder. Publicados después de moderación.",
  alternates: { canonical: "/marketplace/pedidos" },
  openGraph: {
    title: "Pedidos — Marketplace MdPDev",
    description: "Requests for startups de Mar del Plata, abiertos a la comunidad.",
    url: "/marketplace/pedidos",
    type: "website",
    images: [ogImageUrl("Pedidos de la costa", "Marketplace · Demanda")],
  },
};

export default async function MarketplacePedidosPage() {
  const pedidos = await getPublishedPedidos();
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "Pedidos", path: "/marketplace/pedidos" },
    ]),
    itemListSchema(pedidos.map((p) => ({ name: p.title, path: `/marketplace/pedidos/${p.id}` }))),
  ];

  return (
    <MarketplaceShell>
      <JsonLd schema={schemas} />
      <header className="shell-section shell-section--lg">
        <div className="shell-inner shell-inner--narrow">
          <Link href="/marketplace?cara=demanda" className="shell-link">
            ← Marketplace
          </Link>
          <h1 className="shell-title shell-title--xl">Demanda · pedidos</h1>
          <p className="shell-lead">
            Inspirado en los RFS, abierto a la comunidad. Sin emails en la ficha.
          </p>
        </div>
      </header>
      <section className="shell-section shell-section--soft">
        <div className="shell-inner">
          {pedidos.length === 0 ? (
            <MarketplaceEmpty
              title="Sin pedidos publicados todavía"
              body="Cada request entra como pending. Cuando Luigi apruebe, aparece acá."
              href="/marketplace/aplicar/pedido"
              cta="Cargar un pedido"
            />
          ) : (
            <div className="shell-grid shell-grid--auto-280">
              {pedidos.map((pedido) => (
                <PedidoCard key={pedido.id} pedido={pedido} />
              ))}
            </div>
          )}
        </div>
      </section>
    </MarketplaceShell>
  );
}
