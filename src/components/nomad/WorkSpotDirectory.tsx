"use client";

// Directorio de cafés/coworkings con filtros (tipo, zona, búsqueda). Isla
// cliente: recibe la data server-side y filtra en memoria.
// Ver docs/nomad-it-hub/02-feature-plan.md §F3.

import { useMemo, useState } from "react";
import Link from "next/link";
import type { WorkSpot, WorkSpotKind } from "@/content/nomad";

interface WorkSpotDirectoryProps {
  spots: WorkSpot[];
  zonas: string[];
}

const KIND_LABELS: Record<WorkSpotKind, string> = {
  cafe: "Café",
  coworking: "Coworking",
};

export default function WorkSpotDirectory({ spots, zonas }: WorkSpotDirectoryProps) {
  const [kind, setKind] = useState<WorkSpotKind | null>(null);
  const [zona, setZona] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return spots.filter((s) => {
      if (kind && s.kind !== kind) return false;
      if (zona && s.zona !== zona) return false;
      if (q && !`${s.name} ${s.address ?? ""} ${s.zona ?? ""} ${s.amenities.join(" ")}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [spots, kind, zona, query]);

  return (
    <div>
      <div className="bolsa-x-filter" style={{ marginBottom: "0.75rem" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar lugar…"
          aria-label="Buscar lugar"
          className="bolsa-x-pill"
          style={{ minWidth: 200 }}
        />
        <button
          type="button"
          className={`bolsa-x-pill ${kind === null ? "is-active" : ""}`}
          onClick={() => setKind(null)}
        >
          Todos
        </button>
        <button
          type="button"
          className={`bolsa-x-pill ${kind === "cafe" ? "is-active" : ""}`}
          onClick={() => setKind(kind === "cafe" ? null : "cafe")}
        >
          Cafés
        </button>
        <button
          type="button"
          className={`bolsa-x-pill ${kind === "coworking" ? "is-active" : ""}`}
          onClick={() => setKind(kind === "coworking" ? null : "coworking")}
        >
          Coworkings
        </button>
      </div>

      <div className="bolsa-x-filter" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`bolsa-x-pill ${zona === null ? "is-active" : ""}`}
          onClick={() => setZona(null)}
        >
          Toda la ciudad
        </button>
        {zonas.map((z) => (
          <button
            key={z}
            type="button"
            className={`bolsa-x-pill ${zona === z ? "is-active" : ""}`}
            onClick={() => setZona(zona === z ? null : z)}
          >
            {z}
          </button>
        ))}
      </div>

      <p className="shell-card__meta" style={{ marginBottom: "1rem" }}>
        {filtered.length} {filtered.length === 1 ? "lugar" : "lugares"}
      </p>

      {filtered.length === 0 ? (
        <p className="bolsa-x-empty">No hay lugares con esos filtros todavía.</p>
      ) : (
        <div className="shell-grid shell-grid--auto-280">
          {filtered.map((s) => (
            <Link key={s.slug} href={`/trabajar/${s.slug}`} className="shell-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                <h3 className="shell-card__title">{s.name}</h3>
                <span className={`shell-tag ${s.kind === "coworking" ? "shell-tag--cyan" : "shell-tag--amber"}`}>
                  {KIND_LABELS[s.kind]}
                </span>
              </div>
              {(s.address || s.zona) && (
                <p className="shell-card__meta">
                  {[s.address, s.zona].filter(Boolean).join(" · ")}
                </p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.2rem" }}>
                {s.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="shell-tag shell-tag--violet">
                    {a}
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
