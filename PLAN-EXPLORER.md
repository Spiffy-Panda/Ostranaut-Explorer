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

---

## Site / UX

The full design lives in
[notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md) (12
core components plus 2 stretch). PLAN tracks build order, not design.

### Other UX components (1.4 / 1.8 / 1.11-1.12) · *proposed*

See [notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md)
sections 1.4 (derived `Thresh<X>` sidebar), 1.8 (`strType` dispatch
tooltip), 1.11 (live-build diff), 1.12 (plain-language wiki links).

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
