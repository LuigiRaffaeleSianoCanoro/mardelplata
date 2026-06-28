---
name: linear-workflow
description: Gestionar ciclo de vida de issues en Linear — estados, comentarios, prioridad y vínculo con PRs. Usar al trabajar issues, actualizar status o vincular código.
---

# Linear Workflow — MdPDev

Adaptado de [aussiegingersnap/cursor-skills/tools-linear](https://github.com/aussiegingersnap/cursor-skills).

## Cuándo usar

- Crear, actualizar o buscar issues
- Cambiar estado durante desarrollo
- Vincular PRs con comentarios en Linear

## Herramientas MCP Linear

| Tool | Uso |
|------|-----|
| `save_issue` | Crear o actualizar issues |
| `get_issue` | Detalle de un issue |
| `list_issues` | Buscar por equipo, estado, assignee |
| `save_comment` | Comentarios de progreso |
| `list_teams` | Obtener team ID |

## Convenciones de título

Formato: `[tipo] Descripción concreta`

Tipos: `feat`, `fix`, `chore`, `docs`, `perf`, `research`, `content`

## Descripción estándar

```markdown
## Contexto
[Por qué existe este issue]

## Criterios de éxito
- [ ] Criterio verificable 1
- [ ] Criterio verificable 2

## Archivos
- `src/...`

## Skill
`.cursor/skills/development/nextjs-development`

## QA notes
[Regresiones a vigilar]
```

## Prioridad

| Valor | Cuándo |
|-------|--------|
| 1 Urgent | Producción caída, seguridad, bloquea release |
| 2 High | Sprint actual, bugs visibles |
| 3 Medium | Trabajo planificado (default) |
| 4 Low | Nice-to-have, tech debt |

## Flujo de estados

```
Backlog → Todo → In Progress → In Review → Done
                     ↓
                  Blocked
```

### Al empezar trabajo

1. `save_issue` con `state: "In Progress"`
2. Crear rama `cursor/<area>-<feature>-<suffix>`

### Al abrir PR

1. Comentar en issue con link al PR (`save_comment`)
2. `state: "In Review"`
3. Linkear PR en descripción de GitHub

### Al mergear

1. `state: "Done"`
2. Comentario final si hay follow-ups

## Ramas

**No usar** auto-naming de Linear para branches. Gestionar ramas con git; vincular solo vía comentarios/PR description.

## Anti-patrones

- Issues en "In Progress" sin actividad
- Issues de 13+ puntos sin dividir
- Cambiar estado sin comentar contexto si hay bloqueo
