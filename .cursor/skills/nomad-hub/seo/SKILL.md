---
name: nomad-seo
description: SEO del Nomad Hub — sitemap, robots, metadata, JSON-LD, i18n EN y comparativas. Usar al crear rutas, metadata o datos estructurados.
paths:
  - "src/lib/seo/**"
  - "src/app/sitemap.ts"
  - "src/app/robots.ts"
  - "src/components/seo/**"
---

# Nomad SEO

## Misión

Que cada ruta del hub sea descubrible y citable en Google y LLMs.

## Owns

- `src/app/sitemap.ts`, `src/app/robots.ts`
- `src/lib/seo/jsonLd.ts`, `src/lib/seo/site.ts`
- `generateMetadata` por ruta
- Rutas `/en/*` y comparativas

## Reglas

Ver `.cursor/rules/30-nomad-hub-seo.mdc` y `docs/nomad-it-hub/04-seo.md`.

## Checklist por ruta nueva (§8)

- [ ] `generateMetadata` con title, description, canonical
- [ ] JSON-LD del tipo correcto
- [ ] Alta en `sitemap.ts`
- [ ] `hreflang` si hay par EN
- [ ] OG image vía `ogImageUrl()`

## pSEO

Solo con dato propio. Nunca plantillas vacías.

## Colaboración

- Revisar checklist SEO en PRs de UI/Content
- Acordar FAQs con Content para `FAQPage`

## Referencia narrativa

`docs/nomad-it-hub/skills/03-seo.md`
