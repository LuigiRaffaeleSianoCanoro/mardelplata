#!/usr/bin/env bash
# Two-pass EBU R128 loudness normalization (default -14 LUFS, -1.5 dBTP) with a
# gentle voice-cleanup chain in front. Video is stream-copied.
# Usage: loudnorm_2pass.sh IN.mp4 OUT.mp4 [TARGET_LUFS] [TRUE_PEAK] [PRE_CHAIN]
#   PRE_CHAIN default: "highpass=f=80,lowpass=f=12000,afftdn=nr=10:nf=-40,acompressor=threshold=-20dB:ratio=3:attack=5:release=120"
#   Pass "anull" as PRE_CHAIN to only normalize.
set -euo pipefail
in="${1:?input}"; out="${2:?output}"; I="${3:--14}"; TP="${4:--1.5}"; LRA=11
pre="${5:-highpass=f=80,lowpass=f=12000,afftdn=nr=10:nf=-40,acompressor=threshold=-20dB:ratio=3:attack=5:release=120}"

json=$(ffmpeg -hide_banner -nostats -i "$in" -vn \
  -af "${pre},loudnorm=I=${I}:TP=${TP}:LRA=${LRA}:print_format=json" -f null - 2>&1 \
  | sed -n '/^{/,/^}/p')
get(){ python3 -c 'import json,sys; print(json.loads(sys.stdin.read())[sys.argv[1]])' "$1" <<<"$json"; }
mI=$(get input_i); mTP=$(get input_tp); mLRA=$(get input_lra); mTH=$(get input_thresh); off=$(get target_offset)
echo "pass1 measured: I=${mI} LUFS TP=${mTP} dBTP LRA=${mLRA} thresh=${mTH} offset=${off}"

ffmpeg -y -hide_banner -loglevel error -i "$in" -map 0:v? -map 0:a -c:v copy \
  -af "${pre},loudnorm=I=${I}:TP=${TP}:LRA=${LRA}:measured_I=${mI}:measured_TP=${mTP}:measured_LRA=${mLRA}:measured_thresh=${mTH}:offset=${off}:linear=true,aresample=48000" \
  -c:a aac -b:a 192k -movflags +faststart "$out"

# verify
ffmpeg -hide_banner -nostats -i "$out" -vn -af ebur128=peak=true -f null - 2>&1 | grep -A12 "Summary:" | grep -E "I:|Peak:" || true
