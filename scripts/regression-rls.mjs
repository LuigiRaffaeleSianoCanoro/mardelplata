#!/usr/bin/env node
/**
 * Tests de regresión de seguridad (REST).
 * Complementa verify-rls.mjs con checks adicionales post-migración.
 *
 * Uso: node scripts/regression-rls.mjs
 */
import { loadEnv, requireEnv } from "./lib/env.mjs";

const env = loadEnv();

async function rest(path, { key, method = "GET", body } = {}) {
  const url = `${env.NEXT_PUBLIC_SUPABASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: method === "GET" ? "return=minimal" : "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, ok: res.ok, json };
}

async function main() {
  console.log("MdPDev — tests de regresión RLS\n");

  try {
    requireEnv(env, [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;
  let failures = 0;

  const tests = [
    {
      name: "anon no lee emails de profiles",
      run: async () => {
        const r = await rest("/rest/v1/profiles?select=email&limit=5", { key: anon });
        if (r.status === 200 && Array.isArray(r.json) && r.json.some((row) => row.email)) {
          return "anon obtuvo emails de profiles";
        }
        return null;
      },
    },
    {
      name: "anon puede leer profiles_public",
      run: async () => {
        const r = await rest("/rest/v1/profiles_public?select=id&limit=1", { key: anon });
        if (!r.ok) return `profiles_public HTTP ${r.status}`;
        return null;
      },
    },
    {
      name: "service role: al menos un admin existe",
      run: async () => {
        const r = await rest("/rest/v1/profiles?select=id&is_admin=eq.true&limit=1", {
          key: service,
        });
        if (!r.ok) return `HTTP ${r.status}`;
        if (!Array.isArray(r.json) || r.json.length === 0) {
          return "no hay admins — bootstrap manual requerido";
        }
        return null;
      },
    },
    {
      name: "profiles_public no expone is_admin",
      run: async () => {
        const r = await rest("/rest/v1/profiles_public?select=is_admin&limit=1", { key: anon });
        if (r.ok && Array.isArray(r.json)) return "is_admin expuesto en profiles_public";
        return null;
      },
    },
  ];

  for (const t of tests) {
    const err = await t.run();
    if (err) {
      console.log(`  ✗ ${t.name}: ${err}`);
      failures++;
    } else {
      console.log(`  ✓ ${t.name}`);
    }
  }

  console.log(
    "\nNota: escalada is_admin y admin cross-user requieren JWT de usuario de prueba.",
  );
  console.log("Verificá manualmente o con SQL: scripts/012_security_audit_check.sql");

  if (failures) process.exit(1);
  console.log("\nRegresión REST OK.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
