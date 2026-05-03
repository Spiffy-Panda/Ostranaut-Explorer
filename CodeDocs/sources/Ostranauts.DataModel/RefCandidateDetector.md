# RefCandidateDetector.cs

**Path:** `src/Ostranauts.DataModel/RefCandidateDetector.cs`
**Status:** real

## Purpose

Auto-detection pass that finds reference fields the schema doesn't yet describe. Walks every leaf string value across every loaded `DataObject`, looks each one up in a global `(folder, strName)` index, and per `(sourceFolder, fieldPath)` reports the hit-rate against each candidate target folder.

Two parallel passes per leaf:
1. **Raw** — value-as-whole lookup.
2. **Encoded** — if raw misses and the value contains `,` / `=` / `|`, split on the separator and try the prefix token. Catches CondString-style or LootItm-style encoded fields (`"CondName=1.0x1"`, `"verb,ItmName,..."`) when no schema rule covers them.

Field paths embed array (`[*]`) and nested-object (`.`) markers so the detector can reach into structures the existing extractor can't (e.g. `aThresholds[*].strLootNew`). A path's top-level field is the prefix before the first `[` or `.`; that's what's checked against `SchemaCatalog.RuleFor` to mark `CoveredBySchema`.

Self-folder hits and the `strName` field itself are excluded by default — they're the source of names, not refs.

## Public API

```csharp
public static class RefCandidateDetector
{
    public sealed record Options(
        int MinSampleSize = 5,
        double MinHitRate = 0.5,
        bool ExcludeSelfFolder = true);

    public sealed record Target(string TargetFolder, int Hits, double HitRate);

    public sealed record EncodedFinding(
        string Separator,                // ",", "=", or "|"
        IReadOnlyList<Target> Targets);

    public sealed record Candidate(
        string SourceFolder,
        string FieldPath,                // e.g. "strActionCO" or "aThresh[*].strLootNew"
        int SampleSize,                  // total non-empty, non-placeholder leaf-string observations
        int DistinctValues,
        bool CoveredBySchema,            // catalog.RuleFor(folder, topLevelField) is non-null
        IReadOnlyList<Target> RawTargets,
        EncodedFinding? Encoded);

    public static IReadOnlyList<Candidate> Detect(
        IEnumerable<DataObject> objects,
        SchemaCatalog catalog,
        Options? options = null);
}
```

Sort order on the returned list: uncovered before covered, then descending leverage = `sampleSize × bestHitRate`.

## Real-data run

With base game `data/` + Comment Mod overlay applied: **240 candidates surfaced (184 uncovered)**. Top finds:

- `ships.aItems[*].strName` → cooverlays (454k samples, 1232 distinct, 80% hit-rate)
- `installables.strActionCO` → items (2109 samples, 1078 distinct, ~100%)
- `installables.aInputs[*]` → encoded `=` → condtrigs (cond-string DSL caught via split-retry)
- `condrules.aThresh[*].strLootNew` → loot (caught via nested-array path)

## Implementation notes

- One pass over `objects` populates the global name index, then a second pass walks each object's `Fields` recursively and tallies hits per `(folder, fieldPath)`.
- Aggregates only retain folders that hit at least once — bounded memory.
- `DistinctValues` is a `HashSet<string>` per (folder, path); 31k objects × 30 folders × ~50 paths is well within memory.
- Encoded splits use `IndexOf(sep)` not `Split()` to avoid array allocation in the hot path.
- Numbers / bools / nulls are skipped — only strings can be ref values.
- Placeholder tokens (`[us]`, `[them]`, etc., regex `^\[\w+\]$`) are excluded.

## Depends on

- `DataObject`, `SchemaCatalog`.
- `System.Text.Json` (`JsonElement` traversal), `System.Text.RegularExpressions` (placeholder regex).

## Used by

- `Program.Main` — runs after `ReferenceExtractor`, output written via `CandidateExporter`.
- `RefCandidateDetectorTests` — 7 unit tests covering hit-rate, sample-size threshold, self-exclusion, encoded-shape detection, schema-covered marking, nested paths, placeholder skipping.
