# SchemaCatalog.cs

**Path:** `src/Ostranauts.DataModel/SchemaCatalog.cs`
**Status:** real

## Purpose

The result of reading `data/schemas/*-schema.json`. A flat collection of `FieldRule`s plus a fast (folder, fieldName) → rule lookup. Tells `ReferenceExtractor` which fields on objects from a given folder are cross-references and what folder their values point into.

`FieldShape` discriminates how the value should be walked: a single string (`Direct`), an array of strings (`StringArray`), or an array of condition-DSL strings (`CondStringArray`).

## Public API

```csharp
public sealed class SchemaCatalog
{
    public enum FieldShape
    {
        Direct,
        StringArray,
        CondStringArray,
    }

    public sealed record FieldRule(
        string SourceFolder,
        string FieldName,
        string TargetFolder,
        FieldShape Shape);

    // Tolerates duplicate (SourceFolder, FieldName) keys with last-wins semantics
    // — needed for the Comment Mod overlay where the same field gets re-declared.
    public SchemaCatalog(IEnumerable<FieldRule> rules);

    public IReadOnlyList<FieldRule> Rules { get; }    // includes duplicates in load order
    public FieldRule? RuleFor(string folder, string field);  // returns the last-wins entry
    public static SchemaCatalog Empty { get; }
}
```

## Depends on

- BCL only.

## Used by

- `SchemaLoader` (produces these).
- `ReferenceExtractor` (consults `RuleFor` per field).
- `Program` (passes the loaded catalog through the pipeline; logs `Rules.Count`).
