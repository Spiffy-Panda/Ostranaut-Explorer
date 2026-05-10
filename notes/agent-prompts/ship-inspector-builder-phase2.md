# Agent handoff — ship-inspector tool, Phase 2 (rooms.js extraction)

You are picking up Phase 2 of the **ship-inspector** axis (the fourth plan
axis after EXPLORER / AST / DESIGN). Phase 1 (data extraction) shipped
2026-05-10; the per-ship JSON, manifest, and friendly-name map now live
under `src/Ostranauts.Site/data/`. **Your job is Phase 2 only — the
rooms.js refactor.** Phase 3 (the inspector page) and Phase 4 (the nav
edit) are downstream and out of scope for your slice.

This document bootstraps you from zero context — assume nothing about
prior conversations.

## Goal

Lift the `window.ROOMS` data array and the per-room-card render code out
of [src/Ostranauts.Site/rooms-reference.html](../../src/Ostranauts.Site/rooms-reference.html)
into a new shared module [src/Ostranauts.Site/rooms.js](../../src/Ostranauts.Site/rooms.js)
so that both `rooms-reference.html` and the future `ship-inspector.html`
(Phase 3) can `<script src="rooms.js">` to render the same room-card UI.

The card render becomes a documented function
`window.renderRoomCard(roomSpec, options)` returning a DOM `<details>`
node — used identically by both pages. The priority-table row render
**stays inside `rooms-reference.html`** because the inspector won't use
it.

## Required reading, in order

Read in this order before writing any code. Each one is short except where noted.

1. **[CLAUDE.md](../../CLAUDE.md)** — repo conventions. Pay attention to:
   - The audience rule: *"modder editing JSON,"* not player.
   - The CodeDocs sync rule (no `.cs` changes here, so this is informational).
   - The four-factor fair-use check before pushing public content.
   - The DEV-LOG-before-commit rule.

2. **[CLAUDE.local.md](../../CLAUDE.local.md)** *(gitignored, may not exist)* — local toolchain quirks if present. PowerShell has no `&&` — chain with `; if ($?) { ... }`. The Bash tool runs WSL, not Git Bash. The site is hosted at `http://localhost:8765/` via `.claude/launch.json` for preview verification; cache-bust with a `?bust=…` query.

3. **[PLAN.md](../../PLAN.md)** — top-level routing across the four plan axes.

4. **[PLAN-BUILDER.md](../../PLAN-BUILDER.md)** — your plan. Read end-to-end. Phase 2 is the section you implement; Phases 3+4 are downstream context only.

5. **[notes/agent-prompts/ship-inspector-builder.md](ship-inspector-builder.md)** — the Phase 1 prompt. Skim only — it's history. The reconciliation notes in PLAN-BUILDER's Phase 1 section explain how the data layout differs from what was originally specced.

6. The most recent ~5 entries in **[DEV-LOG.md](../../DEV-LOG.md)** — current state of the site and the Phase 1 ship.

7. **[src/Ostranauts.Site/rooms-reference.html](../../src/Ostranauts.Site/rooms-reference.html)** — read end-to-end. The `<style>` block, the `window.ROOMS` array (~line 641), and the `(function render() { … })()` IIFE (~line 790) are what you'll reorganize. The priority-table render lives inside the IIFE; isolate it from the card render before lifting.

