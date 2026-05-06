# PLAN-EXPLORER

Active work tracker for the **modder-facing JSON browser** axis: schema
overlay coverage, site UX (newcomer onboarding, glossary, prefix banners,
inline schema), wiki / LLM-assisted content extraction. Not the code-side
graph extension — that work lives in [PLAN-AST.md](PLAN-AST.md).
[PLAN.md](PLAN.md) is the top-level brief that routes between the two.

**Items live here until they're done; then they're deleted from this file**
and the DEV-LOG entry + git history become the record. This file is *not* a
changelog — for "what shipped when," read [DEV-LOG.md](DEV-LOG.md).

> **One file, two audiences.** Humans skim section headers to know what's
> next. LLMs reading the repo cold use this as the index of "what is worth
> picking up." Keep entries terse — one paragraph max, link out for detail.

---

## How to use this file

- **Add** an item when it becomes a real next step, not before.
- **Tag** each item with a state: **proposed** / **next** / **in-progress** /
  **blocked** / **deferred**. *Proposed* means "we've decided it's a good
  idea but haven't committed to a slice." *Next* means "this is the actual
  next piece of work."
- **Group** by area, not by chronology — the order within a section reflects
  rough dependency, not commit order.
- **Reference** the design doc rather than restating it. "Build component
  1.6 from notes/ux/newcomer-onboarding.md" beats re-explaining the
  component here.
- **Delete** when done. Add a DEV-LOG entry the same commit. The plan
  shrinks; the changelog grows.

---

## Parser / library

### Slice E phase 6 — promote auto-detected candidates → `comment_mod/data/schemas/` overlays · *deferred*

The detector found 184 uncovered candidates across the data tree
(`build/data/ref_candidates.js`). Many are obvious schema gaps — installables,
the `aThresholds[*].strLootNew` family for non-`DcFood` condrules, etc. Phase
6 commits them into `comment_mod/data/schemas/` so they become real edges.

Deferred because the diff is large and bundling commits to one slice was
the right choice; no current consumer is blocked. Pick this up next time
schema coverage feels like the bottleneck. See DEV-LOG 2026-05-03 entry on
phases 1-5 for context.

### Stat bars → `Stat*` strName cross-validation audit · *next*

Wiki's User_Interface page names eleven visible stat bars (Gas Pressure,
Body Temperature, Pain, Satiety, Hydration, Encumbrance, Bowels, Fatigue,
Sleep, Hygiene). Confirmed mapping so far: Encumbrance → `StatGrav`. The
rest are TBD. The audit:

1. List every `Stat*` strName in `data/conditions/`.
2. Match each to a UI bar label (where one exists) or flag as
   internal-only.
3. Surface unmapped stats and unmatched bars on `/health/coverage`.

Output is a curated map that feeds (a) glossary cards, (b) per-page
sprinkles ("UI bar: Encumbrance"), and (c) confidence that we've covered
every player-visible stat. Tracked in
[notes/wiki-onboarding.md](notes/wiki-onboarding.md) under *User Interface
→ Cross-validation*.

### `nDisplaySelf` schema description in Comment Mod · *next, small*

Add a description for the `nDisplaySelf` field on `conditions/` schema in
`comment_mod/data/schemas/conditions-schema.json` that names the 0/1/2/3
semantics — *"0 = invisible in the needs panel even when active; 2 =
always visible; 3 = pinned"*. Gates the lucky path of the
[crew-exercise user story](notes/user-stories/crew-exercise-invisible-need.md).

---

## Site / UX

The full design lives in
[notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md) (12
core components plus 2 stretch). PLAN tracks build order, not design.

### Glossary card + concept search (UX 1.1) · *next, blocking*

Gates both newcomer user stories
([anti-g-loc-newcomer](notes/user-stories/anti-g-loc-newcomer.md),
[crew-exercise](notes/user-stories/crew-exercise-invisible-need.md)).
Hand-seeded alias map (`comment_mod/data/glossary/*.json`), search-bar
fallback when strName matches return zero, glossary-card UI in the result
list. Initial seed: ~30 entries pulled from wiki page titles + section
headings (anti-G-LOC, atrophy, encumbrance, fatigue, etc.).

