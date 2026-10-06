import type { Metadata } from "next";
import Link from "next/link";
import HrInterviewQuizClient from "@/components/primer-trabajo/HrInterviewQuizClient";
import { PageFrame } from "@/components/v3/Page";

export const metadata: Metadata = {
  title: "HR Interview Simulator (English) — Primer Trabajo OS — Mar del Plata Devs",
  description:
    "English screening-style interview questions with immediate feedback. Score is saved in the browser and updates the interview-readiness signal in the main diagnostic.",
  alternates: { canonical: "/primer-trabajo/entrevista-hr-en" },
};

export default function EntrevistaHrEnPage() {
  return (
    <PageFrame>
      
      <div className="pt-2 pb-8">
        <div className="max-w-2xl mx-auto px-6">
          <p className="mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Primer Trabajo OS</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground leading-tight mb-3">
            Simulador HR en inglés
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            Preguntas tipo screening en inglés con feedback inmediato. Después de cada respuesta ves modelos hablados en
            niveles A2, B1 y B2 para comparar. El puntaje se guarda en el navegador y actualiza la señal de entrevista en
            el diagnóstico principal.
          </p>
          <HrInterviewQuizClient variant="en" />
          <p className="mt-6 text-center text-muted-foreground text-xs">Banco de preguntas de la comunidad.</p>
          <p className="mt-6 text-center text-muted-foreground text-sm">
            <Link href="/primer-trabajo" className="font-medium text-muted-foreground hover:text-foreground hover:underline">
              ← Volver a Primer trabajo
            </Link>
          </p>
        </div>
      </div>
      
    </PageFrame>
  );

}
