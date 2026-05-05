# User story — debugging a broken `Destructable` line on a custom turret

A scoring/test scenario for **AST Phase 2** (see
[PLAN-AST.md](../../PLAN-AST.md)). Captures the situation a modder hits
when copy-pasting an `aUpdateCommands` entry from one CO to another and
getting a crash with no useful error message.

## The story

A modder is building a new player-installable turret CO. They want it to
be destructible the same way walls are, so they copy the
`aUpdateCommands` line straight from a wall:

```json
"aUpdateCommands": [
  "Destructable,StatHullDamage,IADestroyed,StatHullDamageMax,1.0"
]
```

Game crashes on spawn with a `NullReferenceException` buried in
`Destructable.Update`. No data-side error. No log line that names a
specific bad field.

> **Modder:** Something in this line is wrong. I copied it verbatim from
> a wall, replaced nothing, and it crashes. Are the positional arguments
> different per-component? Is one of the strNames not valid on a turret?
> Is there a parser somewhere I can look at to see what the format is?

Today the explorer treats the whole `aUpdateCommands` array as opaque
strings. The detail page renders the line as text. The modder has no way
to ask the site *"what does each comma-separated token mean to the
`Destructable` component?"*

---

## Solution path — once Phase 2 ships

### Step 1 — Land on the broken turret CO

The `aUpdateCommands` block is no longer a flat string list. Each entry
is expanded into a structured row:

```
[0]  Destructable
     ├ stat:        conditions:StatHullDamage      ✓
     ├ on-destroy:  interactions:IADestroyed       ✓
     ├ max-stat:    conditions:StatHullDamageMax   ✗ NOT FOUND
     └ threshold:   1.0                            (literal)
```

The third argument is flagged with a red ✗. Click it.

### Step 2 — See the resolution failure

A small banner: *"`StatHullDamageMax` is referenced as a strName but no
`conditions/` entry exists with that name. Did you mean `StatHullMax`
(which does exist)?"*

The "Did you mean" suggestion is a Levenshtein-distance match across
`conditions/` strNames; not novel UI, but in this position on this page
it's the entire payload.

### Step 3 — Click through to `code:Destructable`

The component's detail page shows what each positional argument means,
derived from the C# `Destructable.cs` configure / `Awake` method:

- **Position 1 — `stat`** (string → `conditions/`): the damage condition
  this object accumulates. Required.
- **Position 2 — `on-destroy`** (string → `interactions/`): the
  interaction triggered when the threshold is reached. Optional; if
  empty, no interaction fires (object just disappears).
- **Position 3 — `max-stat`** (string → `conditions/`): the condition
  whose *value* is the destruction threshold (so different-tier objects
  can have different max HP). **Required.**
- **Position 4 — `threshold`** (number, 0.0–1.0): fraction of `max-stat`
  at which `on-destroy` fires. Default 1.0.

The modder reads *"Position 3: required"* and *"max-stat refers to
`conditions/`"* and combines that with *"the strName I had wasn't
there."* The fix is obvious: replace `StatHullDamageMax` with
`StatHullMax`.

### Step 4 — Verify the fix

Modder edits the JSON, re-runs `make site`. The detail page now renders
all four positions with green ✓s. They reload the game; turret spawns;
takes damage; explodes when shot enough. Done.

---

## What the site needs to support this

- **`aUpdateCommands` structured renderer on data-side detail pages.**
  Each entry expanded into named positional arguments, each resolved
  against the appropriate target folder. Phase 2 of PLAN-AST.
- **Resolution-failure markers + Did-you-mean suggestions** on each
  positional row. Levenshtein distance over the target folder's
  strNames; cheap.
- **`code:component` parameter documentation derived from the Roslyn
  SemanticModel.** Position name + target folder + required/optional +
  type. Without this layer, the modder gets the structured render but
  doesn't know what each position is *for*.

---

## Acceptance criterion

Phase 2 is "good enough" for this story when the modder lands on the
broken turret's detail page, sees the failing positional argument with a
red marker, clicks into `code:Destructable` to read the parameter
contract, and identifies the fix without ever opening a `.cs` file or
asking on Discord. Total: three clicks plus one JSON edit.
