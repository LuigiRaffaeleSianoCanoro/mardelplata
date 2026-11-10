# FFmpeg cookbook para reels y videos

Recetas reales para editar con ffmpeg local (sin SaaS, sin subir material privado a terceros). Todas las recetas de este archivo se ejecutaron contra clips sintéticos (`testsrc2` + `sine`, generados con lavfi) con **ffmpeg 7.1**. Para re-verificar en tu máquina:

```bash
bash tools/test_ffmpeg_cookbook.sh      # imprime PASS/FAIL por receta
```

Requisitos: ffmpeg con `libx264`, `libass` (subtítulos) y `libfreetype` (drawtext). Chequeo rápido: `ffmpeg -hide_banner -filters | grep -E " (subtitles|drawtext|xfade|loudnorm|afftdn) "`.

Convenciones:
- `IN.mp4` = fuente, `OUT.mp4` = salida. Cambiá tiempos, tamaños y textos.
- `FONT=/ruta/a/Fuente-Bold.ttf` (en macOS: `/System/Library/Fonts/...` o la fuente de marca del proyecto; en Linux `fc-match -f '%{file}' 'Inter:bold'`).
- Intermedios en CRF 18 (casi sin pérdida visible). Export final con la receta de la sección 9.
- Mantené una **EDL** (lista de decisiones de edición): tiempos de corte, cadena de audio, tiempos de SFX/transiciones e intervalos de placas. Va en `EDITORIAL-DECISIONS.md`.

---

## 0. Clip sintético de prueba

```bash
# 12 s, 16:9, "voz" (tono) con silencios de 1.5 s cada 4 s
ffmpeg -y -f lavfi -i "testsrc2=size=1920x1080:rate=30:duration=12" \
  -f lavfi -i "aevalsrc='if(lt(mod(t\,4)\,2.5)\,0.4*sin(2*PI*220*t)+0.02*(random(0)-0.5)\,0.001*(random(0)-0.5))':s=48000:d=12" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -ac 2 -shortest in.mp4

# Dos clips verticales para transiciones
ffmpeg -y -f lavfi -i "testsrc2=size=1080x1920:rate=30:duration=5" -f lavfi -i "sine=frequency=330:sample_rate=48000:duration=5" -c:v libx264 -pix_fmt yuv420p -c:a aac -ac 2 -shortest a.mp4
ffmpeg -y -f lavfi -i "smptebars=size=1080x1920:rate=30:duration=5" -f lavfi -i "sine=frequency=550:sample_rate=48000:duration=5" -c:v libx264 -pix_fmt yuv420p -c:a aac -ac 2 -shortest b.mp4

# "Whoosh" sintético para probar SFX
ffmpeg -y -f lavfi -i "anoisesrc=color=pink:amplitude=0.6:duration=0.6:sample_rate=48000" \
  -af "highpass=f=400,afade=t=in:st=0:d=0.25,afade=t=out:st=0.3:d=0.3" -ac 2 whoosh.wav
```

---

## 1. Jump cuts (silencedetect + trim/concat)

### 1.1 Detectar silencios
```bash
ffmpeg -hide_banner -nostats -i IN.mp4 -vn -af silencedetect=noise=-35dB:d=0.45 -f null - 2> silence.log
grep -E "silence_(start|end)" silence.log
```
- `noise`: umbral. Voz en celular limpio: −35 a −40 dB. Lugar ruidoso: −28 a −32 dB. Si detecta todo como silencio, subí el umbral (menos negativo).
- `d`: duración mínima del silencio. 0.35–0.6 s para reels con ritmo; 0.8–1.0 s para entrevistas con edición liviana.

### 1.2 Cortar automáticamente (script incluido)
```bash
python3 tools/jumpcut.py IN.mp4 OUT_jump.mp4 --noise -35 --min-silence 0.45 --pad 0.12 --edl edl.csv
```
Deja 0.12 s de aire a cada lado del habla (respiración, que no se coma el arranque ni la cola de las palabras), pone fades de 10 ms en cada corte (sin clicks) y escribe la EDL en CSV. **Es una primera pasada**: después revisá cada corte contra los timestamps por palabra de la transcripción y corregí los que caen a mitad de palabra o de frase.

