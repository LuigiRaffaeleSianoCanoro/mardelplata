# Campaña: Talento MdP — Historias de la costa

> Serie de carrouseles IG (+ adaptaciones X / LinkedIn) con postulantes del form de historias de talento.
> **Estado:** assets + copy listos en PR. **No agendar en Buffer hasta OK explícito.**

## Brief

| Campo | Valor |
|-------|-------|
| Pilar | Comunidad (spotlight miembros) |
| Formato | Carrousel IG 5 slides · 1080×1080 |
| Handles | IG `@mardelplata.dev.ar` · X `@Mardeldev` |
| Fuente | [Google Sheet postulaciones](https://docs.google.com/spreadsheets/d/1Pk2h_vui1S4ipvF3J5voC6mHv2pUPut2EiCZu4jKhCY) |
| Postulantes | 9 (todos autorizaron uso de texto + imagen) |
| Voz | Brand Core / marketing voice — tuteo, local, sin jerga corporativa |

## Branding aplicado (investigación)

Antes de producir se revisó:

- `BRAND.md` § Brand Core (ocean + Space Grotesk / Inter) — capa para marketing externo
- `docs/marketing/VISUAL-TEMPLATES.md` — formato spotlight + specs 1080×1080
- `docs/marketing/skills/mdpdev-marketing-voice/` — tono y reglas por red
- `docs/marketing/CONTENT-CALENDAR-Q3-2026.md` — pilar Comunidad / spotlights
- `scripts/social/` — pipeline Buffer existente

**Decisiones de diseño**

- Capa 1 (Brand Core), no Editorial Shell: ocean-900 fondo, ocean-400 CTA, olas sutiles
- Wordmark **MdPDev** + mark en contenedor rounded
- Sin cards flotantes ni badges sobre la foto
- 5 slides por persona: cover → quote → momento → construyendo → CTA comunidad
- Hashtags fijos: `#MdPDev #MarDelPlata #TalentoMdP`

## Estructura de slides

| # | Archivo | Contenido |
|---|---------|-----------|
| 1 | `01-cover.png` | Avatar/foto, nombre, rol, serie 0N/09 |
| 2 | `02-quote.png` | “Ser dev en Mar del Plata es…” |
| 3 | `03-moment.png` | Momento que marcó el camino |
| 4 | `04-building.png` | Proyecto / lo que más le gusta |
| 5 | `05-cta.png` | CTA comunidad + handles |

## Postulantes (orden sugerido de publicación)

| # | Slug | Nombre en post | Rol | Nota |
|---|------|----------------|-----|------|
| 01 | `ian-genta` | Ian Genta | Python Dev | CoraSmart |
| 02 | `aeterna` | Aeterna | Fullstack | Quiere aparecer como Aeterna (no Nahuel) |
| 03 | `day-aloy` | Day | Soporte / QA & Hardware | Daloy Tech |
| 04 | `uriel-lema` | Uriel Lema | Fullstack | Accesibilidad / inclusión — tono cuidadoso |
| 05 | `manu-ponsa` | Manu | Software & Data | Picsel + Blueprint Data |
| 06 | `cristian-blanco` | Cristian Blanco | Emprendedor Tech | HealthyFleet · 20 años de camino |
| 07 | `emanuel` | Emanuel | Fullstack | INKODE |
| 08 | `axel-castano` | Axel | Frontend / Data | Junior 19 — tono alentador |
| 09 | `federico-cayrol` | Federico | Builder | Form puso display “No” → usamos Federico; **confirmar** |

## Fotos — acción requerida

Las fotos del form están en Google Drive **sin acceso público** (“Anyone with the link”). Desde este entorno no se pudieron descargar.

1. Abrí cada archivo del Drive y compartilo como “Cualquier persona con el enlace → Lector”, **o**
2. Descargá las fotos y dejálas en `photos/{slug}.jpg` (ver `photos/README.md`)
3. Regenerá: `python3 scripts/marketing/generate-talento-carousels.py`

Mientras tanto los covers usan **avatar con iniciales** (branded). No publicar covers sin foto real salvo excepción.

## Archivos

```
docs/marketing/campaigns/talento-mdp-2026/
  README.md                 ← este archivo
  applicants.json           ← datos curados del form
  COPY.md                   ← copy IG / X / LinkedIn por persona
  SCHEDULE-DRAFT.md         ← propuesta de agenda (no en Buffer aún)
  photos/                   ← dropear fotos acá
  carousels/{slug}/*.png    ← slides (también en public/…)

public/campaigns/talento-mdp-2026/{slug}/*.png
  → URLs públicas post-deploy:
    https://mardelplata.dev.ar/campaigns/talento-mdp-2026/{slug}/01-cover.png

scripts/marketing/generate-talento-carousels.py
scripts/social/talento-queue-draft.json  ← borrador Buffer (status: draft)
```

## Buffer — estado del proyecto

Sí hay pipeline Buffer en este repo:

| Pieza | Ubicación |
|-------|-----------|
| Publisher | `scripts/social/buffer-publish.mjs` |
| Queue viva | `scripts/social/content-queue.json` |
| Autopublish | `.github/workflows/social-publish.yml` (3×/día) |
| Docs | `scripts/social/README.md`, `docs/marketing/FREE-TOOLS-STACK.md` |
| Canales esperados | Instagram, X, LinkedIn (secrets `BUFFER_*`) |

**Limitación de este run:** no hay `BUFFER_API_KEY` en el entorno del agente ni permiso para listar secrets de GitHub. No se pudo verificar live si la cuenta Buffer de MdPDev está conectada y sana. La queue Q3 tiene posts `pending` con fechas ya vencidas (jul 2026) — conviene chequear si los secrets están cargados y si el workflow corre.

**Esta campaña:** copy + imágenes en PR; agenda en `SCHEDULE-DRAFT.md` y `talento-queue-draft.json`. Cuando des el OK, se pasan a `content-queue.json` con fechas concretas.

## Checklist pre-publicación

- [ ] Fotos reales en covers (o OK explícito para initials)
- [ ] Confirmar display name de Federico
- [ ] Review copy (sobre todo Uriel / Axel — sensibilidad)
- [ ] Deploy o hosting de PNGs para `imageUrl` en Buffer
- [ ] OK para agendar → merge draft → Buffer
- [ ] Avisar a cada postulante el día de su spotlight (buena práctica)
