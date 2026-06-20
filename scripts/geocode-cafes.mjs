// Utilidad one-off: geocodifica los cafés sin coordenadas usando Nominatim
// (OpenStreetMap, sin API key) y emite UPDATEs SQL por stdout.
//
// Uso:
//   node scripts/geocode-cafes.mjs > /tmp/updates.sql
// Luego aplicar el SQL en Supabase (SQL Editor o vía MCP).
//
// Respeta la política de Nominatim: 1 request/seg + User-Agent identificable.
// Valida que el resultado caiga dentro del bounding box de Mar del Plata para
// descartar geocodificaciones erróneas (direcciones vagas quedan sin coords).

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// --- cargar .env.local manualmente (no dependemos de dotenv) ---
function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] ??= m[2];
    }
  } catch {
    /* ignore */
  }
}
loadEnv();

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL_ || !KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / ANON_KEY (en .env.local)");
  process.exit(1);
}

// Bounding box aproximado de General Pueyrredon / Mar del Plata.
const BBOX = { latMin: -38.25, latMax: -37.85, lngMin: -57.75, lngMax: -57.45 };
const inBbox = (lat, lng) =>
  lat >= BBOX.latMin && lat <= BBOX.latMax && lng >= BBOX.lngMin && lng <= BBOX.lngMax;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ar&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "mardelplata.dev geocoder (info@mardelplata.dev.ar)" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

async function main() {
  const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });
  const { data: cafes, error } = await supabase
    .from("cafes")
    .select("id, name, address, neighborhood, lat")
    .is("lat", null);
  if (error) {
    console.error("Error leyendo cafes:", error.message);
    process.exit(1);
  }

  let ok = 0;
  let skipped = 0;
  for (const c of cafes ?? []) {
    const parts = [c.address, c.neighborhood, "Mar del Plata", "Buenos Aires", "Argentina"]
      .filter(Boolean)
      .join(", ");
    const r = await geocode(parts);
    await sleep(1100); // política Nominatim: <= 1 req/seg
    if (r && inBbox(r.lat, r.lng)) {
      console.log(`UPDATE public.cafes SET lat=${r.lat}, lng=${r.lng} WHERE id='${c.id}'; -- ${c.name}`);
      ok++;
    } else {
      console.error(`SKIP (sin resultado válido): ${c.name} [${parts}]`);
      skipped++;
    }
  }
  console.error(`\nGeocodificados: ${ok} · Sin coords: ${skipped} · Total: ${(cafes ?? []).length}`);
}

main();
