---
name: pavla-three-agent-marketing
description: >-
  Use when running Pavla marketing campaigns (repo crpache/pavla): split the
  work into three separate agent sessions (plan, content, scheduling), never
  one; current Pavla brand only; nothing scheduled without Luigi's OK.
---
# Pavla marketing: three separate agents

Pavla only. Never mix other projects (PsicoConecta, mardelplata.dev.ar, Shiplog, personal) into Pavla content.

Run **three separate agent sessions**, never one agent doing plan + content + scheduling. Keep every prompt **short**: let the repo's own marketing skills and docs operate. Do not paste a mega-prompt that re-explains brand, Buffer or house rules.

## Brand (HARD)
Use the CURRENT Pavla brand only: the green isotipo from the landing + the word "Pavla". The November 2026 rebrand (PV teal monogram, Geist type, "Placa clara") is a POC/demo and is **NOT approved**: never use those assets in campaigns, posts, reels or ads until Luigi approves the rebrand.

## 1. PLAN only
- Model: a strong reasoning model (e.g. latest Grok, Gemini Pro or Claude Opus).
- Prompt: goal, dates, channels, constraints. Stop there.
- Must not produce post copy, assets or schedules.

## 2. CONTENT only
- Model: the strongest creative model (Claude Opus; for video, also a Gemini version so Luigi can compare).
- Prompt: follow the plan from step 1. Produce the pieces, applying `social-content-with-purpose`, `reel-production-complete-edit` (for video) and `qa-texto-anti-tropes-llm`.
- No patient data, real or realistic, in any asset; speak to the psychologist, never to the patient. Never show unencrypted patient data in product footage.
- Must not schedule anything.

## 3. SCHEDULE only
- Model: a fast, cheap coding/automation model.
- Prompt: take the pieces **Luigi approved** and schedule them in Buffer (programmed in advance, never "share now").
- No new strategy and no rewriting the campaign. Publishable text files contain only the post text, no production notes.

## Do not
- Combine these jobs in one agent.
- Dump the full marketing SOP into the prompt.
- Run this pipeline for non-Pavla brands.
- Schedule or publish anything Luigi has not explicitly approved.
