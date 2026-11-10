---
name: ai-copywriter
description: >-
  Use when writing or rewriting marketing copy, deck slide text, headlines,
  CTAs, captions or any prose that must not sound AI-generated: reader-first
  copy plus the "33 Signs of AI writing" humanizer patterns and Luigi's bans.
---
# AI copywriter (house)

Portable skill adapted from [mikiarlo3/ai-copywriter](https://github.com/mikiarlo3/ai-copywriter) (MIT; Humanizer via blader/humanizer + Wikipedia "Signs of AI writing"). Use for decks, pitches, posts, captions, emails and any fact-bearing copy for Luigi.

## Before writing
1. Who is reading, and what do they feel in that moment? (A juror mid-deck ≠ a LinkedIn scroller ≠ a psychologist on Instagram.)
2. Simplest kitchen-table explanation of the claim — no slogans.
3. Facts only from the brief / locked source. Never invent numbers, venues, prizes, sponsors or testimonials.
4. Which project/brand is this? Write only in that brand's voice; never mix projects.

## Hard bans (Luigi + pattern 9)
- **Negative parallelisms / correctio:** "no es X, es Y", "no A, sino B", "El talento no es poco, está disperso", "It's not just…", definition by negation. State the positive claim directly.
- Rule-of-three stacks for punch only; synonym cycling; significance inflation; AI vocabulary (landscape, showcasing, delve, pivotal, unlock, elevate, game-changer, potenciar, revolucionar).
- Em dashes as drama; Title Case Headings in Spanish body; emoji bullets; "En un mundo donde…", "Imaginate esto:", fake-candid openers; "The result?", "But here's the thing", "From X to Y".
- "bitácora"; «corte» for sponsor breaks.
- For Argentine audiences: rioplatense where the voice is Luigi's; keep juror tone concrete and plain on prize slides.

## The 33 signs, grouped (audit against all)
- **Content:** significance inflation ("marks a pivotal moment"), notability claims, superficial "-ing" analyses, promotional language, vague attributions ("experts say"), formulaic "challenges and future" sections.
- **Language:** AI vocabulary, copula avoidance ("serves as" instead of "is"), negative parallelisms, rule of three, synonym cycling (elegant variation), false ranges ("from X to Y").
- **Style:** em-dash overuse, boldface overuse, inline-header vertical lists, Title Case headings, emojis as bullets, curly-quote inconsistency.
- **Communication:** chatbot artifacts ("I hope this helps", "Great question"), knowledge-cutoff disclaimers, sycophantic tone.
- **Filler:** filler phrases ("In order to", "It is important to note"), excessive hedging, generic positive conclusions ("the future looks bright").

## Process
Draft → audit against the patterns above (content, language, style, communication, filler) → rewrite until no hits → deliver **only** the clean copy (e.g. slide-by-slide titles + body). No QA narration unless asked. Then run `qa-texto-anti-tropes-llm`.

## Deck-specific
- One idea per title. Body = short sentences, real numbers already locked.
- Prefer facts over metaphors ("nodos", "polo") unless the brief already uses them and they survive the humanizer pass.
- Keep visual craft notes separate from spoken/slide words.

## Social-specific
- The publishable file contains only the text to publish. Notes, options, alt text and slide labels live in a separate internal draft.
- Per-network rules in `docs/qa-checklist.md` §B4.

## Pair with
- `qa-texto-anti-tropes-llm` after every draft.
- Research/facts locked first (see `research-first-content-pipeline`); copy rewrite second; visual craft applies text only.
