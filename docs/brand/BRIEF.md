# Design brief: mardelplata.dev.ar, v3 «Piedra & Código» + design refresh

## Qué es
El sitio de la comunidad dev de Mar del Plata y la costa atlántica (~700 personas): eventos, comunidad, prensa, empleos. En español. Marca siempre `mardelplata.dev.ar`. Sin métricas inventadas, sin WhatsApp como CTA.

## Gusto confirmado (hackathon Albert AI, oct 2026), aplicado sobre v3
1. Fondo casi negro (`#0a0a0a`) y **un solo acento**: se queda **Óxido `#ff5c26`** (hierro de la piedra Mar del Plata).
2. Titulares condensados en negrita (**Oswald**, mayúsculas) + cuerpo **Inter**. Geist Mono sigue para labels y metadata.
3. **Una foto con presencia** en el hero: la costa de noche con la piedra en primer plano. Logo chico en el header, nunca gigante en el hero.
4. Movimiento con propósito: stagger del hero, indicador de tab, overlays a 240 ms, reveal de la foto; todo con fallback `prefers-reduced-motion`.
5. Fotos reales antes que mockups. Las generadas no tienen gente, texto ni logos. Cuando haya fotos reales de juntadas (con permiso), reemplazan a las generadas.
6. shadcn/ui y **un único sistema de tokens** (`src/styles/v3.css`), mismos nombres semánticos que el sitio de Luigi y Albert AI.

## Pendiente de Luigi
- **Logo**: Rambla (`logo-1`), Prompt (`logo-2`) o Ficha (`logo-3`). Hoy: Rambla en el lockup, Ficha como favicon; se cambia en `components/v3/Logo.tsx`.

## Qué no cambia
Shell sin scroll, tabs, datos (eventos JSON + Supabase, prensa), deep links, subpáginas.
