# PLAN-BUILDER

The fourth plan axis after [EXPLORER](PLAN-EXPLORER.md), [AST](PLAN-AST.md), and [DESIGN](PLAN-DESIGN.md): the **ship-builder diagnostic** — a static-site tool that takes an Ostranauts ship file (canned dropdown or modder upload) and produces a build-from-scratch checklist with persistent state.

If you're picking up work cold, read [PLAN.md](PLAN.md) for routing context, then this file end-to-end, then jump to the section matching your phase.

Phases 1, 2, and 3 shipped 2026-05-10. The Phase 4 agent handoff (the explorer-nav edit) lives at [notes/agent-prompts/ship-inspector-builder-phase4.md](notes/agent-prompts/ship-inspector-builder-phase4.md). Earlier phase handoffs at [notes/agent-prompts/ship-inspector-builder.md](notes/agent-prompts/ship-inspector-builder.md) (Phase 1), [notes/agent-prompts/ship-inspector-builder-phase2.md](notes/agent-prompts/ship-inspector-builder-phase2.md) (Phase 2), and [notes/agent-prompts/ship-inspector-builder-phase3.md](notes/agent-prompts/ship-inspector-builder-phase3.md) (Phase 3) are kept for reference.

---

## Why this exists

Modders building a ship from an airlock outward want a **checklist** — *"this Testudo Pequod needs 200 wall lights, 47 floor tiles, 12 conduits, 3 reactor consoles."* The data to compute that already exists in `data/ships/` and `data/condowners/`; nothing on the site currently exposes it.

The tool is also a second proof-of-thesis surface for the explorer (after [rooms-reference.html](src/Ostranauts.Site/rooms-reference.html) and the [modder handoffs](notes/handoff/)): take the parsed data tree, compose it into a modder-useful diagnostic, ship it as a static page that runs from `file://`. If this works, it suggests the parser+data backbone supports more than browsing — it supports *targeted* tools layered on top.

## Scope — v1

A new self-contained page at `src/Ostranauts.Site/ship-inspector.html` that:

- Lets the user pick a ship via dropdown (canned set) or upload their own.
- Shows a coarse 2D grid layout (wall / floor / empty cells, computed client-side from `aRooms` + `aCOs`).
- Lists components grouped by type (walls, floors, doors, conduits, containers, equipment, decorative, other) with a foldout per type.
- Shows a checkbox per component-instance, persisted in localStorage per ship.
- Lists per-room requirement cards, foldable, pinnable to a top section, rendering content from a shared `rooms.js` extracted from `rooms-reference.html`.
- Links out to the rooms reference page and to the friendly-names JSON.

A new "Ship Inspector" link sits on the **right side** of the [explorer.html](src/Ostranauts.Site/explorer.html) nav (visually separated from the Explorer/Schemas/Plots cluster). The inspector tool itself has **no backlink** to the explorer in v1 — the explorer's surfaces aren't ready for cross-linking yet.

## Out of scope — v1

- Tile-click → component-highlight cross-binding (deferred).
- Sprite-based or color-coded-by-type rendering (3-color palette only for v1: wall / floor / empty).
- Cloud sync of checklist state.
- Reverse links from `rooms-reference.html` into the inspector.
- A viewable HTML table view of the ID→friendly-name map. For v1, just link to the raw JSON; build a table view later if there's demand.

## Phases

### Phase 1 — data extraction · *shipped 2026-05-10*

A Python utility at [`utils/python/build_ship_inspector_data.py`](utils/python/build_ship_inspector_data.py) that:

1. Parses [data/loot/loot.json](data/loot/loot.json) and follows `RandomShip` / `RandomDerelictSmall` / `RandomDerelictMedium` / `RandomDerelictBig` / `RandomShipOld` to enumerate the ship registries that should ship with the site.
2. For each enumerated `<reg>`, reads [data/ships/](data/ships/)`<reg>.json`, strips it down (drop `aLog`, `social`, `aMessages`, `aMsgColors`, `dictRecentlyTried`, `dictRememberScores`, `aRememberIAs`, base64 image dumps), preserves ship metadata + `aRooms` + `aCOs` (with `strCODef` + tile coords + `aFactions`) + `aDockingPorts` + `aZones` + small flags, and writes the result to `src/Ostranauts.Site/data/canned-ships/<reg>.json`.
3. Classifies each kept CO into a bucket via its `aStartingConds`, writing the result to a new field `_bucket` on the CO so runtime doesn't re-derive:

