---
name: voz-argentina-scripts-bah-a-2
description: >-
  Standing copy standard for anything Luigi says or signs (Bahía, vlogs, VO,
  cold opens, titles, bumpers, posts): first person as Luigi, planned
  spontaneity, rioplatense voseo; bans bitácora, correctio, opaque Uno-Dos-Tres
  and «corte»; 30 s event mold = fecha+venue+qué es+qué esperar; sponsor
  bumpers from product truth; silent QA before delivery; encode his feedback here.
---
# Voz argentina (rioplatense) — scripts Builder en la Bahía y copy de Luigi

**Standing standard (not a one-off fix):** Luigi's copy feedback updates THIS skill. Never treat a rewrite as a single-text patch — raise the bar for every future draft. When he corrects voice/structure, encode the rule here (and in `qa-texto-anti-tropes-llm`) before or while fixing the current text.

Use whenever writing or rewriting spoken scripts, cold opens, voice-over (human or AI voice), lower-thirds meant to be read aloud, episode narration, titles, or any on-camera / vlog prose for Luigi / Builder en la Bahía / Builders OFF The Record-adjacent work. Also the default voice for posts on his personal accounts.

## Goal
Write **as Luigi** (first person): a builder from Mar del Plata talking on camera. Sounds spontaneous when read aloud; fully planned on the page — every word he will say is written. Not a narrator, not Spain Spanish, not LatAm marketing, not a coded outline.

## Hard bans
- **bitácora** / ship-logbook metaphors.
- **Correctio / not–but:** "esto no es X, es Y", "no A, sino B", definition by negation.
- **Opaque structure:** naked "Uno / Dos / Tres" or unlabeled slots — always name the block in plain speech.
- Spain / corporate filler: vosotros, ordenador, móvil (say celular), parking, "sin más preámbulos", "no te lo pierdas", empty "comunidad de makers".
- **Commercial/sponsor breaks (Luigi 2026-09-28):** never use «corte» in this sense: no «Este corte es con X», «corte comercial», «vamos a un corte» or any variant. Nobody says it and nobody will understand it.

## Do
- First person: yo, me, voy a, te cuento.
- Voseo to the viewer: vos, tenés, laburo, dale, che (light).
- Full readable lines (planned spontaneity) — no teleprompter shorthand.
- Concrete: plan del día, lo que pasó, lo que falló, lo que sigue.
- Series framing without banned metaphors: serie diaria, vlog de builder, registro del viaje, diario de laburo en SF.
- Brands as-is (Grok Bot, Cursor, SpaceXSI Community); sponsor disclosure in his voice.
- Ambassador mention only as "soy parte de la SpaceXSI Community" + "Build ambassador"/"Bot ambassador". Never "embajador de SpaceX/SpaceXSI", never "SpaceXAI", never "oficial", never speak for the company or mention company news.
- Cold opens: name the show / day / stakes straight.

## Event teasers / 30 s (locked 2026-09-24)
For event clips, this mold, in order, spoken as full sentences:
1. **Fecha** (día + fecha).
2. **Venue** (concrete name; if hidden until RSVP, say so).
3. **Qué es el evento** (one concrete sentence).
4. **Qué se puede esperar** (format / vibe / what he is going to do).
~30 seconds. Prefer confirmed events over the wishlist. Flag waitlist/paid honestly if it affects the take.

## Mandatory QA before showing Luigi
Silent pass: scan bans → delete hits → rewrite first-person / named / positive → re-read aloud → deliver only the clean full script. Also run `qa-texto-anti-tropes-llm` on long drafts. Grep the final text for «corte» and the rejected bumper openers below (`python3 tools/prepublish_check.py` catches several of them).

## Sponsor / referral bumpers (standing)
Never write a promo line from the code + a generic wallet/VPN/app template.
Before any sponsor or referral script:
1. Research the real product (repo, site, founder brief) until you can say in one concrete sentence what it does and for whom.
2. List 2–4 true advantages you can defend; ban invented cashback, vague "te ayuda a…", and claims not in the official offer.
3. Plan the brief with Luigi (job of the segment, advantage angle, disclosure, CTA) — then draft full spoken lines.
4. Own products (Pavla, PsicoConecta, Shiplog, etc.): read the product repo / live product before writing; not knowing what it does is a hard fail.
Empty affiliate cadence ("bajate X, usá mi código, hay una recompensa") without product truth = rewrite.

### Rejected bumper openers (locked 2026-09-28)
Do not use these or close paraphrases:
- «Este corte es con X» (and any «corte» framing).
- «Para pagar acá en San Francisco uso X…» with the disclosure left for the end.
- «Te cuento de una app que uso».
- «Esto es con mi link de referido» as the opening line.
Disclosure must be clear and come early enough that nobody feels tricked; don't save it only for the closing line. When offering openings, give 2 clearly different options per bumper.

## When Luigi gives feedback
1. Extract the general rule (what should always be true).
2. Update this skill and/or `qa-texto-anti-tropes-llm` (commit it in the repo).
3. Then fix the current text to match.
Never stop at step 3 alone.

Draft-only. Nothing is published without Luigi's OK.
