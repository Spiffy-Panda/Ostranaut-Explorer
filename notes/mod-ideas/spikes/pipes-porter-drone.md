# Mod feasibility spike — pipes via porter-drone

Strawman implementation of [pipes.md](../pipes.md) using only data. The
goal is not to ship this as the final shape — it's to prove the wiring
works end-to-end so the case for a BepInEx-side pipe component becomes
concrete instead of abstract.

Captured 2026-05-07.

## What this kind of doc is

A **feasibility spike** that documents a **strawman implementation** —
a deliberately ugly baseline whose purpose is to be replaced. Adjacent
named terms: *tracer bullet* (Hunt & Thomas — skinny end-to-end build
validating the wiring), *feasibility spike* (time-boxed agile
exploration, no ship commitment).

If a future doc explores something else this way, it lands here under
[notes/mod-ideas/spikes/](.) next to this one.

---

## Premise

A drone CondOwner walks between a source crate and N destination crates
the player has assigned, attempting to push items from source to
whichever destination accepts them. Acceptance is determined by each
destination's slot accept rules — the [sacks-and-buckets](../sacks-and-buckets.md)
mod slots in here. The drone has no `Stat*` and no biological pledges;
it is a stripped Crew-class entity that exists only to courier.

The strawman is intentionally crew-shaped, not pipe-shaped. The point
is to prove the data-only path can do the job at all, so that the
BepInEx upgrade has a clean "before / after" to point at.

---

## JSON parts list

### `condowners/`
- `CODroneCarrier` — `strType: "Crew"`, no `personspecs.strLootIAAdds`
  reference (skips the lifetime survival pledges from
  [Modding/Pledges](../../../wiki_cache/markdown/Modding__Pledges.md)),
  single carry slot, no `aTickers`. One starting pledge slot reserved
  for `DronePullSource`.

### `slots/`
- `SlotDroneCarry` — single-item slot on the drone, accepts anything
  bucket-accepted.

### `pledges/`
- `DronePullSource` — `strType: "repeat"`, `strThemID: "[them]"`,
  `strIATrigger: "IADronePullCheck"`. One slot, bound to the source
  crate at assign-time via the `[them]` placeholder.
- `DronePush01` … `DronePushNN` — same shape, one pledge `strName` per
  destination slot. The mod author picks N (4 is reasonable). Each is
  bound to its destination crate via `[them]` at assign-time.

### `interactions/`
- `IADroneEnterConfig` / `IADroneExitConfig` — toggle the
  `IsDroneConfigMode` condition on the drone.
- `IADroneAssignSource` — `[us]=drone`, `[them]=crate`. Gated by
  `CTTestUs: HasIsDroneConfigMode`. Adds `DronePullSource` to drone
  with `strThemID: "[them]"`.
- `IADroneAssignDest01` … `IADroneAssignDestNN` — same shape, each
  gated by a `CTTestUs` requiring all prior slots bound and this one
  free. Adds `DronePush0K`.
- `IADronePullCheck` — per-tick pull action. `aLootItms` lists
  `take,LootDroneItem_<Kind>` for every supported item kind.
  `CTTestUs` requires the carry slot empty.
- `IADronePush01Check` … `IADronePushNNCheck` — per-tick push action.
  `aLootItms` lists `give,LootDroneItem_<Kind>` for every supported
  item kind. Destination slot rejects items it doesn't accept.
- `IADroneClearDest0K` — `strPledgeRemove: "DronePush0K"`. Lets the
  player un-bind a destination slot for re-assignment.

### `loot/`
- `LootDroneItem_Bolt`, `LootDroneItem_Cable`, … — one loot per
  supported item kind, `strType: "item"`, `aCOs: ["<ItemStrName>=1.0x1"]`.
  The set of loots authored is the set of item kinds the pipe knows
  about. New items from other mods don't flow without authoring
  another loot here.

### `condtrigs/`
- `CTDroneConfigMode` — passes when the drone has `IsDroneConfigMode`.
- `CTDroneSlot0KFree` / `CTDroneSlot0KBound` — gate which assignment
  interaction is offered next, based on
  `HasDroneDest0K`-style condition presence.
- `CTDroneCarryEmpty` / `CTDroneCarryFilled` — gate pull vs. push
  cycles.

### `conditions/`
- `IsDroneConfigMode` — set on drone while configuring.
- `HasDroneDest01Bound` … `HasDroneDestNNBound` — set when each
  destination pledge is added; cleared by the corresponding
  `IADroneClearDest0K`.

