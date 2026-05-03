# SchemaLoader.cs

**Path:** `src/Ostranauts.DataModel/SchemaLoader.cs`
**Status:** real

## Purpose

Reads `data/schemas/*-schema.json` and derives `SchemaCatalog.FieldRule`s by regex-matching reference phrases in field descriptions (e.g. *"reffers to entry within items.json"*, *"Found in lights.json"*). Strict schema-driven: no description, no rule. Coverage grows by improving the schemas themselves, not by adding hand-curated rules.

Real-data run against base game schemas (5 files: conditions, condowners, interactions, items, plot) produces ~26 rules.

## Public API

```csharp
public static class SchemaLoader
{
    // Single dir.
    public static SchemaCatalog Load(string schemaDir, Action<string>? onWarning = null);

    // Multi-dir overlay — concatenates rules from each dir in order. The returned
    // SchemaCatalog resolves (sourceFolder, fieldName) collisions with last-wins,
    // so later dirs (e.g. comment_mod/data/schemas) override earlier ones.
    public static SchemaCatalog Load(IEnumerable<string> schemaDirs, Action<string>? onWarning = null);
}
```

If `schemaDir` doesn't exist: warns once, returns `SchemaCatalog.Empty` (does not throw — schemas are optional input). Per-file parse errors warn and continue.

## Rule derivation

For each file `<folder>-schema.json`, source folder = `<folder>` (e.g. `items-schema.json` → `items`). Walks `items.properties.<field>` for each schema. A rule is emitted only when:

1. The field has a `description` string property.
2. The field's JSON `type` accepts strings — `string`, `array`, `["string", "null"]`, `["array", "null"]`. Numeric/boolean/object types are skipped *even if* their description happens to mention an `X.json`.
3. The description matches one of the reference patterns below; the captured group is the target folder.

`FieldShape` is `Direct` for string-shaped fields, `StringArray` for array-shaped fields. A `StringArray` rule is **promoted to `CondStringArray`** when the field's description matches the marker phrase `\bcondition\s+string\b` (case-insensitive) — that's how schema authors declare the field carries the cond-string DSL (`Name=value xduration`) rather than plain strings.

## Description patterns (ordered, first match wins)

1. `(?:refers?|reffers?) to entr(y|ies) (in|within) (\w+)\.json` — handles base-game "reffers" typo
2. `(?:found|located) in (\w+)\.json`
3. `from (\w+)\.json`
4. `entr(y|ies) (in|from|within) (\w+)\.json`
5. `(\w+)\.json entry`
6. `(?:check|see) (\w+)\.json`
7. `(?:in|within) (\w+)\.json` — broad fallback, last so specifics win

When a description names two files (e.g. `"loot.json or loot_self_reference.json"`), the first match wins — captures the canonical folder.

## Depends on

- `System.Text.Json`, `System.Text.RegularExpressions`.
- `SchemaCatalog`.

## Used by

- `Program.Main` — `SchemaLoader.Load(Path.Combine(dataRoot, "schemas"), warning => ...)`.
- `SchemaLoaderTests` — fixture at `tests/.../fixtures/data_tiny/schemas/condowners-schema.json`.
