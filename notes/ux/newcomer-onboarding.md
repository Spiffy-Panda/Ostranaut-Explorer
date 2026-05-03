# UX plan — newcomer onboarding surface

Derived from [`notes/user-stories/anti-g-loc-newcomer.md`](../user-stories/anti-g-loc-newcomer.md).
That story walks a beginner from "I want more anti-G-LOC" to the right line
of `loot.json` by leaning on a set of pedagogical UI components. This file
is the spec for those components.

**Scope.** Content + constraints, not visual design. The actual layout,
typography, color palette, spacing, and interaction polish are produced in
a separate design tool. This document is what a UX designer needs to walk
into that tool with.

**Audience priority.** Beginner first. The LSP (v2) is where the skill
ceiling lives; the site is the ramp up to it. When a tradeoff appears
between "looks clean for power users" and "teaches a beginner the term it
just used," favor the beginner. Power users get dismissibility, not
absence.

---

## Section 1 — Content

What appears on the page. Each component is defined by its name, purpose,
data source, concrete copy/fields, and behavior. The designer chooses how
it looks; this section locks down what it carries.

### 1.1 Concept / glossary search result card

**Where it appears.** Search bar dropdown / no-results state, when the
typed query matches a glossary alias instead of (or in addition to) a
strName.

**Purpose.** Bridge plain-English game vocabulary to data-tree terms.
"Anti-G-LOC" → `conditions:StatGrav`.

**Data source.** Hand-seeded alias map (~30-50 entries to start), keyed
on wiki page titles, section headings, and item-description phrases.
Lives at `comment_mod/data/glossary/*.json` (proposed location). Each
entry: `{ aliases: [...], summary: "...", wikiPage: "...", dataTerm: { folder, strName } }`.

**Content per card.**

- Title — the resolved concept name (not the alias the user typed).
- One-line plain-English summary, ≤ 30 words.
- Wiki link, labeled with the wiki page title and an external-link
  marker.
- Game-data term — folder + strName, rendered as a link to the detail
  page. This is the primary call-to-action.
