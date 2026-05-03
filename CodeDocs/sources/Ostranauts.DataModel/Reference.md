# Reference.cs

**Path:** `src/Ostranauts.DataModel/Reference.cs`
**Status:** real

## Purpose

One typed edge in the reference graph: source object → target object, plus the kind of reference and any kind-specific metadata. Metadata stays on the edge so consumers (the site, future LSP) don't have to re-parse the source field — particularly important for condition refs that carry value + duration.

## Public API

```csharp
public enum RefKind
{
    Direct,         // plain string field, e.g. strItemDef
    DirectInArray,  // element of a string-array field, e.g. aInteractions[i]
    Condition,      // embedded condition string e.g. "IsSystem=1.0x1"
}

public sealed record Reference(
    string SourceFolder,
    string SourceName,
    string SourceField,
    string TargetFolder,
    string TargetName,
    RefKind Kind,
    IReadOnlyDictionary<string, object>? Metadata = null);
```

For `RefKind.Condition`, `Metadata` is expected to contain `"value"` (double) and `"duration"` (int) keys.

## Depends on

- Nothing beyond the BCL.

## Used by

- `ReferenceExtractor` (produces these).
- `ObjectIndex` (stores and indexes these by both endpoints).
- `GraphExporter` (serializes them as edges in `graph.js`).
