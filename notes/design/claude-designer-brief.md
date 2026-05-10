# Brief for Claude Designer — Ostranaut Data Explorer

Self-contained prompt to paste into Claude Designer. Includes everything
the designer needs without access to this repo.

---

## What you're designing

A **static-site JSON explorer** for the game Ostranauts. Modders edit JSON
files (~70 folders, ~130k lines) to customize the game, but the data tree
has no formal foreign-key system — references are plain strings keyed by
`strName` and the engine resolves them at load. Today, finding "where is
this thing referenced" means grepping. The explorer is "find usages,"
schema-aware, served as a static site.

The site already exists in working form (search, detail pages, forward +
backward references, mini-graph, glossary, prefix banners, inline schema
descriptions, ref-row badges, filter pills, DSL primer popovers,
Edit-this callouts). What it does not yet have is **a coherent visual
design**. CSS today is functional and unstyled — the components work; they
don't yet *look* deliberate. Your job is to give the existing component
set a real visual design without changing what those components are or
how they compose.

The site is **vanilla HTML + CSS + a small `app.js`**. No React, no
Tailwind, no shadcn/ui, no build framework. Output must be plain CSS using
custom properties, and HTML structure that drops into the existing
`app.js` rendering paths. It runs from `file://` URLs and deploys to
GitHub Pages.

---

## Audience

**Modders editing Ostranauts JSON. Not players.** A *newcomer* to this
site is a first-time **modder** of Ostranauts (often an experienced modder
of other games), not someone playing Ostranauts who is confused about
crew behavior. Frame everything as JSON-tree exploration for someone
writing a design doc, not as a gameplay encyclopedia.

The site's job is to bring beginners up to the threshold where a future
v2 LSP (editor integration) is worth installing. Beginner-first by
default. Power users get *dismissibility*, not *absence*.

---

## Two-phase deliverable

### Phase 1 — Wireframes (low-fi)

Structural layouts for every page-kind and component-state. No visual
polish — answer *"what goes where on each page, and how do components
compose,"* not *"what does it look like."*

Produce annotated wireframes (annotated HTML, descriptive layout
artifacts, or static reference renders — your choice of medium so long as
the result is consumable as a static reference) covering the page set
listed under **Pages and states to design** below. Each component class
in the catalog gets at least one wireframe state.

### Phase 2 — High-fi

Full visual design of the wireframes:

1. **A design tokens spec** as CSS custom properties — color palette
   (including the 12-color folder palette and three semantic accents for
   the banner/callout/note distinction), typography scale, spacing scale,
   border-radius scale, motion timing.
2. **High-fi renders** of every wireframe state.
3. **A `style.css` candidate file** that implements the tokens and
   component visual treatments. Plain CSS, custom properties allowed,
   nothing that requires a build step.
4. **A folder-palette mapping table** — explicit `folder name → palette
   index` assignments for the ~30 folders listed below, either via the
   hash function specified or via a curated mapping if hash collisions
   are unacceptable.

The high-fi `style.css` candidate gets dropped into the source repo at
`src/Ostranauts.Site/style.css` and verified against the existing
component HTML structure.

---

## Pages and states to design

Numbered list — every entry must have a wireframe and a high-fi render.

1. **Object detail page — generic.** The dominant page; ~90% of modder
   time will be spent here. Hierarchy from top to bottom is fixed (see
   **Detail page hierarchy** below).
