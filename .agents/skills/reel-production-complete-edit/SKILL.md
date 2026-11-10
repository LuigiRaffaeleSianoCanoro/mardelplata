---
name: reel-production-complete-edit
description: >-
  Use for EVERY reel production or revision (any project): mandatory jump cuts,
  audio cleanup, transitions or sound effects, integrated plates inside the MP4,
  synced captions, EDL, technical preflight and full-video QA before delivery.
  Subtitles + logo over an untouched take is NOT an edit.
---
# Complete reel editing — mandatory baseline

Apply to every reel production, including filmed talking-head clips, across projects. A straight take with subtitles and a logo is **not** a complete edit (Luigi, 2026-11-06). This baseline complements `video-review-package` and the brand-specific references of each repo (`PROJECT_CONTENT_RULES.md`); it does not replace their gates.

Tools: ffmpeg + Whisper (local) + Python, or DaVinci Resolve if available. Every technique below has a tested recipe in `docs/ffmpeg-cookbook.md`. Full QA in `docs/qa-checklist.md`.

## Before editing
- Recover the approved reference and prior instructions (repo docs, brief, previous feedback); do not make Luigi repeat them. Identify required integrated plates and their actual timeline position, not only separate cover images.
- Verify source resolution, rotation (phone Display Matrix) and identity of every person. Reject low-res previews/partial downloads.
- Obtain a faithful timed transcript (Whisper with word timestamps), then correct proper nouns against the brief. Preserve the speaker's real voice and the meaning of the script.
- Follow Luigi's creative-model workflow: every NEW video gets **two versions to compare, one made with Claude Opus and one with Gemini**, plus independent review by another strong model. If a required model is unavailable, say so; never substitute silently.
- AI voice is allowed and autonomous when the piece needs VO: do not wait for Luigi's recordings unless he provided them. It still needs his approval before publishing.

## Required work in EVERY reel
1. **Jump cuts:** actively edit pacing; remove dead air, false starts, repetitions, fillers ("ehhh"), lip smacks where appropriate; use intentional framing changes (subtle punch-ins ~108–112 %) to support the discourse and hide cuts. Cut on safe word/clause boundaries, **never mid-word**, and preserve all required ideas. Do not invent extra dialogue or chase arbitrary cut quotas. (Cookbook §1.)
2. **Audio cleanup:** inspect and actually process the voice for consistent intelligibility and level: gentle rumble/noise reduction (highpass, afftdn/anlmdn/DeepFilterNet), EQ, compression, de-ess if needed, loudness normalization (two-pass loudnorm to −14 LUFS, TP ≤ −1.5 dBTP). No metallic artifacts, clipped peaks or over-denoising. A clean source needs restrained treatment, not an unprocessed bypass described as cleanup. Record the exact chain used. (Cookbook §2.)
3. **Transitions or sound effects:** incorporate deliberate, tasteful transitions (xfade/acrossfade, fades) and/or SFX at editorial beats (topic change, plate in/out, reveal). Keep the voice intelligible; avoid loud, repetitive effects and effects on every cut. Music is not automatically required and never substitutes for editing; if used, duck it under the voice. (Cookbook §3–4.)
4. **Integrated plates:** include the required branded plate(s) INSIDE the exported MP4 at the approved location and duration (opening plate, lower thirds, closing CTA plate). A separately delivered cover PNG does **not** satisfy this. Use the actual reference for design/timing; keep readability, identity, the CURRENT brand of that project and safe zones. When inserting segments, shift captions, SFX and overlays consistently. Plates move (motion, subtle zoom, animated entry), they are not dead stills. (Cookbook §6.)
5. **Captions and finishing:** accurate, synchronized captions in the reference style, 2–5 words per line, bottom-centered, off the face and inside platform safe zones. Correct color/framing, upright proportional export (no anisotropic stretch, eyes/head never cropped), complete final words and a clean ending. Deliver any cover and editable SRT requested. (Cookbook §5, §7.)

## Hard completion gate
- Check the request and reference against the finished timeline: jump cuts present, audio treatment applied, transitions or SFX audible/visible, plates genuinely embedded, captions synchronized, branding complete and correct for this project only.
- Keep an **edit decision list** (`EDITORIAL-DECISIONS.md`): cut times (tools/jumpcut.py writes a CSV), audio chain, effect/transition times and plate intervals. Do not claim work that was not performed.
- Run technical preflight: `bash tools/preflight_deliver.sh OUT.mp4 1080 1920` (dimensions, upright content via mid stills, H.264/yuv420p, AAC, SAR 1:1, +faststart, file size).
- **Watch the full exported video end to end** (or analyze it with your model's video understanding; if you cannot watch video, say so and review stills + audio yourself). At least **two** visual/audio QA rounds on the actual final render, covering plate transitions, every cut boundary, caption sync after timeline changes, SFX balance and closing overlays. Correct failures and re-review the changed portions. Use `docs/qa-checklist.md`.
- Never deliver a slideshow-style video (stills + text + music, dead plates under long VO). That is a fail, not a draft.
- An editor's or reviewer's pass is **not** Luigi's approval to publish. Never call a reel complete while any required editorial component is missing.
- Deliver the actual corrected files, clearly distinguish them from superseded versions (`_v2`, `_v3`), and state literally what was done. Production notes stay in NOTES/EDITORIAL-DECISIONS, never in the publishable copy. Do not publish or send to third parties without Luigi's explicit OK.
