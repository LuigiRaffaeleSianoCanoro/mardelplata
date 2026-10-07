import type { Metadata } from "next";
import Link from "next/link";
import EmpresasClient from "@/components/primer-trabajo/EmpresasClient";
import { PageFrame } from "@/components/v3/Page";

export const metadata: Metadata = {
  title: "Empresas — Primer Trabajo OS — Mar del Plata Devs",
  description:
    "Directorio de referencia de empresas tech en Mar del Plata y remotas en Argentina: enlaces para investigar y preparar contacto.",
};

export default function EmpresasPage() {
  return (
    <PageFrame>
      
      <div className="pt-2 pb-8">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/primer-trabajo" className="mb-6 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline">
            ← Primer Trabajo OS
          </Link>
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">Empresas</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Punto de partida para investigar y contactar empresas (con o sin aviso publicado). Cada ficha enlaza a web o careers.
          </p>
          <EmpresasClient />
        </div>
      </div>
      
    </PageFrame>
  );

}
