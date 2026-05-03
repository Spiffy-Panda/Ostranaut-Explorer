# DEV-LOG

Reverse-chronological. Add an entry before every commit — at minimum a one-liner, ideally a short paragraph when the change is non-obvious. Tag with ISO date.

---

## 2026-05-03 — Multi-strName-source surfacing (alt-folder suffix on every ref link)

User flagged the case where the same strName lives in multiple folders simultaneously — the `Itm*` pattern where a name is a loot entry, a condowner, AND an item DTO at once. The schema's primary target picks one folder; modders editing the data need to see the others to avoid editing the wrong file.

The detector itself was already handling multi-target — `RefCandidateDetector` emits all qualifying targets per `(sourceFolder, fieldPath)`, sorted by hit-rate. Real-data confirmation: `interactions.objLootModeSwitchThem` produces a Candidate with three targets — loot 100%, condowners 93%, items 73% — even though it's covered by schema. The miss was on the surfacing side.

Changes (site-only):

- `nameToFolders` map built at load (strName → Set<folder>). Cheap — same data the cross-folder duplicate check on `/health/data` was already computing per render.
- `renderAltFolderSuffix(primaryFolder, strName)` helper: when a name lives in 2+ folders, appends `(also: <folder>, ...)` after the link, each clickable. Used on outgoing/incoming edge rows and on the auto-detected scalar links in the Fields block.
- `/health/data` dangling-edges sample table: when the dangling target's strName actually exists in another folder, the row shows "actually exists in: X" — turns a dead-end into a navigable hint. Frequently surfaces "schema says items/ but the value lives in condowners/" type misroutings.
- `/health/coverage`: new "Covered fields with multi-folder targets" section listing every covered candidate where ≥2 target folders matched. Surfaces patterns the previous page filtered out (it only showed uncovered candidates). Uses the same row template as the uncovered list (refactored to a shared `candidateRow()` function).

No detector / library changes. No new tests. Site behavior change only.

## 2026-05-03 — Auto-detection + health pages + template engine + conditions_simple expansion (phases 1-5)

Plan-driven 6-phase batch. The runaway take-away: the auto-detector turns up **240 candidates (184 uncovered)** on real data — enough material for the next several Slice-E-style schema expansions to be data-driven instead of hand-curated.

**Phase 1** — `notes/coverage-gaps.md`. Living scratchpad for "this folder/field is referenced but our extractor doesn't see it." Seeded with the installables case (every conventional ref-shaped field — `strActionCO`, `CTThem`, `aLootCOs[*]`, `aInputs[*]`, etc.).

**Phase 2** — `Ostranauts.DataModel.RefCandidateDetector` + `CandidateExporter`. Scans every leaf string in every node's `Fields`, hits each value against a global `(folder, strName)` index. Two passes per leaf — raw (value-as-whole) and encoded (split on `,`/`=`/`|` and try the prefix token, catches CondString-style and LootItm-style fields without schema rules). Per `(sourceFolder, fieldPath)` aggregation: sample size, distinct values, hits per target folder, hit-rate. Self-folder hits and the `strName` field are excluded by default. Output: `build/data/ref_candidates.js` (~91 KB). Sort: uncovered first, then by `sampleSize × bestHitRate`. 7 unit tests.

Real-data biggest finds: `ships.aItems[*].strName` → cooverlays (454k samples, 80% rate); `ships.aConstructionTemplates[*].aItems[*].strName` → cooverlays (123k); `condrules.aThresh[*].strLootNew` → loot (matched the manual Slice E phase 4 nested-array pattern); the entire installables coverage gap (`strActionCO`, `CTThem`, `strInteractionTemplate`, `aLootCOs[*]`, `aInputs[*]` via encoded-`=` split, etc.). 7-distinct-value coincidence cases (e.g. `items.aSocketReqs[*]`) sort low because of the `× distinctValues` factor in the leverage score.

**Phase 3** — site decoration. Top-level scalar fields with an uncovered candidate render as `folder:value` links on the Fields block when the value resolves to a known node, with a 🔍 badge and hit-rate tooltip. Array/nested-path candidates surface on the coverage page only (not inline) — keeps the detail page from getting noisy. Uses CSS `.auto-detected` for visual distinction from schema-derived edges (dashed underline vs solid).

