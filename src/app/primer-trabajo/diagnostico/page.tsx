import Link from "next/link";
import DiagnosticoClient from "@/components/primer-trabajo/DiagnosticoClient";
import { PageFrame } from "@/components/v3/Page";

export default function DiagnosticoPage() {
  return (
    <PageFrame>
      
      <div className="pt-2 pb-8">
        <div className="max-w-2xl mx-auto px-6">
          <Link href="/primer-trabajo" className="mb-6 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline">
            ← Primer Trabajo OS
          </Link>
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">Diagnóstico</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Respondé con honestidad. Las consecuencias son lo que suele pasar en el mercado real, no aliento motivacional.
          </p>
          <DiagnosticoClient />
        </div>
      </div>
      
    </PageFrame>
  );

}
