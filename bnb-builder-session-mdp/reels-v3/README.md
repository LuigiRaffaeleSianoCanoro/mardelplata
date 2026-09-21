# BNB Builder Session MdP — Reels v3

Publish-ready vertical shorts from on-site interviews (UCIP, Mar del Plata).

This folder is **self-contained**. It does not change the mardelplata.dev website.

## Source map (important)

Upload filenames were swapped vs. the people on camera:

| Upload / `src/` file     | Who it actually is              | Company   |
|--------------------------|---------------------------------|-----------|
| `fernando_proxy.mp4`     | **Nahuel Sieri** (left, BNB tee) | Scaling  |
| `nahuel_proxy.mp4`       | **Fernando** (left, plaid)       | Nexit    |
| `matias_proxy.mp4`       | **Matías Celis** (left, cap)     | Bondi    |

Cuts follow **speech identity**, not the upload filename.

## Stack

Local only: FFmpeg + faster-whisper + Python. No watermarked SaaS.

```bash
python3 scripts/transcribe.py
python3 scripts/build_reel.py nahuel
python3 scripts/build_reel.py fernando matias
```

## Exports

- `export/BNB_NAHUEL_AGENTES-ONCHAIN_REEL_v3.mp4`
- `export/BNB_FERNANDO_POR-QUE-ASISTIR_REEL_v3.mp4`
- `export/BNB_MATIAS_DESPLEGAR-AGENTE_REEL_v3.mp4`
- Caption-free twins: `*_NOCAPTIONS.mp4`

Encode: 1080×1920, H.264 High, `yuv420p`, `+faststart`, AAC, SAR 1:1.

## Captions

Lower-third on the **table only**. Never over eyes or mouth. See `stills/` and `EDITORIAL-DECISIONS.md`.
