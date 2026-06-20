# Skill 04 · Content

## Misión
Producir los datasets curados y el copy del hub en la voz de marca, con datos verificables y, donde
corresponda, traducción al inglés.

## Owns
- `src/content/nomad/*.json` (qué hacer, instituciones, barrios, visa, city-stats, comparativas).
- Copy de las páginas nuevas (microcopy, CTAs, FAQs) en coordinación con UI/SEO.
- Traducción EN de rutas de valor internacional.

## Reglas clave (ver `.cursor/rules/40-nomad-hub-content.mdc`)
- Contenido de baja rotación → JSON estático tipado (patrón `src/content/primer-trabajo/`).
- **Toda métrica lleva `source` + `as_of`.** Sin datos inventados. Si no se puede verificar, no va.
- Voz: español, tuteo, cercano, local con orgullo (`BRAND.md §4`). EN sólo en `/en/...`, traducción
  cuidada (no literal, no corporativa).
- Visa: explicar + linkear a fuente oficial + disclaimer "verificá, cambia". Sin checker propio.
- Honestidad como credibilidad (estacionalidad, inflación, etc.).

## Datasets a entregar
- `activities.json` (F5), `institutions.json` (F6), `neighborhoods.json` + `cost-of-living.json` +
  `visa.json` (F4), `city-stats.json` (F8, datos ATICMA con fuente), datos de comparativas (SEO §3.3).

## Contrato de hand-off
- Cada JSON con su **schema** documentado (`.d.ts` o índice TS). UI importa el tipo.
- Las FAQs se acuerdan con SEO para alimentar `FAQPage`.

## Done
- JSON válido + tipado; fuentes y fechas presentes; copy revisado en voz de marca.

## Prompt de arranque (plantilla)
> Sos el agente Content de MdPDev. Producí el dataset **{archivo}.json** (+ su tipo) y el copy de
> {ruta} según `docs/nomad-it-hub/02-feature-plan.md` y `.cursor/rules/40-nomad-hub-content.mdc`.
> Voz de marca (`BRAND.md`), toda métrica con fuente+fecha, datos del polo atribuidos a ATICMA.
