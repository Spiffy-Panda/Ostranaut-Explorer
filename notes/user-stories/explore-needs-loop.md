# User story — Understanding why the needs loop feels like a treadmill

This is a **designer exploration** story, not a mod-making story. The goal is
to use the explorer as a diagnostic tool to understand *why* the needs system
creates a frustration loop for some players — specifically the feeling of
having no conversational or direct agency over needs, and the sense that
satisfying a need just resets the timer rather than resolving anything.

The findings from this exploration inform what the explorer needs to surface
for modders like the one in [`mod-suppress-needs.md`](mod-suppress-needs.md)
and for future UX design decisions about which data gaps are causing player
confusion.

---

## The observation

> **Player/designer:** I can't figure out how to converse with people to fix
> my needs. It seems [like they] move my needs up and down in place.

Two distinct frustrations are compressed into this sentence:

1. **Conversational agency gap.** The player believes that social interaction
   with NPCs should address some need — and cannot find the interaction that
   makes it work. The feedback loop between "I tried talking to someone" and
   "my need changed" is broken or invisible.

2. **Treadmill perception.** Satisfying a need (eating, sleeping, using a sink)
   doesn't feel like progress — it just delays the next identical crisis. The
   need refills, then depletes again, on a loop the player can't get ahead of.

These are separate design problems with different data sources.

---

## Path 1 — Conversational agency: what does social interaction actually do?

### What the data says

Search `social` or `talk` in the explorer. Land on interaction entries like
`ACTConversationFriendly`, `ACTConversationFlirt`, `ACTArgumentStart`, etc.

On the detail pages for those interactions, the `LootCTsUs` / `LootCTsThem`
fields name the conditions granted or removed by the interaction. For friendly
conversation, the grants land on stats like `StatSocialization`,
`StatBelonging`, `StatEsteem`. For arguments, the grants remove the same stats
or add discomfort conditions like `DcRelationship01`.

**The gap the explorer reveals:**

- `StatSocialization` and `StatBelonging` are real stats. Social interactions
  do affect them.
- But: these stats have `nDisplaySelf: 0` at healthy levels — **they are
  invisible in the needs panel when not in crisis.** The player who tries a
  friendly conversation and checks their needs panel sees no change, because
  the change is happening in a stat that the panel hides until it's already a
  problem.
- Additionally, the *trigger* for seeking conversation is on the NPC AI side
  (`CTTestUs` on the conversation interactions requires the NPC to be in an
  eligible mood state). A player trying to initiate conversation with the wrong
  crew member at the wrong time sees the interaction silently fail or not
  appear in the action menu.

**Explorer outcome for a designer:** The "no agency" perception is accurate at
the UI layer — the stat is real but hidden. Fixing the perception requires
either: (a) making the stat visible in the panel before it crises, or (b)
surfacing which stats a conversation just changed, even briefly.

### What the explorer needs to show for this diagnostic

- `StatSocialization` and `StatBelonging` have `nDisplaySelf` values
  that explain *why they don't appear until crisis*. The schema description on
  `nDisplaySelf` must name the 0/2/3 semantics — "0 = hidden when healthy,
  not absent" — so a designer reading the fields understands this is
  intentional hiding, not missing data.
- The `LootCTsUs` / `LootCTsThem` grants on conversation interactions should
  be readable without parsing cond-strings. A designer should be able to see
  "this interaction adds `StatSocialization=1.0x4.0` to [us]" without a
  DSL primer open.
- The `CTTestUs` gate on each conversation interaction names the required
  condition. The designer can see "this interaction is only available when
  [us] has `TCanConverse`" — which, when followed, shows what blocks the
  action.

---

## Path 2 — Treadmill perception: why does satisfying a need not feel like progress?

### What the data says

Every `Stat*` need has two sides in the data: a drain source and a refill
source. The drain is always unconditional or near-unconditional. The refill
requires a specific action (eat food, sleep, use sink, converse, exercise).

The asymmetry is structural:

| Need | Drain | Refill condition |
|---|---|---|
| Hunger | `CONDTick1HourPhysio` grants `StatHunger` decline continuously | Must consume a food item interaction |
| Sleep | Continuous stat decline | Must complete a sleep interaction at a sleep point |
| Hygiene | Continuous decline | Must use a sink/hygiene item with water supply |
| Morale (`StatAchievement` etc.) | `CONDTick1HourWorkMoods` drains during work | Must do free-time activities (study, TV, etc.) |
| Atrophy | `CONDTick1HourPhysio` — always rising, even during sleep | Exercise ≥ 2 hrs/day, or drug |

