# User story — anti-G-LOC modding from `ItmLeggings01`

A scoring/test scenario for the Ostranaut Data Explorer site. Captures a real
forum-style modder question and walks two end-to-end paths through the site to
the exact line of `loot.json` that needs editing. The site is "good enough"
when both paths are smooth.

## The story

A modder is on Discord / the wiki / a forum and types this:

> **Modder:** does anyone know how to up the anti-G-LOC stat of leggings or meds?

A senior modder answers:

> **Answer:** `loot.json`
> ```json
> { "strName" : "CONDWearingCompressionPantsPer", "aCOs" : [ "ThreshStatGrav=1.0x0.03125" ], "aLoots" : [], "strType" : "condition" },
> ```
> bump the `1.0` (the value coefficient on the threshold shift) — higher = more anti-G-LOC.

The modder doesn't know any of:
- which folder `CONDWearingCompressionPantsPer` lives in (it's `loot/`, but it doesn't have to be — a name like that could plausibly be in `condowners/`).
- that anti-G-LOC isn't its own stat — it's mediated by the **threshold** of `StatGrav` (the standing-G stat), shifted by `ThreshStatGrav` entries.
- the cond-string DSL syntax `Name=value xduration`.

The site has to make the answer findable from a starting point the modder *does*
have: the in-game item description on a pair of compression pants, which names
`ItmLeggings01` (or similar — the `Itm*` strName is what the inspector / game
shows when the player looks at the item).

## Follow-up story prompts

Use either of these as a system message when test-driving the site against a
fresh scenario or when generating more user-story files in this format:

> **Test prompt:** Roleplay an Ostranauts modder with the question above. You
> know the in-game item strName (`ItmLeggings01`) and you know the loot.json
> entry someone pasted as the answer (`CONDWearingCompressionPantsPer`). Walk
> through the Ostranaut Data Explorer site as you'd actually use it — search,
> click, scan refs — and report (a) whether you reached the right loot.json
> entry, (b) how many wrong turns you took, and (c) which page or signal
> prevented a wrong turn from becoming a dead end.

> **Generation prompt:** Given a one-line modder question and its loot.json /
> conditions.json / interactions.json answer, produce a `notes/user-stories/<slug>.md`
> file in the same shape as `anti-g-loc-leggings.md` — story, the two solution
> paths (lucky + skilled with thought blurbs), and a "what the site needs to
> support this" callout listing the specific features the path depends on.

---

## Solution version 1 — the **lucky** modder

Clicks correct links by happy accident. No thought blurbs — just the path.

1. Search bar: type `ItmLeggings01`. First hit. Click.
2. On the detail page, scroll to **Referenced by**. Eyeballs the list looking for anything with "compression" or "pants" in the name.
3. Spots `loot:CONDWearingCompressionPantsPer` under the `aCOs` group (or similar). Click.
4. New detail page. Detail header shows `file: data/loot/loot.json`.
5. **Outgoing refs** group `aCOs[*]` shows one row: `→ conditions:ThreshStatGrav  [value=1.0 dur=0.03125]`. The `value=1.0` is the dial.
6. Open `data/loot/loot.json` in a text editor, search for `CONDWearingCompressionPantsPer`, bump `1.0` to taste.

**Why it worked:** the answer's strName happened to contain a recognizable English word (`Compression`) so the eye filtered it correctly out of the incoming-refs list. If the answer had been keyed under something opaque like `LCONDPant03`, the lucky path falls apart.

---

## Solution version 2 — the **skilled** modder

Navigates by skill and reason, with thought blurbs at each step. Doesn't depend
on lucky pattern-matching of the answer's name. Could find this even if every
strName were `XYZ001`.

### Step 1 — Reframe the question

> **Thought:** "Anti-G-LOC" isn't an Ostranauts game term. The visible stat in
> the game UI for high-G-environments is **standing-G tolerance** — that's
> `StatGrav` in data terms. The mod doesn't change `StatGrav` directly; it
> shifts the *thresholds* at which the stat triggers G-LOC.

**Action:** search `StatGrav`. Find it in `conditions/`.

### Step 2 — Confirm the stat, scan its incoming refs

