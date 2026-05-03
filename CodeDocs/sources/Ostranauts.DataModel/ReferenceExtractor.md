# ReferenceExtractor.cs

**Path:** `src/Ostranauts.DataModel/ReferenceExtractor.cs`
**Status:** **stubbed (v1 work)** — currently returns `Enumerable.Empty<Reference>()`.

## Purpose

Given a `DataObject` and the `SchemaCatalog`, walks the object's fields and emits one `Reference` per outgoing cross-reference. Dispatches per `FieldShape` so condition-string fields, plain string fields, and string-array fields are each handled correctly.

## Public API

```csharp
public static class ReferenceExtractor
{
    public static IEnumerable<Reference> Extract(DataObject obj, SchemaCatalog catalog);
}
```

## Implementation plan (v1)

1. Parse `obj.RawJson` (or use the parsed shape once `DataObject` is updated).
2. For each top-level field `(name, value)` on the object, look up `catalog.RuleFor(obj.Folder, name)`. If null, skip.
3. Dispatch by `rule.Shape`:
   - **Direct** — `value` is a string. Skip if it matches the placeholder regex `\[\w+\]`. Otherwise emit one `Reference` with `Kind=Direct`.
   - **StringArray** — for each string element, same as Direct but `Kind=DirectInArray`.
   - **CondStringArray** — for each element, parse via `CondStringParser.TryParse`. If non-null and the name isn't a placeholder, emit `Reference` with `Kind=Condition` and `Metadata={"value": cs.Value, "duration": cs.Duration}`.

## Depends on

- `DataObject`, `Reference`, `SchemaCatalog`, `CondStringParser`.

## Used by

- `Program.Main` — `objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog))`.
