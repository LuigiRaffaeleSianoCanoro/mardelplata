# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

MdPDev is a Next.js 15 community website for the Mar del Plata tech scene. See `ARCHITECTURE.md` for full details.

### Agent workflow (skills & rules)

El proyecto tiene una estructura de agentes en `.cursor/`:

| Capa | Ubicación | Propósito |
|------|-----------|-----------|
| **Rules** | `.cursor/rules/*.mdc` | Convenciones estáticas (core, data, UI, SEO, content) |
| **Skills** | `.cursor/skills/**/SKILL.md` | Workflows dinámicos (dev, Linear, QA, nomad-hub) |
| **Índice** | `.cursor/README.md` | Mapa completo y flujo de trabajo |

**Antes de implementar:** leer `ARCHITECTURE.md`, `BRAND.md` y el skill relevante en `.cursor/skills/`.

**Linear:** usar MCP Linear para issues (`linear-issue-writer`, `linear-workflow`).

**QA mínimo:** `npm run lint` + `npm run build`. Si hay SQL/RLS: `npm run security:verify`.

### Common commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Security verify | `npm run security:verify` |
| Security regression | `npm run security:regression` |

### Supabase dependency

The app requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Without real credentials, the home page (`/`) still renders (Supabase calls fail silently and data defaults to `[]`). All other routes are static and work without Supabase.

Optional: `NEXT_PUBLIC_MARKETPLACE_NAV=true` to show Marketplace in the Ecosistema dropdown. Default off until Luigi approves the public ship.

If you need to test auth, profiles, events, admin, job board, or marketplace apply/moderation, real Supabase credentials must be provided as secrets. Marketplace also needs `scripts/020_marketplace.sql` applied.

### Gotchas

- The only dynamic route is `/` — it queries Supabase for events, founders, and community members at request time. All other pages are statically rendered.
- `npm run lint` uses `next lint` (deprecated in Next.js 16); the equivalent ESLint CLI command is noted in the lint output. Warnings about `<img>` vs `<Image>` are pre-existing and not blocking.
- Tailwind CSS v4 is configured via `@tailwindcss/postcss` — theme tokens are defined in `src/app/globals.css` using the `@theme` block, not in a `tailwind.config` file.
- Nomad Hub orchestration DAG: `docs/nomad-it-hub/05-agent-orchestration.md`

## Content creation skills pack

Para promos, clips, recaps y spotlights de la comunidad (Antigravity/Gemini, Cursor, Claude): leé **`PROJECT_CONTENT_RULES.md`** (MdPDev) y luego el índice abajo. Skills en `.agents/skills/`; regla Cursor: `.cursor/rules/content-creation.mdc`.

# Content-creation skills pack (Luigi Canoro)

Portable, tool-agnostic rules and skills for creating content for Luigi Canoro's projects — especially **video editing** (reels, shorts, vlog episodes, talk clips), plus copy, social posts, thumbnails and decks. Works with any agent: Antigravity/Gemini, Cursor, Claude Code, Codex or a human editor. Nothing here depends on a specific bot, connector or machine.

## How to use

1. **Read the HARD RULES below.** They override anything else, including a skill.
2. Read the repo's `PROJECT_CONTENT_RULES.md` (if present) for project-specific brand, accounts, assets and voice. If it conflicts with this file, the hard rules win; otherwise the project file is more specific and wins.
3. Pick the skill(s) from the index and open `.agents/skills/<name>/SKILL.md`. Video work always combines `reel-production-complete-edit` + `video-review-package` + the specific editorial skill.
4. Edit locally with ffmpeg + Whisper + Python (`docs/ffmpeg-cookbook.md`, tested recipes) or DaVinci Resolve. Helper scripts in `tools/`.
5. Before showing anything to Luigi: `docs/qa-checklist.md` (full video QA + text anti-LLM-tropes QA), `bash tools/preflight_deliver.sh OUT.mp4 1080 1920`, and for post text `python3 tools/prepublish_check.py --network ig|x --file post.txt`.
6. Deliver as a **Review package** (files + notes + publishable copy in separate files). Luigi approves; only then is anything published.
7. When Luigi gives feedback on copy or editing, encode it as a general rule in the relevant `SKILL.md` (and commit it), then fix the current piece.

Generic replacements for bot-specific tooling used in older versions of these skills: "watch the export with your model's video understanding or watch it yourself", "run ffmpeg locally", "delegate to the strongest available model", "ask Luigi for the asset location", "second look = an independent model or a fresh re-read".

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

## Files in this pack

- `AGENTS.md` — this file (all agents). `GEMINI.md` — Gemini/Antigravity entry point. `CLAUDE.md` — Claude Code entry point.
- `.agents/skills/<name>/SKILL.md` — one folder per skill, YAML frontmatter `name` + `description`.
- `.cursor/rules/content-creation.mdc` — Cursor rule (agent-requested) pointing here.
- `docs/ffmpeg-cookbook.md` — tested ffmpeg recipes: jump cuts, audio cleanup + −14 LUFS two-pass loudnorm, xfade transitions, SFX/music ducking, burned-in styled subtitles, plates/lower thirds, 9:16 reframing + phone rotation, thumbnails, platform exports, QA detectors.
- `docs/qa-checklist.md` — full-video QA + text anti-LLM-tropes QA + per-network rules.
- `docs/ffmpeg-test-results.md` — last verification run of the cookbook.
- `tools/jumpcut.py` (silence-based jump cuts + EDL), `tools/loudnorm_2pass.sh`, `tools/preflight_deliver.sh` (phone-safe gate + upright stills), `tools/prepublish_check.py` + `network_rules.json` + `leak_patterns.txt` (publishable-text gate), `tools/test_ffmpeg_cookbook.sh`.
- `PROJECT_CONTENT_RULES.template.md` — template for per-project rules.

## Per-project rules

This pack is shared across repos. **Each repo adds a `PROJECT_CONTENT_RULES.md`** at its root with the project-specific rules: brand (logo files, colors, fonts, approved/unapproved assets), accounts and handles, voice, audiences, recurring people and spelling, asset locations (intro/outro masters, jingles, bumpers, templates), publishing channels and approval flow, banned claims, and the project's out-of-scope list. Start from `PROJECT_CONTENT_RULES.template.md`. Never put secrets, personal contact data or patient data in it.

## Model routing (when the agent can choose)

- Video creation/editing: Claude Opus with creative freedom, plus a Gemini version of every new video for comparison.
- UI/visual design (sites, plates, motion graphics): delegate to strong models (Claude Opus, the latest Grok, GPT Astra) and get an independent review from another strong model; the coordinating agent verifies, it does not design alone.
- Plans, bait selection, roasts: the strongest reasoning model at max effort.
- If a named model is unavailable, report it and propose an alternative; never substitute silently.
