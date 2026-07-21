#!/usr/bin/env python3
"""
Genera carrouseles IG 1080×1080 para la campaña Talento MdP.

Brand Core (Capa 1): ocean + Space Grotesk / Inter.
Si hay foto en photos/{slug}.{jpg,jpeg,png,webp} la usa; si no, avatar con iniciales.

Uso:
  python3 scripts/marketing/generate-talento-carousels.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
CAMPAIGN = ROOT / "docs/marketing/campaigns/talento-mdp-2026"
PHOTOS = CAMPAIGN / "photos"
OUT_DOCS = CAMPAIGN / "carousels"
OUT_PUBLIC = ROOT / "public/campaigns/talento-mdp-2026"
APPLICANTS = CAMPAIGN / "applicants.json"

SIZE = 1080
MARGIN = 72

# Brand Core — ocean
OCEAN_900 = (2, 0, 48)
OCEAN_800 = (3, 4, 94)
OCEAN_700 = (2, 62, 138)
OCEAN_600 = (0, 119, 182)
OCEAN_400 = (0, 180, 216)
OCEAN_300 = (72, 202, 228)
OCEAN_200 = (144, 224, 239)
OCEAN_100 = (173, 232, 244)
SAND_400 = (233, 213, 160)
WHITE = (255, 255, 255)
SLATE = (226, 232, 240)

FONT_DIR = Path("/tmp/fonts")
FONT_DISPLAY_BOLD = FONT_DIR / "SpaceGrotesk-Bold.ttf"
FONT_DISPLAY_MED = FONT_DIR / "SpaceGrotesk-Medium.ttf"
FONT_BODY = Path("/usr/share/fonts/truetype/macos/Inter-Regular.ttf")
FONT_BODY_MED = Path("/usr/share/fonts/truetype/macos/Inter-Medium.ttf")
FONT_BODY_SEMI = Path("/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf")
# Fallbacks if Inter/Space Grotesk not present on the machine
FONT_FALLBACK_BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
FONT_FALLBACK = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")


def ensure_space_grotesk() -> None:
    """Download static Space Grotesk if missing (jsDelivr / fontsource)."""
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    mapping = {
        FONT_DISPLAY_BOLD: "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf",
        FONT_DISPLAY_MED: "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-500-normal.ttf",
    }
    for path, url in mapping.items():
        if path.exists() and path.read_bytes()[:4] == b"\x00\x01\x00\x00":
            continue
        import urllib.request

        urllib.request.urlretrieve(url, path)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    ensure_space_grotesk()
    if path.exists():
        candidate = path
    elif "Bold" in path.name or "Semi" in path.name or "Medium" in path.name:
        candidate = FONT_FALLBACK_BOLD if FONT_FALLBACK_BOLD.exists() else FONT_FALLBACK
    else:
        candidate = FONT_FALLBACK
    if not candidate.exists():
        raise FileNotFoundError(f"Font missing: {path}")
    return ImageFont.truetype(str(candidate), size)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.replace("\n", " ").split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=fnt) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_gradient(img: Image.Image) -> None:
    """Fast diagonal ocean gradient + soft cyan glow."""
    w, h = img.size
    # base vertical blend ocean-900 → ocean-800/700
    top = Image.new("RGB", (1, h))
    tp = top.load()
    for y in range(h):
        t = y / (h - 1)
        tp[0, y] = (
            int(OCEAN_900[0] + (OCEAN_800[0] - OCEAN_900[0]) * t),
            int(OCEAN_900[1] + (OCEAN_700[1] - OCEAN_900[1]) * t * 0.5),
            int(OCEAN_900[2] + (OCEAN_700[2] - OCEAN_900[2]) * t * 0.4),
        )
    base = top.resize((w, h), Image.Resampling.BILINEAR)

    # glow blob top-right
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy, r = int(w * 0.82), int(h * 0.18), 340
    for i, alpha in enumerate((55, 35, 18)):
        rr = r - i * 70
        gd.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(*OCEAN_600, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img.paste(Image.alpha_composite(base.convert("RGBA"), glow).convert("RGB"))


def draw_wave_lines(draw: ImageDraw.ImageDraw) -> None:
    for i, y0 in enumerate((880, 930, 980)):
        points = []
        amp = 10 + i * 4
        for x in range(0, SIZE + 1, 8):
            y = y0 + int(math.sin(x / 55 + i) * amp)
            points.append((x, y))
        color = (*OCEAN_400, 40 + i * 18)
        # Pillow line doesn't do alpha on RGB image — use muted solid
        muted = (
            int(OCEAN_400[0] * 0.35 + OCEAN_900[0] * 0.65),
            int(OCEAN_400[1] * 0.35 + OCEAN_900[1] * 0.65),
            int(OCEAN_400[2] * 0.35 + OCEAN_900[2] * 0.65),
        )
        draw.line(points, fill=muted, width=2)


def draw_logo_mark(draw: ImageDraw.ImageDraw, x: int, y: int, size: int = 48) -> None:
    """Rounded square gradient-ish mark + MdPDev wordmark."""
    # approximate gradient with solid mid ocean
    draw.rounded_rectangle([x, y, x + size, y + size], radius=14, fill=OCEAN_600)
    # simple sealion-ish ellipse (minimal)
    pad = size // 5
    draw.ellipse([x + pad, y + pad - 2, x + size // 2 + 4, y + size // 2 + 6], outline=WHITE, width=2)
    draw.ellipse([x + pad + 4, y + pad + 2, x + pad + 10, y + pad + 8], fill=WHITE)
    f = font(FONT_DISPLAY_BOLD, 28)
    draw.text((x + size + 14, y + 8), "MdPDev", font=f, fill=WHITE)


def find_photo(slug: str) -> Path | None:
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"):
        p = PHOTOS / f"{slug}{ext}"
        if p.exists():
            return p
    return None


def circular_photo(path: Path | None, diameter: int, initials: str) -> Image.Image:
    out = Image.new("RGBA", (diameter, diameter), (0, 0, 0, 0))
    mask = Image.new("L", (diameter, diameter), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, diameter - 1, diameter - 1], fill=255)

    if path:
        src = Image.open(path).convert("RGB")
        # center crop
        w, h = src.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        src = src.crop((left, top, left + side, top + side)).resize((diameter, diameter), Image.Resampling.LANCZOS)
        out.paste(src, (0, 0))
        out.putalpha(mask)
        # cyan ring
        ring = Image.new("RGBA", (diameter + 12, diameter + 12), (0, 0, 0, 0))
        rd = ImageDraw.Draw(ring)
        rd.ellipse([0, 0, diameter + 11, diameter + 11], outline=(*OCEAN_400, 255), width=6)
        ring.paste(out, (6, 6), out)
        return ring

    # initials avatar
    canvas = Image.new("RGBA", (diameter + 12, diameter + 12), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    d.ellipse([0, 0, diameter + 11, diameter + 11], outline=OCEAN_400, width=6)
    d.ellipse([6, 6, diameter + 5, diameter + 5], fill=OCEAN_700)
    f = font(FONT_DISPLAY_BOLD, max(36, diameter // 3))
    bbox = d.textbbox((0, 0), initials, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((diameter + 12 - tw) / 2, (diameter + 12 - th) / 2 - 4), initials, font=f, fill=WHITE)
    return canvas


def initials_of(name: str) -> str:
    parts = [p for p in name.replace("/", " ").split() if p and p[0].isalnum()]
    if not parts:
        return "?"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()


def base_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (SIZE, SIZE), OCEAN_900)
    draw_gradient(img)
    draw = ImageDraw.Draw(img)
    draw_wave_lines(draw)
    return img, draw


def save_slide(img: Image.Image, slug: str, index: int, name: str) -> None:
    for base in (OUT_DOCS / slug, OUT_PUBLIC / slug):
        base.mkdir(parents=True, exist_ok=True)
        path = base / f"{index:02d}-{name}.png"
        img.save(path, "PNG", optimize=True)


def slide_cover(person: dict, series_n: int, total: int) -> Image.Image:
    img, draw = base_canvas()
    draw_logo_mark(draw, MARGIN, MARGIN)

    kicker = font(FONT_BODY_SEMI, 22)
    draw.text((MARGIN, 160), "TALENTO MdP", font=kicker, fill=OCEAN_300)
    draw.text((MARGIN + 220, 160), f"·  {series_n:02d} / {total:02d}", font=kicker, fill=OCEAN_200)

    photo = circular_photo(find_photo(person["slug"]), 360, initials_of(person["display_name"]))
    img.paste(photo, ((SIZE - photo.width) // 2, 230), photo)

    name_f = font(FONT_DISPLAY_BOLD, 64)
    role_f = font(FONT_BODY_MED, 28)
    name = person["display_name"]
    # center name
    nw = draw.textlength(name, font=name_f)
    draw.text(((SIZE - nw) / 2, 640), name, font=name_f, fill=WHITE)
    rw = draw.textlength(person["role"], font=role_f)
    draw.text(((SIZE - rw) / 2, 720), person["role"], font=role_f, fill=OCEAN_200)

    tag = font(FONT_BODY, 22)
    line = "Historias de talento de la costa atlántica"
    lw = draw.textlength(line, font=tag)
    draw.text(((SIZE - lw) / 2, 980), line, font=tag, fill=OCEAN_100)
    return img


def slide_quote(person: dict) -> Image.Image:
    img, draw = base_canvas()
    draw_logo_mark(draw, MARGIN, MARGIN)

    label = font(FONT_BODY_SEMI, 22)
    draw.text((MARGIN, 200), "SER DEV EN MAR DEL PLATA ES…", font=label, fill=OCEAN_300)

    qf = font(FONT_DISPLAY_BOLD, 48)
    lines = wrap_text(draw, f"“{person['quote']}”", qf, SIZE - MARGIN * 2)
    y = 320
    for line in lines[:8]:
        draw.text((MARGIN, y), line, font=qf, fill=WHITE)
        y += 64

    nf = font(FONT_BODY_MED, 26)
    draw.text((MARGIN, 960), f"— {person['display_name']}", font=nf, fill=OCEAN_200)
    return img


def slide_moment(person: dict) -> Image.Image:
    img, draw = base_canvas()
    draw_logo_mark(draw, MARGIN, MARGIN)

    label = font(FONT_BODY_SEMI, 22)
    draw.text((MARGIN, 200), "UN MOMENTO QUE MARCÓ EL CAMINO", font=label, fill=OCEAN_300)

    bf = font(FONT_BODY_MED, 36)
    lines = wrap_text(draw, person["moment_short"], bf, SIZE - MARGIN * 2)
    y = 300
    for line in lines[:10]:
        draw.text((MARGIN, y), line, font=bf, fill=WHITE)
        y += 52

    nf = font(FONT_BODY, 24)
    draw.text((MARGIN, 980), person["display_name"], font=nf, fill=OCEAN_200)
    return img


def slide_building(person: dict) -> Image.Image:
    img, draw = base_canvas()
    draw_logo_mark(draw, MARGIN, MARGIN)

    has_build = bool(person.get("building"))
    label = font(FONT_BODY_SEMI, 22)
    draw.text(
        (MARGIN, 200),
        "ESTÁ CONSTRUYENDO" if has_build else "LO QUE MÁS LE GUSTA DE TECH",
        font=label,
        fill=OCEAN_300,
    )

    title_f = font(FONT_DISPLAY_BOLD, 44)
    body = person["building"] if has_build else person["loves"]
    lines = wrap_text(draw, body, title_f, SIZE - MARGIN * 2)
    y = 320
    for line in lines[:8]:
        draw.text((MARGIN, y), line, font=title_f, fill=WHITE)
        y += 58

    if has_build and person.get("loves"):
        y += 40
        sub = font(FONT_BODY_MED, 28)
        draw.text((MARGIN, y), "También dice:", font=sub, fill=OCEAN_300)
        y += 48
        love_lines = wrap_text(draw, person["loves"], sub, SIZE - MARGIN * 2)
        for line in love_lines[:4]:
            draw.text((MARGIN, y), line, font=sub, fill=OCEAN_100)
            y += 40

    nf = font(FONT_BODY, 24)
    draw.text((MARGIN, 980), person["display_name"], font=nf, fill=OCEAN_200)
    return img


def slide_cta(person: dict) -> Image.Image:
    img, draw = base_canvas()
    draw_logo_mark(draw, MARGIN, MARGIN)

    title = font(FONT_DISPLAY_BOLD, 52)
    lines = wrap_text(draw, "Este es el talento de la costa.", title, SIZE - MARGIN * 2)
    y = 280
    for line in lines:
        draw.text((MARGIN, y), line, font=title, fill=WHITE)
        y += 66

    body = font(FONT_BODY_MED, 30)
    y += 20
    for line in wrap_text(
        draw,
        "MdPDev conecta desarrolladores, diseñadores y emprendedores de Mar del Plata.",
        body,
        SIZE - MARGIN * 2,
    ):
        draw.text((MARGIN, y), line, font=body, fill=OCEAN_100)
        y += 42

    y += 50
    # CTA pill
    cta = "Sumate — link en bio"
    cf = font(FONT_BODY_SEMI, 28)
    pad_x, pad_y = 36, 18
    tw = draw.textlength(cta, font=cf)
    box = [MARGIN, y, MARGIN + tw + pad_x * 2, y + 56]
    draw.rounded_rectangle(box, radius=28, fill=OCEAN_400)
    draw.text((MARGIN + pad_x, y + 12), cta, font=cf, fill=OCEAN_900)

    foot = font(FONT_BODY, 22)
    draw.text((MARGIN, 920), f"Spotlight: {person['display_name']}", font=foot, fill=OCEAN_200)
    draw.text((MARGIN, 960), "mardelplata.dev.ar  ·  @mardelplata.dev.ar", font=foot, fill=OCEAN_300)
    draw.text((MARGIN, 1000), "#MdPDev  #MarDelPlata  #TalentoMdP", font=foot, fill=OCEAN_100)
    return img


def main() -> None:
    data = json.loads(APPLICANTS.read_text(encoding="utf-8"))
    people = data["applicants"]
    total = len(people)
    OUT_DOCS.mkdir(parents=True, exist_ok=True)
    OUT_PUBLIC.mkdir(parents=True, exist_ok=True)
    PHOTOS.mkdir(parents=True, exist_ok=True)

    for i, person in enumerate(people, start=1):
        slug = person["slug"]
        print(f"[{i}/{total}] {slug}")
        save_slide(slide_cover(person, i, total), slug, 1, "cover")
        save_slide(slide_quote(person), slug, 2, "quote")
        save_slide(slide_moment(person), slug, 3, "moment")
        save_slide(slide_building(person), slug, 4, "building")
        save_slide(slide_cta(person), slug, 5, "cta")

    print(f"Done. Output → {OUT_DOCS} and {OUT_PUBLIC}")


if __name__ == "__main__":
    main()
