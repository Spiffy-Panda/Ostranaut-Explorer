# GraphExporter.cs

**Path:** `src/Ostranauts.DataModel/GraphExporter.cs`
**Status:** real (schema v1 — full node + edge serialization)

## Purpose

Serializes an `ObjectIndex` to the JSON shape the static site reads (`graph.json`). Schema version is recorded as `$schema_version` in the file; bump on incompatible changes and update `CodeDocs/io/outputs.md` in lockstep.

## Public API

```csharp
public static class GraphExporter
{
    public static void WriteJson(ObjectIndex index, string outPath);
}
```

Creates parent directories if missing. Always overwrites. Streams via `Utf8JsonWriter` to avoid building the entire string in memory (the real graph.json is several MB).

## Output shape — schema version 1

See `CodeDocs/io/outputs.md` for the canonical spec. Briefly: `$schema_version`, `generated_by`, `object_count`, `reference_count`, `nodes[]` (id/folder/strName/file), `edges[]` (source/target/kind/sourceField/optional metadata).

Edge `metadata` is serialized as a JSON object with keys preserved as-is. Scalar values are dispatched per type (string, bool, numeric); unknown types fall back to `ToString()`.

## Depends on

- `ObjectIndex`, `Reference`, `DataObject`.
- `System.Text.Json` (`Utf8JsonWriter`).

## Used by

- `Program.Main` — final step of the build pipeline.
