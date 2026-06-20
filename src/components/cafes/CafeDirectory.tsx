"use client";

// Directorio de cafés/coworkings con filtros (tipo, zona, búsqueda). Isla
// cliente: recibe la data server-side (vista cafes_public) y filtra en memoria.

import { useMemo, useState } from "react";
import Link from "next/link";
import { cafeSlug, type Cafe, type CafeKind } from "@/lib/cafes";

interface CafeDirectoryProps {
  cafes: Cafe[];
  zonas: string[];
}

// Señales de amenities que la mayoría de los votantes confirmó.
function amenityTags(c: Cafe): string[] {
  if (c.votes_total === 0) return [];
  const tags: string[] = [];
  const half = c.votes_total / 2;
  if (c.wifi_yes >= half) tags.push("WiFi");
  if (c.power_yes >= half) tags.push("Enchufes");
  if (c.seating_yes >= half) tags.push("Buenos asientos");
  if (c.quiet_yes >= half) tags.push("Tranquilo");
  return tags;
}

export default function CafeDirectory({ cafes, zonas }: CafeDirectoryProps) {
  const [kind, setKind] = useState<CafeKind | null>(null);
  const [zona, setZona] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cafes.filter((c) => {
      if (kind && c.kind !== kind) return false;
      if (zona && c.neighborhood !== zona) return false;
      if (q && !`${c.name} ${c.address ?? ""} ${c.neighborhood ?? ""}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [cafes, kind, zona, query]);

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
        <button type="button" className={`bolsa-x-pill ${kind === null ? "is-active" : ""}`} onClick={() => setKind(null)}>
          Todos
        </button>
        <button type="button" className={`bolsa-x-pill ${kind === "cafe" ? "is-active" : ""}`} onClick={() => setKind(kind === "cafe" ? null : "cafe")}>
          Cafés
        </button>
        <button type="button" className={`bolsa-x-pill ${kind === "cowork" ? "is-active" : ""}`} onClick={() => setKind(kind === "cowork" ? null : "cowork")}>
          Coworkings
        </button>
      </div>

      <div className="bolsa-x-filter" style={{ marginBottom: "1rem" }}>
        <button type="button" className={`bolsa-x-pill ${zona === null ? "is-active" : ""}`} onClick={() => setZona(null)}>
          Toda la ciudad
        </button>
        {zonas.map((z) => (
          <button key={z} type="button" className={`bolsa-x-pill ${zona === z ? "is-active" : ""}`} onClick={() => setZona(zona === z ? null : z)}>
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
          {filtered.map((c) => {
            const tags = amenityTags(c);
            return (
              <Link key={c.id} href={`/trabajar/${cafeSlug(c.name)}`} className="shell-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                  <h3 className="shell-card__title">{c.name}</h3>
                  <span className={`shell-tag ${c.kind === "cowork" ? "shell-tag--cyan" : "shell-tag--amber"}`}>
                    {c.kind === "cowork" ? "Coworking" : "Café"}
                  </span>
                </div>
                {(c.address || c.neighborhood) && (
                  <p className="shell-card__meta">{[c.address, c.neighborhood].filter(Boolean).join(" · ")}</p>
                )}
                {tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.2rem" }}>
                    {tags.map((t) => (
                      <span key={t} className="shell-tag shell-tag--emerald">{t}</span>
                    ))}
                  </div>
                )}
                {c.votes_total > 0 && (
                  <span className="shell-card__meta">{c.votes_total} {c.votes_total === 1 ? "voto" : "votos"} de la comunidad</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