**Phase 4** — `/health/coverage` (extractor-integrity). Per-folder table: objects, in-edges, out-edges, rules, candidates. Zero-out-edges rows highlighted as suspected blind spots. Below that: top-200 detector candidates by leverage with target folder, hit-rate, sample/distinct counts, encoded-shape tag. Will become the standing dashboard for "are we actually seeing this folder."

**Phase 5** — four sub-features:
- **`/health/data`** — dangling-by-target-folder, sample 50 dangling rows with click-through to source, orphans-by-folder (top 30), cross-folder duplicate strNames (top 100).
- **`conditions_simple` expansion** — `Ostranauts.DataModel.ConditionsSimpleExpander`. The folder's single file holds a wrapper with a flat `aValues` array where every 7 elements is one logical record `[strName, strNameFriendly, strDesc, nDisplaySelf, nDisplayOther, strColor, bInvert]`. Synthesizes one DataObject per tuple. Object count: **31,152 → 32,542 (+1,390)**. Now resolves the previously-dangling `homeworlds.aConds*` edges — those rules already had `x-targets: ["conditions_simple", "conditions"]` from Slice E phase 3 but had no synthetic entries to land on. 5 unit tests. Real data finding surfaced: `IsBCER` and `IsBCRS` appear twice within the wrapper's array (data bug or override).
- **Template engine** — site-only. Two surfaces per detail page: (a) folder-wide Mustache-lite template, click-to-edit, magic-word interpolation against a context built from `fields.<key>` / `outRefs.<sourceField>.{length, first}` / `inRefs.*` / `outCount` / `inCount` / `strName` / `folder` / `file`; (b) per-object free-form note. localStorage by default; "copy for comment_mod" buttons produce paste-ready text drops for `comment_mod/templates/<folder>.tmpl` and `comment_mod/notes/<folder>/<strName>.md`. Editor sidebar lists magic words available on the current object, click-to-insert.
- **`/llm-candidates`** — global top-50 by incoming-ref count + per-folder top-10. Two clipboard buttons per row: copy folder-template prompt / copy object-blurb prompt. Prompts are self-contained — node fields, outgoing/incoming ref groups, magic-word inventory, exemplar siblings. User pastes into chat, gets a template/blurb back, pastes into the template editor. **Zero programmatic LLM API spend** — user controls every call.

**Tabs + blurbs.** Moved Schemas / Coverage / Data Health / LLM Candidates from the sidebar to a top tab bar. Each tab has a hover-tooltip blurb and a visible page-blurb panel at the top of the page, both written from a modder's POV: when do you visit this page, what does it tell you, what should you do with it.

**Real-data deltas vs the previous build:**
```
  objects:    31,152 → 32,542  (+1,390 conditions_simple synthetics)
  references: 77,866           (unchanged — fallback resolution shifts dangling → conditions_simple, no new edges)
  rules:      91               (unchanged — schema overlay promotion is deferred phase 6)
  candidates: 0     → 240      (new detector channel; 184 of those uncovered by schema)
  warnings:   13    → 15       (+2 conditions_simple internal duplicates)
```

**File counts:** 4 new C# files (RefCandidateDetector, CandidateExporter, ConditionsSimpleExpander, plus 2 test files) + significant additions to app.js (5 new render functions: coverage, data-health, llm-candidates, template-block, tabs+blurbs). 79/79 tests passing (was 67; added 12 across detector + expander tests).

**CodeDocs synced.** 3 new source overviews + Program.md, outputs.md, 00_PROJECT.md updated to reflect the new pipeline + new payload file (`ref_candidates.js`).

**Phase 6 deferred** — promoting auto-detected candidates into `comment_mod/data/schemas/` overlays. Not blocking anything; the report file persists and the site already renders the candidates inline + on the coverage page. Do this when ready to commit a large overlay diff.



Per user: "check to see if there are any python scripts to extract and document into the utils tracked folder."

Audited the 10 python scripts in `scrap_scripts/python/`:

