# PLAN-DESIGN

Active work tracker for the **visual design** axis: wireframes, high-fi,
and the integration of design output back into the static site
(`src/Ostranauts.Site/style.css`, `app.js`, `explorer.html`). Sibling to
[PLAN-EXPLORER.md](PLAN-EXPLORER.md) and [PLAN-AST.md](PLAN-AST.md).
[PLAN.md](PLAN.md) routes between the three.

The principles the design must hold are in [DESIGN.md](DESIGN.md). The
component catalog is in
[notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md). This
file tracks **what work is being done now**, in what order, by whom, with
what acceptance bar.

**Items live here until shipped, then they're deleted** and the DEV-LOG
entry + git history become the record. This file is *not* a changelog.

---

## How to use this file

- **Add** an item when it becomes a real next step, not before.
- **Tag** each item with a state: **proposed** / **next** / **in-progress**
  / **blocked** / **deferred**.
- **Group** by phase. Phases progress sequentially: wireframes → high-fi →
  integration. Within a phase, dependency order.
- **Reference** [DESIGN.md](DESIGN.md) and the user-story files rather than
  restating principles. Plan tracks build order, not principles.
- **Delete** when done. Add a DEV-LOG entry the same commit.

---

## Inputs (where the source material lives)

- **Component catalog** — [notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md).
  12 core components (UX 1.1–1.12) plus 2 stretch (3.1 cluster pages, 3.2
  template-hub pages).
- **Acceptance scenarios** — [notes/user-stories/](notes/user-stories/). 11
  modder-journey files. Routing in [PLAN.md](PLAN.md).
- **Currently shipped UX** — [DEV-LOG.md](DEV-LOG.md) slices 1–8
  (2026-04-23 → 2026-05-06). Glossary cards, prefix banners,
  folder-mismatch note, inline schema descriptions, ref-row badges, filter
  pills, DSL primer popover, Edit-this callout, strType dispatch tooltip,
  Thresh-derived panel.
- **Live site to inspect** — `python -m http.server 8765 --directory build`
  (or `.claude/launch.json` server name `site`); landing at
  `http://localhost:8765/explorer.html` (NOT `/index.html`, which is the
  empty-data demo).
- **Designer brief** — [notes/design/claude-designer-brief.md](notes/design/claude-designer-brief.md).
  Self-contained prompt to paste into Claude Designer.
- **Screenshots** — [notes/screenshots/](notes/screenshots/). PNG captures
  of the current site, taken via `mcp__plugin_playwright_playwright__browser_take_screenshot`
  with repo-root-relative paths. Drop new captures here as the design pass
  progresses.

---

## Phase 1 — Wireframes · *next*

**Goal.** Structural layouts for every page-kind and component-state the
explorer needs, no visual polish. The output answers *"what goes where on
each page, and how do components compose"* — not *"what does it look
like."*

**Deliverable.** A set of annotated wireframes (low-fi HTML or
descriptive layout artifacts — designer's choice of medium so long as the
result is consumable as a static reference) covering:

1. **Object detail page — generic layout.** The dominant page. Hierarchy
   per [DESIGN.md](DESIGN.md) §8.
2. **Object detail page — `Stat*` condition variant.** Adds the
   right-rail Thresh-derived panel (UX 1.4). Shows both populated and
   empty-state (warn variant per DEV-LOG slice 8).
3. **Object detail page — `loot/` with folder-mismatch variant.** Shows
   prefix banner + folder-mismatch note (UX 1.9) + Edit-this callout
   (UX 1.10) stacked correctly.
4. **Object detail page — `traitscores:Trait Scores,1` variant.** Edit-this
   chargen-cost callout variant (DEV-LOG slice 7).
5. **Search dropdown** with mixed glossary cards + strName matches
   (UX 1.1).
6. **Folder index page** with stat counts.
7. **Component states inventory.** Each of the 7 UI element classes from
   [DESIGN.md](DESIGN.md) at: default, hover, focus, dismissed, empty,
   overflow, error.
8. **Filter pill panel** with multi-pill AND/OR semantics shown
   structurally.
9. **DSL primer popover** for cond-string and loot-string variants
   (UX 1.7).
10. **Mobile / narrow-viewport collapse** behavior — right-rail panels
    collapse below incoming refs.

**Acceptance.**

- Every numbered component (1.1–1.10, 1.12) from
  [notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md) has
  at least one wireframe state.
