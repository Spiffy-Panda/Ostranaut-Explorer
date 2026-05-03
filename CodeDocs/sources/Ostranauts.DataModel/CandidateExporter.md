# CandidateExporter.cs

**Path:** `src/Ostranauts.DataModel/CandidateExporter.cs`
**Status:** real

## Purpose

Writes the auto-detected ref-candidate report as a JS-wrapped JSON file (`window.REF_CANDIDATES = {...};`). Sibling to `graph.js` / `properties.js`. Same `<script src>` loading model as the rest of the site payloads — works under `file://`.

## Public API

```csharp
public static class CandidateExporter
{
    public static void WriteJs(
        IReadOnlyList<RefCandidateDetector.Candidate> candidates,
        string outPath,
        RefCandidateDetector.Options? options = null);
}
```

Creates parent directories if missing. Always overwrites.

## Output shape — schema version 1

```jsonc
window.REF_CANDIDATES = {
  "$schema_version": 1,
  "generated_by": "Ostranauts.Site.Builder",
  "thresholds": {
    "minSampleSize": 5,
    "minHitRate": 0.5,
    "excludeSelfFolder": true
  },
  "count": <int>,
  "candidates": [
    {
      "sourceFolder": "<folder>",
      "fieldPath": "<field>" | "<field>[*]" | "<field>[*].<sub>",
      "sampleSize": <int>,
      "distinctValues": <int>,
      "coveredBySchema": <bool>,
      "targets": [               // optional; raw-value hits
        { "targetFolder": "<folder>", "hits": <int>, "hitRate": <0.0-1.0> }
      ],
      "encoded": {                // optional; only when raw missed and split-retry hit
        "separator": "," | "=" | "|",
        "targets": [ ... same shape as above ... ]
      }
    }
  ]
}
```

Real-data size: ~84 KB (240 candidates).

## Depends on

- `RefCandidateDetector` (Candidate / Target / EncodedFinding records).
- `System.Text.Json` (`Utf8JsonWriter`).

## Used by

- `Program.Main` — sibling write next to `graph.js`.
- Site frontend (`src/Ostranauts.Site/app.js`) — drives the auto-detected scalar links on detail pages and the `/health/coverage` table.
