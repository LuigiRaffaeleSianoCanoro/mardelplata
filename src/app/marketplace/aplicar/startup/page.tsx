import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";
import StartupApplyForm from "@/components/marketplace/StartupApplyForm";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Aplicar con tu startup",
  description:
    "Alta de startup para el Marketplace de MdPDev. Queda pendiente hasta que un admin la apruebe.",
  alternates: { canonical: "/marketplace/aplicar/startup" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Aplicar startup — MdPDev",
    description: "Formulario de alta. No se publica hasta la aprobación de Luigi / admin.",
    url: "/marketplace/aplicar/startup",
    type: "website",
    images: [ogImageUrl("Aplicar con tu startup", "Marketplace")],
  },
};

export default function AplicarStartupPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Marketplace", path: "/marketplace" },
      { name: "Aplicar startup", path: "/marketplace/aplicar/startup" },
    ]),
  ];

  return (
    <MarketplaceShell>
      <JsonLd schema={schemas} />
      <header className="shell-section shell-section--lg">
        <div className="shell-inner shell-inner--narrow">
          <Link href="/marketplace" className="shell-link">
            ← Marketplace
          </Link>
          <h1 className="shell-title">Publicar startup</h1>
          <p className="shell-lead">
            Completá la ficha. Entra como pendiente: no hay listado público hasta el
            OK de admin. Separado de la bolsa de empleo.
          </p>
        </div>
      </header>
      <section className="shell-section shell-section--soft">
        <div className="shell-inner shell-inner--narrow">
          <StartupApplyForm />
        </div>
      </section>
    </MarketplaceShell>
  );
}
