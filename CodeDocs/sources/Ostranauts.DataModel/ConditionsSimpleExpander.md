# ConditionsSimpleExpander.cs

**Path:** `src/Ostranauts.DataModel/ConditionsSimpleExpander.cs`
**Status:** real

## Purpose

`conditions_simple/` is the only folder in the data tree that doesn't follow "array of objects, each with strName". Its single file (`conditions_simple.json`) contains a wrapper object whose `aValues` array is a FLAT sequence of values — every 7 elements is one logical record:

```
[ strName, strNameFriendly, strDesc, nDisplaySelf, nDisplayOther, strColor, bInvert ]
```

This expander synthesizes one `DataObject` per 7-tuple so the rest of the pipeline (extractor, index, exporter) sees these as ordinary entries. Resolves the ~617 previously-dangling `homeworlds.aCondsCitizen` / `aCondsResident` / `aCondsIllegal` edges that target conditions_simple/ — those rules already declare `x-targets: ["conditions_simple", "conditions"]` (existence-aware fallback from Slice E phase 3), they just had no synthetic entries to land on.

## Public API

```csharp
public static class ConditionsSimpleExpander
{
    public const string Folder = "conditions_simple";

    public static IEnumerable<DataObject> Expand(
        IEnumerable<DataObject> objects,
        Action<string>? onWarning = null);
}
```

Wrapper objects (the parent "Simple Conditions" entry) are NOT yielded — they remain in the input via `DataLoader`'s output. Caller appends `Expand`'s yield to its existing list.

## Behavior

- Walks every object whose `Folder == "conditions_simple"`.
- For each, checks `Fields.aValues` is an array.
- For every aligned 7-tuple within the array, builds a synthetic `DataObject`:
  - `Folder` = `"conditions_simple"`
  - `FilePath` = parent's path
  - `StrName` = tuple[0]
  - `Fields` = a `JsonElement` representing `{strName, strNameFriendly, strDesc, nDisplaySelf, nDisplayOther, strColor, bInvert}` built via `JsonDocument.Parse` and cloned.
- Warns and skips when:
  - tuple[0] is non-string or empty.
  - `aValues.Count` isn't a multiple of 7 (trailing partial tuple).

## Real-data delta

With expansion enabled in `Program`: objects rise from ~31,150 → ~32,540 (+1,390 synthetics). Reference count is unchanged (the existing fallback rules just route to a now-existent target). Drops the dangling-rate of homeworlds aConds* fields significantly.

## Depends on

- `DataObject`.
- `System.Text.Json` (`JsonDocument` for synthesis).

## Used by

- `Program.Main` — invoked after `DataLoader`, before `ReferenceExtractor`.
- `ConditionsSimpleExpanderTests` — 5 unit tests covering single tuple, multiple tuples, non-target folder, partial tuple warning, non-string strName warning.
