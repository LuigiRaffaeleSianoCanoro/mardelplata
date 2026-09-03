#!/usr/bin/env node
/**
 * Smoke test: verifica que los clippings de prensa tengan metadata y archivos.
 * Usage: node scripts/verify-prensa.mjs
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const archivesDir = path.join(ROOT, "src/content/prensa/archives");

// Import items via dynamic read (no TS compile needed)
const itemsPath = path.join(ROOT, "src/content/prensa/items.ts");
const itemsSrc = fs.readFileSync(itemsPath, "utf8");
const idMatches = [...itemsSrc.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
const archiveMatches = [...itemsSrc.matchAll(/archivePath: "([^"]+)"/g)].map((m) => m[1]);

console.log(`Clippings: ${idMatches.length}`);
console.log(`Con archivePath: ${archiveMatches.length}`);

let errors = 0;
for (const file of archiveMatches) {
  const full = path.join(archivesDir, file);
  if (!fs.existsSync(full)) {
    console.error(`MISSING archive: ${file}`);
    errors++;
  } else {
    const size = fs.statSync(full).size;
    if (size < 80) {
      console.error(`TOO SMALL archive: ${file} (${size} bytes)`);
      errors++;
    }
  }
}

const routeFiles = [
  "src/app/prensa/page.tsx",
  "src/app/prensa/[id]/page.tsx",
];
for (const f of routeFiles) {
  if (!fs.existsSync(path.join(ROOT, f))) {
    console.error(`MISSING route: ${f}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}

console.log("OK — prensa archive smoke test passed");
