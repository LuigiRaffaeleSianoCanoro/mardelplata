// Card de métrica del hub: valor grande + label + detalle + fuente.
// Server component. Ver docs/nomad-it-hub/03-redesign.md §4.2.

import SourceTag from "./SourceTag";

interface StatCardProps {
  value: string;
  label: string;
  detail?: string;
  source: string;
  asOf?: string;
  sourceUrl?: string;
}

export default function StatCard({
  value,
  label,
  detail,
  source,
  asOf,
  sourceUrl,
}: StatCardProps) {
  return (
    <div className="shell-card">
      <span
        className="gradient-text"
        style={{
          fontFamily: "var(--shell-font-display, var(--font-space-grotesk))",
          fontSize: "2.4rem",
          fontWeight: 700,
          lineHeight: 1.05,
        }}
      >
        {value}
      </span>
      <span className="shell-card__title">{label}</span>
      {detail && <p className="shell-card__desc">{detail}</p>}
      <SourceTag source={source} asOf={asOf} url={sourceUrl} />
    </div>
  );
}
