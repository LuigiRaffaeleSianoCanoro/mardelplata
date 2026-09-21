#!/usr/bin/env bash
# 36s craft demo: cold-open + recrop + spaced captions. Not a ship cut.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="${1:-/home/ubuntu/.cursor/projects/workspace/uploads/ep0_v4_builder_en_la_bahia_review720_06d6.mp4}"
FONT_B="/usr/share/fonts/truetype/macos/Inter-Bold.ttf"
FONT_S="/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf"
WORK="$ROOT/_work"
OUT="$ROOT/craft-demo-after-no-reshoot.mp4"
mkdir -p "$WORK"

# ASS times are on the OUTPUT body (starts at 0). Body = source 11.00–40.50.
cat > "$WORK/captions.ass" <<'EOF'
[Script Info]
ScriptType: v4.00+
PlayResX: 720
PlayResY: 1280
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Inter SemiBold,34,&H00FFFFFF,&H000000FF,&HAA000000,&H80000000,0,0,0,0,100,100,0,0,3,0,0,2,36,36,72,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:00:02.50,Cap,,0,0,0,,Hola, soy Luigi Canoro.
Dialogue: 0,0:00:02.50,0:00:06.50,Cap,,0,0,0,,Yo soy de Brasil, pero vivo en Mar del Plata,\NArgentina, desde 2013.
Dialogue: 0,0:00:06.50,0:00:12.21,Cap,,0,0,0,,Soy recibido de la UTN y en los últimos 10 años\Nestuve trabajando en la industria tech.
Dialogue: 0,0:00:12.21,0:00:17.21,Cap,,0,0,0,,Pasé por empresas como Globant, GlobalLogic,\NTemperies, Concentrix.
Dialogue: 0,0:00:17.21,0:00:24.40,Cap,,0,0,0,,Y también en startups de Estados Unidos:\NCruisebound, SimpleNight, Disro, Ernesta.
Dialogue: 0,0:00:24.40,0:00:29.50,Cap,,0,0,0,,Fundé PsicoConecta y Pavla.
EOF

# Body: crop off ceiling + pants + burned-in captions, punch in on face.
# Source 720x1280 → crop 496x860 at (112, 40) keeps head + torso, drops y>~900 captions.
ffmpeg -y -ss 11.00 -t 29.50 -i "$SRC" \
  -vf "crop=496:860:112:40,scale=720:1280:flags=lanczos,setsar=1,ass=$WORK/captions.ass,drawtext=fontfile=${FONT_B}:text='DEMO · edit-only':fontsize=18:fontcolor=white@0.85:x=w-text_w-28:y=36,drawbox=x=48:y=980:w=280:h=6:color=0x3B82F6@1:t=fill:enable='between(t,0,5.2)',drawtext=fontfile=${FONT_B}:text='LUIGI CANORO':fontsize=30:fontcolor=white:x=48:y=1000:enable='between(t,0,5.2)',drawtext=fontfile=${FONT_S}:text='Builder en la Bahía':fontsize=22:fontcolor=0x93C5FD:x=48:y=1040:enable='between(t,0,5.2)',drawbox=x=36:y=168:w=648:h=52:color=black@0.55:t=fill:enable='between(t,12.21,17.21)',drawtext=fontfile=${FONT_S}:text='Globant  ·  GlobalLogic  ·  Temperies  ·  Concentrix':fontsize=20:fontcolor=white:x=(w-text_w)/2:y=182:enable='between(t,12.21,17.21)'" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=7,alimiter=limit=0.84" \
  -c:v libx264 -pix_fmt yuv420p -preset fast -crf 21 -r 30 \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  "$WORK/body.mp4"

# Open slate 1.6s + close slate 2.4s (silent)
ffmpeg -y -f lavfi -i "color=c=0x0B0B0C:s=720x1280:d=1.60:r=30" -f lavfi -i "anullsrc=r=44100:cl=stereo:d=1.60" \
  -vf "drawtext=fontfile=${FONT_B}:text='CRAFT DEMO':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=520,drawtext=fontfile=${FONT_S}:text='after  ·  no reshoot':fontsize=26:fontcolor=0x93C5FD:x=(w-text_w)/2:y=590,drawtext=fontfile=${FONT_S}:text='cold open · crop · captions with spaces':fontsize=20:fontcolor=white@0.75:x=(w-text_w)/2:y=650" \
  -c:v libx264 -pix_fmt yuv420p -preset fast -crf 21 -r 30 -c:a aac -b:a 128k -shortest "$WORK/open.mp4"

ffmpeg -y -f lavfi -i "color=c=0x0B0B0C:s=720x1280:d=2.40:r=30" -f lavfi -i "anullsrc=r=44100:cl=stereo:d=2.40" \
  -vf "drawtext=fontfile=${FONT_B}:text='EDIT-ONLY CEILING':fontsize=36:fontcolor=white:x=(w-text_w)/2:y=520,drawtext=fontfile=${FONT_S}:text='Still a kitchen lock-off.':fontsize=26:fontcolor=0x93C5FD:x=(w-text_w)/2:y=590,drawtext=fontfile=${FONT_S}:text='Reshoot the hook. Do not publish v4.':fontsize=20:fontcolor=white@0.8:x=(w-text_w)/2:y=650" \
  -c:v libx264 -pix_fmt yuv420p -preset fast -crf 21 -r 30 -c:a aac -b:a 128k -shortest "$WORK/close.mp4"

printf "file '%s'\nfile '%s'\nfile '%s'\n" "$WORK/open.mp4" "$WORK/body.mp4" "$WORK/close.mp4" > "$WORK/list.txt"
ffmpeg -y -f concat -safe 0 -i "$WORK/list.txt" -c copy "$OUT"

# Proof still (face + lower-third + spaced caption)
ffmpeg -y -ss 4.8 -i "$WORK/body.mp4" -frames:v 1 -q:v 3 "$ROOT/craft-demo-still.jpg"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
ls -lah "$OUT" "$ROOT/craft-demo-still.jpg"
