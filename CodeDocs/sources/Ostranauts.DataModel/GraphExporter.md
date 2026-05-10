# GraphExporter.cs

**Path:** `src/Ostranauts.DataModel/GraphExporter.cs`
**Status:** real (schema v1 — full node + edge serialization)

## Purpose

Serializes an `ObjectIndex` to the file the static site reads. Schema version is recorded as `$schema_version` in the payload; bump on incompatible changes and update `CodeDocs/io/outputs.md` in lockstep.

The output is **JS-wrapped JSON**: literal text `window.GRAPH_DATA = ` followed by the JSON payload, followed by `;\n`. The reason: browsers block `fetch()` against `file://` URLs, so the static site can't read a plain `.json` from disk without a local server. Loading via `<script src="graph.js">` works on `file://` and on HTTP equally well. The bytes between the assignment and the trailing `;` are still valid JSON, so non-browser consumers can extract the payload by skipping the prefix and trailing semicolon.

## Public API

```csharp
public static class GraphExporter
{
    // catalog is optional; when provided, its rules are serialized into the
    // graph.js "rules" array (v2 schema). Without it, "rules" is omitted
    // and the file remains v1-shape but still tagged $schema_version=2.
    public static void WriteJson(ObjectIndex index, string outPath, SchemaCatalog? catalog = null);
}
```

Despite the method name, callers pass a `.js` path (e.g. `build/data/graph.js`). Creates parent directories if missing. Always overwrites. Streams via `Utf8JsonWriter` to avoid building the entire payload in memory (the real file is ~17 MB at present).

## Output shape — schema version 6

Schema v6 is v5 + first-class **code-side nodes** (PLAN-AST Phase 1 + 2). Synthetic `code-method` / `code-class` (Phase 1) and `code-component` (Phase 2) DataObjects flow through `ObjectIndex` and serialize alongside data nodes. New edge `kind` values: `LiteralInMethod`, `LiteralInClass`, `WiresTo`, `ProducesCondition`, `ConsumesCondition`, `ObservesCondition`.

`code-component` nodes carry structured (`array` / `object`) values in `properties.js` for `inPorts` and `produces` — the `WritePropertiesFile` opt-in is gated on `Folder.StartsWith("code-")` so data-side nodes still skip arrays/objects (those are graph edges, not viewable scalars).

One narrow data-side exception: `items/` entries pass through their three socket arrays (`aSocketAdds`, `aSocketForbids`, `aSocketReqs`). They aren't graph edges — they describe the inventory-grid footprint — and the site needs them to render the socket-grid visualisation + derive the calculated `Num Rows` field. Gated on `Folder == "items"` and `IsItemSocketField(name)`; everything else still skips structured values on the data side.

Writes a PAIR of files: `graph.js` (the path passed in) plus a sibling `properties.js` in the same directory. The graph file is graph-only (nodes + edges + rules); per-node scalar fields move to `properties.js` under `window.NODE_PROPS`. See `CodeDocs/io/outputs.md` for the full v6 spec.

See `CodeDocs/io/outputs.md` for the canonical spec. Briefly: `$schema_version`, `generated_by`, `object_count`, `reference_count`, `nodes[]` (id/folder/strName/file), `edges[]` (source/target/kind/sourceField/optional metadata), `rules[]` (when a catalog is supplied), and — slice 3 / UX 1.3 — `fieldDescriptions: { "<folder>:<fieldName>": "..." }` carrying every schema description (incl. non-ref scalar fields). Schema version stays at 6; the new key is purely additive.

Edge `metadata` is serialized as a JSON object with keys preserved as-is. Scalar values are dispatched per type (string, bool, numeric); unknown types fall back to `ToString()`.

## Depends on

- `ObjectIndex`, `Reference`, `DataObject`.
- `System.Text.Json` (`Utf8JsonWriter`), `System.Text.Encoding.UTF8` (for the JS prefix/suffix).

## Used by

- `Program.Main` — final step of the build pipeline.