### 1.3 Cortar a mano con select/aselect (rápido, pocos cortes)
```bash
ffmpeg -y -i IN.mp4 \
  -vf "select='between(t,0,2.62)+between(t,3.88,6.62)',setpts=N/FRAME_RATE/TB" \
  -af "aselect='between(t,0,2.62)+between(t,3.88,6.62)',asetpts=N/SR/TB" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k OUT.mp4
```

### 1.4 Cortar con trim + concat (control fino, fades anti-click)
```bash
ffmpeg -y -i IN.mp4 -filter_complex \
"[0:v]trim=start=0:end=2.62,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=2.62,asetpts=PTS-STARTPTS,afade=t=out:st=2.61:d=0.01[a0];\
[0:v]trim=start=3.88:end=6.62,setpts=PTS-STARTPTS[v1];[0:a]atrim=start=3.88:end=6.62,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.01[a1];\
[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k OUT.mp4
```

### 1.5 Punch-in para disimular un jump cut (zoom sutil ~110%)
```bash
# Desde el segundo 2.62 (el corte) el plano pasa a 110%
ffmpeg -y -i JUMP.mp4 -filter_complex \
"[0:v]split=2[a][b];[a]trim=0:2.62,setpts=PTS-STARTPTS[v0];[b]trim=start=2.62,setpts=PTS-STARTPTS,crop=iw/1.1:ih/1.1,scale=1920:1080,setsar=1[v1];[v0][v1]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT.mp4
```
Zoom 100→108–112 %, solo en cortes que lo necesitan. Nunca cortar ojos ni cabeza; ajustá `crop=w:h:x:y` si la cara no está centrada.

---

## 2. Limpieza de audio

### 2.1 Cadena base de voz
```bash
ffmpeg -y -i IN.mp4 -c:v copy \
  -af "highpass=f=80,lowpass=f=12000,afftdn=nr=10:nf=-40,deesser=i=0.4,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=2" \
  -c:a aac -b:a 192k OUT_clean.mp4
```
- `highpass=80` saca rumble/viento/golpes de mesa; `lowpass=12000` saca hiss alto. Voz grave: highpass 60–70.
- `afftdn=nr=10:nf=-40`: denoise FFT. Arrancá en `nr=6–12`. Si suena metálico/"bajo el agua", bajalo. Fuente limpia = tratamiento leve, no bypass.
- `deesser`: solo si hay eses filosas.
- `acompressor` 3:1: nivela la voz. No aplastar.
- Alternativas: `anlmdn=s=0.0005` (denoise non-local means, más lento), `agate` para cortar ruido entre frases, `arnndn=m=modelo.rnnn` (necesita un modelo RNNoise descargado). Para ruido difícil, DeepFilterNet (local, open source) da mejor resultado que afftdn.

```bash
# Gate + NLM denoise
ffmpeg -y -i IN.mp4 -vn -af "agate=threshold=0.01:ratio=2:attack=10:release=250,anlmdn=s=0.0005" -c:a aac OUT.m4a
```

### 2.2 Loudnorm en dos pasadas a −14 LUFS (script incluido)
```bash
bash tools/loudnorm_2pass.sh IN.mp4 OUT_norm.mp4 -14 -1.5
# PRE_CHAIN opcional como 5º argumento; "anull" = solo normalizar
```

A mano:
```bash
# Pasada 1: medir (copiá input_i, input_tp, input_lra, input_thresh, target_offset del JSON)
ffmpeg -hide_banner -nostats -i IN_clean.mp4 -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -

# Pasada 2: aplicar con los valores medidos (linear=true = sin bombeo)
ffmpeg -y -i IN_clean.mp4 -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-20.1:measured_TP=-3.2:measured_LRA=4.0:measured_thresh=-30.5:offset=0.3:linear=true,aresample=48000" \
  -c:a aac -b:a 192k OUT_norm.mp4
```
`aresample=48000` va siempre después de loudnorm (loudnorm sube internamente a 192 kHz).

