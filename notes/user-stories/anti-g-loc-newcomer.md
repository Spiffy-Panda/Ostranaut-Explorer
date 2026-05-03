# User story — anti-G-LOC modding for a newcomer

Sibling scenario to [`anti-g-loc-leggings.md`](anti-g-loc-leggings.md). Same
question, same destination, but the modder is a beginner: they have **none**
of the background knowledge the "skilled modder" path leans on. The site
itself has to teach them as they walk.

The skilled path works only if you already know:

- "Anti-G-LOC" is flavor text — the underlying stat is `StatGrav`.
- The engine resolves dynamic stat thresholds via the `Thresh<StatName>`
  naming convention.
- Cond-string DSL syntax (`Name=value x duration`).
- Loot entries can grant conditions instead of dropping items, dispatched by
  `strType`.
- File paths matter — a strName starting with `COND…` does **not** imply
  `conditions/`.

This story tests the site's ability to bring a newcomer up that ladder, one
rung at a time, in the same flow as actually solving the problem.

**Why this gets its own scenario file.** The explorer is the *beginner*
surface in the v1/v2 product split. The LSP (v2) is where the skill *ceiling*
lives — power users with hover/jump-to-def, mod-aware diagnostics, and a
configured editor. The explorer's job is to bring people *up* to the
threshold where the LSP is even useful. If a newcomer can't get from "I want
more anti-G-LOC" to the right line of `loot.json` here, they never become an
LSP user either. Be generous with pedagogical UX in service of that.

---

## The story

A new modder, on Discord:

> **Modder:** I want to make my pants give me more anti-G-LOC. How do I do that?

No one answers in time. They open the explorer.

**What they know:**

- The phrase **"anti-G-LOC"** from the in-game item description text.
- The wearable's strName (`ItmLeggings01`) from the item inspector.

**What they do not know** (each gap is a teaching moment in the path below):

1. That the underlying stat is `StatGrav`.
2. That "anti-G-LOC" isn't a game-data term at all.
3. That conditions can shift other conditions' thresholds via a naming
   convention.
4. The cond-string DSL — `Name=value x duration`.
5. That a Loot entry can grant a condition rather than drop an item.
6. Which JSON file to edit. The strName starts with `COND…` but lives in
   `loot/`.

---

## The path — site teaches, modder follows

### Step 1 — Search "anti-G-LOC"

> **Beginner expectation:** the data file calls it whatever the game calls
> it.

**Action:** type `anti-G-LOC` in the search bar.

> **What the site shows:** zero strName matches — but the search bar
> degrades into a **concept search**. Top result is a site-generated
> **Glossary** card titled *"Anti-G-LOC tolerance"*, with:
>
> - One line of plain English: *"How long the wearer resists G-induced
>   loss-of-consciousness in high-acceleration environments."*
> - A wiki link to **Stats / Standing G** (resolved from `wiki_cache/`).
> - A bold pointer: *"Game-data term:* [`conditions:StatGrav`](…)*"*.
> - A *"Modders adjusting this typically edit threshold-shifting
>   conditions"* hint with an arrow into the Stat explainer.

**Action:** click `conditions:StatGrav`.

### Step 2 — On `conditions:StatGrav`

> **Beginner expectation:** OK, this is the stat. I just edit it, right?

> **What the site shows** (top of detail page):
>
> - A dismissable contextual **"About Stat conditions"** banner:
>   *"Stat conditions hold a numeric value the game tracks every tick. The
>   stat itself is rarely tuned directly. Instead, modders adjust the
>   `Thresh<StatName>` conditions that shift when this stat triggers
>   in-game consequences."* Wiki link to **Conditions / Stats**.
> - The Fields block surfaces the schema's field descriptions inline (not
>   only on hover) for `Stat*` entries — newcomers shouldn't have to
>   discover that hovers exist.
> - A new **"Modifies thresholds of this"** sidebar lists derived edges
>   from `Thresh<StatName>`-pattern conditions. One entry: `ThreshStatGrav`.
>   This sidebar exists *because the site detected the `Thresh*` naming
>   convention from CLAUDE.md*; the modder didn't have to know about it.

**Action:** click `ThreshStatGrav` from the sidebar.

### Step 3 — On `conditions:ThreshStatGrav`

