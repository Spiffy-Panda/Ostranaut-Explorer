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
    ├── condowners/condowners.json           ← 24 container CO entries + 1 kiosk CO (ItmSacksKiosk01)
    ├── condtrigs/condtrigs.json             ← 12 fit-gate condtrigs
    ├── interactions/interactions.json       ← GUITradeSacksKiosk (mirrors GUITradeKiosk's checks)
    ├── guipropmaps/guipropmaps.json         ← TraderSacksKiosk (routes the kiosk to its stock table)
    └── loot/
        ├── loot.json                        ← ItmSacksKioskInv (the kiosk's stock, 24 lines)
        └── loot_self_reference.json         ← 25 self-emit wrappers: 24 sacks/buckets + 1 for the kiosk itself (so `spawn ItmSacksKiosk01` resolves)
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
- **Standalone kiosk, debug-spawnable** — ships its own
  `ItmSacksKiosk01` with `aInteractions: [ACTKioskUseNPC,
  GUITradeSacksKiosk]`. Carries `IsKioskNPC + IsTraderNPC` so
  `TIsTradeKiosk` fires; `IsOversized + IsRigid + IsCrate-style
  mapSlotEffects` so `spawn` can place it on the floor and the
  player can drag it. Notably *not* installed (`IsInstalled` is
  fixture-only and breaks `spawn`). Sprite aliases
  `ItmKioskSupplies01`.
- **Self-contained trade chain** —
  `GUITradeSacksKiosk` interaction (mirrors vanilla `GUITradeKiosk`'s
  full us/them chain: `aInverse: [GUITradeCheckOKLGLicensed,
  GUITradeAllow]`, `CTTestUs: TIsHuman`, `CTTestThem: TIsTradeKiosk`).
  The kiosk's `mapGUIPropMaps` routes the `Trader` slot to a new
  `TraderSacksKiosk` guipropmap, which points `strLoot` at
  `ItmSacksKioskInv` — the loot table containing all 24 sacks &
  buckets. The trade UI reads inventory from this chain, so it shows
  our items and only our items.
- **`spawn`-friendly via self-reference loot wrapper** — the kiosk
  has a same-named entry in `loot_self_reference.json` so the debug
  command `spawn ItmSacksKiosk01` resolves it as a loot table that
  emits the actual CO. This is the trick vanilla uses for every
  spawnable item (e.g. `ItmAICargo01`); vanilla *kiosks* lack the
  wrapper because they're placed in ship layouts directly, but for
  a mod-shipped kiosk the wrapper is essential.
- **Self-reference loot wrappers (sacks/buckets)** — `aLoots` refs
  target the `loot/` folder per schema, so each sack/bucket also gets
  a self-emit entry there. Vanilla wraps every aLoots-referenced item
  the same way in `data/loot/loot_self_reference.json`. Without these,
  the kiosk's stock-table aLoots resolves to dangling refs.

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
- **Kiosk does not auto-spawn in ship layouts.** The mod adds the
  kiosk as a CO definition only; placing one in a specific
  ship/station layout would require editing `data/ships/*.json`
  (out of scope for v1). Use `spawn ItmSacksKiosk01` in the debug
  console (BackQuote, after `unlockdebug` if needed) to bring it
  next to the player. Two things have to be true for spawn to work:
  the self-reference loot wrapper (so `spawn` resolves the name)
  and a non-`IsInstalled` profile (so the engine can place it at
  the player's feet rather than trying to instantiate an
  already-installed fixture).
- **Kiosk lands on the floor as a drag-able crate-shaped object,
  not a wall fixture.** It still functions as a trade kiosk —
  `TIsTradeKiosk` fires, the action menu shows "Trade Sacks &
  Buckets" — but visually it's an oversized object you push into
  position rather than something pre-mounted on a wall. v2 (placing
  the kiosk via ship-layout JSON edits) is where the wall-mounted
  fixture form factor comes back.
- **Dismantle integration deferred.** v1 does not yield buckets from
  dismantle — buckets are bought from the kiosk. Adding
  `ItmBucket<Suffix>=0.05x1` to dismantle loot tables is a separate
  patch.
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
4. **Open the debug console** (BackQuote, plus `unlockdebug` once if
   needed) **and spawn the kiosk**:

   ```
   spawn ItmSacksKiosk01
   ```

   It'll appear next to the player. Right-click → "Trade Sacks &
   Buckets" → trade UI opens with all 24 sacks/buckets in stock.
   The kiosk auto-restocks on the `RestockSupplyKiosk` ticker, gated
   by `IsReadyRestock`, same as vanilla supply kiosks.

The mod has no ordering dependency on other mods, but always after `"core"`.

If something doesn't work:

- Confirm the game version in `mod_info.json` (`strGameVersion`)
  matches the version printed on your Ostranauts main menu.
  Mismatches can cause silent load failures.
- `spawn ItmSackTrash` (or any of the 24) should succeed (purple
  command text). If it doesn't, the mod isn't loading — check the
  BepInEx log.
- `spawn ItmSacksKiosk01` should also succeed. If it does but the
  trade UI doesn't open when you interact, check the
  interaction → guipropmap → strLoot chain on the kiosk's detail
  page in the explorer.
- Look at the game's BepInEx log (`BepInEx/LogOutput.log`) for
  loader errors mentioning any of our strNames.

## License

Mod content is original to this repo. The supply-kiosk loot table
contents that are vanilla-copied for the override pattern are © Blue
Bottle Games — included only as the structural minimum needed to
extend those tables.
