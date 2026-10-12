import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame, PageHero } from "@/components/v3/Page";
import { Button } from "@/components/shadcn/button";
import { readCodeOfConductBodyMarkdown } from "@/content/codigo-de-conducta";
import { markdownToHtml } from "@/lib/prensa/markdown";

const REPORT_EMAIL = "mardevplata@gmail.com";

export const metadata: Metadata = {
  title: "Código de conducta — mardelplata.dev.ar",
  description:
    "Expectativas de convivencia, reportes y licencia CC BY 4.0 de la comunidad tech de Mar del Plata.",
  alternates: { canonical: "/codigo-de-conducta" },
};

const BODY_PROSE =
  "max-w-3xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:leading-relaxed [&_ul]:text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-medium [&_strong]:text-foreground";

export default function CodigoDeConductaPage() {
  const bodyHtml = markdownToHtml(readCodeOfConductBodyMarkdown());

  return (
    <PageFrame>
      <PageHero
        align="center"
        eyebrow="Comunidad"
        title={
          <>
            Código de conducta de{" "}
            <span className="text-foreground">mardelplata.dev.ar</span>
          </>
        }
        description="Un espacio para aprender, compartir y conocernos con respeto. Este documento explica qué esperamos, qué no toleramos y cómo reportar si algo sale mal."
      />

      <div className={BODY_PROSE} dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <div className="mt-12 max-w-3xl rounded-xl border bg-card/70 p-6 lg:p-8">
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Si te pasó algo, lo viste o tenés dudas, escribinos a{" "}
          <a href={`mailto:${REPORT_EMAIL}`} className="text-primary underline underline-offset-2">
            {REPORT_EMAIL}
          </a>
          . Tratamos cada reporte con confidencialidad.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href={`mailto:${REPORT_EMAIL}`}>Reportar por correo</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/reglamento">Ver reglamento resumido</Link>
          </Button>
        </div>
      </div>

      <p className="mt-10 max-w-3xl font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase">
        Licencia Creative Commons Atribución 4.0 (CC BY 4.0) · mardelplata.dev.ar
      </p>
    </PageFrame>
  );
}