> **What the site shows** (top of detail page):
>
> - **"About threshold-shift conditions"** banner:
>   *"An entity holding this condition has the trigger thresholds for
>   `StatGrav` shifted by the cond-string's `value`. Higher `value` →
>   more tolerance before consequences fire."* Cross-link back to
>   `StatGrav`. Wiki link to **Conditions / Threshold modifiers**.
> - Inline **DSL primer**: a small example pinned at the top of the
>   incoming-refs panel — `"ThreshStatGrav=1.0x0.03125"` annotated with
>   labels: `name=ThreshStatGrav`, `value=1.0`, `duration=0.03125`. Hover
>   each label for one-sentence definitions.

> **Beginner question:** lots of incoming refs. Which one is the *pants*?

> **What the site shows:** every incoming-ref row carries:
>
> - A folder badge (`loot`, `condowners`, `interactions`, …).
> - A `strType:` badge when the source has one (`condition`, `item`,
>   `interaction`, …).
> - The labeled DSL metadata (`value: 1.0  duration: 0.03125`), not raw
>   cond-string text.
> - Friendly name when the source object has `strNameFriendly`.
>
> Above the list, **filter pills**: *"only Loot · strType:condition"*,
> *"only condowners:DRUG\*"*, *"only interactions"*. Each pill is named
> in plain language; tooltip explains what the filter narrows to and why
> a modder might want it.

**Action:** click *"only Loot · strType:condition"*. Wearable-grant subset
appears, ~5 rows. Scan, click `loot:CONDWearingCompressionPantsPer`.

### Step 4 — On `loot:CONDWearingCompressionPantsPer`

> **Beginner question:** the strName starts with `COND` but it's in
> `loot/`?

> **What the site shows:**
>
> - File path on the header reads `data/loot/loot.json`, monospace,
>   click-to-copy.
> - Right under it, an inline **"Why is this in `loot/`?"** note:
>   *"Loot entries deliver one of several payloads chosen via `strType`.
>   This entry has `strType: condition`, so the game applies the listed
>   `aCOs` to whoever the loot rolls onto — rather than spawning items.
>   strName prefixes (`COND…`, `Itm…`, `ACT…`) follow naming convention
>   but do not determine folder. The `strType` field does."*
> - The `strType: condition` field in the Fields block has a tooltip
>   showing the **full dispatch table**:
>   `item → condowners/`, `condition → conditions/`,
>   `interaction → interactions/`, `condrule → condrules/`,
>   `trigger → condtrigs/`, `lifeevent → lifeevents/`, `ship → ships/`.
>   Beginners shouldn't have to read CLAUDE.md to learn this.
> - The `aCOs` outgoing edges render as a structured table — labeled
>   columns `target`, `value`, `duration`, plus a collapsed raw row for
>   grep parity (`ThreshStatGrav=1.0x0.03125`).
> - An **"Edit this"** callout, generated from the parsed DSL:
>   *"To tune the magnitude of this effect, edit `value` of `aCOs[0]` in*
>   `data/loot/loot.json`*. Higher = stronger anti-G-LOC. Increments of
>   0.1 are meaningful in-game."*

**Action:** open `data/loot/loot.json`, search for the strName, change
`1.0` to `2.0`, save, run `make`, reload.

### Step 5 — Verify the edit took effect

> **What the site shows:** on next reload, the edge row's `value` reads
> `2.0`, with a small *"changed since last build"* highlight that decays
> after 24 h or one further build. Visual confirmation closes the loop —
> the modder sees the edit landed without re-reading the JSON.

### Step 6 — Generalize: solve the meds half

> **Beginner reflection:** the question said "leggings or meds." I want
> to answer both.

**Action:** back on `conditions:ThreshStatGrav`, switch the filter pill
from *"Loot · strType:condition"* to *"condowners:DRUG\*"*. Same shape:
labeled DSL values, edit callout, file path. Newcomer reaches the meds
answer by analogy, no new concepts.

---

## What the site needs to support this

Each item is marked **shipped** / **partial** / **proposed** so the gap is
explicit.

- **Concept / glossary search** alongside strName search (Step 1) —
  *proposed.* Hand-seeded alias map (~30-50 entries) bridging plain-English
  game terms to data terms; sourced from wiki page titles + the
  `Modding/*` pages already in `wiki_cache/`. No-results state should
  always have a *"Did you mean…"* fallback rather than dead-end.

