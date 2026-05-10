# Agent handoff — ship-inspector tool, Phase 1 (data extraction)

You are picking up the **ship-inspector** axis of the Ostranauts Data Explorer project, a fourth axis after EXPLORER / AST / DESIGN. This document bootstraps you from zero context — assume nothing about prior conversations.

## Goal

Build a static-site tool at `src/Ostranauts.Site/ship-inspector.html` that takes an Ostranauts ship file (canned dropdown or user upload) and produces a build-from-scratch checklist: component-count grouping with persistent checkboxes, plus pinnable per-room requirement cards reused from the existing `rooms-reference.html`.

This is delivered in four phases. **Your job is Phase 1 only — the data extraction.** Subsequent phases will be picked up by future sessions.

## Required reading, in order

Read in this order before writing any code. Each one is short except where noted.

1. **[CLAUDE.md](../../CLAUDE.md)** — repo conventions. Pay specific attention to:
   - The `utils/` vs `scrap_scripts/` rule (your script lives in `utils/`).
   - The Python invocation rule (no `python -c` inline, paths anchored via `Path(__file__).resolve().parents[2]`).
   - The CodeDocs sync rule (if you change any `.cs` file, sync the matching CodeDocs entry).
   - The audience rule: "modder editing JSON," not player.
   - The four-factor fair-use check before pushing public content.
   - The DEV-LOG-before-commit rule.

2. **[CLAUDE.local.md](../../CLAUDE.local.md)** *(gitignored, may not exist)* — local toolchain quirks if present. The Bash tool runs WSL bash, not Git Bash; for filesystem-heavy work prefer Glob / Grep tools. PowerShell has no `&&`, use `; if ($?) { ... }`.

3. **[PLAN.md](../../PLAN.md)** — top-level routing across the four plan axes.

4. **[PLAN-BUILDER.md](../../PLAN-BUILDER.md)** — your plan. Read end-to-end. Phase 1 is what you're implementing; Phase 2-4 are downstream and out of scope for your slice.

5. **[src/Ostranauts.Site/rooms-reference.html](../../src/Ostranauts.Site/rooms-reference.html)** — the reference for site-page style + the `window.ROOMS` array and per-room card render function that Phase 2 will lift out. Skim only — you're not editing this file.

6. The most recent ~10 entries in **[DEV-LOG.md](../../DEV-LOG.md)** — current state of the site.

7. **One canned ship file** from `data/ships/` to understand the input shape. Pick one ~200–500 KB (e.g. `data/ships/B-REG.json`). Skim — don't memorize every key, just confirm the top-level structure (single-element array wrapping a dict with `aCOs`, `aRooms`, `aDockingPorts`, etc.).

8. **`decomp/Assembly-CSharp/JsonCondOwnerSave.cs`** + **`decomp/Assembly-CSharp/JsonCondOwner.cs`** — schema for what's in those CO objects. Especially: `strCODef`, `aStartingConds` / `aConds`, `aFactions`.

9. **`data/loot/loot.json`** — find the entries `RandomShip`, `RandomDerelictSmall`, `RandomDerelictMedium`, `RandomDerelictBig`, `RandomShipOld`. These are loot tables whose `aCOs` arrays list ship strNames. Each entry is a cond-string `Name=chance x min-max`. You'll dedupe across the five tables.

10. **A spot-check on `data/condowners/condowners.json`** to confirm `strNameFriendly` is the canonical "friendly name" key for an item entry. Skim a handful of `Itm*` entries.

Don't dive deeper than these. If you find yourself reading `app.js` or `GraphExporter.cs`, you've gone off-mission for Phase 1.

## Your deliverable — Phase 1

A new utility script and four new data outputs.

### `utils/python/build_ship_inspector_data.py`

