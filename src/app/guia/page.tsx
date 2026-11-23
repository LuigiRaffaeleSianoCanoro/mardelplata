import type { Metadata } from "next";
import { PageHero } from "@/components/v3/Page";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { GUIA_REVISED } from "@/content/guia";
import {
  GUIA_PROSE,
  guiaBodyMarkdown,
  guiaMarkdownToHtml,
  readGuiaPortadaMarkdown,
} from "@/lib/guia";

export const metadata: Metadata = {
  title: "La guía tech definitiva de Mar del Plata",
  description:
    "El mapa del ecosistema tech de Mar del Plata, armado por mardelplata.dev.ar. Comunidades, calendario, coworkings, empresas y cómo aterrizar en la ciudad.",
  alternates: { canonical: "/guia" },
  openGraph: {
    title: "La guía tech definitiva de Mar del Plata - mardelplata.dev.ar",
    description:
      "Comunidades, calendario, coworkings y el mapa del polo tech de la costa.",
    url: "/guia",
    type: "website",
    images: [ogImageUrl("La guía tech de Mar del Plata", "El mapa del ecosistema")],
  },
};

export default function GuiaPortadaPage() {
  const html = guiaMarkdownToHtml(guiaBodyMarkdown(readGuiaPortadaMarkdown()));
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Guía tech", path: "/guia" },
    ]),
  ];

  return (
    <>
      <JsonLd schema={schemas} />
      <PageHero
        eyebrow="mardelplata.dev.ar"
        title="La guía tech definitiva de Mar del Plata"
        description="Si llegás a la ciudad, si querés meterte en tech o si ya estás y te falta el mapa, esta guía es para eso. Cada dato tiene fuente. Si no la tiene, no está."
      />
      <div className={GUIA_PROSE} dangerouslySetInnerHTML={{ __html: html }} />
      <p className="mt-10 max-w-3xl font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase">
        Última revisión {GUIA_REVISED} · mardelplata.dev.ar
      </p>
    </>
  );
}
