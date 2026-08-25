import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HrInterviewQuizClient from "@/components/primer-trabajo/HrInterviewQuizClient";

export const metadata: Metadata = {
  title: "HR Interview Simulator (English) — Primer Trabajo OS — Mar del Plata Devs",
  description:
    "English screening-style interview questions with immediate feedback. Score is saved in the browser and updates the interview-readiness signal in the main diagnostic.",
  alternates: { canonical: "/primer-trabajo/entrevista-hr-en" },
};

export default function EntrevistaHrEnPage() {
  return (
    <>
      <Navbar />
      <main className="ocean-tint min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-ocean-700 text-sm font-semibold uppercase tracking-widest mb-3">Primer Trabajo OS</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-ocean-900 leading-tight mb-3">
            Simulador HR en inglés
          </h1>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            Preguntas tipo screening en inglés con feedback inmediato. Después de cada respuesta ves modelos hablados en
            niveles A2, B1 y B2 para comparar. El puntaje se guarda en el navegador y actualiza la señal de entrevista en
            el diagnóstico principal.
          </p>
          <HrInterviewQuizClient variant="en" />
          <p className="mt-6 text-center text-slate-500 text-xs">Banco de preguntas de la comunidad.</p>
          <p className="mt-6 text-center text-slate-500 text-sm">
            <Link href="/primer-trabajo" className="text-ocean-600 font-medium hover:underline">
              ← Volver a Primer trabajo
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
