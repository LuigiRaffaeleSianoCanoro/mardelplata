import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

// 404 — la coordenada que pediste no existe en la carta náutica.
// Estética alineada al landing: gunmetal, sapphire, kicker, display-thin.

export const metadata = {
  title: "404 · mardelplata.dev",
  description: "Esta coordenada no existe en la carta.",
};

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#0A0A0F] text-white">
      <div className="max-w-xl w-full">
        <p className="kicker text-white/45 mb-3 flex items-center gap-2">
          <Compass size={11} className="text-[#FFB070]" />
          lat — · lng —
        </p>

        <p className="font-mono text-[7rem] sm:text-[9rem] leading-none mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-white/95 to-[#FF2DAA] tracking-[-0.04em]">
          404
        </p>

        <h1 className="display-thin text-white text-3xl sm:text-4xl leading-[1.05] tracking-[-0.01em] mb-4">
          Esta coordenada no figura en la carta.
        </h1>
        <p className="text-white/60 font-light leading-relaxed mb-8">
          El link te trajo a un punto que no existe — o que ya navegamos lejos. Volvé al puerto y
          arrancamos otra vez.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            className="btn-app-primary !text-[0.78rem] !py-2 !px-4 inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Volver al puerto
          </Link>
          <Link
            href="/red"
            className="px-3 py-2 rounded-full text-[0.78rem] text-white/65 hover:text-white border border-white/[0.08] hover:border-white/[0.16] transition-colors"
          >
            o explorar la red
          </Link>
        </div>
      </div>
    </main>
  );
}
