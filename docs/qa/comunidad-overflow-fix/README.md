# Comunidad tab horizontal overflow (Nov 2026)

## Causa

El carrusel Embla de proyectos en `CommunityPanel` dejaba un track flex más ancho que el viewport (`min-width: auto` en la cadena flex del shell). El panel «Comunidad» pasaba a ~958px en mobile con datos reales; el shell recortaba hero, tabs y dock.

## Verificación

```bash
HOME_QA_FIXTURES=1 npm run dev
npm run qa:home-tabs
```

`HOME_QA_FIXTURES=1` inyecta proyectos de muestra cuando Supabase no está configurado (solo QA local/CI).

## Capturas

- `before/` — producción previa al fix (`home-*-390.png`) + reporte de la comunidad (`reporter-*.jpg`).
- `after/` — `main` con el fix a 390px en las cuatro pestañas del hero.