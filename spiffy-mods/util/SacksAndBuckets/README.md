# util/SacksAndBuckets

Generation tooling for the [SacksAndBuckets mod](../../mods/SacksAndBuckets/).

## What lives here

```
util/SacksAndBuckets/
├── README.md               (this file)
├── config.yaml             single source of truth for dimensions, item table, sprite-gen settings
├── _lib.py                 shared helpers (path anchoring, JSON writer, config loader)
├── emit_condowners.py      writes mods/SacksAndBuckets/data/condowners/condowners.json
├── emit_items.py           writes mods/SacksAndBuckets/data/items/items.json
├── emit_loot.py            writes mods/SacksAndBuckets/data/loot/loot.json + loot_self_reference.json
├── emit_sprites.py         draws sack/bucket PNGs from PIL primitives + per-item colour + 2-char label
└── emit_all.py             runs all four in order (sprites first, then JSON)
```

`condtrigs.json` and `interactions.json` and `guipropmaps.json` are not
generated -- they're small enough (12 / 1 / 1 entries) that hand-editing
in [mods/SacksAndBuckets/data/](../../mods/SacksAndBuckets/data/) is the
clearer source of truth.

## Sprites -- fully procedural, no vanilla extraction

`emit_sprites.py` draws every sprite from PIL primitives. There are
no source PNGs to stage; the only inputs are the per-item `color`
and `label` fields in [config.yaml](config.yaml).

For each row in `items:`, the script writes two PNGs:

- **`ItmSack<Suffix>.png`** -- a rounded sack silhouette: cinched neck,
  drawstring stub with knot blobs, swollen body. Filled with the row's
  `color`; outlined in a darkened version. The 2-char `label` is
  stamped centred in the body.
- **`ItmBucket<Suffix>.png`** -- a rigid trapezoidal bucket: top rim
  (lighter ellipse), trapezoidal body, arc handle above the rim,
  shadow line on the bottom. Same colour + label.

Per-item palette + label live in `items:`:

```yaml
items:
  - suffix: Trash
    color: "#6B5B3E"     # muddy brown
    label: TR
  - suffix: ScrapSteel
    color: "#8B8B8B"     # steel gray
    label: SS
  ...
```

The 12 colours are picked to be evocative (steel = grey, plastic =
yellow, copper-coloured motors, etc.) and to land in distinct regions
of colour-space when possible. Where colours collide (e.g. several
greys), the 2-char label is the tiebreaker.

### Output path

Generated sprites land in **`spiffy-mods/mods/SacksAndBuckets/images/`**
— a sibling of `data/`, not under it. That's because Ostranauts'
runtime resolves item sprites via `DataHandler.LoadPNG` (decomp
`DataHandler.cs:1196`), which walks each loaded mod's path and looks
for `<modroot>/images/<strImg>.png`. So a strImg of `ItmSackTrash` →
`mods/SacksAndBuckets/images/ItmSackTrash.png`.

### Style + canvas size

Default canvas is 64×64 RGBA. Drop `sprite_gen.sprite_size` to 32 for
a chunkier feel. The drawn shapes are anti-aliased PIL polygons /
ellipses / arcs -- the result is "graphic icon", not pixel art. For
true blocky pixel art a pass that renders to a tiny canvas and
upscales with `Image.NEAREST` would be the fix; not implemented.

### Font lookup

Labels need a truetype font. The script tries common system paths in
order (Windows Arial, then Linux DejaVu/Liberation Sans, then macOS
Helvetica/Arial). If none are found it falls back to PIL's tiny
default bitmap font and logs a warning -- the sprites still write,
the label just becomes hard to read. Add a path to `_FONT_CANDIDATES`
in `emit_sprites.py` if your system font lives somewhere else.

### Atlas / sprite-sheet aside (irrelevant for this mod)

Some vanilla items load their sprite as a **single-image PNG**;
others load it as an **atlas/sprite-sheet** with multiple cells
(auto-tiling walls, floor grates, etc., e.g. `ItmFloorGrate01_4x4`
is a 4×4 = 16-cell sheet). The distinction is the `bHasSpriteSheet`
field on the ItemDef:

| `bHasSpriteSheet` | runtime path                | file shape                                             |
|-------------------|------------------------------|--------------------------------------------------------|
| `false` (default) | `DataHandler.GetMaterial`    | one image per item                                     |
| `true`            | `DataHandler.GetMaterialSheet` | one PNG holding N cells, indexed by `nIndex`. Cell size is 16 × `tileWidth` / `tileHeight` px. nCols/nRows are *derived* from the texture's pixel dimensions, not stored in the JSON. |

Our generated sprites are 64×64 single PNGs (no sheet) and our
ItemDef entries have `bHasSpriteSheet: false`, so this doesn't apply
-- but it's worth knowing if a future SacksAndBuckets variant ever
needs an auto-tiled wall mount or similar.

## Tuning knobs in config.yaml

- **Container sizes** (`dimensions.sack` / `dimensions.bucket`): height
  & width in inventory cells. Sacks default 8x8 (4x backpack); buckets
  default 16x16 (16x backpack). Vanilla's largest grid is 6x6 -- 16x16
  is past the empirically-validated envelope.
- **Kiosk stock weights** (`kiosk_stock`): chance + count range per
  sack/bucket entry in the kiosk's aLoots.
- **Sprite size** (`sprite_gen.sprite_size`): canvas in pixels (square).
  Default 64. Drop to 32 for chunkier sprites.
- **Label point size** (`sprite_gen.label_size`): label font size.
  Default 22 (~1/3 of sprite_size, comfortable legibility).
- **Items table** (`items:`): the 12 item types -- each row carries
  `color` (hex RGB) and `label` (2 chars) for the sprite gen plus the
  fields the JSON gens use. Add or remove a row here and re-run
  `emit_all.py`; everything downstream (condowners, items, loot,
  sprites) updates in lockstep.

## Running

```
python spiffy-mods/util/SacksAndBuckets/emit_all.py
```

Or one at a time:

```
python spiffy-mods/util/SacksAndBuckets/emit_sprites.py
python spiffy-mods/util/SacksAndBuckets/emit_items.py
python spiffy-mods/util/SacksAndBuckets/emit_condowners.py
python spiffy-mods/util/SacksAndBuckets/emit_loot.py
```

After regenerating, rebuild the local explorer:

```
.\build.bat site-mods
```

## Why Python instead of PowerShell

Earlier versions used PowerShell. The shift to Python was driven by
the move to YAML config -- Windows PowerShell 5.1 has no native YAML
support, and adding a module dependency for ad-hoc tooling was the
worse trade vs. switching to Python (which already has tons of repo
tooling under [utils/python/](../../../utils/python/)). PIL/Pillow
also gives a clean image API for the sprite generator.
