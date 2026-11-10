#!/usr/bin/env python3
"""Jump cuts by silence detection (ffmpeg silencedetect -> trim/atrim + concat).

Usage:
  python3 jumpcut.py IN.mp4 OUT.mp4 [--noise -35] [--min-silence 0.45] [--pad 0.12]
                     [--min-keep 0.30] [--edl edl.csv] [--dry-run]

- Detects silences >= --min-silence seconds below --noise dB.
- Keeps speech segments, padding --pad seconds on each side (breath room, avoids
  cutting word onsets/tails). Segments shorter than --min-keep are dropped.
- Adds 10 ms audio fades on every cut to avoid clicks.
- Writes an EDL (CSV: segment, src_in, src_out, out_in, out_out) so the cut list
  can be reviewed and documented in EDITORIAL-DECISIONS.md.

ALWAYS review the result: silence detection is a first pass, not an editor.
Fix cuts that land mid-word using the word timestamps of your transcript.
Requires ffmpeg + ffprobe on PATH. Python 3.8+. No third-party packages.
"""
import argparse, csv, re, subprocess, sys


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def detect_silences(path, noise, min_sil):
    cmd = ["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-vn",
           "-af", f"silencedetect=noise={noise}dB:d={min_sil}", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return list(zip(starts, ends + [None] * (len(starts) - len(ends))))


def keep_segments(total, silences, pad, min_keep):
    keeps, cur = [], 0.0
    for s, e in silences:
        s = max(0.0, s)
        e = total if e is None else e
        seg_end = min(total, s + pad)
        if seg_end - cur >= min_keep:
            keeps.append((round(cur, 3), round(seg_end, 3)))
        cur = max(cur, e - pad)
    if total - cur >= min_keep:
        keeps.append((round(cur, 3), round(total, 3)))
    return keeps


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inp"); ap.add_argument("out")
    ap.add_argument("--noise", type=float, default=-35.0)
    ap.add_argument("--min-silence", type=float, default=0.45)
    ap.add_argument("--pad", type=float, default=0.12)
    ap.add_argument("--min-keep", type=float, default=0.30)
    ap.add_argument("--edl", default=None)
    ap.add_argument("--crf", default="18")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    total = duration(a.inp)
    keeps = keep_segments(total, detect_silences(a.inp, a.noise, a.min_silence), a.pad, a.min_keep)
    if not keeps:
        sys.exit("No speech segments found; check --noise")

    parts, labels, t_out, rows = [], [], 0.0, []
    for i, (s, e) in enumerate(keeps):
        d = e - s
        fo = max(0.0, d - 0.01)
        parts.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS[v{i}]")
        parts.append(f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:st=0:d=0.01,afade=t=out:st={fo:.3f}:d=0.01[a{i}]")
        labels.append(f"[v{i}][a{i}]")
        rows.append([i, s, e, round(t_out, 3), round(t_out + d, 3)])
        t_out += d
    fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(keeps)}:v=1:a=1[v][a]"

    if a.edl:
        with open(a.edl, "w", newline="") as f:
            w = csv.writer(f); w.writerow(["segment", "src_in", "src_out", "out_in", "out_out"]); w.writerows(rows)
    print(f"source {total:.2f}s -> {len(keeps)} segments, {t_out:.2f}s ({total - t_out:.2f}s removed)")
    if a.dry_run:
        print(fc); return
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", a.inp, "-filter_complex", fc,
           "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", a.crf,
           "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", a.out]
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    main()
