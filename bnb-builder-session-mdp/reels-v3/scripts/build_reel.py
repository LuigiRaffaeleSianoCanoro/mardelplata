#!/usr/bin/env python3
"""Cut + caption BNB Builder Session MdP vertical reels.

Hard rules:
- 1080x1920, H.264 High, yuv420p, +faststart, AAC, SAR 1:1
- Captions only in lower-third (table), never over eyes/mouth
- No invented branding chrome, no AI-edit spam
"""

from __future__ import annotations

import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
WORK = ROOT / "work"
CLIPS = WORK / "clips"
EXPORT = ROOT / "export"
STILLS = ROOT / "stills"
FONTDIR = "/usr/share/fonts/truetype/macos"

# Instagram-ish safe band: captions sit on the wood table.
# PlayRes 1080x1920, alignment 2 (bottom-center), MarginV from bottom.
CAPTION_MARGIN_V = 340
NAME_MARGIN_V = 455
FONT_SPEECH = 56
FONT_NAME = 32


@dataclass
class Clip:
    start: float
    end: float
    zoom: float = 1.0
    x_bias: float = 0.0  # -0.5 = favor left (guest), 0 = center
    y_bias: float = 0.28  # 0 = top of crop window (keep heads)


@dataclass
class Cue:
    start: float
    end: float
    lines: list[str]


@dataclass
class Reel:
    guest_key: str
    source: Path
    topic: str
    outfile: str
    clips: list[Clip]
    cues: list[Cue]
    name_slate: str
    name_until: float


def even(n: int) -> int:
    return n + (n % 2)


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd[:8]), "...", flush=True)
    subprocess.run(cmd, check=True)


def extract_clip(src: Path, clip: Clip, dest: Path) -> None:
    dur = clip.end - clip.start
    fade_d = 0.03
    fade_out_st = max(0.0, dur - fade_d)
    if clip.zoom <= 1.001:
        vf = (
            "scale=1080:1920:flags=lanczos,setsar=1,fps=30,"
            "eq=contrast=1.03:saturation=1.05:brightness=0.008,"
            "format=yuv420p"
        )
    else:
        sw = even(int(round(1080 * clip.zoom)))
        sh = even(int(round(1920 * clip.zoom)))
        max_x = sw - 1080
        max_y = sh - 1920
        x = int(max(0, min(max_x, max_x * (0.5 + clip.x_bias))))
        y = int(max(0, min(max_y, max_y * clip.y_bias)))
        vf = (
            f"scale={sw}:{sh}:flags=lanczos,"
            f"crop=1080:1920:{x}:{y},setsar=1,fps=30,"
            "eq=contrast=1.03:saturation=1.05:brightness=0.008,"
            "format=yuv420p"
        )
    af = (
        f"afade=t=in:st=0:d={fade_d},"
        f"afade=t=out:st={fade_out_st:.3f}:d={fade_d},"
        "aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo"
    )
    dest.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            "ffmpeg",
            "-y",
            "-ss",
            f"{clip.start:.3f}",
            "-to",
            f"{clip.end:.3f}",
            "-i",
            str(src),
            "-vf",
            vf,
            "-af",
            af,
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "16",
            "-profile:v",
            "high",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            "48000",
            "-ac",
            "2",
            str(dest),
        ]
    )


def concat_clips(paths: list[Path], dest: Path) -> None:
    lst = dest.with_suffix(".txt")
    lst.write_text("".join(f"file '{p.resolve()}'\n" for p in paths), encoding="utf-8")
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(lst),
            "-c",
            "copy",
            str(dest),
        ]
    )


def ass_time(t: float) -> str:
    if t < 0:
        t = 0
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"


def escape_ass(text: str) -> str:
    return text.replace("\\", "\\\\").replace("{", "\\{").replace("}", "\\}")


