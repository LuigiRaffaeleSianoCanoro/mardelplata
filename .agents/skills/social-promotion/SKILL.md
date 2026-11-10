---
name: social-promotion
description: "Promoción en redes de eventos de mardelplata.dev.ar: calendario T-14→T+1 y borradores para X, LinkedIn, Instagram y WhatsApp/Slack, con compuerta de pre-publicación y reglas por red. Todo queda en borrador hasta el OK de Luigi."
---
# Promoción en redes (mardelplata.dev.ar)

Solo para la comunidad mardelplata.dev.ar. Fuera de alcance: Disro, Pavla, PsicoConecta, Builders OFF The Record, Shiplog y el trabajo de ambassador. Nunca mezclar marcas.

## Entregable
1. Calendario: anuncio (T-14), recordatorio de speakers (T-7), últimos lugares (T-2), día del evento, recap (T+1).
2. Para cada momento, borradores de:
   - **X:** ≤280 caracteres (objetivo ≤240), 0–1 hashtag (#MardelPlata), link en el primer reply.
   - **LinkedIn:** 3–5 líneas, más contexto, menciones [@sponsor] solo si está confirmado.
   - **Instagram:** caption (sin URL, "link en la bio") + idea de imagen/carrusel + alt text (en el borrador interno, no en el caption).
   - **WhatsApp/Slack de la comunidad:** mensaje corto y amigable.
3. Opcional: búsqueda web de hashtags o cuentas locales relevantes (medios, comunidades tech de MdP), con URL.

## Reglas propias
- Siempre linkear al evento o a mardelplata.dev.ar.
- Nada de "+500 inscriptos" salvo dato real. Sponsors solo si están confirmados.
- Gráficas de Instagram: nunca logo chico + URL en la esquina superior izquierda (Instagram la tapa). Layout centrado, logo más grande, URL abajo.

## Publicación
**En este pack todo queda en BORRADOR hasta que Luigi lo apruebe explícitamente** (pieza y versión exactas). Una vez aprobado, se programa en Buffer (IG + X) con al menos 2 horas de anticipación, nunca "Share now". LinkedIn y WhatsApp/Slack: Luigi lo publica o lo aprueba aparte.

Siempre necesitan el OK de Luigi, sin excepción: anuncios pagos, todo lo relacionado con sponsors, el primer mail a cada empresa.

### Checklist antes de proponer para publicar
- Dice "mardelplata.dev.ar" (nunca "mardelplata.dev").
- Las fechas y horas coinciden con Luma (ART, America/Argentina/Buenos_Aires).
- No se anuncian eventos privados hasta que sean públicos.
- Toda persona destacada dio consentimiento en la planilla de consentimiento de la comunidad.
- Ningún dato inventado.
- Los links responden.

## Compuerta antes de publicar (no negociable)
Si cualquier paso falla, no se publica.
1. **Borrador interno ≠ texto final.** Las notas, `[TBD: ...]`, alternativas (opción A/B), alt text, etiquetas de slide e indicaciones de producción viven en el borrador interno, marcado como NO PUBLICABLE. Lo que se programa es un archivo que contiene exactamente el texto a publicar, nada más (en X, el link va en un archivo aparte para el primer reply).
2. **Falta un dato = NO se publica.** Cualquier `[TBD]` o dato faltante bloquea. Nunca se rellena el hueco con un placeholder en el texto final: se saca esa parte o se saltea el post.
3. **Chequeo automático** sobre el texto final exacto:
   `python3 tools/prepublish_check.py --network ig|x --file post.txt [--style spotlight] [--event-date AAAA-MM-DD --event-time HH:MM] [--reply-file reply.txt]`
   Tiene que decir **PASS** (exit 0). Cualquier FAIL o error = no se publica. Los WARN (largo recomendado, gancho) se revisan a mano.
4. **Segunda revisión independiente:** otro modelo o una relectura sin contexto recibe SOLO el texto final y el canal, y responde SÍ/NO a: "¿Esto se puede leer tal cual en la cuenta pública de la comunidad, sin notas internas, placeholders ni mensajes al equipo?". Cualquier NO o duda = no se publica.
5. **OK explícito de Luigi** sobre ese texto exacto.
6. **Programar, nunca "Share now"**, con ≥2 h de anticipación para que Luigi pueda frenarlo.
7. **Después de salir:** releer el post en vivo. Si tiene un error, avisarle a Luigi enseguida.
8. **Ante cualquier falla:** cancelar y registrarlo. Nunca publicar "por las dudas".

## Reglas por red (cuentas en plan GRATIS; límites en `tools/network_rules.json`)
- **X:** máx. 280 caracteres (link = 23), objetivo ≤240. Sin link en el post principal (baja el alcance): el link va en el primer reply/hilo o se dice "link en bio". Máx. 1 hashtag (mejor 0). Máx. 1 emoji. Hilos de 3 posts como máximo.
- **Instagram:** los links no son clickeables en el caption: nunca poner una URL, solo "link en la bio". Gancho en los primeros 125 caracteres (antes del "más"). Caption recomendado ≤ ~1000 caracteres (límite duro 2200). 0–3 hashtags, al final, locales/de nicho (el Spotlight no lleva ninguno). Máx. 3 emojis, ninguno en la primera línea, nunca un emoji por línea. Carrusel 1080×1350 o 1:1, máx. 10 slides, alt text obligatorio (en el campo de alt text, nunca en el caption).
- **Ambas:** nada de paredes de emojis, ninguna línea toda en mayúsculas, nada de engagement-bait ("comentá SÍ", "etiquetá a…"), un solo CTA por post.

## Reglas comunes (no negociables)
- Nunca enviar mails, DMs ni publicar sin OK de Luigi.
- Se opera en **español**. Mails a empresas de EE.UU. en **inglés**; a destinatarios argentinos, en español rioplatense (vos, cálido, "che" con moderación).
- La comunidad se escribe SIEMPRE "mardelplata.dev.ar". Firma: "Luigi Canoro · mardelplata.dev.ar".
- Corto, cálido, directo: máx. ~120 palabras por mail (primer contacto: menos de 90).
- Nunca inventar métricas (asistentes, alcance, seguidores) ni datos. Si falta algo, `[TBD: ...]` SOLO en borradores internos.
- Pasar todo el copy por `qa-texto-anti-tropes-llm`.

## Registro
- Cada contacto (persona, empresa, marca o proveedor) se registra en el CRM de la comunidad (ver `PROJECT_CONTENT_RULES.md`; buscar duplicados antes de crear). Las tareas pendientes van al backlog del proyecto.
- Cada post publicado se registra para el resumen semanal.
