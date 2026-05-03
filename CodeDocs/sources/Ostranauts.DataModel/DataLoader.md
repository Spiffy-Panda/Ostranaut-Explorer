# DataLoader.cs

**Path:** `src/Ostranauts.DataModel/DataLoader.cs`
**Status:** **stubbed (v1 work)** — currently returns `Enumerable.Empty<DataObject>()`.

## Purpose

Walks a data root, parses each `data/<folder>/*.json` file as a JSON array, and yields one `DataObject` per array entry. The folder name comes from the directory; `StrName` is read from the entry's `"strName"` property.

## Public API

```csharp
public static class DataLoader
{
    public static IEnumerable<DataObject> Load(string dataRoot);
}
```

Streams (yield-style) so the index can be built without holding every parsed file at once.

## Implementation plan (v1)

1. Enumerate immediate subdirectories of `dataRoot`.
2. **Skip** non-JSON folders per the v1 scope decision: anything that isn't a folder of JSON arrays. Known exclusions: `tsv/`, `strings/`, `ai_training/`, `DebugSocialAudit.csv`. Also skip `schemas/` here — that's `SchemaLoader`'s job.
3. For each remaining folder, glob `*.json` and parse each as a JSON array.
4. For each element of the array, read `strName` and yield a `DataObject(folder, filePath, strName, rawJson)`.
5. Entries missing `strName` should be skipped with a warning (defer to logging design later); some `strName` values are `[us]`-style placeholders and should still be included as objects (they're real condowner entries).

## Depends on

- `DataObject`.
- (Future) JSON parser. Same decision as `SchemaLoader`.

## Used by

- `Program.Main` — `DataLoader.Load(dataRoot).ToList()`.
