---
name: bah-a-episode-pre-edit-plan
description: >-
  Use when new Builder en la Bahía / vlog SF footage arrives (SwissTransfer,
  Drive, phone dump) before any cut: ingest, catalog every clip, transcribe all
  speech, then an EDIT_PLAN.md from the strongest reasoning model; do not
  assemble the long episode until Luigi OKs that plan.
---
# Bahía episode pre-edit plan

**When:** Any new Builder en la Bahía (or SF trip vlog) footage lands — SwissTransfer, Drive, Desktop, or phone dump — **before** anyone starts the long-episode assembly.

**Standing rule (Luigi 2026-10-01):** For every episode with many clips, do **not** jump straight to cutting. Run this stack first, then the delivery checklist (audio, intro/outro, subs, bumpers, portada).

## Pipeline (fail-closed order)
1. **Ingest** — Download all files to a dated work folder (e.g. `bahia-epN-YYYY-MM-DD/`). Never overwrite prior episode folders. Verify full resolution.
2. **Catalog** — Inventory every clip: filename, size, duration (`ffprobe`), type (A-roll / B-roll / screen recording / other), audio presence, rotation metadata, rough scene guess from filename + first/last frames if needed (cookbook §8). Write `CATALOG.md`.
3. **Transcribe** — Full transcript of every clip with usable speech (Whisper or equivalent, word timestamps). One file per clip + a merged `TRANSCRIPTS.md`. Mark silence-only / music-only clips as N/A. Keep proper nouns provisional until the plan pass.
4. **Edit plan (strongest reasoning model, max effort)** — Give the strongest available reasoning model (e.g. latest Grok / Claude Opus / Gemini Pro at maximum reasoning) the full catalog + transcripts + any Luigi dictation/brief. Output must include: episode # suggestion (if unassigned), narrative arc / hook, selected A-roll order with timestamps, which B-roll/screen recordings cover which beats, which clips keep Luigi's original audio (VO only for intro, closing and silent bridges), cuts/drops, soft close / next-day tease, referral bumper slots, risks (KYC rants, promises of evening footage not in the dump, overlapping tracks). The proposed portada line is the **episode title**, never a separate bait line. Save as `EDIT_PLAN.md`. **Do not start the motion-graphics/assembly work until Luigi OKs the plan** (or explicitly says to proceed without review).
5. **Then production** — Only after plan OK: follow `bah-a-edit-delivery-checklist` (Ep.1-craft intro/outro + Raffaele credit, A-roll audio cleanup, muted B-roll, Spanish burned-in + SRT proper-noun QA, referral bumpers, portada with the episode title, upright bake) and `video-review-package`. After the long episode is Public, promo Shorts use `bah-a-vlog-promo-short-protocol`.

## Anti-patterns
- Assembling a WIP from gut feel before catalog + transcripts + plan.
- Using a weaker model for the episode plan when a stronger one is available.
- Skipping Luigi's plan OK when footage volume is high or ep# / hook is ambiguous.
- Mixing this with the promo-Short protocol (that starts only after the long episode is Public).
- Proposing a bait line for the portada instead of the episode title.

## Handoff
Whoever edits owns ingest + this order. Deliver the plan to Luigi before any Review package.