Following the project's Python conventions:
- Anchors paths via `Path(__file__).resolve().parents[2]`.
- Forces UTF-8 output: `sys.stdout.reconfigure(encoding="utf-8")`.
- Module-level docstring explaining what it does.
- Must be invokable as `python utils/python/build_ship_inspector_data.py` from any working directory.
- Add an entry to [utils/README.md](../../utils/README.md).

The script's job:

1. **Enumerate canned-ship registries.** Parse `data/loot/loot.json`, find the entries `RandomShip`, `RandomDerelictSmall`, `RandomDerelictMedium`, `RandomDerelictBig`, `RandomShipOld`. For each, extract every entry from its `aCOs` array — these are cond-strings of the form `Name=chance x min-max`. Take just the `Name` portion (the part before `=`). Dedupe across the five tables. Each `Name` should match a filename in `data/ships/<Name>.json`. Skip + warn on any that don't (mod-side or already-removed entries).

2. **Strip-and-emit per-ship JSON.** For each ship reg in the enumerated set:
   - Read `data/ships/<reg>.json`.
   - Strip the heavy/irrelevant fields. **Drop**: `aLog`, `social`, `aMessages`, `aMsgColors`, `dictRecentlyTried`, `dictRememberScores`, `aRememberIAs`. Drop any `*png_base64*` or large base64 string fields you encounter (heuristic: any string field > 4 KB on a CO is suspect — log if you find one). **Keep**: ship metadata (`strName`, `strFriendlyName`, `ShipType`, `aRating`, dimensions, small flag fields like `bAIShip`, `bFusionTorch`, `commData`), `aRooms` (with `strSpecID` + tile coords), `aCOs` (with each CO's `strID`, `strCODef`, tile coords, `aFactions`, `aStartingConds` — needed for bucket classification), `aDockingPorts`, `aZones`.
   - Classify each CO into a bucket using its `aStartingConds`:

     | Bucket | Trigger (any one matches) |
     |---|---|
     | `walls` | A condition starting `IsWall` or `IsLitWall` or `IsThinWall` |
     | `floors` | A condition starting `IsFloor` |
     | `doors` | A condition starting `IsDoor` or `IsDockSys` |
     | `conduits` | A condition starting `IsConduit` or `IsWire` |
     | `containers` | `IsContainer` matches AND `IsInstallable` does NOT also match |
     | `equipment` | `IsInstallable` matches and the CO didn't fall into a more specific bucket above |
     | `decorative` | `IsCarried` matches and nothing more specific |
     | `other` | none of the above |

     Cond-strings have shape `Name=value x duration`. Strip the `=...` portion before bucket-matching. Order matters in the table above (first match wins) — implement as priority-ordered if/elif.

     Write the bucket name into a new field `_bucket` on the CO (the underscore prefix marks it as a runtime-derived field, not a JSON-schema key).

   - Write the result to `src/Ostranauts.Site/data/canned-ships/<reg>.json`. **Compact JSON, one line per file** (no indent, no spaces after delimiters). These are build artifacts consumed by JS at runtime; line-by-line diffs of a regeneration aren't useful, and pretty-printing a 5,000-item ship multiplied commit footprint by ~10× for no review value. *(Note: original Phase 1 prompt said "Pretty-print with 2-space indent — file size matters less than diff readability"; reversed during Phase 1 implementation after seeing the line-count blowup. The decision is documented in PLAN-BUILDER.md.)*

3. **Emit the manifest.** Write `src/Ostranauts.Site/data/canned-ships-manifest.json` as a JSON array of objects, one per canned ship:

   ```json
   { "reg": "B-REG", "friendlyName": "...", "sourceLootTable": "RandomDerelictSmall",
     "dimW": 24, "dimH": 12, "componentCount": 287,
     "bucketCounts": { "walls": 92, "floors": 78, "doors": 4, ... } }
   ```

   `friendlyName` comes from the ship's `strFriendlyName` if set, else falls back to `strName`. `sourceLootTable` is the *first* loot table where the reg appeared (a ship can appear in multiple — pick the first one and note this in a comment in the script).

4. **Emit the friendly-name map.** Walk `data/condowners/`, `data/cooverlays/`, `data/items/`. For every entry that has a `strNameFriendly` field, add `strName → strNameFriendly` to a flat dict. **Cover the full base game**, not just IDs that appear in canned ships. (Modders with custom mods can extend the JSON locally; uploaded ships with mod IDs not in the table will show raw IDs as fallback in Phase 3 runtime.) Write to `src/Ostranauts.Site/data/id-friendly-names.json` with 2-space indent.

5. **Add a Makefile target.** Add `ship-inspector-data` as a target that runs the script. Wire it as a dependency of whatever the existing "build the site data" target is — read the existing Makefile to find the right insertion point. The outputs ARE checked in; the make target is for re-generation when source data changes.

### Sanity-check the outputs

Before declaring done:

- `src/Ostranauts.Site/data/canned-ships-manifest.json` exists and contains every ship reachable from the five loot tables.
- Each `src/Ostranauts.Site/data/canned-ships/<reg>.json` exists and is well under 500 KB.
- `src/Ostranauts.Site/data/id-friendly-names.json` exists and totals < 500 KB.
- `make ship-inspector-data` regenerates all outputs idempotently (running it twice produces no diff).
- Run a spot-check on a few interesting entries. For instance, on a B- or O- ship, confirm at least some COs land in `walls`, `floors`, `doors`, `equipment` — if every CO ends up in `other` you have a bucket-rule bug.

### What you are NOT building in Phase 1

- The HTML/JS for `ship-inspector.html` (Phase 3).
- The `rooms.js` extraction (Phase 2).
- The nav-tab edit in `explorer.html` (Phase 4).

Don't bundle phases. If a future phase needs a small change to your Phase 1 outputs, it'll be a separate commit on its own.

## Commit hygiene

Before committing:

1. Add a DEV-LOG entry above the most recent existing entry. Use the format you see in the file (`## YYYY-MM-DD — slug`, then a paragraph or two). Mention: what was extracted, the four output artifacts, the bucket-classification rule, and a one-line pre-push fair-use note (factor 1 transformative — modder-tooling data; factor 2 our shape + identifier names + base-game JSON; factor 3 derived counts/IDs not creative content; factor 4 useless without owning the game).

2. Stage only:
   - `utils/python/build_ship_inspector_data.py`
   - `utils/README.md`
   - `Makefile`
   - `src/Ostranauts.Site/data/canned-ships-manifest.json`
   - `src/Ostranauts.Site/data/canned-ships/*.json`
   - `src/Ostranauts.Site/data/id-friendly-names.json`
   - `DEV-LOG.md`

3. Commit message format like the rest of the repo: short title (under 70 chars), blank line, paragraph body, blank line, the standard `Co-Authored-By` trailer.

4. **Do not push.** Leave the commit local. The user pushes on their own cadence.

## When you finish

Update [PLAN-BUILDER.md](../../PLAN-BUILDER.md) to mark Phase 1 *shipped* and Phase 2 *next*. Then write a fresh handoff prompt for Phase 2 (rooms.js extraction) at `notes/agent-prompts/ship-inspector-builder-phase2.md`, mirroring this prompt's structure but pivoting to the rooms refactor.

## Constraints reminder

- Follow [CLAUDE.md](../../CLAUDE.md)'s audience rule: prose framing is for **modders editing Ostranauts JSON**, not players.
- Identifier names + structural data extraction are fair use; don't include any base-game prose (`strDesc`, dialogue strings, plot text) unless absolutely necessary, and if you do, flag it in the fair-use note.
- The data tree under `data/` is read-only — never modify it.
- If you discover something surprising about the source data (e.g. a loot table you didn't expect, or a ship with malformed conds), document it in a one-line aside in the DEV-LOG entry rather than silently working around it.

That's the brief. Start with the required reading, then plan your script structure, then implement.
