"use client";

// Directorio de empresas con filtros (sector, exporta, búsqueda). Isla cliente:
// recibe la data ya cargada server-side y filtra en memoria.
// Ver docs/nomad-it-hub/02-feature-plan.md §F1.

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Company } from "@/content/nomad";

interface CompanyDirectoryProps {
  companies: Company[];
  sectors: string[];
}

export default function CompanyDirectory({ companies, sectors }: CompanyDirectoryProps) {
  const [sector, setSector] = useState<string | null>(null);
  const [onlyExports, setOnlyExports] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      if (sector && !c.sectors.includes(sector)) return false;
      if (onlyExports && !c.exports) return false;
      if (q && !`${c.name} ${c.tagline} ${c.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [companies, sector, onlyExports, query]);

  return (
    <div>
      <div className="bolsa-x-filter" style={{ marginBottom: "1rem" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar empresa…"
          aria-label="Buscar empresa"
          className="bolsa-x-pill"
          style={{ minWidth: 200 }}
        />
        <button
          type="button"
          className={`bolsa-x-pill ${sector === null ? "is-active" : ""}`}
          onClick={() => setSector(null)}
        >
          Todos
        </button>
        {sectors.map((s) => (
          <button
            key={s}
            type="button"
            className={`bolsa-x-pill ${sector === s ? "is-active" : ""}`}
            onClick={() => setSector(sector === s ? null : s)}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          className={`bolsa-x-pill ${onlyExports ? "is-active" : ""}`}
          onClick={() => setOnlyExports((v) => !v)}
        >
          Exporta servicios
        </button>
      </div>

      <p className="shell-card__meta" style={{ marginBottom: "1rem" }}>
        {filtered.length} {filtered.length === 1 ? "empresa" : "empresas"}
      </p>

      {filtered.length === 0 ? (
        <p className="bolsa-x-empty">No hay empresas con esos filtros todavía.</p>
      ) : (
        <div className="shell-grid shell-grid--auto-280">
          {filtered.map((c) => (
            <Link key={c.slug} href={`/empresas/${c.slug}`} className="shell-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                <h3 className="shell-card__title">{c.name}</h3>
                {c.exports && <span className="shell-tag shell-tag--emerald">Exporta</span>}
              </div>
              <p className="shell-card__desc">{c.tagline}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.2rem" }}>
                {c.sectors.map((s) => (
                  <span key={s} className="shell-tag shell-tag--violet">
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
