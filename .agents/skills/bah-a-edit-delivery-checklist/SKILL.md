---
name: bah-a-edit-delivery-checklist
description: >-
  Use before handing Luigi any Builder en la Bahía / vlog SF long cut for review:
  mandatory Ep.1-craft motion intro/outro (Raffaele jingle credit,
  episode-specific day/hook), original audio over VO when Luigi talks, A-roll
  audio cleanup, muted transitions, burned-in subs + SRT with proper-noun QA,
  referral bumpers, episode-title portada, upright phone orientation bake.
---
# Bahía edit delivery checklist

**When:** Before handing Luigi any Builder en la Bahía / vlog SF cut for review.

**Prerequisite:** If the episode was a multi-clip ingest, `bah-a-episode-pre-edit-plan` must already be done — catalog + transcripts + `EDIT_PLAN.md` from the strongest reasoning model, with Luigi's OK — **before** assembly. Do not open this checklist to skip that stack.

**Rule:** Do not deliver for review until every item is DONE or N/A with reason. Elements must be **final-safe**.

**Producer stance:** Critical. For each defect decide: re-record vs workaround. Soft-pedaling banned.

**Not defects (Luigi's call):** Luigi reading from his phone on camera is fine and on purpose. Never ask for a re-record because of it. Keep place names unless Luigi asks to cut them. Other people's faces in B-roll are fine (no blur).

## Voice rule (Luigi 2026-10-13, HARD)
Whenever a clip shows Luigi talking with its original audio, **use that original audio and cut the voice-over**. VO is only for the intro, the closing and bridging silent visuals. Never lay VO over a clip where he is speaking on camera.

Spelling of recurring people: **Nico Barbarosch** (never "Nico Barbaro"). Check every proper noun against the brief.

## HARD MANDATORY (fail-closed)
Never hand Luigi a Review package if any of these are missing:

1. **Intro + outro = Ep.1 motion craft (NON-NEGOTIABLE)** — Same visual craft as published Ep.1 (`https://youtu.be/PqUviFOuxus`) / approved v5.4+ masters: motion-graphics intro/outro made with the strongest visual model (Claude Opus, and a Gemini version for comparison), marcaPersonal / Bahía palette, **photo LEFT**, ~15 s, bed = the jingle by Luigi's father. Credit line must read **«Jingle: Raffaele Nunzio Canoro»** — never «Jingle: [nombre]» or any placeholder. Use the approved v5.4 masters (ask Luigi or check `PROJECT_CONTENT_RULES.md` for where they live); never an older Día-1 draft with a placeholder credit. **Episode-specific props required** (day #, hook line, EP.N / next-day teaser) — do **not** reuse Día 1 copy on later episodes. **Never** ship a plain navy typography plate, a still key-art dump, or an audio-only bed in place of the motion intro. Loud jingle bed; **no spoken VO under intro/outro**. Final typography; no "PRUEBA"/draft chips. **Fail the second look** if the intro/outro does not visually match Ep.1 v5.4 craft, the credit is a placeholder, or the day/hook text is wrong for this episode.
2. **Audio cleanup on ALL spoken A-roll / main VO** — DeepFilterNet or equivalent (cookbook §2); cut dead air, doorbells, ambient hits; jump-cut fillers. Must sound broadcast-clean.
3. **Transition / B-roll audio** — strip or fully mute dirty location audio on every transition clip. Never leave raw phone/street/event noise on B-roll beds. Use **all** muted transitions supplied for the day when weaving B-roll, not a single clip unless only one exists.
4. **Subtitles + proper-noun QA** — Spanish burned-in **and** sidecar SRT on the long episode. Script-aligned + listen pass; never raw Whisper alone. **Placement hard rule:** bottom-centered lower third only — never mid-frame over chest/neck/face (fail the second look if mid-screen). Max ~6 words/cue when possible. **Proper-noun gate:** before Review, open the episode brief / teleprompter / event agenda and force-correct every brand, person, venue and product name Whisper mangled. Keep spoken honesty (don't invent names he didn't say).
5. **Referral bumpers** — weave in approved owned-code promo bumpers. Default 1–2 mid-episode (e.g. Wise + Belo); don't stack every approved bumper every episode unless Luigi asks. Do not ship a long Bahía episode with zero referral bumpers unless Luigi explicitly waives it. Never use the word «corte» for commercial breaks. Bumper copy follows `voz-argentina-scripts-bah-a-2`.
6. **Portada / thumbnail** — follow `bah-a-thumbnail-bait-protocol`: real selfie cutout, **the locked episode title on the plate (never a bait line)**, EP.N kicker.
7. **Orientation / upright bake (NON-NEGOTIABLE)** — Before Review, every phone-sourced A-roll and B-roll must be **upright in a true 9:16 frame** (subject head toward the top). Sources with Display Matrix ±90 / `rotate` metadata must be baked with autorotate (or explicit transpose matching the sign) so the output has **no residual rotation side data** and mid-frame stills show upright faces/scenes (cookbook §7, `tools/preflight_deliver.sh`). Native portrait assets (screen recordings, motion intro, bumpers) must stay upright. **Fail the second look** if any A-roll mid still is sideways, if the master is 16:9 when the plan says 9:16 selfie day, or if NOTES only assert WxH without an upright still. Catalog rotation notes are not a substitute for this visual gate. Ritual before opening Review: open the proxy or ≥3 A-roll mid stills — **¿cabeza arriba?** If no → stay WIP.

The delivery note must tick each HARD MANDATORY item with the file/evidence or N/A + Luigi's waiver.

## Format gates
1. Soft transition intro → A-roll (~0.4–0.6 s xfade or motivated cut); segment-to-segment transitions must not feel like hard dumps.
2. Chapter cards with plain Spanish names + polished type (when the episode has chapters).
3. Jump cuts: remove ehhh / elongated pauses / false starts / lip smacks on A-roll (keep rhythm natural).
4. Weave VO under **motion** B-roll when A-roll is teleprompter-style; stills alone under long VO fail unless Luigi supplied only stills that day.
5. Product tips: face → motion demo/B-roll (proper 9:16 upright) with VO → face.
6. Outro = matching Ep.1 motion closing (motion + father's jingle + Raffaele credit) — not a substitute plate.

## Craft + narrative gates
7. Tighten repetition; no VO sandwich that re-says bio/CTA.
8. Post-edit narrative QA: transcript → adversarial pass → fix before Luigi sees it.
9. Publish-ready labels only (WIP / Review / Approved per `video-review-package`).
10. Watch the full exported episode end to end before Review (see `docs/qa-checklist.md`).

## Delivery note
Checklist, file list, delta vs previous version, narrative QA, gaps, draft-only until OK. Explicit HARD MANDATORY checklist block (including "intro matches Ep.1 v5.4 motion + Raffaele credit", "episode-specific day/hook", "proper-noun SRT pass vs brief", "phone upright bake / mid stills", "original audio kept where Luigi talks, VO only intro/closing/silent bridges").

## Assets (locations per repo / ask Luigi)
- Approved motion intro/outro v5.4 masters, the jingle audio, the approved referral bumpers.
- Reference published Ep.1 craft: `https://youtu.be/PqUviFOuxus`.

## Anti-patterns
Hard dump between unrelated clips; leaving ehhh; default ugly title fonts; stills under long VO when motion exists; PRUEBA chips; raw Whisper; **mid-frame subs over chest/face**; face-only product tips; doorbell; repetitive sandwich; shipping without narrative QA; **shipping without subs**; **shipping with dirty transition audio**; **shipping without the Ep.1-craft motion intro/outro**; **shipping «Jingle: [nombre]» or wrong-day Día 1 masters on later eps**; **shipping an SRT with mangled brands**; **shipping without referral bumpers**; **shipping a bait line on the portada instead of the episode title**; **shipping phone A-roll/B-roll sideways inside a 9:16 canvas (WxH-only "9:16 PASS")**; **VO over a clip where Luigi is talking**; asking for re-records over phone-reading; cutting place names nobody asked to cut; inventing proper names he didn't say into subs; **assembling before catalog + transcripts + edit plan**.