The treadmill is real: drain is passive and constant; refill is active and
requires specific conditions (object present, character not blocked, action
available). Every session restart, the drain resumes. There is no "get ahead"
state in the base data — no way to zero out the drain rate or bank refill.

**The perception gap the data reveals:**

- Players observe needs moving and interpret it as "nothing I do matters." But
  the data shows: the refill *does* work — it just refills to the discomfort
  threshold, not to "immune from this need for the session."
- Some stats have no visible discomfort until a second or third tier (`Dc*01`,
  `Dc*02`, `Dc*03`). The needs panel shows `DcHunger01` but not `StatHunger`'s
  actual value. A player who is "green" on the panel but approaching the next
  tier threshold has no warning.
- The refill rate vs. drain rate math is not surfaced anywhere in-game. The
  data shows the rates exactly (e.g. `CONDTick1HourWorkMoods`: −8.33/hr for
  three stats; `CONDTick1HourFreeMoods`: +4.33/hr for the same stats — free
  time refills at roughly half the drain rate of work). A player cannot
  observe this without reading the data.

**Explorer outcome for a designer:** The frustration loop is not a bug — it is
the intended design, documented in the data. The issue is that the design is
*invisible* to players. The rates are not surfaced in-game. The thresholds are
not surfaced. The relationship between "I ate" and "hunger will return in X
minutes" is not surfaced.

A modder trying to suppress needs (see [`mod-suppress-needs.md`](mod-suppress-needs.md))
is responding to a real information gap, not just a balance preference.

### The data the explorer needs to surface for this diagnostic

- **Drain/refill rate math is readable on the `Stat*` detail page.** The
  incoming refs panel, filtered to tick-effect loot entries, should show the
  drain rate and refill rate side-by-side. Today the rates are in the edge
  metadata but a designer has to manually subtract them.
- **The `Dc*` threshold chain is visible from the `Stat*` page.** A designer
  should be able to see "`StatHunger` → `condrules:CRHunger01` fires
  `DcHunger01` at value X → `condrules:CRHunger02` fires `DcHunger02` at
  value Y" without crawling three separate pages.
- **`nDisplaySelf` semantics on every `Stat*` entry.** For each stat, the
  detail page should show whether the stat is visible, at what display tier,
  and what the player sees vs. what is actually tracked.
- **The refill/drain asymmetry is surfaced as a derived fact**, not just raw
  incoming edges. "Drain rate: −X/hr (passive). Fastest refill: +Y/hr via
  [interaction]." This is the number a player needs to answer "how often do I
  actually need to eat?"

---

## What this exploration reveals for the mod-suppress-needs story

The modder's frustration is well-founded and architecturally legible:

1. **The drain is unconditional.** There is no in-game way to stop the drain
   without a mod — it is not gated on player choice or play style.
2. **The refill requires specific infrastructure.** A ship without a sink means
   hygiene is unaddressable. A ship without stored food means hunger is
   unaddressable. The treadmill has a floor that depends on ship setup, not
   just player attention.
3. **Social needs are partially hidden.** The player *can* address morale via
   conversation, but the stat change is invisible, and the conversation
   interaction gate is on the NPC, not the player.
4. **The `Thresh*` mod approach is the right tool** because it doesn't fight
   the drain (which would require editing entries that ship with the base game
   and are risky to modify mid-save) — it just raises the floor above which
   the drain becomes consequential.

The explorer should surface all four of these as first-class findings on the
`Stat*` detail pages, not as things a designer has to excavate from raw ref
lists.

---

## Sibling stories

- [`mod-suppress-needs.md`](mod-suppress-needs.md) — the mod this exploration
  motivates.
- [`crew-exercise-invisible-need.md`](crew-exercise-invisible-need.md) —
  covers `StatAtrophy` and the hidden-stat pattern in depth; directly relevant
  to path 1 here.
- [`anti-g-loc-newcomer.md`](anti-g-loc-newcomer.md) — shows the
  `Thresh<StatName>` suppression pattern that the mod uses.
