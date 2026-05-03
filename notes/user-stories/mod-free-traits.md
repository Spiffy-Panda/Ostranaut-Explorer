# User story — Free Traits Mod

**Source mod:** `testdata_mods/FreeTraits_and_StarterShipPlus/FreeTraitsMod/`
**Original mod by:** jwebmeister — https://github.com/jwebmeister
**Mod version:** 0.2 (game version 0.14.0.0)

---

## The goal

A modder has spent 50+ hours in Ostranauts. They know that picking skills and traits
during character creation makes their character older — and that a starting age above
the default means fewer in-game years before conditions start compounding. They want
to make a mod where every skill and trait costs **zero** age years, so players can
build any character concept without paying an age penalty.

They know what the outcome should look like in the game. They do not know which JSON
files drive the age-cost calculation, or what field to change.

---

## The journey

### Step 1 — Find the folder that controls trait costs

The modder opens the data explorer and searches for a trait they know from character
creation — say `IsFit`. The detail page for `conditions:IsFit` shows incoming refs.
Among them is a ref from `traitscores/traitscores.json` via the `aValues` field.

The explorer shows this ref's edge metadata: `value: 0`, and a second field — the
age cost — which shows `1`.

**Explorer outcome:** The modder learns that `traitscores/` is the folder controlling
character-creation costs, and that each entry in `aValues` is a cond-string of the
form `"CondName,nYears,nCost"`.

### Step 2 — Understand the aValues format

On the `traitscores:Trait Scores,1` detail page, the Fields block shows `aValues` as
an array of strings. The inline field description explains the cond-string format and
what each position means:

- Position 1: condition name
- Position 2: years added to character age on selection
- Position 3: point cost (separate budget, used for some traits)

The "Edit this" callout tells them: to make a trait cost zero age years, set position 2
to `0`. It shows the file path and a representative line.

**Explorer outcome:** The modder can now open the file and understand what to change
without guessing at the format.

### Step 3 — Find the scope of the change

The modder notices `traitscores:Trait Scores,1` is a single entry with ~150 conditions
in its `aValues`. The mod must set position 2 to `0` for every row.

They see that citizenship/strata traits (`IsStrataAtlantisCitizen,1,0`) have `1` in
position 2 — those are the ones that need zeroing. Personal traits and skills already
show `0,1` or `0,0` in the base data (the first position is already 0).

**Explorer outcome:** The modder understands they only need to change a small subset
of rows — the ones where position 2 is currently non-zero — and can produce a targeted
override rather than rewriting the entire entry.

---

## Files in the mod's implementation

| File | What it does |
|---|---|
| `data/traitscores/traitscores.json` | Overrides `Trait Scores,1` with all `aValues` entries having position 2 set to `0`. Removes the age cost from every trait and skill. |
| `data/careers/careers_freetraitsmod.json` | Overrides the `Shipbreaker` career entry, adding every skill to `aSkillsHobby`. This expands the hobby-pick pool so players can take any skill as a hobby during that career step without the mod needing to touch other careers. |
| `mod_info.json` | Identifies the mod to the game's loader. `strGameVersion` must match the game version for the loader to accept it. |

---

## What the explorer needs to show for this story to succeed

- `traitscores/traitscores.json` is discoverable from searching a known trait name
  (`IsFit`, `IsStrong`, etc.) and following its incoming refs.
- The `aValues` cond-string format is explained inline on the detail page — not
  hover-only, because the modder doesn't know to hover on an opaque string array.
- The "Edit this" callout names the field (`aValues`), the file path, and the
  direction of effect ("set position 2 to 0 removes the age cost").
- The careers override is findable from the `Shipbreaker` career detail page, which
  should show that the mod overrides it and link to the overriding entry.