On `conditions:StatGrav`'s detail page:

> **Thought:** Things that **read** this stat appear as incoming refs. Things
> that **modify its thresholds** are named `Thresh<StatName>` — that's a
> game-engine naming convention noted in `CLAUDE.md`. The latter is what
> compression pants do.

**Action:** open the **Schemas** tab, then click `conditions/`. Scan field
descriptions for `Thresh<X>` semantics (the schema description for
`ThreshStatGrav`-class entries explains the dynamic-threshold mechanic). Then
back to search and type `ThreshStatGrav`.

### Step 3 — On `conditions:ThreshStatGrav`, scan the incoming refs

> **Thought:** Every entity that *grants* this threshold-shift will show up as
> an incoming ref under `aCOs[*]` (Loot kind). The metadata on each edge —
> `[value=X.X dur=Y]` — is the magnitude × duration coefficient pair I'll edit.
> Filter the list to entries with `value` ≠ 0 and find the one tied to the
> wearable.

**Action:** scan `Referenced by`. Group is `aCOs` (Loot). Several entries.
Inspect their source folders and naming — the `loot:CONDWearing...` entries
are the wearable-clothing condition grants; `condowners:DRUG...` would be the
medication path.

### Step 4 — Open the candidate, verify

Click `loot:CONDWearingCompressionPantsPer`.

> **Thought:** The detail page should confirm two things:
> (a) `strType: "condition"` (so this is a Loot entry that grants a condition,
> not an item drop), and
> (b) `aCOs` outgoing edges include exactly the threshold I'm aiming for.

**Action:** scan **Fields** block — sees `strType: condition`. Scan
**References out** — `aCOs[*] → conditions:ThreshStatGrav [value=1.0 dur=0.03125]`.
Match.

### Step 5 — File location

Detail header: `file: data/loot/loot.json`.

> **Thought:** Loot entries live in `loot.json`, not `condowners.json`. That's
> non-obvious — the strName starts with `COND` so a beginner would assume
> conditions/. The file path on the detail head is the canonical answer.

**Action:** open `data/loot/loot.json`, search for the strName, edit the value
field (`1.0`). Verify by re-running the build and checking the metadata on
the edge updates.

### Step 6 — Find the meds path too

> **Thought:** The original question said *"leggings or meds."* The skilled
> modder finishes the trace for the meds path so they answer the *whole*
> question, not just the wearable half.

**Action:** back on `conditions:ThreshStatGrav`'s incoming refs, look for any
`condowners:DRUG*` or `loot:CONDDrug*` / `interactions:ACTPill*` entries.
Each one is a separate dial in the same units.

---

## What the site needs to support this

- **Search by strName** (both versions, every step) — already shipped.
- **Object detail page with grouped Referenced-by** (both versions, step 2-3) — already shipped.
- **Edge metadata on cond-string / loot-entry edges** (both versions, step 5) — already shipped (`value`/`duration` on Condition; `chance`/`min`/`max`/`positive` on Loot).
- **Source-file path on the detail head** (both versions, step 5) — already shipped.
- **Schema inspector** (skilled version, step 2) — for surfacing the `Thresh<X>` mechanic via field descriptions. Already shipped.
- **Field-description tooltips** (skilled version, step 2) — already shipped (hover the field name in the Fields block).
- **Filter incoming refs by source folder + edge metadata** (skilled version, step 3) — *not yet shipped.* Currently the user has to eyeball the list. Promotion candidate for a future slice if user-story testing shows it as the bottleneck.
- **`Thresh<X>` derived "modifies thresholds of …" relationship** (skilled version, step 2) — *not yet shipped.* CLAUDE.md notes this as a planned name-pattern-derived edge.

The first ~80% of both paths works on what's already shipped. The remaining
~20% (filtering, derived name-pattern edges) is the kind of polish that user
stories like this one are supposed to surface.

---

## Acceptance criterion

The site is "anti-G-LOC ready" when a tester running version 1 reaches step 6
with at most one wrong click, and a tester running version 2 reaches step 6
without any wrong clicks. Test with a fresh user every time — once you've seen
the answer, you can't un-see the path.
