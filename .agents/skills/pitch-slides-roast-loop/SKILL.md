---
name: pitch-slides-roast-loop
description: >-
  Use when roasting or iteratively hardening a pitch deck, spoken pitch or
  one-pager with strong critique until presentation-ready (hackathon judges,
  jurors, investors): roast → apply → re-roast against a fixed rubric, max 4 rounds.
---
# Pitch / slides roast loop

Run a ruthless critique → revise → re-roast cycle on pitch slides and spoken script until the content is presentation-ready. Use the strongest reasoning model available at max effort as the critic (ideally a different model from the one that wrote the deck).

## Inputs
- Deck link or export (Slides / PDF / screenshots of every slide).
- Spoken pitch script / one-pager.
- Audience + constraints (e.g. judges' rubric such as "Use of <sponsor tech> → Impact → Delivery"; banned claims; time box 3–5 min).
- Prior roast notes if any.

## Helpful skills (mattpocock/skills)
Install once if missing: `npx skills@latest add mattpocock/skills`. Use in order of fit:
1. **grilling / grill-me** — stress-test claims, structure and demo story; rounds of hard questions with recommended answers.
2. **wait-what** — if a beat does not land, force a re-pitch in plain language.
3. **writing-beats** / **writing-shape** — rebuild the spoken arc beat-by-beat with grounding (no ungrounded jargon).
4. **writing-fragments** — tighten weak lines.
5. **retro** — after a round, capture what failed and what to change next.

Also apply the house skills: `slide-craft-and-visual-qa`, `qa-texto-anti-tropes-llm`, `ai-copywriter`.

## Loop (repeat until exit)

### Round N — Roast (critics only)
Produce a dated roast note with:
1. **Kill list** — claims judges will reject (banned, invented metrics, ungrounded sponsor-tech use).
2. **Structure** — does the opening ground the required tech use in <40 s? Problem wedge clear? Human-in-the-loop/demo visible? Limits honest?
3. **Slide-by-slide** — one line per slide: job of the slide, what's wrong, fix.
4. **Spoken** — which beats lose judges; rewrite candidates (2 options each).
5. **Score preview** — each rubric axis Red / Yellow / Green + why.

Do **not** rewrite the whole deck in the roast pass. Critique only.

### Round N — Apply
Deck owner + pitch owner apply the kill list and highest-severity fixes only. Draft-only; no publishing or submission.

### Round N — Re-roast
Critics score again against the same rubric. Exit when:
- No Red on any judge axis.
- No banned/ungrounded claims.
- Spoken fits the time box.
- Luigi says presentation-ready.

Cap at 4 rounds unless Luigi asks for more; escalate blockers instead of looping forever.

## Roles
- **Deck** — visual + slide order; runs slide-craft QA.
- **Pitch** — spoken + one-pager; runs writing-beats / wait-what.
- **Coordinator** — starts rounds, gates exit, reports to Luigi.

## Hard bans (example from a health-credentialing pitch)
Never approve: third-party certifications claimed as ours (e.g. HITRUST), "HIPAA-certified", live integrations that don't exist (e.g. CAQH/NPDB), invented vendor percentages, "75 % faster" without data, AI face regeneration on people shots. Generalize: no claim without a source we control.

## Output
Keep roast notes in a dated folder in the repo (e.g. `pitch-roast/round-N.md`) and link them where the team coordinates.
