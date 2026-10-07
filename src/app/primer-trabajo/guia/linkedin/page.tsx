import type { Metadata } from "next";
import Link from "next/link";
import GuiaSubnav from "@/components/primer-trabajo/GuiaSubnav";
import PatternGuideList from "@/components/primer-trabajo/PatternGuideList";
import patternsLinkedin from "@/content/primer-trabajo/patterns-linkedin.json";
import type { GuideBundle } from "@/lib/primer-trabajo/guideTypes";
import { PageFrame } from "@/components/v3/Page";

const bundle = patternsLinkedin as GuideBundle;

export const metadata: Metadata = {
  title: "Guía LinkedIn — Primer Trabajo OS — Mar del Plata Devs",
  description:
    "Patrones de perfil de LinkedIn para candidatos tech: titular, resumen, experiencia y coherencia con el CV, con la mirada de quien filtra candidatos en minutos.",
};

export default function GuiaLinkedinPage() {
  return (
    <PageFrame>
      
      <div className="pt-2 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/primer-trabajo" className="mb-4 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline">
            ← Primer Trabajo OS
          </Link>
          <GuiaSubnav />
          <PatternGuideList bundle={bundle} />
          <p className="mt-10 text-center">
            <Link href="/primer-trabajo/plan" className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline">
              Ir al plan de acción con checklist →
            </Link>
          </p>
        </div>
      </div>
      
    </PageFrame>
  );

}
