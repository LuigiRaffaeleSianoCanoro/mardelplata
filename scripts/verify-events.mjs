#!/usr/bin/env node
/**
 * Smoke test: valida JSON de eventos curados y rutas públicas.
 * Usage: node scripts/verify-events.mjs
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ITEMS_DIR = path.join(ROOT, "src/content/events/items");

const REQUIRED = [
  "id",
  "title",
  "excerpt",
  "date",
  "venue",
  "city",
  "hosts",
  "lumaUrl",
  "tags",
  "tier",
  "verifiedAt",
];

let errors = 0;

if (!fs.existsSync(ITEMS_DIR)) {
  console.error("MISSING items directory");
  process.exit(1);
}

const files = fs.readdirSync(ITEMS_DIR).filter((f) => f.endsWith(".json"));
console.log(`Event JSON files: ${files.length}`);

const ids = new Set();
const slugs = new Set();

for (const file of files) {
  const full = path.join(ITEMS_DIR, file);
  let event;
  try {
    event = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch {
    console.error(`INVALID JSON: ${file}`);
    errors++;
    continue;
  }

  const base = file.replace(/\.json$/, "");
  if (event.id !== base) {
    console.error(`ID mismatch: ${file} (id=${event.id})`);
    errors++;
  }

  for (const key of REQUIRED) {
    if (event[key] === undefined || event[key] === null || event[key] === "") {
      console.error(`MISSING ${key} in ${file}`);
      errors++;
    }
  }

  if (!/^https:\/\/luma\.com\//.test(event.lumaUrl)) {
    console.error(`BAD lumaUrl in ${file}`);
    errors++;
  }

  if (!["community", "city"].includes(event.tier)) {
    console.error(`BAD tier in ${file}`);
    errors++;
  }

  if (ids.has(event.id)) {
    console.error(`DUPLICATE id: ${event.id}`);
    errors++;
  }
  ids.add(event.id);

  const slugMatch = event.lumaUrl.match(/luma\.com\/(?:event\/)?([a-zA-Z0-9_-]+)/i);
  const slug = slugMatch?.[1]?.toLowerCase();
  if (slug) {
    if (slugs.has(slug)) {
      console.error(`DUPLICATE luma slug: ${slug}`);
      errors++;
    }
    slugs.add(slug);
  }
}

const routeFiles = ["src/app/eventos/page.tsx", "src/lib/events/index.ts"];
for (const f of routeFiles) {
  if (!fs.existsSync(path.join(ROOT, f))) {
    console.error(`MISSING route/lib: ${f}`);
    errors++;
  }
}

const syncScript = path.join(ROOT, "scripts/sync-luma-events.mjs");
if (!fs.existsSync(syncScript)) {
  console.error("MISSING scripts/sync-luma-events.mjs");
  errors++;
}

if (errors > 0) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}

console.log("OK — events smoke test passed");