- Every shipped slice in [DEV-LOG.md](DEV-LOG.md) (slices 1–8) is
  represented — the wireframe is consistent with what already exists; if
  the wireframe diverges, that divergence is called out as a proposed
  change.
- The 7 UI element classes are visually separable in the wireframe even
  without the high-fi palette.
- The detail-page hierarchy from [DESIGN.md](DESIGN.md) §8 is preserved
  exactly.

**Out of phase 1:** mini-graph styling, Schemas tab, Data Health tab,
Coverage tab, LLM Candidates tab, AST-future surfaces (code:component
pages, runtime-wired banner, engine-emitted condition page).

---

## Phase 2 — High-fi · *blocked on phase 1*

**Goal.** Full visual design of the wireframes — palette, typography
scale, spacing system, component visual states.

**Deliverable.**

- A **design tokens spec** (CSS custom properties): color palette
  including the 12-color folder palette, semantic accent colors for the
  three banner/callout/note tones, typography scale, spacing scale,
  border-radius scale, motion timing.
- **High-fi renders** of every wireframe state from phase 1.
- **A high-fi `style.css` candidate** that implements the tokens and the
  component visual treatments. May be a separate file
  (`style.candidate.css`) initially so it can be A/B compared against
  the current site before the integration phase.
- **Folder palette mapping** — explicit `folder name → palette index`
  table for the ~30 folders in the data tree, derived by the hash
  function specified in [DESIGN.md](DESIGN.md) §"Visual vocabulary
  commitments" (or replaced with a curated mapping if the hash collisions
  are unacceptable).

**Acceptance.**

- Every accessibility-floor item from [DESIGN.md](DESIGN.md) is visibly
  satisfied in the renders (no color-only signaling, focus rings on all
  keyboard targets, etc.).
- The seven UI element classes pass a 5-second separability test —
  someone who has never seen the site can name what kind of UI element
  each class is.
- Folder and strType badges remain distinguishable when adjacent.
- Renders include both populated and empty states for the Thresh
  derived panel, the ref-row filter pills, and the search dropdown.
- Static-site constraints from [DESIGN.md](DESIGN.md) hold — no Tailwind,
  no shadcn, no JS frameworks, no build-step dependencies.

---

## Phase 3 — Integration back into `src/Ostranauts.Site/` · *blocked on phase 2*

**Goal.** Land the high-fi design in the actual static site without
regressing shipped functionality.

**Deliverable.**

- Updated `src/Ostranauts.Site/style.css` carrying the token system and
  component styles from phase 2.
- Updated `src/Ostranauts.Site/app.js` only where the rendering code needs
  to emit new class names or wrap new structural elements introduced by
  the design.
- Updated `src/Ostranauts.Site/explorer.html` only where the document
  structure needs changes (e.g. new mount points, settings drawer for
  re-show-all-explainers).
- A DEV-LOG entry per integration commit, naming what slice of design
  landed and what was deferred.

**Acceptance per integration commit.**

- All shipped slices from [DEV-LOG.md](DEV-LOG.md) still work — glossary
  search, prefix banners, folder-mismatch note, inline descriptions,
  filter pills, DSL primer, Edit-this callout, strType tooltip, Thresh
  panel.
- Mini-graph drag-positioning still persists across reloads (load-bearing
  shipped invariant per [DESIGN.md](DESIGN.md)).
- localStorage keys unchanged so existing dismissals carry over.
- Visual verification via
  `mcp__plugin_playwright_playwright__browser_take_screenshot` writing to
  [notes/screenshots/](notes/screenshots/) — before/after pairs for each
  shipped slice.
- No console errors on `explorer.html` after a hard reload (the stale
  clipboard NotAllowed lines from earlier preview-eval probes don't count
  per DEV-LOG slice 8).

---

## Out of scope for this plan

- Cluster pages (UX 3.1 stretch) and template-hub pages (UX 3.2 stretch).
  Both are real design work but neither is on PLAN-EXPLORER today; design
  follows implementation. When PLAN-EXPLORER promotes either to *next*,
  add a phase-1 entry here.
- Code-side surfaces from PLAN-AST Phase 2/3 (`code:component` detail
  pages, runtime-wired banner, engine-emitted condition page). Design
  follows when AST work begins.
- Mini-graph internal styling. Cytoscape.js theming is a separate domain.
- The empty-state demo at `/index.html`. Untouched in this plan.
