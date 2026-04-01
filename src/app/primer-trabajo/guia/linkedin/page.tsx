import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuiaSubnav from "@/components/primer-trabajo/GuiaSubnav";
import PatternGuideList from "@/components/primer-trabajo/PatternGuideList";
import patternsLinkedin from "@/content/primer-trabajo/patterns-linkedin.json";
import type { GuideBundle } from "@/lib/primer-trabajo/guideTypes";

const bundle = patternsLinkedin as GuideBundle;

export const metadata: Metadata = {
  title: "Guía LinkedIn — Primer Trabajo OS — MdPDev",
  description: "Patrones de LinkedIn: headline, Acerca de y coherencia con el CV, con mirada de recruiter.",
};

export default function GuiaLinkedinPage() {
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
            <Link href="/primer-trabajo/plan" className="text-ocean-600 font-semibold text-sm hover:underline">
              Ir al plan de acción con checklist →
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
