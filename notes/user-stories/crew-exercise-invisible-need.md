# User story — modding the work/needs/atrophy loop

A scoring/test scenario for the Ostranaut Data Explorer site. The asker is a
modder, not a player — but the symptom they're investigating is one any
player can observe in-game, which is what makes this a useful onboarding
scenario. Walks two end-to-end paths to the data entries that drive the
work/exercise/free-time loop.

## The story

A modder wants to rework the work/needs loop — slow the atrophy rate, change
the mood drain from work, or add new free-time activities. They've watched
the in-game behavior and noted the symptom that motivates the mod:

> **Modder (writing the design doc):** Crew exercise, study, and watch TV
> even when the needs panel is fully green and there are queued orders. I
> want to mod this loop, but first I need to find every data entry that
> drives it — what's pushing the AI to "leisure" when needs look fine?

The data answer:

> ```json
> { "strName" : "CONDTick1HourPhysio", "aCOs" : [ "StatAtrophy=1.0x0.1", ... ], "strType" : "condition" },
> { "strName" : "CONDTick1HourWorkPhysio", "aCOs" : [ "-StatAtrophy=1.0x0.05", ... ], "strType" : "condition" }
> ```
> `StatAtrophy` rises by **0.1/hr** unconditionally. Working cancels only
> 0.05/hr. The exercise interaction tooltip confirms: *"Two hours of
> exercise per day are needed to counteract atrophy without meds."*
>
> The needs panel hides this stat by design — `StatAtrophy` has
> `nDisplaySelf: 0`, so the bar never shows while healthy. "All needs
> green" is technically accurate while atrophy climbs invisibly.
>
> Study/TV exist to repay a *separate* drain: `CONDTick1HourWorkMoods`
> deducts `StatAchievement` (−8.33/hr), `StatEsteem` (−8.33/hr), and
> `StatMeaning` (−4.17/hr) while working. Free-time activities refill them.
> The work/leisure alternation is the design.

To mod this loop intelligently, the modder needs to find:

- `StatAtrophy` and the `nDisplaySelf` semantics that make it invisible
  while healthy.
- The two `CONDTick1Hour*` Loot entries that produce the +0.1/−0.05 rate
  asymmetry.
- The `CONDTick1HourWorkMoods` mood-drain entries.
- The matching `CONDTick1HourFreeMoods` refill entries.
- The drug entry (`CONDOssifexStimPer`) that demonstrates how
  `StatAtrophyRate` is multiplied — useful as a reference for any new
  anti-atrophy item.

None of those names are guessable from "exercise" — the modder needs the
explorer to bridge the in-game observation to the data terms.

## Follow-up story prompts

Use either of these as a system message when test-driving the site against a
fresh scenario or when generating more user-story files in this format:

> **Test prompt:** Roleplay an Ostranauts modder writing a design doc for a
> mod that touches the work/needs/atrophy loop. You've observed the in-game
> behavior (crew exercising despite full green needs) and want to find every
> data entry that drives it. Walk through the Ostranaut Data Explorer site
> as you'd actually use it — search "exercise", "atrophy", "needs", or
> similar — and report (a) whether you found `StatAtrophy` and its hidden
> display flag, (b) whether you found `CONDTick1HourWork`'s mood drains, (c)
> how many wrong turns you took, and (d) which page or signal prevented a
> wrong turn from becoming a dead end.

> **Generation prompt:** Given a modder's design-doc question and the
> loot.json / conditions.json answer, produce a `notes/user-stories/<slug>.md`
> file in the same shape as `crew-exercise-invisible-need.md` — story (modder
> framing — they want to *mod* the system, the in-game observation is just
> the symptom that motivates the mod), two solution paths (lucky + onboarded
> newcomer with thought blurbs), and a "what the site needs to support this"
> callout listing the specific features the path depends on.

---

## Solution version 1 — the **lucky** modder

