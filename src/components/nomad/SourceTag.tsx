// Microcomponente de credibilidad: "Fuente: X · fecha". Obligatorio junto a
// cualquier métrica del hub (regla .cursor/rules/40-nomad-hub-content.mdc).

interface SourceTagProps {
  source: string;
  asOf?: string;
  url?: string;
}

export default function SourceTag({ source, asOf, url }: SourceTagProps) {
  const label = `Fuente: ${source}${asOf ? ` · ${asOf}` : ""}`;
  return (
    <span className="shell-card__meta" style={{ display: "inline-block" }}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 2 }}
        >
          {label}
        </a>
      ) : (
        label
      )}
    </span>
  );
}
