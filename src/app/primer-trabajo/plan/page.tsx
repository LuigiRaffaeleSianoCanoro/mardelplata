import Link from "next/link";
import PlanClient from "@/components/primer-trabajo/PlanClient";
import { PageFrame } from "@/components/v3/Page";

export default function PlanPage() {
  return (
    <PageFrame>
      
      <div className="pt-2 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/primer-trabajo" className="mb-6 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline">
            ← Primer Trabajo OS
          </Link>
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">Plan de acción</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Tildá lo que ya hiciste. Expandí cada ítem para ver mal vs bien y el rewrite.             Más abajo tenés acceso directo a las{" "}
            <Link href="/primer-trabajo/guia/cv" className="font-medium text-muted-foreground hover:text-foreground hover:underline">
              guía CV
            </Link>{" "}
            y{" "}
            <Link href="/primer-trabajo/guia/linkedin" className="font-medium text-muted-foreground hover:text-foreground hover:underline">
              guía LinkedIn
            </Link>
            . Todo queda guardado en tu navegador.
          </p>
          <PlanClient />
        </div>
      </div>
      
    </PageFrame>
  );

}
