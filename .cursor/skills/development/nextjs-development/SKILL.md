---
name: nextjs-development
description: Implementar features en MdPDev con Next.js 15 App Router, React 19, Tailwind v4 y Supabase. Usar para desarrollo de páginas, componentes, lógica y migraciones.
paths:
  - "src/**"
  - "scripts/**"
---

# Next.js Development — MdPDev

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 App Router |
| UI | React 19, Tailwind CSS v4 |
| Lenguaje | TypeScript 5 strict |
| Estilos | `src/app/globals.css` (`@theme`) |
| DB | Supabase (Postgres + RLS + Auth) |
| Mapas | maplibre-gl (excepción documentada) |
| Iconos | SVG inline; `lucide-react` permitido |

## Patrones Next.js (Vercel best practices adaptados)

1. **Server-first**: fetch en RSC; pasar datos serializables a client islands
2. **Sin waterfalls**: paralelizar `Promise.all` en server components
3. **ISR cuando aplique**: `export const revalidate = N` con cliente público sin cookies
4. **Dynamic import**: librerías pesadas (maplibre, zxing) solo en `useEffect` o `dynamic()`
5. **Metadata API**: `generateMetadata` por ruta, no `<head>` manual

## Arquitectura

- Server component por defecto; `"use client"` solo en islas
- Páginas internas: `AppShell` + `shell-*`
- Sin UI libraries ni estado global
- Animaciones CSS puras

## Si toca base de datos

Ver skill `nomad-data-backend` y rule `10-nomad-hub-data.mdc`:
- Migración idempotente numerada
- RLS + vista `*_public`
- Tipos en `src/lib/types/`

## Si toca ruta nueva

Ver skill `nomad-seo`:
- `generateMetadata` + canonical
- JSON-LD + sitemap

## Ante ambigüedad

1. Detenerse
2. Escribir preguntas específicas
3. No asumir ni inventar requisitos

## Workflow

1. Leer issue Linear (contexto, criterios, archivos)
2. Revisar archivos existentes para seguir patrones
3. Implementar con scope mínimo
4. `npm run lint` + `npm run build`
5. Actualizar `ARCHITECTURE.md` si corresponde
6. Abrir PR con link al issue

## No debe

- Agregar dependencias npm sin aprobación
- Modificar archivos fuera del alcance del issue
- Marcar Done con errores conocidos
