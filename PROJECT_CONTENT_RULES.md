# PROJECT_CONTENT_RULES.md — MdPDev

Reglas de contenido específicas de este repo. Complementan `AGENTS.md` (pack de content creation). Las **HARD RULES** de `AGENTS.md` siempre ganan; este archivo es más específico para la **comunidad MdPDev**.

**Nunca** incluir secretos, API keys, mails/teléfonos personales de miembros o asistentes, ni datos de `.env`.

## Project

- Name / brand as written: **MdPDev** (wordmark); dominio público **mardelplata.dev.ar** (también **mardelplata.dev** en wordmark/nav según `BRAND.md`).
- What it is (one concrete sentence): Comunidad independiente de desarrolladores, diseñadores y emprendedores de Mar del Plata y la costa atlántica — el hub tech de la costa (sitio: «El Club Tech de Mar del Plata»).
- Audience: Gente tech local y de la costa (devs, diseñadores, founders, estudiantes) que se suma a encuentros, bolsa, WhatsApp y contenidos de la comunidad.
- Out of scope: Pavla, PsicoConecta, Disro, Builders OFF The Record, Shiplog, Builder en la Bahía, trabajo de ambassador Cursor/SpaceXSI, empresas personales de Luigi u otros proyectos ajenos a la comunidad.

### Próximos hitos (contenido)

