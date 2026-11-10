---
name: photo-integration-for-web-ui
description: >-
  Use when a real photo of a person (portrait, speaker shot, team photo) has to
  go into a website, landing page, thumbnail or plate: plan first, segment the
  background, integrate the cutout into the scene, with no generative edits to
  the person.
---
# Photo integration for web UI (and plates)

A person's photo should live inside the design, not sit in a pasted rectangle. Use the strongest available visual model for the design work (Luigi's rule: UI is never designed by a weak/general assistant; delegate to strong models such as Claude Opus, the latest Grok and GPT Astra, and have it code-reviewed by another strong model). Work in the site's own repo.

## 1. Brief the model
- Attach the original photo twice: as an image so the model can see it, and as a file so it can commit it.
- Attach captures of the current section, including any version Luigi rejected, and say plainly what he disliked.
- State the design language of the site (palette, accent, motion or shader elements, reference studios) and his dislikes (for example boxes, card grids, generic layouts).

## 2. Plan first, then edit
Ask for a short plan before implementation, with 2 options and one pick with a reason. It should cover:
- how the cutout is made,
- where the person sits in the composition,
- how they relate to existing visual elements (a ribbon or shader passing behind and in front of them, a rim light in the accent color, a shadow or glow that anchors them),
- the treatment (grade, grain, color or duotone),
- how it enters on scroll,
- how it resolves on mobile.

## 3. Edit rules (hard)
- Remove the background with a real segmentation model (rembg, BiRefNet or equivalent), with clean edges on hair, beard, cap, jewelry and arms.
- Never generate or retouch the face or body with AI. The only changes allowed are the cutout, color grade and lighting on top. Skin stays natural. Keep meaningful clothing marks, such as a brand logo the person represents.
- Remove or suppress third-party branding in the background (venue banners).
- No rectangular frame. The person integrates into the scene.
- Export WebP/AVIF with alpha plus a PNG fallback, in responsive sizes, at about 250 KB or less for desktop. Meaningful alt text; respect `prefers-reduced-motion`.
- Don't touch copy, prices or placeholders unless asked.

## 4. Artifacts and QA
- Have the model clear the artifacts folder, save into a fresh versioned folder, and list only the exact paths in its report:
  - `cutout-preview.png` (the cutout on flat mid-gray, to judge the edges),
  - section captures at desktop 1440 and mobile 390,
  - optionally a short scroll video.
- Before showing Luigi, look at every capture yourself. Confirm the face is visible and centered, the edges are clean, and no venue branding reads. A crop that misses the person, or dirty edges, goes back to the model with exact coordinates or notes. Never forward it.
- Deliver the plan summary and the captures together. Get an independent code review of the implementation before calling it done.
