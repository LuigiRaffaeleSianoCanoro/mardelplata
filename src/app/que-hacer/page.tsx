import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { activities } from "@/content/nomad";

export const metadata: Metadata = {
  title: "Qué hacer en Mar del Plata",
  description:
    "Playas, naturaleza, gastronomía y cultura en Mar del Plata. Qué hacer cuando cerrás la laptop, pensado para quien trabaja remoto desde la costa.",
  alternates: { canonical: "/que-hacer" },
  openGraph: {
    title: "Qué hacer en Mar del Plata — MdPDev",
    description:
      "Playas, naturaleza, gastronomía y cultura para quien vive y trabaja remoto desde la costa.",
    url: "/que-hacer",
    type: "website",
  },
};

export default function QueHacerPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Qué hacer", path: "/que-hacer" },
    ]),
  ];

  return (
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="que-hacer-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">CUANDO CERRÁS LA LAPTOP</p>
            <h1 className="shell-title shell-title--xl">
              Qué hacer en la <em>costa.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {activities.intro}
            </p>
          </div>
        </header>

        {activities.categories.map((cat, i) => (
          <section
            key={cat.title}
            className={`shell-section ${i % 2 === 0 ? "shell-section--soft" : ""}`}
          >
            <div className="shell-inner">
              <Reveal>
                <h2 className="shell-title">{cat.title}</h2>
                <div className="shell-grid shell-grid--auto-280" style={{ marginTop: "1.4rem" }}>
                  {cat.items.map((item) => (
                    <div key={item.name} className="shell-card">
                      <h3 className="shell-card__title">{item.name}</h3>
                      <p className="shell-card__desc">{item.description}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </main>
    </AppShell>
  );
}
