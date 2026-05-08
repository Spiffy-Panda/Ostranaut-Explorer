# Sacks and buckets — implementation deep dive

Companion to [sacks-and-buckets.md](sacks-and-buckets.md). The design note
is a one-shot read; this file traces every game mechanic the mod leans
on back to vanilla data and confirms the build path.

Captured 2026-05-07. References `data/` at the repo's pinned game version.

---

## TL;DR — verdict

**Data-only mod. No BepIn / no decomp / no engine code.** Every mechanic
the mod requires is already exercised by vanilla data. The mod is a new
JSON cohort plus three small loot-table edits.

The three vanilla patterns we ride on:

1. **Single-type container filter** is already a real pattern. The
   `TIsFitContainer*` family includes `TIsFitContainerBattery04`,
   `TIsFitContainerEVABattery`, `TIsFitContainerEVABottle`,
   `TIsFitContainerFilterCO2`, `TIsFitContainerNavMod`,
   `TIsFitContainerSOC` (social), `TIsFitContainerDAT`,
   `TIsFitContainerPartsSmall`, `TIsFitContainerBattDisp01`. Each gates
   a container by a single `IsX` marker condition. Sacks and buckets
   are new entries in this same family — no new mechanism required.
2. **Oversized / immobile installable** is already a tag. `ItmCrate01`
   carries `IsOversized=1` + `IsRigid=1` + `IsCrate=1` and uses the
   3×3 grid container model (`nContainerHeight × nContainerWidth`)
   instead of the slot-based pouch model. Buckets are bigger crates
   with a single-type fit gate.
3. **Kiosk stocking** is a `mapGUIPropMaps → guipropmaps → strLoot →
   loot-table aLoots` chain. Adding new items to the supply kiosk
   means appending one line to ~3 existing supply-kiosk loot tables —
   nothing exotic.

---

## Correction on the kiosk-aInverse hypothesis

The "items get added to a kiosk via `GUITradeKiosk.aInverse`" hypothesis
is **directionally right but pointing at the wrong field**.

`aInverse` on an interaction is the *response ladder* — what the target
NPC does back at you. On `GUITradeKiosk` (data/interactions/interactions.json:12336)
it's `["GUITradeCheckOKLGLicensed", "GUITradeAllow"]`, the gating chain
that ends in `GUITradeAllow` whose own `aInverse` is
`["GUITradeUIOpen,[us],[them]"]`. None of these are stock entries.

The actual chain that determines kiosk stock:

- **Kiosk CondOwner** (e.g. `ItmKioskCargo01`,
  data/condowners/condowners.json:16415): has
  `mapGUIPropMaps: [..., "Trader", "TraderCargoKiosk"]`.
- **GUI prop map** (e.g. `TraderCargoKiosk`,
  data/guipropmaps/guipropmaps.json:1491): maps `strLoot` to a loot
  table name like `ItmSupplyKioskBCERInv`. (Cargo kiosks pass null
  because they use the bulk-pod system; standard supply kiosks point at
  loot tables.)
- **Loot table** (e.g. `ItmSupplyKioskBCERInv`,
  data/loot/loot.json:15864): its `aLoots` array is the literal stock
  list — `"ItmBackpack02=0.5x1"`, `"ItmCrate01=0.5x2"`, ... that's
  where new sacks and buckets land.

So the right field is the **`aLoots` array of the supply-kiosk's stock
loot table**, not the `aInverse` of the trade interaction. Same spirit —
"a list of strNames to extend" — different file.

There are 17 kiosk guipropmaps in vanilla
(data/guipropmaps/guipropmaps.json — `TraderCargoKiosk`,
`TraderChargenSupplyKioskBCER`/`BCRS`/(generic), `TraderFactionKioskBCER`/`BCRS`,
`TraderBCERKioskTSDO`, `TraderBCRSKioskTSDO`,
`TraderFlotillaScrapKiosk`, `TraderOKLGFurnishingsKiosk`,
`TraderFurnishingsKioskBCER`/`BCRS`, `TraderOKLGMedKiosk`,
`TraderAerostatScrapKiosk`, `TraderOKLGSupplyKiosk`,
`TraderOKLGSupplyKioskLicensed`, `TraderVORBScrapKiosk`). For v1 we
target only the **supply kiosk family** — those are the "tools and
parts" stockists where bulk containers naturally belong.

