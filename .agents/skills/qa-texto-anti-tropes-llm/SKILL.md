---
name: qa-texto-anti-tropes-llm
description: >-
  Standing QA gate after any Luigi-facing or publishable draft (Bahía scripts,
  captions, decks, pitches, posts, emails): scan correctio, negative
  parallelisms, bitácora, opaque outlines, «corte», LLM throat-clearing and AI
  vocabulary; rewrite clean before showing; encode his feedback as permanent rules.
---
# QA texto anti-tropes LLM

**Standing gate:** run after drafting any Luigi-facing prose (Bahía/vlog, decks, pitches, posts, briefs, emails, video captions, on-screen text) and before showing it. Luigi's style feedback updates this checklist permanently — not a one-time fix on one page.

Also use when he asks to "pasar QA" or says a text sounds like an LLM / not like him.

Fail closed: banned pattern → rewrite; do not ship the contaminated draft. Full checklist: `docs/qa-checklist.md` §B. Automatic helper: `python3 tools/prepublish_check.py --network ig|x --file post.txt` (catches several tropes, placeholders and leaked production notes; it does not replace reading).

## Scan
- Correctio / not–but / "esto no es X…" / "El talento no es poco…" / "No es una comunidad genérica: es…".
- Negative parallelisms and punchy contrast titles that define by negation (Wikipedia "Signs of AI writing" pattern 9; see `ai-copywriter`).
- Staccato twin sentences that feel like slogan stacks ("El A está. El B falta.") when a plain claim would do.
- Bitácora / logbook metaphors.
- Opaque Uno–Dos–Tres or coded outlines instead of full first-person lines.
- Third-person or narrator voice when it should be Luigi speaking.
- LLM throat-clearing: "En un mundo donde…", "Imaginate esto:", "Sin más preámbulos", "No te lo pierdas", empty "comunidad de makers".
- Spain / corporate diction when rioplatense is required.
- Parallel slogan stacks / false binaries for punch only.
- Sponsor/referral copy that could fit any brand (code + "recompensa" + link) with no concrete product fact.
- **Luigi feedback (2026-09-28):** fail any bumper, script or copy that uses «corte» to mean a commercial or sponsor break, including «Este corte es con X», «corte comercial», «vamos a un corte» or any variant. Also fail the rejected openers: starting with the use case and moving the disclosure to the end («Para pagar acá en San Francisco uso X…»), «Te cuento de una app que uso», or «Esto es con mi link de referido».
- Significance inflation, AI vocabulary, rule-of-three fluff, em dashes as drama (see `ai-copywriter`).
- Production notes or internal indications inside publishable text ("esto se sube como carrusel en 5 historias", "opción A", "[TBD]", "alt text:"). They live in a separate, clearly marked internal note.
- Wrong naming: "SpaceXAI", "embajador de SpaceX/SpaceXSI", "oficial"; "mardelplata.dev" without ".ar".

## Fix
Delete the construction; rewrite in positive, concrete language. For decks/jurors: plain Spanish, real numbers, one idea per title. For on-camera: first-person spoken (voseo). Full lines — planned spontaneity. No "no X / sí Y" skeleton with new nouns.

## Output
Only the clean text. No QA narration unless he asks.

## When he corrects copy
Encode the new rule here + in `voz-argentina-scripts-bah-a-2` (if voice) + `ai-copywriter` (commit in the repo), then rewrite. Feedback trains the standard.

Pairs with `voz-argentina-scripts-bah-a-2` and `ai-copywriter`.
