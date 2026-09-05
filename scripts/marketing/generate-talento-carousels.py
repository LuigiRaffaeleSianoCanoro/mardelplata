#!/usr/bin/env python3
"""
Talento MdP — carrouseles v2 (punchy, densos).

Cambios vs v1:
- Foto a sangre (edge-to-edge) en cover/quote
- Tipografía más grande, menos aire vacío
- Barras/paneles de color que ocupan el frame
- También genera card X 1600×900
- Skip: ian-genta, day-aloy (publicados)

Uso:
  python3 scripts/marketing/generate-talento-carousels.py
"""

from __future__ import annotations

import json
import math
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
CAMPAIGN = ROOT / "docs/marketing/campaigns/talento-mdp-2026"
PHOTOS = CAMPAIGN / "photos"
OUT_DOCS = CAMPAIGN / "carousels"
OUT_PUBLIC = ROOT / "public/campaigns/talento-mdp-2026"
OUT_X = CAMPAIGN / "cards-x"
OUT_PUBLIC_X = ROOT / "public/campaigns/talento-mdp-2026/cards-x"
APPLICANTS = CAMPAIGN / "applicants.json"

SKIP = {"ian-genta", "day-aloy"}

IG = 1080
X_W, X_H = 1600, 900

OCEAN_900 = (2, 0, 48)
OCEAN_800 = (3, 4, 94)
OCEAN_700 = (2, 62, 138)
OCEAN_600 = (0, 119, 182)
OCEAN_400 = (0, 180, 216)
OCEAN_300 = (72, 202, 228)
OCEAN_100 = (173, 232, 244)
SAND = (233, 213, 160)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

FONT_DIR = Path("/tmp/fonts")
SG_BOLD = FONT_DIR / "SpaceGrotesk-Bold.ttf"
SG_MED = FONT_DIR / "SpaceGrotesk-Medium.ttf"
INTER = Path("/usr/share/fonts/truetype/macos/Inter-Regular.ttf")
INTER_MED = Path("/usr/share/fonts/truetype/macos/Inter-Medium.ttf")
INTER_SEMI = Path("/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf")
INTER_BOLD = Path("/usr/share/fonts/truetype/macos/Inter-Bold.ttf")
FALLBACK_B = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
FALLBACK = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")


