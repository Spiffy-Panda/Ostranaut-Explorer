# dev-log.hifi.md — buffer for the hi-fi integration branch

Per-slice DEV-LOG entries for the hi-fi prototype integration.
**Buffer file** — flush into [DEV-LOG.md](DEV-LOG.md) at merge time
(probably as a single condensed entry, possibly as the per-slice originals;
decide at merge). Reverse-chronological, same format as DEV-LOG.

The merge-time flush should also delete this file. Until then this is the
slice-by-slice record so the main DEV-LOG isn't churning while many small
commits are in flight on `claude-hifi-proto-implement`.

---

## 2026-05-07 — slice 8 · search dropdown migrated to hifi tokens

`#search` input + `#search-results` dropdown + glossary cards now consume hifi tokens end-to-end.

- **`#search`** — `--paper` bg, `--bw` solid `--ink` border, `--ink` text, `--ink-3` placeholder. Focus ring is 2px amber outline + 2px offset (matching the slice-6 filter-pill focus pattern; same focus vocabulary across all interactive components).
- **`#search-results`** — `--paper-2` bg + `--bw` `--ink` border. Hover/active row: `--paper-3` (replaces previous accent-blue tint).
- **`.glossary-card`** — uses the **banner** semantic accent (`--accent-banner-bg`, `--accent-banner-edge`) for the bg + 3px left rule + label color. The "this is a concept, not an object" framing is exactly the pedagogical-context use the banner accent is reserved for. Card name/summary in `--ink`, meta and CTA labels in `--ink-3`.

Verified: input bg resolves to `#14171b`, glossary-card bg `#18222b`, edge `#4a7a96`. 3 glossary cards visible on search "condition".

## 2026-05-07 — slice 7 · strType badge: monochrome dashed (hifi spec)

`.strtype-badge` switched to the hifi monochrome+dashed treatment so it never competes visually with folder-badge color. Background `--paper-2`, color `--ink`, **dashed** `--bw` border in `--ink-2`, `--r-1` radius. Selector also broadened from `.refs-block` scope to global so badges anywhere on the page pick it up — same broadening as slice 2 did for `.folder-badge`.

Reasoning per HANDOFF "Component contracts": strTypes are a different axis from folders (engine dispatch, ~7 enum values total). Giving them color would compete with folder color and conflate two orthogonal categorisations; the dashed border is the kind cue.

## 2026-05-07 — slice 6 · filter pills (hifi pill states)

`.filter-pill` now consumes the hifi pill vocabulary (HANDOFF "Component contracts" `.pill`):

