import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrimerTrabajoPage() {
  return (
    <>
      <Navbar />
      <main className="ocean-tint min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-ocean-700 text-sm font-semibold uppercase tracking-widest mb-3">Herramienta MdPDev</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-ocean-900 leading-tight mb-4">Primer Trabajo OS</h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            No es un curso: es un sistema para evaluar cómo te ven los recruiters en Argentina y qué corregir primero. Tono directo,
            foco en CV, LinkedIn, portfolio, búsqueda y mercado local.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            <Link
              href="/primer-trabajo/diagnostico"
              className="group rounded-2xl border-2 border-ocean-400 bg-white p-6 shadow-sm hover:shadow-md hover:border-ocean-500 transition-all"
            >
              <span className="text-2xl mb-2 block" aria-hidden>
                🔍
              </span>
              <h2 className="font-display font-bold text-ocean-900 text-lg mb-1 group-hover:text-ocean-700">Diagnóstico</h2>
              <p className="text-sm text-slate-600">Preguntas con misiones (Silver Dev, EF SET, GitHub, FCC, portfolio, outreach, LeetCode), reglas duras y modo recruiter.</p>
            </Link>
            <Link
              href="/primer-trabajo/entrevista-hr"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-ocean-300 transition-all"
            >
              <span className="text-2xl mb-2 block" aria-hidden>
                🎤
              </span>
              <h2 className="font-display font-bold text-ocean-900 text-lg mb-1 group-hover:text-ocean-700">Simulador HR</h2>
              <p className="text-sm text-slate-600">Preguntas tipo screening con feedback; el puntaje actualiza la señal de entrevista en el diagnóstico.</p>
            </Link>
            <Link
              href="/primer-trabajo/plan"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-ocean-300 transition-all"
            >
              <span className="text-2xl mb-2 block" aria-hidden>
                ✅
              </span>
              <h2 className="font-display font-bold text-ocean-900 text-lg mb-1 group-hover:text-ocean-700">Plan de acción</h2>
              <p className="text-sm text-slate-600">Checklist con mal/bien, rewrites y foco semanal. Progreso guardado en el navegador.</p>
            </Link>
            <Link
              href="/primer-trabajo/guia/cv"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-ocean-300 transition-all"
            >
              <span className="text-2xl mb-2 block" aria-hidden>
                📄
              </span>
              <h2 className="font-display font-bold text-ocean-900 text-lg mb-1 group-hover:text-ocean-700">Guía CV</h2>
              <p className="text-sm text-slate-600">Patrones mal/bien, mirada recruiter y pasos de rewrite enlazados a señales del diagnóstico.</p>
            </Link>
            <Link
              href="/primer-trabajo/guia/linkedin"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-ocean-300 transition-all"
            >
              <span className="text-2xl mb-2 block" aria-hidden>
                💼
              </span>
              <h2 className="font-display font-bold text-ocean-900 text-lg mb-1 group-hover:text-ocean-700">Guía LinkedIn</h2>
              <p className="text-sm text-slate-600">Headline, Acerca de, experiencia y coherencia con el CV — sin humo motivacional.</p>
            </Link>
            <Link
              href="/primer-trabajo/empresas"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-ocean-300 transition-all sm:col-span-2"
            >
              <span className="text-2xl mb-2 block" aria-hidden>
                📍
              </span>
              <h2 className="font-display font-bold text-ocean-900 text-lg mb-1 group-hover:text-ocean-700">Empresas (directorio)</h2>
              <p className="text-sm text-slate-600">Referencias MdP y nacionales; verificá avisos y sumá datos con PR al JSON.</p>
            </Link>
          </div>

          <p className="text-center text-slate-500 text-sm">
            <Link href="/" className="text-ocean-600 font-medium hover:underline">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
