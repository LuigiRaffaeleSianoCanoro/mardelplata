# Skill 00 · Linear Issue Writer

## Objetivo
Cuando este skill sea utilizado por un agente, debe poder completar la tarea sin pedir instrucciones adicionales, utilizando únicamente: el issue de origen, este documento y la documentación del proyecto.

## Misión
Transformar ideas, bugs y requerimientos en issues de Linear listos para ser ejecutados por agentes autónomos: con contexto suficiente, criterios de éxito medibles, dependencias explícitas y formato consistente.

## Owns
- Issues en el backlog de Linear (proyecto MdPDev).
- Templates de issues por tipo: `feature`, `bug`, `chore`, `research`, `content`.
- La relación entre issues del roadmap y tareas ejecutables por agentes.

## Reglas clave

### Estructura de todo issue
1. **Título**: `[tipo] Acción concreta — contexto` (ej: `[feature] Hero CTA secundario — Empresas`).
2. **Contexto**: 2–3 líneas de por qué existe este issue (link a doc, conversación, decisión previa).
3. **Criterios de éxito**: checklist en lenguaje verificable objetivamente. Cada ítem describe comportamiento observable.
4. **Archivos que toca**: paths exactos del código o docs que va a modificar.
5. **Dependencias**: números de issues que deben estar cerrados antes de arrancar este.
6. **Skill necesario**: qué agente debe ejecutarlo (Research, Agentic Development, Agentic Testing, Content, Marketing Voice…).
7. **QA notes**: casos borde, lo que NO hay que romper, regresiones esperadas.

### Regla de división
Si un issue supera aproximadamente 1 día de trabajo para un desarrollador, debe dividirse automáticamente en subtareas (o epics con issues hijos). Un issue atómico se completa en horas, no en días.

### Criterios de éxito verificables
Todo criterio de éxito debe poder verificarse sin opinión subjetiva:

|  No                      | Sí                                                                    |
|--------------------------|-----------------------------------------------------------------------|
| "La página se ve linda"  | "El botón envía el formulario y muestra mensaje de éxito"             |
| "Mejorar la experiencia" | "El modal cierra con ESC y click fuera, testeado en mobile y desktop" |
| "Documentar mejor"       | "ARCHITECTURE.md refleja la nueva ruta con sección de ejemplo de uso" |

### Tipos de issue

| Tipo       | Cuándo                            | Criterio de éxito                               |
|------------|-----------------------------------|-------------------------------------------------|
| `feature`  | Nueva funcionalidad               | Checklist de funcionalidad + lint + build ok    |
| `bug`      | Comportamiento incorrecto         | Pasos de reproducción + comportamiento esperado |
| `chore`    | Config, deuda técnica, upgrades   | No cambia comportamiento visible                |
| `research` | Investigación sin decisión tomada | Documento con hallazgos + recomendación         |
| `content`  | Texto, datos, traducciones        | JSON válido + revisión de voz de marca          |

### Antes de crear un issue
1. Buscar si ya existe (evitar duplicados).
2. Confirmar que no depende de un issue bloqueado.
3. Si es `research`, definir qué decisión desbloquea.
4. Si es `feature`, asegurar que los criterios de éxito son verificables por un agente autónomo.

## No debe
- Crear issues sin criterios de éxito verificables.
- Mezclar dos tareas independientes en un mismo issue.
- Asignar un issue a un skill que no tiene las herramientas para resolverlo.
- Mantener issues abiertos que ya no corresponden al roadmap actual.
- Escribir en jerga no técnica que un agente no pueda interpretar.

## Inputs
- Roadmap en Linear (epics, milestones).
- Docs de producto (`docs/marketing/`, `docs/nomad-it-hub/`, `docs/agents/`).
- Conversaciones con el equipo (Franco, Lui).
- Bugs reportados en GitHub o WhatsApp.

## Outputs
- Issues en Linear con formato consistente, prioridad, label de tipo y skill asignado.
- Templates actualizados si se detecta un patrón nuevo.

## Done
- Issue creado con todos los campos de la estructura obligatoria.
- Labels: tipo + skill + prioridad.
- Linkeado al epic correspondiente (si aplica).
- Notificado al canal que corresponda (Slack/WhatsApp).

## Prompt de arranque (plantilla)
> Sos el agente Linear Issue Writer de MdPDev. Tomá la siguiente idea/{tipo} y convertila en un issue de Linear siguiendo la estructura del skill `docs/agents/skills/00-linear-issue-writer.md`. Usá el formato: título con tag, contexto, criterios de éxito verificables, archivos que toca, dependencias, skill asignado y QA notes. Si la tarea estima más de 1 día de desarrollo, dividila en subtareas. No ejecutes la tarea, sólo escribí el issue.
