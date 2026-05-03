# SchemaLoader.cs

**Path:** `src/Ostranauts.DataModel/SchemaLoader.cs`
**Status:** **stubbed (v1 work)** — currently returns `SchemaCatalog.Empty`.

## Purpose

Reads `data/schemas/*-schema.json`, parses the field descriptions, and derives `FieldRule`s by regex-matching phrases like *"refers to entry within items.json"*, *"Found in lights.json"*. The resulting `SchemaCatalog` is the source of truth for which fields are cross-references.

## Public API

```csharp
public static class SchemaLoader
{
    public static SchemaCatalog Load(string schemaDir);
}
```

`schemaDir` should be `<dataRoot>/schemas`. Returns `SchemaCatalog.Empty` until the v1 implementation lands.

## Implementation plan (v1)

1. Glob `schemaDir/*-schema.json`.
2. Each schema is a JSON Schema for an array of objects of one type. The array's element folder is named in the filename (`items-schema.json` → `items`).
3. Walk `properties.<field>.description`. Apply regex rules:
   - `refers to entry within (\w+)\.json` → `Direct` shape, target = match.
   - `Found in (\w+)\.json` → look at the field name; if it's `aFoo` → `StringArray`, else `Direct`.
   - Field names matching `aStartingConds`, `aCond*`, etc. → `CondStringArray`.
4. Yield one `FieldRule` per matched field.
5. Hand-curated overrides may be added later (per Q2: schema-driven, comments-only overrides).

## Depends on

- `SchemaCatalog`.
- (Future) JSON parser of choice — System.Text.Json is the leading candidate, may need a NuGet package on netstandard2.1.

## Used by

- `Program.Main` calls `SchemaLoader.Load(Path.Combine(dataRoot, "schemas"))`.
