# Agenda propuesta — Talento MdP (DRAFT)

> **No cargar en Buffer hasta OK.**  
> Cadencia sugerida: **2 spotlights por semana** (mar + jue o lun + jue), ritmo sostenible con Buffer Free (10 slots/canal).

Horarios en **ART** (UTC−3). Convertidos a ISO UTC en `scripts/social/talento-queue-draft.json`.

## Cadencia

| Semana | Mar IG+X | Jue IG+X | Vie LinkedIn (opcional) |
|--------|----------|----------|-------------------------|
| 1 | Intro serie + Ian | Aeterna | — |
| 2 | Day | Uriel | Recap “2 historias” |
| 3 | Manu | Cristian | — |
| 4 | Emanuel | Axel | — |
| 5 | Federico | Cierre serie + CTA WhatsApp | Post LI cierre |

## Fechas tentativas (ajustar al OK)

Partiendo del próximo martes útil post-OK. **Placeholders** abajo asumen arranque **martes 28/07/2026**:

| Fecha | Canal | Pieza | ID draft |
|-------|-------|-------|----------|
| 28/07 10:00 | IG | Intro serie | `talento-intro-ig` |
| 28/07 10:00 | X | Intro serie | `talento-intro-x` |
| 28/07 13:00 | IG | Ian carousel | `talento-01-ian-ig` |
| 28/07 12:00 | X | Ian | `talento-01-ian-x` |
| 29/07 14:00 | LI | Ian | `talento-01-ian-li` |
| 31/07 13:00 | IG | Aeterna | `talento-02-aeterna-ig` |
| 31/07 12:00 | X | Aeterna | `talento-02-aeterna-x` |
| 04/08 13:00 | IG | Day | `talento-03-day-ig` |
| 04/08 12:00 | X | Day | `talento-03-day-x` |
| 05/08 14:00 | LI | Day | `talento-03-day-li` |
| 07/08 13:00 | IG | Uriel | `talento-04-uriel-ig` |
| 07/08 12:00 | X | Uriel | `talento-04-uriel-x` |
| 11/08 13:00 | IG | Manu | `talento-05-manu-ig` |
| 11/08 12:00 | X | Manu | `talento-05-manu-x` |
| 12/08 14:00 | LI | Manu | `talento-05-manu-li` |
| 14/08 13:00 | IG | Cristian | `talento-06-cristian-ig` |
| 14/08 12:00 | X | Cristian | `talento-06-cristian-x` |
| 18/08 13:00 | IG | Emanuel | `talento-07-emanuel-ig` |
| 18/08 12:00 | X | Emanuel | `talento-07-emanuel-x` |
| 19/08 14:00 | LI | Emanuel | `talento-07-emanuel-li` |
| 21/08 13:00 | IG | Axel | `talento-08-axel-ig` |
| 21/08 12:00 | X | Axel | `talento-08-axel-x` |
| 25/08 13:00 | IG | Federico | `talento-09-federico-ig` |
| 25/08 12:00 | X | Federico | `talento-09-federico-x` |
| 26/08 14:00 | LI | Cierre serie | `talento-cierre-li` |

## Notas Buffer Free

- Máx **10 posts programados por canal**. Ir cargando por oleadas (ej. 2 semanas adelante).
- Carrouseles IG: Buffer API del repo hoy manda **una** `imageUrl`. Para carrousel completo conviene subir las 5 imágenes **manualmente en Buffer UI** o Meta Business Suite, y dejar el copy en la queue.
- X/LI: una imagen de cover (`01-cover.png`) alcanza.

## Al dar OK

1. Confirmar fechas de arranque
2. Confirmar fotos reales en covers
3. Confirmar nombre de Federico
4. Copiar posts de `talento-queue-draft.json` → `content-queue.json` con `status: pending`
5. Subir carrouseles IG a Buffer (manual) o Meta
6. Avisar postulantes el día previo
