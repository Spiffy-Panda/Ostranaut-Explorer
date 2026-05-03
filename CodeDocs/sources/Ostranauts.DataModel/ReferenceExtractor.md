# ReferenceExtractor.cs

**Path:** `src/Ostranauts.DataModel/ReferenceExtractor.cs`
**Status:** real

## Purpose

Walks a `DataObject`'s top-level fields against the `SchemaCatalog`, emits one `Reference` per outgoing cross-reference. Dispatches per `FieldShape` so plain strings, string arrays, and condition-string arrays are each handled correctly. Pronoun/placeholder tokens (regex `^\[\w+\]$`) are not real references and are skipped.

Real-data run: 26 rules over 29k objects produce ~7,900 edges. ~1,500 of those dangle (target not in index) — a mix of legitimate "missing data" findings and one false-positive rule (`strTargetPoint` → `condowners`) caused by an ambiguous schema description; both surface naturally on the health page.

## Public API

```csharp
public static class ReferenceExtractor
{
    public static IEnumerable<Reference> Extract(DataObject obj, SchemaCatalog catalog);
}
```

Stateless. Streams via yield. Returns no edges (yield break) if `obj.Fields` isn't a JSON object.

## Per-shape behavior

| Shape | Source field | Yields |
|---|---|---|
| `Direct` | string value | One `Reference(Kind=Direct)` per non-empty, non-placeholder string. |
| `StringArray` | array of strings | One `Reference(Kind=DirectInArray)` per non-empty, non-placeholder element. |
| `CondStringArray` | array of condition strings (`Name=value xduration`) | One `Reference(Kind=Condition)` per parseable element. `Metadata` carries `value` (double) and `duration` (int). |
| `LootEntryArray` | array of loot strings (`[-]Name=chance x min[-max]`, `\|`-separated cumulative alternatives in one slot) | One `Reference(Kind=Loot)` per parseable entry (cumulative slot expands to multiple). `Metadata` carries `chance`, `min`, `max` (doubles) and `positive` (bool, false for leading-`-` payouts). Target folder is resolved via `ResolveTarget` (sibling-routed if rule has routing config, else `rule.TargetFolder`). |

## Target resolution

`ResolveTarget(obj, rule)` returns the effective target folder for one rule applied to one object:

1. If the rule has no `RoutingSibling` / `RoutingTargets` → returns `rule.TargetFolder` directly.
2. Otherwise reads `obj.Fields[rule.RoutingSibling]`. If missing or non-string → falls back to `rule.TargetFolder`.
3. Looks up the sibling value in `rule.RoutingTargets` (case-insensitive). Hit returns the routed folder; miss returns `rule.TargetFolder`.

This is what makes `loot.aCOs` route to different folders per parent `strType`: a loot entry with `strType="item"` emits aCOs refs into `condowners/`, while `strType="condition"` emits into `conditions/`.

For each shape, values that fail their kind check (wrong JSON value type, empty string, malformed cond-string, placeholder token) are silently dropped — never throws.

## Placeholder token rule

Anything matching the full-string regex `^\[\w+\]$` — `[us]`, `[them]`, `[3rd]`, `[me]`, etc. — is skipped. These are pronouns the game substitutes at runtime, not real references. The match is **anchored** so a value that *contains* `[us]` mid-string (e.g. `"chat,[us],[them]"`) wouldn't be skipped by the placeholder rule alone; that's by design — those are interaction-name suffixes, a separate concern.

## Depends on

- `DataObject`, `Reference`, `SchemaCatalog`, `CondStringParser`.
- `System.Text.Json`, `System.Text.RegularExpressions`.

## Used by

- `Program.Main` — `objects.SelectMany(o => ReferenceExtractor.Extract(o, catalog))`.
- `ReferenceExtractorTests` — 9 unit tests covering each shape, placeholders, nulls, malformed values, missing rules.