Uses the explorer alongside the in-game debug console. No thought blurbs —
just the path. "Lucky" here means they already know about F3 / `getcond` /
`addcond` from prior modding work or wiki reading.

1. Search bar: type `exercise`. Find `ACTExcerciseSimpleAIReserve`. Read the
   tooltip: *"Two hours of exercise per day are needed to counteract atrophy
   without meds."* Note the word "atrophy" — but the interaction page itself
   doesn't explain the stat.
2. Open the game. Select a crewmember. Open the character inspector (mega
   tooltip). Scan the condition pills. No atrophy-related pill is visible —
   the character looks fine. The need isn't there, or isn't shown.
3. Open F3 console. Type:
   ```
   getcond [crewmember] Stat
   ```
   Output lists every `Stat*` value on the character. `StatAtrophy` appears
   with a non-zero value, slowly climbing.
4. Also run:
   ```
   getcond [crewmember] Dc
   ```
   Output includes `DcAtrophy01` — active, but absent from the inspector pills.
   The condition exists; the UI just doesn't show it at this level.
5. Go back to the explorer. Search `StatAtrophy`. Click the condition detail
   page. Fields block: `nDisplaySelf: 0`. Confirmed — healthy atrophy is
   invisible by design.
6. Scan **Referenced by**. Find `loot:CONDTick1HourPhysio` (+0.1/hr) and
   `loot:CONDTick1HourWorkPhysio` (−0.05/hr). Net while working: +0.05/hr.
   Exercise is mandatory to close the gap.
7. Search `CONDTick1HourWork`. Find `loot:CONDTick1HourWorkMoods`. Scan
   `aCOs`: `StatAchievement` −8.33, `StatEsteem` −8.33, `StatMeaning` −4.17.
   Work drains these. Study and TV replenish them. The behavior is designed.

**Why it worked:** The explorer alone couldn't surface `StatAtrophy` from
"exercise" — the interaction page mentions atrophy in prose but doesn't link
to the stat. The F3 console handed the modder the exact strName. The explorer
then made that strName immediately useful: `nDisplaySelf: 0` explains the
invisible need, the incoming refs locate every entry the mod will touch, and
the `CONDTick1HourWork` page exposes the mood-drain side of the loop. The
explorer is the answer-finisher, not the starting gun.

**Where the lucky path breaks:** If the modder doesn't already know `getcond`
or F3 (e.g. first-time Ostranauts modder), step 3 doesn't happen. The
explorer search "exercise" returns the interaction page; the `nDisplaySelf: 0`
insight is never reached. This is the gap the glossary card (UX 1.1) in
version 2 fills — it bridges "exercise" to `StatAtrophy` without requiring
console-command literacy.

---

## Solution version 2 — the **onboarded newcomer modder**

Navigates with the help of the newcomer-onboarding features specified in
[`notes/ux/newcomer-onboarding.md`](../ux/newcomer-onboarding.md). The modder
is new to Ostranauts modding (first-time user of the data tree, no prior
exposure to `Stat*` / `Thresh*` / cond-string DSL conventions) but is an
experienced modder of other games. Thought blurbs at each step.

### Step 1 — Search plain English, hit a glossary card

> **Thought:** "I don't know any strNames yet. I'll type what I observed:
> the in-game behavior I want to mod. Let me try 'exercise' and see what
> comes up."

**Action:** type `exercise` in the search bar. Results include the interaction
`ACTExcerciseSimpleAIReserve` — and also a **glossary card (UX 1.1)** titled
*"Atrophy / Microgravity Muscle Loss."* Card summary: *"Muscles atrophy in
microgravity unless exercised ~2 hrs/day. Tracked by `StatAtrophy`. Invisible
in the needs panel when healthy (`nDisplaySelf: 0`)."* The card links directly
to `conditions:StatAtrophy`.

> **Thought:** "'Invisible in the needs panel when healthy' — that would
> explain exactly what I'm seeing. I'll click the data-term link."

### Step 2 — `StatAtrophy` detail page, banner explains hidden stats

