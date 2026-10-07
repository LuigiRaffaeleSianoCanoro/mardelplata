import type { Metadata } from "next";
import Link from "next/link";
import GuiaSubnav from "@/components/primer-trabajo/GuiaSubnav";
import PatternGuideList from "@/components/primer-trabajo/PatternGuideList";
import patternsCv from "@/content/primer-trabajo/patterns-cv.json";
import type { GuideBundle } from "@/lib/primer-trabajo/guideTypes";
import { PageFrame } from "@/components/v3/Page";

const bundle = patternsCv as GuideBundle;

export const metadata: Metadata = {
  title: "Guía CV (PDF) — Primer Trabajo OS — Mar del Plata Devs",
  description:
    "Patrones concretos de CV para primer trabajo en tech: ejemplos malo/bien, cómo te lee quien selecciona en Argentina y pasos para mejorar el PDF antes de postular.",
};

export default function GuiaCvPage() {
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
            <Link href="/primer-trabajo/diagnostico" className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline">
              Hacé el diagnóstico para ver tu probabilidad y reglas activas →
            </Link>
          </p>
        </div>
      </div>
      
    </PageFrame>
  );

}