def write_ass(path: Path, reel: Reel) -> None:
    events = []
    if reel.name_slate:
        events.append(
            f"Dialogue: 0,{ass_time(0)},{ass_time(reel.name_until)},Name,,0,0,0,,"
            f"{escape_ass(reel.name_slate)}"
        )
    for cue in reel.cues:
        body = r"\N".join(escape_ass(line) for line in cue.lines)
        events.append(
            f"Dialogue: 0,{ass_time(cue.start)},{ass_time(cue.end)},Speech,,0,0,0,,{body}"
        )
    header = f"""[Script Info]
Title: {reel.outfile}
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Speech,Inter,{FONT_SPEECH},&H00FFFFFF,&H000000FF,&HDC000000,&H64000000,-1,0,0,0,100,100,0,0,1,3.4,1.0,2,80,80,{CAPTION_MARGIN_V},1
Style: Name,Inter,{FONT_NAME},&H00E8E8E8,&H000000FF,&HAA000000,&H64000000,0,0,0,0,100,100,0.4,0,1,2.2,0.6,2,80,80,{NAME_MARGIN_V},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    path.write_text(header + "\n".join(events) + "\n", encoding="utf-8")


def encode_final(
    concat_mp4: Path, ass: Path | None, dest: Path, *, copy_audio: bool = False
) -> None:
    vf_parts = []
    if ass is not None:
        vf_parts.append(f"subtitles={ass}:fontsdir={FONTDIR}:charenc=UTF-8")
    vf_parts.append("format=yuv420p")
    vf_parts.append("setsar=1")
    vf = ",".join(vf_parts)
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(concat_mp4),
        "-vf",
        vf,
    ]
    if copy_audio:
        cmd += ["-c:a", "copy"]
    else:
        cmd += [
            "-af",
            "loudnorm=I=-14:TP=-1.5:LRA=11",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            "48000",
            "-ac",
            "2",
        ]
    cmd += [
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "18",
        "-profile:v",
        "high",
        "-level",
        "4.1",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-video_track_timescale",
        "15360",
        str(dest),
    ]
    run(cmd)


def extract_stills(mp4: Path, times: list[tuple[str, float]], dest_dir: Path) -> None:
    dest_dir.mkdir(parents=True, exist_ok=True)
    for name, t in times:
        out = dest_dir / f"{name}.jpg"
        run(
            [
                "ffmpeg",
                "-y",
                "-ss",
                f"{t:.3f}",
                "-i",
                str(mp4),
                "-frames:v",
                "1",
                "-update",
                "1",
                "-q:v",
                "2",
                str(out),
            ]
        )


def qc_overlay(still: Path, dest: Path) -> None:
    """Draw forbidden face band + caption safe band for visual QC."""
    # Approximate: faces live in upper-mid; captions must be y>=1320 and y<=1700.
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(still),
            "-vf",
            (
                "drawbox=x=0:y=0:w=1080:h=250:color=red@0.18:t=fill,"
                "drawbox=x=0:y=250:w=1080:h=1070:color=red@0.10:t=fill,"
                "drawbox=x=40:y=1360:w=1000:h=280:color=green@0.22:t=fill,"
                "drawbox=x=40:y=1360:w=1000:h=280:color=green@0.9:t=6,"
                "drawtext=fontfile=/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf:"
                "text='FACE ZONE — captions forbidden':x=40:y=40:fontsize=28:fontcolor=white,"
                "drawtext=fontfile=/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf:"
                "text='LOWER-THIRD SAFE (table)':x=60:y=1380:fontsize=28:fontcolor=white"
            ),
            "-frames:v",
            "1",
            "-update",
            "1",
            "-q:v",
            "3",
            str(dest),
        ]
    )


def probe(path: Path) -> str:
    r = subprocess.run(
        [
            "ffprobe",
            "-hide_banner",
            "-show_entries",
            "stream=codec_name,profile,pix_fmt,width,height,sample_aspect_ratio,codec_type",
            "-show_entries",
            "format=duration,bit_rate",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return r.stdout


# ---------------------------------------------------------------------------
# Nahuel Sieri (Scaling) — SOURCE FILE is fernando_proxy.mp4 (label swap)
# Hook = real line about agentes on-chain
# ---------------------------------------------------------------------------
NAHUEL = Reel(
    guest_key="nahuel",
    source=SRC / "fernando_proxy.mp4",
    topic="AGENTES-ONCHAIN",
    outfile="BNB_NAHUEL_AGENTES-ONCHAIN_REEL_v3.mp4",
    clips=[
        Clip(74.62, 77.52, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # hook
        Clip(46.17, 50.85, zoom=1.0),  # cracks
        Clip(51.31, 56.10, zoom=1.0),  # nivel alto
        Clip(64.95, 69.22, zoom=1.0),  # ganas de construir
        Clip(69.80, 71.95, zoom=1.0),  # stack
        Clip(73.12, 73.95, zoom=1.0),  # muy grande
        Clip(77.86, 79.22, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # implementar
        Clip(81.00, 85.22, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # mundo on-chain
        Clip(85.58, 87.70, zoom=1.0),  # BNB Chain
        Clip(94.50, 101.90, zoom=1.0),  # payoff
    ],
    cues=[
        Cue(0.00, 0.88, ["Hoy, por ejemplo,"]),
        Cue(0.88, 1.72, ["hablamos mucho"]),
        Cue(1.72, 2.90, ["de agentes on-chain"]),
        Cue(2.90, 4.20, ["Acá en la región"]),
        Cue(4.20, 5.35, ["hay un montón"]),
        Cue(5.35, 6.20, ["de cracks"]),
        Cue(6.20, 7.35, ["que están construyendo"]),
        Cue(7.35, 7.58, ["y lo sabemos."]),
        Cue(7.58, 8.90, ["Así que me esperaba"]),
        Cue(8.90, 10.40, ["un nivel alto"]),
        Cue(10.40, 12.37, ["y superar", "las expectativas."]),
        Cue(12.37, 13.30, ["Y la verdad"]),
        Cue(13.30, 14.20, ["que puede ver"]),
        Cue(14.20, 15.40, ["un montón de gente"]),
        Cue(15.40, 16.64, ["con ganas", "de construir."]),
        Cue(16.64, 18.79, ["También un stack", "de tecnología"]),
        Cue(18.79, 19.62, ["muy grande."]),
        Cue(19.62, 21.00, ["cómo implementar", "estos agentes"]),
        Cue(21.00, 22.50, ["sumar a estos", "agentes"]),
        Cue(22.50, 24.20, ["dentro de todo"]),
        Cue(24.20, 25.24, ["lo que es", "el mundo on-chain."]),
        Cue(25.24, 27.36, ["En este caso,", "en BNB Chain."]),
        Cue(27.36, 28.90, ["Así que la gente"]),
        Cue(28.90, 30.20, ["se va con una idea"]),
        Cue(30.20, 31.70, ["mucho mayor"]),
        Cue(31.70, 33.10, ["de lo que es BNB"]),
        Cue(33.10, 34.86, ["y cómo on-chain", "se construye con agentes."]),
    ],
    name_slate="",
    name_until=0,
)

# Fernando / Nexit — SOURCE FILE is nahuel_proxy.mp4 (label swap)
FERNANDO = Reel(
    guest_key="fernando",
    source=SRC / "nahuel_proxy.mp4",
    topic="POR-QUE-ASISTIR",
    outfile="BNB_FERNANDO_POR-QUE-ASISTIR_REEL_v3.mp4",
    clips=[
        Clip(39.52, 40.95, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # hook panorama
        Clip(29.24, 36.05, zoom=1.0),  # entender herramientas / proyecto
        Clip(56.48, 63.70, zoom=1.0),  # herramientas reales
        Clip(91.20, 98.55, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # Nexit payoff
    ],
    cues=[
        Cue(0.00, 1.43, ["Te abre mucho más", "el panorama."]),
        Cue(1.43, 2.50, ["Era entender"]),
        Cue(2.50, 3.80, ["cómo implementar"]),
        Cue(3.80, 5.30, ["estas nuevas", "herramientas"]),
        Cue(5.30, 6.90, ["para el proyecto", "propio"]),
        Cue(6.90, 8.24, ["que estamos", "lanzando en breve."]),
        Cue(8.24, 9.60, ["Las herramientas", "que te brindan"]),
        Cue(9.60, 11.00, ["te abren", "posibilidades"]),
        Cue(11.00, 13.00, ["herramientas reales"]),
        Cue(13.00, 15.46, ["y de construcción", "a futuro."]),
        Cue(15.46, 17.00, ["Estamos lanzando", "Nexit."]),
        Cue(17.00, 18.80, ["Una startup", "que nace en"]),
        Cue(18.80, 20.00, ["Mar del Plata"]),
        Cue(20.00, 22.81, ["soluciones de energía", "para pymes."]),
    ],
    name_slate="",
    name_until=0,
)

# Matías Celis / Bondi
MATIAS = Reel(
    guest_key="matias",
    source=SRC / "matias_proxy.mp4",
    topic="DESPLEGAR-AGENTE",
    outfile="BNB_MATIAS_DESPLEGAR-AGENTE_REEL_v3.mp4",
    clips=[
        Clip(54.40, 57.80, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # hook deploy
        Clip(57.95, 60.36, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # ganas
        Clip(60.87, 67.80, zoom=1.0),  # hackathon leftover
        Clip(67.95, 70.05, zoom=1.0),  # pivot
        Clip(70.57, 71.82, zoom=1.0),  # esas ganas
        Clip(85.37, 89.50, zoom=1.0),  # capacitada
        Clip(89.50, 94.95, zoom=1.08, x_bias=-0.5, y_bias=0.22),  # desplegar agente
        Clip(124.85, 132.70, zoom=1.0),  # Bondi
    ],
    cues=[
        Cue(0.00, 1.20, ["Poder desplegar"]),
        Cue(1.20, 3.40, ["un agente", "en BNB Chain."]),
        Cue(3.40, 5.81, ["porque me había", "quedado con las ganas."]),
        Cue(5.81, 8.10, ["El año pasado,", "en el hackathon"]),
        Cue(8.10, 9.70, ["de Ethereum Global,"]),
        Cue(9.70, 12.74, ["quería hacer algo", "con x402 y agentes."]),
        Cue(12.74, 14.84, ["Tuvimos que", "pivotar."]),
        Cue(14.84, 16.09, ["Me había quedado", "con esas ganas."]),
        Cue(16.09, 18.20, ["Los chicos", "de las charlas"]),
        Cue(18.20, 20.22, ["son gente", "súper capacitada"]),
        Cue(20.22, 22.30, ["y te va a servir"]),
        Cue(22.30, 25.67, ["para desplegar", "tu agente en blockchain."]),
        Cue(25.67, 28.10, ["Me conocen por", "bondimdp.com.ar"]),
        Cue(28.10, 31.20, ["la app que viene", "a reemplazar"]),
        Cue(31.20, 33.52, ["a Cuando Llega", "en Mar del Plata."]),
    ],
    name_slate="",
    name_until=0,
)


def build(reel: Reel) -> Path:
    guest_dir = CLIPS / reel.guest_key
    if guest_dir.exists():
        shutil.rmtree(guest_dir)
    guest_dir.mkdir(parents=True)
    parts: list[Path] = []
    for i, clip in enumerate(reel.clips, 1):
        dest = guest_dir / f"{i:02d}.mp4"
        extract_clip(reel.source, clip, dest)
        parts.append(dest)
    concat_path = guest_dir / "concat.mp4"
    concat_clips(parts, concat_path)
    ass_path = guest_dir / "captions.ass"
    write_ass(ass_path, reel)
    EXPORT.mkdir(parents=True, exist_ok=True)
    final_path = EXPORT / reel.outfile
    encode_final(concat_path, ass_path, final_path)
    twin = EXPORT / reel.outfile.replace("_REEL_v3.mp4", "_REEL_v3_NOCAPTIONS.mp4")
    encode_final(concat_path, None, twin)
    (EXPORT / f"{reel.guest_key}_ffprobe.json").write_text(probe(final_path), encoding="utf-8")
    still_dir = STILLS / reel.guest_key
    # Sample early hook, mid, payoff — times are on the edited timeline.
    duration = sum(c.end - c.start for c in reel.clips)
    sample_ts = [
        ("t02s_hook", min(2.0, duration * 0.08)),
        ("t08s_mid", min(8.0, duration * 0.35)),
        ("t20s_value", min(20.0, duration * 0.65)),
        ("t_payoff", max(0.5, duration - 2.4)),
    ]
    extract_stills(final_path, sample_ts, still_dir)
    qc_dir = still_dir / "qc-overlay"
    qc_dir.mkdir(parents=True, exist_ok=True)
    for name, _t in sample_ts:
        src_still = still_dir / f"{name}.jpg"
        if src_still.exists():
            qc_overlay(src_still, qc_dir / f"{name}_safearea.jpg")
    print("exported", final_path, flush=True)
    return final_path


REELS = {"nahuel": NAHUEL, "fernando": FERNANDO, "matias": MATIAS}


def main() -> None:
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("guest", nargs="+", choices=["nahuel", "fernando", "matias", "all"])
    args = p.parse_args()
    keys = list(REELS) if "all" in args.guest else args.guest
    for key in keys:
        build(REELS[key])


if __name__ == "__main__":
    main()
