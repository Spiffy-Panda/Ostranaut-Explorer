# Sacks and Buckets

A data-only Ostranauts mod that adds **single-type containers** for the
12 most common dismantle-yield items. Sacks (4×4 grid, wearable) and
buckets (8×8 grid, oversized — drag-only) are filtered by construction:
each one accepts exactly one kind of part, and only that kind.

Pairs naturally with the planned **Pipes** mod: a network of buckets
sorts loose loot for free, because each bucket *is* a filter.

## Status

v1 — design/build draft. Ships content (containers + fit gates +
kiosk stock). No custom art yet — sacks render as `ItmBackpack02`,
buckets as `ItmCrate01`. Distinct identities live in `strNameFriendly`
and `strDesc`. Sprite swap is a v2 task.

## What's in the box

12 item-type families × (1 sack + 1 bucket) = 24 new container
condowners, gated by 12 new `TIsFitContainer*` condtrigs:

| Suffix             | Source item             | Sack capacity | Bucket capacity |
|--------------------|-------------------------|--------------:|----------------:|
| `Trash`            | `ItmScrapTrash`         |          4×4  |            8×8  |
| `PartsMechSmall`   | `ItmPartsMechSmall01`   |          4×4  |            8×8  |
| `ScrapSteel`       | `ItmScrapSteel`         |          4×4  |            8×8  |
| `PartsElecSmall`   | `ItmPartsElecSmall01`   |          4×4  |            8×8  |
| `ComponentMobo`    | `ItmComponentMobo01`    |          4×4  |            8×8  |
| `ScrapAluminum`    | `ItmScrapAluminum`      |          4×4  |            8×8  |
| `ComponentMotor`   | `ItmComponentMotor01`   |          4×4  |            8×8  |
| `HeatSink`         | `ItmHeatSink01`         |          4×4  |            8×8  |
| `ScrapCarbonFiber` | `ItmScrapCarbonFiber`   |          4×4  |            8×8  |
| `PartsScreen`      | `ItmPartsScreen01`      |          4×4  |            8×8  |
| `ScrapPlastic`     | `ItmScrapPlastic`       |          4×4  |            8×8  |
| `ScrapClothDirty`  | `ItmScrapClothDirty`    |          4×4  |            8×8  |

Sacks are 4×4 (parity with the vanilla 16-slot backpack — same
capacity, single-type). Buckets are 8×8 (4× the backpack — "modders
should aim overpowered to demonstrate the mechanic"; can be tuned down
if upstreamed).

## Files

```
spiffy-mods/SacksAndBuckets/
├── README.md
├── mod_info.json                            ← strName, version, author
└── data/
    ├── condowners/condowners.json           ← 24 container CO entries
    ├── condtrigs/condtrigs.json             ← 12 fit-gate condtrigs
    ├── interactions/interactions.json       ← GUITradeSacksKiosk (mirrors GUITradeKiosk's checks)
    └── loot/
        └── loot_self_reference.json         ← 24 self-emit wrappers (one per sack/bucket; required so aLoots refs resolve)
```

Layout mirrors `<ModName>/data/<folder>/<file>.json` per the
established Ostranauts mod convention. Folder names match base-game
`data/` exactly so the mod loader merges by folder. **No vanilla data
overrides** — every entry is additive.

## How it works (mechanic by mechanic)

- **Single-type filter** — each container has
  `strContainerCT: "TIsFitContainer<Suffix>"`. The condtrig's
  `aReqs` / `aForbids` pin the accepted item type. Same pattern vanilla
  uses for `TIsFitContainerBattery04`, `TIsFitContainerEVABottle`, etc.
  Sack and bucket of the same type **share the gate** — they hold the
  same thing, just at different scales.
- **No new marker conditions.** Every one of the 12 source items
  already carries a distinguishing marker in vanilla (`IsTrash`,
  `IsSteel`, `IsMobo`, `IsAluminum`, `IsMotor`, `IsHeatSink`,
  `IsCarbonFiber`, `IsScreen`, `IsPlastic`, plus paired markers for
  mech vs. elec parts and dirty cloth). The mod adds no conditions —
  it just narrows on what's already there.
- **Bucket-as-installable** — buckets carry
  `IsOversized + IsRigid + IsCrate`, mirroring `ItmCrate01`. Game
  treats them as drag-only by virtue of `IsOversized`. No new tag.
- **Universal trade interaction** —
  `GUITradeSacksKiosk` interaction with the same checks as vanilla
  `GUITradeKiosk` (`CTTestUs: TIsHuman`, `CTTestThem: TIsTradeKiosk`,
  `aInverse: [GUITradeCheckOKLGLicensed, GUITradeAllow]`). The intent
  is for it to surface on **any** kiosk that satisfies `TIsTradeKiosk`,
  no per-kiosk wiring needed.
