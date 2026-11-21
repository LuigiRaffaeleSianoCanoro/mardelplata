# Decisiones — mobile + librería Piedra

1. **Causa raíz de la home cortada.** No era que cada bloque “se saliera” por su cuenta. El grid del shell no tenía `minmax(0,1fr)` y un hijo con `min-width: auto` (título a 48px + filas nowrap) estiraba el layout a 471px. `overflow: hidden` recortaba a la derecha y `document.scrollWidth` seguía igual al `innerWidth`. El chequeo de overflow tiene que incluir recorte visual, no sólo scrollWidth.

2. **Checkout local.** Luigi pidió excepción permanente: trabajo en `/workspace/mdp-site-mobile`, sin cloud agents ni créditos de Cursor. Rama nueva desde `main` (`bfa9d2a`, incluye #80). No se tocó #78 ni #77 ni #76. #68 ya estaba cerrado.

3. **UI SDK se adopta en los controles que se rehacen**, no en un rewrite total. Tabs y Button de la home/chrome pasan a `@ui-sdk/react`. Overlays (Sheet, Dialog, ⌘K, Vaul) se quedan en shadcn/Radix: reescribirlos sólo para migrar viola la propia guía del skill. Estilos = tokens Piedra, no el tema default del SDK.

4. **Hero en mobile.** El copy no cambia: “El Club Tech de Mar del Plata”. En viewports < lg hay un `<br>` después de “de” y el cuerpo usa `clamp`, para que “MAR DEL PLATA” no se corte. En 320px se oculta el “.dev.ar” del lockup; el logo y “mardelplata” quedan.

5. **Tabs iguales en mobile.** Cuatro columnas `minmax(0,1fr)` permiten animar el indicador sólo con `transform` (sin `width`). A 320px la tipografía baja con `clamp` para que quepan “Comunidad” y “Empleos”.

6. **No se mergea ni se publica.** PR en draft para que Luigi (y CoS) lo vean. Preview de Vercel puede estar bloqueado; la verificación es `next build` + `next start` + Playwright.
