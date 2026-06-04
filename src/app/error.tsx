"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, AlertTriangle } from "lucide-react";

// Error boundary de la app — captura errores runtime de cualquier ruta hija
// y muestra un mensaje terminal-style sin perder la estética del sitio.

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // Solo en dev, para no spamear consola en producción.
      console.error("[mardelplata.dev.ar] route error:", error);
    }
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#0A0A0F] text-white">
      <div className="max-w-xl w-full">
        <p className="kicker text-white/45 mb-3 flex items-center gap-2">
          <AlertTriangle size={11} className="text-[#FF2DAA]" />
          falla — turbulencia en la ruta
        </p>

        <h1 className="display-thin text-white text-3xl sm:text-4xl leading-[1.05] tracking-[-0.01em] mb-4">
          Algo se rompió mientras dibujábamos esta vista.
        </h1>
        <p className="text-white/60 font-light leading-relaxed mb-6">
          El servidor no devolvió lo que esperábamos. Probá refrescar — si vuelve a pasar, escribinos.
        </p>

        {error.digest && (
          <p className="kicker text-white/35 mb-6">
            ref · <span className="font-mono text-white/55">{error.digest}</span>
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-app-primary !text-[0.78rem] !py-2 !px-4 inline-flex items-center gap-2"
          >
            <RotateCcw size={14} /> Reintentar
          </button>
          <Link
            href="/"
            className="px-3 py-2 rounded-full text-[0.78rem] text-white/65 hover:text-white border border-white/[0.08] hover:border-white/[0.16] inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={13} /> Volver al puerto
          </Link>
        </div>
      </div>
    </main>
  );
}
