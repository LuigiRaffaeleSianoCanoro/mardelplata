#!/usr/bin/env bash
# Runs every command in docs/ffmpeg-cookbook.md against synthetic clips
# (lavfi testsrc2 + sine with silent gaps). Prints PASS/FAIL per recipe.
# Usage: bash tools/test_ffmpeg_cookbook.sh   (needs ffmpeg with libx264, libass, libfreetype)
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
T="$(mktemp -d)"; cd "$T"
FONT="${FONT:-$(fc-match -f '%{file}' 'DejaVu Sans:bold' 2>/dev/null)}"
pass=0; fail=0; results=()
run(){ local name="$1"; shift; if "$@" >"$name.log" 2>&1; then results+=("PASS  $name"); pass=$((pass+1)); else results+=("FAIL  $name (see $T/$name.log)"); fail=$((fail+1)); fi; }
q="-hide_banner -loglevel error -y"

# 0. Synthetic sources: 16:9 talking-head stand-in with 1.5 s silences every 4 s
run 00_synth_169 ffmpeg $q -f lavfi -i "testsrc2=size=1920x1080:rate=30:duration=12" \
  -f lavfi -i "aevalsrc='if(lt(mod(t\,4)\,2.5)\,0.4*sin(2*PI*220*t)+0.02*(random(0)-0.5)\,0.001*(random(0)-0.5))':s=48000:d=12" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -ac 2 -shortest in.mp4
run 00_synth_916 ffmpeg $q -f lavfi -i "testsrc2=size=1080x1920:rate=30:duration=5" -f lavfi -i "sine=frequency=330:sample_rate=48000:duration=5" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -ac 2 -shortest a.mp4
run 00_synth_916b ffmpeg $q -f lavfi -i "smptebars=size=1080x1920:rate=30:duration=5" -f lavfi -i "sine=frequency=550:sample_rate=48000:duration=5" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -ac 2 -shortest b.mp4
run 00_synth_sfx ffmpeg $q -f lavfi -i "anoisesrc=color=pink:amplitude=0.6:duration=0.6:sample_rate=48000" \
  -af "highpass=f=400,afade=t=in:st=0:d=0.25,afade=t=out:st=0.3:d=0.3" -ac 2 whoosh.wav
printf '1\n00:00:00,500 --> 00:00:02,400\nEsto es una prueba\n\n2\n00:00:04,000 --> 00:00:06,000\nde subtítulos quemados\n' > subs.srt

# 1. Jump cuts
run 01_silencedetect sh -c "ffmpeg -hide_banner -nostats -i in.mp4 -vn -af silencedetect=noise=-35dB:d=0.45 -f null - 2> silence.log; grep -q silence_start silence.log"
run 01_select_aselect ffmpeg $q -i in.mp4 \
  -vf "select='between(t,0,2.62)+between(t,3.88,6.62)',setpts=N/FRAME_RATE/TB" \
  -af "aselect='between(t,0,2.62)+between(t,3.88,6.62)',asetpts=N/SR/TB" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k jump_select.mp4
run 01_trim_concat ffmpeg $q -i in.mp4 -filter_complex \
"[0:v]trim=start=0:end=2.62,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=0:end=2.62,asetpts=PTS-STARTPTS,afade=t=out:st=2.61:d=0.01[a0];\
[0:v]trim=start=3.88:end=6.62,setpts=PTS-STARTPTS[v1];[0:a]atrim=start=3.88:end=6.62,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.01[a1];\
[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k jump_concat.mp4
run 01_jumpcut_py python3 "$HERE/jumpcut.py" in.mp4 jump_auto.mp4 --noise -35 --min-silence 0.45 --pad 0.12 --edl edl.csv
run 01_punchin ffmpeg $q -i jump_concat.mp4 -filter_complex \
"[0:v]split=2[a][b];[a]trim=0:2.62,setpts=PTS-STARTPTS[v0];[b]trim=start=2.62,setpts=PTS-STARTPTS,crop=iw/1.1:ih/1.1,scale=1920:1080,setsar=1[v1];[v0][v1]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy punchin.mp4

