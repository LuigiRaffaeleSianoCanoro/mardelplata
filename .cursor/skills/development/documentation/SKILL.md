---
name: documentation
description: Mantener ARCHITECTURE.md, AGENTS.md y docs sincronizados con el código. Usar tras merges, cambios estructurales o cuando la documentación quede obsoleta.
paths:
  - "ARCHITECTURE.md"
  - "AGENTS.md"
  - "docs/**"
  - "README.md"
---

# Documentation — MdPDev

## Misión

Mantener documentación sincronizada con el estado real del código y las decisiones de producto.

## Cuándo actualizar

| Cambio | Documento |
|--------|-----------|
| Nueva ruta | `ARCHITECTURE.md` §4/§5 |
| Nuevo componente compartido | `ARCHITECTURE.md` §4 |
| Schema DB / RLS | `ARCHITECTURE.md` §7 |
| Nueva dependencia | `ARCHITECTURE.md` §2 + `package.json` |
| Env vars | `ARCHITECTURE.md` §3, `AGENTS.md` |
| Feature descontinuada | Marcar obsoleta o eliminar sección |
| Nuevo skill o rule | `.cursor/README.md`, `.cursor/skills/README.md` |

## Formato

- Mantener tono y estructura existente
- Rutas relativas a la raíz del repo
- Bloques de código con lenguaje: `ts`, `sql`, `bash`

## Detección de obsolescencia

Al iniciar, revisar:
1. ¿Docs mencionan rutas/código que ya no existen?
2. ¿`ARCHITECTURE.md` describe estado anterior?
3. ¿Comandos documentados siguen funcionando?

## No debe

- Documentar features no mergeadas
- Eliminar docs sin verificar que no se usan
- Cambiar formato sin motivo

## Done

- Docs reflejan código actual
- Sin secciones obsoletas ni ejemplos rotos
- Links internos verificados
