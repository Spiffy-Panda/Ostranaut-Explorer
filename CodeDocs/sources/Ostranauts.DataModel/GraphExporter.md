# GraphExporter.cs

**Path:** `src/Ostranauts.DataModel/GraphExporter.cs`
**Status:** **scaffold real** — emits a valid but skeletal `graph.json` that omits node/edge contents. Will grow when the loaders go live.

## Purpose

Serializes an `ObjectIndex` to the JSON shape the static site reads (`graph.json`). The output schema is tracked as `$schema_version` in the file itself; bump it when the structure changes incompatibly.

## Public API

```csharp
public static class GraphExporter
{
    public static void WriteJson(ObjectIndex index, string outPath);
}
```

Creates parent directories if missing. Always overwrites.

## Current output shape (schema_version 0)

See `CodeDocs/io/outputs.md` for the canonical spec. Briefly: a JSON object with `$schema_version`, `generated_by`, `object_count`, `reference_count`, `nodes` (currently empty), `edges` (currently empty).

## Implementation plan (v1)

When `DataLoader` + `ReferenceExtractor` go live, populate `nodes` and `edges`:
- `nodes`: `{ id: "<folder>:<strName>", folder, strName, file }`.
- `edges`: `{ source: "<folder>:<strName>", target: "<folder>:<strName>", kind, sourceField, metadata? }`.

At that point bump `$schema_version` to 1 and update `outputs.md` in lockstep.

## Depends on

- `ObjectIndex`, `Reference`, `DataObject`.
- `System.Text` (`StringBuilder`). Will likely move to `System.Text.Json` for proper serialization once nodes/edges have content.

## Used by

- `Program.Main` — final step of the build pipeline.