**Action:** land on `conditions:StatAtrophy`.

The **per-prefix explainer banner (UX 1.2)** fires: *"About `Stat*` conditions
— Stat conditions are continuous numeric trackers. Their visibility in the
needs panel is controlled by the `nDisplaySelf` field: 0 = hidden when
healthy, 2 = always visible, 3 = pinned. `StatAtrophy` is hidden at level 0;
the needs panel only surfaces it once it crosses into a discomfort band
(`DcAtrophy02`, `DcAtrophy03`)."*

The **inline schema description (UX 1.3)** on the `nDisplaySelf: 0` field
reads: *"This condition will not appear in the character's needs panel while
healthy. Players cannot see it climbing until it crosses into a visible
discomfort band."*

> **Thought:** "So 'all needs green' is technically accurate — the panel hides
> this stat completely until it's already a problem. The crew are exercising
> to prevent it from ever becoming visible. Now I need to know the rate."

### Step 3 — Confirm the rate math via filter pills

**Action:** scroll to **Incoming refs** on `StatAtrophy`. The ref list is
long. **Filter pills (UX 1.6)** suggest *"Only Loot · strType:condition (tick
effects)."* Apply pill. List narrows to `CONDTickAtrophy`,
`CONDTick1HourPhysio`, and `CONDTick1HourWorkPhysio`.

> **Thought:** "Three entries. One ticks atrophy up, one does it hourly, one
> reduces it while working. I'll check whether working covers the rise."

**Action:** scan the edge metadata on the filtered rows:
- `CONDTickAtrophy` → `StatAtrophy=1.0x0.1`
- `CONDTick1HourPhysio` → `StatAtrophy=1.0x0.1`
- `CONDTick1HourWorkPhysio` → `−StatAtrophy=1.0x0.05`

Net while working: +0.05/hr. The interaction tooltip on
`ACTExcerciseSimpleAIReserve` confirmed: *"Two hours of exercise per day are
needed to counteract atrophy without meds."*

> **Thought:** "Working is not enough. The gap is exactly why exercise is
> mandatory. But why study and TV? Those don't fight atrophy."

### Step 4 — Find the mood drain from work

**Action:** search `CONDTick1HourWork`. Land on the loot detail page.

The **"Why is this in `loot/`?" inline note (UX 1.9)** fires: *"strName
prefixes like `COND…` follow naming convention but do not determine folder.
The `strType: condition` field does. This entry lives in `loot/` because Loot
is the engine's grant-dispatcher folder."*

Inline schema descriptions (UX 1.3) on the `aCOs` of
`CONDTick1HourWorkMoods` label each line:
- `−StatAchievement=1.0x8.33` — *"Decreases the character's sense of
  personal achievement by 8.33 per work-hour."*
- `−StatEsteem=1.0x8.33` — *"Decreases self-esteem by 8.33 per work-hour."*
- `−StatMeaning=1.0x4.17` — *"Decreases sense of purpose by 4.17 per
  work-hour."*

> **Thought:** "Work actively drains these psychological stats. The crew have
> no choice but to take breaks and do free-time activities to refill them.
> This isn't slacking — it's the design."

### Step 5 — Verify that free time refills what work drains

**Action:** search `CONDTick1HourFree`. Find `CONDTick1HourFreeMoods`. Its
`aCOs` show `StatAchievement=1.0x4.33`, `StatEsteem=1.0x4.33` — free time
restores these at roughly half the rate work drains them. Study and TV are
the interactions that trigger the free-time tick for the crew.

> **Thought:** "So the regime is: work 2 hrs, earn some stats, drain
> achievement/esteem/meaning. Exercise 2 hrs, hold off atrophy. Rest/study/TV
> 4+ hrs, restore psychological balance. The AI is cycling through all of this
> autonomously and correctly."

### Step 6 — Optional: find the mod path (anti-atrophy meds)

> **Thought:** "If I wanted to reduce how often this happens without removing
> the behavior entirely, I could reduce the atrophy rate with meds."

