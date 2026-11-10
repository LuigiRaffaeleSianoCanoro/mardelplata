# GEMINI.md — Content-creation skills pack (Luigi Canoro)

**MdPDev (este repo):** leé [`PROJECT_CONTENT_RULES.md`](./PROJECT_CONTENT_RULES.md) antes de crear contenido de la comunidad (voz «nosotros», marca, handles, aprobación).

Antigravity / Gemini CLI entry point. **The full guide is `AGENTS.md`** (how to use, skills index, per-project rules, model routing). Antigravity reads both `GEMINI.md` and `AGENTS.md`; skills live in **`.agents/skills/<name>/SKILL.md`** (YAML frontmatter `name` + `description`, load the one whose description matches the task).

## Quick start for Gemini / Antigravity

1. Read the HARD RULES below and the repo's `PROJECT_CONTENT_RULES.md` (if present).
2. Load the matching skill(s) from `.agents/skills/`. For any video: `reel-production-complete-edit` + `video-review-package` + the specific editorial skill (`short-form-reel-editor`, `event-promo-interview-editor`, `talk-clips-pipeline`, or the `bah-a-*` skills for Builder en la Bahía).
3. Edit with ffmpeg locally using `docs/ffmpeg-cookbook.md` (recipes tested on ffmpeg 7.1; re-run `bash tools/test_ffmpeg_cookbook.sh` to verify your install).
4. Use Gemini's native video understanding to **watch the entire exported file** (not a proxy of an older version) before delivery, and run `docs/qa-checklist.md`. Also `bash tools/preflight_deliver.sh OUT.mp4 1080 1920`.
5. You are producing **the Gemini version** of a new video; Luigi compares it with a Claude Opus version. Label your files clearly (e.g. `..._REEL_v1_gemini.mp4`).
6. Deliver a Review package; publish nothing.

## HARD RULES (Luigi Canoro, non-negotiable)

1. **Every reel is a complete edit:** jump cuts, audio cleanup, transitions or sound effects, and plates integrated inside the MP4. Subtitles + a logo over an untouched take is **NOT** an edit.
2. **Never deliver slideshow-style, low-quality videos** (stills + text + music, dead plates under long voice-over).
3. **QA the full exported video before delivering:** watch it end to end (or analyze the whole file with real video understanding). If you cannot watch video, say so; never claim you did.
4. **Builder en la Bahía (vlog SF):** when a clip shows Luigi talking with its original audio, use that audio and cut the voice-over. VO is only for the intro, the closing and bridging silent visuals. Spelling: **Nico Barbarosch**.
5. **Instagram graphics:** never put a small logo with the URL in the top-left corner (Instagram covers it). Center the layout, make the logo bigger, put the URL at the bottom.
6. **Pavla:** use the CURRENT brand only (green isotipo from the landing + the word "Pavla"). The Nov 2026 rebrand (PV teal monogram, Geist, "Placa clara") is a POC, NOT approved; never use it in campaigns.
7. **Ambassador naming:** say "part of the SpaceXSI Community" with the role "Build ambassador" or "Bot ambassador"; write **Grok Bot**, **Cursor**, **SpaceXSI Community**. Never "SpaceXSI ambassador"/"SpaceX ambassador", never "SpaceXAI", don't mention SpaceX or company news, no homemade logos, no "official", never speak for the company.
8. **Nothing is published without Luigi's explicit approval** of that exact piece and version: produce drafts only. Production notes and internal indications (e.g. "esto se sube como carrusel en 5 historias") are kept in a separate, clearly marked internal note and are **never** included in the post text.
9. **AI voice is autonomous:** don't wait for Luigi's recordings unless he provides them. It still needs his approval before publishing.
10. **Every new video gets two versions to compare:** one made with Claude Opus and one with Gemini. If a model is unavailable, say so; no silent substitution.
11. **Copy voice:** first person as Luigi, rioplatense Spanish (voseo), planned spontaneity, no LLM tropes: no "no es X, es Y" negative parallelisms, no correctio, no "bitácora", no «corte» for sponsor breaks.
12. **Never mix projects** (Pavla, PsicoConecta, mardelplata.dev.ar, Builders OFF The Record, Shiplog, personal/Builder en la Bahía, Cursor/SpaceXSI ambassador work): each repo's content stays in its own brand.
13. **No secrets, API keys, tokens, personal contact data or patient data** in any file, commit, prompt, screenshot or video.

## Skills index

| Skill (`.agents/skills/<name>/SKILL.md`) | When to use |
|---|---|
| `reel-production-complete-edit` | EVERY reel/short, any project: the mandatory editing baseline and completion gate. |
| `video-review-package` | Any video job: WIP/Review/Approved states, source lock, preflight, Review package, delivery. |
| `short-form-reel-editor` | Interview/podcast clip → Reel/TikTok/Short with a strong hook and anti-AI-template look. |
| `event-promo-interview-editor` | Event/guest promo interviews (meetups, Builder Sessions): light edit, keep host questions. |
| `talk-clips-pipeline` | A talk/workshop recording → a series of 20–60 s clips with plates, QA and a schedule. |
| `talk-clips-getting-started` | First setup questions with a new speaker/owner for a talk-clips project. |
| `bah-a-episode-pre-edit-plan` | New Builder en la Bahía footage arrived: catalog + transcripts + edit plan before any cut. |
| `bah-a-edit-delivery-checklist` | Before handing Luigi any Bahía long cut: hard mandatory gates (intro/outro, audio, subs, bumpers, upright). |
| `bah-a-thumbnail-bait-protocol` | Bahía YouTube/Shorts thumbnails: episode title on the plate, real selfie, creative pass. |
| `bah-a-vlog-promo-short-protocol` | Promo Short/Reel for a Bahía episode that is already Public. |
| `voz-argentina-scripts-bah-a-2` | Anything Luigi says or signs: scripts, VO, titles, bumpers, posts in his voice. |
| `qa-texto-anti-tropes-llm` | After every draft of publishable or Luigi-facing text: anti-LLM-tropes gate. |
| `ai-copywriter` | Marketing copy, headlines, CTAs, deck text that must not sound AI-generated. |
| `social-content-with-purpose` | Social posts for a professional brand (Pavla, PsicoConecta, Shiplog…): job, emotion, brand, honest ask. |
| `research-first-content-pipeline` | Before ideating/briefing a campaign: research, trends, strategy, multi-model scored review. |
| `social-promotion` | mardelplata.dev.ar event promotion calendar and per-network drafts + pre-publish gate. |
| `builder-spotlight` | mardelplata.dev.ar Builder Spotlight carousel + caption (consent, complete profiles). |
| `event-creation` | Draft Luma/Partiful fields for a mardelplata.dev.ar event (never publishes). |
| `blog-and-recaps` | mardelplata.dev.ar blog posts and event recaps (drafts, no invented numbers). |
| `slide-craft-and-visual-qa` | Building or QAing decks/slides/carousels: layout, editable native text, visual QA. |
| `pitch-slides-roast-loop` | Hardening a pitch deck/spoken pitch with roast → apply → re-roast rounds. |
| `photo-integration-for-web-ui` | Putting a real person's photo into a site, plate or thumbnail without AI face edits. |
| `pavla-three-agent-marketing` | Pavla campaigns: three separate sessions (plan, content, schedule), current brand only. |
