# outputs.md — files this project writes

The Builder produces a small set of artifacts under `build/`. The static site files (`index.html`, `app.js`, `style.css`) are documented by themselves; this file covers everything generated.

## `build/data/graph.json`

The single payload the site frontend fetches. Schema is versioned via the `$schema_version` field.

### Schema version 0 (current — scaffold)

```jsonc
{
  "$schema_version": 0,                                  // bump on incompatible changes
  "generated_by": "Ostranauts.Site.Builder (scaffold)",  // free-text trace string
  "object_count": 0,                                     // index.Objects.Count
  "reference_count": 0,                                  // index.References.Count
  "nodes": [],                                           // empty in scaffold
  "edges": []                                            // empty in scaffold
}
```

Written by `GraphExporter.WriteJson` via manual `StringBuilder`. Always overwrites; parent dirs are created if missing.

### Schema version 1 (planned — full payload)

When `DataLoader` + `ReferenceExtractor` go live, `nodes` and `edges` populate:

```jsonc
{
  "$schema_version": 1,
  "generated_by": "Ostranauts.Site.Builder",
  "object_count": <int>,
  "reference_count": <int>,
  "nodes": [
    {
      "id": "<folder>:<strName>",   // composite key; matches edge endpoints
      "folder": "<folder>",          // e.g. "condowners"
      "strName": "<strName>",        // e.g. "ItmGalleyCoffeemaker01"
      "file": "<file path>"          // e.g. "data/condowners/condowners.json"
    },
    ...
  ],
  "edges": [
    {
      "source": "<folder>:<strName>",
      "target": "<folder>:<strName>",
      "kind": "Direct" | "DirectInArray" | "Condition",
      "sourceField": "<field name>",
      "metadata": { "value": <number>, "duration": <int> }   // present for Condition kind only
    },
    ...
  ]
}
```

Bump `$schema_version` whenever the structure changes incompatibly. The site's `app.js` reads `$schema_version` and can refuse / warn on mismatch.

### Sharding (future)

If `graph.json` grows past comfortable browser memory, split per source folder: `build/data/graph.json` becomes a manifest, each folder gets `build/data/<folder>.json`. Decision deferred until the file exceeds a few MB.

## `build/index.html`, `build/app.js`, `build/style.css`

Copied verbatim from `src/Ostranauts.Site/`. No transformation. Self-explanatory; not documented further here.

## Future outputs

- **Per-object detail JSON** — possibly `build/data/objects/<folder>/<strName>.json`, if we want lazy-loading rather than shipping everything in `graph.json`.
- **Sitemap / search index** — if search grows beyond client-side scan of the node list.

When either lands, add a section to this file.
