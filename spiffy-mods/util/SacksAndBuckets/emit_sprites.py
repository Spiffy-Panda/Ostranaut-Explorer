"""Composite scavenge-material PNGs onto base sack/crate sprites.

For each item in config.yaml's `items` list, produces two PNGs in
sprite_gen.output_dir:
  ItmSack<Suffix>.png    = sack_base + <source> material at material_scale
  ItmBucket<Suffix>.png  = bucket_base + <source> material at material_scale

Source PNGs are read from sprite_gen.sources_dir (you stage them by
copying from your game install or extracting via UABE / AssetStudio --
the script doesn't fetch from the game install since extraction tooling
and asset paths vary by Ostranauts version). Expected filenames:
  <sack_base>.png   e.g. ItmBackpack02.png
  <bucket_base>.png e.g. ItmCrate01.png
  <source>.png      e.g. ItmScrapTrash.png, ItmPartsMechSmall01.png, ...

Material is centered on the base by default; configurable via
material_offset_x / material_offset_y in config.yaml.

If a material PNG is missing and warn_on_missing_material is true, the
script writes a copy of the base alone and logs a warning -- so the
generation still produces a complete sprite set even if some items
haven't been staged yet. Set warn_on_missing_material false to fail hard.

Run: python spiffy-mods/util/SacksAndBuckets/emit_sprites.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

from _lib import REPO_ROOT, load_config


def composite(base: Image.Image, material: Image.Image, scale: float, ox: int, oy: int) -> Image.Image:
    """Return base with material pasted at scale*base, centered + offset.

    Both images are converted to RGBA. The material is resized so its
    *longer* edge equals scale * base's longer edge (preserves aspect),
    then anchor-centered on the base with optional pixel offset.
    """
    base = base.convert("RGBA")
    material = material.convert("RGBA")

    bw, bh = base.size
    mw, mh = material.size

    # Resize material so its longer edge = scale * base's longer edge.
    base_long = max(bw, bh)
    target_long = max(1, round(scale * base_long))
    if mw >= mh:
        new_mw = target_long
        new_mh = max(1, round(mh * (target_long / mw)))
    else:
        new_mh = target_long
        new_mw = max(1, round(mw * (target_long / mh)))
    material = material.resize((new_mw, new_mh), Image.Resampling.LANCZOS)

    out = base.copy()
    # Center the material; offset is from center, positive = right/down.
    px = (bw - new_mw) // 2 + ox
    py = (bh - new_mh) // 2 + oy
    out.alpha_composite(material, (px, py))
    return out


def load_or_none(path: Path) -> Image.Image | None:
    if not path.exists():
        return None
    return Image.open(path)


def main() -> int:
    cfg = load_config()
    sprite_cfg = cfg["sprite_gen"]
    sources_dir = REPO_ROOT / sprite_cfg["sources_dir"]
    output_dir = REPO_ROOT / sprite_cfg["output_dir"]
    output_dir.mkdir(parents=True, exist_ok=True)

    sack_base_path = sources_dir / f"{sprite_cfg['sack_base']}.png"
    bucket_base_path = sources_dir / f"{sprite_cfg['bucket_base']}.png"
    sack_base = load_or_none(sack_base_path)
    bucket_base = load_or_none(bucket_base_path)

    if sack_base is None or bucket_base is None:
        print(
            f"ERROR: missing base sprite(s) under {sources_dir.relative_to(REPO_ROOT)}\n"
            f"  expected {sprite_cfg['sack_base']}.png and {sprite_cfg['bucket_base']}.png\n"
            f"  stage them by copying from your game install (extract via UABE or AssetStudio).",
            file=sys.stderr,
        )
        return 1

    scale = sprite_cfg["material_scale"]
    ox = int(sprite_cfg["material_offset_x"])
    oy = int(sprite_cfg["material_offset_y"])
    warn_missing = bool(sprite_cfg["warn_on_missing_material"])

    written = 0
    skipped: list[str] = []
    for item in cfg["items"]:
        suffix = item["suffix"]
        source = item["source"]
        material_path = sources_dir / f"{source}.png"
        material = load_or_none(material_path)

        if material is None:
            msg = f"missing material {source}.png; "
            if warn_missing:
                print(f"warning: {msg}using base alone for ItmSack{suffix} / ItmBucket{suffix}", file=sys.stderr)
                sack_out = sack_base.copy().convert("RGBA")
                bucket_out = bucket_base.copy().convert("RGBA")
                skipped.append(source)
            else:
                print(f"ERROR: {msg}aborting (warn_on_missing_material=false)", file=sys.stderr)
                return 1
        else:
            sack_out = composite(sack_base, material, scale, ox, oy)
            bucket_out = composite(bucket_base, material, scale, ox, oy)

        sack_out.save(output_dir / f"ItmSack{suffix}.png")
        bucket_out.save(output_dir / f"ItmBucket{suffix}.png")
        written += 2

    print(f"Wrote {written} sprite(s) to {output_dir.relative_to(REPO_ROOT)}")
    if skipped:
        print(f"  ({len(skipped)} material PNG(s) missing; used base alone for: {', '.join(skipped)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
