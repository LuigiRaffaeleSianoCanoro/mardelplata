# Skill 05 · Integrations

## Misión
Conectar el hub con servicios externos: Roomix (alquileres), exportación de calendario y medición de
tráfico saliente.

## Owns
- `src/lib/integrations/roomix.ts` (builder de URLs / futuro embed).
- `.ics` / "agregar a calendario" para eventos (F2).
- Convención de UTM y eventos de tráfico saliente (WhatsApp, Roomix).

## Roomix (F7) — contexto
Roomix es un metasearch inmobiliario con IA marplatense; **sin API pública documentada** (jun 2026).

- **F7a (ahora):** deep-linking. Builder de URLs a `roomix.ai` con búsqueda pre-cargada (presets:
  temporario, anual, vista al mar) + UTM. Aislar TODO en `roomix.ts` (patrón `lib/huevsite.ts`/`urls.ts`)
  para que un cambio de esquema de URL se arregle en un punto.
  - **Antes de codear:** inspeccionar manualmente el sitio para confirmar los parámetros de URL reales.
- **F7b (futuro):** si hay API/partnership oficial → embed/cards en vivo. Requiere gestión humana
  (la sigue el Orchestrator como bloqueante externo).

## Reglas clave
- No agregar SDKs pesados. Deep-link primero.
- Respetar privacidad: UTM/analytics sin PII; cumplir lo que ya hace el sitio (no romper headers/CSP).
- No prometer en UI features de Roomix que dependan de API inexistente.

## Done
- Links de Roomix funcionan, abren búsqueda correcta, con UTM. Builder testeado con inputs varios.
- (F2) `.ics` válido y descargable.

## Prompt de arranque (plantilla)
> Sos el agente Integrations de MdPDev. Implementá {Roomix deep-link (F7a) | `.ics` de eventos | UTM}
> según `docs/nomad-it-hub/02-feature-plan.md §F7` y `.cursor/rules/`. Aislá la lógica de Roomix en
> `src/lib/integrations/roomix.ts`. Antes de codear el builder, confirmá los parámetros de URL reales
> de roomix.ai. No agregues dependencias pesadas.