### Per-prefix contextual explainer banners (UX 1.2) · *proposed*

Banners keyed on naming convention (`Stat*`, `Thresh*`, `COND*`, `Itm*`,
`ACT*`, `DRUG*`). Short banner library
(`src/Ostranauts.Site/explainers/*.json`), dismissible per-class via
localStorage. The single most-leveraged newcomer-onboarding component
after the glossary card.

### Inline schema field descriptions (UX 1.3) · *proposed*

Hover-only descriptions today. Render inline by default on the Fields
block, collapsible. Newcomers don't know to hover.

### Folder + `strType` ref-row badges (UX 1.5) · *partial*

Folder is implicit in the link target today. `strType` is not surfaced.
Promote both to badges with stable site-wide colors.

### Filter pills on incoming refs (UX 1.6) · *proposed*

Plain-language pill set above any ref list >5 rows. Auto-suggested per
page from the source folders + `strType`s present.

### Externalize internal-facing prose on code-side detail pages · *next*

PLAN-AST landed three sets of synthetic graph nodes (`code-method`,
`code-class`, `code-component`) with detail-page blurbs that read like a
DEV-LOG entry — phrases like *"Synthetic node from PLAN-AST Phase 1"*,
*"a Roslyn AST walk over `decomp/Assembly-CSharp/`"*, *"identifier-shaped
string literal"*, *"each entry in `CondOwner.AddCommand`'s dispatcher"*,
*"dict keys this component reads from its guipropmap at runtime (PLAN-AST
Phase 3)"*. Useful while building, opaque for the audience the explorer
is for.

The fix is a per-page-kind blurb rewrite, modder-pov-first. Each blurb
should answer in three sentences: *what am I looking at*, *why does it
matter when I'm modding*, *what should I click next*. Mention the C#
class name, not the Roslyn surface; mention "the game's wiring code,"
not "AST". Concrete inventory:

- `code-method` / `code-class` blurb (`app.js`'s `renderCodeNodeDetail`,
  ~line 456): rewrite to *"This page lists every reference this method/class
  makes to data you can edit. Each row's a hardcoded mention in the game's
  C# code; click through to see what depends on this name elsewhere. Useful
  when you've changed a strName and want to find what code expects it."*
- `code-component` blurb (`renderCodeComponentDetail`, ~line 519): rewrite
  to *"A `code-component` is one entry in the game's command table — what
  the data engine does when a condowner's `aUpdateCommands` line starts
  with `&lt;CommandName&gt;`. Below: which condowners wire to it, what
  positional args it accepts (with the data folder each one targets), and
  which conditions the component manipulates."*
- *Runtime ports* block muted-note (~line 532) — drop the parenthetical
  "PLAN-AST Phase 3"; explain instead *"Dict keys this component reads
  from its guipropmap at runtime — the inputs you can set in panel UI
  in-game."*
- *Code references* block muted-note (~line 992): the *"in decompiled
  C#"* phrasing is fine; drop the *"PLAN-AST Phase 1"* tag.
- Sidebar section heading (~line 165): *"Code (PLAN-AST)"* → *"Code"*,
  with a tooltip *"Synthetic graph nodes derived from the game's C# code
  — these surface refs the data files alone can't see."*

