# Editorial decisions — BNB Builder Session MdP reels v3

Trial response to Luigi: previous cuts put giant captions over faces. This version keeps speech captions **only on the wood table (lower third)**.

## Sources

Proxies in `src/` are the masters for this trial (720×1280, already 9:16).

**Filename swap (verified by transcription):**

- `src/fernando_proxy.mp4` is **Nahuel Sieri (Scaling)** — BNB Chain tee, talks agentes on-chain / Twitter NahuelSieri.
- `src/nahuel_proxy.mp4` is **Fernando (Nexit)** — plaid shirt, energy / carbon / Nexit.
- `src/matias_proxy.mp4` is **Matías Celis (Bondi)** — cap + glasses, Bondi MDP / deploy agent.

Interviewer on the right (cap) is Luigi.

## Priority cut: Nahuel — agentes on-chain

**File:** `export/BNB_NAHUEL_AGENTES-ONCHAIN_REEL_v3.mp4`

**Why this reel first:** It is the strongest single idea in the three interviews (on-chain agents + MdP builders + BNB Chain workshop), and it is the line the previous bad cut tried to use.

### Structure (Hook → Context → Value → Payoff)

| Beat | Source in `fernando_proxy.mp4` | Why |
|------|--------------------------------|-----|
| **Hook ~2.9s** | 74.62–77.52 *“Hoy, por ejemplo, hablamos mucho de agentes on-chain”* | Real speech, curiosity, 1–3s. Not invented. |
| **Context** | 46.17–56.10 cracks of the region / *nivel alto* | Local pride, sets the room. |
| **Value** | 64.95–73.95 + 77.86–87.70 ganas, stack, implementar, mundo on-chain, BNB Chain | The “what you actually get”. |
| **Payoff** | 94.50–101.90 *se va con una idea mucho mayor… se construye con agentes* | Closes the hook. |

### What we cut

- Interviewer questions (they slow the reel).
- Filler *“por así hacerlo”* / *“como darle”*.
- Workshop name guess (“Leann”) — Whisper was uncertain; we do not invent names.
- Promo/QR/Twitter handle block (not the story).

### Picture

- Keep the **two-shot**. The table is the caption safe area; a face-fill crop is what broke v1/v2.
- Two gentle punches only (108%, biased left to Nahuel): hook + “implementar / mundo on-chain”. Not every 2s.
- Banner already in frame (`BNB BUILDER SESSION ARGENTINA`). No extra invented chrome.

### Captions

- Spanish, 2–5 words/line, Inter Bold, white + dark outline.
- ASS `Alignment=2`, `MarginV=360` on 1920 → text sits ~y=1480–1650 (table).
- No name slate overlay. The on-set banner already IDs the event; extra chrome was cluttering two-line captions.
- Light cleanup: *on-chain*, *BNB Chain*. We do not rewrite his voice.

### Audio / grade

- 30 ms fades on joins (no whooshes).
- `loudnorm` −14 LUFS.
- Mild contrast/sat only. Natural skin.

### Duration

Follows content (**35.1s**), not forced to 2:30.

### QC

- ffprobe: 1080×1920, H.264 **High**, **yuv420p**, SAR 1:1, AAC, `+faststart` (moov before mdat).
- Independent video review: captions stay on the table; hook is real speech in the first 3s; jump cuts feel human.
- Stills in `stills/nahuel/` + `stills/nahuel/qc-overlay/`.

---

## Fernando — por qué asistir

**File:** `export/BNB_FERNANDO_POR-QUE-ASISTIR_REEL_v3.mp4`

Hook is his own line *“te abre mucho más el panorama”*, then why he came (herramientas for a project he is launching), then Nexit as payoff (startup de MdP, energía para pymes). Duration **23.0s**.

---

## Matías — desplegar un agente

**File:** `export/BNB_MATIAS_DESPLEGAR-AGENTE_REEL_v3.mp4`

Hook: *poder desplegar un agente en BNB Chain*. Context: leftover ganas from ETH Global / x402. Value: speakers that actually help you deploy. Close: Bondi (`bondimdp.com.ar`) as “reemplazo de Cuando Llega” in MdP. Duration **33.8s**.

Caption “un agente” / “BNB Chain” / “Cuando Llega” are human fixes of Whisper (`una gente`, `BNP`, `mar de plantas`).

---

## Anti–AI-edit checklist

- No emoji, no karaoke bounce, no SFX on cuts, no stock B-roll.
- No zoom every 2 seconds.
- No title card over the forehead (that was the failed trial).
- No new logos.

## Encode

H.264 High, `pix_fmt=yuv420p`, `+faststart`, AAC 192k, SAR 1:1, 1080×1920. See `export/*_ffprobe.json`.
