# Skill 02 · Agentic Development

## Objetivo
Cuando este skill sea utilizado por un agente, debe poder completar la tarea sin pedir instrucciones adicionales, utilizando únicamente: el issue de Linear, este documento y la documentación del proyecto.

## Misión
Implementar features, componentes y páginas del proyecto MdPDev de forma autónoma, respetando el stack, la arquitectura, el design system y los estándares de calidad del proyecto.

## Stack (inmodificable)
| Capa             | Tecnología                                                   |
|------------------|--------------------------------------------------------------|
| Framework        | Next.js 15 (App Router)                                      |
| UI               | React 19, Tailwind CSS v4                                    |
| Lenguaje         | TypeScript 5 (strict mode)                                   |
| Estilos globales | `src/app/globals.css` (tokens en `@theme` block)             |
| Base de datos    | Supabase (Postgres + RLS + Auth)                             |
| Mapas            | maplibre-gl (única excepción a no-UI-libs)                   |
| 3D               | three (solo en componentes existentes)                       |
| Smooth scroll    | lenis                                                        |
| Iconos           | SVG inline (lucide-react permitido)                          |
| Estado           | localStorage, URL searchParams, Supabase (sin estado global) |

## Owns
- `src/app/**` — rutas y páginas nuevas.
- `src/components/**` — componentes nuevos o modificación de existentes.
- `src/content/**` — datos estáticos tipados (JSON + tipos).
- `src/lib/**` — lógica de negocio, helpers, fetchers.
- `scripts/**` — migraciones SQL (solo si aplica, numeradas secuencialmente).

## Reglas clave

### Arquitectura
- **Server component por defecto.** `"use client"` solo en islas de interactividad (filtros, formularios, quizzes).
- **Páginas internas** usan `AppShell` + clases `shell-*` (ver `src/components/app/`).
- **Sin UI libraries.** Sin shadcn, sin radix, sin headless. Todo es CSS + componentes propios.
- **Sin estado global.** Los datos vienen de Supabase (server), JSON locales (content) o localStorage (preferencias).
- **Animaciones** solo CSS (clases existentes en globals.css) o `StaggerReveal`. No agregar librerías de animación.

### Base de datos (si aplica)
- Migraciones idempotentes y numeradas (`scripts/{NNN}_{descripcion}.sql`).
- Toda tabla con RLS; lectura pública solo de `published` vía vista `*_public`.
- No exponer columnas sensibles en vistas públicas.
- Tipos TS en `src/lib/types/` sincronizados con el schema.

### SEO
- Cada ruta nueva: `generateMetadata` con title + description + canonical.
- JSON-LD del tipo correcto (`WebSite`, `Organization`, `Event`, `FAQPage`, etc.) via `src/lib/seo/jsonLd.ts` + `<JsonLd>`.
- Sitemap actualizado (`src/app/sitemap.ts`).
- `hreflang` si hay versión EN.

### Brand / UI
- Design tokens de `globals.css @theme` (ocean, sand, ink, neon). No hardcodear colores.
- Voz de marca para textos visibles: `docs/marketing/skills/mdpdev-marketing-voice/SKILL.md`.
- Mobile-first responsive. Clases responsive con prefijo `max-` donde aplique.

### Ante ambigüedad
Si el issue es ambiguo o le falta información para completar la tarea, el agente debe:
1. **Detenerse.** No asumir comportamiento ni inventar requisitos.
2. **Escribir preguntas específicas** sobre lo que falta (con opciones si es posible).
3. **No avanzar** hasta recibir respuesta.

## Workflow
1. Tomar un issue de Linear con skill `agentic-development`.
2. Leer el contexto, criterios de éxito y archivos que toca del issue.
3. Si el issue es ambiguo → aplicar regla "Ante ambigüedad".
4. Revisar los archivos existentes que va a modificar (entender patrones).
5. Implementar la feature cumpliendo los criterios de éxito.
6. Verificar: `npm run lint` + `npm run build`.
7. Si hay migración SQL: verificar que corre limpia y re-corre sin error.
8. Actualizar `ARCHITECTURE.md` si la feature suma rutas, tablas o componentes nuevos.
9. Reportar Done o pedir revisión si algo queda fuera de su alcance.

## No debe
- Inventar información faltante.
- Modificar archivos fuera del alcance del issue.
- Cambiar arquitectura sin crear un issue de propuesta.
- Marcar una tarea como Done si hay errores conocidos.
- Agregar dependencias npm sin aprobación explícita.
- Asumir comportamiento cuando el issue es ambiguo — debe preguntar.

## Done
- `npm run lint` ok (sin nuevas warnings que no sean pre-existentes).
- `npm run build` ok.
- Criterios de éxito del issue cumplidos uno a uno.
- `ARCHITECTURE.md` actualizado si corresponde.
- PR abierto (si aplica) con descripción que linkea al issue.

## Prompt de arranque (plantilla)
> Sos el agente de Agentic Development de MdPDev. Implementá la feature descrita en **{issue de Linear o descripción}** según `docs/agents/skills/02-agentic-development.md`. Stack: Next.js 15 + React 19 + Tailwind v4 + TypeScript strict. Server component por defecto, AppShell para páginas internas, design tokens de globals.css, sin UI libraries. Si el issue es ambiguo, detenete y escribí preguntas — no asumas. Verificá con `npm run lint` y `npm run build`. Actualizá ARCHITECTURE.md si suma rutas o componentes nuevos.
