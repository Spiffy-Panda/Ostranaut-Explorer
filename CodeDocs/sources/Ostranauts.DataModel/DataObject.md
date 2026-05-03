# DataObject.cs

**Path:** `src/Ostranauts.DataModel/DataObject.cs`
**Status:** real

## Purpose

Represents one parsed entry from a `data/<folder>/*.json` array. Identified by the (`Folder`, `StrName`) tuple, but note that this tuple is **not** globally unique in real game data — see `ObjectIndex` for last-wins handling of duplicates.

`Fields` holds the parsed `JsonElement` (cloned from its source `JsonDocument` so it survives independently). Lets `ReferenceExtractor` walk fields without re-parsing.

## Public API

```csharp
public sealed record DataObject(
    string Folder,
    string FilePath,
    string StrName,
    JsonElement Fields);
```

## Depends on

- `System.Text.Json` (for `JsonElement`).

## Used by

- `DataLoader` (produces these).
- `ReferenceExtractor` (consumes these — will walk `Fields`).
- `ObjectIndex` (stores and indexes these).
- `GraphExporter` (reads `Folder`, `StrName`, `FilePath` for node serialization).
