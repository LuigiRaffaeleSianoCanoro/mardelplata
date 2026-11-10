# ffmpeg cookbook — verification run

Run: `bash tools/test_ffmpeg_cookbook.sh` on 2026-11-10, ffmpeg version 7.1.5-0+deb13u1, Linux, synthetic inputs (lavfi `testsrc2`/`smptebars` + `sine`/`aevalsrc` with silent gaps, `anoisesrc` whoosh, generated SRT/ASS/PNG).

Beyond "it runs", these outputs were spot-checked:
- Jump cuts: 12 s source with 1.5 s silences → 5.37 s (manual 2-segment) and 8.1 s (`jumpcut.py`, 3 segments, EDL written).
- Two-pass loudnorm: measured −18.1 LUFS → output −13.9 LUFS integrated.
- Burned subtitles (ASS and SRT+force_style) and the lower third were rendered and visually checked on extracted frames (bottom-centered, legible).
- Rotation: a file tagged `-display_rotation 90` is flagged by `preflight_deliver.sh`; after re-encode the rotation side data is gone.
- `xfade` 5 s + 5 s with a 0.5 s transition → 9.5 s; plate insertion 5 s + 2 s → 7.0 s.
- `freezedetect` flags a static 4 s clip (slideshow alarm).

Not executed by the script: the Whisper CLI line (not ffmpeg) and `arnndn` (needs an external RNNoise model file).

```
PASS  00_synth_169
PASS  00_synth_916
PASS  00_synth_916b
PASS  00_synth_sfx
PASS  01_silencedetect
PASS  01_select_aselect
PASS  01_trim_concat
PASS  01_jumpcut_py
PASS  01_punchin
PASS  02_cleanup_chain
PASS  02_loudnorm_pass1
PASS  02_loudnorm_2pass
PASS  02_loudnorm_manual_pass2
PASS  02_ebur128_verify
PASS  02_gate_anlmdn
PASS  03_xfade
PASS  03_xfade_slide
PASS  03_fade_black
PASS  04_sfx_amix
PASS  04_sfx_multi
PASS  04_music_duck
PASS  05_subs_srt_style
PASS  05_subs_ass
PASS  05_srt_shift
PASS  05_srt_to_ass
PASS  05_soft_subs_mux
PASS  06_lower_third
PASS  06_drawtext_fade
PASS  06_make_plate_png
PASS  06_overlay_png_fade
PASS  06_plate_clip
PASS  06_insert_plate
PASS  07_center_crop
PASS  07_offset_crop
PASS  07_blur_pad
PASS  07_letterbox_pad
PASS  07_make_rotated
PASS  07_bake_rotation
PASS  07_probe_rotation
PASS  08_single_frame
PASS  08_png_frame
PASS  08_thumbnail_filter
PASS  08_contact_sheet
PASS  08_every_n_sec
PASS  08_thumb_169
PASS  09_export_reels
PASS  09_export_youtube
PASS  09_review_proxy
PASS  09_faststart_remux
PASS  09_preflight
PASS  09_preflight_detects_rotation
PASS  10_freezedetect
PASS  10_blackdetect
PASS  10_volumedetect
PASS  10_hardcut
PASS  10_scene_cuts
TOTAL pass=56 fail=0
```