# 2. Audio cleanup
run 02_cleanup_chain ffmpeg $q -i in.mp4 -c:v copy \
  -af "highpass=f=80,lowpass=f=12000,afftdn=nr=10:nf=-40,deesser=i=0.4,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=2" \
  -c:a aac -b:a 192k clean.mp4
run 02_loudnorm_pass1 sh -c "ffmpeg -hide_banner -nostats -i clean.mp4 -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | grep -q input_i"
run 02_loudnorm_2pass bash "$HERE/loudnorm_2pass.sh" in.mp4 norm.mp4 -14 -1.5
run 02_loudnorm_manual_pass2 ffmpeg $q -i clean.mp4 -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-20.1:measured_TP=-3.2:measured_LRA=4.0:measured_thresh=-30.5:offset=0.3:linear=true,aresample=48000" \
  -c:a aac -b:a 192k norm_manual.mp4
run 02_ebur128_verify sh -c "ffmpeg -hide_banner -nostats -i norm.mp4 -vn -af ebur128=peak=true -f null - 2>&1 | grep -q 'Integrated loudness'"
run 02_gate_anlmdn ffmpeg $q -i in.mp4 -vn -af "agate=threshold=0.01:ratio=2:attack=10:release=250,anlmdn=s=0.0005" -c:a aac gate.m4a

# 3. Transitions
run 03_xfade ffmpeg $q -i a.mp4 -i b.mp4 -filter_complex \
"[0:v][1:v]xfade=transition=fade:duration=0.5:offset=4.5,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.5:c1=tri:c2=tri[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac -b:a 192k -movflags +faststart xfade.mp4
run 03_xfade_slide ffmpeg $q -i a.mp4 -i b.mp4 -filter_complex \
"[0:v]settb=AVTB,fps=30[v0];[1:v]settb=AVTB,fps=30[v1];[v0][v1]xfade=transition=smoothleft:duration=0.35:offset=4.65,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.35[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac xfade_slide.mp4
run 03_fade_black ffmpeg $q -i a.mp4 -vf "fade=t=in:st=0:d=0.4,fade=t=out:st=4.6:d=0.4" -af "afade=t=in:st=0:d=0.3,afade=t=out:st=4.6:d=0.4" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac fadeblack.mp4

# 4. SFX
run 04_sfx_amix ffmpeg $q -i in.mp4 -i whoosh.wav -filter_complex \
"[1:a]volume=0.35,adelay=2500|2500[s];[0:a][s]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k sfx.mp4
run 04_sfx_multi ffmpeg $q -i in.mp4 -i whoosh.wav -filter_complex \
"[1:a]asplit=2[w1][w2];[w1]volume=0.3,adelay=2500:all=1[s1];[w2]volume=0.3,adelay=6500:all=1[s2];[0:a][s1][s2]amix=inputs=3:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac sfx_multi.mp4
run 04_music_duck ffmpeg $q -i in.mp4 -f lavfi -t 12 -i "sine=frequency=110:sample_rate=48000" -filter_complex \
"[0:a]asplit=2[voice][key];[1:a]aformat=channel_layouts=stereo,volume=0.25[music];[music][key]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400[ducked];[voice][ducked]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac duck.mp4

