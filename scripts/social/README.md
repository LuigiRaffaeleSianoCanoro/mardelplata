# Social Autopublishing — MdPDev

Pipeline gratuito para publicar en redes vía Buffer API + GitHub Actions.

## Quick start

1. Crear cuenta [Buffer](https://buffer.com) (plan Free)
2. Conectar Instagram, X y LinkedIn
3. Generar API key en Buffer Settings → API
4. Obtener channel IDs:

```bash
BUFFER_API_KEY=your_key node scripts/social/list-channels.mjs
```

5. Agregar secrets en GitHub (repo → Settings → Secrets):

| Secret | Valor |
|--------|-------|
| `BUFFER_API_KEY` | API key |
| `BUFFER_CHANNEL_INSTAGRAM` | Channel ID |
| `BUFFER_CHANNEL_X` | Channel ID |
| `BUFFER_CHANNEL_LINKEDIN` | Channel ID |

6. El workflow `.github/workflows/social-publish.yml` publica automáticamente 3×/día.

## Manual publish

```bash
# Dry run (no publica)
BUFFER_API_KEY=xxx \
BUFFER_CHANNEL_X=xxx \
node scripts/social/buffer-publish.mjs --dry-run

# Publicar posts vencidos en la queue
BUFFER_API_KEY=xxx \
BUFFER_CHANNEL_INSTAGRAM=xxx \
BUFFER_CHANNEL_X=xxx \
BUFFER_CHANNEL_LINKEDIN=xxx \
node scripts/social/buffer-publish.mjs
```

## Content queue

Editar `content-queue.json`:

```json
{
  "id": "unique-id",
  "channel": "instagram | x | linkedin",
  "scheduledAt": "2026-07-01T13:00:00.000Z",
  "status": "pending",
  "text": "Post copy...",
  "imageUrl": "https://optional-image.png"
}
```

Status values: `pending`, `published`, `failed`, `cancelled`

Calendario editorial: `docs/marketing/CONTENT-CALENDAR-Q3-2026.md`

## Copy guidelines

Usar el skill `.cursor/skills/mdpdev-marketing-voice/` o `BRAND.md` §4.

## Docs

- `docs/marketing/FREE-TOOLS-STACK.md`
- `docs/marketing/PLAN.md`
- Linear: MAR-8
