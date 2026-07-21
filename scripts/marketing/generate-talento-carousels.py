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


def draw_mark(draw: ImageDraw.ImageDraw, x: int, y: int, compact: bool = False) -> None:
    s = 36 if compact else 44
    draw.rounded_rectangle([x, y, x + s, y + s], radius=11, fill=OCEAN_400)
    draw.ellipse([x + 8, y + 8, x + s // 2 + 2, y + s // 2 + 6], outline=OCEAN_900, width=2)
    draw.ellipse([x + 12, y + 12, x + 18, y + 18], fill=OCEAN_900)
    f = font(SG_BOLD, 22 if compact else 26)
    draw.text((x + s + 10, y + 6), "MdPDev", font=f, fill=WHITE)


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

    # overlays on photo (no solid header eating space)
    draw.rectangle([0, 0, 16, IG], fill=OCEAN_400)
    draw_mark(draw, 40, 36)
    badge_w = draw_badge(draw, 210, 42, "TALENTO MdP")
    draw.text((210 + badge_w + 16, 50), f"{n:02d}/{total:02d}", font=font(INTER_SEMI, 20), fill=OCEAN_300)

    # name block — bottom heavy, bigger type
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

    # thin bottom kicker overlaid
    kick = font(INTER_SEMI, 22)
    draw.text((50, 1025), "Historias de talento · costa atlántica", font=kick, fill=OCEAN_300)
    return img


def slide_quote(person: dict) -> Image.Image:
    photo = cover_photo(find_photo(person["slug"]), (IG, IG), initials(person["display_name"]))
    base = ImageEnhance.Brightness(photo).enhance(0.32)
    base = ImageEnhance.Contrast(base).enhance(1.12)
    tint = Image.new("RGBA", (IG, IG), (*OCEAN_900, 155))
    img = Image.alpha_composite(base.convert("RGBA"), tint).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, 16, IG], fill=OCEAN_400)
    draw_mark(draw, 40, 36)

    # top label bar
    draw.rectangle([40, 110, IG - 40, 175], fill=OCEAN_700)
    draw.text((60, 130), "SER DEV EN MAR DEL PLATA ES…", font=font(INTER_SEMI, 22), fill=OCEAN_100)

    qmark = font(SG_BOLD, 180)
    draw.text((24, 190), "“", font=qmark, fill=OCEAN_400)

    qf = font(SG_BOLD, 52)
    lines = wrap(draw, person["quote"], qf, IG - 110)
    y = 360
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
    draw_mark(draw, 40, 40)

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
    draw_mark(draw, 40, 40)

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
    draw.text((40, 1015), f"{person['display_name']}  ·  #TalentoMdP", font=font(SG_BOLD, 26), fill=OCEAN_900)
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
    rx = split + 36
    draw_mark(draw, rx, 36)

    title = font(SG_BOLD, 44)
    y = 130
    for line in wrap(draw, "Este es el talento de la costa.", title, IG - rx - 40):
        draw.text((rx, y), line, font=title, fill=WHITE)
        y += 54

    body = font(INTER_MED, 24)
    y += 16
    for line in wrap(draw, "MdPDev conecta devs, diseñadores y emprendedores de Mar del Plata.", body, IG - rx - 40):
        draw.text((rx, y), line, font=body, fill=OCEAN_100)
        y += 34

    # dense info blocks to kill empty space
    y += 36
    draw.rectangle([rx, y, IG - 36, y + 100], fill=OCEAN_700)
    draw.text((rx + 18, y + 22), "Serie", font=font(INTER_SEMI, 18), fill=OCEAN_300)
    draw.text((rx + 18, y + 50), "Talento MdP", font=font(SG_BOLD, 30), fill=WHITE)

    y += 120
    draw.rectangle([rx, y, IG - 36, y + 100], fill=OCEAN_800)
    draw.text((rx + 18, y + 22), "Spotlight", font=font(INTER_SEMI, 18), fill=OCEAN_300)
    draw.text((rx + 18, y + 50), person["display_name"], font=font(SG_BOLD, 28), fill=WHITE)

    y += 130
    cta = "Sumate — link en bio"
    cf = font(INTER_BOLD if INTER_BOLD.exists() else INTER_SEMI, 24)
    tw = draw.textlength(cta, font=cf)
    draw.rounded_rectangle([rx, y, rx + tw + 40, y + 56], radius=14, fill=OCEAN_400)
    draw.text((rx + 20, y + 14), cta, font=cf, fill=OCEAN_900)

    draw.text((rx, 980), "@mardelplata.dev.ar", font=font(INTER_SEMI, 20), fill=OCEAN_300)
    draw.text((rx, 1015), "#MdPDev  #TalentoMdP", font=font(INTER_SEMI, 18), fill=OCEAN_100)

    # name plate over photo
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

    draw_mark(draw, 48, 36)
    badge_w = draw_badge(draw, 200, 42, "TALENTO MdP")
    draw.text((200 + badge_w + 16, 50), f"{n:02d}/{total:02d}", font=font(INTER_SEMI, 18), fill=OCEAN_300)

    name_f = font(SG_BOLD, 72)
    y = 140
    for line in wrap(draw, person["display_name"], name_f, 700)[:2]:
        draw.text((48, y), line, font=name_f, fill=WHITE)
        y += 80

    role_f = font(INTER_MED, 30)
    rw = draw.textlength(person["role"], font=role_f)
    draw.rounded_rectangle([48, y + 4, 48 + rw + 36, y + 56], radius=12, fill=OCEAN_400)
    draw.text((66, y + 14), person["role"], font=role_f, fill=OCEAN_900)

    # quote block fills middle
    y += 90
    draw.rectangle([48, y, 740, y + 280], fill=OCEAN_800)
    draw.text((68, y + 10), "“", font=font(SG_BOLD, 72), fill=OCEAN_400)
    qf = font(SG_BOLD, 34)
    qy = y + 80
    for line in wrap(draw, person["quote"], qf, 640)[:5]:
        draw.text((68, qy), line, font=qf, fill=WHITE)
        qy += 44

    draw.rectangle([0, 820, 780, X_H], fill=OCEAN_400)
    draw.text((48, 848), "mardelplata.dev.ar   ·   #MdPDev   ·   #TalentoMdP", font=font(SG_BOLD, 26), fill=OCEAN_900)
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
