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

### Schema version 2 (current)

Adds a top-level `rules` array describing every `SchemaCatalog.FieldRule` the Builder loaded. Powers the schema inspector page (`#/schemas`). Otherwise compatible with v1.

```jsonc
{
  "$schema_version": 2,
  "generated_by": "Ostranauts.Site.Builder",
  "object_count": <int>,
  "reference_count": <int>,
  "nodes": [ /* same as v1 */ ],
  "edges": [ /* same as v1 */ ],
  "rules": [                                             // NEW in v2
    {
      "sourceFolder": "<folder>",                        // e.g. "condowners"
      "fieldName": "<field>",                            // e.g. "strItemDef"
      "targetFolder": "<folder>",                        // e.g. "items"
      "shape": "Direct" | "StringArray" | "CondStringArray"
    },
    ...
  ]
}
```

Bump `$schema_version` whenever the structure changes incompatibly. The site's `app.js` reads `$schema_version` and refuses to render on mismatch.

Real-data size today: **~17 MB** for ~29k nodes + ~61k edges + 40 rules. The JS wrapper adds ~22 bytes. Static-fetch territory; sharding decision deferred until well past comfortable browser memory.

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
