import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/v3/Page";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { GUIA_PAGES, GUIA_REVISED, getGuiaPage, guiaPath } from "@/content/guia";
import { GUIA_PROSE, loadGuiaPage } from "@/lib/guia";

type Params = { slug: string };

export function generateStaticParams() {
  return GUIA_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuiaPage(slug);
  if (!page) return {};
  const path = guiaPath(page.slug);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${page.title} - mardelplata.dev.ar`,
      description: page.description,
      url: path,
      type: "website",
      images: [ogImageUrl(page.title, "Guía tech de Mar del Plata")],
    },
  };
}

export default async function GuiaSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const loaded = loadGuiaPage(slug);
  if (!loaded) notFound();
  const { meta, html } = loaded;
  const path = guiaPath(meta.slug);
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Guía tech", path: "/guia" },
      { name: meta.navLabel, path },
    ]),
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <PageHero eyebrow={meta.eyebrow} title={meta.title} description={meta.description} />
      <div className={GUIA_PROSE} dangerouslySetInnerHTML={{ __html: html }} />
      <p className="mt-10 max-w-3xl font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase">
        Última revisión {GUIA_REVISED} · mardelplata.dev.ar
      </p>
    </>
  );
}
