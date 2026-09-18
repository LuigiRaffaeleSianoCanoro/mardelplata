import Link from "next/link";

type Face = "oferta" | "demanda";

export default function MarketplaceTabs({ active }: { active: Face }) {
  return (
    <div className="bolsa-x-filter" role="tablist" aria-label="Cara del marketplace">
      <Link
        href="/marketplace"
        role="tab"
        aria-selected={active === "oferta"}
        className={`bolsa-x-pill ${active === "oferta" ? "is-active" : ""}`}
      >
        Oferta · Startups
      </Link>
      <Link
        href="/marketplace?cara=demanda"
        role="tab"
        aria-selected={active === "demanda"}
        className={`bolsa-x-pill ${active === "demanda" ? "is-active" : ""}`}
      >
        Demanda · Pedidos
      </Link>
    </div>
  );
}
