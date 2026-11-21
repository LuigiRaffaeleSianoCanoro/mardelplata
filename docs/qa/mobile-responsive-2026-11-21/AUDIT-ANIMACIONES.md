# Auditoría de animaciones — mardelplata.dev.ar

Criterio: skills de Emil Kowalski (`improve-animations`, `review-animations`, `find-animation-opportunities`, `animate`, `mobile-native`). Valores tomados de su catálogo (no aproximados).

Personalidad del producto: club tech, sistema visual Piedra — oscuro, crisp, acento Óxido `#ff5c26`. El motion tiene que ser seco y rápido, no juguetón.

Tokens existentes (extendidos, no reemplazados):

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* agregado en este PR */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
--dur-fast: 160ms;
--dur-base: 240ms;
--dur-slow: 600ms; /* sólo reveal de la foto del hero, marketing */
```

## Hallazgos y correcciones

| # | Severity | Componente | Hallazgo | Qué se corrigió |
| --- | --- | --- | --- | --- |
| 1 | HIGH | Shell / grid de la home | El título a 48px y filas `nowrap` (`truncate`, tabs, dock) inflaban el `min-content` a 471px. El shell recortaba con `overflow: hidden`: “Entrar”, el hero, las tabs, la card y el share se cortaban a la derecha. `scrollWidth` seguía igual al viewport, así que el bug no aparecía en un chequeo ingenuo. | `grid-cols-[minmax(0,1fr)]` + `min-w-0` en header, main, aside, footer, cards y grids. Tipografía del hero con `clamp` y un corte intencional después de “de” en mobile. Tabs en 4 columnas `minmax(0,1fr)`. Dock en `minmax(0,1fr) auto`. |
| 2 | HIGH | Indicador de tabs | Se animaba `width` (propiedad de layout) junto a `translateX`. | En mobile las columnas son de ancho igual; el indicador usa las variables de UI SDK (`--active-tab-left/width`) y **sólo anima `transform`**, 200ms `var(--ease-out)`. Primera colocación y atajos de teclado: `transition: none` (`data-activation-direction="none"` / `data-instant`). |
| 3 | HIGH | Sheet / CommandDialog (salida) | La salida usaba `ease-in`. En entradas y salidas de UI, `ease-in` retrasa el momento que se mira. | Salida a 160ms / 100ms con `var(--ease-out)`. |
| 4 | MEDIUM | `:hover` en cards de /eventos y /prensa | `hover:bg-card` sin gate de puntero fino. En touch queda un hover pegado. | `hover-device:hover:bg-card` (`@media (hover: hover) and (pointer: fine)`). |
| 5 | MEDIUM | Tooltips del AppSidebar | Labels `absolute left-full` (p. ej. “Módulos”) se pintaban fuera del viewport en mobile, incluso con opacity 0. | `hidden` salvo en `hover-device`. No se muestran en touch. |
| 6 | MEDIUM | Inputs en auth y formularios | Fuentes < 16px hacen zoom en iOS al enfocar. | `font-size: max(16px, 1em)` en `input, select, textarea` bajo tokens Piedra. |
| 7 | LOW | Cohesión de tokens | Faltaba `--ease-in-out`. | Agregado el cubi-bezier del catálogo. |
| 8 | LOW | Tap nativo | Flash gris de tap highlight en Chrome Android. | `-webkit-tap-highlight-color: transparent` y `user-select: none` sólo en controles, no en el body. |

`prefers-reduced-motion` ya estaba en `.v3-word`, `.v3-press`, indicador, paneles, sheet y dialog: se mantiene (menos movimiento, no cero). El press de botones (`.v3-press`: `scale(0.97)`, 160ms `ease-out`) ya cumplía el recetario y se reutiliza en la librería Piedra.

## Librería de componentes (UI SDK)

Nueva carpeta `src/components/piedra/`, con comportamientos de `@ui-sdk/react` / `@ui-sdk/core` (beta 0.1.0-beta.13) y estilos Piedra:

- `button.tsx` — `@ui-sdk/react/button` (pending, `render` para links de Next)
- `tabs.tsx` — `@ui-sdk/react/tabs` + `TabsIndicator` (SegmentedTabList / SegmentedTab / TabPanel)
- `hero.tsx`, `event-card.tsx`, `dock.tsx`, `label.tsx` — composición visual de la home

La home (`Shell`) y el chrome de subpáginas (`SiteHeader` / `SiteFooter`) usan esta librería. Los overlays (Sheet, Dialog, Drawer, ⌘K) siguen en shadcn/Radix + vaul; no se reescribieron sólo para migrar.

## Oportunidades que sí pasan el gate

| # | Lugar | Hoy | Propósito | Frecuencia | Motion sugerido |
| --- | --- | --- | --- | --- | --- |
| 1 | Command menu (⌘K) | Abre con scale 0.96 + opacity 150ms, también cuando se dispara por teclado | — | 100+/día por teclado | **Quitar la animación cuando el origen es el atajo.** Si se abre con el botón “Buscar” en mobile (ocasional), se puede dejar 150ms `var(--ease-out)` desde `scale(0.96)`. |
| 2 | Lista de eventos en /eventos | Las cards aparecen de golpe al hidratar | Evitar un cambio brusco | Ocasional / primera visita | Stagger 30–50ms no uniforme, `opacity` + `translateY(8px)`, `@starting-style`, sin bloquear el tap. Con `prefers-reduced-motion`: sólo opacity 120ms. |
| 3 | Overlay de evento (drawer) | Ya entra con Vaul / `--ease-drawer` | Feedback + consistencia espacial | Ocasional | Dejarlo. Verificar en un teléfono real que el drag lleve velocidad y no corte en el borde (`bounce` 0.1–0.3). |

## Candidatos rechazados

- Hover scale en las tabs o en las filas de eventos. **Rechazado: decenas de veces por día; sobra el press de 160ms.**
- Animar el cambio de tema (T). **Rechazado: atajo de teclado.**
- Parallax o tracking del mouse en la foto del hero. **Rechazado: la foto ya tiene un reveal de 600ms (marketing); decorar más estorba.**
- Animar el dock fijo al scrollear. **Rechazado: en la home no hay scroll de documento; el dock es permanente.**

## Pendiente de hardware

Emil es explícito: la emulación no reproduce hover pegajoso, delay de tap, safe-area ni teclado virtual. Este PR se verificó con Playwright en 320 / 360 / 390 / 412 / 768 (Chrome) y `next build` + `next start`. Falta confirmar en un Android real (el de Luigi, ~412px) y en un iPhone: safe-area del dock, teclado en `/auth/login`, y que el menú hamburger de las subpáginas no deje hover pegado.
