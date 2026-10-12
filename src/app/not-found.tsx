import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { PiedraRoot } from "@/components/v3/Chrome";

export const metadata = {
  title: "404",
  description: "Esta coordenada no existe en la carta.",
};

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-6 py-20 text-foreground">
      <PiedraRoot page />
      <div className="relative z-10 w-full max-w-xl">
        <p className="mb-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground">
          <Compass size={11} className="text-[var(--oxido)]" />
          lat — · lng —
        </p>

        <p className="mb-2 font-mono text-[7rem] leading-none tracking-[-0.04em] text-[var(--oxido)] sm:text-[9rem]">
          404
        </p>

        <h1 className="mb-4 text-3xl font-semibold leading-[1.05] tracking-[-0.01em] text-foreground sm:text-4xl">
          Esta coordenada no figura en la carta.
        </h1>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          El link te trajo a un punto que no existe — o que ya navegamos lejos. Volvé al puerto y
          arrancamos otra vez.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-[13px] font-medium text-background"
          >
            <ArrowLeft size={14} /> Volver al puerto
          </Link>
          <Link
            href="/red"
            className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-[13px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            o explorar la red
          </Link>
        </div>
      </div>
    </div>
  );
}
