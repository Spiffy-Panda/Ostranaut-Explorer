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
    public static void WriteJson(ObjectIndex index, string outPath);
}
```

Despite the method name, callers pass a `.js` path (e.g. `build/data/graph.js`). Creates parent directories if missing. Always overwrites. Streams via `Utf8JsonWriter` to avoid building the entire payload in memory (the real file is ~7 MB).

## Output shape — schema version 1

See `CodeDocs/io/outputs.md` for the canonical spec. Briefly: `$schema_version`, `generated_by`, `object_count`, `reference_count`, `nodes[]` (id/folder/strName/file), `edges[]` (source/target/kind/sourceField/optional metadata).

Edge `metadata` is serialized as a JSON object with keys preserved as-is. Scalar values are dispatched per type (string, bool, numeric); unknown types fall back to `ToString()`.

## Depends on

- `ObjectIndex`, `Reference`, `DataObject`.
- `System.Text.Json` (`Utf8JsonWriter`), `System.Text.Encoding.UTF8` (for the JS prefix/suffix).

## Used by

- `Program.Main` — final step of the build pipeline.