- **Grok Bot Mar del Plata Meetup** — Vie **27/11/2026**, 18–21 ART, UTN FRMdP (`src/content/events/items/grok-bot-meetup-mdp-2026.json`, Luma `https://luma.com/fktjzk1y`, visible en https://mardelplata.dev.ar/eventos ).
- **MLH Hack Day (Mar del Plata)** — **16/01/2027** (fecha confirmada por Luigi, 10/11/2026). **No** figura aún en https://mardelplata.dev.ar/eventos ni en el listado público de MLH al 10/11/2026: no anunciar lugar/inscripción hasta que exista página Luma/evento en el sitio y Luigi dé OK.

## Brand

- Approved logo files (paths in this repo):
  - `public/mdpdev.png`
  - `public/brand/mardelplata-dev-ar-icon-192.png`, `public/brand/mardelplata-dev-ar-icon-512.png`
  - Mascota león marino: SVG inline en UI (ver `BRAND.md`); íconos en `public/avatar-icons/sea-lion.png`
  - Referencia completa: `BRAND.md`, `docs/brand/BRAND.md`, `docs/marketing/VISUAL-TEMPLATES.md`
- Colors (hex) and fonts:
  - **Ocean** (primaria): p. ej. `ocean-900` `#020030`, `ocean-400` `#00B4D8`, tabla completa en `BRAND.md` / `src/app/globals.css` (`@theme`)
  - **Sand** (acento): ver `BRAND.md`
  - Marketing / posts: **Space Grotesk** (títulos, wordmark) + **Inter** (cuerpo) — `BRAND.md`, `VISUAL-TEMPLATES.md`
- Approved templates (plates, lower thirds, intro/outro, carousel):
  - Carruseles y cards: `docs/marketing/VISUAL-TEMPLATES.md`, `public/campaigns/`, `docs/marketing/campaigns/`
  - **Builder Spotlight:** 5 slides 1440×1440 (spec en `.agents/skills/builder-spotlight/SKILL.md`)
  - **Intro/outro de video (comunidad):** no hay masters de motion commitados en este repo (a diferencia de Builder en la Bahía). Usar **intro slate** de evento (nombre + ciudad + fecha ART) y cierre con logo/URL abajo según `event-promo-interview-editor` y reglas IG de este archivo.
- NOT approved: Logo del faro como logotipo de marca; identidad Pavla/Bahía/otros proyectos; masters Bahía v5.4 en piezas MdPDev.
- Instagram/TikTok safe-zone: **Nunca** logo chico + URL arriba a la izquierda. Layout **centrado**, logo **grande**, URL **abajo** (`mardelplata.dev.ar`).

## Voice

- Person and register: **Primera persona del plural («nosotros»)** para MdPDev — rioplatense, cercano (`BRAND.md` §4, `docs/marketing/skills/mdpdev-marketing-voice/SKILL.md`).
- Words and constructions banned: tropes LLM (`qa-texto-anti-tropes-llm`); copy en inglés en redes salvo nombres técnicos; cifras de asistencia/inscriptos sin fuente; sponsors no confirmados.
- Recurring people and exact spelling (usar tal cual en `src/content/events/` y campañas verificadas):
  - Organizadores frecuentes: **Luigi Canoro**, **Franco Petruccelli**, **Matias Celiz**, **Manuel Ponsa**, **Andres Cuñer**, **Nicolas E. Giménez**, **Mar del Plata Dev** (marca en hosts).
  - Campaña Talento MdP 2026 (`docs/marketing/campaigns/talento-mdp-2026/applicants.json`): respetar `display_name` / `full_name` (ej. **Aeterna** = Nahuel Sigismondi; **Facundo Emanuel Jimenez Bustos**; **Axel Gabriel Castaño** con tilde en apellido; **Uriel Andrés Lema**; **Manuel Ponsa**; **Cristian Blanco**; **Federico Cayrol**).
  - Cualquier otra persona: spelling desde perfil público verificado (LinkedIn/Luma/formulario), nunca adivinar. Si hay conflicto, preguntar a Luigi antes del borrador final.

## Channels and accounts

- Networks + public handles (fuente única en código: `src/lib/community.ts`):
  - Web: https://mardelplata.dev.ar
  - Instagram: https://www.instagram.com/mardelplata.dev.ar/ (`@mardelplata.dev.ar`)
  - X: https://x.com/Mardeldev (`@Mardeldev`)
  - LinkedIn: https://www.linkedin.com/company/mardelplata-dev
  - WhatsApp comunidad (CTA del sitio): https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs
- Scheduler: **Buffer** plan **Free** — 3 canales (IG, X, LinkedIn), hasta **10 posts programados por canal**, API ~3000 req/mes (`docs/marketing/FREE-TOOLS-STACK.md`). Cola/autopublish técnico: `.github/workflows/social-publish.yml` + `scripts/social/` (requiere secrets en GitHub; no versionar keys).
- Approval flow: **Nada se publica sin OK explícito de Luigi** en esa pieza y versión. El pack de content creation trabaja en **solo borradores**; no cargar Buffer ni usar «Share now» hasta ese OK (aunque los skills mencionen Buffer como paso posterior aprobado).

## Assets

- Masters visuales, fotos de campaña, carruseles exportados:
  - `public/`, `public/campaigns/`, `docs/marketing/campaigns/` (p. ej. Talento MdP 2026)
  - Guías de diseño: `docs/marketing/VISUAL-TEMPLATES.md`, `BRAND.md`
- Grabaciones de eventos (video fuente): **no** se versionan en git (tamaño). Fuentes de metadatos en repo: `src/content/events/items/*.json` (`lumaUrl`, fechas, hosts), crónicas en `src/content/prensa/archives/`. **Procedimiento:** al iniciar un trabajo de video, Luigi indica la ruta/Drive del material; bloquear edición hasta tener el archivo fuente correcto (`video-review-package`).

## Consent and featured people

Regla operativa (no hay URL pública del formulario «Historias tech» en este repo; revisado grep del repo y pack, 10/11/2026):

1. **Builder Spotlight / Historias tech (v1/v2):** datos viven en Google Form/Sheet administrado por Luigi (fuera del repo). **Antes** de armar un spotlight: pedir a Luigi acceso de solo lectura; usar solo filas con consentimiento **«Sí, autorizo»** y pestaña **Elegibilidad = PUBLICABLE** (criterio del skill `builder-spotlight`). **Nunca** copiar teléfonos, mails ni filas completas al repo ni a prompts.
2. **Campaña Talento MdP:** publicar solo entradas con `"permission": true` en `docs/marketing/campaigns/talento-mdp-2026/applicants.json` (origen declarado: Google Sheet en ese JSON, sin credenciales).
3. **Charlas/eventos:** rostros en piezas nuevas solo si ya están publicados en mardelplata.dev.ar/prensa o eventos, o Luigi autoriza esa versión en Review.
4. Si falta consentimiento o perfil incompleto: **no publicar**; elegir otro candidato o salteear el mes (`builder-spotlight`).

## Claims

- Verified claims we can make:
  - Aliado estratégico de **ATICMA** (`BRAND.md`)
  - Tagline: **«El Hub Tech de la Costa Atlántica»** (`BRAND.md`)
  - Grupo de WhatsApp de la comunidad: **~850 miembros** (dato confirmado por Luigi, **27/10/2026**). No usar cifras viejas de prensa (ej. «500+» en archivo 0223) en copy nuevo sin actualizar con Luigi.
- Banned claims: inscriptos/asistentes inventados; sponsors no confirmados; fechas/lugares de MLH Hack Day 16/01/2027 hasta publicación oficial; hablar por terceros.

## Video specifics

- Default formats: clips 20–60 s (`talk-clips-pipeline`); entrega móvil **1080×1920** 9:16 — `tools/preflight_deliver.sh`, `docs/ffmpeg-cookbook.md`
- Intro/outro rules (MdPDev):
  - Promos de entrevista/evento: **intro slate** (evento + ciudad + fecha ART) + cierre breve; mantener preguntas del host en promos (`event-promo-interview-editor`)
  - Sin intro motion Bahía ni jingle comunitario en repo
  - Logo/cierre: wordmark o `public/mdpdev.png`, URL **abajo**, no esquina superior izquierda
- Caption style (burned-in subs, verificado en cookbook):
  - Fuente **Inter Bold**, **FontSize 64** (canvas 1080×1920)
  - Blanco `#FFFFFF`, outline negro **4px**, **alineación inferior centro** (`Alignment=2`), **MarginV ≈ 420** (sobre UI de Reels, sin tapar ojos/boca)
  - Receta: `docs/ffmpeg-cookbook.md` §5.1; QA visual: `docs/ffmpeg-test-results.md`

## Style references (tono visual copy)

- Voz: `docs/marketing/skills/mdpdev-marketing-voice/SKILL.md`
- Ejemplos publicados Talento: `docs/marketing/campaigns/talento-mdp-2026/COPY.md`
- No existe `STYLE.md` en repo; usar esos archivos + `builder-spotlight` / `VISUAL-TEMPLATES.md`

## Skills prioritarios (comunidad)

`social-promotion`, `event-creation`, `talk-clips-pipeline`, `builder-spotlight`, `blog-and-recaps`, `event-promo-interview-editor`, más `qa-texto-anti-tropes-llm` y, con video, `reel-production-complete-edit` + `video-review-package`.

## Fuentes

| Dato | Fuente consultada |
|------|-------------------|
| Handles y WhatsApp | `src/lib/community.ts` |
| Voz, tagline, paleta, tipografías | `BRAND.md`, `src/app/layout.tsx`, `docs/marketing/VISUAL-TEMPLATES.md` |
| Logos en repo | `public/mdpdev.png`, `public/brand/*` |
| Evento Grok Bot 27/11/2026 | `src/content/events/items/grok-bot-meetup-mdp-2026.json`, https://mardelplata.dev.ar/eventos |
| MLH Hack Day 16/01/2027 | Confirmación Luigi vía instrucción de trabajo (10/11/2026); ausencia en sitio/MLH público verificada 10/11/2026 |
| WhatsApp ~850 miembros | Confirmación Luigi (27/10/2026) |
| Buffer Free (límites) | `docs/marketing/FREE-TOOLS-STACK.md`, `tools/network_rules.json` |
| Autopublish técnico | `.github/workflows/social-publish.yml`, `scripts/social/README.md` |
| Spelling Talento 2026 | `docs/marketing/campaigns/talento-mdp-2026/applicants.json` |
| Spelling hosts eventos | `src/content/events/items/*.json` |
| Subtítulos quemados (spec) | `docs/ffmpeg-cookbook.md`, `docs/ffmpeg-test-results.md` |
| Consentimiento Builder Spotlight | Skill `builder-spotlight`; sin URL de form en repo (grep 10/11/2026) — procedimiento operativo arriba |
| Home / posicionamiento | https://mardelplata.dev.ar/ (fetch 10/11/2026) |
