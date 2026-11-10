# QA checklist (video + texto)

Gate obligatorio antes de mostrarle cualquier pieza a Luigi para revisión. Fail-closed: un ítem en FAIL = la pieza sigue en WIP. Una pasada de un editor o de un modelo revisor **no es** aprobación para publicar: eso es solo el OK explícito de Luigi.

Estados (nombres exactos, nunca mezclarlos):
1. **WIP**: edición. No se le avisa a Luigi. Prohibido decir "listo", "done", "PASS", "ready", "entregado", "QA OK" sobre algo en WIP.
2. **Review**: pasó preflight + este checklist + segunda mirada independiente. Luigi puede abrirlo en el celular.
3. **Approved**: OK explícito de Luigi para esa versión exacta. Recién ahí se publica o se manda a terceros.

---

## A. Video completo

### A1. Mirar TODO el export final (no negociable)
- [ ] Vi (o el modelo con comprensión de video analizó) **el archivo exportado final completo, de punta a punta**, con audio. No un proxy viejo, no el timeline, no la descripción de otro agente. Si tu herramienta no puede ver video, decilo y mirá vos los stills + escuchá el audio; nunca afirmes haber visto algo que no viste.
- [ ] Hice al menos **2 rondas de QA visual/auditiva** sobre el render final. Después de cada corrección, re-revisé las partes cambiadas (y todo lo que se corrió de tiempo).
- [ ] Revisé uno por uno **todos los límites de corte** (detector de escenas: `docs/ffmpeg-cookbook.md` §10), las transiciones de placas y los overlays de cierre.

### A2. Edición completa (regla dura: subtítulos + logo sobre una toma intacta NO es edición)
- [ ] **Jump cuts** reales: sin aire muerto, falsos arranques, "ehhh", repeticiones ni chasquidos; ritmo natural, respiraciones preservadas.
- [ ] Ningún corte a mitad de palabra ni a mitad de frase. Todas las ideas necesarias siguen ahí. No se inventó diálogo.
- [ ] **Audio tratado** de verdad (cadena registrada en la EDL), no un bypass descripto como limpieza.
- [ ] **Transiciones o SFX** deliberados y audibles/visibles en beats editoriales; no en cada corte, no tapan la voz.
- [ ] **Placas integradas DENTRO del MP4** en la ubicación y duración aprobadas (un PNG aparte no cuenta).
- [ ] La EDL (cortes, cadena de audio, tiempos de SFX/transiciones, intervalos de placas) existe y coincide con lo que se ve. No se reclama trabajo no hecho.

### A3. Nada de look de slideshow
- [ ] No hay tramos largos de fotos fijas o placas muertas bajo voz en off (`freezedetect` d=2 s como alarma; cualquier freeze largo tiene que estar justificado).
- [ ] Si hay voz en off larga, va sobre B-roll **en movimiento**, no stills, salvo que ese día solo haya stills.
- [ ] Placas con movimiento (motion graphics, zoom sutil, entrada/salida), no una imagen pegada.
- [ ] No es una sucesión de imágenes con texto y música: hay persona real, pantalla real o acción real.
- [ ] Anti-look-de-template-IA: sin zoom cada 2 s, sin emojis flotando, sin palabras gigantes random, sin karaoke palabra por palabra, sin transiciones flashy, sin SFX en cada corte, sin stock irrelevante, sin fondos falsos.

### A4. Audio
- [ ] Integrated **−14 LUFS ±1**, true peak ≤ −1 dBTP, sin clipping (`ebur128`, `volumedetect`).
- [ ] Voz inteligible y pareja en todo el video; sin artefactos metálicos/"bajo el agua" por denoise excesivo.
- [ ] B-roll/transiciones sin audio sucio de calle/evento/celular (muteado o reemplazado).
- [ ] Música (si hay) debajo de la voz, con ducking; nunca la tapa. SFX balanceados.
- [ ] Inicio y final limpios: sin clicks, sin palabras cortadas en la última frase.

### A5. Subtítulos
- [ ] Presentes (salvo que el brief diga otra cosa), sincronizados **después** de todos los cambios de timeline (inserción de placas corre todo).
- [ ] Texto revisado contra el audio y el brief: nunca Whisper crudo. Nombres propios, marcas, lugares y productos corregidos (ej.: "Nico Barbarosch"). No se inventan nombres que no se dijeron.
- [ ] Abajo al centro, 2–5 palabras por línea (máx. ~6 por cue), estilo consistente.
- [ ] Nunca tapan ojos, boca, cara ni logos. Nunca a mitad de pantalla sobre pecho/cuello.
- [ ] Dentro de la zona segura de cada red (ver A7).
- [ ] Se entregan SRT editable si se pidió.

