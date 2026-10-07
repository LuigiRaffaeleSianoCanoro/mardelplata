import BolsaClient from "@/components/bolsa/BolsaClient";
import { PageFrame, PageHero } from "@/components/v3/Page";

export default function BolsaPage() {
  return (
    <PageFrame className="max-w-[1100px]">
      <PageHero
        eyebrow="Empleos"
        title="Bolsa de trabajo"
        description="Búsquedas y clasificados de la comunidad. Publicá una oferta o encontrá tu próximo rol."
      />
      <BolsaClient />
    </PageFrame>
  );
}
