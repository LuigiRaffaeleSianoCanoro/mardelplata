import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";
import PedidoApplyForm from "@/components/marketplace/PedidoApplyForm";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Publicar un pedido",
  description:
    "Requests for startups de la comunidad de Mar del Plata. Moderado por admin antes de salir a público.",
  alternates: { canonical: "/marketplace/aplicar/pedido" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Publicar pedido — MdPDev",
    description: "Formulario de demanda. Queda pendiente hasta aprobación.",
    url: "/marketplace/aplicar/pedido",
    type: "website",
    images: [ogImageUrl("Publicar un pedido", "Marketplace")],
  },
};

export default function AplicarPedidoPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "Aplicar pedido", path: "/marketplace/aplicar/pedido" },
    ]),
  ];

  return (
    <MarketplaceShell>
      <JsonLd schema={schemas} />
      <header className="shell-section shell-section--lg">
        <div className="shell-inner shell-inner--narrow">
          <Link href="/marketplace?cara=demanda" className="shell-link">
            ← Marketplace
          </Link>
          <h1 className="shell-title">Publicar pedido</h1>
          <p className="shell-lead">
            Invertirías, necesitás un producto, buscás cofounder o tenés un desafío
            de empresa. El email real no se publica.
          </p>
        </div>
      </header>
      <section className="shell-section shell-section--soft">
        <div className="shell-inner shell-inner--narrow">
          <PedidoApplyForm />
        </div>
      </section>
    </MarketplaceShell>
  );
}