def ensure_fonts() -> None:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    mapping = {
        SG_BOLD: "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf",
        SG_MED: "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-500-normal.ttf",
    }
    for path, url in mapping.items():
        if path.exists() and path.read_bytes()[:4] == b"\x00\x01\x00\x00":
            continue
        urllib.request.urlretrieve(url, path)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    ensure_fonts()
    if path.exists():
        return ImageFont.truetype(str(path), size)
    fb = FALLBACK_B if any(x in path.name for x in ("Bold", "Semi", "Medium")) else FALLBACK
    return ImageFont.truetype(str(fb), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words = text.replace("\n", " ").split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def find_photo(slug: str) -> Path | None:
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"):
        p = PHOTOS / f"{slug}{ext}"
        if p.exists():
            return p
    return None


def initials(name: str) -> str:
    parts = [p for p in name.replace("/", " ").split() if p and p[0].isalnum()]
    if not parts:
        return "?"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return (parts[0][0] + parts[-1][0]).upper()


def cover_photo(path: Path | None, size: tuple[int, int], initials_txt: str) -> Image.Image:
    w, h = size
    if path:
        img = Image.open(path).convert("RGB")
        img = ImageOps.exif_transpose(img)
        # Smart-ish center crop to fill
        img = ImageOps.fit(img, (w, h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.35))
        # Slight contrast punch
        img = ImageEnhance.Contrast(img).enhance(1.08)
        img = ImageEnhance.Color(img).enhance(1.06)
        return img
    # Fallback gradient + initials
    img = Image.new("RGB", (w, h), OCEAN_800)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        col = (
            int(OCEAN_900[0] + (OCEAN_600[0] - OCEAN_900[0]) * t * 0.5),
            int(OCEAN_900[1] + (OCEAN_600[1] - OCEAN_900[1]) * t * 0.5),
            int(OCEAN_900[2] + (OCEAN_600[2] - OCEAN_900[2]) * t * 0.5),
        )
        d.line([(0, y), (w, y)], fill=col)
    f = font(SG_BOLD, min(w, h) // 4)
    bbox = d.textbbox((0, 0), initials_txt, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text(((w - tw) / 2, (h - th) / 2 - 20), initials_txt, font=f, fill=WHITE)
    return img


def darken_bottom(base: Image.Image, strength: float = 0.92) -> Image.Image:
    """Gradient overlay: transparent top → near-black bottom."""
    w, h = base.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = overlay.load()
    for y in range(h):
        # start darkening from ~35%
        t = max(0.0, (y / h - 0.28) / 0.72)
        a = int(255 * strength * (t**1.35))
        for x in range(w):
            # also slight left-right vignette
            vx = abs(x - w / 2) / (w / 2)
            aa = min(255, int(a + vx * 25 * t))
            px[x, y] = (2, 0, 40, aa)
    return Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")


def ocean_panel(size: tuple[int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", (w, h), OCEAN_900)
    d = ImageDraw.Draw(img)
    # diagonal glow
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([int(w * 0.4), -int(h * 0.2), int(w * 1.2), int(h * 0.55)], fill=(*OCEAN_600, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    # wave lines bottom
    d = ImageDraw.Draw(img)
    for i, y0 in enumerate((h - 90, h - 55, h - 25)):
        pts = [(x, y0 + int(math.sin(x / 48 + i) * (8 + i * 3))) for x in range(0, w + 1, 6)]
        muted = (20, 70, 120)
        d.line(pts, fill=muted, width=2)
    return img


LOGO_PATH = ROOT / "public/mdpdev.png"
BRAND = "MarDelPlata.Dev.AR"


def load_logo(size: int) -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    # Official circular seal — sea lion + MARDELPLATA.DEV.AR
    return logo.resize((size, size), Image.Resampling.LANCZOS)


def paste_logo(img: Image.Image, x: int, y: int, size: int = 72) -> None:
    logo = load_logo(size)
    img.paste(logo, (x, y), logo)


def draw_brand_text(draw: ImageDraw.ImageDraw, x: int, y: int, size: int = 22, fill=WHITE) -> None:
    f = font(SG_BOLD, size)
    draw.text((x, y), BRAND, font=f, fill=fill)


def draw_badge(draw: ImageDraw.ImageDraw, x: int, y: int, text: str) -> int:
    f = font(INTER_SEMI, 18)
    tw = draw.textlength(text, font=f)
    pad_x, pad_y = 16, 10
    draw.rounded_rectangle([x, y, x + tw + pad_x * 2, y + 36], radius=8, fill=OCEAN_400)
    draw.text((x + pad_x, y + 8), text, font=f, fill=OCEAN_900)
    return int(tw + pad_x * 2)


def save(img: Image.Image, slug: str, index: int, name: str) -> None:
    for base in (OUT_DOCS / slug, OUT_PUBLIC / slug):
        base.mkdir(parents=True, exist_ok=True)
        img.save(base / f"{index:02d}-{name}.png", "PNG", optimize=True)


def slide_cover(person: dict, n: int, total: int) -> Image.Image:
    photo = cover_photo(find_photo(person["slug"]), (IG, IG), initials(person["display_name"]))
    img = darken_bottom(photo, 0.97)
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, 16, IG], fill=OCEAN_400)
    paste_logo(img, 36, 28, 78)
    badge_w = draw_badge(draw, 130, 48, "TALENTO")
    draw.text((130 + badge_w + 14, 56), f"{n:02d}/{total:02d}", font=font(INTER_SEMI, 20), fill=OCEAN_300)

    name_f = font(SG_BOLD, 92)
    role_f = font(INTER_MED, 32)
    name = person["display_name"]
    lines = wrap(draw, name, name_f, IG - 90)
    y = 680
    for line in lines[:2]:
        draw.text((54, y + 4), line, font=name_f, fill=BLACK)
        draw.text((50, y), line, font=name_f, fill=WHITE)
        y += 96

    role = person["role"]
    rw = draw.textlength(role, font=role_f)
    draw.rounded_rectangle([50, y + 4, 50 + rw + 40, y + 60], radius=12, fill=OCEAN_400)
    draw.text((70, y + 16), role, font=role_f, fill=OCEAN_900)

    kick = font(INTER_SEMI, 20)
    draw.text((50, 1025), f"{BRAND}  ·  historias de la costa", font=kick, fill=OCEAN_300)
    return img


def slide_quote(person: dict) -> Image.Image:
    photo = cover_photo(find_photo(person["slug"]), (IG, IG), initials(person["display_name"]))
    base = ImageEnhance.Brightness(photo).enhance(0.32)
    base = ImageEnhance.Contrast(base).enhance(1.12)
    tint = Image.new("RGBA", (IG, IG), (*OCEAN_900, 155))
    img = Image.alpha_composite(base.convert("RGBA"), tint).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, 16, IG], fill=OCEAN_400)
    paste_logo(img, 36, 28, 72)

    draw.rectangle([40, 120, IG - 40, 185], fill=OCEAN_700)
    draw.text((60, 140), "SER DEV EN MAR DEL PLATA ES…", font=font(INTER_SEMI, 22), fill=OCEAN_100)

    qmark = font(SG_BOLD, 180)
    draw.text((24, 200), "“", font=qmark, fill=OCEAN_400)

    qf = font(SG_BOLD, 52)
    lines = wrap(draw, person["quote"], qf, IG - 110)
    y = 370
    for line in lines[:7]:
        draw.text((44, y + 3), line, font=qf, fill=BLACK)
        draw.text((40, y), line, font=qf, fill=WHITE)
        y += 64

    draw.rectangle([0, 960, IG, IG], fill=OCEAN_400)
    draw.text((40, 990), person["display_name"], font=font(SG_BOLD, 36), fill=OCEAN_900)
    draw.text((40, 1035), person["role"], font=font(INTER_MED, 22), fill=OCEAN_800)
    return img


def slide_moment(person: dict) -> Image.Image:
    img = ocean_panel((IG, IG))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 14, IG], fill=OCEAN_400)
    paste_logo(img, 36, 28, 72)

    # big label block
    draw.rectangle([40, 140, IG - 40, 230], fill=OCEAN_700)
    lab = font(INTER_SEMI, 24)
    draw.text((60, 168), "EL MOMENTO QUE MARCÓ EL CAMINO", font=lab, fill=OCEAN_100)

    body = font(INTER_MED, 36)
    lines = wrap(draw, person["moment_short"], body, IG - 120)
    y = 280
    for line in lines[:9]:
        draw.text((50, y), line, font=body, fill=WHITE)
        y += 50

    # photo inset bottom-right if available
    ph = find_photo(person["slug"])
    if ph:
        thumb = cover_photo(ph, (280, 280), initials(person["display_name"]))
        # circle mask
        mask = Image.new("L", (280, 280), 0)
        ImageDraw.Draw(mask).ellipse([0, 0, 279, 279], fill=255)
        canvas = Image.new("RGBA", (IG, IG), (0, 0, 0, 0))
        canvas.paste(thumb, (IG - 320, IG - 340), mask)
        # ring
        rd = ImageDraw.Draw(canvas)
        rd.ellipse([IG - 326, IG - 346, IG - 34, IG - 54], outline=(*OCEAN_400, 255), width=6)
        img = Image.alpha_composite(img.convert("RGBA"), canvas).convert("RGB")
        draw = ImageDraw.Draw(img)

    nf = font(SG_BOLD, 28)
    draw.text((50, 1000), person["display_name"], font=nf, fill=OCEAN_300)
    return img


def slide_building(person: dict) -> Image.Image:
    img = ocean_panel((IG, IG))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 14, IG], fill=OCEAN_400)
    paste_logo(img, 36, 28, 72)

    has = bool(person.get("building"))
    lab = font(INTER_SEMI, 22)
    draw.text((40, 130), "ESTÁ CONSTRUYENDO" if has else "LO QUE LO MUEVE", font=lab, fill=OCEAN_300)

    # massive title
    title = person["building"] if has else person["loves"]
    tf = font(SG_BOLD, 52)
    lines = wrap(draw, title, tf, IG - 100)
    y = 200
    for line in lines[:6]:
        draw.text((42, y + 2), line, font=tf, fill=BLACK)
        draw.text((40, y), line, font=tf, fill=WHITE)
        y += 64

    # accent rule
    draw.rectangle([40, y + 10, 200, y + 18], fill=OCEAN_400)

    if has and person.get("loves"):
        y += 50
        sub = font(INTER_MED, 28)
        draw.text((40, y), "También dice:", font=sub, fill=OCEAN_300)
        y += 44
        for line in wrap(draw, person["loves"], sub, IG - 100)[:4]:
            draw.text((40, y), line, font=sub, fill=OCEAN_100)
            y += 38

    # bottom strip
    draw.rectangle([0, 990, IG, IG], fill=OCEAN_400)
    draw.text((40, 1015), f"{person['display_name']}  ·  {BRAND}", font=font(SG_BOLD, 22), fill=OCEAN_900)
    return img