### `installables/`
- `InstDroneCarrierBuild` — buildable that spawns `CODroneCarrier`.

### `cooverlays/` / `items/`
- Sprite + tooltip for the drone and its install action. Reskin a
  small existing item; nothing structural here.

---

## Player workflow

1. Build a drone via `InstDroneCarrierBuild` somewhere on the ship.
2. Click drone → "Configure". Drone gets `IsDroneConfigMode`.
3. Click the crate that holds raw input → "Assign as source".
   `DronePullSource` is added to the drone with `[them]` bound to that
   specific crate instance (per
   [strThemID semantics](../../../wiki_cache/markdown/Modding__Pledges.md)).
4. Click each filtered bucket → "Assign as destination N". Each one
   adds the next-numbered `DronePush0K` pledge.
5. Click drone → "Done configuring". `IsDroneConfigMode` cleared.
6. Drone begins walking: source → push01 → … → pushNN → source.

To reassign: click drone → "Clear destination K", then re-assign.

---

## Hard limits — why this is a strawman

Each of these is a place where the data-only version is visibly worse
than a BepInEx pipe component would be.

- **Walking, not piping.** The drone occupies one tile and physically
  traverses to every destination. Multi-room networks need multiple
  drones with overlapping pledge sets. Visually reads as "obedient
  courier," not "pipe."

- **Item kinds are enumerated at authoring time.** The set of
  supported items is whatever loots the mod ships. Items added by
  other mods don't flow.

- **Destinations are capped at N.** `DronePush01..NN` are pre-authored;
  the player can't grow the list past N at runtime.

- **No acceptance-aware routing.** The drone walks every destination
  every cycle. It carries an item to D1, gets rejected, walks to D2,
  rejected, … until one accepts or it returns home. With M item kinds
  and N destinations, worst-case walk per cycle is O(M·N).

- **Rejection-on-give must be non-destructive.** `give,LootX` against
  a slot that refuses the item must return the item to the drone, not
  destroy it. The runtime
  [`bDestroyItem` ghost field](../../../comment_mod/data/schemas/interactions-schema.json)
  on `give` verbs is parsed from `aLootItms`; verify the
  rejection-path default before shipping. If items vaporize on
  refused-give, this whole approach loses inventory.

- **Reassignment ergonomics.** Pledges are `strName`-keyed. The
  player can clear destination K by name but can't query "which crate
  is destination 3 right now?" without a UI hook the data layer
  doesn't provide.

- **Crew roster pollution.** `strType: "Crew"` drones show up in the
  crew list, can be toggled into manual mode, take work-budget
  cycles, and inherit Crew UI assumptions. Hideable cosmetically;
  structurally still a person.

- **No filter introspection.** The drone doesn't know what each
  destination accepts. It can't pre-sort. It can't tell the player
  "destination 2 will never accept anything in the source — you wired
  this wrong."

---

## Upgrade path — the BepInEx pipe this motivates

A new `aUpdateCommands` branch — call it
`ItemPipe,sourceSlotKey,acceptCT,…` — implemented as a
`MonoBehaviour` (joining the existing 14 enumerated in
[ComponentIndexer.md](../../../CodeDocs/sources/Ostranauts.Decomp/ComponentIndexer.md))
collapses every limit above:

- **Single tile, no walking.** The pipe is a `code-component` on an
  installable, not a person.
- **Iterates source contents at runtime.** No item-kind enumeration in
  loot — the pipe walks the source crate's slot list directly.
- **Pre-checks slot acceptance.** Engine slot-accept API is callable
  from C#; the pipe asks "would you accept this?" before moving
  anything.
- **Unbounded destinations.** Destinations are stored in a runtime
  list keyed by CondOwner instance, not by `strName`-keyed pledges.
- **No crew-roster pollution.** Pipe is an item, not a person.
- **JSON for buckets stays unchanged.** Same single-type-container
  abstraction, replaced courier.

The strawman is worth shipping anyway because:

1. It proves the buckets/sacks half is correct. If single-type
   containers plus a brute-force porter sort items as advertised, the
   filter design is sound and the BepInEx pipe is just a faster
   implementation of the same abstraction.
2. It gives the BepInEx upgrade a clean before/after demo. Same JSON
   for buckets, replace one CondOwner definition plus delete N
   pledges/interactions, and the same network keeps working.
3. It's funny.
