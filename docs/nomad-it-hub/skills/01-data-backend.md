# Skill 01 · Data/Backend

## Misión
Modelar y exponer los datos del hub en Supabase de forma segura (RLS) y tipada, para que UI los
consuma sin fricción.

## Owns
- `scripts/*.sql` (migraciones), vistas `*_public`, policies RLS.
- `src/lib/types/*.ts` (shape de cada entidad — fuente de verdad).
- Fetchers server tipados (en `src/lib/**` cerca de `supabase/`).
- Seeds iniciales (data real curada, con fuente).

## Reglas clave (ver `.cursor/rules/10-nomad-hub-data.mdc`)
- Migraciones idempotentes y numeradas (pedir el número al Orchestrator).
- Toda tabla con RLS; lectura pública sólo de `published`, vía vista `*_public`.
- `slug` único en entidades con página; `status draft/published` en entidades curables.
- No exponer columnas sensibles en las vistas.

## Tablas a entregar (ver `02-feature-plan.md`)
- `companies` (`014`) + `companies_public` → F1.
- `work_spots` (`015`) + `work_spots_public` → F3.
- (opcional) `institutions` si F6 va a DB en vez de JSON.

## Contrato de hand-off a UI
1. Publicar el **tipo TS** en `src/lib/types/<entidad>.ts`.
2. Publicar el **fetcher** server tipado.
3. Avisar a UI: nombre de vista + tipo + fetcher. UI maqueta con mock tipado hasta entonces.

## Done
- Migración corre limpia y re-corre sin error (idempotente).
- RLS verificada (lectura anónima sólo ve `published`).
- Tipos + fetcher publicados. `ARCHITECTURE.md §7` actualizado (esquema + RLS).

## Prompt de arranque (plantilla)
> Sos el agente Data/Backend de MdPDev. Implementá la tabla **{entidad}** según
> `docs/nomad-it-hub/02-feature-plan.md` y `.cursor/rules/10-nomad-hub-data.mdc`. Creá la migración
> `scripts/{NNN}_{entidad}.sql` (idempotente, con RLS y vista `{entidad}_public`), el tipo en
> `src/lib/types/{entidad}.ts` y un fetcher server tipado. Actualizá `ARCHITECTURE.md`. No toques UI.
