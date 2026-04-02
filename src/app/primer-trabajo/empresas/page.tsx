import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmpresasClient from "@/components/primer-trabajo/EmpresasClient";

export const metadata: Metadata = {
  title: "Empresas — Primer Trabajo OS — Mar del Plata Devs",
  description:
    "Directorio de referencia de empresas tech en Mar del Plata y remotas en Argentina: enlaces para investigar, verificar avisos y preparar contacto. Los datos los mantiene la comunidad con PRs al repositorio.",
};

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
            Punto de partida para investigar y contactar empresas (con o sin aviso publicado). Cada ficha enlaza a web o careers: entrá,
            confirmá si buscan perfiles de primer trabajo y qué canal usan. Si algo cambió o falta una empresa, mandá un PR al archivo{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">empresas.json</code> con datos verificables.
          </p>
          <EmpresasClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