- **Self-reference loot wrappers** — `aLoots` refs target the `loot/`
  folder per schema, so each sack/bucket gets an entry there that
  emits itself via `aCOs`. Vanilla wraps every aLoots-referenced item
  the same way in `data/loot/loot_self_reference.json`. Useful for
  explorer navigation and for any future mod additions that reference
  these items via aLoots.

## Why no BepIn

Every behaviour relies on existing engine hooks: `TIsFitContainer*`,
`IsOversized`, `IsCrate`, container-grid sizing, kiosk-loot-table
stocking. The mod is recombination, not extension. See
`notes/mod-ideas/sacks-and-buckets-implementation.md` (in the parent
repo) for the full data-trail.

## Caveats / known v1 limitations

- **Sprites reuse vanilla art.** `ItmBackpack02` for sacks,
  `ItmCrate01` for buckets. Modder will tell them apart by
  `strNameFriendly` ("Sack of Bolts" vs "Sack of Boards") in the
  inventory tooltip. Custom art is a v2 task.
- **Trade UI shows the kiosk's vanilla stock, not our items** (open
  question). The trade UI reads `[them].mapGUIPropMaps[Trader]` →
  guipropmap → `strLoot` to determine inventory, and that chain is
  set on the kiosk CO, not on the interaction. So `GUITradeSacksKiosk`
  surfacing on a vanilla kiosk just opens that kiosk's normal trade
  UI. Wiring our items into the displayed inventory needs one of:
  (a) override the kiosk's `mapGUIPropMaps[Trader]` to point at our
      stock table (per-kiosk override),
  (b) ship a new kiosk CO with our wiring (the previous approach,
      which depends on placing the kiosk somewhere reachable),
  (c) BepIn-side change to route the trade UI by interaction strName
      instead of by kiosk-side guipropmap.
  v1 ships the interaction and lets us empirically check whether it
  surfaces on vanilla kiosks at all; the inventory-routing piece is
  open.
- **Dismantle integration deferred.** v1 does not yield buckets from
  dismantle. Adding `ItmBucket<Suffix>=0.05x1` to dismantle loot
  tables is a separate patch.
- **No stat tuning pass yet.** Mass / price / damage values are
  reasonable-by-analogy rather than balanced. The 8×8 bucket is
  intentionally generous; tune down for an upstream submission.

## Install

1. Find your game's Mods folder. In-game: **Options → Files**. On a
   default Steam install it's typically `Steam/steamapps/common/Ostranauts/Ostranauts_Data/Mods/`.
2. Copy the `SacksAndBuckets/` folder into that Mods directory.
3. Make sure `Mods/loading_order.json` exists and contains
   `SacksAndBuckets` in its `aLoadOrder` array, **after `"core"`**:

   ```json
   [{
     "strName": "Mod Loading Order",
     "aLoadOrder": [ "core", "SacksAndBuckets" ],
     "aIgnorePatterns": []
   }]
   ```

   The repo ships a ready-to-use sample at
   [spiffy-mods/loading_order.json](../loading_order.json). If you
   already have a `loading_order.json` with other mods, **merge**
   `SacksAndBuckets` into the existing `aLoadOrder` array — don't
   replace the file.
4. **Test in-game**:
   - `spawn ItmSackTrash` (or any of the 24) — should succeed (purple
     command text) if the mod loaded. Failure means the load is broken;
     check BepInEx log first.
   - **Walk up to any vanilla supply kiosk** and right-click. Look for
     a "Trade Sacks & Buckets" option in the action menu next to the
     vanilla "Trade" option. If it appears, the interaction is
     surfacing globally — proceed to test what UI it opens. If it
     doesn't appear, Ostranauts only surfaces interactions explicitly
     listed in a CO's `aInteractions`, and we'll need to override
     individual kiosk COs to add our interaction to their lists.

The mod has no ordering dependency on other mods, but always after `"core"`.

If something doesn't work:

- Confirm the game version in `mod_info.json` (`strGameVersion`)
  matches the version printed on your Ostranauts main menu. Mismatches
  can cause silent load failures.
- Look at the game's BepInEx log (`BepInEx/LogOutput.log`) for
  loader errors mentioning any of our strNames.

## License

Mod content is original to this repo. The supply-kiosk loot table
contents that are vanilla-copied for the override pattern are © Blue
Bottle Games — included only as the structural minimum needed to
extend those tables.
