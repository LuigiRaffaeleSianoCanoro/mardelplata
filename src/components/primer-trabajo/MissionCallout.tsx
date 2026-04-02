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
    <div className="mb-6 rounded-xl border-2 border-ocean-400 bg-ocean-50/90 p-4 md:p-5 space-y-3">
      <p className="text-sm font-semibold text-ocean-950">{title}</p>
      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{explanation}</p>
      {checklist && checklist.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-ocean-900 uppercase tracking-wide mb-1.5">Qué mirar</p>
          <ul className="list-disc list-inside text-sm text-slate-800 space-y-1">
            {checklist.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {badExample ? (
        <div className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm">
          <p className="font-semibold text-slate-800 mb-1">Ejemplo malo</p>
          <p className="text-slate-700 whitespace-pre-line">{badExample}</p>
        </div>
      ) : null}
      {goodExample ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 text-sm">
          <p className="font-semibold text-emerald-950 mb-1">Ejemplo bueno</p>
          <p className="text-emerald-950/95 whitespace-pre-line">{goodExample}</p>
        </div>
      ) : null}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-xl bg-ocean-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-ocean-700 transition-colors"
      >
        {linkLabel}
      </a>
      <p className="text-xs text-slate-600 leading-relaxed">{disclaimer}</p>
    </div>
  );
}
