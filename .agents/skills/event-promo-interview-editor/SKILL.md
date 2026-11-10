---
name: event-promo-interview-editor
description: >-
  Use when producing event/guest promotional interview videos (meetups, Builder
  Sessions, hackathons) with agency-level craft: prefer light edit (keep host
  questions, clean audio, color, silence cuts, bottom-centered subs, correct
  name spelling). Heavy restructure only when the brief asks. Includes host-cut QA.
---
# Event promo interview editor

## When
Interviews or guest clips meant to **promote community events and guests** (meetups, Builder Sessions, hackathons). Use the strongest model Luigi named for the cut (two versions, Claude Opus and Gemini, for new videos). Companions: `video-review-package`, `reel-production-complete-edit`. For pure viral hooks only, see `short-form-reel-editor`.

## Product goal
A vertical piece for Instagram / LinkedIn / YouTube Shorts / community that feels produced, respects guest, host and event, and can air after Luigi approves.

## Edit philosophy (Luigi 2026-09-21 feedback)
**Prefer light edit over heavy restructure.** Viewers preferred cuts that keep the conversation (host questions + answers) over aggressive chopping, banners instead of questions, and over-edited timelines.

Default pass:
1. **Keep host questions in audio** when clean enough — do not strip questions just to shorten.
2. **Clean audio** (denoise / EQ / compression / loudnorm −14 LUFS).
3. **Color / picture** so the frame looks good (exposure, mild grade, correct 9:16 — no stretch).
4. **Cut dead silences** and fillers — not mid-thought jumps.
5. **Subtitles** bottom-centered, readable, off faces, synced.
6. Guest lower third with the **correct spelling of names** (verify against the guest's preference / brief; one wrong letter is a fail).
7. Integrated slate/plates and a tasteful transition or SFX at beats (the complete-edit baseline still applies; "light" means respectful of the conversation, not unedited).

Heavy structure (many banners, company cards, multi-act rebuilds) only when the brief explicitly asks.

## Structure (default ~60–120 s unless the brief says otherwise)
| Beat | What |
|------|------|
| **Open / hook** | Strong real line OR event energy (2–5 s) |
| **Intro slate** | Event name + city + date (or lower third) |
| **Guest ID** | Name + role/company lower third only |
| **Body** | Keep Q+A flow; cut long silence/fillers; never chop mid-word |
| **Host question** | Prefer keep in audio. If removed: question banner held long enough to read |
| **Company moment** | Off by default |
| **Close** | Soft CTA from the brief only; drop guest "find me on social" beats if guest or brief asks |

## Hard rules — host speech and cuts
1. Never cut mid-word or mid-clause.
2. Prefer keeping clean short host questions in audio.
3. If host question audio is removed → readable question banner (~0.4 s/word, min ~2.5 s).
4. Host-integrity listen pass before leaving WIP (document it in NOTES.md).

## Hard rules — company / brand graphics
Company full-screen banners off by default. Guest lower third + event slate + community CTA OK when in the brief. Only the event's/community's own brand; never mix projects.

## Craft
- Subtitles: mandatory; bottom-center; never cover eyes/mouth; 2–5 words/line.
- Audio: denoise, EQ, loudnorm; music optional under speech, ducked.
- Pace: silence cuts; soft transitions; no whoosh spam.
- Picture: correct 9:16; mild color polish; no stretch.
- Anti–AI-template: no emoji rain, karaoke every word, zoom every 2 s.

## Delegating the cut
1. Attach labeled proxies (≤15 MB each; ≤~46 MB per request) built from full-res masters.
2. Work in Luigi's content repo (`marcaPersonal`), folder-isolated per event (e.g. `<evento>/reels-v6/`). Never the shared `mardelplata` repo for this.
3. Use the model/effort Luigi named.
4. Prompt: event, guest identities **with correct spelling**, CTA, light-edit philosophy, guest-requested cuts, phone-safe encode.
5. Return → preflight → full watch → second look → Review. Never "ready" from WIP.

## Deliverables
- `[PROYECTO]_[GUEST]_[TOPIC]_PROMO_vN.mp4` — 1080×1920 H.264 High yuv420p +faststart AAC
- `EDITORIAL-DECISIONS.md` + stills + NOTES (host integrity, spelling checks)

## Decision order
Clarity of who/what → keep conversation (questions) → speech integrity → naturalness → AV polish → branding → effects.
