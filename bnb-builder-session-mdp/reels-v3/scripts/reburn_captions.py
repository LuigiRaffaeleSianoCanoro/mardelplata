#!/usr/bin/env python3
"""Re-burn ASS onto existing NOCAPTIONS twins (no recut)."""

from pathlib import Path

from build_reel import EXPORT, REELS, STILLS, encode_final, extract_stills, probe, qc_overlay, write_ass

WORK = Path(__file__).resolve().parents[1] / "work" / "reburn"


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    for reel in REELS.values():
        twin = EXPORT / reel.outfile.replace("_REEL_v3.mp4", "_REEL_v3_NOCAPTIONS.mp4")
        if not twin.exists():
            raise SystemExit(f"missing {twin}")
        ass = WORK / f"{reel.guest_key}.ass"
        write_ass(ass, reel)
        dest = EXPORT / reel.outfile
        encode_final(twin, ass, dest, copy_audio=True)
        (EXPORT / f"{reel.guest_key}_ffprobe.json").write_text(probe(dest), encoding="utf-8")
        duration = sum(c.end - c.start for c in reel.clips)
        sample_ts = [
            ("t02s_hook", min(2.0, duration * 0.08)),
            ("t08s_mid", min(8.0, duration * 0.35)),
            ("t20s_value", min(20.0, duration * 0.65)),
            ("t_payoff", max(0.5, duration - 2.4)),
        ]
        still_dir = STILLS / reel.guest_key
        extract_stills(dest, sample_ts, still_dir)
        qc_dir = still_dir / "qc-overlay"
        qc_dir.mkdir(parents=True, exist_ok=True)
        for name, _t in sample_ts:
            src_still = still_dir / f"{name}.jpg"
            if src_still.exists():
                qc_overlay(src_still, qc_dir / f"{name}_safearea.jpg")
        print("reburned", dest)


if __name__ == "__main__":
    main()