- **Promoted (8)** — durable tools, regenerate tracked content, or required for builds:
  | Old | New |
  |---|---|
  | `01_wiki_cache.py` | `utils/python/wiki_cache.py` |
  | `02_wiki_crawl.py` | `utils/python/wiki_crawl.py` |
  | `03_wiki_extract_schemas.py` | `utils/python/wiki_extract_schemas.py` |
  | `06_decomp_schema_crosscheck.py` | `utils/python/decomp_schema_crosscheck.py` |
  | `07_decomp_schema_table.py` | `utils/python/decomp_schema_table.py` |
  | `08_extract_verifiables.py` | `utils/python/decomp_extract_verifiables.py` |
  | `09_decomp_string_search.py` | `utils/python/decomp_string_search.py` |
  | `10_emit_code_refs.py` | `utils/python/emit_code_refs.py` |
- **Kept in scrap (2)** — explicit "one-off" / "exploration" per docstring:
  - `04_verify_folder_counts.py`
  - `05_condowners_keys.py`

Old copies deleted from `scrap_scripts/python/` for disk hygiene (gitignored, no commit effect — just removes confusion). Names dropped the `<NN>_` prefix on promotion; descriptive names now (`wiki_cache.py`, `decomp_string_search.py`, etc.). Renumbering is no longer meaningful for tracked tools.

Internal change: `wiki_crawl.py`'s import of `01_wiki_cache` (which used `importlib.import_module` because the module name started with a digit) replaced with a normal `from wiki_cache import ...`.

`utils/README.md` added with a per-script table + common usage examples + a "how to add a new tool" section.

`CLAUDE.md` "Scrap scripts" section rewritten as "Scripts: utils/ vs scrap_scripts/" — codifies the promotion criteria, the tracked-vs-throwaway distinction, and the rules that apply to both kinds.

Tracked-file cross-references rewritten via a one-shot Python rewrite (`scrap_scripts/python/<NN>_*.py` → `utils/python/<descriptive>.py`) across `DEV-LOG.md`, `PROJECT-PITCH.md`, `README.md`, `CodeDocs/io/{inputs,outputs}.md`, `CodeDocs/sources/Ostranauts.DataModel/SchemaLoader.md`, `CodeDocs/iverifiable-ref-map.md`.

Smoke-tested both `decomp_string_search.py EmbarkCommand` and `emit_code_refs.py` from the new path; same outputs as before (1 hit / ~658 KB code_refs.js).

## 2026-05-03 — graph.js split into 3 payloads + dnSpy README + emit_code_refs

Per user: split the monolithic graph.js into typed payloads and add a code-references file.

**Split (graph.js v4 → v5):**
- `graph.js` (`window.GRAPH_DATA`): the direct graph — nodes, edges, rules. Same shape as v4 minus per-node `fields`. ~23 MB (was ~32).
- `properties.js` (`window.NODE_PROPS`): `{"<folder>:<strName>": {scalar fields...}}`. Lives next to graph.js, written by the same Builder pass. ~8.9 MB.
- `code_refs.js` (`window.CODE_REFS`): `{"<strName>": [{file, line, text}, ...]}`. Hardcoded `"<strName>"` quoted-literal occurrences in `decomp/`. Generated by a separate Python script (below). ~658 KB; 1,321 names have hits, 3,309 total occurrences.

`GraphExporter.WriteJson` now writes both the graph and properties files (the second one is a sibling to the path passed in). Site loads all three via separate `<script src>` tags; properties + code-refs are optional and the site degrades gracefully if either is missing (empty Fields block, no Code references block).

**`10_emit_code_refs.py`** — scans `decomp/Assembly-CSharp/**/*.cs` for `"<identifier>"` quoted-literal patterns whose contents match a strName in graph.js. Reads each file once, single regex pass. Outputs `build/data/code_refs.js`. Required for the site's code-references block; otherwise it just doesn't appear.

