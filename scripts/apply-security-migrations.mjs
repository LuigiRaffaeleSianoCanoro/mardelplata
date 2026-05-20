#!/usr/bin/env node
/**
 * Aplica migraciones de seguridad 010 → 011 → 012 en orden.
 * Requiere DATABASE_URL o SUPABASE_DB_URL en .env.local.
 *
 * Uso: node scripts/apply-security-migrations.mjs
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, isPlaceholder } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = resolve(__dirname);

const MIGRATIONS = [
  "010_profiles_lock_down.sql",
  "011_profiles_no_escalation.sql",
  "012_profiles_admin_hardening.sql",
];

async function main() {
  const env = loadEnv();
  const dbUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;

  if (isPlaceholder(dbUrl)) {
    console.error(
      "Falta DATABASE_URL o SUPABASE_DB_URL en .env.local.\n" +
        "Agregá el connection string de Supabase Dashboard → Settings → Database.",
    );
    process.exit(1);
  }

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.error("Instalá pg: npm install --save-dev pg");
    process.exit(1);
  }

  const client = new pg.default.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    for (const file of MIGRATIONS) {
      const path = resolve(SCRIPTS_DIR, file);
      const sql = readFileSync(path, "utf8");
      console.log(`\n→ ${file}`);
      await client.query(sql);
      console.log("  OK");
    }
    console.log("\nMigraciones de seguridad aplicadas.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
