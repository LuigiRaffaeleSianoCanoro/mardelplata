import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanClient from "@/components/primer-trabajo/PlanClient";

export default function PlanPage() {
  return (
    <>
      <Navbar />
      <main className="ocean-tint min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/primer-trabajo" className="text-sm text-ocean-600 font-medium hover:underline mb-6 inline-block">
            ← Primer Trabajo OS
          </Link>
          <h1 className="font-display font-bold text-3xl text-ocean-900 mb-2">Plan de acción</h1>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Tildá lo que ya hiciste. Expandí cada ítem para ver mal vs bien y el rewrite.             Más abajo tenés acceso directo a las{" "}
            <Link href="/primer-trabajo/guia/cv" className="text-ocean-600 font-medium hover:underline">
              guía CV
            </Link>{" "}
            y{" "}
            <Link href="/primer-trabajo/guia/linkedin" className="text-ocean-600 font-medium hover:underline">
              guía LinkedIn
            </Link>
            . Todo queda guardado en tu navegador.
          </p>
          <PlanClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
