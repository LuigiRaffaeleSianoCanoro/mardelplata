#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { placeToCafeRow } from "./seed-cafes.helpers.mjs";

const DRY_RUN = process.argv.includes("--dry-run");
const QUERY = "cafe en Mar del Plata";
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv() {
  const missing = [];
  if (!PLACES_KEY) missing.push("GOOGLE_PLACES_API_KEY");
  if (!SB_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!DRY_RUN && !SB_SERVICE) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    console.error("Faltan variables de entorno:", missing.join(", "));
    process.exit(1);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAllPlaces() {
  const results = [];
  let pageToken = null;
  do {
    const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    url.searchParams.set("query", QUERY);
    url.searchParams.set("type", "cafe");
    url.searchParams.set("key", PLACES_KEY);
    if (pageToken) url.searchParams.set("pagetoken", pageToken);
    const res = await fetch(url);
    const json = await res.json();
    if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
      throw new Error(`Places API: ${json.status} ${json.error_message ?? ""}`);
    }
    results.push(...(json.results ?? []));
    pageToken = json.next_page_token ?? null;
    if (pageToken) await sleep(2000); // el token tarda en activarse
  } while (pageToken);
  return results;
}

async function main() {
  requireEnv();
  console.log(`[seed-cafes] query="${QUERY}" dry-run=${DRY_RUN}`);
  const places = await fetchAllPlaces();
  console.log(`[seed-cafes] ${places.length} lugares encontrados`);

  const rows = [];
  for (const p of places) {
    try {
      rows.push(placeToCafeRow(p));
    } catch (e) {
      console.warn(`[seed-cafes] salteado: ${e.message}`);
    }
  }
  console.log(`[seed-cafes] ${rows.length} filas válidas`);

  if (DRY_RUN) {
    console.log(JSON.stringify(rows.slice(0, 5), null, 2));
    console.log("[seed-cafes] dry-run: no se escribió nada.");
    return;
  }

  if (rows.length === 0) {
    console.log("[seed-cafes] nada para sembrar.");
    return;
  }

  const supabase = createClient(SB_URL, SB_SERVICE, {
    auth: { persistSession: false },
  });
  const { error } = await supabase
    .from("cafes")
    .upsert(rows, { onConflict: "google_place_id" });
  if (error) {
    console.error(`[seed-cafes] upsert falló: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`[seed-cafes] upserted ${rows.length} cafés.`);
}

main().catch((e) => {
  console.error("[seed-cafes] fallo:", e.message);
  process.exit(1);
});
