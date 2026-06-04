"use client";

import { useMemo, useState } from "react";
import type { CafeWithScore } from "@/lib/types/cafes";
import CafeCard from "./CafeCard";

interface Props {
  initialCafes: CafeWithScore[];
}

export default function CafesClient({ initialCafes }: Props) {
  const [cafes] = useState<CafeWithScore[]>(initialCafes);
  const [hood, setHood] = useState<string>("all");
  const [onlyWifi, setOnlyWifi] = useState(false);

  const hoods = useMemo(() => {
    const set = new Set<string>();
    for (const c of cafes) if (c.neighborhood) set.add(c.neighborhood);
    return Array.from(set).sort();
  }, [cafes]);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      if (hood !== "all" && c.neighborhood !== hood) return false;
      if (onlyWifi && c.score.wifi_count === 0) return false;
      return true;
    });
  }, [cafes, hood, onlyWifi]);

  return (
    <div className="shell-section">
      <div className="shell-inner">
        <header className="cafes-x-header">
          <div>
            <p className="shell-eyebrow">CAFÉS · NÓMADES</p>
            <h1 className="shell-title">Cafés para <em>trabajar.</em></h1>
            <p className="shell-lead" style={{ marginTop: "0.6rem" }}>
              Recomendaciones de la comunidad: dónde hay buen WiFi, enchufes y lugar para abrir la laptop en Mar del Plata.
            </p>
          </div>
          <div className="cafes-x-filter">
            <select
              aria-label="Filtrar por barrio"
              className="cafes-x-select"
              value={hood}
              onChange={(e) => setHood(e.target.value)}
            >
              <option value="all">Todos los barrios</option>
              {hoods.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <label className="cafes-x-toggle">
              <input
                type="checkbox"
                checked={onlyWifi}
                onChange={(e) => setOnlyWifi(e.target.checked)}
              />
              Con WiFi confirmado
            </label>
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="cafes-x-empty">
            Todavía no hay cafés cargados. ¡Sé el primero en recomendar uno!
          </p>
        ) : (
          <div className="cafes-x-grid">
            {filtered.map((c) => (
              <CafeCard
                key={c.id}
                cafe={c}
                myVote={null}
                canVote={false}
                onOpen={() => {
                  window.location.href = `/cafes/${c.id}`;
                }}
                onVote={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
