#!/usr/bin/env python3
"""Transcribe interview proxies with faster-whisper (local, no SaaS)."""

from __future__ import annotations

import json
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "work"
OUT = ROOT / "transcripts"

GUESTS = ("nahuel", "fernando", "matias")


def transcribe_one(model: WhisperModel, name: str) -> None:
    wav = WORK / f"{name}.wav"
    print(f"=== transcribing {name} ===", flush=True)
    segments, info = model.transcribe(
        str(wav),
        language="es",
        beam_size=5,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 350},
        word_timestamps=True,
    )
    rows = []
    lines = []
    for seg in segments:
        words = []
        if seg.words:
            for w in seg.words:
                words.append(
                    {
                        "start": round(w.start, 3),
                        "end": round(w.end, 3),
                        "word": w.word,
                    }
                )
        row = {
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg.text.strip(),
            "words": words,
        }
        rows.append(row)
        lines.append(f"[{row['start']:7.2f} → {row['end']:7.2f}] {row['text']}")
        print(lines[-1], flush=True)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{name}.json").write_text(
        json.dumps(
            {
                "guest": name,
                "language": info.language,
                "duration": info.duration,
                "segments": rows,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    (OUT / f"{name}.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {OUT / name}.json", flush=True)


def main() -> None:
    model = WhisperModel("small", device="cpu", compute_type="int8")
    for name in GUESTS:
        transcribe_one(model, name)


if __name__ == "__main__":
    main()
