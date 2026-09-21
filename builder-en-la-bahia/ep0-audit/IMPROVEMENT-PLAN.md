# Builder en la Bahía — what to do before 27 Sep

**Date:** 21 Sep 2026 · **Trip:** 27 Sep–14 Oct · **Today + 6 days.**  
**Full diagnosis:** [AUDIT-REPORT.md](./AUDIT-REPORT.md)

---

## Decision for CoS + Luigi

1. **Do not publish v4.** Do not treat a Cloud Agent “full re-edit” of the kitchen cut as the week’s work.
2. **Film the house list below in one half-day (22–23 Sep).** That is the only path to a trailer that does not look like a draft.
3. **Then** one assembly pass (human or Cloud Agent) on **22–25 Sep**: new pictures + logo chips + caption/loudness fix + kill the Luma YouTube.
4. **Strategic:** v4 should not be “Ep0.” Ship a **45–75s tráiler** before the plane if you must be on YouTube pre-trip. The real Ep0 is **Día 1 in SF** (airport / Uber / first Luma door). Kitchen A-roll becomes B-roll or dies.

If Luigi cannot film anything new: use **Plan B** at the bottom. It is a 60–90s salvage, still not agency, still do not call it a promo.

---

## Priority order (do in this order)

| P | Action | Kind | Who | When | Why first |
|---|---|---|---|---|---|
| **P0** | House shotlist (table A) | **Reshoot** | Luigi, ~90 min | 22–23 Sep | Without these pictures every edit is lipstick. |
| **P0** | Native Luma **phone** record (his account, SF Tech Week visible) | **Reshoot** | Luigi, 10 min | Same session | Replaces the third-party webcam clip. Legal + craft. |
| **P0** | Fix ASS **spaces** + limiter (TP ≤ −1.5 dBTP, VO ~−16, beds ~−14) | **Edit-only** | Agent / editor | Anytime, 1 h | Ship-blocker even on drafts. Pipeline bug. |
| **P1** | Fetch logo/product stills (table C) | **Asset fetch** | CoS / intern | 22 Sep | Covers the CV without more talking. |
| **P1** | Assemble **tráiler 45–75s**: new hook → 15s who → dinámica 12s with AM/PM B-roll → Luma phone → Día 1 CTA | **Edit** | Agent after P0 | 23–25 Sep | This is the only cut worth making this week. |
| **P1** | Kill v4 Luma YT; kill or crush Ken Burns to ≤3s | **Edit-only** | Same pass | With P1 | Retention + rights. |
| **P2** | Mini brand kit (lower-third, caption box, chapter slate, subscribe plate) | **Edit / design** | Agent | With P1 | Stop inventing type every encode. |
| **P2** | Daily AM/PM template for 27 Sep+ | **Edit** | Agent | 25–26 Sep | Ep0 trailer ≠ daily show. Build the show file after the trailer. |
| **—** | Full re-grade / more xfades / more AI keyart | **Do not** | — | — | Does not move the bar. |

---

## A. Reshoot — Luigi shotlist (short, on-set)

Phone **9:16**, 4K 30 (60 if you have it), **no hat**, window or one soft light in front of the face, **chest-up**, lav or phone mic 20 cm off-axis. Jeans or dark trousers — not ICON pants. One take is enough if clean.

Film in this order. If time dies, **stop after #4**.

| # | Shot | Time | Frame | Say / do | Used for |
|---|---|---|---|---|---|
| **1** | **Hook** | 15–20s | Chest-up, lens, window | *“En seis días me voy tres semanas a San Francisco Tech Week. Voy a entrar a todos los eventos que pueda, y esto es Builder en la Bahía.”* One breath. No CV. | First 3s of the tráiler. Non-negotiable. |
| **2** | **Who (short)** | 25–35s | Same | *Nombre + MdP desde 2013 + “fundé Pavla y PsicoConecta, co-fundé MdPDev, co-hosteo BOTR. El resto del CV está en la descripción.”* | Replaces the 80s kitchen résumé. |
| **3** | **Dinámica** | 20s face + B-roll below | Face, then cutaways | *“Cada día: a la mañana el plan, a la noche lo que pasó — lo que salió bien, lo que salió mal. En el medio, las herramientas que uso.”* Do **not** say “publicidad” or “referidos.” | Format block. |
| **4** | **Luma phone** | 15s screen-record + 8s hands | Native iPhone record **vertical**; then ECU of thumbs on the real phone | Open **his** Luma, SF / Tech Week list visible, tap one event → Guest list / Register. No YouTube. No desktop. | Replaces the illegal/ugly insert. |
| **5** | **Desk AM** | 8–10s | OTS or top-down | Laptop + calendar / notes “mañana”. Hands only is fine. | Cutaway under #3. |
| **6** | **Desk PM** | 8–10s | Same desk, warmer lamp | Close laptop or type “qué pasó”. | Cutaway under #3. |
| **7** | **Walk 20s** | 20s | 9:16 follow or selfie-stick, outdoor MdP | Walk, talk one line: *“Este es el ritmo que voy a repetir en la Bahía.”* Then 5s silent walk for coverage. | Texture. Kills kitchen monotony. |
| **8** | **Pack / passport / cable pouch** | 8s | Top-down | Hands throw AirPods + passport + cable into a pouch. | Trip proof. |
| **9** | **CTA** | 8s | Chest-up, slight lean | *“Suscribite a Builder en la Bahía — nos vemos el día 1.”* Point **down** (subscribe UI), not at a wall. | End. |
| **10** | **Product plates** | 3s each | Phone or laptop fill | Open: Pavla, PsicoConecta, mardelplata.dev, BOTR stream page, Cursor. Hold still. | Named-brand cutaways. |