### A6. Placas, lower thirds y textos en pantalla
- [ ] Legibles en el celular a brazo extendido (tamaño, contraste, tiempo en pantalla: ~0.4 s por palabra, mínimo ~2.5 s).
- [ ] Ortografía de nombres, cargos y empresas verificada contra el brief.
- [ ] Si se sacó una pregunta del entrevistador, hay banner con la pregunta legible el tiempo suficiente; no queda un salto pelado.
- [ ] Tipografía final, sin chips "PRUEBA"/draft, sin placeholders ("[nombre]", "TBD", "Lorem").
- [ ] Banners corporativos a pantalla completa: apagados por defecto.

### A7. Encuadre, formato y zonas seguras
- [ ] 9:16 real = ancho < alto **y contenido derecho** (cabeza hacia arriba) en ≥3 stills del medio. Sin metadata de rotación residual.
- [ ] Sin estiramiento anisotrópico; ojos/cabeza nunca cortados; reencuadre con criterio.
- [ ] Zonas seguras 1080×1920: dejar libres ~220–250 px arriba (barra de cuenta), ~350–420 px abajo (caption, botones, música) y ~120–150 px a la derecha (botones de like/comentar/compartir). Texto y logos importantes en el centro.
- [ ] Instagram (gráficas/portadas): nunca logo chico + URL en la esquina superior izquierda (Instagram la tapa). Layout centrado, logo más grande, URL abajo.
- [ ] Color/exposición correctos, piel natural, multicámara matcheada.
- [ ] Preflight técnico OK: `bash tools/preflight_deliver.sh OUT.mp4 1080 1920` (H.264, yuv420p, AAC, SAR 1:1, +faststart, tamaño esperado).

### A8. Marca y proyecto
- [ ] Una sola marca por pieza, la del repo/proyecto (Pavla, PsicoConecta, mardelplata.dev.ar, Builders OFF The Record, Shiplog, Builder en la Bahía/personal, comunidad SpaceXSI). Sin mezclar.
- [ ] Solo logos, colores y templates provistos. No inventar logos ni chrome de marca.
- [ ] Pavla: marca ACTUAL (isotipo verde de la landing + palabra Pavla). Nada del rebrand POC (monograma PV teal, Geist, "Placa clara").
- [ ] Ambassador: "parte de la SpaceXSI Community", rol "Build ambassador" / "Bot ambassador". Nunca "SpaceXSI/SpaceX ambassador", nunca "SpaceXAI", nada de "oficial", no hablar por la empresa, sin logos caseros, sin noticias de la empresa.
- [ ] Sin secretos, claves, datos de pacientes, teléfonos/mails de terceros en pantalla ni en metadata.
- [ ] Hashtags no quemados en el video.

### A9. Narrativa
- [ ] Gancho en los primeros 1–3 s con una línea real del orador (no inventada).
- [ ] Se entiende solo (sin contexto previo), funciona en mute (subtítulos), la duración está justificada (45 s buenos > 2:30 inflados).
- [ ] Sin repeticiones ni "sándwich" de VO que repite bio/CTA. Un solo CTA, honesto.
- [ ] Pasada narrativa adversarial: transcript final → buscar huecos, saltos de sentido, promesas no cumplidas → corregir.

### A10. Entrega
- [ ] Dos versiones para comparar cuando es un video nuevo: una hecha con Claude Opus y otra con Gemini (indicar cuál es cuál). Si uno de los modelos no está disponible, avisarlo; no sustituir en silencio.
- [ ] Nombres claros: `[PROYECTO]_[PERSONA]_[TEMA]_REEL_vN.mp4`; versiones superadas marcadas como tales.
- [ ] Notas de producción (EDITORIAL-DECISIONS.md, NOTES.md) separadas del copy publicable.
- [ ] Copy por red en archivos aparte, que contienen **exactamente** el texto a publicar (ver sección B).
- [ ] Estado: Review, no "listo". Nada se publica sin OK explícito de Luigi.

---

## B. Texto (anti-tropes LLM)

Aplica a captions, guiones, VO, títulos, placas, decks, posts, mails. Fail-closed: patrón prohibido → reescribir; no se entrega el borrador contaminado. Se entrega solo el texto limpio, sin narrar el QA.

