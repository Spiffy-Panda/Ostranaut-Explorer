# inputs.md — files this project reads

The Ostranauts game data tree's `data/schemas/*-schema.json` files are the **authoritative spec** for the shape of input objects. This document only adds the context the schemas don't cover: which folders are in scope, how files are discovered, what the loader does with them.

## Root: `data/`

Sourced from `<Steam>/steamapps/common/Ostranauts/Ostranauts_Data/StreamingAssets/data` per the README. Not redistributed in this repo (no published policy on the wiki). Gitignored.

## In-scope folders

`DataLoader` walks `data/`'s immediate subdirectories. Every subdirectory holding `*.json` files is in scope; each `.json` file is expected to be a top-level JSON array of objects, each with a `strName` property unique within the (folder, strName) tuple.

Notable folders the parser cares about:

| Folder           | What it holds                                  | Notes                                    |
|------------------|------------------------------------------------|------------------------------------------|
| `condowners/`    | The fundamental "object" definitions           | Most cross-references originate here.    |
| `items/`         | Item definitions (sprites, sockets, etc.)      | Pointed to by `strItemDef` on condowners.|
| `conditions/`    | Status-effect / state definitions              | Targets of cond-string refs.             |
| `interactions/`  | Actions characters can perform                 | Highest line count of any folder (~133k).|
| `condrules/`     | Rules driving NPC desire/AI                    |                                          |
| `condtrigs/`     | Condition trigger definitions                  |                                          |
| `loot/`          | Loot tables                                    |                                          |
| `cooverlays/`    | Display names/descriptions for items           | One COOverlay per item is expected.      |
| `slots/`, `lights/`, `audioemitters/`, `plots/`, `plot_beats/`, `ships/`, `rooms/`, `traitscores/`, ... | Specialized object types | All discovered automatically by walking subdirs. |

## Out of scope (v1 — explicitly skipped)

| Path                       | Why                                                  |
|----------------------------|------------------------------------------------------|
| `data/schemas/`            | Read by `SchemaLoader`, not by `DataLoader`.         |
| `data/strings/`            | Localization strings; different format.              |
| `data/tsv/`                | Tab-separated, not JSON arrays.                      |
| `data/ai_training/`        | Different format.                                    |
| `data/DebugSocialAudit.csv`| Loose CSV file.                                      |

If `DataLoader` encounters a file that doesn't parse as a JSON array of objects, it should log and skip rather than throw — leaves room for the data tree to evolve.

## Schema files: `data/schemas/*-schema.json`

JSON Schema (draft-07). Each file describes one folder's object shape. The loader cares about three things per field:

1. **Type** — `string`, `array of string`, `boolean`, `number`, `object`, etc.
2. **Description** — free-text, but base-game schemas use consistent phrases that encode reference semantics. Examples seen in current schemas:
   - *"refers to entry within items.json"* — value is a `strName` from `items/`.
   - *"Found in lights.json"* — value(s) are `strName`s from `lights/`.
   - *"Check colors.json to find options"* — softer phrasing, same intent.
3. **Field name conventions** — typed prefix (`str`, `n`, `f`, `b`, `a`, `map`) tells you the wire shape: `aXxx` is an array, `strXxx` is a string, `mapXxx` is a dict.

`SchemaLoader` parses these descriptions into `SchemaCatalog.FieldRule`s. See `CodeDocs/sources/Ostranauts.DataModel/SchemaLoader.md` for the regex set planned for v1.

## `wiki_cache/` — local Ostranauts wiki snapshot

Gitignored cache of pages fetched from `ostranauts.wiki.gg` via the MediaWiki `parse` API. Two layers:

- `wiki_cache/raw/<slug>.json` — full API response (debugging, future re-extracts).
- `wiki_cache/markdown/<slug>.md` — extracted wikitext with a small YAML frontmatter (source URL, section count). Slashes in page titles become `__` so files stay flat.

Read-only inputs to two scripts (under tracked `utils/python/` — see `utils/README.md`):
- `utils/python/wiki_cache.py` — single-page on-demand fetch.
- `utils/python/wiki_crawl.py` — recursive crawl from a seed page, follows `[[Internal Link]]` references that match a path prefix (default `Modding`).

Consumed by `utils/python/wiki_extract_schemas.py`, which scans the cached markdown for field documentation patterns (wikitables + bold-prose mentions) and emits `comment_mod/data/schemas/<folder>-schema.json` overlays plus `comment_mod/wiki_review_queue.md` for entries it couldn't confidently resolve.

## Future inputs (not yet consumed)

- **Mod folders** — v2. Will mirror `data/`'s shape and merge by `strName` per `loading_order.json`.
- **Save files** — v2. Different schema, different location (`%USERPROFILE%/AppData/...`); separate parser.

When either lands, add a section to this file.