def slide_cta(person: dict) -> Image.Image:
    # 58% photo / 42% brand — denser right column
    split = 620
    img = Image.new("RGB", (IG, IG), OCEAN_900)
    ph = find_photo(person["slug"])
    left = cover_photo(ph, (split, IG), initials(person["display_name"]))
    left = darken_bottom(left, 0.5)
    img.paste(left, (0, 0))
    right = ocean_panel((IG - split, IG))
    img.paste(right, (split, 0))
    draw = ImageDraw.Draw(img)

    draw.rectangle([split - 10, 0, split + 10, IG], fill=OCEAN_400)
    rx = split + 28
    paste_logo(img, rx, 28, 70)

    title = font(SG_BOLD, 40)
    y = 120
    for line in wrap(draw, "Este es el talento de la costa.", title, IG - rx - 36):
        draw.text((rx, y), line, font=title, fill=WHITE)
        y += 50

    body = font(INTER_MED, 22)
    y += 12
    for line in wrap(draw, f"{BRAND} conecta devs, diseñadores y emprendedores de Mar del Plata.", body, IG - rx - 36):
        draw.text((rx, y), line, font=body, fill=OCEAN_100)
        y += 32

    y += 28
    draw.rectangle([rx, y, IG - 36, y + 88], fill=OCEAN_700)
    draw.text((rx + 16, y + 18), "Serie", font=font(INTER_SEMI, 16), fill=OCEAN_300)
    draw.text((rx + 16, y + 44), "Talento", font=font(SG_BOLD, 28), fill=WHITE)

    y += 106
    draw.rectangle([rx, y, IG - 36, y + 88], fill=OCEAN_800)
    draw.text((rx + 16, y + 18), "Spotlight", font=font(INTER_SEMI, 16), fill=OCEAN_300)
    draw.text((rx + 16, y + 44), person["display_name"], font=font(SG_BOLD, 26), fill=WHITE)

    y += 116
    cta = "Sumate — link en bio"
    cf = font(INTER_BOLD if INTER_BOLD.exists() else INTER_SEMI, 22)
    tw = draw.textlength(cta, font=cf)
    draw.rounded_rectangle([rx, y, rx + tw + 36, y + 52], radius=14, fill=OCEAN_400)
    draw.text((rx + 18, y + 14), cta, font=cf, fill=OCEAN_900)

    draw.text((rx, 980), BRAND, font=font(INTER_SEMI, 18), fill=OCEAN_300)
    draw.text((rx, 1012), "#MarDelPlata  #Talento", font=font(INTER_SEMI, 16), fill=OCEAN_100)

    draw.rectangle([0, 900, split - 10, IG], fill=OCEAN_900)
    draw.text((36, 940), person["display_name"], font=font(SG_BOLD, 36), fill=WHITE)
    draw.text((36, 995), person["role"], font=font(INTER_MED, 24), fill=OCEAN_300)
    return img


