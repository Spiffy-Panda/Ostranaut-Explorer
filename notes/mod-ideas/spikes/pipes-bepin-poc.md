# Mod feasibility spike — pipes BepInEx POC

Minimum-viable C# pipe component. Active intake / passive output, no
logistics intelligence. Builds on the conclusions from the
[data-only strawman](pipes-porter-drone.md): the porter-drone confirms
that buckets-as-filters work, and motivates a real component instead
of a walking person.

POC goal: prove that an item moves from a crate next to an Active
Intake to a tile (or container) next to a Passive Output, the player
wired the two together via the standard signal-wire UI, and rebuilding
the network is no harder than rebuilding a gas circuit.

Captured 2026-05-07.

## What this kind of doc is

A **feasibility spike** for the BepInEx-side counterpart to the data-only
strawman. Same `notes/mod-ideas/spikes/` folder, same "explore-and-
document, no commitment to ship" character. See
[pipes-porter-drone.md](pipes-porter-drone.md) for the full term notes.

---

## Design sketch (player-facing)

### Active Intake
- Powered installable, occupies one tile.
- Non-obstructing — items can sit on its tile (mirrors the gas pump's
  intake-tile behavior).
- Control panel: on/off knob.
- Configure UI: list of wired Passive Outputs, edited via the same
  signal-wire mechanic as a pump-to-pressure-sensor wiring (each
  `strInput0N` slot picks a target by clicking on it in-world).
- Behavior: while powered + on, every `fTickPeriod` seconds, scan the
  tile beneath for a CondOwner with inventory. If found, pick one item
  from its first non-empty slot. Try each wired Passive Output in
  index order: if the output accepts the item (rules below), transfer
  there and stop. If none accept, return the item.

### Passive Output
- Unpowered installable, occupies one tile.
- Non-obstructing tile.
- Three-state knob: **Disabled** | **Container only** | **On**.
- No configure UI. Sidebar shows the count of Active Intakes that have
  this output wired (read by reverse-walking the ship's guipropmaps on
  panel-open).
- Acceptance:
  - **Disabled** — refuses every transfer.
  - **Container only** — accepts only if a CondOwner with inventory is
    on its tile and the item fits the container's slot accept rules.
  - **On** — same as above; if no container is present, drops the item
    on the tile floor instead.

Wiring is the existing signal-wire mechanic. There is no dedicated
"pipe network" entity — connectivity is the union of `strInput0N`
references across all Active Intakes.

---

## Open questions — resolve before writing code

Each is a half-day of decomp reading; resolving up-front keeps the
implementation phase from stalling.

- **Dispatcher patch site.** Where exactly is the `aUpdateCommands`
  switch chain, and what's the cleanest Harmony hook? Per
  [ComponentIndexer.md](../../../CodeDocs/sources/Ostranauts.Decomp/ComponentIndexer.md),
  it's in `CondOwner.cs`'s `AddCommand`. Confirm method signature and
  whether a Postfix branch-add is sufficient or if a Transpiler is
  needed.
- **LaunchControl vs. raw Harmony.** The
  [Modding/Pledges](../../../wiki_cache/markdown/Modding__Pledges.md)
  doc favors LaunchControl for pledge-type registration — does it
  also offer an `aUpdateCommands`-component registration helper?
  Prefer it if so; falls back to raw Harmony if not.
- **Power state read.** Does `Electrical` expose a "this CO is powered
  right now" condition the component can poll
  (`co.HasCond("IsPowered")`?), or does the component subscribe to a
  power event? Phase 2 docs show `Electrical` reading `strGPMKey` from
  a guipropmap; trace from there to the powered-state surface.
- **strInput0N resolution.** Confirm the Phase 3 trace —
  `dict["strInput0N"]` → `ship.GetCOByID(value)` → CondOwner instance
  — actually returns a *live runtime instance* the component can call
  into, not just a strName.
- **Slot accept API.** What does the engine call to test "does this
  slot accept this CO?" Likely `Slot.AcceptCheck(CondOwner)` or
  `CondOwner.CanAddCO(co)`. Find it; that's the function the Passive
  Output reuses for container-mode acceptance.
- **Tile-floor drop API.** How does an existing component drop an item
  onto a *specific* tile (not the random-spread `DropCOsNearby`)?
  Trace the loot-spawn path or the inventory-eject path.
- **Inventory iterate API.** Confirm `co.GetSlots()` (or equivalent) +
  `slot.GetCO()` give a usable per-slot first-item view.
- **Non-obstructing tile flag.** Find the field on `JsonItem` /
  `JsonInstallable` that makes a tile floor-walkable / item-droppable.
  Match the gas pump intake.

---

## Phasing — seven steps from "nothing" to "demoable POC"

Each phase ships a runnable thing. No phase requires the next.

### Phase 0 — plugin scaffold + dispatcher patch
- BepInEx plugin project, `netstandard2.1`, references game assemblies.
- Harmony scaffold + `[BepInPlugin]` class.
- Postfix-patch the `AddCommand` dispatcher: when
  `array[0] == "ItemPipeIntake"`, `gameObject.AddComponent<ItemPipeIntake>()`.
- A `JsonCondOwner` with `aUpdateCommands: ["ItemPipeIntake"]` loads
  without error.
