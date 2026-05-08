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
├── emit_sprites.py         composites scavenge-material PNGs onto base sack/crate sprites
├── emit_all.py             runs all four in order (sprites first, then JSON)
└── sprite_sources/         (gitignored) drop your staged vanilla PNGs here
```

`condtrigs.json` and `interactions.json` and `guipropmaps.json` are not
generated -- they're small enough (12 / 1 / 1 entries) that hand-editing
in [mods/SacksAndBuckets/data/](../../mods/SacksAndBuckets/data/) is the
clearer source of truth.

## Sprite sources -- staging vanilla PNGs

`emit_sprites.py` reads PNGs from the path given by
`sprite_gen.sources_dir` in [config.yaml](config.yaml) (default:
`spiffy-mods/util/SacksAndBuckets/sprite_sources/`). You stage them by
copying from your game install or extracting via UABE / AssetStudio --
the script doesn't fetch from the game install since extraction tooling
and asset paths vary by Ostranauts version.

Expected filenames in `sources_dir/`:

- The two base container sprites: `ItmBackpack02.png`, `ItmCrate01.png`.
- One material sprite per item type, named after the **vanilla
  `strImg`** (sprite name), not the condowner's `strName`. These
  diverge for 5 of the 12 items because vanilla aliases shared art
  through `strItemDef`. The mapping:

  | condowner strName     | sprite to stage           |
  |-----------------------|---------------------------|
  | `ItmScrapTrash`       | **`ItmTrash02.png`**      |
  | `ItmPartsMechSmall01` | `ItmPartsMechSmall01.png` |
  | `ItmScrapSteel`       | **`ItmScrapMetal01.png`** |
  | `ItmPartsElecSmall01` | `ItmPartsElecSmall01.png` |
  | `ItmComponentMobo01`  | `ItmComponentMobo01.png`  |
  | `ItmScrapAluminum`    | **`ItmScrapMetal02.png`** |
  | `ItmComponentMotor01` | `ItmComponentMotor01.png` |
  | `ItmHeatSink01`       | `ItmHeatSink01.png`       |
  | `ItmScrapCarbonFiber` | **`ItmTrash01.png`**      |
  | `ItmPartsScreen01`    | `ItmPartsScreen01.png`    |
  | `ItmScrapPlastic`     | **`ItmScrapPlastic01.png`**|
  | `ItmScrapClothDirty`  | `ItmScrapClothDirty.png`  |

  The per-item `sprite_source` field in [config.yaml](config.yaml)
  records which file each row expects. To verify yourself for any
  vanilla strName: grep its CO entry in `data/condowners/*.json` for
  `strItemDef`, then look that ItemDef up in `data/items/items.json`
  and read its `strImg`. That's the sprite filename.

Materials should have **transparent backgrounds**. The script resizes
them to `material_scale` of the base's longer edge (default 0.667 = 2/3),
center-paste with optional offset, alpha-composited.

If a material PNG is missing and `warn_on_missing_material: true`, the
script writes a copy of the base alone for that item and logs a warning
-- so you can stage materials incrementally without breaking generation.

## Tuning knobs in config.yaml

- **Container sizes** (`dimensions.sack` / `dimensions.bucket`): height
  & width in inventory cells. Sacks default 8x8 (4x backpack); buckets
  default 16x16 (16x backpack). Vanilla's largest grid is 6x6 -- 16x16
  is past the empirically-validated envelope.
- **Kiosk stock weights** (`kiosk_stock`): chance + count range per
  sack/bucket entry in the kiosk's aLoots.
- **Material overlay** (`sprite_gen.material_scale` /
  `material_offset_x` / `material_offset_y`): how the scavenge-material
  sprite sits on the base.
- **Items table** (`items:`): the 12 item types. Add or remove a row
  here and re-run `emit_all.py`; everything downstream (condowners,
  items, loot, sprites) updates in lockstep.

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
