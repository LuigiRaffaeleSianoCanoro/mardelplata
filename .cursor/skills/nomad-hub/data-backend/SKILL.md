---
name: nomad-data-backend
description: Modelar datos del Nomad Hub en Supabase — migraciones SQL, RLS, vistas públicas, tipos TS y fetchers. Usar para tablas, policies y capa de datos.
paths:
  - "scripts/**"
  - "src/lib/types/**"
  - "src/lib/supabase/**"
  - "src/lib/cafes.ts"
---

# Nomad Data/Backend

## Misión

Modelar y exponer datos del hub en Supabase de forma segura (RLS) y tipada para que UI los consuma sin fricción.

## Owns

- `scripts/*.sql` — migraciones, vistas `*_public`, policies RLS
- `src/lib/types/*.ts` — fuente de verdad del shape
- Fetchers server tipados
- Seeds iniciales con fuente

## Reglas

Ver `.cursor/rules/10-nomad-hub-data.mdc` y skill `security-rls`.

## Contrato de hand-off a UI

1. Publicar tipo TS en `src/lib/types/<entidad>.ts`
2. Publicar fetcher server tipado
3. Comunicar: vista + tipo + fetcher. UI usa `devMock` hasta entonces

## Workflow

1. Pedir número de migración al orchestrator
2. Crear `scripts/{NNN}_{entidad}.sql` idempotente
3. Tipo + fetcher
4. `npm run security:verify` si hay credenciales
5. Actualizar `ARCHITECTURE.md` §7

## Done

- Migración re-corre sin error
- RLS verificada
- Tipos + fetcher publicados
- No tocar UI en este skill

## Referencia narrativa

`docs/nomad-it-hub/skills/01-data-backend.md`