- **default** · `--paper` bg, `var(--bw)` solid `--ink` border, `var(--r-pill)` radius
- **hover** · `--paper-2` bg
- **active** · INVERTED — `--ink` bg, `--paper` text. The strongest "this filter is on" cue, replaces the previous accent-blue fill
- **focus-visible** · 2px amber outline + 2px offset (the only place this far that uses focus rings — they'll spread as more components migrate)
- **clear** · dashed border, `--ink-2` text on transparent. Hover settles to paper-2

`.filter-status` and `.pill-count` switched from `--muted` (legacy) to `--ink-3`.

The strType italic flag (`.filter-pill.strtype`) is a content variant, not a state — kept as-is.

Pills don't render on detail pages with single-folder ref sets (StatGrav etc.), so visual proof requires a multi-folder page; the rule is in place and verified to load without errors.

## 2026-05-07 — slice 5 · detail-head folder edge (per fNN palette)

The detail-head card now carries the folder identity as a 6px colored left edge — the loudest folder cue on the page per the hifi spec. `app.js` adds `folderClass(folder)` to the five folder-scoped detail-head call sites: object-detail (line 492), code-class/code-method (667/731), folder-detail (2104), and schema-folder (2185). Schema overview, health/coverage, llm-candidates etc. are not folder-scoped and stay class="detail-head" (transparent edge, identical inset).

CSS adds the per-fNN `border-left-color` (12 rules) plus a transparent base `border-left: 6px solid transparent` and `padding-left: 0.85rem` so non-fNN heads still line up flush with folder-scoped ones — no layout shift between page kinds.

Verified on `#/o/conditions/StatGrav`: `border-left-color` resolves to `oklch(0.58 0.08 30)` (coral, the dark-mode edge for f01 conditions), 6px solid, 0.85rem padding-left.

## 2026-05-07 — slice 4 · semantic accents (banner / mismatch / callout)

Maps the three shipped accent components to the hifi semantic-accent
vocabulary (HANDOFF "Semantic accents"):

- **`.prefix-explainer`** (UX 1.2) → **banner** · `--accent-banner-bg` (`#18222b`
  coolant blue) + `--accent-banner-edge` (`#4a7a96`) for both 3px left rule
  and the title color. Pedagogical context, "this is the kind of thing you're
  looking at." Solid border so it visually distinguishes from mismatch.
- **`.folder-mismatch-note`** (UX 1.9) → **mismatch** · `--accent-mismatch-bg`
  (`#1a1d21`) + **dashed** `--accent-mismatch-edge` (`#4a5560`) gunmetal,
  italic body text. Neutral observation, "fwiw, this is what's going on" —
  never alarming, never instructive.
- **`.edit-this-callout`** (UX 1.10) → **callout** · `--accent-callout-bg`
  (`#2a1f0a`) + amber `--accent-callout-edge` (`#d18a2c`). The copy-path
  button now renders as **amber-on-dark** (the single point of brightest
  visual emphasis in dark mode per HANDOFF; hover adds the subtle amber
  glow `box-shadow: 0 0 12px rgba(209,138,44,0.4)`).
- **`.callout-sub`** (the trailing "or use the JSON path" sub-row) tracks
  the callout into the amber palette + adds 0.85 opacity so it reads as
  secondary to the action above.

Verified in preview: `.prefix-explainer` resolves to `bg rgb(24,34,43)` and
`edge rgb(74,122,150)` — exact `#18222b` / `#4a7a96` matches.

## 2026-05-07 — slice 3 · folder list left-rail swatches (indicator-light strip)

Adds a 9px square swatch before each row in `#folder-list`, picking up the row's `fNN` class. `app.js` now adds the `folderClass(folder)` class to each `li` and emits a `<span class="swatch">` + `<span class="folder-name">` + `<span class="count">` triple inside.

**Indicator-light dark-mode override.** Per HANDOFF "Folder palette doctrine" rule 6, the folder index swatches in dark mode use the *light-mode* L≈0.84 fills, not the dim L≈0.32 dark-mode fills used everywhere else. The reasoning: vertical row strips against the dark ground read like indicator lights / status LEDs, exactly the metaphor for a left rail. CSS hardcodes the bright `oklch(0.84 0.085 …)` values per `#folder-list li.fNN .swatch` rather than going through `var(--pal-NN)` so the override is local and explicit.

Verified in preview: all 11 named folders (`conditions` f01 coral, `items` f02 peach, `interactions` f03 sand, … `condowners` f11 dusty pink) resolve to the correct OKLCH fill; everything past the top-11 falls through to `f12` parchment. Folder rows still reorder via `folderCounts`; click still routes to `#/f/<folder>`.

## 2026-05-07 — slice 2 · frequency-ranked folder palette + dark-theme activation

Replaces the hashed 12-color folder palette with the hifi prototype's **frequency-ranked v0.18.2 mapping**: 11 most-populated folders each take one of `f01`..`f11` (conditions=01, items=02, interactions=03, condtrigs=04, condrules=05, slots=06, loot=07, lifeevents=08, installables=09, rooms=10, condowners=11), everything else falls through to `f12` parchment. `app.js` now emits `class="folder-badge fNN"` instead of inline `--badge-color: <hash>`. CSS sets `--badge-color: var(--pal-NN-edge)` per fNN class, so the existing `.folder-badge` rule keeps working without any structural change. Selector also broadened from `.refs-block .folder-badge, .detail-head .folder-badge` to plain `.folder-badge` (was missing `.thresh-panel` badges; now applies anywhere).

**Why frequency-ranked, not hashed.** Hashing distributes visual diversity uniformly across folders regardless of how often a user sees them; ranking puts the most-distinguishable hues on the folders the user encounters most. (HANDOFF "Folder palette doctrine" rule 1.) Stability rule: don't reuse fNN classes across game versions — bump the palette version if v0.19.x reshuffles counts.

`explorer.html` now sets `data-theme="dark"` on `<html>` so the dark hifi tokens (cold blues, condensation white) resolve. The live site has always rendered dark; pinning the attribute keeps that until a user-facing toggle ships in slice 11.

Verified: `getComputedStyle` on `.folder-badge.f07` shows `border-left-color: oklch(0.6 0.08 235)` (sky blue, dark-mode edge) and the same for f05 sage. No console errors.

## 2026-05-07 — slice 1 · hifi token foundation in style.css (inert)

Ports the entire token system from `notes/design/hifi-prototype/explorer.css` to the top of `src/Ostranauts.Site/style.css`: paper/ink, the 12-color frequency-ranked folder palette (`--pal-01`..`--pal-12` + `-edge` companions, OKLCH), three semantic accents (banner/mismatch/callout), font/type/spacing/radius/border/shadow scales, plus the `[data-theme="dark"]` override block (industrial cyberpunk: condensation-white ink, coolant blues, amber action color, plasma cyan + rust patina). Legacy tokens (`--bg`/`--fg`/`--accent`/etc.) preserved verbatim below the new block so existing components are untouched. New tokens are inert until components consume them in later slices. Verified via preview: legacy `--bg` resolves to `#1a1d23` (unchanged), new `--paper` resolves to `#f4f1ea`, no console errors. No DOM/HTML changes; no app.js changes.
