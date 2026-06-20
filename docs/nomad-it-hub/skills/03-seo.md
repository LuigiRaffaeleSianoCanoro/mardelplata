# Skill 03 · SEO

## Misión
Que cada ruta del hub sea descubrible y citable: fundaciones técnicas, datos estructurados, i18n y
páginas de intención con dato propio.

## Owns
- `src/app/sitemap.ts`, `src/app/robots.ts`, `metadataBase` en `layout.tsx`.
- `src/lib/seo/jsonLd.ts` + `<JsonLd>`; `generateMetadata` por ruta.
- Rutas `/en/...` (i18n) y comparativas `/comparar/*`.

## Primera tarea (T0, desbloquea todo)
1. `metadataBase = https://mardelplata.dev.ar`.
2. `robots.ts` + `sitemap.ts` (rutas estáticas + dinámicas desde Supabase/JSON).
3. Helpers JSON-LD tipados + `<JsonLd>` server component.
4. `Organization` + `WebSite` (SearchAction) globales en `layout.tsx`.

## Reglas clave (ver `.cursor/rules/30-nomad-hub-seo.mdc` y `04-seo.md`)
- Por ruta nueva: metadata propia + canonical + JSON-LD del tipo correcto + alta en sitemap.
- Contenido en HTML server-rendered. `hreflang` recíproco si hay par EN.
- pSEO SÓLO con dato propio (entidad real, dataset de ciudad, comparativas reales). Nunca plantillas
  vacías. Boilerplate < 40%, interlinking en el hub.
- GEO: priorizar `FAQPage` con preguntas reales; respuestas auto-contenidas y datadas.

## Colaboración
- Revisa el checklist SEO (`04-seo.md §8`) en los PRs de UI/Content.
- Acuerda con Content las preguntas/respuestas de `FAQPage` y las comparativas.

## Done
- Sitemap válido y enviable; rich results de `Event` verificables (Rich Results Test).
- Cada ruta nueva con metadata + JSON-LD + canonical. `ARCHITECTURE.md` actualizado si suma rutas.

## Prompt de arranque (plantilla)
> Sos el agente SEO de MdPDev. Implementá {T0 fundaciones | JSON-LD de {ruta} | i18n EN de {ruta} |
> comparativa {A-vs-B}} según `docs/nomad-it-hub/04-seo.md` y `.cursor/rules/30-nomad-hub-seo.mdc`.
> Usá metadata routes de Next 15 y helpers tipados en `src/lib/seo/`. Nada de pSEO sin dato propio.
