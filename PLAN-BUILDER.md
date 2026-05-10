# PLAN-BUILDER

The fourth plan axis after [EXPLORER](PLAN-EXPLORER.md), [AST](PLAN-AST.md), and [DESIGN](PLAN-DESIGN.md): the **ship-builder diagnostic** — a static-site tool that takes an Ostranauts ship file (canned dropdown or modder upload) and produces a build-from-scratch checklist with persistent state.

If you're picking up work cold, read [PLAN.md](PLAN.md) for routing context, then this file end-to-end, then jump to the section matching your phase.

A self-contained agent handoff prompt that bootstraps Phase 1 from zero context lives at [notes/agent-prompts/ship-inspector-builder.md](notes/agent-prompts/ship-inspector-builder.md).

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

### Phase 1 — data extraction · *next*

A Python utility at [`utils/python/build_ship_inspector_data.py`](utils/python/build_ship_inspector_data.py) (will not exist until built) that:

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

Outputs ARE checked in — they're small (the canned-ships directory probably totals < 5 MB; the friendly-name JSON probably totals < 500 KB) and modders are explicitly encouraged to grab the friendly-name JSON directly.

### Phase 2 — rooms.js extraction · *blocked on Phase 1*

Lift the `window.ROOMS` data array and the per-room-card render function out of [src/Ostranauts.Site/rooms-reference.html](src/Ostranauts.Site/rooms-reference.html) into a new shared module `src/Ostranauts.Site/rooms.js`. Both `rooms-reference.html` and the new `ship-inspector.html` `<script src="rooms.js">`. CSS tokens stay in [style.css](src/Ostranauts.Site/style.css). The card render becomes a documented function `window.renderRoomCard(roomSpec, options)` that takes a `RoomSpec` and returns a DOM node — used identically by both pages.

Acceptance: `rooms-reference.html` renders pixel-identically before and after the refactor (visual diff via Playwright screenshot pair, or manual confirmation if Playwright isn't connected).

### Phase 3 — the inspector page · *blocked on Phases 1+2*

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

### Phase 4 — nav surface · *trivial, last*

One small edit in [src/Ostranauts.Site/explorer.html](src/Ostranauts.Site/explorer.html): add a "Ship Inspector" link on the **right side** of the `<nav id="tabs">`, visually separated from the Explorer/Schemas/Plots cluster (e.g. via `margin-left: auto` on the link, or a sibling `<span class="nav-spacer"></span>`). The inspector page does **not** add a backlink to the explorer for v1.

## How to use this file

- **Add** a phase entry when scope grows (e.g. tile-click cross-binding → Phase 5).
- **Move** items between *next* / *in progress* / *shipped* honestly. If you discover a phase needs decomposing, split it.
- **Don't** wire reverse links from `rooms-reference.html` or the explorer into the inspector until v2 — the surrounding site isn't ready for that cross-linking.

## Acceptance — v1

A modder lands at `<site>/ship-inspector.html`, picks a Testudo Pequod from the dropdown, sees the 2D grid + component checklist, ticks off 12 walls as built, closes the tab, comes back tomorrow, picks the same ship — checkboxes are still ticked. Or: uploads their own modded ship file, sees the same workflow, with raw IDs shown for any custom components their mod added.

## PLAN.md routing

This plan should be added to the "three plans" section of [PLAN.md](PLAN.md) (now four plans). No user-story currently routes to BUILDER specifically — when one does, add a row to the user-story routing table.
