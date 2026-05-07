# DESIGN

Design principles for the Ostranaut Data Explorer site. The principles are
the invariants Claude Designer (and any future contributor doing visual
work) must hold while choosing layout, palette, typography, and motion. The
component catalog itself lives in
[notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md); this
file is the *posture* the components are built with, not their specs.

The active design plan is in [PLAN-DESIGN.md](PLAN-DESIGN.md). What's
already shipped is in [DEV-LOG.md](DEV-LOG.md) — read the most recent few
entries before any visual change so you know what convention is currently
in the codebase.

---

## Audience first

Modders editing Ostranauts JSON. Not players. A *newcomer* in this repo is
a first-time **modder** of Ostranauts (often an experienced modder of other
games), not a player asking why the AI chose to exercise. The design must
read as a JSON-tree explorer for someone writing a design doc, not as a
gameplay encyclopedia. Reframe rather than reject when copy drifts toward
player framing.

The skill ceiling lives in the v2 LSP. The site's job is to bring people
**up** to the threshold where the LSP is even worth installing. When a
tradeoff appears between *"looks clean for power users"* and *"teaches a
beginner the term it just used,"* favor the beginner. Power users get
dismissibility, not absence.

---

## The eight principles

### 1. Beginner-first density

Default to verbosity. A page on first visit shows full inline schema
descriptions, all explainer banners, all callouts. This will feel cluttered
to power users. That is OK — power users dismiss. Don't pre-collapse for
imagined power users at the expense of a beginner who hasn't dismissed yet.

### 2. Dismissibility, not absence

Every beginner-targeted component has a dismiss control that persists in
localStorage. Per *prefix-class* for explainers (one dismiss covers all
`Stat*` pages), per *site* for the Edit-this callout, per *user* for inline
schema descriptions. A *"Re-show all beginner explainers"* control lives in
site settings / footer. Designers must not solve perceived clutter by
removing the component — they solve it by making the dismiss path obvious.

### 3. Don't gate on hover

Hover-only schema descriptions are a known failure mode for beginners; they
don't know to hover. Render inline by default; allow collapse. The same
rule applies to every tooltip: any hover-revealed content has an inline or
click-pin alternative. DSL primer popovers, the `strType` dispatch tooltip,
field-description hovers — all click-pinnable, all keyboard-focusable.

### 4. Plain language first, jargon second

Every label starts in plain English with the data-tree term in parentheses
or as the secondary line. *"Wearable condition grants
(`Loot · strType:condition`)"* — not *"`strType=condition`"*. Filter pills,
glossary cards, banner titles, callout headers all follow this rule. Raw
DSL strings are available *behind* a chip click, never in the primary row.

### 5. Stable visual vocabulary site-wide

The page can carry up to seven distinct UI element classes (header,
explainer banner, inline note, callout, folder badge, strType badge, filter
pill). Designer must keep these visually separable. Folder badges have a
stable color/symbol per folder — set once across the site. Users learn
`loot=X color`, `condowners=Y color`, and the visual carries meaning across
pages. ~30 folders × 12-color palette: hash by folder name to a fixed
palette index. **`strType` badges share a single visual treatment**
distinguishable from folder badges.

### 6. Color is never the sole carrier

Folder badges combine color with a text label or icon. Diff highlights
combine color with a marker label. Resolution-failure markers combine red
with a text reason and an alternative link. Screen-reader plain-text
consumption must yield the same information density as the visual. No
ASCII art that depends on visual layout for meaning.

### 7. Provenance is honest, not punitive

The site mixes hand-curated content (glossary cards, prefix banners,
cluster descriptions) with auto-derived content (Thresh-pattern panels,
field signatures, template-hub heuristics). The visual treatment makes the
distinction visible without ranking one as "broken" and the other as
"correct." Auto-detected items render with an inviting *"contribute a
description"* affordance, not a warning chevron. Curated content has no
provenance marker — it's the default, the implicit ground truth.

### 8. The detail page is the dominant surface

The object detail page is where ~90% of the modder's time will be spent.
The hierarchy from top to bottom is fixed (header → per-prefix banner →
folder-mismatch note → Edit-this callout → Fields block → outgoing refs →
incoming refs → derived sidebars → mini-graph → raw JSON). Designer
chooses spacing, weight, and visual emphasis within that order, but does
not reorder. The Edit-this callout being prominent is deliberate — for a
modder on a tuning task, this is the destination, not the journey.

---

## Visual vocabulary commitments

These are non-negotiable inputs to any visual work.

- **Seven UI element classes** must remain distinguishable: header,
  explainer banner (pedagogical, dismissible), inline note (page-local
  pedagogical), callout (actionable), folder badge (identity tag), strType
  badge (identity tag, distinct from folder), filter pill (interactive
  control, distinct from badges).
- **Folder palette: 12 colors mapped by hash from folder name.** Stable
  site-wide. ~30 folders → some palette collisions are acceptable; the
  text label disambiguates.
- **Direction markers** (`→` / `←` on ref rows) are color-neutral.
- **Diff highlight** (UX 1.11, deferred) reserves a single color for
  *"changed since last build"* — never reused elsewhere.
- **Banners vs. callouts vs. inline notes — three distinct accents.**
  Banners blue-tinted (pedagogical, *"about this kind of thing"*), Edit-this
  callouts yellow-tinted (actionable, *"here's what to do"*), folder-mismatch
  inline notes neutral-toned (page-local clarification).

---

## Accessibility floor

- Keyboard navigation for ref rows, filter pills, dismiss controls,
  expanders, DSL primer chips.
- Hover-revealed content also triggers on focus (rule 3 above, restated for
  the a11y floor).
- Color is never the sole carrier of meaning (rule 6 above).
- Diff highlight (UX 1.11) uses both color and a marker label.
- All copy is sized for screen-reader plain-text consumption.

---

## Static-site constraints (designer must honor)

- Site is a vanilla-JS SPA running off `graph.js` (a `<script src>`-loadable
  JS-wrapped JSON payload). It works from `file://` URLs without a local
  server. **No build framework.** No Tailwind, no shadcn/ui, no React.
  Plain HTML, CSS, and a small `app.js`.
- Persistent state — explainer dismissals, filter pill memory, mini-graph
  node positions — uses localStorage keyed by the object's `(folder,
  strName)` pair (or by prefix-class for explainer dismissals).
- No back-end. Search, glossary, badge population, filter pill generation,
  edge-metadata diff are all driven from the static payload.
- Deploy target is GitHub Pages. All asset paths are relative.
- Mini-graph drag-positioning persistence is a load-bearing shipped
  invariant. Don't break it.

---

## Out of scope for the design pass

- Visual design of the **mini-graph** itself. Cytoscape.js styling is its
  own domain; the design pass treats the graph as a black-box rectangle
  with a known size range. Drag-positioning behavior must not regress.
- The **Schemas tab**, **Data Health tab**, **Coverage tab**, **LLM
  Candidates tab**. Separate surfaces, separate plans. Phase 1 wireframes
  may sketch their landing states for context, but they are not the
  primary design work.
- LSP / editor-side UX. v2 scope, out of frame.
- Any save-file / runtime-introspection surface — not in v1 scope per
  [PROJECT-PITCH.md](PROJECT-PITCH.md).

---

## Cross-references

- Component catalog: [notes/ux/newcomer-onboarding.md](notes/ux/newcomer-onboarding.md)
- Acceptance scenarios: [notes/user-stories/](notes/user-stories/)
- Active design plan: [PLAN-DESIGN.md](PLAN-DESIGN.md)
- What's shipped: [DEV-LOG.md](DEV-LOG.md)
