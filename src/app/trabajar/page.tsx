import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import SourceTag from "@/components/nomad/SourceTag";
import WorkSpotDirectory from "@/components/nomad/WorkSpotDirectory";
import SubmitWorkSpotForm from "@/components/nomad/SubmitWorkSpotForm";
import { breadcrumbSchema, itemListSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { workSpots, workSpotZonas } from "@/content/nomad";

export const metadata: Metadata = {
  title: "Dónde trabajar en Mar del Plata: cafés y coworkings",
  description:
    "Cafés work-friendly y espacios de coworking en Mar del Plata, con WiFi y lugar para quedarte a laburar. El mapa para nómades digitales y remote workers de la costa.",
  alternates: { canonical: "/trabajar" },
  openGraph: {
    title: "Dónde trabajar en Mar del Plata — MdPDev",
    description:
      "Cafés work-friendly y coworkings con WiFi para nómades digitales y remote workers.",
    url: "/trabajar",
    type: "website",
    images: [ogImageUrl("Dónde trabajar en Mar del Plata", "Cafés y coworkings work-friendly")],
  },
};

export default function TrabajarPage() {
  const zonas = workSpotZonas();
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Trabajar", path: "/trabajar" },
    ]),
    itemListSchema(workSpots.spots.map((s) => ({ name: s.name, path: `/trabajar/${s.slug}` }))),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="trabajar-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">ABRÍ LA LAPTOP DONDE QUIERAS</p>
            <h1 className="shell-title shell-title--xl">
              Dónde trabajar en la <em>costa.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {workSpots.intro}
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            <Reveal>
              <WorkSpotDirectory spots={workSpots.spots} zonas={zonas} />
            </Reveal>
            <div style={{ marginTop: "1.6rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {workSpots.sources.map((s) => (
                <SourceTag key={s.url} source={s.label} url={s.url} asOf={workSpots.updatedAt} />
              ))}
            </div>
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: "1.4rem" }}>
                <h2 className="shell-title">¿Conocés un lugar que falta?</h2>
                <p className="shell-lead" style={{ marginInline: "auto" }}>
                  Este mapa lo construye la comunidad. Sugerí tu café o coworking favorito y, si suma,
                  lo agregamos.
                </p>
              </div>
              <SubmitWorkSpotForm />
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
