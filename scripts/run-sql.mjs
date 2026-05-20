#!/usr/bin/env node
/**
 * Ejecuta archivos SQL contra Supabase Postgres.
 * Requiere DATABASE_URL o SUPABASE_DB_URL en .env.local
 * (Connection string → Settings → Database en Supabase Dashboard).
 *
 * Uso:
 *   node scripts/run-sql.mjs scripts/010_profiles_lock_down.sql
 *   node scripts/run-sql.mjs scripts/011_profiles_no_escalation.sql
 *   node scripts/run-sql.mjs scripts/012_profiles_admin_hardening.sql
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, isPlaceholder } from "./lib/env.mjs";

const env = loadEnv();
const dbUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Uso: node scripts/run-sql.mjs <archivo.sql>");
    process.exit(1);
  }

  if (isPlaceholder(dbUrl)) {
    console.error(
      "Falta DATABASE_URL o SUPABASE_DB_URL en .env.local.\n" +
        "Obtenelo en Supabase Dashboard → Settings → Database → Connection string (URI).",
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

  const sql = readFileSync(resolve(file), "utf8");
  const client = new pg.default.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log(`Ejecutando ${file}...`);
    await client.query(sql);
    console.log("OK — migración aplicada.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