### B1. Construcciones prohibidas
- [ ] Correctio / paralelismo negativo: "no es X, es Y", "no A, sino B", "esto no es X…", "No es una comunidad genérica: es…", "It's not X. It's Y.", "It's not just…", definir por negación.
- [ ] Pares staccato tipo slogan ("El A está. El B falta.") cuando una afirmación simple alcanza.
- [ ] "bitácora" y metáforas de cuaderno de bitácora.
- [ ] Estructura opaca: "Uno / Dos / Tres" pelados, slots sin nombre, outline codificado en lugar de frases completas.
- [ ] Carraspeo LLM: "En un mundo donde…", "Imaginate esto:", "Sin más preámbulos", "No te lo pierdas", "The result?", "But here's the thing", "From X to Y", fake-candid openers.
- [ ] Vocabulario IA: landscape, showcasing, delve, pivotal, unlock, elevate, game-changer, "potenciar", "revolucionar", "sinergia", inflación de importancia.
- [ ] Reglas de tres por puro ritmo, ciclos de sinónimos, falsos binarios, preguntas retóricas falsas.
- [ ] Rayas (em dash) como dramatismo; Title Case en cuerpo en español; bullets con emoji.
- [ ] «corte» para pausa comercial/sponsor ("Este corte es con X", "corte comercial", "vamos a un corte").
- [ ] Openers de bumper rechazados: "Para pagar acá en San Francisco uso X…" con la aclaración al final; "Te cuento de una app que uso"; "Esto es con mi link de referido" como primera línea.
- [ ] Copy de sponsor/referido que serviría para cualquier marca (código + "recompensa" + link) sin un dato concreto del producto.

### B2. Voz
- [ ] Primera persona como Luigi (yo, me, voy a, te cuento), no narrador en tercera persona.
- [ ] Rioplatense: voseo (vos, tenés, dale, laburo, che liviano). Nada de España/corporativo (vosotros, ordenador, móvil → celular, parking, "comunidad de makers" vacía).
- [ ] Espontaneidad planificada: frases completas y leíbles en voz alta, no taquigrafía de teleprompter.
- [ ] Concreto: qué pasó, qué falló, qué sigue; números reales o ninguno.
- [ ] Marcas tal cual se escriben (Grok Bot, Cursor, SpaceXSI Community, mardelplata.dev.ar).

### B3. Separación de notas internas y copy publicable
- [ ] El archivo publicable tiene SOLO el texto a publicar. Nada de `[TBD]`, "opción A/B", "alt text:", "caption:", "slide 1", "borrador", "v2", "aprobado", indicaciones de producción ("esto se sube como carrusel en 5 historias"), mensajes al equipo, nombres de agentes, markdown (`**`, `##`, guiones de lista) ni placeholders.
- [ ] Falta un dato = no se publica esa parte (se saca o se saltea el post); nunca se rellena con placeholder.
- [ ] Chequeo automático (opcional): `python3 tools/prepublish_check.py --network ig|x --file post.txt` → tiene que dar PASS.
- [ ] Segunda lectura en frío (otro modelo o relectura sin contexto) que recibe SOLO el texto final y la red, y responde SÍ/NO: "¿Esto se puede publicar tal cual en la cuenta pública, sin notas internas, placeholders ni mensajes al equipo?". Cualquier NO o duda = no se publica.

### B4. Reglas por red (cuentas en plan gratis)
- **X:** ≤280 caracteres (link = 23), objetivo ≤240. Sin link en el post principal (va en el primer reply o "link en bio"). 0–1 hashtag, máx. 1 emoji, hilos de máx. 3 posts salvo pedido. En aprobaciones se muestra el hilo completo numerado con sus imágenes/videos.
- **Instagram:** sin URL en el caption ("link en la bio"). Gancho en los primeros 125 caracteres. Caption ≤ ~1000 recomendado (2200 duro). 0–3 hashtags al final. Máx. 3 emojis, ninguno en la primera línea, nunca uno por línea. Carrusel 1080×1350 o 1:1, máx. 10 slides, alt text en el campo de alt text (nunca en el caption).
- **Ambas:** sin paredes de emojis, sin líneas en MAYÚSCULAS, sin engagement-bait ("comentá SÍ", "etiquetá a…"), un solo CTA.
- **LinkedIn:** 3–5 líneas útiles antes del "ver más", contexto, menciones solo confirmadas.

### B5. Verdad
- [ ] Ningún número, venue, premio, sponsor, testimonio ni capacidad de producto inventado. Todo dato con fuente.
- [ ] Citas textuales solo si la persona las dio; testimonios con permiso escrito.
- [ ] Consentimiento verificado para cualquier persona destacada.

### B6. Cuando Luigi corrige un texto
1. Extraer la regla general (qué tiene que ser siempre verdad).
2. Agregarla a la skill correspondiente (`qa-texto-anti-tropes-llm`, `voz-argentina-scripts-bah-a-2`, `ai-copywriter`) en el repo.
3. Recién después corregir el texto actual. Nunca quedarse solo en el paso 3.