### 2.3 Verificar loudness del export
```bash
ffmpeg -hide_banner -nostats -i OUT.mp4 -vn -af ebur128=peak=true -f null - 2>&1 | grep -A12 "Summary:"
ffmpeg -hide_banner -nostats -i OUT.mp4 -vn -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
```
Objetivo: Integrated −14 LUFS ±1, True peak ≤ −1 dBTP, `max_volume` < 0 dB (sin clipping).

---

## 3. Transiciones (xfade / acrossfade)

Requisito de xfade: mismas dimensiones, mismo fps, mismo pix_fmt y timebase. `offset` = duración del clip A − duración de la transición.

```bash
# Fundido cruzado 0.5 s (A dura 5 s -> offset 4.5)
ffmpeg -y -i A.mp4 -i B.mp4 -filter_complex \
"[0:v][1:v]xfade=transition=fade:duration=0.5:offset=4.5,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.5:c1=tri:c2=tri[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac -b:a 192k -movflags +faststart OUT.mp4

# Deslizado suave 0.35 s, normalizando timebase/fps antes (evita el error "inputs must have the same timebase")
ffmpeg -y -i A.mp4 -i B.mp4 -filter_complex \
"[0:v]settb=AVTB,fps=30[v0];[1:v]settb=AVTB,fps=30[v1];[v0][v1]xfade=transition=smoothleft:duration=0.35:offset=4.65,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.35[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac OUT.mp4

# Fade desde/hacia negro (apertura y cierre)
ffmpeg -y -i IN.mp4 -vf "fade=t=in:st=0:d=0.4,fade=t=out:st=4.6:d=0.4" -af "afade=t=in:st=0:d=0.3,afade=t=out:st=4.6:d=0.4" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac OUT.mp4
```
Transiciones útiles y sobrias: `fade`, `fadeblack`, `dissolve`, `smoothleft/right/up/down`, `slideleft`, `circleopen`, `zoomin`. Lista: `ffmpeg -h filter=xfade`. Usalas en beats editoriales (cambio de tema, intro→A-roll ~0.4–0.6 s), no en cada corte.

---

## 4. Efectos de sonido (amix / adelay)

```bash
# Un whoosh a los 2.5 s, al 35 % de volumen, sin bajar la voz (normalize=0)
ffmpeg -y -i IN.mp4 -i whoosh.wav -filter_complex \
"[1:a]volume=0.35,adelay=2500|2500[s];[0:a][s]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k OUT.mp4

# El mismo SFX en dos momentos (2.5 s y 6.5 s)
ffmpeg -y -i IN.mp4 -i whoosh.wav -filter_complex \
"[1:a]asplit=2[w1][w2];[w1]volume=0.3,adelay=2500:all=1[s1];[w2]volume=0.3,adelay=6500:all=1[s2];[0:a][s1][s2]amix=inputs=3:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac OUT.mp4

# Música de fondo con ducking automático bajo la voz (sidechain)
ffmpeg -y -i IN.mp4 -i MUSICA.mp3 -filter_complex \
"[0:a]asplit=2[voice][key];[1:a]aformat=channel_layouts=stereo,volume=0.25[music];[music][key]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400[ducked];[voice][ducked]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac OUT.mp4
```
- `adelay` en milisegundos; `|` separa canales (o `:all=1` para todos).
- `normalize=0` (ffmpeg ≥ 5) evita que amix baje cada entrada a 1/N.
- Después de agregar SFX/música, volvé a correr loudnorm (sección 2.2) sobre la mezcla final.
- SFX: mínimos, premium, nunca en cada corte, nunca tapando la voz. Música opcional y nunca reemplaza la edición.

---

## 5. Subtítulos quemados con estilo

### 5.1 SRT + force_style
```bash
ffmpeg -y -i IN_916.mp4 -vf \
"subtitles=subs.srt:original_size=1080x1920:force_style='FontName=Inter,Bold=1,FontSize=64,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=4,Shadow=0,Alignment=2,MarginV=420'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT.mp4
```
- `original_size=1080x1920` hace que `FontSize`/`MarginV` se interpreten en píxeles del video final.
- Colores ASS en `&HAABBGGRR` (alpha, azul, verde, rojo). Blanco `&H00FFFFFF`; azul #58A6FF → `&H00FFA658`.
- `Alignment=2` = abajo al centro. `MarginV=420` en 1080×1920 deja los subtítulos sobre la zona de UI de Reels/TikTok (caption + botones) y debajo de la cara. Ajustá por plano: **nunca sobre ojos/boca/cara**, nunca a mitad de pantalla sobre pecho/cuello en el formato Bahía.
- Fuente: si no está instalada en el sistema, agregá `:fontsdir=./fonts`.

