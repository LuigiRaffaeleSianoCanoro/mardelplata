import type { ReactNode } from "react";
import AppShell from "@/components/app/AppShell";

// Las páginas de /red sincronizan el sheet abierto con la URL via
// useSearchParams (?p=, ?m=, ?i=). Eso fuerza el bailout del prerender
// estático. Marcamos toda la sección como dinámica en lugar de envolver
// cada página en un <Suspense>.
export const dynamic = "force-dynamic";

export default function RedLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
