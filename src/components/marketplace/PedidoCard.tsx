import Link from "next/link";
import { PEDIDO_KIND_LABELS } from "@/lib/marketplace";
import type { MarketplacePedidoPublic } from "@/lib/types/marketplace";

export default function PedidoCard({ pedido }: { pedido: MarketplacePedidoPublic }) {
  return (
    <Link href={`/marketplace/pedidos/${pedido.id}`} className="shell-card marketplace-card">
      <p className="shell-card__meta">{PEDIDO_KIND_LABELS[pedido.kind]}</p>
      <h3 className="shell-card__title">{pedido.title}</h3>
      <p className="shell-card__desc marketplace-clamp">{pedido.description}</p>
      <p className="shell-card__meta" style={{ marginTop: "0.6rem" }}>
        {pedido.publisher_display}
        {pedido.organization ? ` · ${pedido.organization}` : ""}
      </p>
    </Link>
  );
}