### 5.2 ASS con estilo propio (más control: colores por palabra, cajas)
```text
[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Reel,Inter,68,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,5,0,2,90,90,420,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.50,0:00:02.40,Reel,,0,0,0,,Esto es una prueba
Dialogue: 0,0:00:04.00,0:00:06.00,Reel,,0,0,0,,de subtítulos {\c&H00FFA658&}quemados
```
```bash
ffmpeg -y -i IN_916.mp4 -vf "ass=subs.ass" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT.mp4
```
`BorderStyle=3` = caja opaca detrás del texto (usa `BackColour`).

### 5.3 Utilidades
```bash
ffmpeg -y -itsoffset 2.0 -i subs.srt -c copy subs_shift.srt      # correr el SRT +2 s (después de insertar una placa de 2 s)
ffmpeg -y -i subs.srt subs.ass                                    # convertir SRT a ASS para estilizar
ffmpeg -y -i IN.mp4 -i subs.srt -map 0 -map 1 -c copy -c:s mov_text -metadata:s:s:0 language=spa OUT_softsubs.mp4  # subs no quemados
```
Transcripción local: Whisper (`whisper IN.mp4 --language es --word_timestamps True --output_format srt`) o whisper.cpp / faster-whisper. **Nunca entregar Whisper crudo**: corregí nombres propios, marcas y lugares contra el brief, y hacé una pasada escuchando.

Reglas de subtítulo: 2–5 palabras por línea (máx. ~6 por cue), sincronizados, mismo estilo en todo el video, dentro de la zona segura, nombres propios verificados.

---

## 6. Placas integradas y lower thirds

### 6.1 Lower third con caja (drawbox + drawtext, entre 0.5 s y 3.5 s)
```bash
ffmpeg -y -i IN_916.mp4 -vf \
"drawbox=x=60:y=ih-520:w=760:h=170:color=black@0.65:t=fill:enable='between(t,0.5,3.5)',\
drawtext=fontfile='$FONT':text='Nombre Apellido':fontsize=58:fontcolor=white:x=90:y=h-500:enable='between(t,0.5,3.5)',\
drawtext=fontfile='$FONT':text='Builder · Mar del Plata':fontsize=36:fontcolor=0x58A6FF:x=90:y=h-425:enable='between(t,0.5,3.5)'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT.mp4
```
Textos con `:` o `'` → escapalos (`\:`) o usá `textfile=titulo.txt`.

### 6.2 Título centrado con fade in/out (alpha animado)
```bash
ffmpeg -y -i IN.mp4 -vf \
"drawtext=fontfile='$FONT':text='EP. 3':fontsize=120:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:alpha='if(lt(t,0.5),0,if(lt(t,0.8),(t-0.5)/0.3,if(lt(t,2.7),1,if(lt(t,3),(3-t)/0.3,0))))'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT.mp4
```

### 6.3 Generar una placa PNG con ffmpeg (para prototipos; la placa final usa el diseño/marca aprobados)
```bash
ffmpeg -y -f lavfi -i "color=c=0x0B0B0C:s=1080x1920" -frames:v 1 \
  -vf "drawtext=fontfile='$FONT':text='Título de la placa':fontsize=90:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2,drawtext=fontfile='$FONT':text='ejemplo.com':fontsize=44:fontcolor=0x58A6FF:x=(w-text_w)/2:y=h-260" plate.png
```
(Layout centrado, URL abajo: regla de Instagram.)

### 6.4 Superponer una placa PNG con fade (entre 1 s y 4 s)
```bash
ffmpeg -y -i IN.mp4 -loop 1 -t 3 -i plate.png -filter_complex \
"[1:v]format=rgba,scale=540:-1,fade=t=in:st=0:d=0.3:alpha=1,fade=t=out:st=2.7:d=0.3:alpha=1,setpts=PTS+1/TB[p];[0:v][p]overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t,1,4)':eof_action=pass,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 18 -c:a copy OUT.mp4
```

