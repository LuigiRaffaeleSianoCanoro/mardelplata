---
name: qa-verification
description: Verificar calidad post-implementación — lint, build, checklist manual, clasificación de bugs. Usar al revisar PRs o features antes de merge.
---

# QA Verification — MdPDev

## Misión

Verificar que las features cumplan criterios de éxito, no rompan funcionalidad existente y sigan estándares de calidad.

## Comandos automáticos

```bash
npm run lint
npm run build
```

Con credenciales Supabase (features dinámicas):

```bash
npm run security:verify
npm run security:regression
```

## Clasificación de riesgo

| Nivel | Definición | Acción |
|-------|------------|--------|
| **Critical** | Bloquea funcionalidad principal | Bloquea merge |
| **High** | Comportamiento incorrecto en flujo principal | Bloquea merge sin plan de fix |
| **Medium** | Funcionalidad secundaria o visual significativo | Issue para siguiente sprint |
| **Low** | Cosmético o edge case raro | Backlog |

## Prioridades de testing

1. **Flujos críticos**: registro, login, perfil, bolsa, admin scanner
2. **Estado vacío**: toda página sin datos debe verse bien (no pantalla en blanco)
3. **Responsive**: 320px, 768px, 1024px — sin overflow horizontal
4. **Accesibilidad**: labels en forms, `aria-*` en dropdowns, chevron en FAQ `<details>`
5. **SEO**: metadata, canonical, JSON-LD en rutas nuevas

## Checklist manual (sin Playwright aún)

Basado en `docs/nomad-it-hub/06-audit-qa-plan.md`:

- [ ] Página carga sin error en consola (dev)
- [ ] Links internos funcionan
- [ ] Formularios validan y muestran feedback
- [ ] Estado vacío manejado con copy útil
- [ ] Mobile: navbar usable, sin overflow
- [ ] `prefers-reduced-motion`: animaciones se desactivan

## Qué NO testear (por ahora)

- Auth UI de Supabase (tercero)
- Tiles de OpenStreetMap
- Animaciones CSS puras

## Formato de reporte de bug

```markdown
## [bug] Componente — qué pasa

**Riesgo**: High

### Pasos para reproducir
1. ...

### Actual
...

### Esperado
...

### Entorno
viewport 375px, usuario anónimo
```

## No debe

- Aprobar PR con bugs Critical/High sin reportar
- Modificar código de feature para "arreglar" — solo reportar
- Ignorar accesibilidad

## E2E futuro

Cuando se agregue Playwright, extender este skill con `npx playwright test`. Ver referencia: [awesome-cursor-skills/adding-e2e-tests](https://github.com/spencerpauly/awesome-cursor-skills).
