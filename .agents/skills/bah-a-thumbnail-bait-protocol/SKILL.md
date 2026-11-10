---
name: bah-a-thumbnail-bait-protocol
description: >-
  Use when making Builder en la Bahía / vlog SF YouTube or Shorts thumbnails
  (placas/portadas): on-plate text is the locked episode title (never a bait
  line), a real selfie Luigi sent (never AI-regenerated, never a video frame),
  fixed template, then one creative pass by a strong visual model before Luigi
  sees it.
---
# Bahía / vlog SF thumbnail protocol

## Template (fixed)
- **16:9** 1280×720 (YouTube) + **9:16** 1080×1920 (Shorts/Reels).
- Subject chest-up; shoulders reach the bottom edge (no floating head). Default subject on the **RIGHT** with the title on the left ~55 %; when that episode's approved reference plate puts the photo on the LEFT (Ep.1 and Ep.5 do), match the reference.
- ~40 px safe margins; bottom-right clear for the YouTube timestamp.
- Background: dark cinematic (`#0B0B0C` → deep navy), soft vignette, optional blue rim light behind the subject.
- A day-relevant environment cue behind/beside the subject is OK only if it comes from that same selfie or another real photo Luigi sent that day — not stock, and not a frame pulled from the episode.
- Typography: condensed, readable at thumbnail size. Match the episode title's own casing. Do not restyle it into a shouty bait line.
- Accent: one blue (`#58A6FF` or similar). No arrows, emoji, red circles, fake UI, watermarks.
- Instagram versions: never a small logo + URL in the top-left corner (Instagram covers it); center the layout, bigger logo, URL at the bottom.

## Per episode (variable)
1. **Kicker:** `EP. N · BUILDER EN LA BAHÍA`
2. **On-plate text = the episode title.** Use the locked YouTube title for that episode, without the series suffix (`| Builder en la Bahía Ep.N` stays in the kicker, not repeated as a second title). Wrap long titles across lines. **Never** invent a shorter bait, joke or click line (`WOZNIAK NO FIRMÓ`, `SIN PANTALONES` and the like are banned unless that exact phrase is the locked episode title). If the title is not locked yet, ask. Do not guess a placa line.
3. **Photo:** one of the **selfies Luigi sent** for the trip or that day. He usually sends several. Pick the best chest-up one (face clear, shoulders in frame, no blink). **Never** grab a still from the episode video when a selfie exists. If none was sent, ask him for one. Do not invent a frame.

## Production order (hard)
1. Optional: draft layout/mood with an image model using a **placeholder** face or a text-only mock — never show Luigi a lookalike as final.
2. **Cutout** the chosen selfie with rembg / BiRefNet (clean hair/beard edges). Check the cutout on flat mid-gray.
3. **Composite** the cutout onto the template. Color grade / rim light OK.
4. **Never** regenerate, beautify, age, slim or swap his face/body. Face pixels must match the source cutout.
5. **Creative pass by a strong visual model (hard, before Luigi sees it).** Once both sizes exist, give the finished plates to the strongest visual model (Claude Opus; make a Gemini pass too so Luigi can compare) for one creative pass: hand it the image files themselves, the two sizes (1280×720 and 1080×1920), and creative freedom on layout, type and color. No long brief. It must keep the real photo and the words already on the plate. Show Luigi the post-pass versions, not the pre-pass plates. Ep.5 (green pill, ember "asadito", photo on the left) is the approved reference for how far that pass may go.
6. Visual QA before Review: same person as the selfie, the **episode title** (not a bait line) readable at ~168×94 px, vertical not floating, no placeholder text.

## Delivery
PNG 16:9 + 9:16 + a mobile preview strip, saved in that episode's folder. State: WIP → creative pass → QA → Review. Nothing is uploaded or published without Luigi's OK.
