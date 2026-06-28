# Skills — agentes especializados del Nomad & IT Hub

> **Fuente de verdad para Cursor:** `.cursor/skills/nomad-hub/` (formato `SKILL.md` oficial).
> Estos archivos son documentación narrativa complementaria.

Cada skill describe un **rol de agente** para ejecutar el proyecto en paralelo. Pensados para
lanzarse como Cloud Agents de Cursor (o ejecutarse en serie por un mismo agente).

| Skill (legacy) | Skill Cursor | Rol | Cuándo se lanza |
|---|---|---|---|
| [`00-orchestrator.md`](00-orchestrator.md) | [`orchestrator`](../../.cursor/skills/workflow/orchestrator/SKILL.md) | Planifica, distribuye y mergea en orden | siempre (coordina) |
| [`01-data-backend.md`](01-data-backend.md) | [`nomad-data-backend`](../../.cursor/skills/nomad-hub/data-backend/SKILL.md) | Supabase: migraciones, RLS, vistas, tipos, fetchers | ola 1–2 |
| [`02-ui-frontend.md`](02-ui-frontend.md) | [`nomad-ui-frontend`](../../.cursor/skills/nomad-hub/ui-frontend/SKILL.md) | Páginas, componentes, design system, navbar, home | ola 1–4 |
| [`03-seo.md`](03-seo.md) | [`nomad-seo`](../../.cursor/skills/nomad-hub/seo/SKILL.md) | sitemap/robots/metadata, JSON-LD, i18n, comparativas | ola 0 + continuo |
| [`04-content.md`](04-content.md) | [`nomad-content`](../../.cursor/skills/nomad-hub/content/SKILL.md) | Datasets curados (JSON), copy, fuentes, traducción EN | ola 1–3 |
| [`05-integrations.md`](05-integrations.md) | [`nomad-integrations`](../../.cursor/skills/nomad-hub/integrations/SKILL.md) | Roomix, `.ics`, analytics/UTM | ola 3 |

**Cómo usar:** el Orchestrator (o vos) elegís una tarea del DAG en
[`../05-agent-orchestration.md`](../05-agent-orchestration.md), tomás el skill correspondiente en
`.cursor/skills/`, y lanzás un agente con el prompt de arranque del skill.

**Antes de arrancar cualquier skill**, leer: `../README.md`, `../05-agent-orchestration.md`,
las reglas en `.cursor/rules/`, y `ARCHITECTURE.md` + `BRAND.md` de la raíz.
