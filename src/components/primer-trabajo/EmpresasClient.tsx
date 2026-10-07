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
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100">
          {empresasRoot.disclaimer}
        </p>
      ) : null}
      <p className="text-muted-foreground text-sm leading-relaxed">
        Complementá con el checklist de mercado del plan de acción.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Buscar por nombre o nota…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-border focus:ring-2 focus:ring-[var(--ring)]"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[var(--ring)]"
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
          <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-display font-bold text-foreground">{c.name}</h3>
              <span className="text-xs font-medium text-muted-foreground">{c.type}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {c.city}
              {c.modalidad ? (
                <span className="text-muted-foreground"> · {c.modalidad}</span>
              ) : null}
            </p>
            {c.description ? (
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.description}</p>
            ) : null}
            {c.careersUrl ? (
              <a
                href={c.careersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-semibold text-foreground hover:underline"
              >
                Careers / web →
              </a>
            ) : null}
            {c.contactHint ? <p className="text-sm text-muted-foreground mt-2">{c.contactHint}</p> : null}
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.notes}</p>
            {c.howToApply?.length ? (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Cómo acercarte</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 leading-relaxed">
                  {c.howToApply.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {c.tags?.length ? (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.tags.map((t) => (
                  <span key={t} className="text-[11px] uppercase tracking-wide rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
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