2. **Object detail page — `Stat*` condition variant.** Adds a right-rail
   *"Modifies thresholds of this"* panel that lists derived
   `Thresh<StatName>` references. Must show **both** populated state and
   empty-state warn variant (the empty state is load-bearing — it tells
   the modder "this stat has no Thresh handle, suppress its rate
   instead").
3. **Object detail page — `loot/` with folder-mismatch.** A `loot/` entry
   whose strName starts with `COND…`. Must show: prefix banner + a
   "Why is this in `loot/`?" inline note + an Edit-this callout, all
   stacked above the Fields block.
4. **Object detail page — `traitscores:Trait Scores,1`.** Edit-this
   callout in chargen-cost variant (different copy and structure than
   the loot variant).
5. **Search dropdown** with mixed glossary cards + strName matches.
   Glossary cards are visually distinct from strName matches — they
   carry a summary line, a wiki link, and a "Game-data term" CTA.
6. **Folder index page** with stat counts (e.g.
   `conditions: 2172 entries`).
7. **Component states inventory** — each of the seven UI element classes
   below at: default, hover, focus, dismissed, empty, overflow, error.
8. **Filter pill panel** with multi-pill semantics shown structurally —
   pills combine AND across dimensions (folder ∧ strType), OR within a
   dimension. Must include the *clear filters* affordance.
9. **DSL primer popover** for cond-string and loot-string variants.
   Pinned popover with a labeled live example pulled from the row the
   user clicked.
10. **Narrow-viewport collapse** — right-rail panels collapse below the
    incoming refs panel.

---

## Detail page hierarchy (do not reorder)

From top to bottom on every object detail page:

1. **Header** — strName (large, primary), folder badge, friendly name,
   source file path (monospace, click-to-copy).
2. **Per-prefix explainer banner** — when applicable, dismissible.
   Pedagogical, *"about this kind of thing."* Blue accent.
3. **Folder-mismatch inline note** — when the strName's prefix
   convention disagrees with its actual folder. Smaller than the banner
   but visually proximate to the file path.
4. **Edit-this callout** — when applicable. **Strongest visual emphasis
   on the page.** This is the action the modder came to do; it should be
   the thing the eye lands on after the header. Yellow accent.
5. **Fields block** — primary content. Each field row has name (mono),
   value (mono, type-aware), and an inline description (italic / muted)
   beneath. Click-pinnable strType dispatch tooltip on the `strType` row.
6. **Outgoing refs panel** — secondary block. Filter pills above when
   list > 5 rows.
7. **Incoming refs panel** — typically the longest block; the killer
   feature. Filter pills always.
8. **Derived sidebars** (e.g. Thresh panel on Stat pages) — right rail.
   Collapse below incoming refs on narrow viewports.
9. **Mini-graph** — under or aside. Drag-positioning persistence is a
   load-bearing shipped invariant; treat as a black-box rectangle in
   design. Do not regress.
10. **Raw JSON** — collapsed by default. Power-user fallback.

---

## Components to design (the catalog)

Each is described in one short paragraph here. Full specs live in the
linked component plan; the paragraph is enough to ground the visual.

- **1.1 Glossary card** — search-dropdown result. Bridges plain-English
  game vocab to data terms (`anti-G-LOC` → `conditions:StatGrav`). Title,
  one-line summary, wiki link, "Game-data term" link CTA, optional modder
  hint. Visually distinct from strName matches.
- **1.2 Per-prefix explainer banner** — top of detail page when strName
  matches a naming convention (`Stat*`, `Thresh*`, `COND*`, `Itm*`,
  `ACT*`, `DRUG*`). Title + 2-4 sentences + optional wiki link + dismiss
  control. Dismissed state persists per prefix-class, not per page. Blue
  accent.
- **1.3 Inline schema descriptions** — beneath each field name + value
  pair in the Fields block. Italic / muted. Provenance marker
  (*"from base schema"* / *"from Comment Mod"* / *"derived"*) only on
  hover or in power-user mode.
- **1.4 Thresh-derived right-rail panel** — on `Stat*` pages, lists
  `Thresh<StatName>`-pattern conditions modifying this stat. Empty-state
  variant has a warn accent and explains the rate-suppression pivot.
- **1.5 Folder + strType badges** — on every ref row. Folder badge: stable
  color per folder (12-color palette, hashed by folder name). strType
  badge: single visual treatment, distinct from folder.
- **1.6 Filter pills** — above any ref panel with > 5 rows. Plain-language
  labels (*"Only Loot · strType:condition"*, not raw filter syntax).
  Tooltip explains the subset and why a modder might want it. Active count
  shown (*"5 of 47"*). Multi-pill: AND across dimensions, OR within.
  *Clear filters* control always visible when any pill is active.
- **1.7 DSL primer popover** — pinned popover anchored to a metadata chip.
  Heading, labeled live example (pulled from the row), per-part
  definitions, tip line. Click outside or × to dismiss. Click-pin AND
  hover triggers; both keyboard- and mouse-accessible.
- **1.8 strType dispatch tooltip** — clickable `?` next to a `strType`
  field value. Pops a 7-row table mapping each strType value
  (`condition`/`item`/`interaction`/`trigger`/`condrule`/`lifeevent`/`ship`)
  to its target folder + one-line behavior summary. Current entry's
  strType row highlighted.
- **1.9 Folder-mismatch inline note** — beneath file path on the detail
  header when strName prefix and actual folder disagree. Neutral-toned,
  smaller than the banner. *"Why is this in `loot/`?"* style copy.
- **1.10 Edit-this callout** — yellow-tinted action block. Heading, action
  body (templated instruction), copy-path button, ordered steps. Variants:
  Thresh-grant, Rate-suppress, chargen-cost, default-state. Always
  visible (never auto-collapsed); power-users dismiss site-wide via
  settings.
- **1.12 Plain-language wiki links** — in banners (1.2), glossary cards
  (1.1), DSL primer (1.7). Standard external-link affordance. Off-site
  marker. Opens in new tab.

---

## Visual vocabulary — non-negotiable

- **Seven UI element classes** must remain distinguishable at a glance:
  header, explainer banner (pedagogical, dismissible), inline note
  (page-local pedagogical), callout (actionable), folder badge (identity
  tag), strType badge (identity tag, distinct from folder), filter pill
  (interactive control, distinct from badges).
- **Three accent tones** for the pedagogical/actionable distinction:
  - Banners — blue tint. *"About this kind of thing."*
  - Folder-mismatch notes — neutral tone. *"Here's why this looks weird."*
  - Edit-this callouts — yellow tint. *"Here's what to do."*
- **Folder palette: 12 colors mapped by hash from folder name.** Stable
  site-wide. The 30 folders to map are listed in **Folder list** below.
- **Direction markers** (`→` / `←` on ref rows) are color-neutral.
- **Diff highlight** (UX 1.11, deferred — design must reserve a slot for
  it) uses a single color reserved for *"changed since last build"* and
  not reused elsewhere.

---

## Folder list (for palette mapping)

The 30 folders the site indexes:

```
ads, archived_content, attackmodes, audioemitters, blueprints, careers,
chargeprofiles, colors, conditions, conditions_simple, condowners,
condrules, condtrigs, gasrespires, glossary, guipropmaps, installables,
interactions, items, lifeevents, lights, loot, personspecs, plots,
plot_beats, pledges, rooms, ships, slots, traitscores
```

Plus virtual folders for derived nodes: `code-component`, `code-method`
(future, when AST work lands).

---

## Design principles (must follow)

These are invariants. Visual choices must serve them.

1. **Beginner-first density.** Default to verbosity. Cluttered-feeling
   first-visit pages are correct; power users dismiss.
2. **Dismissibility, not absence.** Every beginner-targeted component has
   a persistent dismiss control. Don't solve perceived clutter by
   removing the component.
3. **Don't gate on hover.** Every hover-revealed thing has an inline or
   click-pin alternative. Beginners don't know to hover.
4. **Plain language first, jargon second.** Labels start in English with
   the data-tree term in parens. *"Wearable condition grants
   (`Loot · strType:condition`)"*, not *"`strType=condition`"*.
5. **Stable visual vocabulary site-wide.** Folder colors are stable per
   folder; users learn the palette. The seven UI element classes stay
   visually separable.
6. **Color is never the sole carrier.** Every color signal pairs with a
   text label, icon, or marker. Diff highlight uses color + label.
7. **Provenance is honest, not punitive.** Curated content has no
   provenance marker (it's the default); auto-detected content gets an
   inviting *"contribute a description"* affordance, not a warning.
8. **The detail page is the dominant surface.** ~90% of modder time.
   Hierarchy is fixed; designer chooses spacing/weight/emphasis within
   the order, does not reorder.

---

## Accessibility floor

- Keyboard navigation for ref rows, filter pills, dismiss controls,
  expanders, DSL primer chips.
- Hover-revealed content also triggers on focus.
- Color is never the sole carrier of meaning.
- Diff highlight uses both color and a marker label.
- All copy is sized for screen-reader plain-text consumption.
- WCAG AA contrast on every text-on-background pair.

---

## Static-site constraints

- **No build framework.** No Tailwind, no shadcn/ui, no React, no
  PostCSS pipeline, no Sass. Plain CSS using custom properties is the
  full toolkit.
- Site runs from `file://` URLs as well as via HTTP. All asset paths
  relative.
- Persistent state uses **localStorage** keyed by `(folder, strName)` for
  per-page state and by prefix-class for explainer dismissals.
- No back-end. Search, glossary, badge population, filter pill
  generation, edge-metadata diff are all driven from a static
  `graph.js` payload.
- Mini-graph drag-positioning persistence (Cytoscape.js) is a load-
  bearing shipped invariant. Treat the mini-graph as a black-box
  rectangle and do not regress its behavior.

---

## Out of scope for this design pass

- The mini-graph's internal styling (Cytoscape.js theming).
- The Schemas tab, Data Health tab, Coverage tab, LLM Candidates tab.
  May be sketched for context in phase 1 but are not the primary work.
- Cluster pages (stretch UX 3.1) and template-hub pages (stretch UX 3.2).
  Real design work but not on the active build plan.
- Code-side surfaces (`code:component` detail pages, runtime-wired
  banner, engine-emitted condition page). These are future work pending
  AST extraction; design follows implementation.
- LSP / editor-side UX. Not in this scope.
- Save-file / runtime-introspection surfaces. Not in v1 scope.

---

## What gets pulled back into the source repo

After phase 2 lands:

- The high-fi `style.css` candidate replaces the current
  `src/Ostranauts.Site/style.css`. Existing class names are preserved
  unless explicitly proposed otherwise.
- The design tokens spec lives at the top of `style.css` as a `:root {}`
  block of CSS custom properties.
- The folder-palette mapping is encoded as CSS variables (e.g.
  `--folder-loot`, `--folder-condowners`) read by the existing
  `renderFolderBadge` helper in `app.js`.
- Any new structural HTML elements (e.g. a settings drawer for
  *Re-show all beginner explainers*) are added to `explorer.html` and
  emitted by `app.js`.
- Screenshots of every covered state, before-and-after, drop into
  `notes/screenshots/`.
- A DEV-LOG entry per integration commit names what slice of design
  landed and what was deferred.

The integration phase is tracked in [PLAN-DESIGN.md](../../PLAN-DESIGN.md)
phase 3.

---

## Acceptance bar

The design pass is "good enough" when:

- Every component class in the catalog above has at least one wireframe
  state and one high-fi render.
- The seven UI element classes pass a 5-second separability test —
  someone who has never seen the site can name what kind of UI element
  each class is.
- Folder and strType badges are distinguishable when adjacent.
- The 11 user-story walks (catalog at the bottom of this brief) each
  reach their answer along the visual path the design implies — i.e. the
  visual hierarchy doesn't fight any of the journeys.
- All eight design principles above are visibly satisfied in the renders.
- The high-fi `style.css` candidate is plain CSS, no build step.

---

## User-story walks (acceptance scenarios)

The 11 modder journeys the site must serve. Each is one sentence here;
full files live at `notes/user-stories/<slug>.md` in the source repo.

1. **anti-g-loc-leggings** — skilled modder bumps a value in `loot.json`.
   Walk: search `StatGrav` → Thresh panel → `ThreshStatGrav` → filter pill
   → `loot:CONDWearingCompressionPantsPer` → Edit-this callout.
2. **anti-g-loc-newcomer** — beginner reaches the same line via glossary
   card + prefix banner + folder-mismatch note. Same destination, longer
   visual path with more pedagogy.
3. **crew-exercise-invisible-need** — modder finds the work/exercise/atrophy
   loop. Hidden-stat insight (`nDisplaySelf: 0`) + tick-effect filter
   pill + multi-page rate math.
4. **mod-free-traits** — modder zeros out chargen age costs. Reaches
   `traitscores:Trait Scores,1` with the chargen-cost Edit-this variant.
5. **mod-hygiene-station** — modder builds a new installable item across 8+
   files using `condowners:ItmSink01` as a template. **Stretch UX 3.2
   template-hub panel** is the centerpiece.
6. **mod-starter-ship** — modder swaps starter ships from a known ship
   name. Pure search + ref-traversal walk.
7. **mod-suppress-needs** — modder builds a needs-suppression trait;
   discovers `StatFood` has no Thresh handle (empty-state variant of
   UX 1.4 is load-bearing).
8. **explore-needs-loop** — *designer* (not modder) using the explorer as
   a diagnostic. **Currently dangling** — needs a "why is this stat
   behaving this way?" banner that doesn't exist yet.
9. **debug-broken-aupdatecommands-line** — modder fixes a crashing
   `aUpdateCommands` line with structured positional rendering + did-you-
   mean. **AST Phase 2 future work.**
10. **rewire-co2-alarm-to-remote-pump** — modder learns why the
    alarm→pump pairing can't be done from data. Dashed-edge runtime-wired
    banner is the unblock. **AST Phase 3 future work.**
11. **trace-engine-emitted-condition** — modder traces `DcGasPpO2` to its
    C# producer with gate-expression snippets. **AST Phase 2 future work.**

The first 7 are EXPLORER-tier and ship-able with this design pass. The
last 4 are pending AST work; the design must leave room for code-side
detail-page kinds without requiring them in phase 1/2.

---

## Reference materials in the source repo (you have read access)

Public repo: <https://github.com/Spiffy-Panda/Ostranaut-Explorer>. Game-data
content (`data/`, `decomp/`, `wiki_cache/`, `test-data/`) is gitignored
and not redistributable; everything else is tracked. The files below are
all in the public repo — fetch them directly if you want detail beyond
what this brief embeds.

- `notes/ux/newcomer-onboarding.md` — full component spec (more detail
  than the catalog above).
- `notes/user-stories/` — 11 acceptance scenario files (full prose for
  each of the journeys summarized at the end of this brief).
- `DESIGN.md` — principles (this brief is a self-contained subset; the
  source is canonical if they ever drift).
- `PLAN-DESIGN.md` — the active design plan and integration target.
- `DEV-LOG.md` — what shipped and when. Read the most recent few entries
  before proposing a visual change so you know the convention currently
  in the codebase.
- `src/Ostranauts.Site/style.css` — current CSS. Plain, functional,
  unstyled — what your high-fi candidate replaces.
- `src/Ostranauts.Site/app.js` — current rendering code. Class names and
  emitted DOM structure that your CSS targets live here.
- `src/Ostranauts.Site/explorer.html` — entry document. Mount points and
  initial layout shell.
- `notes/screenshots/` — screenshots of the current site for context.
