#!/usr/bin/env python3
"""
Talento — Manu Ponsa · spotlight v4 (dirección editorial premium).

Fondos generados por IA en backgrounds/ + composición tipográfica precisa.
Datos verificados (picsel.app, blueprintdata.xyz, LinkedIn):
- 10+ años: Mercado Libre → belo → Decentraland → founder
- Picsel (Mar del Plata, 2023): venta de fotos, face search AI, Stripe global
- Blueprint Data (2024): data foundations, open source, Google Cloud Partner
Quote textual del form: "Ser dev en Mar del Plata es… lo mejor del mundo".

Uso:
  python3 scripts/marketing/generate-manu-spotlight.py
"""

from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
CAMPAIGN = ROOT / "docs/marketing/campaigns/talento-mdp-2026"
BACKGROUNDS = CAMPAIGN / "backgrounds"
PHOTO = CAMPAIGN / "photos/manu-ponsa.jpg"
LOGO = ROOT / "public/mdpdev.png"

OUT_DIRS = [CAMPAIGN / "carousels/manu-ponsa", ROOT / "public/campaigns/talento-mdp-2026/manu-ponsa"]
OUT_X_DIRS = [CAMPAIGN / "cards-x", ROOT / "public/campaigns/talento-mdp-2026/cards-x"]

IG = 1080
X_W, X_H = 1600, 900

OCEAN_900 = (2, 0, 48)
OCEAN_700 = (2, 62, 138)
OCEAN_400 = (0, 180, 216)
OCEAN_300 = (72, 202, 228)
OCEAN_100 = (173, 232, 244)
SAND = (233, 213, 160)
WHITE = (255, 255, 255)

BRAND = "MarDelPlata.Dev.AR"

FONT_DIR = Path("/tmp/fonts")
SG_BOLD = FONT_DIR / "SpaceGrotesk-Bold.ttf"
INTER = Path("/usr/share/fonts/truetype/macos/Inter-Regular.ttf")
INTER_MED = Path("/usr/share/fonts/truetype/macos/Inter-Medium.ttf")
INTER_SEMI = Path("/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf")


def ensure_fonts() -> None:
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    url = "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.ttf"
    if not (SG_BOLD.exists() and SG_BOLD.read_bytes()[:4] == b"\x00\x01\x00\x00"):
        urllib.request.urlretrieve(url, SG_BOLD)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    ensure_fonts()
    return ImageFont.truetype(str(path), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
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


def bg(name: str, size: tuple[int, int]) -> Image.Image:
    img = Image.open(BACKGROUNDS / name).convert("RGB")
    return ImageOps.fit(img, size, method=Image.Resampling.LANCZOS)


def logo(size: int) -> Image.Image:
    return Image.open(LOGO).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)


def header(img: Image.Image, kicker: str, num: str, width: int = IG) -> ImageDraw.ImageDraw:
    draw = ImageDraw.Draw(img)
    lg = logo(72)
    img.paste(lg, (44, 36), lg)
    kf = font(INTER_SEMI, 19)
    kw = draw.textlength(kicker, font=kf)
    draw.rounded_rectangle([134, 52, 134 + kw + 34, 92], radius=20, fill=OCEAN_400)
    draw.text((151, 61), kicker, font=kf, fill=OCEAN_900)
    draw.text((width - 118, 58), num, font=font(INTER_SEMI, 20), fill=OCEAN_300)
    return draw