- **Per-prefix contextual explainers** on detail pages, keyed by naming
  convention (`Stat*`, `Thresh*`, `COND*`, `Itm*`, `ACT*`, `DRUG*`, etc.)
  (Steps 2-4) — *proposed.* Short banners written once, rendered when the
  strName matches the convention. Lives alongside the existing per-folder
  `_README.md` fallback in the v1 plan.

- **Wiki links woven into explainers**, not only a separate Schemas tab
  (Steps 1, 2, 3) — *proposed.* The `wiki_cache/` workflow already
  exists; this is about surfacing the cached page as a link in context,
  at the moment a beginner needs it.

- **Derived `Thresh<X>` "modifies thresholds of" sidebar** on `Stat*`
  detail pages (Step 2) — *not yet shipped, planned.* CLAUDE.md already
  flags this as a name-pattern-derived edge. This newcomer story is its
  primary justification: it lets the modder step `Stat → Thresh` without
  knowing the rule beforehand.

- **Source-folder + `strType` badges on every ref row** (Step 3) —
  *partial.* Folder is implicit in the link today; `strType` is not
  surfaced visually at all. Promote both to badges so the wearable vs.
  drug vs. interaction split is legible at a glance.

- **Filter pills on incoming refs**, by source folder, `strType`, and
  edge-metadata range (Step 3, Step 6) — *not yet shipped.* The
  anti-g-loc-leggings story flagged this as polish; for newcomers it is
  load-bearing — without filtering, "scan the list" means re-confronting
  vocabulary they don't have.

- **DSL primer popover** for any cond-string / loot-string field (Step 3)
  — *proposed.* Single hoverable component applied wherever a parsed DSL
  value appears. Three sentences max: what `name`, `value`, and
  `duration` (or `chance`, `min`, `max`, `positive` for loot) mean.

- **Inline schema descriptions, not just on-hover** (Steps 2-4) —
  *partial.* Hovers are great for power users; newcomers don't know to
  hover. Render the field description inline beneath each field in the
  Fields block, collapsible once the user dismisses it.

- **`strType` dispatch table** as a tooltip on every `strType` field
  (Step 4) — *proposed.* CLAUDE.md classifies `strType` as an enum; this
  is the visible surface. Beginners learn the dispatch by seeing it,
  every time, in context.

- **"Why is this in *X*/?" inline note** when a strName's prefix
  convention disagrees with its folder (Step 4) — *proposed.* Detected
  automatically: if a strName matches a convention that maps to folder
  *Y*, but the entry is actually in folder *X*, render an explainer.
  Worth doing once site-wide.

- **"Edit this" callout** with a canonical, parsed instruction
  (Step 4) — *proposed.* Generated from the DSL parse: *"To tune the
  magnitude, edit `value` of `aCOs[0]` in `<file>`."* This is the line
  the skilled modder reasoned out from first principles; the newcomer
  gets it served.

- **Live-build confirmation** — per-edge metadata diff highlighting after
  rebuild (Step 5) — *partial.* The pipeline regenerates everything
  already; the missing piece is "show me what changed" feedback so a
  newcomer can close the loop on their own edit.

- **Pedagogical filter pill names**, in plain language with tooltips
  (Step 3, Step 6) — *proposed.* "Only Loot · strType:condition" beats
  raw `strType=condition`. The pill's tooltip explains *why* a modder
  would narrow to that subset (wearable grants vs. drug grants vs.
  interaction grants).

The shipped surface gets the *lucky* modder to the right line of
`loot.json`. The proposals above are what get the *unlucky and unschooled*
modder there too — and, more importantly, level them up to where the v2
LSP is even worth installing.

---

## Acceptance criterion

A tester who has **never modded Ostranauts before**, given only:

- The in-game strName `ItmLeggings01`,
- The question *"how do I make these give more anti-G-LOC?"*,
- The explorer site, with no Discord / wiki / friend access,

reaches the right line of `loot/loot.json` in **under 10 minutes** *and*
can articulate, at the end, what each of these means in their own words:

- `StatGrav`
- `ThreshStatGrav`
- `value` and `duration` in a cond-string
- Why a `COND…`-prefixed entry lives in `loot/`

Because the site told them, not because they walked in knowing.

Test with a fresh user every time. Once you've seen the path, you can't
un-see it.
