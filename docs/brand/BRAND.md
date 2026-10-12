# Brand kit: mardelplata.dev.ar (v3 + design refresh)

Reemplaza a `BRAND.md` (v2, MdPDev/ocean) para el shell v3. Tokens en `src/styles/v3.css` (scope `.v3-shell`). Componentes: sólo tokens, sin hex sueltos.

## Nombre y voz
- Siempre `mardelplata.dev.ar`, minúscula, `.dev.ar` en Geist Mono y `--muted-foreground`.
- Español argentino, de comunidad: «sumate», «anotarme al próximo». Sin métricas inventadas (~700 personas es el dato).

## Logo (pendiente de elección)
Rambla / Prompt / Ficha, todos `currentColor`, viewBox 64. Lockup: marca 26px + `mardelplata` + `.dev.ar`. Siempre chico en el header (56px de alto), nunca en el hero.

## Color
| Token | Dark | Light | Uso |
|---|---|---|---|
| `--background` | `#0a0a0a` | `#fafafa` | Fondo |
| `--foreground` | `#ededed` | `#0a0a0a` | Texto |
| `--muted-foreground` | `#a1a1a1` | — | Bajadas, labels |
| `--card` | `#0f0f0f` | `#ffffff` | Cards |
| `--border` / `--border-strong` | `#1f1f1f` / `#2e2e2e` | — | Hairlines 1px |
| `--primary` | `#ededed` | `#0a0a0a` | Botón primario (estilo Vercel) |
| `--oxido` / `--ring` | `#ff5c26` | `#e5480f` | El único acento: dot «Próximo», focus, cursor Prompt, toasts |

## Tipografía
- Display: **Oswald** 700, mayúsculas, tracking `-0.005em`, interlineado `0.95` (`.v3-display`, `--font-display`).
- Cuerpo: **Inter** (`--font-sans`), 14–18px.
- Labels: **Geist Mono** 11px, mayúsculas, +0.06em.

## Imagen
- Hero: `public/v3/photos/mdp-hero-costa.jpg`, enmascarada (`.v3-hero-photo`), opacidad .42 mobile / .55 desktop / .22 light.
- Banco (generadas con gpt-5-5-pro vía Neon AI Gateway, sin gente/texto/logos): `mdp-piedra`, `mdp-meetup`, `mdp-puerto`, `mdp-mesa` en `public/v3/photos/`, para OG, prensa y estados vacíos.
- Fondo: líneas de piedra Mar del Plata (`piedra-*-lines.svg`), estático.

## Movimiento
`--ease-out cubic-bezier(.23,1,.32,1)`, `--ease-drawer`, `--dur-fast 160ms`, `--dur-base 240ms`, `--dur-slow 600ms`. Nada se anima en loop sin propósito; todo respeta `prefers-reduced-motion`.

## Componentes
shadcn/ui (`components/shadcn/*`): radio 8px controles, 12px cards, hairline 1px, sin sombras en dark.
