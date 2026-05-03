# ObjectIndex.cs

**Path:** `src/Ostranauts.DataModel/ObjectIndex.cs`
**Status:** real

## Purpose

Forward + reverse index over the parsed `DataObject`s and the `Reference`s extracted from them. The site reads from this via `GraphExporter`; the future LSP will read from it directly in-process. Holds the dangling-ref scan used on the health page.

## Public API

```csharp
public sealed class ObjectIndex
{
    public ObjectIndex(IEnumerable<DataObject> objects, IEnumerable<Reference> references);

    public IReadOnlyList<DataObject> Objects { get; }
    public IReadOnlyList<Reference> References { get; }

    public DataObject? Get(string folder, string name);
    public IEnumerable<Reference> Outgoing(string folder, string name);
    public IEnumerable<Reference> Incoming(string folder, string name);

    // Edges whose target isn't in the index — surfaced on the future health page.
    public IEnumerable<Reference> DanglingReferences();
}
```

The constructor materializes both collections once (stores as `List<>`) and builds the lookup maps eagerly. `Outgoing`/`Incoming` are O(1) per call after construction.

## Depends on

- `DataObject`, `Reference`.

## Used by

- `Program.Main` — wraps the loaded objects and references.
- `GraphExporter` — reads `Objects` and `References` to serialize.
