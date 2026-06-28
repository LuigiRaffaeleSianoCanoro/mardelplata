---
name: nomad-ui-frontend
description: Construir páginas y componentes del Nomad Hub — AppShell, design system, navbar, home. Usar para rutas /invertir, /empresas, /trabajar, /vivir-en-mardelplata, etc.
paths:
  - "src/app/**"
  - "src/components/**"
---

# Nomad UI/Frontend

## Misión

Construir páginas y componentes del hub respetando design system y marca, con SEO server-first.

## Owns

- `src/app/**`, `src/components/**`
- Componentes compartidos: `StatCard`, `SourceTag`, `Faq`, `LangSwitcher`, `CompanyDirectory`, `CafeDirectory`

## Reglas

Ver `.cursor/rules/20-nomad-hub-ui.mdc` y `docs/nomad-it-hub/03-redesign.md`.

## Consumir datos

- Tipo + fetcher de Data/Backend — no queries crudas nuevas
- Mock tipado (`devMock`) mientras Data no esté
- JSON de `src/content/nomad/` para contenido curado

## Tareas típicas

- `/empresas`, `/trabajar`, `/vivir-en-mardelplata/*`, `/que-hacer`, `/estudiar`, `/invertir`
- T9: `AudienceSwitchboard`, `CityHubStrip`, navbar dropdowns

## Done

- `npm run lint` + `npm run build`
- Estado vacío manejado
- Checklist marca (`03-redesign.md §6`) y SEO (`04-seo.md §8`)
- `ARCHITECTURE.md` §4/§5 actualizado

## Referencia narrativa

`docs/nomad-it-hub/skills/02-ui-frontend.md`
