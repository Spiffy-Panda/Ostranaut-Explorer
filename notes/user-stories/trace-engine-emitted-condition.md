# User story — tracing `DcGasPpO2` from a TI to its producer

A scoring/test scenario for **AST Phase 2** (see
[PLAN-AST.md](../../PLAN-AST.md)). Captures a class of question the
explorer currently dead-ends on: a condition that's referenced everywhere
but never *defined* in `data/conditions/`, because it's set by C# code at
runtime.

## The story

A modder is editing a trigger interaction (`TIs*` family) and notices an
`aOwnerConds` precondition on `DcGasPpO2`. They want to know what produces
this condition, what controls when it's added/removed, and whether they
can modify any of it from data without recompiling.

> **Modder:** `DcGasPpO2` shows up on a bunch of TIs as a precondition,
> but it isn't in `conditions/`. The data-health page calls it a "dangling
> ref" but nothing's broken in-game — the engine uses it fine. What sets
> it? Can I shift when it activates? Is there a sibling condition I can
> latch onto in the same tick if I want a slightly different threshold?

Today the explorer's `DcGasPpO2` page (if it shows one at all) reads:

> **No incoming references. No outgoing references. No source file.**
> *(strName referenced in `aOwnerConds`, `aTargetConds`, etc. but no
> matching entry in any `data/` folder.)*

That's a dead end. It doesn't tell the modder that the engine emits this
condition, or where, or what controls the threshold.

---

## Solution path — once Phase 2 ships

### Step 1 — Land on `conditions:DcGasPpO2`

The detail page now shows:

> **Source:** *engine-emitted (no entry in `data/conditions/`).*
>
> **Producer:** `code:GasSimRoom` — adds this condition to a room CO when
> `StatGasPpO2 ≥ <threshold>`; removes when below.
>
> **Threshold value:** *hardcoded in C# (decomp:GasSimRoom.cs:NN). Not
> data-driven.*
>
> **Consumed by:** N condtrigs, M TIs (incoming-ref list, same shape as a
> normal data-side condition page).

### Step 2 — Click the producer

`code:GasSimRoom`'s detail page lists its `produces-condition` out-ports:
`DcGasPpO2`, `DcGasPpCO2`, `DcGasPpN2`, `IsAirtight`, etc. Each row says
*"emitted on room update tick when `<gate expression>`."*

The gate expression is shown as a small read-only snippet (not full source
— that's not redistributed; just the comparison that gates the condition).
The modder learns that `DcGasPpO2` and its sibling-thresholded conditions
are produced by the same update tick, so any of them is a valid latch
point if they want a slightly different gate.

### Step 3 — Find the data-side override (or confirm none exists)

The page has a *"Data-side overrides"* section listing data fields that
modify this code-component's behavior — pulled from the SemanticModel by
walking the constructor / `aUpdateCommands` config-key reads. For
`code:GasSimRoom`, the answer is: none. The thresholds are constants in C#.

The modder now knows: shifting the activation point requires C#
modification (out of pure-data-mod scope). Latching onto a sibling
condition is possible from data. They write their TI against `DcGasPpCO2`
(low-CO2) instead of `DcGasPpO2` (sufficient-O2) because their actual goal
was *"trigger when the room is suffocating, not when it's safe."* Done.

---

## What the site needs to support this

- **`code:component` nodes with declared `produces-condition` out-ports.**
  Phase 2 of PLAN-AST. The Roslyn semantic model resolves
  `CondOwner.AddCond("...")` calls and lists the targeted condition names
  per-component.
- **Special detail-page treatment for engine-emitted conditions.** A
  condition with no `data/` entry but with at least one producer in the
  code graph renders a *"Source: engine-emitted"* banner instead of the
  current "dangling ref" warning. Plumbed through the data-health page
  too — engine-emitted conditions stop counting as dangling.
- **Gate-expression snippets on `produces-condition` rows.** Tiny,
  read-only, pulled from the body of the producing method. Required for
  step 2 to be actionable rather than informational.
- **"Data-side overrides" section on `code:component` pages.** Lists
  `aUpdateCommands`-resolved configs and per-instance fields that
  influence the component's behavior. The honest answer for some
  components is *"none — these are hardcoded"* and the page says so
  plainly, which is itself the answer the modder is looking for.

---

## Acceptance criterion

Phase 2 is "good enough" for this story when the modder, given only a
TI's `aOwnerConds` reference to `DcGasPpO2`, lands on a populated detail
page that shows producer + threshold provenance + sibling conditions +
data-side override status, in three clicks. The data-health page no
longer flags `DcGasPpO2` as a dangling reference.
