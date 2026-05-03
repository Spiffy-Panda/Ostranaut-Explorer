# DataLoader.cs

**Path:** `src/Ostranauts.DataModel/DataLoader.cs`
**Status:** real

## Purpose

Walks `dataRoot`, parses each `data/<folder>/*.json` file as a JSON array, and yields one `DataObject` per array entry. Streams (yield) so the entire data tree never has to sit in memory at once. Verified against base game `data/`: ~29k objects, ~5.4 MB of JSON parsed in seconds.

## Public API

```csharp
public static class DataLoader
{
    // Single root.
    public static IEnumerable<DataObject> Load(
        string dataRoot,
        Action<string>? onWarning = null);

    // Multi-root overlay — chains the single-root version over each in order.
    // Collision handling is downstream in ObjectIndex (last-wins).
    public static IEnumerable<DataObject> Load(
        IEnumerable<string> dataRoots,
        Action<string>? onWarning = null);
}
```

Throws `DirectoryNotFoundException` if `dataRoot` doesn't exist. Everything else (parse errors, non-array roots, entries missing `strName`) is reported via `onWarning` and skipped — never throws mid-stream.

## Subdirectory traversal

Walks each in-scope folder with `SearchOption.AllDirectories` so nested subtrees like `data/interactions/plotIAs/` are picked up. The base game has ~10–15 nested `*.json` files across `interactions/`, `archived_content/`, `attackmodes/`, `blueprints/`, `market/`, `racing/` — all previously invisible when this used `TopDirectoryOnly`.

## Folder filter

Hardcoded skip list in `SkippedFolders`:

- `schemas/` — `SchemaLoader`'s job, not a data folder.
- `strings/`, `tsv/`, `ai_training/` — non-JSON-array shapes per the v1 scope decision.

Any other top-level folder is in scope. The decision was deliberately not driven by an allowlist — the data tree is allowed to grow.

## Parser options

- `AllowTrailingCommas = true` — game data uses trailing commas in places.
- `CommentHandling = JsonCommentHandling.Skip` — defensive; current data doesn't use comments but base-game JSON files in other Unity titles often do.

## Per-entry handling

- Element must be a JSON object (non-objects in the array — strings, etc. — are silently skipped).
- Element must have a `strName` string property; otherwise warn and skip.
- `JsonElement.Clone()` detaches the field tree from the soon-to-be-disposed `JsonDocument` so the yielded `DataObject` is safe to use after the loader moves on.

## Depends on

- `System.Text.Json` for parsing.
- `DataObject`.

## Used by

- `Program.Main` — `DataLoader.Load(dataRoot, ...).ToList()`.
- `DataLoaderTests` — fixture tree at `tests/.../fixtures/data_tiny/`.
