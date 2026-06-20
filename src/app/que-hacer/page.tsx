import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import Faq from "@/components/nomad/Faq";
import { breadcrumbSchema, faqPageSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { ogImageUrl } from "@/lib/seo/site";
import { activities } from "@/content/nomad";

const QUE_HACER_FAQ = [
  {
    question: "¿Qué hacer en Mar del Plata cuando trabajás remoto?",
    answer:
      "Además de sus playas (Playa Grande, Varese, La Perla), Mar del Plata ofrece naturaleza muy cerca (Laguna y Sierra de los Padres, Bosque Peralta Ramos), una escena gastronómica fuerte en el barrio Güemes y el puerto, y cultura como el Museo MAR y la Villa Victoria Ocampo.",
  },
  {
    question: "¿Qué playas son las mejores en Mar del Plata?",
    answer:
      "Playa Grande es la más icónica, con zona gastronómica y spots de surf cerca. Playa Varese es una caleta protegida de agua más calma, y La Perla es amplia y céntrica.",
  },
];

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
    images: [ogImageUrl("Qué hacer en Mar del Plata", "Cuando cerrás la laptop")],
  },
};

export default function QueHacerPage() {
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Qué hacer", path: "/que-hacer" },
    ]),
    faqPageSchema(QUE_HACER_FAQ),
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

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow">
            <Reveal>
              <h2 className="shell-title">Preguntas frecuentes</h2>
              <div style={{ marginTop: "1.2rem" }}>
                <Faq items={QUE_HACER_FAQ} />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
