# Agentes — MdPDev

Documentación de workflows para agentes de desarrollo, project management y QA.

## Estructura principal

La configuración ejecutable para Cursor vive en:

```
.cursor/
├── rules/     ← reglas .mdc (siempre o por glob)
└── skills/    ← workflows SKILL.md
```

Ver [`.cursor/README.md`](../../.cursor/README.md) para el mapa completo.

## Skills por área

### Workflow general

| Skill | Archivo Cursor |
|-------|----------------|
| Orchestrator | `.cursor/skills/workflow/orchestrator/` |
| PR quality gate | `.cursor/skills/workflow/pr-quality-gate/` |

### Linear (project management)

| Skill | Archivo Cursor |
|-------|----------------|
| Issue writer | `.cursor/skills/linear/linear-issue-writer/` |
| Workflow | `.cursor/skills/linear/linear-workflow/` |

### Desarrollo y QA

| Skill | Archivo Cursor |
|-------|----------------|
| Next.js development | `.cursor/skills/development/nextjs-development/` |
| Documentation | `.cursor/skills/development/documentation/` |
| QA verification | `.cursor/skills/testing/qa-verification/` |
| Security RLS | `.cursor/skills/testing/security-rls/` |
| Research | `.cursor/skills/research/research/` |

### Nomad & IT Hub

Ver `.cursor/skills/nomad-hub/` y `docs/nomad-it-hub/skills/`.

## Skills legacy (rama feat-agent-skills)

La rama `feat-agent-skills` contiene borradores en `docs/agents/skills/` que fueron migrados a `.cursor/skills/`:

- `00-linear-issue-writer` → `linear/linear-issue-writer`
- `01-research` → `research/research`
- `02-agentic-development` → `development/nextjs-development`
- `03-agentic-testing` → `testing/qa-verification`
- `04-documentation` → `development/documentation`

## Referencias externas

- [Cursor Agent Skills](https://cursor.com/docs/skills)
- [aussiegingersnap/cursor-skills](https://github.com/aussiegingersnap/cursor-skills) — Linear workflow
- [Vercel agent-skills](https://github.com/vercel-labs/agent-skills) — Next.js patterns