### 6.5 Placa a pantalla completa como clip (con leve zoom para que no sea una foto muerta)
```bash
ffmpeg -y -loop 1 -framerate 30 -t 2 -i plate.png -f lavfi -t 2 -i "anullsrc=channel_layout=stereo:sample_rate=48000" \
  -vf "zoompan=z='min(zoom+0.0008,1.04)':d=60:s=1080x1920:fps=30,format=yuv420p" -c:v libx264 -crf 18 -c:a aac -shortest plate_clip.mp4
```

### 6.6 Insertar la placa DENTRO del timeline (en el segundo 2)
```bash
ffmpeg -y -i IN_916.mp4 -i plate_clip.mp4 -filter_complex \
"[0:v]trim=0:2,setpts=PTS-STARTPTS[v0];[0:a]atrim=0:2,asetpts=PTS-STARTPTS[a0];\
[0:v]trim=start=2,setpts=PTS-STARTPTS[v2];[0:a]atrim=start=2,asetpts=PTS-STARTPTS[a2];\
[1:v]setsar=1[v1];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -movflags +faststart OUT_with_plate.mp4
```
Al insertar N segundos, **corré subtítulos, SFX y overlays posteriores +N s** (ver 5.3). La placa entregada como PNG aparte NO cuenta como placa integrada.

---

## 7. Reencuadre 9:16 (crop / scale / pad) y rotación de celular

```bash
# Crop central 16:9 -> 9:16
ffmpeg -y -i IN_169.mp4 -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT_916.mp4

# Crop desplazado (sujeto a la izquierda: x = 30 % del ancho)
ffmpeg -y -i IN_169.mp4 -vf "crop=ih*9/16:ih:iw*0.30:0,scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT_916.mp4

# Fondo desenfocado + plano completo centrado (cuando no se puede recortar sin perder info: pantallas, dos personas)
ffmpeg -y -i IN_169.mp4 -filter_complex \
"[0:v]split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=30,eq=brightness=-0.08[b];[fg]scale=1080:-2[f];[b][f]overlay=(W-w)/2:(H-h)/2,setsar=1,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 18 -c:a copy OUT_916.mp4

# Pad con color de marca (letterbox)
ffmpeg -y -i IN_169.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0B0C,setsar=1" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy OUT_916.mp4
```
**Nunca** escalar anisotrópicamente (estirar) a 9:16. Nunca cortar ojos/cabeza.

### Rotación de video de celular
Los celulares graban landscape con metadata de rotación (Display Matrix ±90). Hay que "hornearla":
```bash
# Ver rotación
ffprobe -v error -select_streams v:0 -show_entries stream=width,height:stream_side_data=rotation -of default=nw=1 IN.mp4

# Hornear (ffmpeg autorota por defecto al re-encodear) y verificar que no quede side data
ffmpeg -y -i IN.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy -metadata:s:v:0 rotate=0 OUT_upright.mp4
ffprobe -v error -select_streams v:0 -show_entries stream_side_data=rotation -of default=nw=1:nk=1 OUT_upright.mp4   # vacío = OK

# Si hay que forzar: transpose=1 (90° horario), transpose=2 (90° antihorario), "transpose=1,transpose=1" (180°)
# Simular un archivo de celular rotado para pruebas:
ffmpeg -y -display_rotation 90 -i IN.mp4 -c copy rotated_phone.mp4
```
Las dimensiones solas no prueban nada: sacá ≥3 stills del medio (sección 8) y confirmá **cabeza arriba**.

---

## 8. Thumbnails y extracción de frames

