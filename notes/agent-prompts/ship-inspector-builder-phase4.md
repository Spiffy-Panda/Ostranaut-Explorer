# Agent handoff — ship-inspector tool, Phase 4 (nav surface)

You are picking up Phase 4 of the **ship-inspector** axis (the fourth
plan axis after EXPLORER / AST / DESIGN). Phases 1, 2, and 3 shipped
2026-05-10; the inspector page is live at
`src/Ostranauts.Site/ship-inspector.html` and renders correctly via
the local preview server.

**Phase 4 is the smallest of the four — one nav-link edit in
`explorer.html` plus a DEV-LOG entry plus a commit.** It does not add a
backlink from the inspector to the explorer (deferred to v2 — the
explorer's surfaces aren't ready for cross-linking yet).

This document bootstraps you from zero context — assume nothing about
prior conversations.

## Goal

Add a "Ship Inspector" link on the **right side** of `<nav id="tabs">`
in [src/Ostranauts.Site/explorer.html](../../src/Ostranauts.Site/explorer.html),
visually separated from the existing Explorer / Schemas / Plots cluster
(e.g. `margin-left: auto` on the link itself, or a sibling
`<span class="nav-spacer"></span>`, or whatever idiom the existing nav
uses for separation — match the page's conventions).

That's it. No JS changes. No backlink on the inspector side.

## Required reading, in order

Each one is short.

1. **[CLAUDE.md](../../CLAUDE.md)** — repo conventions. Pay attention to:
   - The audience rule (modder editing JSON, not player).
   - The DEV-LOG-before-commit rule.
   - The four-factor fair-use check before pushing public content.

2. **[CLAUDE.local.md](../../CLAUDE.local.md)** *(gitignored, may not exist)* —
   local toolchain quirks. PowerShell has no `&&` — chain with
   `; if ($?) { ... }`. The Bash tool runs WSL, not Git Bash. The site
   is hosted at `http://localhost:8765/` via `.claude/launch.json`;
   cache-bust with a `?bust=…` query.

3. **[PLAN-BUILDER.md](../../PLAN-BUILDER.md)** — Phase 4 is the
   *next* section. Phases 1–3 are shipped context.

4. The most recent ~3 entries in **[DEV-LOG.md](../../DEV-LOG.md)** —
   Phase 3's entry has the layout gotcha + room-card-CSS-duplication
   note, both informational only for Phase 4.

5. **[src/Ostranauts.Site/explorer.html](../../src/Ostranauts.Site/explorer.html)** —
   open it, find the `<nav id="tabs">` block, and look at how the
   existing tabs are wired. Match that pattern for the new link.

6. **[src/Ostranauts.Site/style.css](../../src/Ostranauts.Site/style.css)** —
   skim for any `#tabs` / `nav` styles. If the existing nav uses
   flexbox, `margin-left: auto` on the inserted link is the cleanest
   right-side-separation idiom; if it uses CSS grid, use a spacer.

Don't dive deeper than these. If you find yourself reading `app.js`,
the inspector files, or any `.cs` file, you've gone off-mission.

## Your deliverable — Phase 4

A single small edit to `src/Ostranauts.Site/explorer.html`:

- Add `<a href="ship-inspector.html">Ship Inspector</a>` to
  `<nav id="tabs">` with right-side separation from the existing
  cluster.
- The link's text is "Ship Inspector" (capital S, capital I, single
  space).

That's it. No new CSS unless the existing nav truly has no idiom for
right-aligning one tab — in which case add a tiny rule like
`#tabs a.right-aligned { margin-left: auto; }` (or equivalent) and
apply the class.

### What you are NOT building in Phase 4

- A backlink from `ship-inspector.html` to the explorer.
- Any change to `ship-inspector.html`, `ship-inspector.js`, or
  `rooms.js`.
- Any change to the `data/` outputs.
- An icon for the link.
- A "(new)" badge or any temporal indicator.

### Sanity-check before declaring done

- `explorer.html` loads cleanly via the preview server at
  `http://localhost:8765/explorer.html?bust=…`.
- The new "Ship Inspector" link sits visibly to the right of the
  existing tab cluster, not crammed against it.
- Clicking it navigates to `ship-inspector.html` and the inspector
  page renders normally (the canvas, the dropdown, etc.).
- No regression: the existing Explorer / Schemas / Plots tabs still
  switch correctly.

Use the preview server (`http://localhost:8765/explorer.html`) +
`mcp__Claude_Preview__*` tools to verify. The preview serves `build/`,
so either `make site` between captures or copy the modified
`explorer.html` directly into `build/`. Cache-bust with `?bust=…`.

## Commit hygiene

Before committing:

1. Add a DEV-LOG entry above the most recent existing entry. Format
   `## YYYY-MM-DD — slug`. One short paragraph is enough — Phase 4 is
   a one-line nav edit. Mention: the link added, separation idiom
   used, that no backlink was added, and a one-line pre-push fair-use
   note (factor 1 transformative — modder navigation; factors 2/3/4
   trivial — no game prose, no data added).

2. Stage only:
   - `src/Ostranauts.Site/explorer.html` (modified)
   - `src/Ostranauts.Site/style.css` (only if you added a tiny rule
     for the right-side separation)
   - `DEV-LOG.md`

3. Commit message format like the rest of the repo: short title
   (under 70 chars), blank line, paragraph body, blank line, the
   standard `Co-Authored-By` trailer.

4. **Do not push.** Leave the commit local. The user pushes on their
   own cadence.

## When you finish

Update [PLAN-BUILDER.md](../../PLAN-BUILDER.md) to mark Phase 4
*shipped*. The PLAN-BUILDER's "How to use this file" section covers
what to do if scope grows — for now, the four phases are complete and
no Phase 5 is queued. The v1 acceptance criteria at the bottom of
PLAN-BUILDER ("a modder lands at <site>/ship-inspector.html, picks a
Testudo Pequod from the dropdown, …") should now be reachable from
the explorer's nav, completing the v1 surface.

## Constraints reminder

- Follow [CLAUDE.md](../../CLAUDE.md)'s audience rule: link text is
  for **modders editing Ostranauts JSON**, not players.
- Plain vanilla — no build framework — runs from `file://`.
- Match the explorer's visual vocabulary; don't introduce a new color
  or font.
- Per CLAUDE.md's intern-script rule: any throwaway investigation
  scripts go in `scrap_scripts/<lang>/<NN>_<slug>.<ext>`, never
  inline `python -c …`.

That's the brief. Open `explorer.html`, find the nav, add the link.