---

## Heuristic-matched item list

The user's heuristic — "stackable parts created by dismantle" — maps
cleanly onto items that recur in dismantle-yield loot tables. Method:
collected all 154 loot tables whose `strName` matches
`/(Dismantle|Decon|Strip|Tear|Wreck|Salvage)$/`, tallied each item's
appearance count and summed-max-quantity. Top non-Stat/non-COND items:

| Rank | Item                  | # tables | Total max qty |
|------|------------------------|---------:|--------------:|
| 1    | `ItmScrapTrash`        |      129 |           244 |
| 2    | `ItmPartsMechSmall01`  |      105 |           354 |
| 3    | `ItmScrapSteel`        |       80 |           201 |
| 4    | `ItmPartsElecSmall01`  |       78 |           280 |
| 5    | `ItmComponentMobo01`   |       61 |            83 |
| 6    | `ItmScrapAluminum`     |       54 |           159 |
| 7    | `ItmComponentMotor01`  |       45 |            74 |
| 8    | `ItmHeatSink01`        |       37 |            58 |
| 9    | `ItmScrapCarbonFiber`  |       23 |            43 |
| 10   | `ItmPartsScreen01`     |        9 |             9 |
| 11   | `ItmScrapPlastic`      |        9 |            39 |
| 12   | `ItmScrapClothDirty`   |        7 |            48 |

Below rank 12 the long tail is single-source items (e.g. specific
ship-component salvage). The rank 1–9 cohort is what the heuristic
probably aims at: the items that pile up in the corner during a
salvage run. Twelve candidates is also a clean v1 surface — adding
sack + bucket variants for each is 24 new container COs + 12 new
filter condtrigs.

**Whether `ItmScrapTrash` deserves a bucket is debatable** — it's
"trash", players probably toss it. Still, by frequency it's #1. Easy
include or exclude.

If trimmed to just the high-signal "real parts" — drop the four scrap
metal/plastic/cloth entries, drop trash — the list becomes:

`ItmPartsMechSmall01`, `ItmPartsElecSmall01`, `ItmComponentMobo01`,
`ItmComponentMotor01`, `ItmHeatSink01`, `ItmPartsScreen01` — 6 items,
12 containers, 6 filter condtrigs.

---

## How the existing backpack works (for the template)

Reference: `ItmBackpack01` (data/condowners/condowners.json:5174).

```
"strType"          : "Item",
"strItemDef"       : "ItmBackpack01",          → items.json visual def
"strLoot"          : "ItmPocketsPouchSmx4",    → loot table that
                                                 instantiates 4 slot-
                                                 containers
"strContainerCT"   : "TIsFitContainerBackpack",→ accept gate (this is
                                                 where single-type goes)
"nContainerHeight" : 4,
"nContainerWidth"  : 4,
"aSlotsWeHave"     : [ "pocket_pouchSm01", ..., "pocket_pouchSm04" ],
"aStartingConds"   : [ "IsContainer=1", "IsBackpack=1", ... ],
"mapSlotEffects"   : [ "back", "Backpack01Full", "drag", "Backpack01Full", ... ]
```

Two distinct container styles in vanilla:

- **Slot model** (backpack): `aSlotsWeHave` declares N named pouch slots.
  `strLoot` populates those slots with `PocketPouchSmall01` instances
  (loot string `"PocketPouchSmall01=1x4"`). Each pouch is itself a
  CondOwner with its own `strContainerCT` (`TIsFitContainerPocket`) — so
  there's a nested fit-gate: outer bag gates by *bag-fit* rules, inner
  pouches gate by *pocketability*. The visual is multiple discrete
  pockets in the inventory UI.
- **Grid model** (crate): `nContainerHeight × nContainerWidth` define a
  free-form grid with no inner slot COs. The bag itself has the only
  `strContainerCT`. Visual is one open box.

For sacks and buckets, **the grid model is the cleaner choice**:
single-type buckets are conceptually one open box, not "buckets full of
pre-divided pockets each separately accepting bolts." Stick to
`nContainerHeight × nContainerWidth`, drop `aSlotsWeHave` and `strLoot`.
This also matches `ItmCrate01`'s pattern, which is the closest existing
analogue to a bucket.

