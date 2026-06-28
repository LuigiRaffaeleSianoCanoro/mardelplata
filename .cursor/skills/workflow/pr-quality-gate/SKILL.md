---
name: pr-quality-gate
description: Verificar calidad de un PR antes de merge — lint, build, scope, docs y checklist de done. Usar al cerrar un PR o antes de pedir review.
---

# PR Quality Gate

## Misión

Asegurar que un PR está listo para merge sin regresiones obvias ni deuda documental.

## Checklist obligatorio

```bash
npm run lint
npm run build
```

Si el PR toca Supabase/RLS:

```bash
npm run security:verify    # requiere credenciales
npm run security:regression
```

## Revisión de scope

- [ ] El diff solo toca archivos relacionados con la tarea
- [ ] No hay refactors no pedidos ni dependencias nuevas sin justificación
- [ ] No se commitean secrets ni `.env.local`

## Revisión documental

- [ ] `ARCHITECTURE.md` actualizado si hay rutas, schema, deps o flujos nuevos
- [ ] Migraciones SQL idempotentes y numeradas en orden
- [ ] Si hay ruta nueva del hub: metadata + sitemap + JSON-LD (coordinar con skill `nomad-seo`)

## Revisión de PR

- [ ] Título descriptivo
- [ ] Descripción con qué cambió y por qué
- [ ] Link a issue de Linear si existe
- [ ] Screenshots si hay cambios visuales

## Ante fallos

- Lint/build roto → bloquea merge
- Warnings `<img>` vs `<Image>` preexistentes → no bloquean
- Bugs Critical/High de QA → bloquean hasta fix o issue separado

## Post-merge

- Actualizar issue Linear a Done
- Comentar en Linear con link al PR mergeado
