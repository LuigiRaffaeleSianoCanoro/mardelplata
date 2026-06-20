// Integración con Roomix (roomix.ai) — metabuscador inmobiliario con IA, startup
// marplatense. Ver docs/nomad-it-hub/02-feature-plan.md §F7 y la skill
// docs/nomad-it-hub/skills/05-integrations.md.
//
// F7a (acá): deep-link con UTM. Roomix NO tiene API pública documentada (jun 2026)
// y su sitio bloquea el fetch automatizado, así que NO inyectamos parámetros de
// búsqueda sin confirmarlos (evita links rotos). Cuando se confirme el esquema de
// URL de búsqueda (o haya partnership/API — F7b), se agrega acá en un solo lugar.

const ROOMIX_BASE = "https://roomix.ai";

const DEFAULT_UTM: Record<string, string> = {
  utm_source: "mardelplata.dev",
  utm_medium: "referral",
  utm_campaign: "nomad-hub",
};

export interface RoomixLinkParams {
  /** Identifica el preset/origen del click para medición (utm_content). */
  preset?: string;
}

/** URL a Roomix con UTM para medir el tráfico que mandamos. */
export function roomixUrl({ preset }: RoomixLinkParams = {}): string {
  const url = new URL(ROOMIX_BASE);
  for (const [k, v] of Object.entries(DEFAULT_UTM)) {
    url.searchParams.set(k, v);
  }
  if (preset) url.searchParams.set("utm_content", preset);
  return url.toString();
}

export interface RoomixPreset {
  label: string;
  hint: string;
  preset: string;
}

// Presets que mostramos como sugerencias de búsqueda (el usuario los tipea en el
// buscador conversacional de Roomix). Cuando se confirme el deep-link de búsqueda,
// estos pasan a pre-cargar la query.
export const ROOMIX_PRESETS: RoomixPreset[] = [
  {
    label: "Alquiler temporario",
    hint: "Ej.: \"departamento amoblado en Mar del Plata por 3 meses\"",
    preset: "temporario",
  },
  {
    label: "Alquiler anual",
    hint: "Ej.: \"2 ambientes en alquiler permanente en Mar del Plata\"",
    preset: "anual",
  },
  {
    label: "Con vista al mar",
    hint: "Ej.: \"monoambiente con vista al mar en La Perla\"",
    preset: "vista-al-mar",
  },
];