Capacity ladder (target: 2–4× the 16-slot backpack — so 32 to 64):

- Sack: 4×4 = 16 (parity with backpack, but single-type, no pouches).
- Bucket small: 6×6 = 36.
- Bucket large: 8×8 = 64.

Sacks omit `IsOversized`, get `IsBackpack` so they fit in cases like a
normal bag. Buckets carry `IsOversized=1` + `IsRigid=1` + `IsCrate=1`
(or a new `IsBucket=1` if we want a distinct dragbehaviour later).

---

## Single-type filter — verbatim template

Battery dispenser pattern, translated for bolts:

```jsonc
// vanilla — battery dispenser only accepts Battery04
{ "strName": "TIsFitContainerBattery04",
  "aReqs":   [ "IsBattery04" ],
  "aForbids":[ ],
  "aTriggers": [ "TIsFitContainerSolid" ],
  "bAND": true }

// new — sack/bucket only accepts ItmPartsMechSmall01
{ "strName": "TIsFitSackPartsMechSmall01",
  "aReqs":   [ "IsItmPartsMechSmall01" ],   // marker cond on the item
  "aForbids":[ ],
  "aTriggers":[ "TIsFitContainerSolid" ],
  "bAND": true }
```

**Open question on marker conditions.** `ItmBattery04` carries
`IsBattery04=1` as a starting cond — that's how `TIsFitContainerBattery04`
recognises it. The 12 dismantle-yield items above need similar marker
conds. Two of them already have category-style markers
(`ItmPartsMechSmall01` carries `IsPartsSmall`,
`ItmPartsElecSmall01` likely the same), so for those two we can reuse
the existing `TIsFitContainerPartsSmall` filter. The scrap and component
items need fresh `IsItm*` markers added to their `aStartingConds`. That
is itself a tiny edit — append `"IsItmScrapSteel=1.0x1"` to the item's
existing condowner entry.

---

## Files that need modifying

The mod is a sibling root tree under `spiffy-mods/mods/SacksAndBuckets/`,
with filenames mirroring base-game `data/<folder>/<file>.json` so the
mod loader matches them up by name. v1 ships the full 12-item cohort
(per "modders aim overpowered to demonstrate the mechanic"; trim to
scrap-only if upstreamed).

v1 architecture — **standalone kiosk, debug-spawnable, no vanilla
overrides**. The mod ships a self-contained
`GUITradeSacksKiosk` interaction + `TraderSacksKiosk` guipropmap +
`ItmSacksKioskInv` loot table + `ItmSacksKiosk01` kiosk CO + a
self-reference loot wrapper for the kiosk so `spawn ItmSacksKiosk01`
resolves. Putting the kiosk into vanilla ship layouts is a v2 task.

**Spawn-requires-self-reference: the lesson the in-game tests
flushed out.** The first `ItmSacksKiosk01` build wouldn't spawn —
turned out `spawn` resolves its argument as a *loot-table* name and
runs that table to emit the CO. Vanilla items like `ItmAICargo01`
have a same-named entry in `data/loot/loot_self_reference.json`
(`aCOs: ["ItmAICargo01=1.0x1"]`) — that's the wrapper that makes
`spawn ItmAICargo01` work. Vanilla *kiosks* (`ItmKiosk01`,
`ItmKioskCargo01`, `ItmKioskSupplies01`) lack the wrapper because
they're placed in ship layouts directly, never spawned. A
mod-shipped kiosk that wants to be debug-spawnable needs the
wrapper, full stop.

Two earlier architecture attempts and why we left them:
- *Vanilla supply-kiosk loot table override* — full-copy of three
  long aLoots arrays + 24 appended lines. Worked in the explorer
  but didn't show up in-game; brittle to vanilla content patches
  and needed a re-sync generator.
- *Interaction-only, no kiosk* — `GUITradeSacksKiosk` with same
  checks as vanilla `GUITradeKiosk` was supposed to surface on any
  kiosk passing `TIsTradeKiosk`. The interaction didn't appear on
  vanilla kiosks at all (suggesting the action menu surfaces only
  what's explicitly in a CO's `aInteractions`), and even if it had,
  the trade UI's inventory comes from `[them].mapGUIPropMaps[Trader]`
  → guipropmap → `strLoot` — set on the *kiosk*, not the interaction
  — so it would have shown vanilla stock anyway.

