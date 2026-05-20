import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");

export function loadEnv() {
  const envPath = resolve(ROOT, ".env.local");
  const env = { ...process.env };

  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }

  return env;
}

export function isPlaceholder(value) {
  return (
    !value ||
    value.includes("placeholder") ||
    value.includes("TU-PROYECTO") ||
    value.startsWith("tu-")
  );
}

export function requireEnv(env, keys) {
  const missing = keys.filter((k) => isPlaceholder(env[k]));
  if (missing.length) {
    throw new Error(
      `Faltan credenciales reales en .env.local: ${missing.join(", ")}`,
    );
  }
}
