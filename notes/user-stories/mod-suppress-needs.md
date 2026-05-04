# User story — Suppress needs via player trait

---

## The conversation that drove this

A Discord exchange seeded this story (paraphrased; original participants
not named). A prospective modder, before committing time to learning
Ostranauts modding at all, asked whether a player-specific trait that
flatlines certain needs — enough that they don't shift far enough to
have gameplay impact — was feasible, and whether prior art existed. They
had searched but found nothing, suspecting a vocabulary mismatch rather
than a real absence. Another modder confirmed prior art does exist,
pointing toward modding the tick-effect mechanism that drives needs.
The asker said they were intimidated by needing to figure this out from
zero understanding of how the game's data is engineered.

That intimidation is the load-bearing detail. The story below is shaped
around showing feasibility *and* teaching the path in the same explorer
session — so a modder in that position can decide whether to commit
without having to ask again.

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
or `needs`. The search bar finds no strName match on `hunger` alone — and
notably, **there is no `StatHunger` in the actual data**, despite that being
the name the wiki's Condition Rules tutorial uses as an illustrative example.
The concept/glossary search (UX 1.1) returns a card that resolves the
confusion: *"Hunger is split into two stats — `StatSatiety` (the moment‑to‑
moment feeling of fullness) and `StatFood` (cumulative malnutrition). Most
mods that 'suppress hunger' want both."*

From `conditions:StatSatiety`, the **"Modifies thresholds of this"** sidebar
(UX 1.4) lists `ThreshStatSatiety`. The incoming refs on `ThreshStatSatiety`
show existing entries that grant it — including drugs and conditions from the
base game (e.g. `CONDARSCatastrophic2Per`, `CONDDiarrheaPer`). This is the
prior art. (`StatFood` notably has *no* `Thresh*` handle — that's a separate
pitfall the modder will hit at step 4.)

**Explorer outcome:** The modder sees that the mechanism already exists in
vanilla. Wearables and drugs already use `Thresh<StatName>` to push discomfort
thresholds. Her mod is a known pattern, not invention from scratch. Feasibility
confirmed before a single line is written.

### Step 2 — Understand how Thresh\* suppresses a need

The **"About threshold-shift conditions"** banner (UX 1.2) on
`conditions:ThreshStatSatiety` explains: *"An entity holding this condition
has the trigger thresholds for `StatSatiety` shifted by the cond-string
`value`. Higher `value` → more tolerance before consequences fire."*

