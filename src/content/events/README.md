# Eventos curados (sync Luma)

Fuente en repo de eventos públicos de Luma para la home y `/eventos`. Complementa (y tiene prioridad sobre) filas legacy en Supabase `events`.

## Cómo se actualiza (sin PR por cambio)

Los eventos viven como JSON en `items/`. El script `scripts/sync-luma-events.mjs` consulta la API pública de Luma y actualiza fechas, título y hosts.

**Automático (recomendado):** GitHub Action `.github/workflows/events-sync.yml` corre **lunes y jueves 08:00 ART**, commitea directo a `main` (mismo patrón que `social-publish.yml`). Vercel redeploya solo.

**Manual local:**

```bash
npm run sync:events          # refrescar JSON existentes
npm run sync:events:discover   # + buscar eventos nuevos cerca de MDP
npm run verify:events
```

**Disparo manual en GitHub:** Actions → "Events Luma sync" → Run workflow. Opción `discover` para eventos nuevos.

**Grok Bot / agentes:** disparar el workflow con `workflow_dispatch` (GitHub API) en lugar de abrir un PR de contenido. Solo hace falta un PR cuando cambia el tooling (script, exclusiones, workflow).

## Agregar un evento nuevo (primera vez)

1. Crear `items/<slug-estable>.json` **o** correr `npm run sync:events:discover` y revisar el diff.
2. Ajustar `excerpt`, `tier` y `tags` si el auto-generado no alcanza.
3. Ya no hace falta editar `index.ts` — los JSON se cargan con glob.

Shape mínimo:

```json
{
  "id": "mi-evento-2026",
  "title": "Título como en Luma",
  "excerpt": "1–2 oraciones en voz MdPDev.",
  "date": "2026-10-17T14:00:00-03:00",
  "endDate": "2026-10-17T17:30:00-03:00",
  "venue": "Lugar · dirección corta",
  "city": "Mar del Plata",
  "hosts": ["Organizador"],
  "lumaUrl": "https://luma.com/xxxx",
  "tags": ["meetup", "IA"],
  "tier": "community",
  "verifiedAt": "2026-09-11"
}
```

- `tier`: `community` (MdPDev / Luigi) o `city` (ecosistema local).
- Fechas en ISO con offset `-03:00` (Argentina).

## Exclusiones

En `index.ts`: slugs privados (`fktjzk1y`, `b8qc0zng`) y patrones Pavla, PsicoConecta, Disro, Builders OFF The Record. El script de sync replica estas reglas.

## Fuentes Luma

Perfiles a vigilar: [Mar del Plata Dev](https://luma.com/user/usr-de5FTdclyBwZ9cE), [Luigi Canoro](https://luma.com/user/usr-AiGJBby7CcB6NfQ), [ATICMA](https://luma.com/user/ATICMA).

Descubrimiento geo configurado en `sources.json` (coordenadas MDP).

## Qué NO cubre hoy

- `/admin` edita solo Supabase legacy — no los JSON curados.
- No hay API HTTP en el sitio para sync (el path es GitHub Action o script local).
- Luma MCP no está conectado en este entorno; el script usa `api.lu.ma` / `api2.luma.com`.
