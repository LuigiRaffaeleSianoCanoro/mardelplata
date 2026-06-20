# Skills — agentes especializados del Nomad & IT Hub

Cada archivo describe un **rol de agente** para ejecutar el proyecto en paralelo. Pensados para
lanzarse como Cloud Agents de Cursor (o ejecutarse en serie por un mismo agente).

| Skill | Rol | Cuándo se lanza |
|---|---|---|
| [`00-orchestrator.md`](00-orchestrator.md) | Planifica, distribuye y mergea en orden | siempre (coordina) |
| [`01-data-backend.md`](01-data-backend.md) | Supabase: migraciones, RLS, vistas, tipos, fetchers | ola 1–2 (antes que UI de cada feature con datos) |
| [`02-ui-frontend.md`](02-ui-frontend.md) | Páginas, componentes, design system, navbar, home | ola 1–4 |
| [`03-seo.md`](03-seo.md) | sitemap/robots/metadata, JSON-LD, i18n, comparativas | ola 0 (fundaciones) + continuo |
| [`04-content.md`](04-content.md) | Datasets curados (JSON), copy, fuentes, traducción EN | ola 1–3 |
| [`05-integrations.md`](05-integrations.md) | Roomix, `.ics`, analytics/UTM | ola 3 |

**Cómo usar:** el Orchestrator (o vos) elegís una tarea del DAG en
[`../05-agent-orchestration.md`](../05-agent-orchestration.md), tomás el skill correspondiente, y
lanzás un agente con el "Prompt de arranque" que está al pie de cada skill, completando la tarea.

**Antes de arrancar cualquier skill**, leer: `../README.md`, `../05-agent-orchestration.md`,
las reglas en `../../../.cursor/rules/`, y `ARCHITECTURE.md` + `BRAND.md` de la raíz.