The modder checks the incoming refs to see what `value` existing entries use
(e.g. `IsApathetic`'s per-loot uses `ThreshStatAchievement=1.0x0.2`) and how
high she needs to go to fully flatline the need for normal play.

**Explorer outcome:** She knows she needs to grant `ThreshStatSatiety=X` where
X is large enough that the stat never reaches the discomfort trigger. She can
read baseline values off existing entries and choose a multiplier.

### Step 3 — Map all the needs that need suppressing

From `conditions:StatSatiety` the modder follows the "see also" chain to other
`Stat*` conditions. The glossary card and the `Stat*` explainer banner name
the full set visible in the needs panel: `StatSatiety` + `StatFood` (hunger),
`StatHydration` (thirst), `StatSleep`, `StatSleepComfort`, `StatFatigue`,
`StatHygiene`, `StatDefecate`, and the psychological stats driven by work
ticks (`StatAchievement`, `StatAltruism`, `StatAutonomy`, `StatContact`,
`StatEsteem`, `StatFamily`, `StatIntimacy`, `StatMeaning`, `StatPrivacy`,
`StatSecurity`, `StatSelfRespect`).

She notes which ones have `Thresh<X>` conditions already (and therefore have a
known-working suppression path) vs. which need a different approach. The
"Modifies thresholds of this" sidebar surfaces the gap immediately:
**`StatFood` and `StatHygiene` have no `Thresh*` handle in the base game.**
For those two she'll have to slow the consumption rate instead, via the
`-StatFoodRate` / `-StatHygieneRate` pattern visible on `IsMetabSlow`.

**Explorer outcome:** The modder has a checklist of stats to suppress and
knows which suppression mechanism applies to each before writing any JSON.

### Step 4 — Find how to attach a Thresh\* grant to a trait

The modder looks at an existing trait that already does this kind of thing —
`conditions:IsApathetic` (which makes the player less fussy about
achievement). Its detail page shows the chain:

- `IsApathetic` is a Condition with `aPer: ["CONDApatheticPer"]`
- `loot:CONDApatheticPer` is a Loot entry with `strType: condition` and
  `aCOs: ["ThreshStatAchievement=1.0x0.2"]`
- `traitscores/traitscores.json` includes the line `IsApathetic,2,1`,
  registering the condition as a selectable trait at character creation
  (score 2, age cost 1)

She follows the incoming-refs chain to understand how the trait gets onto the
player character. The `aPer → CONDxxxPer → aCOs` shape is the standard pattern
for every trait in the game.

**Explorer outcome:** She has a working pattern: create a Condition that has
`aPer` pointing at a loot entry of `strType: condition`, list her `Thresh*`
and `-StatXRate` strings inside that loot entry's `aCOs`, then register the
condition as a selectable trait in `traitscores/`. No condowner needed —
traits are conditions, not condowners.

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
| `data/conditions/<mod_folder>` | Defines the trait condition (e.g. `IsNeedsReduced`) with `aPer` pointing at the per-loot below. Modeled on `IsApathetic`. |
| `data/loot/<mod_folder>` | Loot entry of `strType: condition` (e.g. `CONDNeedsReducedPer`) whose `aCOs` lists the `Thresh*` and `-StatXRate` effects. Modeled on `CONDApatheticPer`. |
| `data/traitscores/<mod_folder>` | Adds the trait to the character-creation selection pool. Format is `TraitName,score,ageCost`; `ageCost` **must be ≥1** or the chargen UI silently filters the trait out (engine code: `GUIChargenTraits.cs:146` and `:58`). Use `0,1` for free-in-score-budget (FreeTraits convention), or `3,1` to match the base-game cost shape (like `IsCharismatic,3,1`). |
| `mod_info.json` | Loader identification (`strName`, `strAuthor`, `strGameVersion`, `strModVersion`, `strNotes`). |
| `Ostranauts_Data/Mods/loading_order.json` | Sits inside the `Mods/` folder, alongside individual mod folders (not inside any one of them). Lists `"core"` then the mod's folder name in `aLoadOrder`. The game auto-creates this when you click the **Mods** button in Options→Files. (The wiki still documents the older `Ostranauts_Data/` location — the game has since moved it.) |

---

## What the explorer needs to show for this story to succeed

- **Glossary card for "hunger / needs"** bridges the plain-English search to
  `StatSatiety` + `StatFood` before the modder gives up. Without it, searching
  `hunger` dead-ends — there is no `StatHunger` in the data, even though the
  wiki's Condition Rules tutorial uses that name. The card must explicitly
  call out the Satiety vs. Food split.
- **"Modifies thresholds of this" sidebar** on `StatSatiety` (and all
  `Stat*` need conditions) surfaces prior art in the same click. This is the
  "I see it's been done before" moment that converts a hesitant asker into a
  modder who commits. Equally important: when the sidebar is *empty* (as on
  `StatFood` and `StatHygiene`) the modder needs to see that emptiness
  immediately, so they pivot to the rate-suppression mechanism rather than
  hunting for a `Thresh*` that doesn't exist.
- **Existing incoming refs on `ThreshStatSatiety`** are legible without
  filter pills — there should be few enough that the pattern is readable. If
  the list is long, a *"Only Loot · strType:condition"* pill narrows to the
  relevant entries.
- **The "Edit this" callout on condrule entries** must include a save-safety
  caveat when the edit would modify a threshold in an existing entry — so the
  modder doesn't accidentally take the risky path.
- **Traitscores discoverability** from any condowner or career detail page —
  not buried. A modder who finds the condowner pattern should be one click
  away from understanding how traits register at character creation.

---

## Acceptance criterion

A modder who opens the explorer with the question *"can I make a trait that
suppresses hunger and sleep so they don't bother me?"* — using the
player-facing word "hunger" — and has never modded Ostranauts should reach,
in a single session:

1. Confirmation that the mechanism exists (existing wearables/drugs using
   `Thresh*`).
2. The list of stats she needs to suppress.
3. The file structure for the mod (condowner + loot + traitscores pattern).
4. Confidence that the mod is safe for existing saves.

Without needing to ask on Discord.
