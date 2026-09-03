import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main className="prensa-x">
        <header className="prensa-x-header shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">PRENSA · HISTÓRICO</p>
            <h1 className="shell-title shell-title--xl">
              Lo que dicen los <em>medios.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              Archivo público de notas sobre la comunidad Mar del Plata Dev. Cada
              clipping enlaza al original y guarda una copia por si el medio la
              saca del aire.
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <ArchiveNotice />

            <div className="prensa-x-topics" aria-label="Temas">
              {topics.map(({ tag, label, count }) => (
                <a key={tag} href={`#tema-${tag}`} className="prensa-x-topic-pill">
                  {label}
                  <span className="prensa-x-topic-count">{count}</span>
                </a>
              ))}
            </div>

            {topics.map(({ tag, label }) => {
              const group = items.filter((item) => item.events.includes(tag));
              if (group.length === 0) return null;
              return (
                <section key={tag} id={`tema-${tag}`} className="prensa-x-group">
                  <h2 className="prensa-x-group-title">{label}</h2>
                  <div className="prensa-x-grid">
                    {group.map((item) => (
                      <PressCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}

            <footer className="prensa-x-stats">
              <span>
                {items.length} clippings · {archivedCount} con archivo en el sitio
              </span>
            </footer>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
