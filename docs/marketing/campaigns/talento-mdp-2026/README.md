# Campaña: Talento MdP — Historias de la costa (v2)

> Serie de carrouseles IG + cards X. **No agendar en Buffer hasta OK.**
> **v2:** foto a sangre, tipografía más grande, menos aire vacío, cards 16:9 para X.

## Alcance de esta tanda

| Incluidos (7) | Excluidos (ya publicados / fuera) |
|---------------|-----------------------------------|
| Aeterna, Uriel, Manu, Cristian, Emanuel, Axel, Federico | **Ian Genta**, **Day**, **Matías Celiz** |

## Branding

Brand Core (ocean): foto edge-to-edge + overlays cyan/navy. Voz: `mdpdev-marketing-voice`. Handles: IG `@mardelplata.dev.ar` · X `@Mardeldev`.

## Slides IG (5 × 1080)

| # | Archivo | Punch |
|---|---------|-------|
| 1 | `01-cover` | Foto full-bleed + nombre grande + rol cyan |
| 2 | `02-quote` | Foto oscurecida + quote + barra cyan abajo |
| 3 | `03-moment` | Panel denso + foto inset |
| 4 | `04-building` | Título grande + strip cyan |
| 5 | `05-cta` | Split foto/brand + bloques serie/spotlight |

**X:** `cards-x/{slug}.png` (1600×900) — una card punchy por persona.

## Fotos — estado

Las 6 fotos del chat **no llegaron como archivos** al entorno del agente (solo descripción). Mientras tanto usamos avatares públicos low-res donde hay match:

| Slug | Foto ahora | Match con las que mandaste |
|------|------------|----------------------------|
| `manu-ponsa.jpg` | X @manuponsa (400px) | ✅ montañas / Fitz Roy |
| `emanuel.jpg` | LinkedIn (200px) | ✅ curly + piercing |
| `aeterna.jpg` | X @nahuelsigis (400px) | ⚠️ placeholder — la correcta es **remera con flor + mural** |
| `axel-castano` | ❌ initials | ✅ **traje formal** (confirmar) |
| `cristian-blanco` | ❌ initials | barba canosa / sonrisa |
| `federico-cayrol.jpg` | LinkedIn badge (200px) | ⚠️ no es la del chat |
| `uriel-lema` | ❌ initials | ¿selfie anteojos gruesos / hoodie? |

**Para calidad final:** dropeá JPGs en `photos/` con estos nombres y regeneramos:

```bash
python3 scripts/marketing/generate-talento-carousels.py
```

Mapa confirmado del chat → archivo:

| Foto del chat | Archivo |
|---------------|---------|
| Traje formal | `axel-castano.jpg` |
| Remera con flor + mural (Nahuel / Aeterna) | `aeterna.jpg` |
| Montañas / anteojos | `manu-ponsa.jpg` |
| Circular curly + piercing | `emanuel.jpg` |
| Barba canosa sonrisa | `cristian-blanco.jpg` |
| Selfie anteojos gruesos / hoodie | confirmar (¿Uriel o Federico?) |

## Archivos

```
docs/marketing/campaigns/talento-mdp-2026/
  README.md  COPY.md  SCHEDULE-DRAFT.md  applicants.json
  photos/  carousels/{slug}/  cards-x/
public/campaigns/talento-mdp-2026/
scripts/marketing/generate-talento-carousels.py
scripts/social/talento-queue-draft.json
```

## Buffer

Pipeline sí existe (`scripts/social/` + Actions). Esta campaña sigue en **draft** hasta OK. Carrousel IG completo = subir 5 PNGs en Buffer UI (la API manda 1 imagen).