**Do not reshoot:** another 80s kitchen CV. Another ceiling-wide. Another “define Luma” lecture. Another AI title.

**Optional if #1–4 are in the bag:** 10s mate/coffee ECU; 10s notebook “SF Tech Week”; 5s smile hold for freeze.

---

## B. Edit-only (no new camera)

Do these even if Luigi is late. They do **not** make it agency. They stop embarrassment.

| Fix | How | Est. |
|---|---|---|
| Restore caption **spaces** | Sidecar SRT is already spaced. Rebuild ASS from SRT; do not reuse the v4 burn-in. Add a 70% black box or thick edge. | 30–45 min |
| Kill caption overlap | SRT 22/23 overlap 2:19.902–2:20.302. Close cue 22 at 2:19.800. | 5 min |
| True peak / beds | `loudnorm` VO to −16 LUFS; sting beds −14; **alimiter ≤ −1.5 dBTP**. Intro/outro are currently clipping. | 20 min |
| Crush intro/outro | 10.5s → **2.0–2.5s** each, or smash from title to hook. | 15 min |
| Punch-in on 1080 master | Crop kitchen ~1.35–1.45×, bias up to lose pants + old captions. Use punch-in on every jump-cut. **Proxy 720 is too soft to ship this crop.** | 30 min |
| Start on the trip line | If no new hook: open at ~1:04 (“este es mi intento…”) and **dump the CV** (or 8s max + logo chips). | 20 min |
| Delete Luma YT | Hold last face frame or a still of luma.com **without** the woman. Do not publish the webcam. | 10 min |
| Visual subscribe | Simple plate `SUSCRIBITE` + series name on the verbal CTA. | 15 min |
| Mid-roll language | If Dinámica stays: hard-cut the “referidos” sentence or VO-replace later. | 10 min |

**Edit-only will not fix:** hat shadow, ICON pants, empty 80s, missing products, missing walk, missing his Luma.

Proof of that ceiling: [`proof/craft-demo-after-no-reshoot.mp4`](./proof/craft-demo-after-no-reshoot.mp4) (≤45s, take2 only).

---

## C. Asset fetch (nobody films)

| Asset | Use | Notes |
|---|---|---|
| Wordmarks: Pavla, PsicoConecta, MdPDev, BOTR, Cursor | 1s chips when named | Prefer official SVGs already in-house / sites. |
| Employer marks **only if** Luigi wants them on camera | Optional chips | If legal is slow, **do not list nine companies on screen**. Cut the line. |
| SF Tech Week 2026 key art / calendar still | Hook + Luma cover | From the official page. |
| Luma mark (simple) | Lower-third on the tip | Do not rip a full YouTube tutorial. |
| Father jingle (already have) | Sting 2s | Keep; just turn it down and limit. |
| Day/night stills | Optional 2s beds | Current AI stills are temp only. |

---

## Plan B — Luigi films nothing

A Cloud Agent can cut a **60–90s unlisted/unlisted-unlisted “coming soon”** from v4:

1. 2s title (or none).
2. Jump to ~1:04 trip pitch (take2).
3. 12–15s Dinámica (wood take — the better frame).
4. Luma **face only** (drop 2:19–2:32 entirely).
5. 2s `NOS VEMOS EN EL DÍA 1`.
6. Fixed captions + limiter.

**Still fail vs. agency.** Acceptable only as a private link for friends, not as channel launch. Better to wait 48h and film #1–4.

---

## What not to do this week

- Another Cloud Agent week on xfades, Montserrat weight, and Ken Burns on the same stills.
- Re-recording the 10-company list “more confidently” in the same kitchen wide.
- Publishing the Luma YouTube insert with the woman’s face-cam “because the VO is good.”
- Building the full 5 min AM + sponsor + 5 min PM **template** before there is a 60s trailer that retains.
- Treating `NARRATIVE_QA PASS` as audience-ready.

---

## After 27 Sep (so this does not repeat)

Daily show is a **different file** from this trailer.

- **AM (≤5 min):** 8s walking hook → plan (3 bullets on screen) → 2–3 event posters from Luma → “nos vemos a la noche.”
- **Mid:** 15–25s partner / tool **with the product on screen**. Never “referidos” as VO.
- **PM (≤5 min):** 3 things that happened, 1 miss, 1 tip. B-roll from the day. End on tomorrow’s first door.

Ep0 v4 A-roll is not that show. Do not try to stretch it into one.