```bash
ffmpeg -y -ss 3.5 -i IN.mp4 -frames:v 1 -q:v 2 frame.jpg                     # un frame JPG (q 2 = alta calidad)
ffmpeg -y -ss 3.5 -i IN.mp4 -frames:v 1 frame.png                            # PNG sin pérdida (para recortes/cutouts)
ffmpeg -y -i IN.mp4 -vf "thumbnail=n=150,scale=1280:720" -frames:v 1 -fps_mode vfr best.jpg   # frame "más representativo"
ffmpeg -y -i IN.mp4 -vf "fps=1/1,scale=320:-2,tile=4x3:padding=6:color=black" -frames:v 1 sheet.jpg  # hoja de contactos para QA
ffmpeg -y -i IN.mp4 -vf fps=1/2 -q:v 3 qa_%03d.jpg                            # un still cada 2 s para revisar
ffmpeg -y -ss 2 -i IN.mp4 -frames:v 1 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" thumb_1280x720.jpg
```
Para portadas Bahía la foto es una **selfie real que mandó Luigi**, no un frame del episodio (ver skill `bah-a-thumbnail-bait-protocol`).

---

## 9. Export final por plataforma

| Destino | Resolución | FPS | Video | Audio | Notas |
|---|---|---|---|---|---|
| Instagram Reels | 1080×1920 (9:16) | 30 (o nativo ≤60) | H.264 High, yuv420p, CRF 18–20, maxrate ~12 Mbps | AAC 48 kHz estéreo 192k | −14 LUFS, +faststart, ≤90 s para Reels con mejor distribución |
| TikTok | 1080×1920 | 30/60 | igual | igual | Zona segura: dejar libres ~250 px abajo y ~150 px a la derecha |
| YouTube Shorts | 1080×1920 | nativo | igual | igual | ≤3 min |
| YouTube (largo) | 1920×1080 o 3840×2160 | nativo | H.264 High, CRF 16–18, GOP = fps/2, B-frames 2 | AAC 48 kHz 320k | YouTube normaliza a ~−14 LUFS |

```bash
# Reels / TikTok / Shorts
ffmpeg -y -i MASTER.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30" \
  -c:v libx264 -preset slow -profile:v high -level:v 4.2 -pix_fmt yuv420p -crf 18 -maxrate 12M -bufsize 24M -g 60 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart PROYECTO_PERSONA_TEMA_REEL_v1.mp4

# YouTube 16:9
ffmpeg -y -i MASTER.mp4 \
  -vf "scale=1920:1080:flags=lanczos,setsar=1" -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -crf 18 -g 15 -bf 2 \
  -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart PROYECTO_EP_N_YT_v1.mp4

# Proxy liviano para revisión en el celular o para adjuntar a un modelo (≤15 MB)
ffmpeg -y -i REEL_v1.mp4 -vf "scale=-2:1280" -c:v libx264 -preset veryfast -crf 30 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart REEL_v1_proxy.mp4

# Solo mover el moov al principio (sin re-encodear)
ffmpeg -y -i IN.mp4 -c copy -movflags +faststart OUT.mp4
```
`-pix_fmt yuv420p` es obligatorio: 4:4:4 o 10 bit no se reproducen en muchos celulares.

### Preflight antes de revisión (script incluido)
```bash
bash tools/preflight_deliver.sh PROYECTO_PERSONA_TEMA_REEL_v1.mp4 1080 1920
```
Falla (exit ≠ 0) si: no es H.264, no es yuv420p, perfil 4:4:4, SAR ≠ 1:1, tamaño distinto al esperado, sin AAC, queda metadata de rotación o el `moov` está después del `mdat` (sin faststart). Además deja 3 stills (25/50/75 %) para confirmar que el contenido está derecho.

---

## 10. Detectores para QA

```bash
# Tramos congelados >= 2 s (detecta "look de slideshow": fotos fijas, placas muertas)
ffmpeg -hide_banner -nostats -i OUT.mp4 -vf freezedetect=n=0.003:d=2 -map 0:v -f null - 2>&1 | grep freeze_
# Negros
ffmpeg -hide_banner -nostats -i OUT.mp4 -vf blackdetect=d=0.1:pic_th=0.98 -an -f null - 2>&1 | grep black_start
# Cortes de escena (para revisar cada límite de corte uno por uno)
ffmpeg -hide_banner -nostats -i OUT.mp4 -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*"
# Picos de audio
ffmpeg -hide_banner -nostats -i OUT.mp4 -vn -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
```
Los detectores ayudan; **no reemplazan ver el video completo** (ver `docs/qa-checklist.md`).
