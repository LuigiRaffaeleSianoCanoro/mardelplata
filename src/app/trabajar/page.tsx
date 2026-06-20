import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import CafeDirectory from "@/components/cafes/CafeDirectory";
import CafeSubmitForm from "@/components/cafes/CafeSubmitForm";
import { breadcrumbSchema, itemListSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { getCafes, cafeZonas, cafeSlug } from "@/lib/cafes";

// ISR: la data sale de Supabase (vista pública sin cookies). Revalida cada 10 min
// para reflejar votos y altas de la comunidad.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Dónde trabajar en Mar del Plata: cafés y coworkings",
  description:
    "Cafés work-friendly y espacios de coworking en Mar del Plata, con WiFi y enchufes verificados por la comunidad. El mapa para nómades digitales y remote workers de la costa.",
  alternates: { canonical: "/trabajar" },
  openGraph: {
    title: "Dónde trabajar en Mar del Plata — MdPDev",
    description:
      "Cafés work-friendly y coworkings con WiFi, verificados por la comunidad.",
    url: "/trabajar",
    type: "website",
    images: [ogImageUrl("Dónde trabajar en Mar del Plata", "Cafés y coworkings work-friendly")],
  },
};

export default async function TrabajarPage() {
  const cafes = await getCafes();
  const zonas = cafeZonas(cafes);

  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Trabajar", path: "/trabajar" },
    ]),
    itemListSchema(cafes.map((c) => ({ name: c.name, path: `/trabajar/${cafeSlug(c.name)}` }))),
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
              Cafés work-friendly y coworkings de Mar del Plata, con WiFi y enchufes verificados por
              la comunidad. ¿Trabajaste en uno? Sumá tu voto y ayudá a los que llegan.
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            {cafes.length === 0 ? (
              <p className="bolsa-x-empty">Estamos cargando los lugares. Volvé pronto.</p>
            ) : (
              <Reveal>
                <CafeDirectory cafes={cafes} zonas={zonas} />
              </Reveal>
            )}
          </div>
        </section>

        <section className="shell-section">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <CafeSubmitForm />
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
