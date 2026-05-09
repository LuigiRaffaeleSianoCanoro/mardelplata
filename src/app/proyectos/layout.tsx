import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// /proyectos vive con el chrome del landing (Navbar pill + Footer) en
// vez del AppShell autenticado de /red. Es la entrada publica para
// browseear lo que construye la red sin sentir que entras a "la app"
// (feedback Franco/Ariel). Los componentes adentro son los mismos que
// /red — solo cambia el envoltorio.

// useSearchParams (?p=slug) en ProjectsDirectory bailout-ea el
// prerender estatico, asi que marcamos la seccion como dinamica.
export const dynamic = "force-dynamic";

export default function ProyectosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen hero-bg flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
