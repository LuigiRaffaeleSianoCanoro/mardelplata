---
name: talk-clips-pipeline
description: >-
  Usar cuando hay que convertir la grabación de una charla o workshop en una
  serie de clips cortos (Shorts, Reels, X): ingesta full-res, transcripción con
  timestamps por palabra, selección de momentos que se sostienen solos, cortes
  limpios, audio, subtítulos, placas integradas, QA completo, paquete de
  revisión y calendario de publicación (solo con OK).
---
# Talk clips pipeline

De una charla larga a una serie de clips listos para revisión y, con aprobación, agendados en X, Instagram y YouTube. Aplica siempre `reel-production-complete-edit` y `video-review-package`. Recetas en `docs/ffmpeg-cookbook.md`.

## 1. Ingesta
- Bajar el video en resolución completa y verificar que tenga buena calidad (nada de previews de baja resolución).
- Transcribir localmente con Whisper, con timestamps por palabra (`--word_timestamps True`). Corregir nombres propios contra el programa/brief.

## 2. Selección
- Leer la transcripción completa y elegir momentos que se sostengan solos: una idea, una respuesta, un dato concreto.
- Cada clip responde a UNA pregunta. Esa pregunta es el único texto en pantalla además de los subtítulos.
- Duración de 20 a 60 segundos. Armar una tabla (`CLIPS.md`) con n, pregunta, inicio, fin y copy por red.

## 3. Corte y audio
- Cortar siempre en límites de palabra (usar los timestamps de Whisper); el audio nunca se corta a mitad de palabra.
- Sacar muletillas ("ehhh") y pausas largas (`tools/jumpcut.py` como primera pasada + ajuste manual), con crossfades cortos y zooms sutiles para disimular los saltos.
- Limpiar el audio: denoise suave, EQ, compresión y loudnorm a −14 LUFS (`tools/loudnorm_2pass.sh`).
- Siempre se ve la charla real; nunca solo audio sobre un fondo (eso es un slideshow y no se entrega).

## 4. Subtítulos y placas
- Subtítulos quemados, centrados abajo y dentro de la zona segura de cada red; que no tapen la cara. 2–5 palabras por línea.
- Placa de apertura integrada en el MP4 con la pregunta del clip y una foto real del orador (recorte limpio, sin retocar la cara con IA).
- Placa de cierre de unos 3 segundos con el logo y el llamado a la acción del dueño (por ejemplo, sumarse a su comunidad), con el mismo diseño que la apertura. Logo grande, layout centrado, URL abajo (nunca logo chico + URL arriba a la izquierda).
- Transiciones o SFX sobrios en apertura/cierre.
- Exportar cada clip en 9:16 y 16:9 (cookbook §7 y §9).
- Stack: FFmpeg, Whisper y Python, todo local.

## 5. QA
- Ver cada clip entero, exportado, antes de mostrarlo: cortes, audio, subtítulos legibles y sincronizados, sin texto tapando caras, ortografía de nombres (`docs/qa-checklist.md`).
- `bash tools/preflight_deliver.sh CLIP.mp4 1080 1920` en cada clip.
- Pasar el copy por `qa-texto-anti-tropes-llm` para que no suene a texto generado. Copy publicable en archivos separados de las notas.
- Mostrar al dueño un paquete de revisión (clips + copy por red) y esperar su OK. **No publicar nada sin aprobación.**

## 6. Agenda y publicación (solo después del OK)
- Armar un calendario (por ejemplo, un clip cada 2 días) y guardarlo como `schedule.json` con n, archivos, textos y horario por red (con zona horaria).
- X e Instagram se programan con el programador de redes que use el dueño (por ejemplo Buffer; en el plan gratis hay tope de posts en cola, así que se carga por tandas). Programar con anticipación, nunca "publicar ahora". En Instagram se puede publicar como collab con la cuenta personal del orador si lo aprueba.
- YouTube Shorts se suben y se programan desde YouTube Studio.
- Reponer la cola periódicamente con las siguientes entradas sin agendar, informando solo lo nuevo o los bloqueos.
