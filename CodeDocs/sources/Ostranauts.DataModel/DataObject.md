# DataObject.cs

**Path:** `src/Ostranauts.DataModel/DataObject.cs`
**Status:** real

## Purpose

Represents one parsed entry from a `data/<folder>/*.json` array. Identified globally by the (`Folder`, `StrName`) tuple — both required to look an object up in `ObjectIndex` because the same `strName` can appear in different folders (rare but valid).

`RawJson` carries the original entry as a string for now. When `DataLoader` is implemented for real, this likely becomes a parsed `JsonElement` or similar — the field name will change at that point and this overview must be re-synced.

## Public API

```csharp
public sealed record DataObject(
    string Folder,
    string FilePath,
    string StrName,
    string RawJson);
```

## Depends on

- Nothing beyond the BCL.

## Used by

- `DataLoader` (produces these).
- `ReferenceExtractor` (consumes these).
- `ObjectIndex` (stores and indexes these).