Same pass should remove `decomp/Assembly-CSharp/` literal paths from any
user-facing prose; the modder doesn't care what subdirectory the
decompiler dumped its output to. Keep the file:line strings on edges
(those are useful — they're a destination, not architecture).

Internal `// PLAN-AST Phase X` comments in JS / C# stay — those help
agents and contributors reading the code, and PLAN-AST is the only place
where the phase numbering is the right vocabulary. The cleanup is
strictly user-facing strings.

Ship together with the next UX item that touches `app.js`; the diff is
small enough to ride along.

### Other UX components (1.4 / 1.7-1.12) · *proposed*

See [notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md)
sections 1.4 (derived `Thresh<X>` sidebar), 1.7 (DSL primer popover), 1.8
(`strType` dispatch tooltip), 1.9 (*"Why is this in `X/`?"* note), 1.10
(*"Edit this"* callout), 1.11 (live-build diff), 1.12 (plain-language
wiki links).

### Stretch — cluster pages (UX 3.1) · *proposed*

Per-folder prefix-cluster pages with curation overlay + auto-detected
candidates. Three-tier detection. Cluster's *"compared with the
neighborhood"* table is the centerpiece.

### Stretch — template-hub pages (UX 3.2) · *proposed*

For one-object-as-type-definition cases like `items/ItmBodyPart01` (used
as `strItemDef` by 20 `condowners/Wound*` entries). Fan-in heuristic +
field-uniformity confirmation. Includes blast-radius callout (*"editing
this affects all 20 instances"*).

### Migrate `/help/debug` site route from wiki Debug page · *proposed*

The Debug commands table is uniformly modder-relevant (`addcond`,
`getcond`, `spawn`, `verify`, `unlockdebug`). Migrate as a static
`/help/debug` route. Notes in
[notes/wiki-onboarding.md](notes/wiki-onboarding.md) Debug section.

---

## Content / wiki extraction

### LLM-assist extraction pass on the 5 flagged Modding pages · *next*

Page priority + assigned model already chosen (was in PROJECT-PITCH;
moved here):

| Page                  | Cached size | Review-queue items | Model  |
|-----------------------|-------------|--------------------|--------|
| Conditions            | 3.7 KB      | 16                 | haiku  |
| Modding/Pledges       | 22.2 KB    | 9                  | opus   |
| Modding/CondOwners    | 41.1 KB    | 5                  | opus   |
| Modding/Interactions  | 10.9 KB    | 2                  | sonnet |
| Modding/Loot          | 8.7 KB     | 2                  | sonnet |

Each pass produces a `prose-extraction/<slug>-<model>.md` provenance file
([prose-extraction/README.md](prose-extraction/README.md)), then a
downstream LLM step proposes schema diffs into
`comment_mod/data/schemas/`. The review queue lives at
[comment_mod/wiki_review_queue.md](comment_mod/wiki_review_queue.md).

### Out-of-scope wiki page sweep harvest · *opportunistic*

A previous session crawled ~24 player-facing pages (Basic_Controls,
User_Interface, Debug, Main Mechanics) — out of scope per the
`Modding/*`-only crawl rule, but several yielded modder-relevant
material. Harvest tracked in
[notes/wiki-onboarding.md](notes/wiki-onboarding.md). Specific actionable
items already broken out into the Site / UX and Parser sections above.

---

## Stretch / v2 territory

Big v2 items live in [PROJECT-PITCH.md § Roadmap §
v2](PROJECT-PITCH.md#v2--mod-aware-tooling-ide-integration-save-tools).
Once one of those becomes the active next step, lift it into this file
proper as its own section. Until then, leave it in the pitch.

The named v2 items, ordered by the pitch's dependency chain:

1. Mod partial loader (overlay) — prerequisite for everything else in v2.
2. VS Code language server (LSP) — biggest v2 chunk; subsumes mod editor.
3. Comment Mod migration (extract `comment_mod/` schemas as a real
   loaded mod once the overlay loader exists).
4. Save inspector / editor (start with `aCrew01`).
5. Map explorer + save map explorer.

---

## How this stays honest

Every entry above should either move to *in-progress*, ship and get
deleted, or get explicitly *deferred* with a reason. Stale items that
sit at *proposed* for too long without context drift toward fiction.
Periodically (when re-reading the file feels like reading marketing
copy) prune ruthlessly: if no one knows what blocks an item, it's not a
plan, it's a wishlist.
