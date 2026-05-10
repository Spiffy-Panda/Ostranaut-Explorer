# User story — Starter Ship Plus Mod

**Source mod:** `test-data/mods/FreeTraits_and_StarterShipPlus/StarterShipPlusMod/`
**Original mod by:** jwebmeister — https://github.com/jwebmeister
**Mod version:** 0.3 (game version 0.12.0.6)

---

## The goal

A modder has played enough Ostranauts to know that the default starter ships are
small and burdened with a mortgage. They want a mod that replaces the starter ship
selection with high-tier ships — Halberd, Mesa, Ocelot — fully owned, no mortgage,
starting near Ok-Leg station with some damage already on the hull (so it doesn't
feel like a cheat, just a different premise).

They know what they want in the game. They do not know where character-creation ship
selection lives in the data, or how "no mortgage" is expressed.

---

## The journey

### Step 1 — Find where character creation hands the player a ship

The modder searches for a ship name they know from character creation — say `Halberd`.
The explorer returns `loot:CGEncShipHalberd` with `strType: ship` and
`aCOs: ["Halberd=1.0x1"]`.

The incoming refs panel shows `lifeevents:CGEncShipHalberdTake` referencing it via
`strShipRewards`. That life-event entry has `bShipOwned: true` and `fShipMortgage: 0.0`.

**Explorer outcome:** The modder learns the chain:
- A `loot/` entry with `strType: ship` names the ship.
- A `lifeevents/` entry references that loot via `strShipRewards` and controls
  ownership (`bShipOwned`) and mortgage (`fShipMortgage`).

### Step 2 — Understand the ship encounter structure

From the `CGEncShipHalberdTake` life event the modder follows outgoing refs and finds
the chain:

```
CGEncShipbreakerShipEvents (loot, strType:lifeevent)
  aCOs → CGEncShipHalberdIntro | CGEncShipMesaIntro | CGEncShipOcelotIntro  [triggers]
  each trigger → CGEncShipXTake  [life event]
  CGEncShipXTake.strShipRewards → CGEncShipX  [loot, strType:ship]
  CGEncShipX.aCOs → Halberd / Mesa / Ocelot  [condowners, strType:ship]
```

The starting-ship loot table `CGEncShipbreakerShipEvents` is the entry point. It is
referenced by the Shipbreaker career via `aEventsShip`.

**Explorer outcome:** The modder can see the full chain without reading raw JSON. They
know which entries to override and in which order.

### Step 3 — Understand fShipDmgMax and fStartATCRange

On the `CGEncShipHalberdTake` detail page, the Fields block shows:
- `fShipDmgMax: 0.6` — the ship starts at up to 60% damage.
- `fStartATCRange: 7.0` — spawns within 7 units of the start ATC.
- `strStartATC: "OKLG"` — spawns near Ok-Leg station.
- `bShipOwned: true` — no mortgage.
- `fShipMortgage: 0.0` — mortgage value is zero.

The inline field descriptions explain what each controls.

**Explorer outcome:** The modder knows the exact fields to tune for starting conditions
without reverse-engineering the game's character-creation screen.

---

## Files in the mod's implementation

| File | What it does |
|---|---|
| `data/loot/loot_startershipmod.json` | Overrides `CGEncShipbreakerShipEvents` (the ship-selection loot table) to offer Halberd, Mesa, Ocelot as equal-probability picks. Also defines the `CGEncShipX` ship-loot entries pointing at the ship condowners, plus the trigger stubs (`CGEncShipXIntro/Cont/Take`) with empty interaction payloads that hand off to the life events. |
| `data/lifeevents/lifeevents.json` | Overrides the `CGEncShipXTake` life events with `bShipOwned: true`, `fShipMortgage: 0.0`, `fShipDmgMax: 0.6`, `fStartATCRange: 7.0`, `strStartATC: "OKLG"`. This is where "no mortgage, starts near Ok-Leg" lives. |
| `data/interactions/interactions.json` | Overrides the `CGEncShipXIntro/Cont/Take` interaction stubs — these chain the life-event triggers together. The mod versions clear the interaction body so the vanilla encounter dialog doesn't fire. |
| `mod_info.json` | Loader identification. |

---

## What the explorer needs to show for this story to succeed

- Searching `Halberd` (a ship name the modder knows) reaches `loot:CGEncShipHalberd`
  and from there the full encounter chain is navigable via the incoming/outgoing refs
  panels — no manual folder browsing required.
- The `strType: ship` badge on the loot entry signals "this is a ship grant, not an
  item grant" without requiring the modder to already know the `strType` dispatch rule.
- `bShipOwned` and `fShipMortgage` on the life-event detail page have inline
  descriptions that explain what "owned" vs. "mortgaged" means mechanically.
- The `strShipRewards` field on the life event has an outgoing ref link to the ship
  loot entry, so the modder can follow the chain forward as well as backward.
- The `aEventsShip` field on the Shipbreaker career links back up to
  `CGEncShipbreakerShipEvents`, making the entry point discoverable from the career
  side too.
