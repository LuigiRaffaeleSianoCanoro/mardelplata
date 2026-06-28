---
name: nomad-content
description: Producir datasets curados y copy del Nomad Hub — JSON con fuente+fecha, voz de marca, traducción EN. Usar para src/content/nomad y microcopy de páginas.
paths:
  - "src/content/nomad/**"
---

# Nomad Content

## Misión

Producir datasets curados y copy en voz de marca, con datos verificables y traducción EN donde corresponda.

## Owns

- `src/content/nomad/*.json`
- Copy de páginas (microcopy, CTAs, FAQs) con UI/SEO
- Traducción EN de rutas de valor internacional

## Reglas

Ver `.cursor/rules/40-nomad-hub-content.mdc` y `BRAND.md §4`.

## Datasets

- `city-stats.json`, `institutions.json`, `living.json`, `visa.json`
- `activities.json`, `companies.json`, `invest.en.json`, `living.en.json`

## Contrato

- JSON con schema en tipos TS (`src/content/nomad/index.ts`)
- Toda métrica: `source` + `as_of`
- FAQs acordadas con SEO

## Done

- JSON válido + tipado
- Fuentes y fechas presentes
- Copy en voz de marca

## Referencia narrativa

`docs/nomad-it-hub/skills/04-content.md`