def card_x(person: dict, n: int, total: int) -> Image.Image:
    """Single punchy 16:9 card for X — photo-dominant, dense left stack."""
    photo = cover_photo(find_photo(person["slug"]), (X_W, X_H), initials(person["display_name"]))
    img = darken_bottom(photo, 0.88)
    panel = Image.new("RGBA", (X_W, X_H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(panel)
    pd.rectangle([0, 0, 780, X_H], fill=(*OCEAN_900, 225))
    pd.rectangle([780, 0, 798, X_H], fill=(*OCEAN_400, 255))
    img = Image.alpha_composite(img.convert("RGBA"), panel).convert("RGB")
    draw = ImageDraw.Draw(img)

    paste_logo(img, 40, 28, 72)
    badge_w = draw_badge(draw, 130, 48, "TALENTO")
    draw.text((130 + badge_w + 14, 56), f"{n:02d}/{total:02d}", font=font(INTER_SEMI, 18), fill=OCEAN_300)

    name_f = font(SG_BOLD, 72)
    y = 140
    for line in wrap(draw, person["display_name"], name_f, 700)[:2]:
        draw.text((48, y), line, font=name_f, fill=WHITE)
        y += 80

    role_f = font(INTER_MED, 30)
    rw = draw.textlength(person["role"], font=role_f)
    draw.rounded_rectangle([48, y + 4, 48 + rw + 36, y + 56], radius=12, fill=OCEAN_400)
    draw.text((66, y + 14), person["role"], font=role_f, fill=OCEAN_900)

    y += 90
    draw.rectangle([48, y, 740, y + 280], fill=OCEAN_800)
    draw.text((68, y + 10), "“", font=font(SG_BOLD, 72), fill=OCEAN_400)
    qf = font(SG_BOLD, 34)
    qy = y + 80
    for line in wrap(draw, person["quote"], qf, 640)[:5]:
        draw.text((68, qy), line, font=qf, fill=WHITE)
        qy += 44

    draw.rectangle([0, 820, 780, X_H], fill=OCEAN_400)
    draw.text((48, 848), f"{BRAND}   ·   #MarDelPlata   ·   #Talento", font=font(SG_BOLD, 24), fill=OCEAN_900)
    return img


def manu_photo(size: tuple[int, int]) -> Image.Image:
    """Tighter Manu crop: face stays visible instead of leaving a sky-heavy frame."""
    source = Image.open(PHOTOS / "manu-ponsa.jpg").convert("RGB")
    source = ImageOps.exif_transpose(source)
    return ImageOps.fit(source, size, method=Image.Resampling.LANCZOS, centering=(0.58, 0.66))


def manu_header(img: Image.Image, label: str, number: str) -> ImageDraw.ImageDraw:
    draw = ImageDraw.Draw(img)
    paste_logo(img, 38, 34, 70)
    draw_badge(draw, 128, 52, label)
    draw.text((IG - 130, 60), number, font=font(INTER_SEMI, 19), fill=OCEAN_300)
    return draw


def manu_v3_cover() -> Image.Image:
    """Editorial cover: Manu + products, with photo as a compositional asset."""
    img = ocean_panel((IG, IG))
    draw = manu_header(img, "TALENTO", "01/05")

    # Photo takes the right side, framed by an angular cyan edge.
    photo = manu_photo((510, 870))
    img.paste(photo, (570, 160))
    overlay = Image.new("RGBA", (510, 870), (2, 0, 48, 0))
    od = ImageDraw.Draw(overlay)
    od.rectangle([0, 630, 510, 870], fill=(*OCEAN_900, 220))
    img.paste(Image.alpha_composite(photo.convert("RGBA"), overlay).convert("RGB"), (570, 160))
    draw = ImageDraw.Draw(img)
    draw.polygon([(535, 160), (570, 160), (570, 1030), (535, 1030)], fill=OCEAN_400)

    draw.text((44, 205), "MANU", font=font(SG_BOLD, 128), fill=WHITE)
    draw.text((44, 330), "PONSA", font=font(SG_BOLD, 128), fill=OCEAN_400)
    draw.rectangle([44, 485, 440, 493], fill=SAND)
    draw.text((44, 525), "SOFTWARE", font=font(SG_BOLD, 39), fill=WHITE)
    draw.text((44, 570), "+ DATA", font=font(SG_BOLD, 39), fill=WHITE)

    body = font(INTER_MED, 27)
    for i, line in enumerate(wrap(draw, "Construye productos para quienes crean y empresas que necesitan decidir mejor.", body, 460)[:4]):
        draw.text((44, 660 + i * 37), line, font=body, fill=OCEAN_100)

    draw.rectangle([0, 935, 535, IG], fill=OCEAN_700)
    draw.text((44, 960), "PICSEL", font=font(SG_BOLD, 35), fill=WHITE)
    draw.text((44, 1005), "+ BLUEPRINT DATA", font=font(INTER_SEMI, 21), fill=OCEAN_100)
    return img


def manu_v3_picsel() -> Image.Image:
    img = Image.new("RGB", (IG, IG), OCEAN_400)
    draw = manu_header(img, "PICSEL", "02/05")
    # Make header readable on cyan.
    draw.rectangle([0, 0, IG, 130], fill=OCEAN_900)
    paste_logo(img, 38, 30, 70)
    draw_badge(draw, 128, 48, "PICSEL")
    draw.text((IG - 130, 60), "02/05", font=font(INTER_SEMI, 19), fill=OCEAN_300)

    draw.text((44, 190), "FOTOS", font=font(SG_BOLD, 110), fill=OCEAN_900)
    draw.text((44, 290), "QUE", font=font(SG_BOLD, 110), fill=OCEAN_900)
    draw.text((44, 390), "VIVEN", font=font(SG_BOLD, 110), fill=OCEAN_900)
    draw.text((44, 490), "MEJOR.", font=font(SG_BOLD, 110), fill=WHITE)

    # Editorial picture tile, not a generic circular avatar.
    photo = manu_photo((410, 410))
    img.paste(photo, (625, 170))
    draw = ImageDraw.Draw(img)
    draw.rectangle([605, 150, 1035, 170], fill=OCEAN_900)
    draw.rectangle([605, 150, 625, 580], fill=OCEAN_900)
    draw.rectangle([625, 580, 1035, 600], fill=OCEAN_900)

    draw.rectangle([44, 650, IG - 44, 900], fill=OCEAN_900)
    title = font(SG_BOLD, 45)
    draw.text((74, 690), "PICSEL", font=title, fill=OCEAN_300)
    body = font(INTER_MED, 30)
    for i, line in enumerate(wrap(draw, "Una plataforma para fotógrafos latinoamericanos.", body, 880)[:3]):
        draw.text((74, 760 + i * 39), line, font=body, fill=WHITE)

    draw.text((44, 970), "Construido desde Mar del Plata para LATAM.", font=font(INTER_SEMI, 24), fill=OCEAN_900)
    return img


def manu_v3_blueprint() -> Image.Image:
    img = ocean_panel((IG, IG))
    draw = manu_header(img, "DATA", "03/05")
    draw.text((44, 190), "DATOS", font=font(SG_BOLD, 104), fill=WHITE)
    draw.text((44, 285), "QUE", font=font(SG_BOLD, 104), fill=WHITE)
    draw.text((44, 380), "MUEVEN", font=font(SG_BOLD, 104), fill=OCEAN_400)
    draw.text((44, 475), "NEGOCIOS.", font=font(SG_BOLD, 88), fill=OCEAN_400)

    # Data-system visual language: real information blocks, no empty filler.
    cards = [
        ("01", "FUENTES", "Todo conectado."),
        ("02", "MODELOS", "Todo entendible."),
        ("03", "DECISIONES", "Todo accionable."),
    ]
    y = 570
    for num, label, desc in cards:
        draw.rectangle([44, y, 1036, y + 102], fill=OCEAN_800)
        draw.rectangle([44, y, 130, y + 102], fill=OCEAN_400)
        draw.text((66, y + 33), num, font=font(SG_BOLD, 28), fill=OCEAN_900)
        draw.text((160, y + 20), label, font=font(INTER_SEMI, 21), fill=OCEAN_300)
        draw.text((160, y + 53), desc, font=font(SG_BOLD, 31), fill=WHITE)
        y += 116

    draw.text((44, 946), "BLUEPRINT DATA", font=font(SG_BOLD, 39), fill=WHITE)
    draw.text((44, 997), "Plataformas de datos end-to-end.", font=font(INTER_MED, 25), fill=OCEAN_100)
    return img


def manu_v3_city() -> Image.Image:
    photo = manu_photo((IG, IG))
    photo = ImageEnhance.Contrast(photo).enhance(1.2)
    tint = Image.new("RGBA", (IG, IG), (*OCEAN_900, 165))
    img = Image.alpha_composite(photo.convert("RGBA"), tint).convert("RGB")
    draw = manu_header(img, "MAR DEL PLATA", "04/05")

    quote = ["EL TALENTO", "TECH NO", "TERMINA", "EN LA", "ORILLA."]
    y = 220
    for index, line in enumerate(quote):
        color = OCEAN_400 if index in (0, 4) else WHITE
        draw.text((42, y), line, font=font(SG_BOLD, 105), fill=color)
        y += 106

    draw.rectangle([0, 825, IG, IG], fill=OCEAN_400)
    body = font(INTER_SEMI, 30)
    draw.text((42, 860), "Construye local. Impacta global.", font=body, fill=OCEAN_900)
    draw.text((42, 920), "Manu eligió la costa para construir.", font=body, fill=OCEAN_900)
    return img


def manu_v3_cta() -> Image.Image:
    img = Image.new("RGB", (IG, IG), OCEAN_900)
    draw = manu_header(img, "CONEXIONES", "05/05")

    draw.text((44, 200), "¿QUÉ", font=font(SG_BOLD, 114), fill=WHITE)
    draw.text((44, 305), "ESTÁS", font=font(SG_BOLD, 114), fill=WHITE)
    draw.text((44, 410), "CONSTRUYENDO", font=font(SG_BOLD, 77), fill=OCEAN_400)
    draw.text((44, 485), "VOS?", font=font(SG_BOLD, 114), fill=OCEAN_400)

    draw.rectangle([44, 590, IG - 44, 780], fill=OCEAN_700)
    body = font(INTER_MED, 31)
    for i, line in enumerate(wrap(draw, "En Mar del Plata hay personas, productos e ideas para conectar.", body, 890)[:3]):
        draw.text((76, 630 + i * 39), line, font=body, fill=WHITE)

    cta = "SUMATE A LA COMUNIDAD"
    cta_f = font(SG_BOLD, 27)
    cta_w = draw.textlength(cta, font=cta_f)
    draw.rounded_rectangle([44, 840, 44 + cta_w + 54, 902], radius=18, fill=OCEAN_400)
    draw.text((71, 857), cta, font=cta_f, fill=OCEAN_900)
    draw.text((44, 968), BRAND, font=font(SG_BOLD, 29), fill=WHITE)
    draw.text((44, 1015), "mardelplata.dev.ar", font=font(INTER_MED, 25), fill=OCEAN_300)
    return img


def save_manu_v3() -> None:
    """Dedicated campaign direction for Manu, intentionally unlike the generic spotlight template."""
    slides = [
        (manu_v3_cover(), "01-cover"),
        (manu_v3_picsel(), "02-picsel"),
        (manu_v3_blueprint(), "03-blueprint-data"),
        (manu_v3_city(), "04-mar-del-plata"),
        (manu_v3_cta(), "05-cta"),
    ]
    for base in (OUT_DOCS / "manu-ponsa", OUT_PUBLIC / "manu-ponsa"):
        base.mkdir(parents=True, exist_ok=True)
        for old_file in base.glob("*.png"):
            old_file.unlink()
        for image, filename in slides:
            image.save(base / f"{filename}.png", "PNG", optimize=True)


def manu_v3_x() -> Image.Image:
    """X adaptation of the new Manu art direction."""
    img = Image.new("RGB", (X_W, X_H), OCEAN_900)
    photo = manu_photo((740, X_H))
    img.paste(photo, (860, 0))
    shade = Image.new("RGBA", (740, X_H), (*OCEAN_900, 85))
    img.paste(Image.alpha_composite(photo.convert("RGBA"), shade).convert("RGB"), (860, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([820, 0, 860, X_H], fill=OCEAN_400)
    paste_logo(img, 46, 42, 78)
    draw_badge(draw, 150, 62, "TALENTO")

    draw.text((48, 182), "MANU", font=font(SG_BOLD, 116), fill=WHITE)
    draw.text((48, 302), "PONSA", font=font(SG_BOLD, 116), fill=OCEAN_400)
    draw.text((48, 455), "SOFTWARE + DATA", font=font(SG_BOLD, 45), fill=WHITE)
    for i, line in enumerate(wrap(draw, "Construye productos para quienes crean y empresas que necesitan decidir mejor.", font(INTER_MED, 31), 690)[:3]):
        draw.text((48, 530 + i * 43), line, font=font(INTER_MED, 31), fill=OCEAN_100)
    draw.rectangle([48, 730, 770, 810], fill=OCEAN_700)
    draw.text((76, 755), "PICSEL  +  BLUEPRINT DATA", font=font(SG_BOLD, 31), fill=WHITE)
    draw.text((48, 848), f"{BRAND}  ·  Mar del Plata tiene talento tech.", font=font(INTER_SEMI, 23), fill=OCEAN_300)
    return img


def main() -> None:
    data = json.loads(APPLICANTS.read_text(encoding="utf-8"))
    people = [p for p in data["applicants"] if p["slug"] not in SKIP]
    total = len(people)
    for base in (OUT_DOCS, OUT_PUBLIC, OUT_X, OUT_PUBLIC_X):
        base.mkdir(parents=True, exist_ok=True)

    # clean skipped folders from public output? keep but regenerate only active
    for i, person in enumerate(people, start=1):
        slug = person["slug"]
        print(f"[{i}/{total}] {slug}  photo={'yes' if find_photo(slug) else 'NO'}")
        if slug == "manu-ponsa":
            save_manu_v3()
            xcard = manu_v3_x()
            for base in (OUT_X, OUT_PUBLIC_X):
                base.mkdir(parents=True, exist_ok=True)
                xcard.save(base / f"{slug}.png", "PNG", optimize=True)
            continue
        save(slide_cover(person, i, total), slug, 1, "cover")
        save(slide_quote(person), slug, 2, "quote")
        save(slide_moment(person), slug, 3, "moment")
        save(slide_building(person), slug, 4, "building")
        save(slide_cta(person), slug, 5, "cta")
        xcard = card_x(person, i, total)
        for base in (OUT_X, OUT_PUBLIC_X):
            base.mkdir(parents=True, exist_ok=True)
            xcard.save(base / f"{slug}.png", "PNG", optimize=True)

    # remove skipped from active public dirs to avoid confusion
    for slug in SKIP:
        for base in (OUT_DOCS / slug, OUT_PUBLIC / slug):
            if base.exists():
                for f in base.glob("*.png"):
                    f.unlink()
                # leave empty dir ok

    print(f"Done v2. Active: {total}. Docs → {OUT_DOCS}")


if __name__ == "__main__":
    main()