**README dnSpy section** — full setup instructions for decompiling `Assembly-CSharp.dll` with [dnSpy](https://github.com/dnSpyEx/dnSpy) per the wiki's recommendation. Default settings, source `<Steam>/.../Ostranauts_Data/Managed/Assembly-CSharp.dll`, destination `decomp/Assembly-CSharp/`. Whole project works without `decomp/`; the four scripts that consume it (06, 07, 08, 09, 10) just stay idle.

**Site detail page** now renders code references when present. Each hit shows the relative file path + line number + the code line itself in a monospace block.

Tests: 67/67 (split is pure serialization rearrangement; no behavior changes).

## 2026-05-03 — Slice E phase 6: decomp string-literal search script

New `utils/python/decomp_string_search.py` (gitignored). Regex-greps the decompiled C# source tree for `"<key>"` quoted-literal occurrences. Catches references to data names that don't appear via the JSON-schema layer — typically hardcoded calls in game code like:

```
JsonPledge pledge = DataHandler.GetPledge("EmbarkCommand");
```

(in `AIShipManager.cs:1007`). The schema-driven extractor can't see this because `EmbarkCommand` isn't anywhere in the data tree's JSON; it's a runtime lookup by a string literal in code.

Usage:
```
python ./utils/python/decomp_string_search.py EmbarkCommand
python ./utils/python/decomp_string_search.py -C 3 EmbarkCommand DcFood
```

Reports `path:lineno: line` for each hit. `-C N` adds N lines of surrounding context with a `>>` marker on the matched line. Soft-warns when a key doesn't look identifier-shaped (pass `--no-strict` to silence).

Smoke-tested: `EmbarkCommand` → 1 hit (AIShipManager.cs); `DcFood` and `Coughing` → 0 hits (purely data-driven, never named explicitly in code). The latter is the expected pattern for most data names — the win is finding the *exceptions* (string-literal lookups in code that schema work can't reach).

Future: a higher-level "audit all data names against decomp string-lookups" pass could iterate every node in graph.js, run this against decomp, and report which data entries are referenced from game code as string literals. Out of scope for this slice.

## 2026-05-03 — Slice E phase 5: outgoing-ref schemas for tickers / shipspecs / lifeevents / chargeprofiles

Folders that DataLoader was already loading but had no schema → no outgoing rules. Added minimal overlays based on `decomp/Assembly-CSharp/Json{Ticker,ShipSpec,LifeEvent,ChargeProfile}.cs` property lists + `data/<folder>/*.json` value samples.

- `tickers-schema.json`: `strCondLoot` → loot (48 edges), `strCondLootCoeff` → conditions (14), `strCondUpdate` → conditions (0 — present but unused in current data).
- `shipspecs-schema.json`: `strLootRegIDs` (24) and `strLootATCRegions` (9) → loot.
- `lifeevents-schema.json`: `strInteraction` → interactions (97), `strStartATC` → homeworlds (12), `strShipRewards` → loot (12).
- `chargeprofiles-schema.json`: `strCondName` → conditions (14), `strItemCT` → condtrigs (13).

All inferred from decomp ground truth; conservative — only the fields whose target folder I'm confident about are declared. Other Json* properties left to the future.

Real-data deltas vs Phase 4:
  edges:    77,623 → 77,866  (+243)
  rules:    81 → 91          (+10)

## 2026-05-03 — Slice E phase 4: nested object refs (DcFood case fully resolved)

The `condrules.aThresholds[*].strLootNew` case (the `DcFood` investigation that motivated all of Slice E): condrule entries have an `aThresholds` array of OBJECTS, each containing a `strLootNew` field that references `loot/`. Single-level extraction couldn't reach into the nested objects.

Mechanism added:
- New `FieldShape.NestedDirectArray` — for arrays where each element is an object with a single named string sub-field that's the ref.
- `SchemaCatalog.FieldRule.NestedField` — name of the sub-field within each array element.
- `SchemaLoader` reads `x-nested-field: "<sub>"` JSON Schema extension.
- `ReferenceExtractor.ExtractNestedDirectArray`: walks the array, pulls the named sub-field from each object, emits one edge per non-empty value. `sourceField` is set to `"aThresholds[*].strLootNew"` so the path is visible on the detail page. Inherits the existence-aware fallback resolution from Phase 3.

Schema overlay:
- `condrules-schema.json`: added `aThresholds` with `x-shape: NestedDirectArray`, `x-nested-field: "strLootNew"`, `x-targets: ["loot"]`. The DcFood-class condrules now produce 5 nested-loot refs each.

Script 07 mapping fix:
- `CLASS_TO_SCHEMA` updated: `CondRule → condrules` (no `Json` prefix; the runtime class IS the deserialization target per IVerifiable map). Plus `JsonPlotManagerSettings → plot_manager` so the script catches the second plot folder properly.

**`condrules:DcFood` verified end-to-end: now shows 6 outgoing refs (1 strCond → conditions:StatFood, 5 aThresholds[*].strLootNew → loot:CONDDcFood01..05).** This was the canary case that started Slice E.

Real-data deltas:
  edges:    76,846 → 77,623  (+777, mostly aThresholds across all condrules)
  rules:    80 → 81          (+1)

Tests: 67/67 (extractor signature unchanged; new shape uses the existing exists checker).

## 2026-05-03 — Slice E phase 3: existence-aware fallback targets

Per the IVerifiable map: condtrigs `aReqs`/`aForbids`/`aTriggers`/`aTriggersForbid` are dual-type — each entry is *either* a condtrig name *or* a condition name. Same shape applies to `homeworlds.aConds*` which can target `conditions_simple/` or `conditions/`. Single fixed-target rules can't model this.

Mechanism added:
- `SchemaCatalog.FieldRule.FallbackTargets` — optional ordered list of fallback folders.
- `SchemaLoader` reads `x-targets: [primary, ...fallbacks]` JSON Schema extension. First entry becomes the primary `TargetFolder` (overrides the regex-derived one); the rest become `FallbackTargets`.
- `ReferenceExtractor` now optionally takes an `exists: Func<string, string, bool>` checker. New `ResolveExistingTarget` walks `[primary, ...fallbacks]` per value and routes each edge to the first folder that contains it, falling back to primary (= dangling) if none. Applied to Direct, StringArray, CondStringArray shapes.
- `Program.cs` builds the existence set (HashSet<(folder, strName)>) once after loading, passes its `Contains` to the extractor.

Schema overlays:
- `condtrigs-schema.json`: `aReqs`/`aForbids`/`aTriggers`/`aTriggersForbid` get `x-targets: ["condtrigs", "conditions"]`. Plus added the missing `aTriggersForbid` field.
- `homeworlds-schema.json`: `aCondsCitizen`/`aCondsResident`/`aCondsIllegal` get `x-targets: ["conditions_simple", "conditions"]`.

Real-data deltas:
  edges:    76,055 → 76,846  (+791, mostly new aTriggersForbid)
  rules:    79 → 80          (+1 new rule)
  Verified split: condtrigs.aReqs → 5,677 to condtrigs, 2,953 to conditions
  Verified split: homeworlds.aCondsCitizen → 109 to conditions_simple, 84 to conditions

Dangling counts on conditions_simple still 100% — that's the separate "array-of-tuples structural format" issue (the folder has a single meta-entry containing the actual conditions in `aValues`). Phase 3 only addresses the routing mechanism; the structural workaround is a separate slice.

Tests: 67/67 (no behavioral test changes — extractor signature gained an optional parameter that defaults to skipping fallback resolution).

## 2026-05-03 — Object detail page: scalar fields + hover descriptions + casing fix

User flagged three issues on the homeworlds:MHNG detail page (the `aCondsCitizen`/`aCondsResident`/`aCondsIllegal` view):

1. **Field group headers were forced UPPERCASE** (e.g. `ACONDSCITIZEN`) — not Hungarian-notation. Fixed by removing `text-transform: uppercase` from `.refs-block .group-head` and switching to a monospace font for legibility. Now shows `aCondsCitizen` as written.

2. **Schema descriptions weren't surfaced** even though we had them on every rule. Added `Description` to `SchemaCatalog.FieldRule`, plumbed through `SchemaLoader` (was already reading `description` for ref derivation; now also retains it on the rule). `GraphExporter` serializes `description` on each rule entry. Site stores them in a `(folder:fieldName) → description` map at load time. Field-group headers and the new field-name labels now render with `title=` attributes; CSS adds a dotted underline + help cursor when a tooltip is available.

3. **Non-reference data fields weren't shown anywhere** — the homeworlds page should display strColonyName, nFoundingYear, etc. Added per-node `fields` object containing scalar values (string/number/bool/null only — arrays/nested objects skipped to keep payload size sane). New `Fields (N)` block on the detail page renders them as a key:value list, sorted, with hover descriptions.

Schema version: 3 → 4. Two additive surfaces (per-node `fields`, per-rule `description`); v3 readers ignore the additions.

Size impact: graph.js grew 19 MB → **32 MB** (mostly per-node scalars across 31k nodes). Per-node `fields` is the bulk; per-rule descriptions are negligible. Sharding moves up the priority list if this grows much further.

Tests: 67/67 (no behavioral test changes; the new payload fields are pure pass-through).

## 2026-05-03 — x-no-ref suppression + plot_manager mapping; cleanup after Phase 2

**Two findings from a dangling-rate audit after Phase 2:**

1. `interactions.strUseCase` was producing 103 dangling edges to `chargeprofiles/` — but the field's actual values are use-case tokens like `"Check"` and `"Normal"` (suffixes on chargeprofile name patterns at runtime). The wiki description's parenthetical *"(strName from chargeprofiles.json)"* tripped the regex. **Fixed** by adding a new JSON Schema `x-no-ref: true` extension and a suppression mechanism: SchemaLoader's multi-dir variant now collects keys flagged with `x-no-ref` in later dirs and removes any rule from earlier dirs at that key. Applied via overlay; +1 test.

2. `JsonPlotManagerSettings` (sibling of `JsonPlot`) is the C# class whose fields the prior "plot ghosts" actually live on — the data folder is `plot_manager/` (one entry, `pm_settings.json`). **Added** `comment_mod/data/schemas/plot_manager-schema.json` to document the fields where they belong (no new ref rules — all numeric/object types).

Also: refactored single-dir `SchemaLoader.Load` to delegate to a private `LoadInternal` returning both rules and suppression keys; multi-dir Load now uses `Dictionary<key, rule>` instead of a flat list, which de-duplicates base+overlay rules. Total catalog rule count dropped 94 → 79 (15 collapsed dupes); edges only changed by -103 (the strUseCase suppression). De-dup makes the inspector counts more honest.

Tests: 66 → 67 (+1 for x-no-ref round-trip).

Real-data deltas vs phase 2:
  edges:    76,158 → 76,055  (-103, all dangling chargeprofiles-strUseCase noise gone)
  rules:    94 → 79          (-15: 1 from strUseCase suppression, 14 from de-dup)

Audit findings deferred to FUTURE slices (see todo list at session end):
- `conditions_simple/` is structurally an array-of-tuples (single top-level entry with an `aValues: [[strName, ...], ...]` array). 617 dangling `homeworlds.aConds*` edges resolve to entries inside this — needs a per-folder structural workaround.
- Phase 3: existence-aware extraction for dual-type targets (condtrigs, plus the conditions_simple multi-target case).
- Phase 4: nested object refs (DcFood's `aThresholds[*].strLootNew`).
- Phase 5: outgoing-ref schemas for tickers/shipspecs/lifeevents (data already loads; would derive rules for refs going OUT).

## 2026-05-03 — Slice E phase 2: encoded-array FieldShapes (aInverse, aLootItms, aStartingCondRules)

Three new FieldShapes for the encoded-array formats documented in `CodeDocs/iverifiable-ref-map.md`:

- `InverseArray` — split each element on `,`, take [0]. For `JsonInteraction.aInverse`. Trailing tokens (`[us]`, `[them]` role-swap markers) go on `Metadata.args`.
- `CondRuleAttachArray` — split each element on `=`, take [0] as ref. If [1] parses as a double, attach as `Metadata.fModifier`. For `JsonCondOwner.aStartingCondRules`.
- `LootItmsArray` — split each element on `,`. Verb at [0] (verbs: addus, addthem, removethem, take, use, lacks, input, give, removeus), loot name at [1], trailing booleans on `Metadata.args`. For `JsonInteraction.aLootItms`.

Three new RefKinds: `Inverse`, `CondRuleAttach`, `LootItm`. GraphExporter's WriteScalar now handles `string[]` so the `args` metadata serializes as a JSON array.

Schemas declare these via a new `x-shape` JSON Schema extension (explicit override; takes precedence over inferred shape and marker phrases). Example:

```json
"aLootItms": { "type": "array", "x-shape": "LootItmsArray", "description": "..." }
```

Tests: 61 → 66 (+5 covering each shape + a positive case for malformed-skip).

Real-data deltas vs phase 1:
  edges:    67,129 → 76,158  (+9,029)
  rules:    91 → 94 (+3)

Standout: `interactions.aInverse` alone produces 8,558 edges — the social-interaction reply chain was nearly invisible before. `condowners.aStartingCondRules` produces 471 edges (every Crew01 attachment), all carrying their `fModifier` value on Metadata. `interactions.aLootItms` produces 303 edges with verbs preserved.

## 2026-05-03 — Slice E phase 1: IVerifiable-map-driven schema expansion (direct-string fields)

Added the direct-string reference fields documented in `CodeDocs/iverifiable-ref-map.md` (extracted from the game's own `IVerifiable.GetVerifiables()`). No code change — pure schema additions.

- `condowners-schema.json`: + `aInteractions` (→ interactions, 2,257 edges), `aTickers` (→ tickers, 283), `strContainerCT` (→ condtrigs, 232).
- `interactions-schema.json`: + 12 new direct-string fields per IVerifiable: `CTTestRoom`, `LootVFXUs/Them`, `LootAudioUs/Them`, `LootAddFactionsUs/Them`, `LootAddCondRulesUs/Them`, `ShipTestUs/Them/3rd`. Plus `strPledgeAddThem` (clearly real per JsonInteraction.cs grep, 49 edges).
- `conditions-schema.json`: + `strAnti` (self-folder ref, 97 edges — antithetical condition removed when current is added).

Real-data deltas vs prior commit:
  edges:    63,829 → 67,129  (+3,300)
  rules:    74     → 91      (+17)

Phase 2 will tackle the encoded-array shapes (aLootItms verb encoding, aStartingCondRules `=fModifier` encoding, aInverse comma encoding) — those need new FieldShapes in the C# library.

## 2026-05-03 — Ghost-rule preservation in schemas

Per the user's "keep ghosts, document them in editor as ghosts" decision: instead of removing the 18 `JsonInteraction` and 5 `JsonPlot` schema fields that `07_decomp_schema_table.py` flagged as not-in-decomp, marked them with a JSON Schema `x-ghost: true` extension. The flag rides through `SchemaCatalog.FieldRule.IsGhost` → `GraphExporter` (graph.js v3 adds `isGhost` on rule entries) → site `#/schemas` and `#/schema/<folder>` views (rendered with a 👻 badge in italics + warn color, dim treatment skipped on ghost zero-edge rules).

Rationale: ghost fields might be referenced in older docs, used by mods, or restored by future game updates — modders editing JSON benefit from "I see this field name documented but the game won't read it." Each ghost description starts with `[GHOST: ...]` so even tooltip-style views surface the status without the `x-ghost` machinery.

Also: `strPledgeRemove`, which I had added in the Slice A interactions overlay on (incorrect) wiki authority, was downgraded to ghost — the decomp showed `JsonInteraction` only deserializes `strPledgeAdd`/`strPledgeAddThem`, with no removal counterpart. Net: rules grew 62 → 74 (+12 ghosts; 5 are non-string-shaped so don't manifest as rules); edge count unchanged at 63,829.

graph.js schema bumped 2 → 3. Tests 60 → 61 (one new round-trip test).

## 2026-05-02 — Decomp cross-check script + dev infrastructure

Added `utils/python/decomp_schema_crosscheck.py`, a Python audit tool that diffs the decompiled C# `Json*.cs` classes in `decomp/Assembly-CSharp/` against our JSON schemas in `data/schemas/` and `comment_mod/data/schemas/`. It reports three things per matched pair: fields present in C# but absent from the schema (coverage gaps), fields in the schema but absent from C# (possible errors or legacy docs), and unmatched classes/schemas that have no mapping yet.

The decomp folder (`decomp/Assembly-CSharp/`) contains 126 `Json*.cs` files that are the authoritative source of truth for which fields the game actually deserializes — they are the ground truth the schemas should reflect. 12 of those classes map directly to folders we already have schemas for.

Also: created this file, updated CLAUDE.md with the dev-log commit rule and a note that the game uses LitJson for JSON deserialization (affects field naming conventions and edge case parsing behavior).
