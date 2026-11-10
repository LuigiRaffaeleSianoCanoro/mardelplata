---
name: bah-a-vlog-promo-short-protocol
description: >-
  Use when making Builder en la Bahía / vlog SF promotional Reels or YouTube
  Shorts after an episode is Approved and Public: final SRT transcript →
  strongest model picks ~30 s of timestamped spoken bait → ffmpeg cut from the
  master → animated motion-graphics promo with YouTube CTA (Opus + Gemini
  versions).
---
**When:** After a Builder en la Bahía / SF vlog long episode is **Approved and Public** on YouTube (or Luigi asks for a promo Short/Reel for that episode). Standing protocol since 2026-10-01.

**Not for:** interview guest reels (use `short-form-reel-editor`) or agency event promos (use `event-promo-interview-editor`).

## Pipeline (fail-closed order)
1. **Transcript** — Use the episode's final Spanish SRT (burn-aligned). Convert to a readable `TRANSCRIPT.md`. Spot-check against the A-roll if the SRT looks wrong; do not invent lines.
2. **Bait selection (strongest reasoning model, max effort)** — Give the SRT to the strongest available reasoning model. Ask for the best spoken bait that fills **~30 seconds** total: a ranked primary package (1–3 windows totaling ~28–32 s) + 2 alternates. Each window: exact in/out timestamps matching SRT cues, quoted text, why it baits. Prefer A-roll hooks; skip referral bumper stretches unless they are the only strong bait. No soft "Hoy subo…" openers; no guest-name laundry lists. Save as `BAIT_PLAN.md`.
3. **Cut** — From the approved full-1080 master, cut the chosen windows with ffmpeg (cookbook §1.4 trim/concat) → `raw_assembly.mp4` (~25–35 s, 9:16, H.264 yuv420p AAC +faststart). Also make a ≤15 MB 720p proxy if a model needs a video attachment.
4. **Animated promo** — Strongest visual model (Claude Opus at high effort; a Gemini version too so Luigi can compare). Feed the cut + episode URL + bait plan. Produce a 9:16 Reel/Short full of motion graphics / kinetic text that **promotes the YouTube episode** (hard CTA + link). Bahía look: dark cinematic + blue accent. Original audio where Luigi talks. Phone-safe encode. No hashtags burned in. Complete-edit baseline applies (`reel-production-complete-edit`); never a slideshow.
5. **Deliver** — Full watch + independent second look → Review package (`video-review-package`). Deliver FINAL as a single clear mp4 local file. Caption = "Option C": first person, short and dry (title line + outcome + already on the channel + URL), passed through `qa-texto-anti-tropes-llm`. Luigi posts on X/IG himself unless he asks otherwise.

## Work folder
`bahia-epN-promo-YYYY-MM-DD/` with `TRANSCRIPT.md`, `BAIT_PLAN.md`, `cuts/`, `FINAL/`.

## Repo
Luigi's content repo (`marcaPersonal`, alt `FabricaDeContenido`). Never the shared `mardelplata` repo for social/content.

## Anti-patterns
Skipping the bait selection and guessing cuts; shipping an animated reel without a timestamped BAIT_PLAN; soft teaser captions; opening Review before the second look; trying to upload huge masters through fragile browser flows.
