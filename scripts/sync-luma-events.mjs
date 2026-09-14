#!/usr/bin/env node
/**
 * Sincroniza eventos curados desde Luma → JSON en src/content/events/items/.
 *
 * Modos:
 *   --refresh     Actualiza fechas/título/hosts de JSON existentes (default)
 *   --discover    Busca eventos nuevos en fuentes configuradas y crea JSON
 *   --dry-run     No escribe archivos; solo reporta cambios
 *
 * Usage:
 *   node scripts/sync-luma-events.mjs
 *   node scripts/sync-luma-events.mjs --discover --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import {
  EVENT_EXCLUDE_PATTERNS,
  LUMA_EXCLUDE_SLUGS,
  fetchDiscoverEvents,
  fetchLumaBySlug,
  isExcludedEvent,
  lumaSlug,
  mapLumaDataToEventFields,
  stableEventId,
  todayArgentina,
  toArgentinaISO,
} from "./luma-api.mjs";

const ROOT = process.cwd();
const ITEMS_DIR = path.join(ROOT, "src/content/events/items");
const SOURCES_PATH = path.join(ROOT, "src/content/events/sources.json");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const DISCOVER = args.has("--discover");
const REFRESH = args.has("--refresh") || !DISCOVER;

function loadSources() {
  if (!fs.existsSync(SOURCES_PATH)) {
    return {
      discover: { latitude: -38.0055, longitude: -57.5426, paginationLimit: 50 },
      calendars: [],
    };
  }
  return JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8"));
}

function loadExistingEvents() {
  const bySlug = new Map();
  const byId = new Map();

  if (!fs.existsSync(ITEMS_DIR)) {
    fs.mkdirSync(ITEMS_DIR, { recursive: true });
  }

  for (const file of fs.readdirSync(ITEMS_DIR).filter((f) => f.endsWith(".json"))) {
    const full = path.join(ITEMS_DIR, file);
    const event = JSON.parse(fs.readFileSync(full, "utf8"));
    const slug = lumaSlug(event.lumaUrl);
    if (slug) bySlug.set(slug, { file, event });
    byId.set(event.id, { file, event });
  }

  return { bySlug, byId };
}

function writeEvent(filePath, event) {
  const json = `${JSON.stringify(event, null, 2)}\n`;
  if (DRY_RUN) {
    console.log(`[dry-run] would write ${path.relative(ROOT, filePath)}`);
    return;
  }
  fs.writeFileSync(filePath, json, "utf8");
}

async function refreshExisting(bySlug) {
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const [slug, { file, event }] of bySlug) {
    try {
      const data = await fetchLumaBySlug(slug);
      if (!data) {
        console.warn(`SKIP (not found on Luma): ${slug}`);
        skipped++;
        continue;
      }

      const ev = data.event;
      const hosts = (data.hosts ?? []).map((h) =>
        typeof h === "string" ? h : h.name ?? "",
      ).filter(Boolean);

      // Solo campos mecánicos — title/excerpt/venue/tags/tier quedan curados en repo.
      const refreshed = {
        date: toArgentinaISO(ev.start_at) ?? event.date,
        endDate: toArgentinaISO(ev.end_at) ?? event.endDate,
        hosts: hosts.length > 0 ? hosts : event.hosts,
      };

      const contentChanged =
        refreshed.date !== event.date ||
        refreshed.endDate !== event.endDate ||
        JSON.stringify(refreshed.hosts) !== JSON.stringify(event.hosts);

      const next = contentChanged
        ? { ...event, ...refreshed, verifiedAt: todayArgentina() }
        : event;

      const changed = contentChanged;
      if (changed) {
        writeEvent(path.join(ITEMS_DIR, file), next);
        console.log(`UPDATED: ${event.id} (${slug})`);
        updated++;
      } else {
        console.log(`OK: ${event.id}`);
      }
    } catch (err) {
      console.error(`ERROR refreshing ${slug}:`, err.message);
      errors++;
    }
  }

  return { updated, skipped, errors };
}

async function discoverNew(bySlug) {
  const sources = loadSources();
  const discovered = new Map();

  if (sources.discover) {
    const list = await fetchDiscoverEvents(sources.discover);
    for (const item of list) {
      if (item.visibility && item.visibility !== "public") continue;
      discovered.set(item.slug, item);
    }
  }

  let created = 0;
  let skipped = 0;

  for (const [slug, meta] of discovered) {
    if (bySlug.has(slug)) continue;
    if (LUMA_EXCLUDE_SLUGS.has(slug)) {
      console.log(`SKIP excluded slug: ${slug}`);
      skipped++;
      continue;
    }

    const data = await fetchLumaBySlug(slug);
    if (!data?.event) {
      console.warn(`SKIP (no detail): ${slug}`);
      skipped++;
      continue;
    }

    const fields = mapLumaDataToEventFields(data);
    if (isExcludedEvent({ title: fields.title, hosts: fields.hosts, lumaUrl: fields.lumaUrl })) {
      console.log(`SKIP excluded event: ${fields.title}`);
      skipped++;
      continue;
    }

    const id = stableEventId(slug, fields.title);
    const fileName = `${id}.json`;
    const filePath = path.join(ITEMS_DIR, fileName);

    if (fs.existsSync(filePath)) {
      skipped++;
      continue;
    }

    const event = { id, ...fields };
    writeEvent(filePath, event);
    console.log(`CREATED: ${id} ← luma.com/${slug}`);
    bySlug.set(slug, { file: fileName, event });
    created++;
  }

  return { created, skipped, discovered: discovered.size };
}

async function main() {
  console.log(`Luma events sync${DRY_RUN ? " (dry-run)" : ""}`);
  const { bySlug } = loadExistingEvents();
  console.log(`Tracked events: ${bySlug.size}`);

  let summary = {};

  if (REFRESH) {
    console.log("\n── Refresh existing ──");
    summary.refresh = await refreshExisting(bySlug);
  }

  if (DISCOVER) {
    console.log("\n── Discover new ──");
    summary.discover = await discoverNew(bySlug);
  }

  console.log("\n── Summary ──");
  console.log(JSON.stringify(summary, null, 2));

  const errorCount = summary.refresh?.errors ?? 0;
  if (errorCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