8. **[src/Ostranauts.Site/style.css](../../src/Ostranauts.Site/style.css)** — quickly skim for any `.room-card`, `.req-line`, `.count-pill`, `.meta-pill`, `.note`, `.summary-name`, `.summary-friendly`, `.summary-meta` rules. The plan calls for CSS tokens to stay in `style.css` — confirm the page-local `<style>` block in `rooms-reference.html` is or isn't already a duplicate of style.css's room rules. (If it is, you may consolidate as a small follow-up — but don't bundle that with Phase 2 unless trivial.)

Don't dive deeper than these. If you find yourself reading `app.js` or any `.cs` file, you've gone off-mission for Phase 2.

## Your deliverable — Phase 2

A new shared JS module + a refactored `rooms-reference.html`.

### `src/Ostranauts.Site/rooms.js`

A plain vanilla JS file (no module syntax — must work from `file://`).
Top of file gets a comment block stating purpose, the `window.ROOMS`
schema, and the `renderRoomCard` contract.

Exports two globals:

1. **`window.ROOMS`** — the data array, lifted verbatim from
   `rooms-reference.html`. Array of room-spec objects with shape:

   ```
   {
     name: string,           // C# class-suffixed name, e.g. "Reactor"
     friendly: string,       // human label, e.g. "Reactor room"
     priority: number,       // 0..100; tie-break order in CreateRoomSpecs
     minTiles: number|null,  // null for Blank
     value: number,          // room-value modifier, e.g. 1.6
     void: boolean,          // bAllowVoid — true means void-only spec
     reqs: Trigger[],        // see below; empty array allowed
     forbids: Trigger[],     // see below; empty array allowed
     note?: { kind: "info"|"gotcha", lbl: string, text: string },
   }

   type Trigger = {
     trigger: string,        // "TIs…" condtrig name
     count?: number,         // 1 if absent
     meta?: boolean,         // true if the trigger is a meta-aggregator
     expand?: string,        // optional human-readable "what counts" gloss
   }
   ```

2. **`window.renderRoomCard(roomSpec, options)`** — returns a
   `HTMLDetailsElement`. Pure-DOM, no side effects on the document. The
   `options` object carries presentation knobs, all optional:

   ```
   {
     idPrefix?: string,      // default "room-" — used for the element id
     pinned?: boolean,       // default false; when true, render with
                             // a "pinned" visual marker (Phase 3 will use)
     onPin?: (spec) => void, // optional; if set, render a pin-toggle button
                             // inside the summary; otherwise the button is
                             // omitted (rooms-reference.html doesn't pin)
     openByDefault?: boolean,// default false; sets <details open>
   }
   ```

   The function must **not** read or write `localStorage`, `location.hash`,
   or any global state — it's pure data → DOM. Deep-link / hash handling
   stays in the page-level scripts that call it.

   Mirror the existing card markup so visual behavior is unchanged for
   rooms-reference.html (the main acceptance test). The trigger-line
   formatter (`fmtTriggerLine` in the current IIFE) stays a private
   helper inside `rooms.js`.

### Refactor `src/Ostranauts.Site/rooms-reference.html`

- Add `<script src="rooms.js"></script>` **before** the inline render IIFE.
- Delete the inline `window.ROOMS = [...]` literal.
- Delete the card-render block from the IIFE (the `for (const r of window.ROOMS)` body's *card* half — keep the priority-table-row half).
- Replace the deleted card-render code with a single call to
  `window.renderRoomCard(r, { idPrefix: "room-" })`, appending the
  returned node to `#room-list`.
- Preserve the deep-link `#room-Reactor` behavior and the Esc-key
  active-row clearing — those operate on the rendered DOM regardless of
  how it was built, so they should keep working unchanged.

### Acceptance test — visual diff

`rooms-reference.html` must render **pixel-identically** before and
after the refactor. Verify with one of:

- The preview server (`http://localhost:8765/rooms-reference.html`),
  using the `mcp__Claude_Preview__preview_screenshot` tool to capture
  before + after states. Note that the preview is launched by the
  `.claude/launch.json` `site` server, which serves `build/`, so you'll
  want to either rebuild (`make site`) or copy `rooms-reference.html`
  into `build/` directly between captures. CLAUDE.local.md has the
  cache-busting recipe.
- If the preview MCP is unavailable: open `src/Ostranauts.Site/rooms-reference.html`
  in a browser by `file://` URL before and after, and confirm by eye.

If you find the page-local `<style>` block duplicates rules already in
`style.css`, you may *optionally* consolidate, but only if every rule in
the duplicated block has an exact match in style.css. Don't broaden the
refactor speculatively.

### What you are NOT building in Phase 2

- The HTML/JS for `ship-inspector.html` (Phase 3).
- A new "Ship Inspector" link in `explorer.html` (Phase 4).
- Any change to the Phase 1 outputs under `src/Ostranauts.Site/data/`
  (the inspector page consumes those — Phase 3's job).
- Pin-state persistence, deep-link sync, or any consumer behavior the
  `onPin` option is meant to support. Phase 3 will plumb that.

Don't bundle phases. If a future phase needs a small change to your
Phase 2 module signature, it'll be a separate commit on its own.

### Sanity-check before declaring done

- `rooms-reference.html` renders identically (visual diff or careful
  side-by-side reload).
- The page's existing keyboard / deep-link behaviors still work
  (`#room-Reactor` opens that card; Esc clears active-row highlight on
  the priority table).
- `rooms.js` runs from `file://` (no `import`/`export`, no top-level
  await, no fetch).
- `window.renderRoomCard` invoked with a minimal `options` object (or
  none) produces a usable DOM node — try it once in the browser console
  to confirm.

## Commit hygiene

Before committing:

1. Add a DEV-LOG entry above the most recent existing entry. Use the
   format you see in the file (`## YYYY-MM-DD — slug`, then a paragraph
   or two). Mention: what was extracted, the visual-diff acceptance, and
   a one-line pre-push fair-use note (factor 1 transformative — modder
   tooling refactor; factor 2 our prose + JS, no game prose; factor 3
   nothing taken; factor 4 trivially clear).

2. Stage only:
   - `src/Ostranauts.Site/rooms.js` (new)
   - `src/Ostranauts.Site/rooms-reference.html` (modified)
   - `DEV-LOG.md`
   - Optionally `src/Ostranauts.Site/style.css` *only if* you consolidated
     a confirmed-duplicate `<style>` block.

3. Commit message format like the rest of the repo: short title (under
   70 chars), blank line, paragraph body, blank line, the standard
   `Co-Authored-By` trailer.

4. **Do not push.** Leave the commit local. The user pushes on their
   own cadence.

## When you finish

Update [PLAN-BUILDER.md](../../PLAN-BUILDER.md) to mark Phase 2 *shipped*
and Phase 3 *next*. Then write a fresh handoff prompt for Phase 3 (the
inspector page itself) at
`notes/agent-prompts/ship-inspector-builder-phase3.md`, mirroring this
prompt's structure but pivoting to the `ship-inspector.html` build. The
Phase 3 prompt should reference both Phase 1's data feeds (the four
artifacts under `src/Ostranauts.Site/data/`) and Phase 2's
`rooms.js` / `renderRoomCard` API.

When you write the Phase 3 prompt, flag for the next agent: **the
`src/Ostranauts.Site/data/canned-ships/*.json` files are intentionally
single-line compact JSON, not pretty-printed**. They are build
artifacts regenerated by `make ship-inspector-data`. Phase 3 must
consume them via `JSON.parse(...)` (or `<script src>` loaded payloads
that re-emit them as objects); under no circumstances should Phase 3
"reformat" them or check in pretty-printed copies — that's a 10× commit
footprint inflation for zero review value. Manifest + friendly-name map
remain pretty-printed because modders read those directly.

## Constraints reminder

- Follow [CLAUDE.md](../../CLAUDE.md)'s audience rule: any prose in
  module headers is for **modders editing Ostranauts JSON**, not players.
- The data tree under `data/` is read-only — never modify it.
- Plain vanilla JS, no build framework — runs from `file://`.
- If the existing card markup has a quirk that surprises you (an
  inconsistent class, an inline style block), match it faithfully on
  the first pass. Cleanup is a separate commit.
- Per CLAUDE.md's intern-script rule: any throwaway investigation
  scripts go in `scrap_scripts/<lang>/<NN>_<slug>.<ext>`, never inline
  `python -c …`.

That's the brief. Start with the required reading, then plan your file
split, then implement.
