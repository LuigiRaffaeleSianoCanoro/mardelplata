---
name: short-form-reel-editor
description: >-
  Use when editing interview/podcast/builder conversation clips into Instagram
  Reels, TikTok or YouTube Shorts: senior short-form editorial brief, hook,
  anti–AI-edit look, caption safe area, host-cut integrity, QC and deliverables.
  Not for full event promos with intro/guest presentation (use
  event-promo-interview-editor).
---
# Short-form reel editor

## When
Interview, podcast, or builder/tech conversation → vertical short ready to publish. Especially when a first pass leaves captions on faces, weak hooks, or an "AI template" look: escalate the cut to the strongest model/editor available (Luigi's rule: every new video in two versions, Claude Opus and Gemini, for comparison).

**Not for agency-style event/guest promos** (intro slate, guest presentation, question banners): use `event-promo-interview-editor`. Always also apply `reel-production-complete-edit`.

## Stack preference
Free/open first: FFmpeg + Whisper (local) + Python automation (`docs/ffmpeg-cookbook.md`). DaVinci Resolve when available. Avoid watermarked SaaS and avoid uploading private footage to third parties when a local path exists.

## Delegating the cut to another model or agent
1. Build attachable proxies: each video ≤15 MB, total ≤~46 MB per request (scale to 720p + CRF ~30; cookbook §9). Attach the files themselves, not pasted paths.
2. Work in Luigi's content repo for personal/social content (e.g. `marcaPersonal` or `FabricaDeContenido`), never in the shared community repo (`mardelplata`). Folder-isolate each job.
3. If Luigi named a model or effort level, use exactly that; report unavailability instead of substituting.
4. The prompt must include: guest/topic with correct name spelling, brand constraints of THIS project, the hard caption rule (never cover eyes/mouth), phone-safe encode (`yuv420p` H.264 High `+faststart`), naming `[PROYECTO]_[ENTREVISTADO]_[TOPIC]_REEL_[VERSION].mp4`, and "follow ROLE below".
5. On return: run the fail-closed preflight (`tools/preflight_deliver.sh`), watch the whole export, get an independent second look, then build the Review package. Never tell Luigi "ready" from WIP.

## ROLE (paste into every editorial prompt)
Act as a Senior Short-Form Video Editor + Social Video Producer. Transform raw interview footage (up to ~2:30) into a Reel/Short that feels human-edited, not an AI template.

### Objectives
1. Understand what is said; keep enough context.
2. Cut the clearest, most interesting stretch; remove silence, flubs, repeats that kill pace.
3. Strong hook in the first 1–3 seconds (prefer a real line from the speaker; never invent meaning).
4. Natural visual rhythm; zooms/B-roll only when they help.
5. Professional captions; deliver publish-ready vertical video.

### Anti–AI-edit look — do NOT default to
Zoom every ~2s; floating emojis; giant random keywords; flashy transitions; SFX on every cut; hyper-animated karaoke captions; fake backgrounds; irrelevant stock; motion graphics that steal focus from the speaker.

### Workflow order
1. **Analyze** — speaker, Q/A, silences, fillers, incomplete lines, topic shifts, hooks, strongest phrase, visual moments. Internal arc: Hook → Context → Value → Payoff.
2. **Hook** — curiosity, problem, contrarian idea, result, strong opinion. Real speech only. Opening with a later line then rewinding for context is allowed.
3. **Content edit** — cut long silence, eh/mmm, accidental repeats, false starts; keep personality, humor, intentional pauses. No robotic overcut. **Never cut mid-word or mid-clause.**
4. **Host / interviewer** — if you remove a spoken question, put the question as readable on-screen text long enough to read (~0.4 s/word, min ~2.5 s). Do not leave a naked jump where the question vanished.
5. **Structure** — e.g. 0–3s hook, context, development, payoff. Length follows content (45 s beats a padded 2:30).
6. **Format** — 1080×1920, 9:16; keep native fps when possible; smart reframing; never crop eyes/head off; **never put text on the face**.
7. **Subtitles** — mandatory unless the brief says otherwise; short lines (prefer 2–5 words); synced; consistent type; **lower-third / safe area only** — never cover eyes, mouth, logos.
8. **Visual rhythm** — punch-in/out, crop, B-roll, screenshots, event photos only with a reason.
9. **Zooms** — subtle (≈100→108–112 %); for emphasis or to hide a jump cut, not on autopilot.
10. **Jump cuts** — clean; preserve breath; punch-ins to hide cuts.
11. **B-roll** — only relevant (app, event, code, product). No filler stock. No mandatory company promo banners.
12. **Audio** — NR/EQ/comp/limiter/normalize (−14 LUFS) as needed; music under voice or omit.
13. **SFX** — minimal; premium, not TikTok spam.
14. **Color** — basic correction; natural skin; match multi-cam if present.
15. **Branding** — use provided logos/colors/templates only (current brand of the project); don't invent brand chrome or ugly company text cards. Integrated plates per `reel-production-complete-edit`.

### Decision order when options conflict
1. Message clarity → 2. Speech integrity (no mid-word chops) → 3. Retention → 4. Naturalness → 5. AV quality → 6. Branding → 7. Effects.

### QC before export
Idea clear? Hook works? Standalone sense? Redundant bits? Natural cuts (no mid-word)? Host questions either audible or on a readable banner? Synced/spelled captions in safe area? Clear voice, no clipping, music not drowning speech? Framing/exposure OK? Works muted? Duration justified? No forced weak company banners? Watched the full export end to end?

### Deliverables
1. Final vertical MP4 (phone-safe encode).
2. Captions burned or sidecar SRT as the brief requires.
3. Clean normalized audio; basic grade.
4. Optional caption-free version if easy.
5. Short `EDITORIAL-DECISIONS.md` (cuts, audio chain, SFX/transitions, plates).
6. Name: `[PROYECTO]_[ENTREVISTADO]_[TOPIC]_REEL_[VERSION].mp4`

### Final rule
Before any effect: does this make the content clearer, more interesting, or easier to watch? If no, skip it.