- **Done when:** plugin loads, the test CondOwner spawns, no console
  errors.

### Phase 1 — proof-of-life component
- `ItemPipeIntake : MonoBehaviour`, hardcoded 1Hz tick that logs
  `"[ItemPipe] tick on {co.strName} at {pos}"`.
- No transfers. Just observability that the component is alive and on
  the right CondOwner.
- **Done when:** placing the test CondOwner produces 1 log line per
  second.

### Phase 2 — real single-tile transfer (no wiring)
- Tick scans the tile beneath the intake for an inventory-bearing
  CondOwner. If found, takes one item and drops it on an *adjacent*
  tile (any).
- No power, no on/off, no wiring yet.
- **Done when:** placing intake + a stocked crate beneath causes one
  item per second to appear next to the intake.

### Phase 3 — Passive Output + signal-wire wiring
- `ItemPipeOutput : MonoBehaviour`, mostly bookkeeping (target end of
  wiring, no active behavior yet).
- GUIPropMap on the intake exposing `strInput01..04` slots for player
  wiring (four is arbitrary; cap can rise later).
- Intake reads `strInput0N` at tick time, resolves via
  `ship.GetCOByID`, drops the item on the resolved output's tile
  instead of an adjacent one.
- **Done when:** wiring intake to a remote output transfers items
  across distance; unwired intake falls back to local-tile drop from
  Phase 2.

### Phase 4 — output knob + acceptance check
- Three-state knob in output's GUIPropMap (Disabled / Container-only /
  On).
- Container-only: intake's transfer first looks for a CondOwner with
  inventory on the output tile. If present and the slot accept rule
  passes, transfer into the slot. Otherwise the transfer is refused
  and the intake tries the next wired output.
- On: same, but on no container (or refusing container), drop on the
  output's tile floor.
- Disabled: refuse unconditionally.
- **Done when:** wiring intake to two outputs, one with a "bolts-only"
  bucket beneath and one with a "cables-only" bucket beneath, sorts
  a mixed source crate correctly into the right buckets.

### Phase 5 — power + on/off
- Add `Electrical` to the intake's `aUpdateCommands`.
- On/off knob in the intake's GUIPropMap (`bOn` field, standard
  panel pattern).
- Tick checks the powered-state condition (resolved in open
  questions) and the `bOn` knob before doing anything.
- **Done when:** unplugging power stops transfers; flipping the knob
  off stops transfers; both states recover when restored.

### Phase 6 — sidebar count + save/load polish
- On Passive Output panel-open, walk the ship's CondOwners, find every
  intake whose `strInput0N` resolves to *this* output, count and
  display.
- Re-skin sprites for both pieces.
- Save / quit / reload round-trip: wires + knob states must survive.
- **Done when:** reloaded save preserves a working pipe network and
  the output panel shows correct inbound count.

---

## JSON parts (ship alongside the C# DLL)

- `condowners/condowners_pipes.json` — `COItemPipeIntake`,
  `COItemPipeOutput` definitions with `aUpdateCommands` listing the
  new components plus `Electrical` on the intake.
- `installables/installables_pipes.json` — install actions.
- `guipropmaps/guipropmaps_pipes.json` — intake panel
  (`bOn` + `strInput01..04`), output panel (knob).
- `items/items_pipes.json` — sprite + tooltip refs, non-obstructing-
  tile flag.
- `slots/slots_pipes.json` — output's beneath-tile inventory slot.
- `cooverlays/cooverlays_pipes.json` — friendly names, descriptions.

---

## Out of scope for the POC (deferred to Smart Logistical phase)

- Per-output filtering on the intake side. Outputs filter themselves
  via the bucket they sit on.
- Round-robin / priority / balanced distribution. POC is fixed-order:
  try wired outputs in `strInput01..04` index order, first to accept
  wins.
- Multi-item-per-tick transfer rates.
- Cross-ship piping.
- Pipe segments / visible network graph. Wires are abstract; no
  physical pipe path.
- Power cost balancing.
- Filter-by-charge-level (the [pipes.md](../pipes.md) "battery shelf"
  variant).

---

## Risks / unknowns

- **Save format.** Components added via `aUpdateCommands` re-attach on
  load via the dispatcher — confirm during Phase 6 that no mid-tick
  state is lost.
- **Acceptance side-effects.** If `slot.AcceptCheck` mutates state
  (unlikely but possible — gas slots run signal calculations on
  query), the intake's "try each output in turn" loop could double-
  fire. Verify the accept call is pure.
- **Refused-give item destruction.** Non-issue here because we never
  use `aLootItms`-shaped transfers — the C# component calls
  `slot.AddCO(co)` (or equivalent) directly and bails on `false`
  return. Worth flagging back to the strawman as a verify-before-ship
  item there.
- **Tile-stacking visuals.** If multiple Active Intakes wire to one
  Passive Output and dump items on the same tile, items pile up
  visually. The game's existing tile-stack handling should cope;
  verify during Phase 6.

---

This POC stops at "items move; bucket sorting works; player wired it
themselves." Smart logistical components — priority queues, balanced
distribution, cross-ship pipes, runtime filter editors, per-item-kind
limits — are explicitly the next-iteration design exercise.
