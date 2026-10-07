type MissionCalloutProps = {
  title: string;
  explanation: string;
  checklist?: string[];
  badExample?: string;
  goodExample?: string;
  href: string;
  linkLabel: string;
  disclaimer: string;
};

export default function MissionCallout({
  title,
  explanation,
  checklist,
  badExample,
  goodExample,
  href,
  linkLabel,
  disclaimer,
}: MissionCalloutProps) {
  return (
    <div className="mb-6 space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{explanation}</p>
      {checklist && checklist.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Qué mirar</p>
          <ul className="list-disc list-inside text-sm text-foreground space-y-1">
            {checklist.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {badExample ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-semibold text-foreground mb-1">Ejemplo malo</p>
          <p className="text-muted-foreground whitespace-pre-line">{badExample}</p>
        </div>
      ) : null}
      {goodExample ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
          <p className="font-semibold text-emerald-100 mb-1">Ejemplo bueno</p>
          <p className="text-emerald-100 whitespace-pre-line">{goodExample}</p>
        </div>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        {linkLabel}
      </a>
      <p className="text-xs text-muted-foreground leading-relaxed">{disclaimer}</p>
    </div>
  );
}
