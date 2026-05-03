# User story — Suppress needs via player trait

---

## The conversation that drove this

> **Modder (she/they):** so before i start pouring effort into learning how to
> mod ostranauts, how feasible is it to make some specific-to-player trait that
> flatlines certain needs so they don't shift enough to have gameplay impact on
> things? if there's prior art in this space i'd love to see that, too (i
> searched, couldn't find anything, but that could just be from not knowing
> what keywords to use)
>
> **Other:** I think Joshu posted something recently along those lines about
> modding the tickers that affect needs to accomplish this
>
> **Modder:** […] trying to figure out how to address this from a starting
> point of zero understanding of how the game's stuff is engineered is pretty
> intimidating

---

## The goal

The modder wants a player-specific trait — selected at character creation —
that prevents needs (hunger, thirst, sleep, hygiene, morale) from crossing
into discomfort territory during normal play. They are not trying to remove
the simulation entirely; they want the system to stay below the threshold
where it fires gameplay consequences.

**Non-clean-save constraint.** The mod must be safe to install on an existing
save. Edits that mutate existing condrule entries or remove active conditions
can break in-progress saves. The implementation must be additive — new entries
only.

**Zero prior knowledge.** The modder does not know the data terms for needs,
the threshold mechanism, or where traits live in the data tree. Intimidated;
asking before committing. The explorer has to show feasibility *and* teach the
path in the same session.

---

## The journey

### Step 1 — Confirm it's possible: find prior art

> *"I searched but couldn't find anything — probably just not knowing the
> keywords."*

The modder's first search is a game-vocabulary term: `hunger` or `sleep need`
or `needs`. The search bar finds no strName match on `hunger` alone, but the
concept/glossary search (UX 1.1) returns a card: *"Hunger / Caloric Need —
tracked by `conditions:StatHunger`."*

From `conditions:StatHunger`, the **"Modifies thresholds of this"** sidebar
(UX 1.4) lists `ThreshStatHunger`. The incoming refs on `ThreshStatHunger`
show existing entries that grant it — including wearables and drugs from the
base game. This is the prior art.

**Explorer outcome:** The modder sees that the mechanism already exists in
vanilla. Wearables and drugs already use `Thresh<StatName>` to push discomfort
thresholds. Her mod is a known pattern, not invention from scratch. Feasibility
confirmed before a single line is written.

### Step 2 — Understand how Thresh\* suppresses a need

The **"About threshold-shift conditions"** banner (UX 1.2) on
`conditions:ThreshStatHunger` explains: *"An entity holding this condition has
the trigger thresholds for `StatHunger` shifted by the cond-string `value`.
Higher `value` → more tolerance before consequences fire."*

The modder checks the incoming refs to see what `value` existing wearables use
and how high she needs to go to fully flatline the need for normal play.

**Explorer outcome:** She knows she needs to grant `ThreshStatHunger=X` where
X is large enough that the stat never reaches the discomfort trigger. She can
read baseline values off existing entries and choose a multiplier.

### Step 3 — Map all the needs that need suppressing

From `conditions:StatHunger` the modder follows the "see also" chain to other
`Stat*` conditions. The glossary card and the `Stat*` explainer banner name the
full set visible in the needs panel: `StatHunger`, `StatThirst`, `StatSleep`,
`StatHygiene`, and the psychological stats driven by work ticks
(`StatAchievement`, `StatEsteem`, `StatMeaning`).

She notes which ones have `Thresh<X>` conditions already (and therefore have a
known-working suppression path) vs. which might need a different approach.

**Explorer outcome:** The modder has a checklist of stats to suppress and
knows which suppression mechanism applies to each before writing any JSON.

### Step 4 — Find how to attach a Thresh\* grant to a trait

The modder looks at an existing wearable that grants `ThreshStatHunger` — say
`loot:CONDWearingFoodPackPer` or a similar entry. Its detail page shows:

- `strType: condition` in the loot entry
- `aCOs: ["ThreshStatHunger=3.0x1.0"]` — the condition grant
- The loot entry is linked from a condowner's `aStartingConds` or from a
  character-creation loot table via an `aEvents*` ref

She follows the incoming-refs chain to understand how the grant gets onto the
player character. Then she looks at `traitscores/traitscores.json` (surfaced by
the free-traits user story and discoverable from any trait detail page) to
understand how traits register at character creation.

**Explorer outcome:** She has a working pattern: create a condowner that holds
`aStartingConds` granting `Thresh*` values for each stat, then register that
condowner as a selectable trait in `traitscores/` and wire it into a career or
life-event loot table so character creation hands it to the player.

### Step 5 — Confirm the non-clean-save safety of this approach

The modder asks: will adding a trait to an existing character's conditions
mid-save break anything?

The `Thresh*` grant is additive — it does not remove existing conditions, does
not modify existing condrule thresholds, and does not touch already-fired
discomfort conditions. It simply raises the bar for future triggers. Existing
saves won't have the trait automatically, but players can use the in-game
`addcond` console to apply it manually. The mod itself is safe.

Contrast with the risky alternative: editing condrule threshold values directly
would affect all characters on a loaded save and could corrupt in-progress
condition states. The explorer's "Edit this" callout (UX 1.10) on condrule
entries notes this caveat explicitly.

---

## Files the mod needs

| File | What it does |
|---|---|
| `data/conditions_simple/<mod_folder>` | Registers the new trait condition (e.g. `IsNeedsReduced`) as a marker. Optional if the trait is implemented purely via condowner `aStartingConds` without needing a named condition. |
| `data/condowners/<mod_folder>` | Defines the trait object (e.g. `ItmTraitNeedsReduced`) as a condowner that grants high `Thresh*` values for each target stat in `aStartingConds`. |
| `data/loot/<mod_folder>` | Loot entry with `strType: condition` that delivers the `ItmTraitNeedsReduced` grant to the player character. Referenced from the career or life-event loot table. |
| `data/traitscores/<mod_folder>` | Adds the trait to the character-creation selection pool with a cost of `0,0` or `0,1` depending on whether age cost is desired. |
| `mod_info.json` | Loader identification. |

---

## What the explorer needs to show for this story to succeed

- **Glossary card for "hunger / needs"** bridges the plain-English search to
  `StatHunger` before the modder gives up. Without it, searching `hunger`
  dead-ends.
- **"Modifies thresholds of this" sidebar** on `StatHunger` (and all
  `Stat*` need conditions) surfaces prior art in the same click. This is the
  "I see it's been done before" moment that converts a hesitant asker into a
  modder who commits.
- **Existing wearable / drug incoming refs on `ThreshStatHunger`** are
  legible without filter pills — there should be few enough that the pattern
  is readable. If the list is long, a *"Only Loot · strType:condition"* pill
  narrows to the relevant entries.
- **The "Edit this" callout on condrule entries** must include a save-safety
  caveat when the edit would modify a threshold in an existing entry — so the
  modder doesn't accidentally take the risky path.
- **Traitscores discoverability** from any condowner or career detail page —
  not buried. A modder who finds the condowner pattern should be one click
  away from understanding how traits register at character creation.

---

## Acceptance criterion

A modder who opens the explorer with the question *"can I make a trait that
suppresses hunger and sleep so they don't bother me?"* and has never modded
Ostranauts should reach, in a single session:

1. Confirmation that the mechanism exists (existing wearables/drugs using
   `Thresh*`).
2. The list of stats she needs to suppress.
3. The file structure for the mod (condowner + loot + traitscores pattern).
4. Confidence that the mod is safe for existing saves.

Without needing to ask on Discord.