**Action:** on `StatAtrophy`'s incoming refs, find
`loot:CONDOssifexStimPer` (`−StatAtrophyRate=1.0x0.95`). The **"Edit this"
callout (UX 1.10)** on that page: *"To reduce the atrophy rate this drug
provides, edit the `value` of `aCOs[0]` in `data/loot/loot.json` (line N).
Higher magnitude = more atrophy suppression per dose. Note: `StatAtrophyRate`
is a multiplier; the base rate is 1.0."*

---

## What the site needs to support this

- **Search by strName** (both versions) — already shipped.
- **Object detail page with grouped refs** (both versions) — already shipped.
- **`nDisplaySelf` field visible in the Fields block** (lucky v1, step 5;
  newcomer v2, step 2) — already shipped. The value `0` is visible; its
  *meaning* is opaque without a schema description. A Comment Mod entry for
  `nDisplaySelf` naming the 0/1/2/3 semantics — and explicitly noting
  *"0 = invisible in the needs panel and in the character inspector's condition
  pills"* — is the fix.
- **Edge metadata on incoming refs** (lucky v1, step 6) — already shipped
  (`value` on condition edges).
- **Glossary card for "exercise / atrophy / microgravity muscle loss"**
  (newcomer v2, step 1) — *not yet shipped.* This card is also the fix for the
  lucky path's break point (see "Where the lucky path breaks"): it bridges the
  plain-English query "exercise" to `conditions:StatAtrophy` for players who
  don't know about `getcond`. Without it, both paths dead-end at the
  interaction page.
- **Per-prefix explainer banner for `Stat*` + `nDisplaySelf` semantics**
  (newcomer v2, step 2) — *not yet shipped.* Must call out the 0/2/3 meanings
  explicitly; this is the "aha" moment the path depends on.
- **Filter pills on incoming refs** (newcomer v2, step 3) — *not yet shipped.*
  `StatAtrophy` has many non-tick incoming refs; the "Only tick effects" pill
  is essential to keep the list readable.
- **Inline schema descriptions on `aCOs` items in `CONDTick1HourWork*`**
  (newcomer v2, step 4) — *not yet shipped.* Without per-line descriptions
  naming which psychological stat is affected and in what direction, the page
  is an opaque list of cond-strings.
- **"Why is this in `loot/`?" inline note on `CONDTick1HourWork`**
  (newcomer v2, step 4) — *not yet shipped.* The `COND…` prefix + `loot/`
  folder is a near-universal newcomer trap.
- **"Edit this" callout on `CONDOssifexStimPer`** (newcomer v2, step 6) —
  *not yet shipped.*

The lucky path is ~80% achievable on what's already shipped, provided the
player guesses "atrophy" as the search term. The newcomer path requires the
glossary card (step 1) to even begin — without it, "exercise" leads into the
interaction graph and the hidden-stat insight is never surfaced.

---

## Acceptance criterion

Two separate tests, both required. Each tester is a modder writing a design
doc for a mod that touches the work/needs loop — not a player asking the
explorer to explain NPC behavior.

**Console-first tester (lucky modder):** A modder who arrives at the explorer
already holding the strName `StatAtrophy` (e.g. from `getcond` in the F3
console) should reach a complete map of the loop — hidden display flag, rate
math, mood drain, drug reference — without any wrong clicks. The `StatAtrophy`
detail page must be self-sufficient for this entry point.

**Explorer-first tester (newcomer modder):** A modder who has not yet used
the game console and types "exercise" into the search bar should reach the
`nDisplaySelf: 0` finding on `StatAtrophy` within three clicks via the
glossary card, and end the session with a list of the entries they'd edit
to mod each part of the loop (atrophy rate, work mood drain, free-time
refill, drug effects).

Test each with a fresh user. The console-first test can run as soon as
`nDisplaySelf` has a schema description. The explorer-first test requires
the glossary card to be seeded.
