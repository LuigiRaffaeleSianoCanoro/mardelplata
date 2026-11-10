---
name: slide-craft-and-visual-qa
description: >-
  Use when building or QAing any Google Slides / deck / carousel slide for
  Luigi: split layout, contrast, large screenshot insets, anti-AI craft, and
  editable native text (never bake whole slides as images).
---
# Slide craft and visual QA

## Gold-standard layout (Luigi reference: Vercel tour style)
- Split composition: left ~40–45 % solid near-black text column; right ~50–55 % for the product inset.
- Title: large white bold sans on solid dark. Subtitle/body: muted gray on the same solid dark. Never put text on a screenshot.
- Evidence insets: prefer ~HALF the slide on product slides (connectors, agents/skills/marketplace, Slack, dashboards). Tighten and cut copy so stills can grow — never shrink a still to fit long prose.
- Generous margins around the inset, but no huge empty panels that force tiny screenshots.
- Screenshots: crop to ONE clean UI region; ban full-bleed dumps and buggy overlays (floating agent chat). Minimize any assistant chat before capture.
- Palette (default when the project has none): near-black `#0A0A0A`, white `#FAFAFA`, muted gray `#A1A1AA`, dim `#71717A`. No purple unless a brand requires it. Project decks use that project's current approved brand.
- Logo: project wordmark, legible on dark (e.g. Disro white wordmark for Disro decks). For Instagram carousels, the logo is big and centered-ish and the URL goes at the bottom, never a small logo + URL in the top-left corner.

## EDITABLE DECK (hard rule, Luigi 2026-09-17)
- NEVER bake whole slides as images. Luigi must be able to edit every title/body/list/footer.
- All copy = native Google Slides text boxes / shapes.
- Product UI screenshots only as insets (not full-bleed slide comps).
- Hyperlinks = real Slides links (Insert link / Ctrl+K), never a screenshot of a URL.
- Titles stay fully on the dark left rail — no overflow onto the light panel.

## Type system
- Title = white bold; body = muted gray; labels = dim gray, sentence case.
- Denser grouping on evidence slides: less vertical whitespace, related lines closer.
- Numbered lists = one aligned text block (number + text together). Never separate boxes for numbers vs body.

## Anti-AI copy (standing)
- Hard no em dashes.
- Ban "It's not X. It's Y." / "From X to Y" / "The result?" / "But here's the thing" and Spanish equivalents ("no es X, es Y").
- Avoid rule-of-three spam; no fake rhetorical questions.
- Cut stacked consulting fluff; evidence before explanation. Run `ai-copywriter` + `qa-texto-anti-tropes-llm`.

## QA checklist (fail if any hit)
1. Full-slide image bake-in or uneditable copy.
2. Title overflow off the dark rail.
3. Insets too small to present (~half-slide target on evidence slides).
4. Caption/title on a busy screenshot or low contrast.
5. Inconsistent text color roles.
6. Decorative icons, gradients, rounded card grids, AI illustrations.
7. Em dashes or banned rhetoric.
8. Invented product UI / fake "Connect" tiles.
9. Assistant chat overlay visible in stills.
10. Missing real hyperlink where an intake form is mentioned.
11. Secrets, patient data, personal emails/phones visible in any screenshot.

## Workflow
1. Lock the brand/project (one only).
2. Substance from the specialist / facts source; you do craft only.
3. Build split layouts with NATIVE text; place cropped insets large enough to present.
4. Look at every slide yourself (export PNGs) and run the QA checklist before handing to Luigi.
5. Draft-only until Luigi's OK.
