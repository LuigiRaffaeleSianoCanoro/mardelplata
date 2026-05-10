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

// Sin hero-bg (gradient azul brillante del hero del miembro) — el
// body ya define bg-[#06070d] coherente con el resto del landing.
export default function ProyectosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Padding lateral coherente con el resto del landing + padding-top
          para no quedar tapado por el Navbar pill (position fixed, ~70px
          desde top). */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-20">{children}</div>
      <Footer />
    </div>
  );
}
