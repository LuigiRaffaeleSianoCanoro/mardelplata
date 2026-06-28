---
name: nomad-integrations
description: Integraciones externas del hub — Roomix deep-links, calendario .ics, UTM y analytics. Usar para src/lib/integrations y tráfico saliente.
paths:
  - "src/lib/integrations/**"
  - "src/lib/analytics.ts"
  - "src/components/TrackedOutboundLink.tsx"
---

# Nomad Integrations

## Misión

Conectar el hub con servicios externos: Roomix, calendario de eventos y medición de tráfico.

## Owns

- `src/lib/integrations/roomix.ts`
- Export `.ics` / "agregar a calendario" para eventos
- Convención UTM (WhatsApp, Roomix, partners)

## Roomix (F7)

Sin API pública documentada (jun 2026):

- **F7a**: deep-link a `roomix.ai` con UTM + presets de búsqueda
- **F7b**: embed/API si hay partnership — bloqueante externo del orchestrator
- Aislar TODO en `roomix.ts` (patrón `huevsite.ts`)

Antes de codear: confirmar parámetros de URL reales del sitio.

## Reglas

- No SDKs pesados — deep-link primero
- UTM sin PII
- No prometer en UI features que dependan de API inexistente

## Done

- Links Roomix funcionan con UTM correcto
- Builder testeado con inputs varios
- `.ics` válido si aplica (F2)

## Referencia narrativa

`docs/nomad-it-hub/skills/05-integrations.md`
