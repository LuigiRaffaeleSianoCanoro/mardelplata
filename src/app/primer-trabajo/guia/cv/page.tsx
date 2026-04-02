import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuiaSubnav from "@/components/primer-trabajo/GuiaSubnav";
import PatternGuideList from "@/components/primer-trabajo/PatternGuideList";
import patternsCv from "@/content/primer-trabajo/patterns-cv.json";
import type { GuideBundle } from "@/lib/primer-trabajo/guideTypes";

const bundle = patternsCv as GuideBundle;

export const metadata: Metadata = {
  title: "Guía CV (PDF) — Primer Trabajo OS — Mar del Plata Devs",
  description:
    "Patrones concretos de CV para primer trabajo en tech: ejemplos malo/bien, cómo te lee quien selecciona en Argentina y pasos para mejorar el PDF antes de postular.",
};

export default function GuiaCvPage() {
  return (
    <>
      <Navbar />
      <main className="ocean-tint min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/primer-trabajo" className="text-sm text-ocean-600 font-medium hover:underline mb-4 inline-block">
            ← Primer Trabajo OS
          </Link>
          <GuiaSubnav />
          <PatternGuideList bundle={bundle} />
          <p className="mt-10 text-center">
            <Link href="/primer-trabajo/diagnostico" className="text-ocean-600 font-semibold text-sm hover:underline">
              Hacé el diagnóstico para ver tu probabilidad y reglas activas →
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
