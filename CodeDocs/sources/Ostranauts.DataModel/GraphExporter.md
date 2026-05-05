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

Schema v6 is v5 + first-class **code-side nodes** (PLAN-AST Phase 1). Synthetic `code-method` / `code-class` DataObjects (built by the Builder from `DecompIndexer`) flow through `ObjectIndex` and serialize alongside data nodes. Two new edge `kind` values appear in `edges[]`: `LiteralInMethod` and `LiteralInClass`, both with `metadata { line, text }`.

Writes a PAIR of files: `graph.js` (the path passed in) plus a sibling `properties.js` in the same directory. The graph file is graph-only (nodes + edges + rules); per-node scalar fields move to `properties.js` under `window.NODE_PROPS`. See `CodeDocs/io/outputs.md` for the full v6 spec.

See `CodeDocs/io/outputs.md` for the canonical spec. Briefly: `$schema_version`, `generated_by`, `object_count`, `reference_count`, `nodes[]` (id/folder/strName/file), `edges[]` (source/target/kind/sourceField/optional metadata).

Edge `metadata` is serialized as a JSON object with keys preserved as-is. Scalar values are dispatched per type (string, bool, numeric); unknown types fall back to `ToString()`.

## Depends on

- `ObjectIndex`, `Reference`, `DataObject`.
- `System.Text.Json` (`Utf8JsonWriter`), `System.Text.Encoding.UTF8` (for the JS prefix/suffix).

## Used by

- `Program.Main` — final step of the build pipeline.
