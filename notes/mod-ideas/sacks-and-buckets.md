# Mod idea — sacks and buckets

Single-type containers created by dismantling stackables. Each sack or
bucket holds exactly one kind of object — the kind it was dismantled
from. That single-type rule is the whole design: it's both the
constraint and the feature, because it gives downstream systems
(see [pipes.md](pipes.md)) something to key off of without a separate
filter-config UI.

Captured 2026-05-07.

---

## Variants

- **Sack** — backpack-class inventory. Worn, stows in cases. Same size
  class as the existing 16-slot backpack (give or take).
- **Bucket** — installable. Has to be placed and dragged around to move.
  Big payoff for the inconvenience: **2–4× the 16-slot backpack** — call
  it 32 to 64 slots per bucket.

## Creation

Dismantling a stackable part yields one sack or bucket of that part
type. Open question: does dismantling a stack of N items give you one
sack/bucket of capacity N, or a fixed-size container with N items in it?
Probably the latter (fixed-size, single-type), with the dismantled count
filling some of the slots.

## Why this shape

- Players already organize loose-pile chaos by stuffing similar things
  in the same case. This mod reifies that habit as a first-class object,
  with a real capacity bonus as the carrot.
- The single-type filter is *implicit* — no UI config, no enum dropdown
  per container. You get the filter for free from the dismantle step.
- Pairs with [pipes](pipes.md): a bucket-of-X is automatically a
  filter-for-X, so a pipe network of buckets sorts itself.

---

## Where this lives in the data (for later)

When fleshing this out into actual JSON, the likely-involved folders
are:

- [data/installables/](../../data/installables/) — bucket definitions.
- [data/items/](../../data/items/) — sack item definitions.
- [data/slots/](../../data/slots/) and
  [data/slot_effects/](../../data/slot_effects/) — accept-criteria
  wiring; the "what does this container accept" rules live near here.
- [data/loot/](../../data/loot/) — dismantle-yields-bucket loot tables
  (keyed off the dismantled item's `strType`).

Pull these into the explorer and trace `aSlotsWeHave` / accept rules to
see how existing single-type containers (if any) pull this off.

---

## Open questions

- Dismantle math — one bucket per source stack, or scaled capacity?
- Is "single-type" enforced via the existing slot accept system, or
  does it need a new gating rule?
- Sack-in-case nesting — does the existing backpack-in-case rule cover
  it, or does sack need its own slot tag?
- Bucket drag mechanic — does Ostranauts already have a drag-the-heavy-
  thing model that buckets can ride on?
