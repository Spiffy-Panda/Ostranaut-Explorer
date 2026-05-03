# inputs.md — files this project reads

Five input surfaces, in dependency order: **game data** + **schemas** (the two `DataLoader` reads), the **Comment Mod overlay** (loaded alongside both), the **wiki cache** (consumed by extraction scripts), and the **decompiled C# tree** (consumed by audit + code-references scripts). The Ostranauts game data tree's `data/schemas/*-schema.json` files are the **authoritative spec** for the shape of input data objects. This document covers the structural context the schemas don't.

## 1. `data/` — game data tree (gitignored)

Sourced from `<Steam>/steamapps/common/Ostranauts/Ostranauts_Data/StreamingAssets/data` per the README. Not redistributed (no published wiki policy permitting it).

`DataLoader` walks `data/`'s immediate subdirectories. Every subdirectory holding `*.json` files is in scope; each `.json` file is expected to be a top-level JSON array of objects, each with a `strName` property unique within its (folder, strName) tuple.

The tree currently has ~50+ folders. Cluster of folders the extraction work focuses on:

| Folder                    | What it holds                                  | Notes                                                      |
|---------------------------|------------------------------------------------|------------------------------------------------------------|
| `condowners/`             | The fundamental "object" definitions           | Most cross-references originate here. ~13k entries.        |
| `items/`                  | Item definitions (sprites, sockets, etc.)      | Pointed to by `strItemDef` on condowners.                  |
| `conditions/`             | Status-effect / state definitions              | Targets of cond-string refs.                               |
| `conditions_simple/`      | Tuple-encoded conditions in one wrapper file   | Synthesized into 1,390 DataObjects by `ConditionsSimpleExpander`. |
| `interactions/`           | Actions characters can perform                 | Highest line count of any folder.                          |
| `condrules/`              | Rules driving NPC desire/AI                    | `aThresholds[*].strLootNew` is a NestedDirectArray ref.    |
| `condtrigs/`              | Condition trigger definitions                  | Dual-target fields (`aReqs` etc. — condtrigs OR conditions). |
| `loot/`                   | Loot tables; can grant items, conditions, or interactions | `aCOs` target is type-routed by sibling `strType` field.   |
| `cooverlays/`             | Display names/descriptions for items           | One COOverlay per item is expected.                        |
| `pledges/`                | Long-running AI behaviors attached to characters | `strIATrigger` etc. → interactions; `strThemID` → condowners. |
| `homeworlds/`             | Starting-station definitions                   | `aCondsCitizen` etc. — dual-target (conditions OR conditions_simple). |
| `installables/`           | Build/repair/uninstall actions                 | Coverage gap — see `notes/coverage-gaps.md`.               |
| `lifeevents/`, `tickers/`, `shipspecs/`, `chargeprofiles/`, `personspecs/` | Outgoing-ref schemas added in Slice E phase 5. |                                                            |
| `slots/`, `lights/`, `audioemitters/`, `plots/`, `plot_beats/`, `ships/`, `rooms/`, `traitscores/`, ... | Other specialized object types | All discovered automatically by walking subdirs.           |

### Out of scope (v1 — explicitly skipped)

| Path                       | Why                                                  |
|----------------------------|------------------------------------------------------|
| `data/schemas/`            | Read by `SchemaLoader`, not by `DataLoader`.         |
| `data/strings/`            | Localization strings; different format.              |
| `data/tsv/`                | Tab-separated, not JSON arrays.                      |
| `data/ai_training/`        | Different format.                                    |
| `data/DebugSocialAudit.csv`| Loose CSV file.                                      |

If `DataLoader` encounters a file that doesn't parse as a JSON array of objects, it logs and skips rather than throws — leaves room for the data tree to evolve.

## 2. `data/schemas/*-schema.json` — base-game schema set

JSON Schema (draft-07). Each file describes one folder's object shape. Sparse coverage — the base game ships only 5 schemas (`conditions`, `condowners`, `interactions`, `items`, `plot`), and many of them lack field descriptions.

The loader cares about three things per field:

1. **Type** — `string`, `array of string`, `boolean`, `number`, `object`, etc.
2. **Description** — free-text, but base-game schemas use consistent phrases that encode reference semantics:
   - *"refers to entry within items.json"* — value is a `strName` from `items/`.
   - *"Found in lights.json"* — value(s) are `strName`s from `lights/`.
   - *"Check colors.json to find options"* — softer phrasing, same intent.
