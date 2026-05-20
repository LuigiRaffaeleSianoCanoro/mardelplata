#!/usr/bin/env node
/**
 * Verificación de seguridad RLS via REST (anon + service role).
 * Uso: node scripts/verify-rls.mjs
 */
import { loadEnv, isPlaceholder, requireEnv } from "./lib/env.mjs";

const env = loadEnv();

function header(title) {
  console.log(`\n=== ${title} ===`);
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  console.log(`  ✗ ${msg}`);
}

async function rest(path, { key, method = "GET", body, headers = {} } = {}) {
  const url = `${env.NEXT_PUBLIC_SUPABASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: method === "GET" ? "return=minimal" : "return=representation",
      ...headers,
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
  console.log("MdPDev — verificación RLS (REST)\n");

  try {
    requireEnv(env, [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  } catch (e) {
    console.error(e.message);
    console.error(
      "\nConfigurá .env.local con credenciales reales de Supabase antes de correr este script.",
    );
    process.exit(1);
  }

  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;
  let issues = 0;

  // ── Test 1: anon no puede leer emails de profiles ──────────────────────
  header("Test 1: anon SELECT profiles (leak de emails)");
  const anonProfiles = await rest("/rest/v1/profiles?select=email&limit=1", {
    key: anon,
  });
  if (anonProfiles.status === 200 && Array.isArray(anonProfiles.json) && anonProfiles.json.length > 0) {
    fail("anon puede leer profiles con emails — aplicar 010_profiles_lock_down.sql");
    issues++;
  } else if (anonProfiles.status === 401 || anonProfiles.status === 403) {
    pass("anon bloqueado en profiles (401/403)");
  } else if (Array.isArray(anonProfiles.json) && anonProfiles.json.length === 0) {
    pass("anon no obtiene filas de profiles (vacío o RLS)");
  } else {
    fail(`respuesta inesperada: HTTP ${anonProfiles.status}`);
    issues++;
  }

  // ── Test 2: anon puede leer profiles_public ─────────────────────────────
  header("Test 2: anon SELECT profiles_public (esperado OK)");
  const anonPublic = await rest(
    "/rest/v1/profiles_public?select=id,full_name&limit=1",
    { key: anon },
  );
  if (anonPublic.ok) {
    pass("profiles_public accesible para anon");
  } else {
    fail(`profiles_public no accesible: HTTP ${anonPublic.status}`);
    issues++;
  }

  // ── Test 3: profiles_public no expone email ni is_admin ─────────────────
  header("Test 3: profiles_public sin columnas sensibles");
  const badCol = await rest("/rest/v1/profiles_public?select=email&limit=1", {
    key: anon,
  });
  if (badCol.status >= 400) {
    pass("columna email no expuesta en profiles_public");
  } else {
    fail("profiles_public podría exponer email");
    issues++;
  }

  // ── Test 4: service role puede listar admins (sanity) ───────────────────
  header("Test 4: service role — conteo de admins");
  const admins = await rest(
    "/rest/v1/profiles?select=id,is_admin&is_admin=eq.true",
    { key: service },
  );
  if (admins.ok && Array.isArray(admins.json)) {
    pass(`${admins.json.length} admin(s) en profiles`);
  } else {
    fail(`no se pudo listar admins: HTTP ${admins.status}`);
    issues++;
  }

  // ── Test 5: intento de escalada con service role (simula atacante con JWT)
  //    Nota: service role bypassa RLS — este test valida que NO hay admins
  //    no autorizados recientes. Escalada real se prueba con JWT de usuario.
  header("Test 5: snapshot de policies (requiere SQL Editor o run-sql.mjs)");
  console.log(
    "  → Correr scripts/012_security_audit_check.sql para detalle de pg_policies",
  );

  header("Resumen");
  if (issues === 0) {
    console.log("  Todos los tests REST pasaron.");
  } else {
    console.log(`  ${issues} issue(s) detectado(s). Revisar migraciones 010/011/012.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