| File (new)                                                                            | Contents                                                                                                                                |
|---------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| [spiffy-mods/mods/SacksAndBuckets/README.md](../../spiffy-mods/mods/SacksAndBuckets/README.md) | Mod overview, install notes, caveats.                                                                                                  |
| [spiffy-mods/mods/SacksAndBuckets/data/condtrigs/condtrigs.json](../../spiffy-mods/mods/SacksAndBuckets/data/condtrigs/condtrigs.json) | 12 new `TIsFitContainer*` fit-gates — one per item type. Sack and bucket of the same item share the gate.                              |
| [spiffy-mods/mods/SacksAndBuckets/data/condowners/condowners.json](../../spiffy-mods/mods/SacksAndBuckets/data/condowners/condowners.json) | 24 container CO entries (sacks at 8×8 = 64 slots, 4× backpack; buckets at 16×16 = 256, 16× backpack) + `ItmSacksKiosk01` kiosk CO. Containers alias `ItmBackpack02`/`ItmCrate01` art; kiosk aliases `ItmKioskSupplies01`. Note: 16×16 goes past vanilla's largest grid container (`ItmDolly02` at 6×6 = 36); above 6×6 vanilla switches to `IsInfiniteContainer` -- UI rendering at 16×16 is empirically unverified. |
| [spiffy-mods/mods/SacksAndBuckets/data/interactions/interactions.json](../../spiffy-mods/mods/SacksAndBuckets/data/interactions/interactions.json) | `GUITradeSacksKiosk` interaction. Mirrors `GUITradeKiosk`'s us/them chain (full `aInverse: [GUITradeCheckOKLGLicensed, GUITradeAllow]`). |
| [spiffy-mods/mods/SacksAndBuckets/data/guipropmaps/guipropmaps.json](../../spiffy-mods/mods/SacksAndBuckets/data/guipropmaps/guipropmaps.json) | `TraderSacksKiosk` guipropmap. Routes the kiosk's `Trader` slot to `strLoot: "ItmSacksKioskInv"`; reuses vanilla restock/discount/CTs entries. |
| [spiffy-mods/mods/SacksAndBuckets/data/loot/loot.json](../../spiffy-mods/mods/SacksAndBuckets/data/loot/loot.json) | `ItmSacksKioskInv` loot table — the kiosk's stock. 24 lines, all sack/bucket. |
| [spiffy-mods/mods/SacksAndBuckets/data/loot/loot_self_reference.json](../../spiffy-mods/mods/SacksAndBuckets/data/loot/loot_self_reference.json) | 25 self-emit loot wrappers: 24 sacks/buckets (so the kiosk's `aLoots` resolves) + 1 for `ItmSacksKiosk01` itself (so `spawn ItmSacksKiosk01` works). |
| [spiffy-mods/mods/SacksAndBuckets/data/items/items.json](../../spiffy-mods/mods/SacksAndBuckets/data/items/items.json) | 24 ItemDef entries (one per container). Each `strImg` points at a generated PNG in `data/textures/` (composited from base sack/crate + scavenge-material overlay). |

**No edits to base-game `data/`.** Every entry is additive — the mod
contributes new strNames in well-known folders, and the load order
ensures they merge alongside vanilla.

**Zero new marker conditions needed:** every one of the 12 items
already carries a distinguishing `Is*` cond
(`IsTrash`, `IsSteel`, `IsMobo`, `IsAluminum`, `IsMotor`, `IsHeatSink`,
`IsCarbonFiber`, `IsScreen`, `IsPlastic`, plus paired
`IsPartsSmall+IsMechanical` / `IsPartsSmall+IsElectronic` / 
`IsScrap+IsSheet+IsDirty`).

Generators live with the mod under
[spiffy-mods/util/SacksAndBuckets/](../../spiffy-mods/util/SacksAndBuckets/),
driven by a single
[config.yaml](../../spiffy-mods/util/SacksAndBuckets/config.yaml) that
holds dimensions, the item table, kiosk-stock weights, and sprite-gen
properties. All four scripts share `_lib.py` (config loader + JSON
writer):

- `emit_condowners.py` — 25-entry condowners.json (24 containers + kiosk).
- `emit_items.py` — 24-entry items.json (one ItemDef per container; supplies the strImg sprite name).
- `emit_loot.py` — `loot.json` (kiosk stock table) + `loot_self_reference.json` (25 wrappers, including the kiosk so spawn resolves).
- `emit_sprites.py` — composites scavenge-material PNGs onto base sack/crate art via PIL/Pillow. Reads from a `sprite_sources/` staging dir (gitignored, you fill manually from your game install).
- `emit_all.py` — runs all four in order.

The shift from PowerShell to Python was driven by the config.yaml:
Windows PowerShell 5.1 has no native YAML, and adding a module
dependency for ad-hoc tooling was the worse trade vs. switching to
Python (which already has lots of repo tooling under
[utils/python/](../../utils/python/)). Pillow also gives a clean
image API for the sprite generator that PowerShell would have had to
shell out for.

If the user wants the dismantle-yields-bucket flow on top of the kiosk
flow, add one more file (also in the mod tree):

| File                                                  | Contents                                                                                                |
|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `spiffy-mods/mods/SacksAndBuckets/data/installables/installables_dismantle.json` | Override targeted dismantle entries' `strLootOut` to point at a new loot table that yields the bucket. |

This is independent of the kiosk path and can ship later.

---

## Why no BepIn

For each candidate "code-side trick" we'd have needed:

| Concern                                                | Vanilla mechanism                          | BepIn needed? |
|--------------------------------------------------------|--------------------------------------------|---------------|
| Filter container by single item type                   | `TIsFitContainer*` family (10+ examples)   | No            |
| Make a container immobile / dragged / installable      | `IsOversized`, `IsRigid`, `IsCrate` tags   | No            |
| Define container capacity                              | `nContainerHeight × nContainerWidth`       | No            |
| Stock new items in a kiosk                             | Loot-table `aLoots` append                 | No            |
| Yield item from dismantle                              | `installables_dismantle.strLootOut` table  | No            |
| Define an "accept-only-X" rule on a slot/container     | `aReqs` / `aForbids` on the fit condtrig   | No            |
| New marker condition (`IsItmFoo`)                       | `conditions/conditions.json` row           | No            |

There is **no point** in this design where the game must be taught a
new behaviour. Sacks-and-buckets is a recombination of existing parts.

---

## Risks / open before-build checks

1. **Container CT is set on the OUTER bag CO**, not on the slot. For
   the grid model that's fine — there's no inner slot CO. For the slot
   model, vanilla behaviour suggests both layers gate (outer
   `TIsFitContainerBackpack` + inner `TIsFitContainerPocket`); if we
   stick to grid mode we sidestep this.
2. **Marker-condition naming.** Picking `IsItmPartsMechSmall01` vs
   reusing `IsPartsSmall` matters for blast radius. Reusing
   `IsPartsSmall` means *every* `TIsFitContainerPartsSmall` container
   in vanilla now also accepts our new bucket, and that bucket now
   accepts anything `IsPartsSmall`. That's not single-type — it's
   category-type. For true single-type, we need fresh per-item markers.
3. **Dismantle yield is multi-target.** If we add `ItmBucket*` to a
   dismantle loot table, the bucket spawns separately from its
   parts; it doesn't auto-fill. v1 ships the bucket empty and the
   player loads it manually. (Auto-fill would need to verify how
   `aLoots` versus `aCOs` placement targeting works — sibling-of-self
   vs. dropped-on-floor.)
4. **Visual assets** are out of scope of the data audit but in scope
   of the mod. Each container needs a sprite. Vanilla sprite naming
   convention is `paperdoll/<itemDef>` for portrait + 2D
   `<itemDef>` for the in-grid icon. That's an asset task, not a
   schema task.
5. **`mapAltItemDefs` for full vs empty visual**. `ItmBackpack03`
   has `["IsSolid", "ItmBackpack03Full"]` to swap between empty/full
   sprites — the bucket can use the same trick to render distinct
   "empty bucket" and "full bucket" art if desired.

None of these block v1; they're ordinary content-mod judgment calls.

---

## Open questions carried forward from the design note

- Dismantle math (capacity scaling vs. fixed) — still open, see design
  note.
- Whether the v1 cohort is the trimmed 6-item or the full 12-item list.
- Whether to share fit gates between sack and bucket (recommended; same
  item-type, same gate) or split them so future tuning can diverge.
