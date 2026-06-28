---
name: linear-issue-writer
description: Crear issues de Linear listos para agentes autónomos — criterios verificables, dependencias, archivos y skill asignado. Usar al recibir ideas, bugs o requerimientos.
---

# Linear Issue Writer — MdPDev

## Objetivo

Transformar ideas, bugs y requerimientos en issues ejecutables por agentes sin instrucciones adicionales.

## Estructura obligatoria de cada issue

1. **Título**: `[tipo] Acción concreta — contexto` (ej: `[feature] Hero CTA secundario — Empresas`)
2. **Contexto**: 2–3 líneas de por qué existe (link a doc, decisión previa)
3. **Criterios de éxito**: checklist verificable objetivamente
4. **Archivos que toca**: paths exactos
5. **Dependencias**: issues que deben estar cerrados antes
6. **Skill necesario**: skill de `.cursor/skills/` que lo ejecuta
7. **QA notes**: casos borde, regresiones esperadas

## Tipos de issue

| Tipo | Cuándo | Criterio base |
|------|--------|---------------|
| `feature` | Nueva funcionalidad | Checklist + lint + build |
| `bug` | Comportamiento incorrecto | Repro steps + esperado |
| `chore` | Config, deuda, upgrades | Sin cambio visible |
| `research` | Sin decisión tomada | Hallazgos + recomendación |
| `content` | Texto, datos, traducciones | JSON válido + voz de marca |

## Criterios verificables — ejemplos

| No | Sí |
|----|-----|
| "La página se ve linda" | "El botón envía el formulario y muestra mensaje de éxito" |
| "Mejorar la experiencia" | "El modal cierra con ESC y click fuera en mobile y desktop" |

## Regla de división

Si estima >1 día de desarrollo → dividir en subtareas o issues hijos.

## Antes de crear

1. Buscar duplicados (`list_issues` con query)
2. Confirmar que no depende de issue bloqueado
3. Si es `research`, definir qué decisión desbloquea

## MCP Linear

Usar `save_issue` con `team` requerido al crear. Labels sugeridos: tipo + skill + área (`frontend`, `backend`, `content`, `seo`).

## No debe

- Crear issues sin criterios verificables
- Mezclar dos tareas independientes
- Asignar skill sin herramientas para resolverlo
