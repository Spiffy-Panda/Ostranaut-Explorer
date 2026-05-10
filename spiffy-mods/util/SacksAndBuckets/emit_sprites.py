"""Procedural sprite generator for SacksAndBuckets.

For each item in config.yaml's `items` list, draws two PNGs in
sprite_gen.output_dir using PIL primitives:
  ItmSack<Suffix>.png    -- rounded sack silhouette filled with `color`,
                            stamped with the 2-char `label` in the centre.
  ItmBucket<Suffix>.png  -- rigid trapezoidal bucket with rim + handle,
                            same colour + label.

No vanilla sprite extraction required -- everything is drawn from
shapes (polygon, rounded_rectangle, ellipse, arc, line) and PIL's
truetype text rendering.

Output path: per DataHandler.LoadPNG (decomp DataHandler.cs:1196), the
runtime resolves item sprites as <modroot>/images/<strImg>.png. So
sprite_gen.output_dir in config.yaml is set to
mods/SacksAndBuckets/images/. items.json sets each container's strImg
= its strName, so e.g. ItmSackTrash.png ends up at
mods/SacksAndBuckets/images/ItmSackTrash.png and the runtime finds it.

Style is "graphic icon" not pixel art -- the shapes are anti-aliased.
For a chunkier pixel-art feel, drop sprite_size in config to 32 or
even 16. Anti-aliasing remains; for true blocky pixels you'd render
to a tiny canvas and upscale with Image.NEAREST (not implemented;
deferred until a style pass).

Run: python spiffy-mods/util/SacksAndBuckets/emit_sprites.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from _lib import REPO_ROOT, load_config


# ---------------------------------------------------------------------------
# Colour utilities
# ---------------------------------------------------------------------------

def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    h = hex_str.lstrip("#")
    if len(h) != 6:
        raise ValueError(f"expected 6-char hex colour, got {hex_str!r}")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def darken(rgb: tuple[int, int, int], factor: float) -> tuple[int, int, int]:
    """Multiply each channel by `factor` (0..1), clamping to [0, 255]."""
    return tuple(max(0, min(255, int(c * factor))) for c in rgb)  # type: ignore[return-value]


def label_color_for(bg: tuple[int, int, int]) -> tuple[int, int, int]:
    """Pick black or white for label text given a background colour, by
    relative luminance (Rec. 601). Dark backgrounds get white text."""
    luminance = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]
    return (255, 255, 255) if luminance < 128 else (0, 0, 0)


# ---------------------------------------------------------------------------
# Font lookup -- try common system fonts, fall back to PIL bitmap default
# ---------------------------------------------------------------------------

_FONT_CANDIDATES = [
    # Windows
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\segoeuib.ttf",
    # Linux (Debian/Ubuntu typical)
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    # macOS
    "/System/Library/Fonts/Helvetica.ttc",
    "/Library/Fonts/Arial Bold.ttf",
]


def get_font(point_size: int) -> ImageFont.ImageFont:
    for p in _FONT_CANDIDATES:
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, point_size)
            except Exception:
                continue
    print(
        "warning: no truetype font found; falling back to PIL's default "
        "bitmap font (label will be tiny). Add a font path to "
        "_FONT_CANDIDATES to fix.",
        file=sys.stderr,
    )
    return ImageFont.load_default()


# ---------------------------------------------------------------------------
# Drawing
# ---------------------------------------------------------------------------

def draw_sack(color: tuple[int, int, int], label: str, size: int, label_pt: int) -> Image.Image:
    """A potato-sack silhouette: narrow tied top, wide rounded bottom.

    Approximated as a polygon with extra width below the cinch. The cinch
    is a darker band; the body fills with `color`. Label centred over body.
    """
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    outline = darken(color, 0.55)

    # Coordinate landmarks scaled to canvas size.
    s = size
    margin = max(1, s // 16)
    cinch_y = s // 5                    # the tied throat of the sack
    bottom_y = s - margin
    cinch_half_w = s // 6
    body_half_w = (s - margin * 2) // 2

    cx = s // 2

    # Body: 6-point polygon, hourglass-ish above the cinch line, swollen below.
    body_pts = [
        (cx - cinch_half_w, cinch_y),                  # top-left of cinch
        (cx + cinch_half_w, cinch_y),                  # top-right of cinch
        (cx + body_half_w, cinch_y + (s // 6)),        # widening shoulder right
        (cx + body_half_w, bottom_y - (s // 8)),       # straight side right
        (cx + body_half_w - (s // 12), bottom_y),      # rounded bottom right
        (cx - body_half_w + (s // 12), bottom_y),      # rounded bottom left
        (cx - body_half_w, bottom_y - (s // 8)),       # straight side left
        (cx - body_half_w, cinch_y + (s // 6)),        # widening shoulder left
    ]
    draw.polygon(body_pts, fill=color + (255,), outline=outline + (255,))

    # Cinch band -- darker horizontal stripe at the throat.
    cinch_y2 = cinch_y + max(2, s // 24)
    draw.rectangle(
        [(cx - cinch_half_w - 2, cinch_y - 1), (cx + cinch_half_w + 2, cinch_y2)],
        fill=outline + (255,),
    )

    # Drawstring stub above the cinch.
    stub_top_y = max(1, margin)
    stub_w = max(1, s // 32)
    draw.line(
        [(cx, stub_top_y), (cx, cinch_y - 1)],
        fill=outline + (255,),
        width=stub_w * 2,
    )
    # Two little knot blobs.
    knot_r = max(2, s // 24)
    draw.ellipse(
        [(cx - knot_r - 2, stub_top_y - 1), (cx - 2, stub_top_y + knot_r * 2 - 1)],
        fill=outline + (255,),
    )
    draw.ellipse(
        [(cx + 2, stub_top_y - 1), (cx + knot_r + 2, stub_top_y + knot_r * 2 - 1)],
        fill=outline + (255,),
    )

    # Label. Vertically centred between the cinch and the bottom.
    label_band_top = cinch_y2 + 2
    label_band_bot = bottom_y
    draw_label(draw, label, (s, s), label_pt, label_color_for(color),
               y_band=(label_band_top, label_band_bot))
    return img


def draw_bucket(color: tuple[int, int, int], label: str, size: int, label_pt: int) -> Image.Image:
    """A trapezoidal bucket: top rim wider than bottom, with arc handle."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    outline = darken(color, 0.55)
    highlight = darken(color, 1.25)  # >1 actually clamps to 255 → lighter

    s = size
    margin = max(1, s // 16)
    rim_y = s // 4
    bottom_y = s - margin
    rim_half_w = (s - margin * 2) // 2
    bot_half_w = rim_half_w - (s // 10)
    cx = s // 2

    # Trapezoidal body.
    body_pts = [
        (cx - rim_half_w, rim_y),
        (cx + rim_half_w, rim_y),
        (cx + bot_half_w, bottom_y),
        (cx - bot_half_w, bottom_y),
    ]
    draw.polygon(body_pts, fill=color + (255,), outline=outline + (255,))

    # Top rim -- ellipse cap that gives the bucket a 3D feel.
    rim_h = max(3, s // 10)
    draw.ellipse(
        [(cx - rim_half_w, rim_y - rim_h // 2),
         (cx + rim_half_w, rim_y + rim_h // 2)],
        fill=highlight + (255,),
        outline=outline + (255,),
    )

    # Handle arc above the rim.
    handle_top = max(1, margin)
    handle_h = rim_y - handle_top + 2
    handle_w = rim_half_w - (s // 16)
    arc_w = max(2, s // 32)
    draw.arc(
        [(cx - handle_w, handle_top),
         (cx + handle_w, handle_top + handle_h * 2)],
        start=180,
        end=360,
        fill=outline + (255,),
        width=arc_w,
    )

    # Bottom shadow strip for depth.
    shadow_w = max(2, s // 32)
    draw.line(
        [(cx - bot_half_w + 2, bottom_y - 1),
         (cx + bot_half_w - 2, bottom_y - 1)],
        fill=outline + (255,),
        width=shadow_w,
    )

    # Label. Centred in the trapezoid body.
    label_band_top = rim_y + rim_h // 2 + 2
    label_band_bot = bottom_y - 2
    draw_label(draw, label, (s, s), label_pt, label_color_for(color),
               y_band=(label_band_top, label_band_bot))
    return img


def draw_label(
    draw: ImageDraw.ImageDraw,
    text: str,
    canvas: tuple[int, int],
    point_size: int,
    color: tuple[int, int, int],
    y_band: tuple[int, int] | None = None,
) -> None:
    """Stamp `text` centred horizontally + vertically in `y_band` (or in
    the whole canvas if y_band is None). Adds a contrast stroke."""
    font = get_font(point_size)
    cw, ch = canvas
    bbox = draw.textbbox((0, 0), text, font=font, stroke_width=1)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    if y_band is None:
        y_top, y_bot = 0, ch
    else:
        y_top, y_bot = y_band
    x = (cw - tw) // 2 - bbox[0]
    y = y_top + ((y_bot - y_top) - th) // 2 - bbox[1]
    stroke_fill = (0, 0, 0) if color == (255, 255, 255) else (255, 255, 255)
    draw.text(
        (x, y),
        text,
        fill=color,
        font=font,
        stroke_width=1,
        stroke_fill=stroke_fill,
    )


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------

def main() -> int:
    cfg = load_config()
    sprite_cfg = cfg["sprite_gen"]
    output_dir = REPO_ROOT / sprite_cfg["output_dir"]
    output_dir.mkdir(parents=True, exist_ok=True)
    sprite_size = int(sprite_cfg.get("sprite_size", 64))
    label_pt = int(sprite_cfg.get("label_size", max(8, sprite_size // 3)))

    written = 0
    for item in cfg["items"]:
        suffix = item["suffix"]
        try:
            color = hex_to_rgb(item["color"])
        except KeyError:
            print(f"ERROR: item {suffix!r} missing `color` field", file=sys.stderr)
            return 1
        label = str(item.get("label", suffix[:2].upper()))
        if len(label) != 2:
            print(
                f"warning: item {suffix!r} label {label!r} is not 2 chars; "
                f"truncating/padding", file=sys.stderr,
            )
            label = (label + "??")[:2]

        sack_img = draw_sack(color, label, sprite_size, label_pt)
        bucket_img = draw_bucket(color, label, sprite_size, label_pt)
        sack_img.save(output_dir / f"ItmSack{suffix}.png")
        bucket_img.save(output_dir / f"ItmBucket{suffix}.png")
        written += 2

    print(f"Wrote {written} sprite(s) to {output_dir.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