| Bucket | Discriminator (any one matches) |
|---|---|
| `walls` | `IsWall` (any variant — `IsLitWall*`, `IsThinWall*`, etc.) |
| `floors` | `IsFloor` |
| `doors` | `IsDoor`, `IsDockSys*` |
| `conduits` | `IsConduit`, `IsWire*` |
| `containers` | `IsContainer` (and not also flagged `IsInstallable` as equipment) |
| `equipment` | `IsInstallable` (everything not already in the above) |
| `decorative` | `IsCarried` only (no install/wall/floor/etc. flag) |
| `other` | none of the above |

4. Emits `src/Ostranauts.Site/data/canned-ships-manifest.json` — `[{ reg, friendlyName, sourceLootTable, dimW, dimH, componentCount, bucketCounts: {...} }]` driving the dropdown.
5. Walks [data/condowners/](data/condowners/), [data/cooverlays/](data/cooverlays/), [data/items/](data/items/) and emits `src/Ostranauts.Site/data/id-friendly-names.json` — `{ "<id>": "<strNameFriendly>" }` covering the **full base game** (not just intersection-with-canned-ships). Modders with custom mods can extend this JSON locally; uploaded ships with mod IDs not in the table show raw IDs as fallback in the runtime, with a tooltip noting *"likely from a mod."*
6. Adds a `ship-inspector-data` target to [Makefile](Makefile) that re-runs the script.

Outputs ARE checked in — but the canned-ships JSONs are **build artifacts**: regenerated by `make ship-inspector-data`, consumed by JS at runtime, never read by humans. Each ship file is a single-line compact JSON (no indent, no spaces after delimiters). Don't pretty-print them — at indent=2 a 5,000-item ship multiplies the commit footprint by ~10× for no review value, since a regeneration diff is "all of it changed" anyway. The manifest and friendly-name map stay pretty-printed at indent=2 because modders are encouraged to read them directly (the friendly-name JSON in particular is intended as a downloadable reference).

**Phase 1 reconciliation notes (2026-05-10).** The actual data shape required two corrections to the spec above:

