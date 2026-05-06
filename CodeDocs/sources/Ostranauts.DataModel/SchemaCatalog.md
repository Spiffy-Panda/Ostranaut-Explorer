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
        Direct,                // plain string field
        StringArray,           // array of strings
        CondStringArray,       // array of "Name=value xduration" entries
        LootEntryArray,        // array of "[-]Name=chance x min[-max]" entries (loot.aCOs etc.)
        // Phase 2 (encoded-array shapes per CodeDocs/iverifiable-ref-map.md):
        InverseArray,          // "Name,..." — split on `,`, take [0] (e.g. JsonInteraction.aInverse)
        CondRuleAttachArray,   // "RuleName=fModifier" — name + fModifier metadata
                               //   (e.g. JsonCondOwner.aStartingCondRules)
        LootItmsArray,         // "verb,lootName[,...]" — name at [1], verb metadata
                               //   (e.g. JsonInteraction.aLootItms)
    }

    // RoutingSibling + RoutingTargets enable per-object target resolution: the
    // extractor reads obj.Fields[RoutingSibling] and uses RoutingTargets[siblingValue]
    // as the target folder. Falls back to TargetFolder when the sibling value isn't
    // in the routing map. Used for loot.aCOs which routes by the parent's strType.
    public sealed record FieldRule(
        string SourceFolder,
        string FieldName,
        string TargetFolder,
        FieldShape Shape,
        string? RoutingSibling = null,
        IReadOnlyDictionary<string, string>? RoutingTargets = null,
        bool IsGhost = false,                              // x-ghost in schema; not deserialized by C#
        string? Description = null,                         // schema description text
        IReadOnlyList<string>? FallbackTargets = null,      // x-targets fallback list
        string? NestedField = null);                        // x-nested-field for NestedDirectArray

    // Tolerates duplicate (SourceFolder, FieldName) keys with last-wins semantics
    // — needed for the Comment Mod overlay where the same field gets re-declared.
    public SchemaCatalog(IEnumerable<FieldRule> rules);

    // Slice 3 — same plus a separate (folder, fieldName) → description map
    // for fields that have a description but don't qualify as ref rules
    // (integers, booleans, anything non-string). Surfaces inline on the
    // site's Fields block alongside the ref-rule descriptions.
    public SchemaCatalog(
        IEnumerable<FieldRule> rules,
        IEnumerable<KeyValuePair<(string folder, string field), string>>? fieldDescriptions);

    public IReadOnlyList<FieldRule> Rules { get; }    // includes duplicates in load order
    public FieldRule? RuleFor(string folder, string field);  // returns the last-wins entry
    public IReadOnlyDictionary<(string folder, string field), string> FieldDescriptions { get; }
    public static SchemaCatalog Empty { get; }
}
```

## Depends on

- BCL only.

## Used by

- `SchemaLoader` (produces these).
- `ReferenceExtractor` (consults `RuleFor` per field).
- `Program` (passes the loaded catalog through the pipeline; logs `Rules.Count`).
