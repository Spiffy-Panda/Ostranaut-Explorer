# ObjectIndex.cs

**Path:** `src/Ostranauts.DataModel/ObjectIndex.cs`
**Status:** real

## Purpose

Forward + reverse index over `DataObject`s and `Reference`s. The site reads via `GraphExporter`; the future LSP reads in-process. Holds the dangling-ref scan and the duplicate-strName scan used on the future health page.

**Last-wins on duplicates.** Real game data has duplicate `(folder, strName)` keys: a small number are intentional content-pack overrides (e.g. `condtrigs_mining.json` extends `condtrigs.json`), several are within-file accidental duplicates that look like data bugs. The constructor picks the last-defined entry as canonical (matches game load-order semantics) and reports each duplicate via `onWarning`. Full duplicate history is preserved in `Duplicates` for surfacing on the health page.

## Public API

```csharp
public sealed class ObjectIndex
{
    public ObjectIndex(
        IEnumerable<DataObject> objects,
        IEnumerable<Reference> references,
        Action<string>? onWarning = null);

    public IReadOnlyList<DataObject> Objects { get; }
    public IReadOnlyList<Reference> References { get; }

    // Keys that appeared more than once. Lists are in load order; last entry is canonical.
    public IReadOnlyDictionary<(string folder, string name), List<DataObject>> Duplicates { get; }

    public DataObject? Get(string folder, string name);
    public IEnumerable<Reference> Outgoing(string folder, string name);
    public IEnumerable<Reference> Incoming(string folder, string name);

    // Edges whose target isn't in the index — surfaced on the future health page.
    public IEnumerable<Reference> DanglingReferences();
}
```

Construction is O(N + M); `Outgoing`/`Incoming`/`Get` are O(1) per call.

## Depends on

- `DataObject`, `Reference`.

## Used by

- `Program.Main` — wraps loaded objects + references; forwards warnings to stderr.
- `GraphExporter` — reads `Objects` and `References` to serialize.
