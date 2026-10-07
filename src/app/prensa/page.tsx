import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame, PageHero, PageSection } from "@/components/v3/Page";
import PressCard from "@/components/prensa/PressCard";
import ArchiveNotice from "@/components/prensa/ArchiveNotice";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import {
  getAllPressItems,
  getPressEventTags,
  hasArchive,
} from "@/content/prensa";

export const metadata: Metadata = {
  title: "Prensa e histórico de la comunidad",
  description:
    "Archivo público de notas periodísticas sobre Mar del Plata Dev, sus eventos y alianzas. Cada clipping conserva enlace al original y copia de respaldo.",
  alternates: { canonical: "/prensa" },
  openGraph: {
    title: "Prensa e histórico — Mar del Plata Dev",
    description:
      "Notas de medios locales y gacetillas oficiales sobre la comunidad tech de Mar del Plata, con archivo de respaldo.",
    url: "/prensa",
    type: "website",
    images: [ogImageUrl("Prensa e histórico", "Archivo de la comunidad")],
  },
};

export default function PrensaPage() {
  const items = getAllPressItems();
  const topics = getPressEventTags();
  const archivedCount = items.filter((item) => hasArchive(item)).length;

  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Prensa", path: "/prensa" },
    ]),
  ];

  return (
    <PageFrame>
      <JsonLd schema={schemas} />
      <PageHero
        eyebrow="Prensa · Histórico"
        title="Lo que dicen los medios"
        description="Archivo público de notas sobre la comunidad. Cada clipping enlaza al original y guarda una copia por si el medio la saca del aire."
      />

      <ArchiveNotice />

      <div className="mb-8 flex flex-wrap gap-2" aria-label="Temas">
        {topics.map(({ tag, label, count }) => (
          <a
            key={tag}
            href={`#tema-${tag}`}
            className="inline-flex h-8 items-center gap-2 rounded-full border bg-card/70 px-3 font-mono text-[11px] tracking-[0.04em] text-foreground hover:bg-card"
          >
            {label}
            <span className="text-muted-foreground">{count}</span>
          </a>
        ))}
      </div>

      {topics.map(({ tag, label }) => {
        const group = items.filter((item) => item.events.includes(tag));
        if (group.length === 0) return null;
        return (
          <PageSection key={tag} title={label} className="scroll-mt-20" >
            <div id={`tema-${tag}`} className="grid gap-3 sm:grid-cols-2">
              {group.map((item) => (
                <PressCard key={item.id} item={item} />
              ))}
            </div>
          </PageSection>
        );
      })}

      <p className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
        {items.length} clippings · {archivedCount} con archivo en el sitio ·{" "}
        <Link href="/" className="normal-case tracking-normal hover:text-foreground">
          Volver al inicio
        </Link>
      </p>
    </PageFrame>
  );
}