1. *Ship items live in `aItems`, not `aCOs`.* Ship JSONs are `[<ShipDict>]` single-element arrays whose dict has `aItems[]`. Each item is a reference-only `{strName, fX, fY, fRotation, strID}` — no inline `aStartingConds`. The `aCOs` key does not appear on ships at all. The script preserves the source `aItems` key and adds `_bucket` per item; downstream phases consume `aItems`.
2. *Bucket discriminators must be resolved through the `strCOBase` chain.* Each `aItems` entry's `strName` references a CondOwner / Item / CooverLay def in `data/condowners,items,cooverlays`. Items and overlays carry no conds directly — they delegate via `strCOBase` to a CondOwner def whose `aStartingConds` carries the `Is*` flags. The discriminator table also needed `IsInstalled` (the actual flag) instead of the spec's `IsInstallable` (which doesn't exist), and `IsCarried` was retained even though no ship-template item carries it (decorative bucket lands at zero on canned ships, as expected).

Result: 43 ships across `RandomDerelict{Small,Medium,Big}` (RandomShip is empty; RandomShipOld's ships were all already in RandomDerelictBig — dedup is correct). 60,471 total components, distributed roughly 56% floors / 17% conduits / 17% walls / 7% equipment / 3% other / negligible doors+containers. ~10 MB checked in for canned-ships/ (43 single-line files), 129 KB for the friendly-name map (well under the 500 KB target). Idempotent — re-running over the same source data produces an empty diff.

### Phase 2 — rooms.js extraction · *shipped 2026-05-10*

Lifted the `window.ROOMS` data array and the per-room-card render code out of [src/Ostranauts.Site/rooms-reference.html](src/Ostranauts.Site/rooms-reference.html) into a new shared module [src/Ostranauts.Site/rooms.js](src/Ostranauts.Site/rooms.js). Both `rooms-reference.html` and the future `ship-inspector.html` `<script src="rooms.js">`. CSS tokens stay in the page-local `<style>` block of `rooms-reference.html` for now (no overlap with [style.css](src/Ostranauts.Site/style.css), so consolidation would have been speculative — left as a follow-up). The card render is exposed as `window.renderRoomCard(spec, options)` returning a fresh `HTMLDetailsElement`. Options: `idPrefix` (default `"room-"`), `pinned` (adds an `is-pinned` class for downstream CSS hooks), `onPin` (optional callback — when set, appends a Pin/Unpin button to the summary), `openByDefault`. The function is pure data → DOM: reads no globals beyond `document`, writes none. Pin / deep-link / persistence behavior stays in the page-level scripts that call it — Phase 3 plumbs that.

Acceptance verified: `rooms-reference.html` pre-refactor and post-refactor DOM dumps of every priority-row and every card's `summary` + `body` `outerHTML` are byte-identical (18 rows, 18 cards). Preview-screenshot side-by-side confirms identical render. Deep-link `#room-Reactor` opens the Reactor card; clicking a priority row highlights it and opens the matching card; Esc clears the highlight — all unchanged from before.

### Phase 3 — the inspector page · *shipped 2026-05-10*

Shipped [src/Ostranauts.Site/ship-inspector.html](src/Ostranauts.Site/ship-inspector.html) + [src/Ostranauts.Site/ship-inspector.js](src/Ostranauts.Site/ship-inspector.js). Phase 1's data feeds get a small loader-companion: [utils/python/build_ship_inspector_data.py](utils/python/build_ship_inspector_data.py) now emits a `.js` wrapper alongside each `.json` artifact (`canned-ships/<reg>.js` self-registers into `window.SHIP_INSPECTOR_CANNED["<reg>"]`; manifest exposes `window.SHIP_INSPECTOR_MANIFEST`; friendly-name map exposes `window.SHIP_FRIENDLY_NAMES`). The original JSONs stay in place — modders read `id-friendly-names.json` directly, the canned-ship JSONs round-trip cleanly for off-browser inspection. Per-ship scripts inject lazily on dropdown selection; the page only eager-loads the manifest + friendly-name map. The script-wrapper path (over `fetch()`) matches the rest of the site, where Chrome's `file://`-fetch block forces this convention.

Upload-cache compression deferred for v1 — uploads stored uncompressed in localStorage with a 4 MB raw-text cap (refused above that). The lz-string vendoring path is documented in `ship-inspector.js`'s header comment for whichever phase wants to revisit it. Visual layout uses a single `<canvas>` rendering items binned to integer tiles with walls overdrawing floors (3-color: wall / floor / empty); the spec's "OR a room's tile list claims it" floor-paint rule is deferred to v1.5 because the `aRooms[].aTiles` flat indices live in a coordinate space that doesn't align trivially with the `aItems[].fX/fY` plane, and items alone already cover the full hull on every canned ship inspected.

Recorded layout gotcha for downstream pages: [style.css](src/Ostranauts.Site/style.css)'s global `main { display: grid; grid-template-columns: 240px 1fr; }` (the explorer's sidebar+detail layout) leaks into any new top-level page; the inspector overrides with `main.inspector { display: block; }` in its page-local `<style>` block. Room-card CSS duplicated inline (rooms-reference.html still owns the canonical copy in its `<style>` block); a follow-up should lift the shared rules into `style.css` and drop both copies — flagged in the inspector's `<style>` comment.

Original Phase 3 spec (kept for context):

`src/Ostranauts.Site/ship-inspector.html` + `ship-inspector.js`. Plain vanilla JS, no build framework, runs from `file://` (matches site convention). Layout:

```
┌─────────────────────────────────────────────────────────┐
│ Ship Inspector                                          │
│ [dropdown ▼ canned ships]   [upload your own ↑]         │
│ <privacy: stays in browser, nothing sent to server>     │
│ → Rooms reference   → ID-friendly-name JSON             │
├─────────────────────────────────────────────────────────┤
│ Selected: <Friendly Name> (<reg>)                       │
│ <X of Y components built>  [reset checklist]            │
├─────────────────────────────────────────────────────────┤
│ ┌─ Visual layout ─────────────────────────────────────┐ │
│ │ <coarse 2D grid: walls / floors / empty>            │ │
│ └─────────────────────────────────────────────────────┘ │
├─ Pinned rooms ──────────────────────────────────────────┤
│ <pinned room cards, foldable individually>             │
├─ Components ────────────────────────────────────────────┤
│ [search box] [walls] [floors] [doors] … [other]        │
│ ▸ Walls            <12 of 200 ✔>                       │
│ ▸ Floors           <0 of 47  ✔>                        │
│ ▸ Doors  …                                             │
├─ Rooms (unpinned) ─────────────────────────────────────┤
│ <foldable list of rooms; each can be pinned to top>    │
└─────────────────────────────────────────────────────────┘
```

State persisted in **localStorage** (cookies are too small + would be sent server-side if there ever is a server):

| Key | Value |
|---|---|
| `ship-inspector:active-ship` | `<reg>` or `upload:<sha256>` |
| `ship-inspector:checkboxes:<key>` | `{ "<co-instance-id>": true, ... }` |
| `ship-inspector:pinned-rooms:<key>` | `[ "<room-instance-id>", ... ]` |
| `ship-inspector:upload-cache:<sha>` | gzip-compressed uploaded JSON (lz-string or pako) |
| `ship-inspector:upload-meta:<sha>` | `{ name, dateUploaded, summary }` |

Compressing uploaded ship contents to localStorage means a modder can return to the same upload after reload. Plain ship files compress well (lots of repeated structural keys); a 2 MB ship typically gzips to 200–400 KB which fits within the per-origin localStorage budget.

Component-list ergonomics:

- Per-foldout count `<checked>/<total>` visible even when the foldout is collapsed.
- Sticky overall progress bar at the top of the components section.
- **Search box + filter pills** for the component list (filter pills toggle each bucket on/off, complementing free-text search by friendly-name or strCODef).
- Per line item: friendly name + quantity + that-many checkboxes (one per instance). Falls back to raw ID for unknown components, with a tooltip *"this ID isn't in the shipped name table — likely a mod component."*
- A **"reset checklist"** button per ship that wipes only that ship's checkbox state.

URL-shareable state:
- `ship-inspector.html#/ship/<reg>` for canned ships.
- `ship-inspector.html` (no hash) for uploaded ships — file content is the state and a URL can't carry it.

Print stylesheet (`@media print`):
- Hide ship dropdown, upload control, visual layout, search, filter pills.
- Show component checklist + pinned rooms only.
- Preserve checkbox visual state so a printed checklist matches the live one.

### Phase 4 — nav surface · *next*

One small edit in [src/Ostranauts.Site/explorer.html](src/Ostranauts.Site/explorer.html): add a "Ship Inspector" link on the **right side** of the `<nav id="tabs">`, visually separated from the Explorer/Schemas/Plots cluster (e.g. via `margin-left: auto` on the link, or a sibling `<span class="nav-spacer"></span>`). The inspector page does **not** add a backlink to the explorer for v1.

## How to use this file

- **Add** a phase entry when scope grows (e.g. tile-click cross-binding → Phase 5).
- **Move** items between *next* / *in progress* / *shipped* honestly. If you discover a phase needs decomposing, split it.
- **Don't** wire reverse links from `rooms-reference.html` or the explorer into the inspector until v2 — the surrounding site isn't ready for that cross-linking.

## Acceptance — v1

A modder lands at `<site>/ship-inspector.html`, picks a Testudo Pequod from the dropdown, sees the 2D grid + component checklist, ticks off 12 walls as built, closes the tab, comes back tomorrow, picks the same ship — checkboxes are still ticked. Or: uploads their own modded ship file, sees the same workflow, with raw IDs shown for any custom components their mod added.

## PLAN.md routing

This plan should be added to the "three plans" section of [PLAN.md](PLAN.md) (now four plans). No user-story currently routes to BUILDER specifically — when one does, add a row to the user-story routing table.
