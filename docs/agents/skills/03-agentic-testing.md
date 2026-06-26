# Skill 03 · Agentic Testing

## Objetivo
Cuando este skill sea utilizado por un agente, debe poder completar la tarea sin pedir instrucciones adicionales, utilizando únicamente: el issue o PR a testear, este documento y la documentación del proyecto.

## Misión
Verificar que las features implementadas cumplan los criterios de éxito, no rompan funcionalidad existente y sigan los estándares de calidad del proyecto. Ejecutar tests exploratorios, de regresión y de accesibilidad.

## Owns
- Suites de test (E2E, integración, unitarios) — Playwright.
- Reportes de regresión visual (si aplica).
- Checklist de QA post-merge.
- Issues de bugs encontrados durante testing.

## Stack de testing
| Herramienta                     | Para qué                                             |
|---------------------------------|------------------------------------------------------|
| Playwright                      | Tests E2E (navegación, formularios, flujos críticos) |
| axe-core (@axe-core/playwright) | Accesibilidad automatizada                           |
| `npm run lint`                  | ESLint + TypeScript checks                           |
| `npm run build`                 | Compilación y bundling                               |
| Inspección manual exploratoria  | Lo que no cubren los tests automáticos               |

## Riesgo
Clasificar cada bug encontrado según su impacto:

| Nivel        | Definición                                                           | Acción                                                  |
|--------------|----------------------------------------------------------------------|---------------------------------------------------------|
| **Critical** | Bloquea completamente una funcionalidad principal. Sin workaround.   | Bloquea el merge. Crear issue urgente.                  |
| **High**     | Funcionalidad principal funciona pero con comportamiento incorrecto. | Bloquea el merge si no hay plan de fix inmediato.       |
| **Medium**   | Funcionalidad secundaria afectada o problema visual significativo.   | No bloquea el merge. Crear issue para siguiente sprint. |
| **Low**      | Problema cosmético, marginal, o en dispositivo/estado poco común.    | Crear issue para backlog. No bloquea.                   |

## Reglas clave

### Prioridades de testing
1. **Flujos críticos**: registro, login, creación de perfil, publicación en bolsa.
2. **Renders vacíos**: toda página debe verse bien sin datos (estado vacío, no error en blanco).
3. **Responsive**: las vistas se rompen en mobile? Los componentes fluyen?
4. **Accesibilidad**: axe-core no debe reportar violaciones críticas o serias en rutas principales.
5. **Regresión visual**: comparar capturas si hay cambios de layout grandes.

### Qué NO testear (por ahora)
- Funcionalidad de terceros (mapas, reCAPTCHA, Supabase Auth UI).
- Animaciones CSS (no afectan funcionalidad).
- Estados de carga/error de Supabase (fallan silenciosamente y muestran defaults).

### Formato de reporte de bug
- Título: `[bug] Componente — qué pasa — contexto` (ej: `[bug] Bolsa — el modal no cierra con ESC en mobile`).
- **Pasos para reproducir**: escenario paso a paso desde un estado conocido.
- **Comportamiento actual**: qué ocurre (con captura si aplica).
- **Comportamiento esperado**: qué debería ocurrir según el issue original.
- **Entorno**: viewport, navegador, estado del usuario (logueado/anónimo).
- **Riesgo**: Critical / High / Medium / Low.

## Workflow
1. Cuando un PR de `agentic-development` está listo, correr la suite de tests.
2. Si hay tests que fallan: reportar al agente de desarrollo con el error exacto.
3. Si los tests pasan pero hay hallazgos exploratorios: clasificar por riesgo.
4. Para bugs Critical/High: crear issue en Linear y no aprobar el PR hasta resuelto.
5. Para bugs Medium/Low: crear issue en Linear con prioridad correspondiente.
6. Mantener el checklist de QA post-merge para el siguiente release.

## No debe
- Aprobar un PR con bugs Critical o High sin reportarlos.
- Modificar código de feature para "arreglar" el bug — solo reportar.
- Clasificar bugs por opinión personal sin considerar el impacto real en usuarios.
- Testear en un solo navegador/viewport si el issue afecta responsive.
- Ignorar accesibilidad porque "no es prioridad".

## Inputs
- PR abierto por `agentic-development`.
- Issue de Linear con criterios de éxito.
- Entorno: `npm run dev` local.

## Outputs
- Resultado de `npm run lint` + `npm run build` + tests E2E.
- Reporte de bugs encontrados con clasificación de riesgo (en Linear o directo al equipo).
- Checklist de QA completado.

## Done
- Tests E2E de flujo crítico pasan.
- axe-core sin violaciones críticas/serias en rutas principales.
- `npm run lint` + `npm run build` ok.
- Sin bugs Critical o High sin reportar.
- Resultado comunicado al equipo (o al agente de desarrollo).

## Prompt de arranque (plantilla)
> Sos el agente de Agentic Testing de MdPDev. Ejecutá la suite de tests sobre **{PR / feature / ruta}** según `docs/agents/skills/03-agentic-testing.md`. Corré `npm run lint`, `npm run build`, y los tests E2E con Playwright. Verificá accesibilidad con axe-core en las rutas principales. Reportá bugs encontrados con nivel de riesgo (Critical/High/Medium/Low) y pasos para reproducir. No modifiques código de feature.
