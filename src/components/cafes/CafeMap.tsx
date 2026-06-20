"use client";

// Mapa de cafés/coworkings con MapLibre GL. La librería (~pesada) se importa
// dinámicamente dentro del useEffect → sólo carga client-side y bajo demanda,
// no entra al bundle compartido ni al SSR. Tiles: OpenStreetMap raster (sin API
// key). Ver decisión de dependencia en ARCHITECTURE §20.

import { useEffect, useRef } from "react";
import type { Map as MlMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cafeSlug, type Cafe } from "@/lib/cafes";

interface CafeMapProps {
  cafes: Cafe[];
}

// Centro aproximado de Mar del Plata [lng, lat].
const MDP_CENTER: [number, number] = [-57.5426, -38.0055];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function CafeMap({ cafes }: CafeMapProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const withCoords = cafes.filter((c) => c.lat != null && c.lng != null);

  useEffect(() => {
    if (!ref.current || withCoords.length === 0) return;
    let map: MlMap | undefined;
    let cancelled = false;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !ref.current) return;

      map = new maplibregl.Map({
        container: ref.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: MDP_CENTER,
        zoom: 12.5,
      });
      map.addControl(new maplibregl.NavigationControl(), "top-right");

      for (const c of withCoords) {
        const popup = new maplibregl.Popup({ offset: 24 }).setHTML(
          `<strong>${escapeHtml(c.name)}</strong><br/><a href="/trabajar/${cafeSlug(c.name)}">Ver lugar →</a>`,
        );
        new maplibregl.Marker({ color: c.kind === "cowork" ? "#22d3ee" : "#a855f7" })
          .setLngLat([c.lng as number, c.lat as number])
          .setPopup(popup)
          .addTo(map);
      }
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (withCoords.length === 0) return null;

  return (
    <div
      ref={ref}
      className="cafe-map"
      style={{ width: "100%", height: 420, borderRadius: 14, overflow: "hidden" }}
      aria-label="Mapa de cafés y coworkings work-friendly en Mar del Plata"
      role="application"
    />
  );
}
