import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";
import LeadForm from "@/components/marketplace/LeadForm";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import {
  getPublishedPedidoById,
  getPublishedPedidos,
  PEDIDO_KIND_LABELS,
} from "@/lib/marketplace";

export const revalidate = 300;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const pedidos = await getPublishedPedidos();
  return pedidos.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pedido = await getPublishedPedidoById(id);
  if (!pedido) return { title: "Pedido no encontrado" };
  return {
    title: pedido.title,
    description: pedido.description.slice(0, 160),
    alternates: { canonical: `/marketplace/pedidos/${pedido.id}` },
    openGraph: {
      title: `${pedido.title} — MdPDev`,
      description: pedido.description.slice(0, 160),
      url: `/marketplace/pedidos/${pedido.id}`,
      type: "website",
      images: [ogImageUrl(pedido.title, "Marketplace · pedido")],
    },
  };
}

export default async function MarketplacePedidoPage({ params }: PageProps) {
  const { id } = await params;
  const pedido = await getPublishedPedidoById(id);
  if (!pedido) notFound();

  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "Pedidos", path: "/marketplace/pedidos" },
      { name: pedido.title, path: `/marketplace/pedidos/${pedido.id}` },
    ]),
  ];

  return (
    <MarketplaceShell>
      <JsonLd schema={schemas} />
      <article className="shell-section shell-section--lg">
        <div className="shell-inner shell-inner--narrow">
          <Link href="/marketplace/pedidos" className="shell-link">
            ← Pedidos
          </Link>
          <p className="shell-eyebrow" style={{ marginTop: "1.2rem" }}>
            {PEDIDO_KIND_LABELS[pedido.kind]}
          </p>
          <h1 className="shell-title">{pedido.title}</h1>
          <p className="shell-card__meta">
            {pedido.publisher_display}
            {pedido.organization ? ` · ${pedido.organization}` : ""}
          </p>
          <p className="shell-card__desc" style={{ marginTop: "1.2rem", whiteSpace: "pre-wrap" }}>
            {pedido.description}
          </p>
          <dl className="marketplace-dl">
            {pedido.budget && (
              <div>
                <dt>Presupuesto / ticket</dt>
                <dd>{pedido.budget}</dd>
              </div>
            )}
            {pedido.deadline && (
              <div>
                <dt>Plazo</dt>
                <dd>{pedido.deadline}</dd>
              </div>
            )}
          </dl>
          {pedido.tags.length > 0 && (
            <div className="marketplace-chip-row">
              {pedido.tags.map((tag) => (
                <span key={tag} className="marketplace-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div style={{ marginTop: "2rem" }}>
            <LeadForm variant="pedido" pedidoId={pedido.id} />
          </div>
        </div>
      </article>
    </MarketplaceShell>
  );
}
