---
name: builder-spotlight
description: "Builder Spotlight de mardelplata.dev.ar: elegir un builder local con consentimiento y perfil completo (foto + links + descripción), verificar links, armar el carrusel de 5 slides 1440×1440 + caption, y dejarlo en borrador para el OK de Luigi."
---
# Builder Spotlight (mardelplata.dev.ar)

Campaña que muestra talento tech de Mar del Plata. Solo marca mardelplata.dev.ar.

## Fuentes
- El roster de candidatos y las respuestas del formulario "Historias tech" (v1 y v2) de la comunidad. La ubicación de las planillas está en el `PROJECT_CONTENT_RULES.md` del repo de la comunidad; si no la tenés, pedila. **Nunca copies las planillas, teléfonos ni mails a este repo ni a un prompt.**
- La planilla v2 tiene foto, links, descripción y consentimiento obligatorios, y una pestaña "Elegibilidad" que marca PUBLICABLE / NO PUBLICAR.
- Guía de estilo de los posts ya publicados (STYLE.md del repo de la comunidad) para matchear tono e imágenes.
- Mapa de columnas típico del formulario: "¿Cómo querés que aparezca tu nombre?" → nombre · "Rol principal" → rol · "¿Estás construyendo algo…?" + "Describilo en una sola frase" → proyecto · "Link del proyecto" → web · "Linkedin" / "Twitter / X" / "Instagram" → redes · "Completá esta frase" y "Contanos un momento…" → citas textuales · "¿Nos das permiso…?" → usar solo si dice "Sí, autorizo". No hay columna de GitHub: buscarlo solo si aparece en sus links verificados.

## Política de perfiles completos (desde 12/10/2026, no negociable)
- Un perfil solo es elegible si tiene las tres cosas: **foto** (en la planilla), **links** públicos que respondan (al menos uno: proyecto, LinkedIn, GitHub o web) y **descripción** (qué hace / proyecto en sus propias palabras), además del consentimiento "Sí, autorizo".
- Si le falta cualquiera: **no se publica y no se le pide nada a Luigi** (ni que consiga la foto, ni que le escriba). Se elige otro perfil completo con consentimiento; si no hay ninguno, se saltea ese mes y se informa.
- Respetar la lista de **descartados** del proyecto: nunca volver a proponerlos.

## Pasos
1. Si no hay builder elegido, proponer 3 del roster con motivo: **nunca repetir destacados**, con permiso "Sí, autorizo" y links públicos que respondan (chequear antes de proponer).
2. Verificar cada link con fetch web. Registrar solo hechos verificables con URL; marcar links rotos.
3. Entregar:
   - **Carrusel de 5 slides** (texto por slide, formato abajo) + alt text por slide, en el borrador interno (al caption final no van etiquetas de slide ni alt text).
   - **Caption** de Instagram (plantilla abajo) en un archivo aparte que contiene solo el texto publicable.
   - No se arman mensajes para pedir foto, links o descripción faltantes: un perfil incompleto se saltea.
4. Pasar la compuerta de `social-promotion` (chequeo automático, segunda lectura en frío) y dejar en borrador para el OK de Luigi.

## Carrusel (formato real)
1:1, 1440×1440. Fondo navy con luces/olas azules, acentos cian, títulos sans bold en MAYÚSCULAS. Cada slide: logo + pill de sección + contador "0X/05" arriba; pie "mardelplata.dev.ar" (logo y URL bien visibles y centrados; nunca logo chico + URL solos en la esquina superior izquierda).
1. **Portada:** pill de rol (ej. FOUNDER) · NOMBRE en 2 líneas (apellido en cian) · rol · proyecto(s) · foto circular (solo con OK del builder) · chips de trayectoria (solo verificados) · cita corta del formulario.
2. **Proyecto:** NOMBRE + tagline cian · 1 frase de qué hace · grilla 2×2 de features (solo las que figuran en su web) · link.
3. **Proyecto 2 o "Por qué desde MdP":** mismo layout; si no hay 2º proyecto, contexto/historia con hechos verificados.
4. **Cita grande:** "Ser dev en Mar del Plata es…" (respuesta textual del formulario) + foto circular + "— Nombre".
5. **CTA:** "EL PRÓXIMO SPOTLIGHT PODÉS SER VOS." · botón "SUMATE A LA COMUNIDAD" · mardelplata.dev.ar.

## Caption (plantilla)
```
"[Cita textual del formulario]"

Eso nos dijo [Nombre] cuando le preguntamos. [1 frase puente].

[2–3 líneas: trayectoria y por qué desde la costa, solo hechos con fuente]

[emoji] PROYECTO (sin URL en el caption: "link en la bio")
[1–2 líneas: qué hace]

[Cierre corto]

El próximo spotlight podés ser vos → link en la bio
```
Apertura alternativa: "Seguimos mostrando el talento tech de Mar del Plata. Hoy: [Nombre / @usuario]". Sin hashtags (`--style spotlight`). @mencionar solo si el builder dio su IG. Verificar el tono contra STYLE.md. Los corchetes son de plantilla: el texto final no puede tener ninguno.

## Reglas propias
- Nunca copiar teléfonos, emails ni la foto de Drive en los textos; usar el nombre como pidió aparecer.
- Solo hechos con fuente; citas textuales solo si el builder las dio. Si no hay cita, en el borrador interno se marca `[TBD: cita]`, pero el post final se arma sin esa parte (apertura alternativa) o no se publica.
- No se usa su foto sin OK. Foto real: recorte limpio, nunca retocada ni regenerada con IA.
- Nada se publica sin el OK explícito de Luigi. Reglas por red y compuerta: ver `social-promotion`.
