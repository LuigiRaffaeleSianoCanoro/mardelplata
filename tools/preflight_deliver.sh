#!/usr/bin/env bash
# Fail-closed phone-safe + structural gate before a video goes to review.
# Usage: preflight_deliver.sh <mp4> [expected_w] [expected_h]
# Checks: H.264, yuv420p, not 4:4:4, SAR 1:1, expected WxH, AAC audio present,
# no residual rotation metadata, moov atom before mdat (+faststart), and writes
# 3 mid stills (25/50/75%) next to the file so a human/model can confirm the
# content is UPRIGHT (head toward the top). Dimensions alone are not enough.
set -euo pipefail
f="${1:?mp4 path required}"; ew="${2:-}"; eh="${3:-}"
[[ -f "$f" ]] || { echo "FAIL missing file: $f"; exit 1; }
p(){ ffprobe -v error -select_streams "$1" -show_entries "$2" -of default=nw=1:nk=1 "$f" | head -1; }
codec=$(p v:0 stream=codec_name); pix=$(p v:0 stream=pix_fmt); prof=$(p v:0 stream=profile)
w=$(p v:0 stream=width); h=$(p v:0 stream=height); sar=$(p v:0 stream=sample_aspect_ratio)
ac=$(p a:0 stream=codec_name || true)
dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$f")
size=$(stat -c %s "$f" 2>/dev/null || stat -f %z "$f")
rot=$(ffprobe -v error -select_streams v:0 -show_entries stream_side_data=rotation -of default=nw=1:nk=1 "$f" | head -1 || true)
fail=0; say(){ echo "$*"; }
[[ "$codec" == "h264" ]] || { say "FAIL codec=$codec (want h264)"; fail=1; }
[[ "$pix" == "yuv420p" || "$pix" == "yuvj420p" ]] || { say "FAIL pix_fmt=$pix (want yuv420p)"; fail=1; }
echo "$prof" | grep -qi '4:4:4' && { say "FAIL profile=$prof (4:4:4 not phone-safe)"; fail=1; }
[[ "$sar" == "1:1" || "$sar" == "N/A" || -z "$sar" ]] || { say "FAIL sar=$sar (want 1:1)"; fail=1; }
[[ -z "$rot" || "$rot" == "0" ]] || { say "FAIL residual rotation side data ($rot): bake it (re-encode with autorotate)"; fail=1; }
[[ "$ac" == "aac" ]] || { say "FAIL audio codec='${ac:-none}' (want aac)"; fail=1; }
if [[ -n "$ew" && -n "$eh" ]]; then [[ "$w" == "$ew" && "$h" == "$eh" ]] || { say "FAIL size ${w}x${h} want ${ew}x${eh}"; fail=1; }; fi
# +faststart: moov must appear before mdat
order=$(python3 - "$f" <<'PY'
import struct,sys
f=open(sys.argv[1],'rb'); seen=[]
while True:
    hdr=f.read(8)
    if len(hdr)<8: break
    size,typ=struct.unpack('>I4s',hdr); typ=typ.decode('latin1')
    if size==1: size=struct.unpack('>Q',f.read(8))[0]; f.seek(size-16,1)
    elif size==0: seen.append(typ); break
    else: f.seek(size-8,1)
    seen.append(typ)
print('ok' if 'moov' in seen and 'mdat' in seen and seen.index('moov')<seen.index('mdat') else 'bad')
PY
)
[[ "$order" == "ok" ]] || { say "FAIL moov after mdat (re-mux with -movflags +faststart)"; fail=1; }
base="${f%.*}"
for pct in 25 50 75; do
  t=$(python3 -c "print(${dur}*${pct}/100)")
  ffmpeg -y -hide_banner -loglevel error -ss "$t" -i "$f" -frames:v 1 -q:v 3 "${base}_still_${pct}.jpg"
done
say "OK_PROBE $f ${w}x${h} pix=$pix profile=$prof audio=$ac dur=${dur}s size=$((size/1024/1024))MB rotation=${rot:-none}"
say "STILLS ${base}_still_25.jpg ${base}_still_50.jpg ${base}_still_75.jpg  -> open them: is the subject upright?"
[[ $fail -eq 0 ]] || exit 2
exit 0
