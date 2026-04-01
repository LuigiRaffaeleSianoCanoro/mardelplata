import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primer Trabajo OS — MdPDev",
  description:
    "Evaluación y plan de acción para conseguir tu primer trabajo en tech en Argentina: diagnóstico, señales de empleabilidad, checklist y mercado local.",
};

export default function PrimerTrabajoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
