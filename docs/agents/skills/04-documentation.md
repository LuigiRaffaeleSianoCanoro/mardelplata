# Skill 04 · Documentation

## Objetivo
Cuando este skill sea utilizado por un agente, debe poder mantener la documentación sincronizada sin pedir instrucciones adicionales, utilizando únicamente: el cambio detectado, este documento y la documentación del proyecto.

## Misión
Mantener toda la documentación del proyecto sincronizada con el estado real del código, la arquitectura y las decisiones de producto. Detectar documentación obsoleta y actualizarla proactivamente.

## Owns
- `ARCHITECTURE.md` — documento vivo de arquitectura.
- `README.md` — entrada del proyecto.
- `docs/` — toda la documentación del proyecto.
- `AGENTS.md` — instrucciones para agentes.
- `BRAND.md` — guía de marca (solo actualizaciones reflectivas).

## Reglas clave

### Cuándo actualizar documentación
1. **Nuevas rutas**: agregar en ARCHITECTURE.md §4 (estructura de rutas).
2. **Nuevos componentes**: agregar en ARCHITECTURE.md §5 (componentes) si son compartidos.
3. **Cambios de schema DB**: actualizar ARCHITECTURE.md §7 (Supabase schema + RLS).
4. **Nuevas dependencias**: actualizar ARCHITECTURE.md §2 (stack) y package.json section si existe.
5. **Cambios de configuración**: actualizar la sección correspondiente (env vars, deploy, etc.).
6. **Features descontinuadas**: marcar como obsoletas o eliminar la sección.

### Formato
- Mantener el tono y estructura existente del documento. No cambiar estilos de encabezados, tablas o listas.
- Las secciones nuevas deben seguir el orden alfabético o lógico del documento existente.
- Código en bloques con lenguaje especificado: ` ```ts `, ` ```sql `, ` ```bash `.
- Las rutas de archivo deben ser relativas a la raíz del proyecto.

### Detección de documentación obsoleta
Al iniciar una tarea de documentation, revisar:
1. ¿Hay archivos en `docs/` que mencionen código o rutas que ya no existen?
2. ¿Hay secciones en ARCHITECTURE.md que describan un estado anterior del proyecto?
3. ¿Hay ejemplos de código que ya no compilan o usan APIs deprecadas?
4. ¿Los comandos en la documentación siguen funcionando?

## Workflow
1. Detectar un cambio que requiere actualización de docs (por cambio en código, merge de PR, o decisión de producto).
2. Leer el documento a actualizar para entender su estructura actual.
3. Hacer los cambios necesarios: agregar, modificar o eliminar secciones.
4. Verificar que los links internos sigan funcionando.
5. Verificar que los ejemplos de código sean correctos (mentalmente o ejecutándolos).
6. Si se elimina documentación, dejar un redirect o nota de deprecación por al menos un mes.

## No debe
- Agregar documentación de features que no existen todavía.
- Eliminar documentación sin verificar que ya no se usa.
- Cambiar el formato o estructura del documento sin motivo.
- Documentar código no mergeado.
- Dejar ejemplos rotos o comandos que no funcionan.

## Inputs
- PR mergeado o cambio en código.
- Issue de Linear que implica cambios de arquitectura.
- Archivos modificados en el último merge.

## Outputs
- ARCHITECTURE.md actualizado.
- README.md actualizado (si corresponde).
- Otras docs en `docs/` ajustadas al nuevo estado.

## Done
- Documentación refleja el estado actual del código.
- Sin secciones obsoletas ni ejemplos rotos.
- Links internos verificados.
- `npm run build` ok (si se modificó código o metadata).

## Prompt de arranque (plantilla)
> Sos el agente de Documentation de MdPDev. Se detectó el siguiente cambio: **{descripción del cambio o PR mergeado}**. Revisá y actualizá la documentación del proyecto según `docs/agents/skills/04-documentation.md`. Verificá ARCHITECTURE.md, README.md y cualquier doc en `docs/` que referencie el área modificada. No documentes features que no existen. Verificá links y ejemplos.
