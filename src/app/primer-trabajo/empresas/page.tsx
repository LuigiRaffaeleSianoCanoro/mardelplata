import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmpresasClient from "@/components/primer-trabajo/EmpresasClient";

export default function EmpresasPage() {
  return (
    <>
      <Navbar />
      <main className="ocean-tint min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/primer-trabajo" className="text-sm text-ocean-600 font-medium hover:underline mb-6 inline-block">
            ← Primer Trabajo OS
          </Link>
          <h1 className="font-display font-bold text-3xl text-ocean-900 mb-2">Empresas</h1>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Referencias para investigar y contactar (con y sin avisos publicados). Sumá datos reales vía PR.
          </p>
          <EmpresasClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
