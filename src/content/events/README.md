# Eventos curados (sync Luma)

Fuente en repo de eventos públicos de Luma para la home y `/eventos`. Complementa (y tiene prioridad sobre) filas legacy en Supabase `events`.

## Cuándo actualizar

Sync **dos veces por semana** (o cuando Luigi publique un evento nuevo en Luma):

1. Revisar perfiles Luma: [Mar del Plata Dev](https://luma.com/user/usr-de5FTdclyBwZ9cE), [Luigi Canoro](https://luma.com/user/usr-AiGJBby7CcB6NfQ), [ATICMA events](https://luma.com/user/ATICMA).
2. Solo incluir páginas **públicas** (no 404, no “private”, no waitlist cerrada sin página).
3. Verificar fecha, venue y hosts en la página de Luma.
4. Excluir siempre: Pavla, PsicoConecta, Disro, Builders OFF The Record, eventos privados de embajador Cursor, `luma.com/fktjzk1y` hasta publicación.

## Agregar o editar un evento

1. Crear `src/content/events/items/<slug-estable>.json` con este shape:

```json
{
  "id": "mi-evento-2026",
  "title": "Título como en Luma",
  "excerpt": "1–2 oraciones en voz MdPDev.",
  "date": "2026-10-17T14:00:00-03:00",
  "endDate": "2026-10-17T17:30:00-03:00",
  "venue": "Lugar · dirección corta",
  "city": "Mar del Plata",
  "hosts": ["Organizador", "Luigi Canoro"],
  "lumaUrl": "https://luma.com/xxxx",
  "tags": ["meetup", "IA"],
  "tier": "community",
  "verifiedAt": "2026-09-03"
}
```

- `tier`: `community` (MdPDev / Luigi / Franco) o `city` (ecosistema local: ATICMA, hackathons de terceros, etc.).
- Fechas en ISO con offset `-03:00` (Argentina).

2. Importar el JSON en `src/content/events/index.ts` y sumarlo al array `ALL_CURATED`.

3. `npm run lint && npm run build`.

## Criterios de inclusión

Incluir si:

- Ocurre en Mar del Plata **o**
- Lo organiza Luigi / Mar del Plata Dev **o**
- Es evento tech/ecosistema público en la ciudad (ATICMA, hackathons, meetups, coworks).

No inventar eventos sin URL Luma pública verificable.
