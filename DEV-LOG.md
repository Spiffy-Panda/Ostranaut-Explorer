# DEV-LOG

Reverse-chronological. Add an entry before every commit — at minimum a one-liner, ideally a short paragraph when the change is non-obvious. Tag with ISO date.

---

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

Added `scrap_scripts/python/06_decomp_schema_crosscheck.py`, a Python audit tool that diffs the decompiled C# `Json*.cs` classes in `decomp/Assembly-CSharp/` against our JSON schemas in `data/schemas/` and `comment_mod/data/schemas/`. It reports three things per matched pair: fields present in C# but absent from the schema (coverage gaps), fields in the schema but absent from C# (possible errors or legacy docs), and unmatched classes/schemas that have no mapping yet.

The decomp folder (`decomp/Assembly-CSharp/`) contains 126 `Json*.cs` files that are the authoritative source of truth for which fields the game actually deserializes — they are the ground truth the schemas should reflect. 12 of those classes map directly to folders we already have schemas for.

Also: created this file, updated CLAUDE.md with the dev-log commit rule and a note that the game uses LitJson for JSON deserialization (affects field naming conventions and edge case parsing behavior).