def photo_card(size: tuple[int, int], radius: int = 28, centering=(0.55, 0.42)) -> Image.Image:
    """Manu framed as a rounded card with cyan ring + soft shadow."""
    w, h = size
    photo = Image.open(PHOTO).convert("RGB")
    photo = ImageOps.exif_transpose(photo)
    photo = ImageOps.fit(photo, (w, h), method=Image.Resampling.LANCZOS, centering=centering)
    photo = ImageEnhance.Contrast(photo).enhance(1.06)
    photo = ImageEnhance.Color(photo).enhance(1.05)

    pad = 26
    card = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    # soft shadow
    shadow = Image.new("RGBA", card.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([pad + 6, pad + 10, pad + w + 6, pad + h + 10], radius=radius, fill=(0, 0, 10, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    card = Image.alpha_composite(card, shadow)
    # photo with rounded mask
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=255)
    card.paste(photo, (pad, pad), mask)
    # ring
    ImageDraw.Draw(card).rounded_rectangle([pad, pad, pad + w - 1, pad + h - 1], radius=radius, outline=(*OCEAN_400, 255), width=5)
    return card


def footer(draw: ImageDraw.ImageDraw, y: int = 1016) -> None:
    draw.text((44, y), BRAND, font=font(SG_BOLD, 22), fill=WHITE)
    tw = draw.textlength("Mar del Plata tiene talento tech", font=font(INTER_MED, 20))
    draw.text((IG - 44 - tw, y + 2), "Mar del Plata tiene talento tech", font=font(INTER_MED, 20), fill=OCEAN_300)


# ── Slide 1 · Cover ─────────────────────────────────────────────────────────

def slide_cover() -> Image.Image:
    img = bg("bg-cover.png", (IG, IG))
    draw = header(img, "TALENTO", "01/05")

    card = photo_card((430, 520))
    img.paste(card, (600, 148), card)
    draw = ImageDraw.Draw(img)

    draw.text((44, 200), "MANU", font=font(SG_BOLD, 116), fill=WHITE)
    draw.text((44, 316), "PONSA", font=font(SG_BOLD, 116), fill=OCEAN_400)
    draw.rectangle([48, 462, 380, 469], fill=SAND)
    draw.text((44, 496), "Software & Data Engineer", font=font(INTER_SEMI, 30), fill=WHITE)
    draw.text((44, 544), "Co-founder · Picsel + Blueprint Data", font=font(INTER_MED, 25), fill=OCEAN_100)

    # trayectoria strip — real career data, dark chips with cyan chevrons
    draw.text((44, 654), "TRAYECTORIA", font=font(INTER_SEMI, 19), fill=OCEAN_300)
    rows = [["MERCADO LIBRE", "BELO", "DECENTRALAND"], ["FOUNDER · PICSEL + BLUEPRINT DATA"]]
    sf = font(SG_BOLD, 24)
    y = 700
    for row in rows:
        x = 44
        for i, s in enumerate(row):
            sw = draw.textlength(s, font=sf)
            draw.rounded_rectangle([x, y, x + sw + 32, y + 52], radius=12, fill=OCEAN_900, outline=OCEAN_400, width=2)
            draw.text((x + 16, y + 12), s, font=sf, fill=WHITE)
            x += sw + 32 + 12
            if i < len(row) - 1:
                cx, cy = x + 6, y + 26
                draw.line([(cx, cy - 9), (cx + 9, cy), (cx, cy + 9)], fill=OCEAN_400, width=4, joint="curve")
                x += 28
        y += 66

    # quote teaser over dark scrim for contrast
    scrim = Image.new("RGBA", (IG, IG), (0, 0, 0, 0))
    ImageDraw.Draw(scrim).rounded_rectangle([32, 856, 700, 986], radius=18, fill=(*OCEAN_900, 215))
    img_rgba = Image.alpha_composite(img.convert("RGBA"), scrim)
    img.paste(img_rgba.convert("RGB"), (0, 0))
    draw = ImageDraw.Draw(img)
    draw.text((56, 874), "“Ser dev en Mar del Plata es…", font=font(SG_BOLD, 38), fill=OCEAN_100)
    draw.text((56, 924), "lo mejor del mundo.”", font=font(SG_BOLD, 38), fill=OCEAN_400)
    footer(draw)
    return img


# ── Slide 2 · Picsel ────────────────────────────────────────────────────────

def slide_picsel() -> Image.Image:
    img = bg("bg-picsel.png", (IG, IG))
    # subtle scrim to keep headline readable over bokeh
    scrim = Image.new("RGBA", (IG, IG), (0, 0, 0, 0))
    ImageDraw.Draw(scrim).rectangle([0, 130, IG, 470], fill=(*OCEAN_900, 150))
    img = Image.alpha_composite(img.convert("RGBA"), scrim).convert("RGB")
    draw = header(img, "PROYECTO 1", "02/05")

    draw.text((46, 172), "PICSEL", font=font(SG_BOLD, 120), fill=(0, 0, 20))
    draw.text((44, 170), "PICSEL", font=font(SG_BOLD, 120), fill=WHITE)
    draw.text((44, 296), "Vender fotos, sin fricción.", font=font(SG_BOLD, 40), fill=OCEAN_400)

    sub = font(INTER_MED, 27)
    for i, line in enumerate(wrap(draw, "La plataforma donde fotógrafos de LATAM venden sus fotos y videos — nacida en Mar del Plata.", sub, 980)[:3]):
        draw.text((44, 372 + i * 38), line, font=sub, fill=WHITE)

    # real feature cards from picsel.app
    feats = [
        ("AI FACE SEARCH", "Tus clientes se encuentran con una selfie"),
        ("WATERMARK AUTO", "Cada foto protegida al instante"),
        ("STRIPE GLOBAL", "Cobrás en USD desde Argentina"),
        ("WHATSAPP", "Entrega directa, sin descargas"),
    ]
    y = 500
    for i, (t, d) in enumerate(feats):
        x = 44 if i % 2 == 0 else 556
        if i == 2:
            y += 176
        draw.rounded_rectangle([x, y, x + 480, y + 156], radius=18, fill=(*OCEAN_900, 235))
        draw.rectangle([x, y + 18, x + 7, y + 62], fill=OCEAN_400)
        draw.text((x + 26, y + 24), t, font=font(SG_BOLD, 27), fill=OCEAN_400)
        df = font(INTER_MED, 23)
        for j, line in enumerate(wrap(draw, d, df, 430)[:2]):
            draw.text((x + 26, y + 68 + j * 30), line, font=df, fill=WHITE)

    draw.text((44, 900), "picsel.app", font=font(SG_BOLD, 30), fill=WHITE)
    draw.text((44, 946), "Hecho desde MDQ para toda LATAM", font=font(INTER_MED, 23), fill=OCEAN_300)
    footer(draw)
    return img


# ── Slide 3 · Blueprint Data ────────────────────────────────────────────────

def slide_blueprint() -> Image.Image:
    img = bg("bg-data.png", (IG, IG))
    draw = header(img, "PROYECTO 2", "03/05")

    draw.text((44, 170), "BLUEPRINT", font=font(SG_BOLD, 100), fill=WHITE)
    draw.text((44, 270), "DATA", font=font(SG_BOLD, 100), fill=OCEAN_400)

    sub = font(INTER_MED, 27)
    for i, line in enumerate(wrap(draw, "Data foundations para equipos que crecen: métricas compartidas, modelos gobernados y tooling open source.", sub, 980)[:3]):
        draw.text((44, 392 + i * 38), line, font=sub, fill=OCEAN_100)

    # real credibility chips
    chips = ["GOOGLE CLOUD PARTNER", "OPEN SOURCE FIRST", "DBT · SNOWFLAKE"]
    x, y = 44, 520
    cf = font(SG_BOLD, 23)
    for c in chips:
        cw = draw.textlength(c, font=cf)
        draw.rounded_rectangle([x, y, x + cw + 36, y + 50], radius=25, outline=OCEAN_400, width=2)
        draw.text((x + 18, y + 12), c, font=cf, fill=WHITE)
        x += cw + 54
        if x > 800:
            x, y = 44, y + 64

    # pipeline: problema → solución
    draw.rounded_rectangle([44, 680, 1036, 850], radius=20, fill=(*OCEAN_900, 235))
    draw.text((76, 712), "“Cada equipo tiene un número distinto.”", font=font(SG_BOLD, 33), fill=OCEAN_300)
    pf = font(INTER_MED, 25)
    for i, line in enumerate(wrap(draw, "Blueprint alinea finanzas, ops y producto sobre la misma lógica de datos — y después te deja el volante a vos.", pf, 900)[:3]):
        draw.text((76, 764 + i * 33), line, font=pf, fill=WHITE)

    draw.text((44, 900), "blueprintdata.xyz", font=font(SG_BOLD, 30), fill=WHITE)
    draw.text((44, 946), "Casos reales: fintech, venture, lending", font=font(INTER_MED, 23), fill=OCEAN_300)
    footer(draw)
    return img


# ── Slide 4 · Quote / ciudad ────────────────────────────────────────────────

def slide_quote() -> Image.Image:
    img = bg("bg-city.png", (IG, IG))
    draw = header(img, "MAR DEL PLATA", "04/05")

    card = photo_card((300, 300), radius=150, centering=(0.55, 0.35))
    img.paste(card, (IG - 400, 130), card)
    draw = ImageDraw.Draw(img)

    draw.text((36, 250), "“", font=font(SG_BOLD, 200), fill=OCEAN_400)
    lines = ["Ser dev en", "Mar del Plata", "es… lo mejor", "del mundo."]
    y = 370
    for i, line in enumerate(lines):
        fill = OCEAN_400 if i >= 2 else WHITE
        draw.text((48, y + 3), line, font=font(SG_BOLD, 88), fill=(0, 0, 20))
        draw.text((44, y), line, font=font(SG_BOLD, 88), fill=fill)
        y += 96

    # attribution inside dark pill so it survives the bright horizon
    attr = "Manu Ponsa — se mudó a la costa y construye desde acá"
    af = font(INTER_SEMI, 24)
    aw = draw.textlength(attr, font=af)
    scrim = Image.new("RGBA", (IG, IG), (0, 0, 0, 0))
    ImageDraw.Draw(scrim).rounded_rectangle([36, y + 28, 36 + aw + 44, y + 84], radius=16, fill=(*OCEAN_900, 220))
    img.paste(Image.alpha_composite(img.convert("RGBA"), scrim).convert("RGB"), (0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([52, y + 44, 60, y + 68], fill=SAND)
    draw.text((74, y + 42), attr, font=af, fill=WHITE)
    footer(draw)
    return img


# ── Slide 5 · CTA ───────────────────────────────────────────────────────────

def slide_cta() -> Image.Image:
    img = bg("bg-cta.png", (IG, IG))
    # left-side scrim so type wins over the bright wave
    scrim = Image.new("RGBA", (IG, IG), (0, 0, 0, 0))
    sd = ImageDraw.Draw(scrim)
    sd.rectangle([0, 0, 640, IG], fill=(*OCEAN_900, 175))
    scrim = scrim.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(img.convert("RGBA"), scrim).convert("RGB")
    draw = header(img, "COMUNIDAD", "05/05")

    draw.text((47, 213), "EL PRÓXIMO", font=font(SG_BOLD, 92), fill=(0, 0, 20))
    draw.text((44, 210), "EL PRÓXIMO", font=font(SG_BOLD, 92), fill=WHITE)
    draw.text((47, 305), "SPOTLIGHT", font=font(SG_BOLD, 92), fill=(0, 0, 20))
    draw.text((44, 302), "SPOTLIGHT", font=font(SG_BOLD, 92), fill=WHITE)
    draw.text((47, 397), "PODÉS SER VOS.", font=font(SG_BOLD, 92), fill=(0, 0, 20))
    draw.text((44, 394), "PODÉS SER VOS.", font=font(SG_BOLD, 92), fill=OCEAN_400)

    sub = font(INTER_MED, 29)
    for i, line in enumerate(wrap(draw, "Historias reales de gente que construye tecnología desde Mar del Plata y la costa atlántica.", sub, 860)[:3]):
        draw.text((44, 540 + i * 40), line, font=sub, fill=WHITE)

    cta = "SUMATE A LA COMUNIDAD"
    cf = font(SG_BOLD, 30)
    cw = draw.textlength(cta, font=cf)
    draw.rounded_rectangle([44, 700, 44 + cw + 60, 772], radius=20, fill=OCEAN_400)
    draw.text((74, 719), cta, font=cf, fill=OCEAN_900)

    draw.text((44, 830), "mardelplata.dev.ar", font=font(SG_BOLD, 34), fill=WHITE)
    draw.text((44, 884), "IG @mardelplata.dev.ar  ·  X @Mardeldev", font=font(INTER_MED, 24), fill=WHITE)
    footer(draw)
    return img


# ── X card 16:9 ─────────────────────────────────────────────────────────────

def card_x() -> Image.Image:
    img = bg("bg-cover.png", (X_W, X_H))
    scrim = Image.new("RGBA", (X_W, X_H), (0, 0, 0, 0))
    ImageDraw.Draw(scrim).rectangle([0, 560, 1000, 740], fill=(*OCEAN_900, 170))
    scrim = scrim.filter(ImageFilter.GaussianBlur(30))
    img = Image.alpha_composite(img.convert("RGBA"), scrim).convert("RGB")
    draw = ImageDraw.Draw(img)
    lg = logo(76)
    img.paste(lg, (48, 40), lg)
    kf = font(INTER_SEMI, 19)
    kw = draw.textlength("TALENTO", font=kf)
    draw.rounded_rectangle([142, 58, 142 + kw + 34, 98], radius=20, fill=OCEAN_400)
    draw.text((159, 67), "TALENTO", font=kf, fill=OCEAN_900)

    card = photo_card((480, 620), centering=(0.55, 0.4))
    img.paste(card, (1050, 130), card)
    draw = ImageDraw.Draw(img)

    draw.text((48, 170), "MANU", font=font(SG_BOLD, 120), fill=WHITE)
    draw.text((48, 292), "PONSA", font=font(SG_BOLD, 120), fill=OCEAN_400)
    draw.rectangle([52, 440, 380, 447], fill=SAND)
    draw.text((48, 474), "Software & Data · ex Mercado Libre y Decentraland", font=font(INTER_SEMI, 27), fill=WHITE)
    draw.text((48, 518), "Co-founder de Picsel y Blueprint Data", font=font(INTER_MED, 25), fill=OCEAN_100)

    draw.text((48, 610), "“Ser dev en Mar del Plata es…", font=font(SG_BOLD, 42), fill=OCEAN_100)
    draw.text((48, 662), "lo mejor del mundo.”", font=font(SG_BOLD, 42), fill=OCEAN_400)

    draw.text((48, 800), BRAND, font=font(SG_BOLD, 26), fill=WHITE)
    draw.text((48, 842), "Mar del Plata tiene talento tech", font=font(INTER_MED, 22), fill=OCEAN_300)
    return img


def main() -> None:
    slides = [
        (slide_cover(), "01-cover"),
        (slide_picsel(), "02-picsel"),
        (slide_blueprint(), "03-blueprint-data"),
        (slide_quote(), "04-mar-del-plata"),
        (slide_cta(), "05-cta"),
    ]
    for out in OUT_DIRS:
        out.mkdir(parents=True, exist_ok=True)
        for old in out.glob("*.png"):
            old.unlink()
        for image, name in slides:
            image.save(out / f"{name}.png", "PNG", optimize=True)
    x = card_x()
    for out in OUT_X_DIRS:
        out.mkdir(parents=True, exist_ok=True)
        x.save(out / "manu-ponsa.png", "PNG", optimize=True)
    print("Manu v4 →", OUT_DIRS[0])


if __name__ == "__main__":
    main()