3. **Field name conventions** — typed prefix (`str`, `n`, `f`, `b`, `a`, `map`) tells you the wire shape: `aXxx` is an array, `strXxx` is a string, `mapXxx` is a dict.

`SchemaLoader` parses descriptions + JSON Schema extensions (`x-shape`, `x-targets`, `x-nested-field`, `x-no-ref`, `x-ghost`) into `SchemaCatalog.FieldRule`s. See `CodeDocs/sources/Ostranauts.DataModel/SchemaLoader.md` for the full extension set.

## 3. `comment_mod/data/schemas/` — schema overlay (tracked)

Our schema improvements that significantly extend reference-rule coverage. **Tracked in this repo, not gitignored.** Shipped because base-game schemas are too sparse to drive the parser alone.

`Program.cs` passes both `data/` and `comment_mod/data/` to `SchemaLoader.Load(IEnumerable<string>)`. Folders present in both directories merge field-by-field, with the Comment Mod overlay winning on collisions. Suppression keys (`x-no-ref: true`) in later directories remove rules from earlier ones.

Currently ships overlays for ~17 folders (and growing): `chargeprofiles`, `conditions`, `condowners`, `condrules`, `condtrigs`, `crime`, `homeworlds`, `interactions`, `jobs`, `lifeevents`, `loot`, `personspecs`, `pledges`, `plot`, `plot_manager`, `shipspecs`, `tickers`. The eventual v2 mod-overlay loader generalizes this minimal multi-root mechanism.

## 4. `wiki_cache/` — local Ostranauts wiki snapshot (gitignored)

Cache of pages fetched from `ostranauts.wiki.gg` via the MediaWiki `parse` API. Two layers:

- `wiki_cache/raw/<slug>.json` — full API response (debugging, future re-extracts).
- `wiki_cache/markdown/<slug>.md` — extracted wikitext with a small YAML frontmatter (source URL, section count). Slashes in page titles become `__` so files stay flat.

Populated by tracked utilities (see `utils/README.md`):
- `utils/python/wiki_cache.py` — single-page on-demand fetch.
- `utils/python/wiki_crawl.py` — recursive crawl from a seed page; follows `[[Internal Link]]` references matching a path prefix (default `Modding`).

Consumed by `utils/python/wiki_extract_schemas.py`, which scans cached markdown for field-documentation patterns (wikitables + bold-prose mentions) and emits `comment_mod/data/schemas/<folder>-schema.json` overlays plus `comment_mod/wiki_review_queue.md` for entries it couldn't confidently resolve.

LLM-assist extraction passes also consume the cache and emit per-page provenance to `prose-extraction/<slug>-<model>.md`. See [`prose-extraction/README.md`](../../prose-extraction/README.md).

## 5. `decomp/Assembly-CSharp/` — decompiled game source (gitignored, optional)

Output of dnSpy decompilation of `Assembly-CSharp.dll` (see README setup steps). 126 `Json*.cs` deserialization classes are the **authoritative ground truth** for which fields the game actually reads — schemas should match these.

Consumed by tracked utilities:
- `utils/python/decomp_schema_crosscheck.py` / `decomp_schema_table.py` — diffs schemas against `Json*.cs` field lists; surfaces ghost rules and coverage gaps.
- `utils/python/decomp_extract_verifiables.py` — extracts `IVerifiable.GetVerifiables()` outputs, the canonical map of what data objects are checked against what folders.
- `utils/python/decomp_string_search.py` — regex-greps for `"<key>"` quoted-literal occurrences in code that the schema layer can't see.
- `utils/python/emit_code_refs.py` — generates `build/data/code_refs.js` (an output, but driven by this input).

The whole project works without `decomp/`; those scripts and the site's code-references panel just stay empty.

## Future inputs (not yet consumed)

- **Mod folders** — v2. Will mirror `data/`'s shape, loaded via `mod_info.json` + `loading_order.json`. The current Comment Mod overlay mechanism is the prototype.
- **Save files** — v2. Different schema, different location (`%USERPROFILE%/AppData/...`); separate parser.

When either lands, add a section to this file.
