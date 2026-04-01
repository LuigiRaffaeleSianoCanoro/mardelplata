type MissionCalloutProps = {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  disclaimer: string;
};

export default function MissionCallout({ title, body, href, linkLabel, disclaimer }: MissionCalloutProps) {
  return (
    <div className="mb-6 rounded-xl border-2 border-ocean-400 bg-ocean-50/90 p-4 md:p-5 space-y-3">
      <p className="text-sm font-semibold text-ocean-950">{title}</p>
      <p className="text-sm text-slate-800 leading-relaxed">{body}</p>
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