- Optional one-line "Modders adjusting this typically…" hint pointing
  at the most common modding entry point (e.g. *"edit threshold-shifting
  conditions, not the stat itself"*).

**Behavior.**

- Card is clickable as a whole; the data-term link is a separate target.
- A card is visually distinct from a strName search result so the user
  registers "this is a concept, not an object."

---

### 1.2 Per-prefix contextual explainer banner

**Where it appears.** Top of any object detail page whose strName matches
a recognized naming convention. Below the header, above the Fields block.

**Purpose.** Teach the engine convention (`Stat*`, `Thresh*`, `COND*`,
`Itm*`, `ACT*`, `DRUG*`, etc.) at the moment the user lands on an
instance of it.

**Data source.** A small library of explainer entries keyed on prefix
(or prefix + folder pair when the same prefix means different things in
different folders). Each entry: `{ prefixPattern, folder?, title, body, wikiPage? }`.
Lives in repo as `src/Ostranauts.Site/explainers/*.json` (proposed).

**Content per banner.**

- Title — *"About Stat conditions"*, *"About threshold-shift conditions"*,
  *"About wearable condition grants"*, etc.
- Body — 2-4 sentences. Plain English. Names the convention, explains
  what it does, names the typical tuning pattern. Example body for
  `Thresh*`:
  > *"An entity holding this condition has the trigger thresholds for
  > `StatGrav` shifted by the cond-string's `value`. Higher `value` = more
  > tolerance before consequences fire. Modders typically tune G-LOC,
  > hunger tolerance, etc. by editing these values on existing
  > Threshold-shift conditions, not by adding new ones."*
- Cross-link — *"See also: [`conditions:StatGrav`]"* when relevant
  (resolved automatically from the strName, e.g. `Thresh<X>` → `<X>`).
- Wiki link — when the explainer references a documented system.
- Dismiss control — closes the banner for this prefix class for this
  user (localStorage), site-wide.

**Behavior.**

- Multiple banners can stack on a single page when multiple conventions
  apply (rare but possible). Each is independently dismissible.
- Dismissed state is keyed per prefix-class, not per page. Once a user
  dismisses *"About Stat conditions"* on `StatGrav`, it stays dismissed
  on `StatHunger`, `StatThirst`, etc.
- Reset affordance lives in the site footer / settings — *"Re-show all
  beginner explainers."*

---

### 1.3 Inline schema field descriptions

**Where it appears.** Inside the Fields block on every detail page,
beneath each field name + value pair.

**Purpose.** Schema descriptions are already extracted; today they're
hover-only. Newcomers don't know to hover. Render them inline by
default.

**Data source.** Existing schema description extraction in
`src/Ostranauts.DataModel/SchemaLoader.cs` plus the Comment Mod overlay
in `comment_mod/data/schemas/`.

**Content per field.**

- Field name — monospace.
- Field value — monospace, type-aware rendering (string, number, array,
  ref-link).
- Description — prose, italic or muted. Schema description if present;
  otherwise a generated *"No description available — contribute one to
  Comment Mod"* placeholder with link.
- Provenance marker — small label *"from base schema"* / *"from Comment
  Mod"* / *"derived"*, only on hover or in a power-user mode.

**Behavior.**

- Per-page toggle: *"Hide field descriptions."* Persists in localStorage.
- When descriptions are dense (>500 words on a page), collapse to a
  single inline line per field with a *"Show description"* expander, to
  keep the page scannable.

---

### 1.4 Derived "Modifies thresholds of this" sidebar

**Where it appears.** Right rail of `Stat*` condition detail pages.

**Purpose.** Surface the engine's `Thresh<StatName>` naming convention
as a first-class derived relationship. Lets a beginner step from
`StatGrav` to `ThreshStatGrav` without knowing the rule.

**Data source.** Computed at build time by scanning `conditions/` for
strNames matching `Thresh<currentStrName>`.

**Content.**

- Sidebar title — *"Modifies thresholds of this"* (when on a `Stat*`
  page) / *"This modifies thresholds of"* (mirror, on a `Thresh*` page,
  pointing back).
- One row per matched condition: link with the matched strName +
  friendly name + a count of incoming refs (so the user sees which
  threshold-modifiers are widely used vs. orphaned).
- One-line explainer at the top: *"These are conditions whose name
  matches the engine convention `Thresh<StatName>`. They dynamically
  shift when this stat triggers consequences."*

**Behavior.**

- Empty state suppressed — sidebar only renders if at least one match
  exists.
- Same component used on the inverse direction (`Thresh*` → `Stat*`)
  with title flipped.

---

### 1.5 Folder + strType badges on every ref row

**Where it appears.** Every row of every incoming-refs and outgoing-refs
panel, site-wide.

**Purpose.** Make the source's folder and (where applicable) `strType`
visible without making the user click into the source object.

**Data source.** Folder is known from the registry. `strType` is a known
enum field; surface it whenever the source object has one.

**Content per row.**

- Direction marker — `→` for outgoing, `←` for incoming.
- Folder badge — the source/target folder, e.g. `loot`, `condowners`,
  `interactions`.
- `strType` badge — only when the source has a `strType` field.
  Examples: `strType: condition`, `strType: item`,
  `strType: interaction`.
- strName — link to detail page.
- Friendly name — when present, in muted text.
- Edge metadata — labeled key-value pairs (`value: 1.0`,
  `duration: 0.03125`, `chance: 0.5`, `min: 1`, `max: 3`, `positive`,
  etc.) — no raw DSL string in the primary row.
- Raw form — collapsed under the row, expandable, shown as monospace
  for grep parity (`ThreshStatGrav=1.0x0.03125`).

**Behavior.**

- Badges are filterable — clicking a badge can apply it as a filter pill
  (see 1.6) on the current ref list.
- Folder badges have a stable color/symbol per folder, site-wide, so
  users learn the visual vocabulary.

---

### 1.6 Filter pills above ref lists

**Where it appears.** Above every incoming-refs panel that contains more
than ~5 rows. Optionally outgoing too if a page warrants it.

**Purpose.** Let the user narrow a ref list by source folder, `strType`,
or edge metadata. Replaces the current "eyeball a long list" UX.

**Content per pill.**

- Plain-language label — *"Only Loot · strType:condition"*, *"Only meds
  (`condowners:DRUG*`)"*, *"Only interactions"*. Not raw filter syntax.
- Tooltip — explains what subset the pill narrows to and why a modder
  might want it. Example: *"Wearable condition grants. Loot entries
  with `strType: condition` apply their `aCOs` payload to whoever rolls
  the loot — typical for clothing and embedded augments."*
- Active count — *"5 of 47"* once applied.

**Behavior.**

- Pills are pre-suggested by the site, not invented by the user. The
  builder generates a pill set per page based on which folders +
  `strType`s appear in the list, plus any common groupings (e.g. all
  `DRUG*` strNames in `condowners/` get a "meds" pill).
- A *"clear filters"* control is always visible when any pill is
  active.
- Multi-pill: pills combine as AND across dimensions (folder ∧
  `strType`), OR within a dimension (folder = loot OR condowners).

---

### 1.7 DSL primer popover

**Where it appears.** Anchored to any rendered cond-string or loot-string
metadata cluster — the labeled `value` / `duration` / `chance` / `min` /
`max` / `positive` chips.

**Purpose.** Teach the DSL syntax in place. The skilled-modder path
assumed knowledge of `Name=value x duration` and the loot string format;
the popover serves it.

**Content.**

- Heading — *"Cond-string format"* / *"Loot-string format"*.
- One labeled example, taken from the row the user is hovering — not a
  generic textbook example.
  - Cond-string: `ThreshStatGrav=1.0x0.03125` →
    `name = ThreshStatGrav`, `value = 1.0`, `duration = 0.03125`.
  - Loot-string: `ItmFoo=0.5x1-3` → `name = ItmFoo`, `chance = 0.5`,
    `fMin = 1`, `fMax = 3`, `bPositive = true`.
- Two- or three-sentence explanation of what each named part *means in
  game*. *"`value` scales the effect's magnitude. `duration` is per
  game-tick persistence."*
- Link to a deeper reference page (`/help/dsl` or wiki).

**Behavior.**

- Triggered on hover *and* focus (keyboard) — not hover-only.
- Click-to-pin so the user can read it without keeping the cursor still.

---

### 1.8 `strType` dispatch tooltip

**Where it appears.** On any `strType` field in any Fields block.

**Purpose.** Make visible the dispatch table the schema-driven extractor
already uses (per CLAUDE.md). Lets a beginner understand why a `loot/`
entry with `strType: condition` behaves like a condition grant.

**Content.**

- Heading — *"`strType` controls how this entry is dispatched."*
- Dispatch table — two columns:
  - `strType` value (`item`, `condition`, `interaction`, `condrule`,
    `trigger`, `lifeevent`, `ship`).
  - Resolved target folder + one-line behavior summary
    (*"the `aCOs` payload spawns these items into inventory"*,
    *"the `aCOs` payload applies these conditions to the recipient"*,
    etc.).
- Highlight the row matching the current entry's `strType` value.

**Behavior.**

- Hover and focus and click-pin. Same interaction as 1.7.
- Also appears as a static section on `/help/loot-strtype` for users who
  want a direct reference page.

---

### 1.9 "Why is this in `X/`?" inline note

**Where it appears.** Beneath the file path on the detail header, when
the entry's strName matches a naming convention that maps to one folder
but the entry actually lives in a different folder.

**Purpose.** Resolve the most common newcomer trap: a strName starting
with `COND…` that turns out to live in `loot/` (because of `strType`),
or `Itm…` that lives in `condowners/`, etc.

**Data source.** Computed at build time. For each object, check whether
its strName prefix has a documented "expected folder" mapping; if the
actual folder differs, generate the note.

**Content.**

- Title — *"Why is this in `loot/`?"* (templated by actual folder).
- Body — 2-3 sentences. Names the prefix convention, names the routing
  field that overrides it, restates the key takeaway.
  > *"strName prefixes (`COND…`, `Itm…`, `ACT…`) follow naming
  > convention but do not determine folder. The `strType` field does.
  > This entry's `strType: condition` means it lives in `loot/` because
  > Loot is the engine's grant-dispatcher folder, not because of the
  > `COND…` prefix."*
- Cross-link — *"See:* [strType dispatch] *"* (component 1.8).

**Behavior.**

- Dismissible per prefix-class, like the explainer banner (1.2).

---

### 1.10 "Edit this" callout

**Where it appears.** On detail pages where the entry is meaningfully
modder-tunable (Loot entries with cond-string or loot-string payloads,
condition entries with default values, etc.). Rendered as a distinct
callout block, not a tooltip.

**Purpose.** Hand the beginner the canonical edit instruction the
skilled modder reasoned out. Closes the loop between "I found the
entry" and "I know what to change."

**Data source.** Generated from the parsed payload at build time.
Templates per payload kind. Example for cond-string `value` on a Loot
entry granting a `Thresh*` condition:

> *"To tune the magnitude of this effect, edit the `value` of `aCOs[0]`
> in* `data/loot/loot.json` *(line N). Higher `value` = stronger effect.
> Increments of 0.1 are meaningful in-game. Don't forget to run* `make`
> *to rebuild."*

**Content.**

- Heading — *"Edit this"*.
- Action body — the templated instruction above. Specifies:
  - What field to change.
  - What file to edit, with full path.
  - Line number if known.
  - Direction of effect (*higher = stronger*).
  - Sensible increment size.
  - Build/reload reminder.
- Optional sub-note — known caveats per payload kind (*"This effect
  stacks with other `Thresh<StatName>` modifiers — your effective
  shift is the sum of all active grants."*).

**Behavior.**

- Always visible, never auto-dismissed. Power users dismiss site-wide
  via settings if it's too prominent.
- Copy-to-clipboard affordance on the file path.

---

### 1.11 Live-build diff highlight

**Where it appears.** Edge metadata cells, field values — anywhere a
build-output value can change between rebuilds.

**Purpose.** After a modder edits a value and runs `make`, show them
*what changed* on the next page load. Closes the feedback loop on
"did my edit take?"

**Data source.** Compare the current build's `graph.js` payload against
the previous build's, cached locally per browser.

**Content.**

- Visual highlight on the changed value — color-tagged, with a small
  *"changed since last build"* label on hover.
- Old value shown alongside new in the hover, e.g.
  *"value: 2.0 (was 1.0)"*.

**Behavior.**

- Highlight decays after 24 h, or after one further build that doesn't
  change the value, whichever comes first.
- Per-user toggle to disable site-wide.

---

### 1.12 Plain-language wiki links

**Where it appears.** Throughout: explainer banners (1.2), glossary
cards (1.1), DSL primer (1.7).

**Purpose.** Get the beginner to authoritative external context without
forcing them to find the wiki on their own.

**Data source.** `wiki_cache/` already pulls Modding/* pages locally.
Link target is the live wiki URL; the existence check is "do we have
this page in the cache?"

**Content.** A standard external-link affordance with the wiki page
title as the visible label. Off-site marker (icon, underline style,
whatever the designer chooses) so the user knows it leaves the
explorer.

**Behavior.** Opens in a new tab. Pre-validated at build time —
unresolved links are caught in the build's health/lint output and don't
ship to the site.

---

## Section 2 — Display constraints and priorities

Things a UX designer needs to know to make these components compose well.

### 2.1 Hierarchy on the object detail page

The dominant page in this app. From top to bottom on a typical page:

1. **Header** — strName, folder, friendly name, source file path
   (monospace, click-to-copy). Always present.
2. **Per-prefix explainer banner(s)** (1.2) — beneath header, before
   anything else, dismissible.
3. **"Why is this in `X/`?" inline note** (1.9) — when applicable,
   immediately under the file path. Visually subordinate to the
   header but visually proximate to it.
4. **"Edit this" callout** (1.10) — strongest visual emphasis on the
   page when applicable. This is the action the modder came to do; it
   should be the thing the eye lands on after the header.
5. **Fields block with inline descriptions** (1.3) — primary content
   block.
6. **Outgoing refs panel** — secondary block. Filter pills (1.6) above
   if list > ~5 rows.
7. **Incoming refs panel** — typically the longest block on the page;
   the killer feature. Filter pills (1.6) always.
8. **Derived sidebars** (1.4) — right rail on `Stat*` / `Thresh*` /
   etc. pages. On narrow viewports, collapse below the incoming refs.
9. **Mini graph** — under or aside, with drag-positioning persistence
   (already shipped invariant — don't break it).
10. **Raw JSON** — collapsed by default. Power-user fallback.

The "Edit this" callout (4) being prominent is deliberate — for a
modder on a tuning task, this is the destination, not the journey.

### 2.2 Beginner-first density

- **Default to verbosity.** A page on first visit shows full inline
  schema descriptions, all explainer banners, all callouts. This will
  feel cluttered to power users; that is OK because power users
  dismiss.
- **Dismissibility, not absence.** Every beginner-targeted component
  has a dismiss affordance that persists in localStorage. Per-prefix
  classes for explainers (one dismiss covers all `Stat*` pages). A
  *"Re-show all beginner explainers"* control lives in site settings
  / footer.
- **Don't gate on hover.** Hover-only schema descriptions are a known
  failure mode for beginners — they don't know to hover. Render
  inline, allow collapse. Same rule for tooltips: any hover-revealed
  content has an inline or click-pin alternative.
- **Plain language first, jargon second.** Every label starts in plain
  English with the data-tree term in parens or as the secondary line.
  *"Wearable condition grants (`Loot · strType:condition`)"*, not
  *"`strType=condition`"*.

### 2.3 Power-user respect

Beginner-first is the priority but power users are real and will hit
many pages per session. They need:

- One-click site-wide dismiss for explainer banners and the *"Edit
  this"* callout.
- A persistent compact mode toggle that switches inline descriptions
  to hover-only and collapses callouts.
- Keyboard navigation through ref rows and filter pills.

### 2.4 Visual vocabulary — distinguish each component class

The page can carry up to seven distinct UI element classes. Designer
must keep these visually separable:

1. **Header** — site-wide identity for the object.
2. **Explainer banner** (1.2) — pedagogical, dismissible. Tone:
   *"about this kind of thing."*
3. **Inline note** (1.9) — pedagogical, addresses a specific page-local
   question. Tone: *"here's why this looks weird."*
4. **Callout** (1.10) — actionable. Tone: *"here's what to do."*
5. **Folder badge** (1.5) — identity tag, every ref row.
6. **`strType` badge** (1.5) — identity tag, conditional, must be
   distinguishable from folder badges.
7. **Filter pill** (1.6) — interactive control, distinguishable from
   badges.

### 2.5 Stable color/symbol vocabulary site-wide

- **Folder badges** have a stable color and/or icon per folder, set
  once across the site. Users learn `loot=X color`, `condowners=Y
  color`, and the visual carries meaning across pages. ~30 folders →
  the palette must be expressive enough to disambiguate without being
  garish.
- **`strType` badges** share a single visual treatment (since `strType`
  is a smaller enum, ~7 values), distinguishable from folder badges.
- **Direction markers** (`→` / `←`) are color-neutral.
- **Diff highlights** (1.11) use a single color reserved for "changed
  since last build" — not reused elsewhere.

### 2.6 Scaling: pages with 0 vs. many

A given page can range from "tiny, two refs total" to "hub object,
500+ incoming refs." Components must hold up at both extremes.

- **Sidebars and derived panels** should suppress their empty state.
  Don't render *"Modifies thresholds of this — none"*; render nothing.
- **Filter pills** appear only when the list they apply to is long
  enough to warrant filtering (~5 rows is the suggested threshold;
  designer can tune).
- **Inline schema descriptions** auto-collapse to one-line summaries
  when the page exceeds a density threshold; expander available
  per-field.
- **Long ref lists** virtualize / paginate. Filter pills and sort are
  the primary ways to make a long list useful, not scroll endurance.

### 2.7 Static-site constraints

- The site is a vanilla-JS SPA running off `graph.js` (a
  `<script src>`-loadable JS-wrapped JSON payload). It works from
  `file://` URLs without a local server. No build framework.
- Persistent state — explainer dismissals, filter pill memory, mini-
  graph node positions — uses localStorage keyed by the object's
  `(folder, strName)` pair.
- No back-end. Search, glossary, badge population, filter pill
  generation, and edge-metadata diff are all driven from the static
  payload.
- Deploy target is GitHub Pages; the site needs a configurable base
  path. All asset paths are relative.

### 2.8 Accessibility floor

- Keyboard navigation for ref rows, filter pills, dismiss controls,
  expanders.
- Hover-revealed content (DSL primer, dispatch tooltip) must trigger
  on focus too.
- Color is never the sole carrier of meaning — folder badges combine
  color with a text label or icon.
- Diff highlight (1.11) uses both color and a marker label.
- All copy is sized for screen-reader plain-text consumption (no
  ASCII art that depends on visual layout for meaning).

### 2.9 Out of scope for this plan

- Visual design (palette, type, spacing, motion) — the next tool's
  job.
- Actual layout grids, breakpoints, responsive behavior beyond "narrow
  viewports collapse the right rail under the main column."
- The Health page (dangling refs, orphans, duplicates) — separate
  surface, separate plan.
- The Schemas tab — separate surface, separate plan.
- Mini-graph styling — already shipped, drag-position persistence is
  the load-bearing invariant; don't break it.
- LSP / editor-side UX — v2 scope, out of frame.

---

## Section 3 — Stretch goals

Components flagged here are pedagogically valuable but more uncertain in
shape and implementation cost than 1.1-1.12. Treat them as design
exploration rather than commitments.

### 3.1 (stretch) Cluster pages

**Premise.** Many interesting concepts in the data tree don't get their
own folder. They live as a *prefix-cluster* inside one. Examples:

- `condowners/Body*` — body parts.
- `condowners/DRUG*` — medications.
- `condowners/CT*` — condition triggers (the "stat is now in this state"
  flag objects, distinct from `condtrigs/`).
- `interactions/ACTSurgery*` — surgical interactions.
- `conditions/Stat*` — stat conditions (already partially surfaced via
  the per-prefix explainer in 1.2).
- `conditions/Thresh*` — threshold-shift conditions.

The folder index is too coarse — a beginner browsing `condowners/` sees
1000+ entries jumbled together. The object detail page is too narrow —
it doesn't explain the cluster's purpose. A cluster page sits between
them, answering three questions a newcomer asks but currently can't:

- **What is this cluster?** ("`Body*` are body parts as condowners.")
- **Why do they exist *as condowners* rather than items, conditions, or
  interactions?** ("Body parts are condowners so they can carry
  conditions — damage, infection, prosthetic state. The condowner is
  the *anchor* the rest of the data tree points at.")
- **What aspect of the body part do they encode, compared to their
  in/outs?** ("This cluster owns the *identity + state container*
  aspect. Damage states live in `conditions/CondBodyDmg*`. Repair
  actions live in `interactions/ACTBody*`. Equipment that goes onto a
  body part lives in `items/`. The condowner is the thing all those
  other folders point at.")

The third question is the load-bearing one — and the one that has no
home in the existing site surface.

#### Where it appears

A new page kind, sitting between folder index and object detail. URL:
`/cluster/<folder>/<slug>`. Linkable from:

- The folder index, which lists known clusters at the top before the
  full member list.
- Each object detail page, header line: *"Part of cluster: [Body
  parts]"* when the strName matches a known cluster pattern.
- Search results, when a query matches a cluster name or member.

#### Content

- **Title.** *"Body parts (`condowners/Body*`)"*. Member count and
  pattern visible.
- **One-paragraph description** (curated — see 3.1 detection below).
  What this cluster *is*.
- **"Why this cluster exists *as `<folder>`*"** section — 2-3 sentences
  on the cluster's role within the folder's broader purpose.
- **"What this cluster encodes — compared with the neighborhood"**
  section. The structurally most novel piece. Renders a small
  comparison table or diagram:

  | Aspect | Lives in | Example |
  |---|---|---|
  | Identity + state container | this cluster (`condowners/Body*`) | `BodyHead`, `BodyTorso` |
  | Damage states | `conditions/CondBodyDmg*` | `CondBodyDmgArmBroken` |
  | Repair / surgery actions | `interactions/ACTBody*` | `ACTBodySurgeryAmputate` |
  | Equipment slots | `items/` (body-attached) | `ItmCyberArm01` |
  | Damage-to-state rules | `condrules/` | `CRBodyDmgEscalation` |

  Curated per cluster; auto-suggested rows from reference signature
  (see 3.1 detection).
- **Member list.** Sortable, virtualized. Each row: strName + friendly
  name + a one-line summary (auto-generated from key fields, e.g.
  *"left arm — 6 conditions, 4 interactions"*).
- **Shared field signature.** Auto-derived. *"All `Body*` entries
  carry: `strNameFriendly`, `aStartingConds`, `<other shared fields>`.
  Compared to the rest of `condowners/`, these fields are
  cluster-distinguishing: `<list>`."* Pedagogical — teaches the
  cluster's "shape."
- **Reference signature.** Auto-derived heatmap or table. *"Members
  typically point into: `conditions/` (94%), `items/` (40%). Members
  are typically pointed at by: `interactions/` (88%),
  `condrules/` (60%)."* The shape of the cluster's edges, summarized.
- **Related clusters.** Cross-folder links — to `conditions/CondBodyDmg*`,
  `interactions/ACTBody*`, etc. Curated where possible, auto-suggested
  by name correlation when not. This is what answers the "compared to
  in/outs" question structurally.
- **Wiki link** if one of the cached `Modding/*` pages covers the
  cluster.

#### Detection (the "idk how it works" piece)

Three-tier approach, easy → harder:

1. **Curated clusters.** Maintainer writes
   `comment_mod/data/clusters/<folder>__<slug>.json`:
   ```json
   {
     "folder": "condowners",
     "slug": "body-parts",
     "name": "Body parts",
     "pattern": "^Body[A-Z]",
     "exclusions": ["^BodyDmg"],
     "description": "Body parts as condowner objects — each represents a single physical part of a character that can hold state.",
     "encodes": "Identity + state container.",
     "comparisons": [
       { "aspect": "Damage states", "folder": "conditions", "pattern": "^CondBodyDmg" },
       { "aspect": "Repair actions", "folder": "interactions", "pattern": "^ACTBody" }
     ],
     "wikiPage": "Modding/CondOwners#BodyParts"
   }
   ```
   Simplest layer. Acts as ground truth.
2. **Auto-detected naming clusters.** Build-time pass groups entries
   within each folder by shared camelCase prefix segments. Hierarchical
   — `Body` is a cluster, `BodyArm` is a sub-cluster of it,
   `BodyArmCyber` is a sub-cluster of that. Threshold:
   *"≥ N entries (suggested 5) sharing a prefix segment, AND that prefix
   doesn't appear outside this folder, count as a cluster candidate."*
   Output: `build/data/cluster_candidates.json`. Surfaces in the site
   as **uncurated cluster pages** with a candidate banner.
3. **Auto-derived signatures.** For every cluster (curated or
   candidate), the build computes:
   - Fields ≥ 95% of members have ("shared shape").
   - Fields < 5% of *non-members in the same folder* have
     ("distinguishing shape").
   - Outgoing-ref folder distribution.
   - Incoming-ref folder distribution.
   - Outliers — members missing the shared shape (often candidates for
     cluster splitting or relocation; surfaced for contributors).
   - Cross-folder name correlations — clusters in *other* folders whose
     prefix base-word overlaps (`condowners/Body*` ↔
     `conditions/CondBody*` ↔ `interactions/ACTBody*`). Auto-fills the
     comparison table when no curated entry exists.

The point of the layering: a curated entry overrides the auto layer's
output entirely; an uncurated cluster still gets a usable page; the
contributor pipeline is *"see auto-detected cluster, write a 5-line
JSON file, ship."* The schema-driven philosophy from CLAUDE.md applies
— never invent detail the data doesn't justify.

#### Behavior

- Curated clusters render without any provenance marker.
- Auto-detected clusters render with a small *"candidate cluster —
  description auto-generated"* banner and a *"contribute curation"*
  link to the relevant `comment_mod/data/clusters/` path.
- Cluster page is linkable from object pages via a header line
  *"Part of cluster: [Body parts]"*. Click navigates to the cluster
  page; ⌘-click reveals all sibling members.
- Search auto-completes cluster names as a separate result class
  (alongside strName and glossary results).

#### Display constraints (additions to Section 2)

- **Cluster page is its own page kind.** Visual layout should be
  recognizable as "between folder index and object detail" — not a
  modal, not a section of another page.
- **Comparison table is the centerpiece.** It's the answer to the
  user's actual question. Bias the layout toward making it scannable,
  even at the cost of pushing the member list lower on the page.
- **Curated vs. candidate distinction is honest, not punitive.**
  Candidates aren't "broken" — they're "untriaged." Banner tone is
  inviting (*"contribute a description"*), not warning.
- **Per-folder vs. cross-folder family.** A `Body*`-cluster page in
  `condowners/` is different from a *Body parts family* page that
  spans `condowners/`, `conditions/`, and `interactions/`. Per-folder
  clusters are the v1-of-stretch target; cross-folder family pages
  are stretch-of-stretch. The comparison-table column on a per-folder
  cluster page is the bridge — clicking through a row takes you to
  the related cluster page in another folder.

#### Limits and unknowns

- **Naming-prefix detection has false positives.** `Body` and `BodyDmg`
  collide; `Stat` and `Stats` collide; `CT` is short enough to overlap
  with `CTab`, `CTHeading`, etc. Hierarchical detection helps but
  doesn't eliminate noise. Curation overrides are the safety valve.
- **Curation overhead.** A useful cluster page benefits from 30-100
  words of human-written copy. The data tree probably has ~50-100
  meaningful clusters. That's a real chunk of work — but it's
  exactly the chunk the Comment Mod is designed to absorb. The
  candidate-banner layer keeps the site useful while curation catches
  up.
- **Cross-folder family pages are open design.** Whether to model them
  at all in v1 is an open question. The per-folder cluster page with a
  comparison table linking out is probably enough to validate the
  concept; family pages can land later if user-story testing shows
  cluster pages aren't enough on their own.
- **"Why these are condowners and not their own folder"** is sometimes
  *just an engine quirk* with no satisfying gameplay answer. Curation
  copy needs an "honest fallback" tone in those cases — *"Engine
  reasons: condowners are the only objects that can carry the
  `aStartingConds` field, so Body* are condowners by necessity"* —
  rather than inventing a narrative.

---

### 3.2 (stretch) Template-hub pages

**Premise.** Some objects in the data tree aren't normal objects at all —
they're *type definitions* that many other objects instantiate via a
sibling-folder field. The user surfaces this with `items\ItmBodyPart01`:
a single item entry that 20 different `condowners/Wound*` entries
reference via `strItemDef: "ItmBodyPart01"`. Each `Wound*` is one body
region (Left Arm, Lower Left Arm, Head, Chest Upper, Robot Torso, …)
with its own `aStartingCondRules`, `mapSlotEffects`, and friendly name;
they all share `ItmBodyPart01` as their visual + item-template anchor.

From the player's perspective, `ItmBodyPart01` *is* "all the body parts
and a wound for each" — but the data tree expresses that as one item +
twenty condowners, not as a cluster within one folder.

**This is not a 3.1 cluster.** Section 3.1 detects *prefix clusters
within one folder*. The template-hub pattern is orthogonal:

| Method | Catches `ItmBodyPart01` instance fanout? | Why / why not |
|---|---|---|
| 3.1 curated cluster | no | Could be hand-written, but the "cluster" lives across folders along an edge. Wrong shape. |
| 3.1 auto prefix cluster | no | One entry. No prefix in `items/` to cluster on. |
| 3.1 auto field signature | no | Operates within an already-detected cluster. Doesn't traverse the `strItemDef →` edge. |

The signal isn't in the strName or the fields of `ItmBodyPart01` itself
— it's in the **incoming-edge shape**: many references from one folder
through the same field, where the referencing entries are themselves a
coherent set.

#### Where it appears

A page kind layered onto regular object detail pages — most objects
don't have it. Triggered when an object's incoming-edge shape matches
the template-hub heuristic (see detection below). Renders as an extra
panel on the object's detail page, not a separate URL.

Header line on the detail page itself: *"Template hub — used by
`condowners/Wound*` (20 instances)"*. Click expands the panel.

Linked from each instance's detail page in the inverse direction — on
`condowners/WoundArmLowerL`, header line *"Instance of template:
[`items/ItmBodyPart01`]"*.

#### Content

- **Title.** *"Template hub: `items/ItmBodyPart01`"* with the trigger
  field — *"used as `strItemDef` by 20 entries in `condowners/`"*.
- **One-paragraph explainer**, generated from the parsed edge shape
  with curation overlay where present:
  > *"This item is a visual + structural template that other objects
  > reference rather than duplicating its fields. Twenty entries in
  > `condowners/condowners_wounds.json` use it as their `strItemDef` —
  > each represents one body region with its own wound state. Editing
  > this item changes how all 20 wounds are drawn and socketed."*
- **Instance grid.** A table of the referencing entries with
  per-instance distinguishing fields (auto-detected as the fields that
  *vary* across instances while the rest stay constant). For
  `ItmBodyPart01`'s wounds, the grid would show:

  | strName | strNameFriendly | aStartingConds | aStartingCondRules | mapSlotEffects |
  |---|---|---|---|---|
  | WoundArmLowerL | Lower Left Arm | `IsSystem`, `IsWound`, `StatWoundFractureMin` | 5 rules | 1 effect |
  | WoundHead | Head | `IsSystem`, `IsWound`, … | … | … |
  | (etc.) | | | | |

  Sortable by any column. Click a row → that instance's detail page.
  This is the *"list of sub-items and a wound for each"* the user
  described — surfaced directly, not assembled by hand.
- **Constant fields.** The fields that *every* instance shares, with
  values shown once. Communicates *"this is the template part — it's
  the same on all 20"* explicitly.
- **Edit-affects-all callout.** Same shape as the 1.10 *"Edit this"*
  callout, but with scope: *"Editing `nCols` on `ItmBodyPart01` will
  change the rendered size of all 20 wound condowners that use it."*
  This is load-bearing for modders — without it, a modder could edit
  the template thinking it affects one wound and silently change all
  twenty.
- **Wiki link** if curated.

On the inverse direction (instance detail page), a small reciprocal
panel: *"This is one of 20 wound condowners that share `ItmBodyPart01`
as their `strItemDef`. The visual + socket layout comes from the
template; the wound-specific behavior comes from this entry's
`aStartingCondRules`."* Plus a sibling-instance picker so the modder
can hop between Wound* entries without going back through the template.

#### Detection (the "idk how it works" piece, again)

A **fan-out + field-uniformity** heuristic, run at build time over the
extracted edge graph:

1. **Compute fan-in per (target-id, source-folder, source-field) triple.**
   For each object, count how many distinct objects in folder *F*
   reference it via field *X*.
2. **Threshold** — flag triples where:
   - fan-in ≥ N (suggested 5; tune per folder), AND
   - fan-in is ≥ K× the median fan-in for *F*-via-*X* across all
     targets (suggested 10×; rules out "popular reference, not a
     template"), AND
   - the source field name suggests a "definition" relationship
     (configurable allowlist seeded from `strItemDef`,
     `strInteractionTemplate`, `strActionCO`, `strProgressStat`,
     `strType` exclusions, etc. — these are the schema-confirmed
     "this is a pointer to my type" fields).
3. **Confirm coherence** — for the candidate hub's referencing set,
   compute:
   - Distinguishing fields — fields whose value varies across
     references.
   - Constant fields — fields whose value is identical across references.
   - If the constant set is non-trivial (≥ 3 fields, suggested) AND the
     distinguishing set is non-trivial (≥ 2 fields), it's a real
     template-hub. Otherwise it's just a popular-target and gets
     filtered out.
4. **Output** — `build/data/template_hubs.json`. Each entry: target id,
   source folder + field, instance ids, distinguishing field list,
   constant field list. The site reads this and decorates both the hub
   page and each instance page.

This piggybacks on infrastructure that already exists: the edge graph
from `ReferenceExtractor`, the field signatures from the auto-detector
(`RefCandidateDetector`), and the instance/template field-shape comparison
is the same pass that 3.1 already has to do.

For curation overrides: same shape as 3.1 — a maintainer can write
`comment_mod/data/template_hubs/<slug>.json` to:
- Force a description the heuristic would generate generically.
- Group multiple hubs into a "template family" (e.g. all `Itm*` items
  used as `strItemDef` for a body-mod set).
- Override the distinguishing/constant field split when the heuristic
  picks a less-pedagogical view.

#### Behavior

- Auto-detected hubs render with a *"detected from edge shape — verify
  with curation"* badge, same provenance pattern as 3.1.
- Per-page toggle on the hub: *"show only distinguishing fields"* /
  *"show all fields"*. Beginners see only varying columns by default.
- Instance grid is virtualized — works whether the hub has 20 instances
  (Wound*) or 200.

#### Display constraints (additions to Section 2)

- **Two distinct page-kinds in 3.x** — prefix clusters (3.1) and
  template hubs (3.2). They can coexist on the same object: an entry
  could be a member of a 3.1 cluster *and* a hub for a 3.2 fanout.
  Visual treatment must distinguish them — they answer different
  questions.
- **Instance grid is the centerpiece on a hub page**, the way the
  comparison table is the centerpiece on a 3.1 page. Same scannability
  bias — push the standard outgoing/incoming ref panels lower if the
  instance grid is the load-bearing block.
- **Edit-affects-all callout has stronger visual weight than the 1.10
  callout.** Modder-safety affordance — the *blast radius* of a
  template edit is the load-bearing fact.

#### Limits and unknowns

- **Allowlist of "definition fields"** is the most fragile piece.
  Schemas should describe these (`x-template-field: true` on
  `strItemDef`, `strInteractionTemplate`, etc.) — and that schema
  enrichment is itself a contributor task before this feature is
  fully load-bearing. Without it, the heuristic over-fires on
  high-traffic targets like `Blank` or `[us]`.
- **Template families across multiple hubs** (`Itm*` → multiple
  `condowners/Wound*` and `condowners/CyberLimb*` and …) need a
  family-level page above individual hubs. Stretch-of-stretch; punt
  for v1-of-stretch.
- **The heuristic doesn't catch *implicit* templates** — cases where
  there's no shared field reference, but a set of objects clearly
  derive structure from one another by convention. Those are
  curation-only.
- **A hub's instances may themselves be a 3.1 prefix cluster** — e.g.
  `condowners/Wound*` is both "the cluster of wounds" and "the
  instance set of `ItmBodyPart01`." The two views are complementary;
  the cluster page links to the hub and vice-versa.

---

## Cross-references

- User story it serves: [`anti-g-loc-newcomer.md`](../user-stories/anti-g-loc-newcomer.md).
- Sibling story (already-shipped baseline + skilled-path notes):
  [`anti-g-loc-leggings.md`](../user-stories/anti-g-loc-leggings.md).
- Engine conventions and reference rules backing the components:
  [`CLAUDE.md`](../../CLAUDE.md) — *Reference-extraction notes*.
- Project shape and what's already shipped vs. planned:
  [`PROJECT-PITCH.md`](../../PROJECT-PITCH.md) — *Site UX (v1)*.
