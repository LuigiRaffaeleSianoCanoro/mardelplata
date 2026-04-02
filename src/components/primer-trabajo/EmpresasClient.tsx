"use client";

import { useMemo, useState } from "react";
import empresas from "@/content/primer-trabajo/empresas.json";

type Company = (typeof empresas.companies)[number];

const empresasRoot = empresas as typeof empresas & { disclaimer?: string };

function companySearchBlob(c: Company): string {
  const parts = [
    c.name,
    c.notes,
    c.description,
    c.modalidad,
    c.contactHint,
    c.type,
    c.tags?.join(" "),
    ...(c.howToApply ?? []),
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function formatTagLabel(tag: string): string {
  return tag.replace(/_/g, " ");
}

export default function EmpresasClient() {
  const [city, setCity] = useState<string>("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return empresas.companies.filter((c: Company) => {
      if (city && c.city !== city) return false;
      if (q) {
        if (!companySearchBlob(c).includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [city, q]);

  const cities = useMemo(() => {
    const s = new Set(empresas.companies.map((c: Company) => c.city));
    return [...s].sort();
  }, []);

  return (
    <div className="space-y-6">
      {empresasRoot.disclaimer ? (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 leading-relaxed">
          {empresasRoot.disclaimer}
        </p>
      ) : null}
      <p className="text-slate-600 text-sm leading-relaxed">
        Complementá con el checklist de mercado del plan de acción.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Buscar por nombre o nota…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 outline-none"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-ocean-400 outline-none bg-white"
        >
          <option value="">Todas las ciudades</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {filtered.map((c: Company) => (
          <li key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-display font-bold text-ocean-900">{c.name}</h3>
              <span className="text-xs font-medium text-slate-500">{c.type}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {c.city}
              {c.modalidad ? (
                <span className="text-slate-500"> · {c.modalidad}</span>
              ) : null}
            </p>
            {c.description ? (
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">{c.description}</p>
            ) : null}
            {c.careersUrl ? (
              <a
                href={c.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-semibold text-ocean-600 hover:underline"
              >
                Careers / web →
              </a>
            ) : null}
            {c.contactHint ? <p className="text-sm text-slate-600 mt-2">{c.contactHint}</p> : null}
            <p className="text-sm text-slate-700 mt-2 leading-relaxed">{c.notes}</p>
            {c.howToApply?.length ? (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Cómo acercarte</p>
                <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1 leading-relaxed">
                  {c.howToApply.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {c.tags?.length ? (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.tags.map((t) => (
                  <span key={t} className="text-[11px] uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {formatTagLabel(t)}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
