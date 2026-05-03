# outputs.md — files this project writes

The Builder produces a small set of artifacts under `build/`. The static site files (`index.html`, `app.js`, `style.css`) are documented by themselves; this file covers everything generated.

## `build/data/graph.js`

The single payload the static site loads. **Format: JS-wrapped JSON.** The literal text `window.GRAPH_DATA = ` is prepended to a JSON object, and `;\n` is appended:

```js
window.GRAPH_DATA = {
  "$schema_version": 1,
  ...
};
```

### Why JS-wrapped, not plain `.json`

Browsers (Firefox, Chrome) block `fetch()` against `file://` URLs by default for security. That makes a plain `data/graph.json` unloadable from the site when `index.html` is opened directly from disk — which is the most common local-dev workflow. Loading via `<script src="data/graph.js">` works under both `file://` and HTTP, so the same site assets serve both local browsing and a GitHub Pages deploy with no behavior change.

The bytes between `window.GRAPH_DATA = ` and `;` are still valid JSON, so non-browser consumers (a future LSP, mod editor, or CI script) can extract the payload by skipping the prefix and trimming the trailing `;\n`.

### Schema version 5 (current) — split-payload layout

Per-node `fields` are now in a sibling file (`properties.js`) instead of inlined on each node. The graph file stays graph-only (nodes + edges + rules); the site loads both. Three files now sit under `build/data/`:

| File | Global set | Required? | What's in it |
|---|---|---|---|
| `graph.js` | `window.GRAPH_DATA` | yes | nodes, edges, rules — exactly v3's shape |
| `properties.js` | `window.NODE_PROPS` | optional (Builder always emits it; site degrades to empty Fields blocks if missing) | `{ "<folder>:<strName>": { fieldName: scalarValue, ... } }` for nodes that have any scalar fields |
| `code_refs.js` | `window.CODE_REFS` | optional (only generated when `decomp/` is present + `10_emit_code_refs.py` is run) | `{ "<strName>": [ {file, line, text}, ... ] }` — hardcoded `"<strName>"` quoted-literal hits in `decomp/` C# source |
| `ref_candidates.js` | `window.REF_CANDIDATES` | optional (Builder always emits it; site degrades — auto-detected links + coverage page hidden if missing) | Per `(sourceFolder, fieldPath)` candidate refs found by `RefCandidateDetector` — see `CandidateExporter.md` for full schema |

graph.js's payload shape is unchanged from v4 except `nodes[*].fields` is removed. Per-rule `description` still lives on rules. Site checks `$schema_version === 5` and refuses to render on mismatch.

Real-data sizes (Comment Mod overlay applied, decomp populated):
- `graph.js`: ~23 MB (was ~32 MB in v4)
- `properties.js`: ~9.3 MB
- `code_refs.js`: ~658 KB (1,321 strNames have at least one code reference; 3,309 total occurrences)
- `ref_candidates.js`: ~84 KB (240 candidates, 184 uncovered)

### Schema version 4 (historical)

Inlined per-node `fields` on every node + per-rule `description`. Replaced by the split layout in v5.

### Schema version 3 (historical)

Same shape as v2, with one additive field on rule entries:

- `isGhost` (boolean, optional, omitted when false): marks rules whose field is documented in the schema but **not deserialized by the game's `Json*.cs` class** per `utils/python/decomp_schema_table.py`. Ghost rules still emit edges if real data contains the field (rare); the flag is a visual marker for the site's schema inspector and a hint to modders that the field may be vestigial.

### Schema version 2 (historical)

Adds a top-level `rules` array describing every `SchemaCatalog.FieldRule` the Builder loaded. Powers the schema inspector page (`#/schemas`). Otherwise compatible with v1.

```jsonc
{
  "$schema_version": 2,
  "generated_by": "Ostranauts.Site.Builder",
  "object_count": <int>,
  "reference_count": <int>,
  "nodes": [ /* same as v1 */ ],
  "edges": [
    // unchanged shape, but `kind` and `metadata` carry new values:
    {
      "source":      "<folder>:<strName>",
      "target":      "<folder>:<strName>",
      "kind":        "Direct" | "DirectInArray" | "Condition" | "Loot"
                   | "Inverse" | "CondRuleAttach" | "LootItm",
      "sourceField": "<field name>",
      "metadata": /* one of: */
        { "value": <number>, "duration": <int> }                                  // Condition
      | { "chance": <number>, "min": <number>, "max": <number>, "positive": <bool> }  // Loot
      | { "args": [<string>, ...] }                                               // Inverse (when extra tokens)
      | { "fModifier": <number> }                                                 // CondRuleAttach (when "=value")
      | { "verb": <string>, "args"?: [<string>, ...] }                            // LootItm
    },
    ...
  ],
  "rules": [
    {
      "sourceFolder": "<folder>",                        // e.g. "condowners"
      "fieldName":    "<field>",                         // e.g. "strItemDef"
      "targetFolder": "<folder>",                        // e.g. "items"
      "shape":        "Direct" | "StringArray" | "CondStringArray" | "LootEntryArray"
    },
    ...
  ]
}
```

Bump `$schema_version` whenever the structure changes incompatibly. The site's `app.js` reads `$schema_version` and refuses to render on mismatch.

Real-data size today: **~19 MB** for ~31k nodes + ~64k edges + 62 rules (Slice A + B applied). The JS wrapper adds ~22 bytes. Static-fetch territory; sharding decision deferred until well past comfortable browser memory.

### Schema version 1 (historical)

Same as v2 but without the `rules` array. Replaced when the schema inspector landed.

### Sharding (future)

If `graph.js` grows past comfortable browser memory, split per source folder: `build/data/graph.js` becomes a manifest, each folder gets `build/data/<folder>.js`. Each shard would still use the `window.GRAPH_DATA_<folder> = ...;` wrapper or merge into a single global on load. Decision deferred until needed.

### Schema version 0 (historical — pre-v1 scaffold)

Empty-payload version emitted as plain `graph.json`: only `$schema_version` (0), `generated_by`, `object_count` (0), `reference_count` (0), and empty `nodes`/`edges`. Replaced when `DataLoader` went live; format then changed to JS-wrapped JSON when the site needed `file://` compatibility.

## `build/index.html`, `build/app.js`, `build/style.css`

Copied verbatim from `src/Ostranauts.Site/`. No transformation. Self-explanatory; not documented further here.

## Future outputs

- **Per-object detail JSON** — possibly `build/data/objects/<folder>/<strName>.js` (also JS-wrapped if browser-loaded, JSON if API-served), if we want lazy-loading rather than shipping everything in `graph.js`.
- **Sitemap / search index** — if search grows beyond client-side scan of the node list.
- **AI-generated descriptions** (late v1, see PROJECT-PITCH.md) — `build/data/descriptions/<folder>/<strName>.json` cached per object.

When any of these land, add a section to this file.
