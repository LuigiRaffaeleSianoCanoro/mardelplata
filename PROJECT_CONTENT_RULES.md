# PROJECT_CONTENT_RULES.md — MdPDev

Reglas de contenido específicas de este repo. Complementan `AGENTS.md` (pack de content creation). Las **HARD RULES** de `AGENTS.md` siempre ganan; este archivo es más específico para la **comunidad MdPDev**.

**Nunca** incluir secretos, API keys, mails/teléfonos personales de miembros o asistentes, ni datos de `.env`.

## Project

- Name / brand as written: **MdPDev** (wordmark); dominio público **mardelplata.dev.ar** (también referenciado como mardelplata.dev en marca/docs).
- What it is (one concrete sentence): Comunidad independiente de desarrolladores, diseñadores y emprendedores de Mar del Plata y la costa atlántica — el hub tech de la costa.
- Audience (as they name themselves): Gente tech local y de la costa (devs, diseñadores, founders, estudiantes) que se suma a encuentros, bolsa y WhatsApp.
- Out of scope (projects/brands that must never appear here): Pavla, PsicoConecta, Disro, Builders OFF The Record, Shiplog, Builder en la Bahía, trabajo de ambassador Cursor/SpaceXSI, empresas personales de Luigi u otros proyectos ajenos a la comunidad.

## Brand

- Approved logo files (paths in this repo):
  - `public/mdpdev.png`
  - `public/brand/mardelplata-dev-ar-icon-192.png`, `public/brand/mardelplata-dev-ar-icon-512.png`
  - Mascota león marino: SVG inline en UI (ver `BRAND.md`); íconos decorativos en `public/avatar-icons/sea-lion.png`
  - Referencia completa: `BRAND.md` (raíz) y `docs/brand/BRAND.md`
- Colors (hex) and fonts:
  - Paleta **ocean** (primaria): p. ej. `ocean-900` `#020030`, `ocean-400` `#00B4D8` (CTA), resto en `BRAND.md` / `@theme` en `src/app/globals.css`
  - Paleta **sand** (acento cálido): ver `BRAND.md`
  - Display: **Space Grotesk** (títulos, wordmark)
  - Body: **Inter** (párrafos, UI)
  - Otros cargados en sitio (submarcas/rutas): Oswald, Fraunces, JetBrains Mono, Geist — usar solo donde el diseño de esa ruta lo define; marketing MdPDev = Space Grotesk + Inter
- Approved templates (plates, lower thirds, intro/outro, carousel):
  - Campañas/ejemplos: `docs/marketing/VISUAL-TEMPLATES.md`, assets en `docs/marketing/campaigns/`, `public/campaigns/`
  - Intro/outro de video para la comunidad: TBD (Luigi)
- NOT approved / do not use (POCs, old brands): Logo del faro (Faro Punta Mogotes) como logotipo de marca; mezclar identidad de otras empresas/proyectos.
- Instagram/TikTok safe-zone notes: **Nunca** logo chico + URL en la esquina superior izquierda (Instagram lo tapa). Layout **centrado**, logo **más grande**, URL **abajo** (mardelplata.dev.ar).

## Voice

- Person and register: **Primera persona del plural ("nosotros")** para la comunidad MdPDev — rioplatense, cercano, sin corporativismo. Tuteo a la audiencia. Ver `BRAND.md` § Tono y voz.
- Words and constructions banned in this project (in addition to `qa-texto-anti-tropes-llm`):
  - Tropes de LLM (paralelismos "no es X, es Y", correctio, etc.)
  - Copy en inglés para redes de la comunidad salvo nombres propios técnicos
  - "mardelplata.dev" solo en redes cuando el skill pide explícitamente el dominio corto; preferir **mardelplata.dev.ar** en piezas públicas
  - Hablar en nombre de sponsors o cifras de asistencia sin dato verificado
- Recurring people and exact spelling: Verificar siempre en fuente (perfil, Luma, planilla de consentimiento). No inventar ni abreviar nombres. TBD (Luigi): lista canónica de spelling recurrente.

## Channels and accounts

- Networks + public handles:
  - Web: https://mardelplata.dev.ar
  - Instagram: @mardelplata.dev.ar
  - X: @Mardeldev
  - LinkedIn: /company/mardelplata-dev
  - WhatsApp comunidad (CTA principal del sitio): https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs
- Scheduler used (e.g. Buffer) and plan limits: TBD (Luigi) — ver `tools/network_rules.json` para límites por red en el preflight de texto.
- Approval flow: **Nada se publica sin OK explícito de Luigi** en esa pieza y versión exacta. Este repo usa el pack en modo **solo borradores**; no programar ni publicar por Buffer (ni "Share now") hasta ese OK, aunque skills del pack mencionen Buffer como paso posterior.

## Assets

- Where masters, jingles, bumpers, B-roll, photos live: `public/`, `docs/marketing/campaigns/`, fotos de campaña en `docs/marketing/campaigns/*/photos/`; grabaciones de eventos: TBD (Luigi)
- Consent sources for featured people: Planilla de consentimiento de la comunidad — TBD (Luigi: ubicación/nombre del archivo o proceso).

## Claims

- Verified claims we can make (with source):
  - Aliado estratégico de ATICMA (ver `BRAND.md`)
  - Tagline: "El Hub Tech de la Costa Atlántica" (`BRAND.md`, marketing voice skill)
- Banned claims: Números de inscriptos/asistentes inventados; sponsors no confirmados; hablar por terceros o por empresas fuera de la comunidad.

## Video specifics

- Default formats and durations: Reels/Shorts según skill (`talk-clips-pipeline`: clips 20–60 s); vertical 9:16 1080×1920 para entrega móvil — ver `tools/preflight_deliver.sh` y `docs/ffmpeg-cookbook.md`
- Intro/outro rules: TBD (Luigi)
- Caption style (font, size, colors, position): Alinear a marca (fondos ocean, texto legible); detalle de burned-in subs: TBD (Luigi)

## Skills prioritarios (comunidad)

Para contenido MdPDev, priorizar: `social-promotion`, `event-creation`, `talk-clips-pipeline`, `builder-spotlight`, `blog-and-recaps`, `event-promo-interview-editor`, más `qa-texto-anti-tropes-llm` y `reel-production-complete-edit` + `video-review-package` cuando hay video.
