# Templates Visuales — Kit de Identidad MdPDev

Specs para Canva Free y cualquier herramienta de diseño.

## Formatos por red

| Red | Dimensiones | Ratio | Notas |
|-----|-------------|-------|-------|
| Instagram feed | 1080 × 1080 | 1:1 | Principal |
| Instagram story | 1080 × 1920 | 9:16 | Eventos live |
| LinkedIn | 1200 × 627 | ~1.91:1 | Profesional |
| X / Twitter | 1600 × 900 | 16:9 | Copy corto |
| OG / Web | 1200 × 630 | — | Open Graph |

## Paleta (usar en Canva)

### Ocean (identidad core)

| Nombre | Hex | Uso |
|--------|-----|-----|
| Ocean Deep | `#020030` | Fondo principal |
| Ocean Mid | `#0077B6` | Acentos, botones |
| Ocean Bright | `#00B4D8` | CTAs, highlights |
| Ocean Light | `#48CAE4` | Gradientes |
| Sand | `#D4B483` | Acento cálido puntual |

### Shell (landing editorial)

| Nombre | Hex | Uso |
|--------|-----|-----|
| Shell BG | `#06070d` | Fondo dark posts |
| Sapphire | `#3b82f6` | Acento UI |
| Cyan | `#22d3ee` | Highlights |
| Magenta neon | `#FF2DAA` | Acento puntual (no dominar) |

## Tipografía en diseños

| Uso | Fuente | Peso |
|-----|--------|------|
| Títulos posts | Fraunces o Space Grotesk | Bold |
| Cuerpo | Inter | Regular/Medium |
| Labels / kicker | JetBrains Mono | Medium, uppercase |

## Logo placement

- **Mascota (león marino):** contenedor 40×40, gradiente ocean-300 → ocean-700, rounded-2xl
- **Wordmark:** MdPDev (Space Grotesk Bold) o mardelplata.dev con `</>` mark
- **Posición:** esquina inferior derecha o superior izquierda
- **Margen mínimo:** 24px desde bordes
- **NO usar:** faro como logo (solo decoración hero)

## Templates Canva (crear manualmente)

1. **Anuncio evento** — fondo ocean deep, título Fraunces blanco, fecha/hora cyan, logo abajo
2. **Quote comunidad** — fondo shell, quote en blanco 90%, kicker naranja `#FFB070`
3. **Oportunidad bolsa** — card style, título rol, CTA "Ver en mardelplata.dev/bolsa"
4. **Spotlight miembro** — foto/avatar circular, nombre, rol, quote corto
5. **Tip educativo** — número grande cyan, tip en Inter, hashtag #MdPDev

## Export

- PNG para Buffer (imágenes)
- JPG 90% quality si PNG muy pesado
- Max 5MB para Buffer API

## Brand assets en repo

- `public/mdpdev.png` — favicon / OG
- `BRAND.md` — reglas completas
- `/brand` — brand book interactivo