# 5. Subtitles
run 05_subs_srt_style ffmpeg $q -i a.mp4 -vf \
"subtitles=subs.srt:original_size=1080x1920:force_style='FontName=DejaVu Sans,Bold=1,FontSize=64,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=4,Shadow=0,Alignment=2,MarginV=420'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy subs_burn.mp4
cat > subs.ass <<'ASS'
[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Reel,DejaVu Sans,68,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,5,0,2,90,90,420,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.50,0:00:02.40,Reel,,0,0,0,,Esto es una prueba
Dialogue: 0,0:00:04.00,0:00:06.00,Reel,,0,0,0,,de subtítulos {\c&H00FFA658&}quemados
ASS
run 05_subs_ass ffmpeg $q -i a.mp4 -vf "ass=subs.ass" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy subs_ass.mp4
run 05_srt_shift ffmpeg $q -itsoffset 2.0 -i subs.srt -c copy subs_shift.srt
run 05_srt_to_ass ffmpeg $q -i subs.srt subs_conv.ass
run 05_soft_subs_mux ffmpeg $q -i a.mp4 -i subs.srt -map 0 -map 1 -c copy -c:s mov_text -metadata:s:s:0 language=spa soft.mp4

# 6. Plates / lower thirds
run 06_lower_third ffmpeg $q -i a.mp4 -vf \
"drawbox=x=60:y=ih-520:w=760:h=170:color=black@0.65:t=fill:enable='between(t,0.5,3.5)',\
drawtext=fontfile='$FONT':text='Nombre Apellido':fontsize=58:fontcolor=white:x=90:y=h-500:enable='between(t,0.5,3.5)',\
drawtext=fontfile='$FONT':text='Builder · Mar del Plata':fontsize=36:fontcolor=0x58A6FF:x=90:y=h-425:enable='between(t,0.5,3.5)'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy lowerthird.mp4
run 06_drawtext_fade ffmpeg $q -i a.mp4 -vf \
"drawtext=fontfile='$FONT':text='EP. 3':fontsize=120:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:alpha='if(lt(t,0.5),0,if(lt(t,0.8),(t-0.5)/0.3,if(lt(t,2.7),1,if(lt(t,3),(3-t)/0.3,0))))'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy titlefade.mp4
run 06_make_plate_png ffmpeg $q -f lavfi -i "color=c=0x0B0B0C:s=1080x1920" -frames:v 1 \
  -vf "drawtext=fontfile='$FONT':text='Título de la placa':fontsize=90:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2,drawtext=fontfile='$FONT':text='ejemplo.com':fontsize=44:fontcolor=0x58A6FF:x=(w-text_w)/2:y=h-260" plate.png
run 06_overlay_png_fade ffmpeg $q -i a.mp4 -loop 1 -t 3 -i plate.png -filter_complex \
"[1:v]format=rgba,scale=540:-1,fade=t=in:st=0:d=0.3:alpha=1,fade=t=out:st=2.7:d=0.3:alpha=1,setpts=PTS+1/TB[p];[0:v][p]overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t,1,4)':eof_action=pass,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 18 -c:a copy overlay.mp4
run 06_plate_clip ffmpeg $q -loop 1 -framerate 30 -t 2 -i plate.png -f lavfi -t 2 -i "anullsrc=channel_layout=stereo:sample_rate=48000" \
  -vf "zoompan=z='min(zoom+0.0008,1.04)':d=60:s=1080x1920:fps=30,format=yuv420p" -c:v libx264 -crf 18 -c:a aac -shortest plate_clip.mp4
run 06_insert_plate ffmpeg $q -i a.mp4 -i plate_clip.mp4 -filter_complex \
"[0:v]trim=0:2,setpts=PTS-STARTPTS[v0];[0:a]atrim=0:2,asetpts=PTS-STARTPTS[a0];\
[0:v]trim=start=2,setpts=PTS-STARTPTS[v2];[0:a]atrim=start=2,asetpts=PTS-STARTPTS[a2];\
[1:v]setsar=1[v1];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];\
[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -movflags +faststart with_plate.mp4

# 7. 9:16 reframing
run 07_center_crop ffmpeg $q -i in.mp4 -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy crop916.mp4
run 07_offset_crop ffmpeg $q -i in.mp4 -vf "crop=ih*9/16:ih:iw*0.30:0,scale=1080:1920:flags=lanczos,setsar=1" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy crop916_off.mp4
run 07_blur_pad ffmpeg $q -i in.mp4 -filter_complex \
"[0:v]split=2[bg][fg];[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=30,eq=brightness=-0.08[b];[fg]scale=1080:-2[f];[b][f]overlay=(W-w)/2:(H-h)/2,setsar=1,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 18 -c:a copy blurpad916.mp4
run 07_letterbox_pad ffmpeg $q -i in.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0B0B0C,setsar=1" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy pad916.mp4
run 07_make_rotated ffmpeg $q -display_rotation 90 -i a.mp4 -c copy rotated_phone.mp4
run 07_bake_rotation sh -c "ffmpeg -hide_banner -loglevel error -y -i rotated_phone.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy -metadata:s:v:0 rotate=0 upright.mp4 && test -z \"\$(ffprobe -v error -select_streams v:0 -show_entries stream_side_data=rotation -of default=nw=1:nk=1 upright.mp4)\""
run 07_probe_rotation ffprobe -v error -select_streams v:0 -show_entries stream=width,height:stream_side_data=rotation -of default=nw=1 rotated_phone.mp4

# 8. Thumbnails / frames
run 08_single_frame ffmpeg $q -ss 3.5 -i in.mp4 -frames:v 1 -q:v 2 frame.jpg
run 08_png_frame ffmpeg $q -ss 3.5 -i in.mp4 -frames:v 1 frame.png
run 08_thumbnail_filter ffmpeg $q -i in.mp4 -vf "thumbnail=n=150,scale=1280:720" -frames:v 1 -fps_mode vfr best.jpg
run 08_contact_sheet ffmpeg $q -i in.mp4 -vf "fps=1/1,scale=320:-2,tile=4x3:padding=6:color=black" -frames:v 1 sheet.jpg
run 08_every_n_sec ffmpeg $q -i in.mp4 -vf fps=1/2 -q:v 3 qa_%03d.jpg
run 08_thumb_169 ffmpeg $q -ss 2 -i in.mp4 -frames:v 1 -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" thumb_1280x720.jpg

# 9. Final exports
run 09_export_reels ffmpeg $q -i with_plate.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30" \
  -c:v libx264 -preset slow -profile:v high -level:v 4.2 -pix_fmt yuv420p -crf 18 -maxrate 12M -bufsize 24M -g 60 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart REEL_v1.mp4
run 09_export_youtube ffmpeg $q -i in.mp4 \
  -vf "scale=1920:1080:flags=lanczos,setsar=1" -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -crf 18 -g 15 -bf 2 \
  -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart YT_v1.mp4
run 09_review_proxy ffmpeg $q -i REEL_v1.mp4 -vf "scale=-2:1280" -c:v libx264 -preset veryfast -crf 30 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart REEL_v1_proxy.mp4
run 09_faststart_remux ffmpeg $q -i in.mp4 -c copy -movflags +faststart remux.mp4
run 09_preflight bash "$HERE/preflight_deliver.sh" REEL_v1.mp4 1080 1920
run 09_preflight_detects_rotation sh -c "! bash '$HERE/preflight_deliver.sh' rotated_phone.mp4"

# 10. QA detectors
run 10_freezedetect sh -c "ffmpeg -hide_banner -nostats -loop 1 -t 4 -i plate.png -vf freezedetect=n=0.003:d=2 -f null - 2>&1 | grep -q freeze_start"
run 10_blackdetect ffmpeg -hide_banner -nostats -i fadeblack.mp4 -vf blackdetect=d=0.1:pic_th=0.98 -an -f null -
run 10_volumedetect sh -c "ffmpeg -hide_banner -nostats -i REEL_v1.mp4 -vn -af volumedetect -f null - 2>&1 | grep -q max_volume"
run 10_hardcut ffmpeg $q -i a.mp4 -i b.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -c:a aac hardcut.mp4
run 10_scene_cuts sh -c "ffmpeg -hide_banner -nostats -i hardcut.mp4 -vf \"select='gt(scene,0.3)',showinfo\" -an -f null - 2>&1 | grep -q pts_time"

printf '%s\n' "${results[@]}"
echo "TOTAL pass=$pass fail=$fail  (workdir: $T)"
[[ $fail -eq 0 ]]
