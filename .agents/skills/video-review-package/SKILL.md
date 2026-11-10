---
name: video-review-package
description: >-
  Use when creating, editing, QAing or delivering any video/reel/motion still for
  Luigi: WIP vs Review vs Approved states, source lock, which editorial skill
  applies, mandatory QA rounds, fail-closed preflight, Review package contents
  and delivery of large masters.
---
# Video review package

Use for any job that produces video or motion stills for Luigi, whoever edits (you, another model, a teammate).

## States (exact names — never blur)
1. **WIP** — editing only. Do not ping Luigi.
2. **Review package** — preflight passed + full-video QA + independent second look. Luigi may open links on his phone.
3. **Approved** — Luigi's explicit OK for that exact version. Only then publish / send to third parties.

Forbidden user-facing words for WIP: `listo`, `done`, `PASS`, `ready`, `entregado`, `QA OK`.

## Source lock (before edit)
- Full-res verified; reject Google Photos "Carga parcial" / tiny proxies / partial downloads.
- One source file per guest; verify identity and **name spelling** against the brief.
- When delegating a trial cut to another model/agent: attach labeled full-res proxies, never a prior failed short cut, unless the brief says otherwise.
- Phone sources: record `stored_wxh`, `display_rotation` (Display Matrix / rotate), `display_wxh` (`ffprobe`, cookbook §7). The assembly must bake upright via autorotate (or matching transpose); never treat stored landscape as the edit canvas.

## Repo for content work
- Personal/social content lives in Luigi's content repo (`marcaPersonal`, alt `FabricaDeContenido`) or in the repo of the product it belongs to.
- **Never** use the shared community repo `mardelplata` for personal video/social content. Never mix projects.

## Which editorial skill
- Builder en la Bahía / SF trip long cut: `bah-a-edit-delivery-checklist` — **HARD MANDATORY** gates (Ep.1-craft motion intro/outro + Raffaele jingle credit, A-roll audio cleanup, muted transition audio, burned-in subs + SRT with proper-noun QA, referral bumpers, portada with the episode title, **upright phone orientation bake**). Before it: `bah-a-episode-pre-edit-plan`.
- Event / guest promo: `event-promo-interview-editor` — prefer light edit unless the brief asks for heavy restructure.
- Interview/podcast short with a strong hook: `short-form-reel-editor`.
- Bahía episode promo Reel/Short (after the episode is Public): `bah-a-vlog-promo-short-protocol`.
- Talk/workshop recording → clip series: `talk-clips-pipeline`.
- ALWAYS: `reel-production-complete-edit` (jump cuts, audio cleanup, transitions/SFX, integrated plates).

## Edit + semantic QA (mandatory rounds)
Min 2 visual QA rounds on the real final render, watching it end to end. Never anisotropic scale into 9:16. Captions never cover eyes/mouth/face. Subtitles bottom-centered. Full list: `docs/qa-checklist.md`.

### Light-edit preference (interviews/promos)
Before leaving WIP, check:
1. Host questions mostly kept in audio (not replaced by banners unless necessary).
2. Audio cleaned; silences trimmed without mid-thought jumps.
3. Picture/color looks decent; **9:16 correct = width < height AND upright content** (not WxH alone). Extract ≥3 mid stills from A-roll (and 1 B-roll if used); confirm subject head toward the top of frame. Dimension-only 9:16 is insufficient when sources carry Display Matrix rotation — fail WIP if any still is sideways.
4. Subs bottom-centered and off faces.
5. Guest names spelled per brief on lower thirds, titles, NOTES.
6. Brand/product names in the SRT match the episode brief (never Whisper mangling, e.g. «RC» for Arcee.ai).

### Host / interviewer speech integrity
1. Mid-word or mid-clause chops → fail.
2. Host question removed → require a question banner held long enough to read.
3. Document the host-integrity pass in NOTES.md.

### Company / promo graphics
Company full-screen banners off by default. Guest lower third is enough.

### Guest-requested cuts
Honor explicit guest asks and note them in EDITORIAL-DECISIONS.md.

## Hard preflight (fail-closed)
Run `bash tools/preflight_deliver.sh FILE.mp4 W H` before anyone else looks: yuv420p, H.264 High/Main/Baseline, +faststart, SAR 1:1, AAC, expected WxH, no residual rotation. Fail → stay WIP.

Also fail-closed if phone-sourced footage is sideways inside the frame, or NOTES claim "9:16" without upright mid-still paths.

For Bahía long episodes, also fail-closed if HARD MANDATORY checklist items are unchecked — especially **intro/outro must match the published Ep.1 motion craft** (`https://youtu.be/PqUviFOuxus`), not a plain typography plate, and **orientation upright bake**.

## Two versions to compare
Every new video: one version made with Claude Opus and one with Gemini, labeled. Report if one model was unavailable; no silent substitution.

## Review package
Phone-safe MP4s (both model versions when applicable), stills (include ≥3 upright A-roll mids), NOTES.md / EDITORIAL-DECISIONS.md, per-network copy in separate publishable files (no production notes inside), one short message to Luigi. Max one Review package per job until Luigi replies.

**Second-look ritual (fail-closed):** before opening Review, an independent reviewer (another model or you with fresh eyes) opens the proxy or the mid stills — **¿cabeza arriba?** If sideways → back to WIP.

## Publish delivery
- Long masters (hundreds of MB) are delivered as local files with flat clear names (e.g. `Bahia_EpN_FINAL.mp4`) plus TITLE, DESCRIPTION, SRT and portada beside the mp4. Verify integrity (SHA256) if you split/copy large files.
- Luigi uploads long masters to YouTube Studio himself. Do not try fragile browser uploads of huge files or "import from Drive" workarounds.
- After the episode is Public, run `bah-a-vlog-promo-short-protocol` for promo Shorts.
- Luigi posts X/IG promos himself unless he asks otherwise. Nothing is published without his explicit OK.

## Roles
Editor: WIP + preflight + NOTES. Reviewer: independent second look before Review. Luigi: Approve or bullets; uploads long masters; publishes.
