import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HrInterviewQuizClient from "@/components/primer-trabajo/HrInterviewQuizClient";

export default function EntrevistaHrPage() {
  return (
    <>
      <Navbar />
      <main className="ocean-tint min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-ocean-700 text-sm font-semibold uppercase tracking-widest mb-3">Primer Trabajo OS</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-ocean-900 leading-tight mb-3">Simulador HR</h1>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            Preguntas tipo screening / HR con feedback inmediato. El puntaje se guarda en el navegador y actualiza la señal de entrevista en el diagnóstico principal.
          </p>
          <HrInterviewQuizClient />
          <p className="mt-10 text-center text-slate-500 text-sm">
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
