# Mod idea — pipes

A pipe sucks items out of a source inventory and pushes them toward
downstream inventories, item-by-item, gated by what each downstream
inventory will accept. The "filter" is implicit in the destinations'
own accept rules — no per-pipe filter config.

Captured 2026-05-07.

---

## Setup

- Place a crate (or any inventory) at the pipe's "intake" spot.
- Connect that intake to one or more downstream inventories.
- The pipe pulls anything from the intake that matches the accept
  criteria of *some* downstream inventory.

## Why it pairs with sacks/buckets

[Buckets](sacks-and-buckets.md) are single-type by construction, so
they work as filtered endpoints with no extra config. If your downstream
is "bucket of bolts + bucket of cable + bucket of food", the pipe sorts
your loot dump into those three piles automatically. Anything not
bolts / cable / food (tools, consumables, oddballs) stays in the intake
crate because nothing downstream will accept it.

This means the "filter system" is just a side effect of which
buckets/sacks the modder chose to wire up. The pipe itself stays dumb.

## Charge variant

Pipe a charge-consuming device into the pipe network and have it pull
fresh batteries out of the system to top itself up. The return path —
how depleted batteries get *out* of the device, and how full ones come
*back* — needs more thought. Sketch:

- **Battery shelf** — installable inventory that *only* accepts
  batteries at 100% charge. Discharged batteries route past it into a
  charging installable; once charged, they qualify for the shelf and
  the pipe picks them up. The combination of "filter by charge level"
  + "pipe that routes by acceptance" handles the round trip.

This same shape generalises beyond charges to any "this item state
needs to round-trip through a process" — repair queues, refills, etc.

---

## Where this lives in the data (for later)

When fleshing this out into actual JSON, the likely-involved folders
are:

- [data/installables/](../../data/installables/) — pipe installable,
  battery shelf, charging station definitions.
- [data/slots/](../../data/slots/) and
  [data/slot_effects/](../../data/slot_effects/) — accept-criteria
  wiring; the routing decision lives in each downstream's accept rules.
- [data/chargeprofiles/](../../data/chargeprofiles/) — charge-level
  predicate for the "100% only" battery shelf.
- [data/context/](../../data/context/) — likely needed if the pipe
  evaluates accept criteria in a context (carrying/holding actor,
  source slot, etc.).

---

## Open questions

- Pipe tick model — continuous pull each tick, or event-driven on
  inventory-change?
- What anchors a pipe physically — is it itself an installable? A slot
  on the source crate? A new room/wall feature?
- Power cost. Pipes that move freely are gameplay-trivializing; some
  energy / throughput cap probably matters.
- Multi-downstream tie-break — when two downstream containers both
  accept item X, which wins? Distance, install order, fill level?
- Does the pipe move whole stacks at a time, or one item per tick?
- Does this need a new "pipe network" entity, or can the network be
  inferred from adjacency at evaluation time?
