using System.Text.Json;
using System.Text.RegularExpressions;

namespace Ostranauts.DataModel;

/// <summary>
/// Scans every leaf string in every DataObject's Fields and computes
/// per-(sourceFolder, fieldPath) hit-rate against the global
/// (folder, strName) index. Emits Candidate entries for fields whose
/// values appear to reference one or more target folders.
///
/// Two parallel passes per leaf value:
///   1. Raw — value-as-whole lookup against nameIndex.
///   2. Encoded — if the value contains a separator (`,` `=` `|`), split
///      on it and try the prefix token. Catches CondString-style or
///      LootItm-style encoded fields when no schema rule covers them.
///
/// Self-folder hits are excluded by default (a folder rarely refs itself
/// directly; the rare cases like conditions.strAnti need schema rules
/// declared explicitly anyway). The strName field is skipped — it's the
/// source of names, not a ref field.
/// </summary>
public static class RefCandidateDetector
{
    public sealed record Options(
        int MinSampleSize = 5,
        double MinHitRate = 0.5,
        bool ExcludeSelfFolder = true);

    public sealed record Target(string TargetFolder, int Hits, double HitRate);

    public sealed record EncodedFinding(
        string Separator,
        IReadOnlyList<Target> Targets);

    public sealed record Candidate(
        string SourceFolder,
        string FieldPath,
        int SampleSize,
        int DistinctValues,
        bool CoveredBySchema,
        IReadOnlyList<Target> RawTargets,
        EncodedFinding? Encoded);

    private static readonly Regex Placeholder = new(
        @"^\[\w+\]$", RegexOptions.Compiled | RegexOptions.CultureInvariant);

    private static readonly char[] EncodedSeparators = { ',', '=', '|' };

    public static IReadOnlyList<Candidate> Detect(
        IEnumerable<DataObject> objects,
        SchemaCatalog catalog,
        Options? options = null)
    {
        var opts = options ?? new Options();
        var objList = objects as IReadOnlyList<DataObject> ?? objects.ToList();

        // strName -> folders that contain it.
        var nameIndex = new Dictionary<string, HashSet<string>>(StringComparer.Ordinal);
        foreach (var obj in objList)
        {
            if (!nameIndex.TryGetValue(obj.StrName, out var folders))
                nameIndex[obj.StrName] = folders = new HashSet<string>(StringComparer.Ordinal);
            folders.Add(obj.Folder);
        }

        // (sourceFolder, fieldPath) -> aggregate
        var agg = new Dictionary<(string, string), Aggregate>();

        foreach (var obj in objList)
        {
            if (obj.Fields.ValueKind != JsonValueKind.Object) continue;
            foreach (var prop in obj.Fields.EnumerateObject())
            {
                if (prop.Name == "strName") continue;
                Walk(obj.Folder, prop.Name, prop.Value, agg, nameIndex);
            }
        }

        var results = new List<Candidate>();
        foreach (var entry in agg)
        {
            var folder = entry.Key.Item1;
            var path = entry.Key.Item2;
            var a = entry.Value;

            if (a.TotalSamples < opts.MinSampleSize) continue;

            var raw = a.RawHits
                .Where(kv => !(opts.ExcludeSelfFolder && kv.Key == folder))
                .Select(kv => new Target(kv.Key, kv.Value, (double)kv.Value / a.TotalSamples))
                .Where(t => t.HitRate >= opts.MinHitRate)
                .OrderByDescending(t => t.HitRate)
                .ToList();

            EncodedFinding? encoded = raw.Count == 0
                ? BestEncoded(a, folder, opts)
                : null;

            if (raw.Count == 0 && encoded is null) continue;

            var topField = TopLevelField(path);
            var coveredBySchema = catalog.RuleFor(folder, topField) is not null;

            results.Add(new Candidate(
                folder, path,
                a.TotalSamples, a.DistinctValues.Count,
                coveredBySchema,
                raw, encoded));
        }

        results.Sort((x, y) =>
        {
            // Uncovered first, then leverage = sampleSize * bestHitRate.
            if (x.CoveredBySchema != y.CoveredBySchema) return x.CoveredBySchema ? 1 : -1;
            return Score(y).CompareTo(Score(x));

            static double Score(Candidate c)
            {
                var bestRate = c.RawTargets.Count > 0
                    ? c.RawTargets[0].HitRate
                    : (c.Encoded?.Targets.Count > 0 ? c.Encoded.Targets[0].HitRate : 0);
                return c.SampleSize * bestRate;
            }
        });

        return results;
    }

    private static EncodedFinding? BestEncoded(Aggregate a, string folder, Options opts)
    {
        EncodedFinding? best = null;
        double bestRate = 0;
        foreach (var entry in a.SplitHitsBySeparator)
        {
            var sep = entry.Key;
            var hits = entry.Value;
            var targets = hits
                .Where(kv => !(opts.ExcludeSelfFolder && kv.Key == folder))
                .Select(kv => new Target(kv.Key, kv.Value, (double)kv.Value / a.TotalSamples))
                .Where(t => t.HitRate >= opts.MinHitRate)
                .OrderByDescending(t => t.HitRate)
                .ToList();
            if (targets.Count == 0) continue;
            if (targets[0].HitRate > bestRate)
            {
                bestRate = targets[0].HitRate;
                best = new EncodedFinding(sep, targets);
            }
        }
        return best;
    }

    private static string TopLevelField(string path)
    {
        var sepIdx = path.IndexOfAny(new[] { '.', '[' });
        return sepIdx < 0 ? path : path.Substring(0, sepIdx);
    }

    private sealed class Aggregate
    {
        public int TotalSamples;
        public readonly HashSet<string> DistinctValues = new(StringComparer.Ordinal);
        public readonly Dictionary<string, int> RawHits = new(StringComparer.Ordinal);

        // separator (",", "=", "|") -> folder -> hit count.
        public readonly Dictionary<string, Dictionary<string, int>> SplitHitsBySeparator
            = new(StringComparer.Ordinal);
    }

    private static void Walk(
        string sourceFolder, string path, JsonElement el,
        Dictionary<(string, string), Aggregate> agg,
        Dictionary<string, HashSet<string>> nameIndex)
    {
        switch (el.ValueKind)
        {
            case JsonValueKind.String:
                var s = el.GetString();
                if (string.IsNullOrEmpty(s)) return;
                if (Placeholder.IsMatch(s!)) return;

                var a = GetOrAdd(agg, sourceFolder, path);
                a.TotalSamples++;
                a.DistinctValues.Add(s!);

                if (nameIndex.TryGetValue(s!, out var folders))
                {
                    foreach (var f in folders)
                        a.RawHits[f] = a.RawHits.TryGetValue(f, out var c) ? c + 1 : 1;
                    return;
                }

                // Encoded-shape retry: split on each separator that appears in the value,
                // try the prefix token. (Generalizes to "Name=value", "verb,name", "a|b".)
                foreach (var sep in EncodedSeparators)
                {
                    var idx = s.IndexOf(sep);
                    if (idx <= 0) continue;
                    var token = s.Substring(0, idx).Trim();
                    if (string.IsNullOrEmpty(token)) continue;
                    if (Placeholder.IsMatch(token)) continue;
                    if (!nameIndex.TryGetValue(token, out var splitFolders)) continue;

                    var sepKey = sep.ToString();
                    if (!a.SplitHitsBySeparator.TryGetValue(sepKey, out var sepHits))
                        a.SplitHitsBySeparator[sepKey] = sepHits = new Dictionary<string, int>(StringComparer.Ordinal);
                    foreach (var f in splitFolders)
                        sepHits[f] = sepHits.TryGetValue(f, out var c) ? c + 1 : 1;
                }
                return;

            case JsonValueKind.Array:
                var arrPath = path + "[*]";
                foreach (var item in el.EnumerateArray())
                    Walk(sourceFolder, arrPath, item, agg, nameIndex);
                return;

            case JsonValueKind.Object:
                foreach (var prop in el.EnumerateObject())
                {
                    var sub = path.Length == 0 ? prop.Name : path + "." + prop.Name;
                    Walk(sourceFolder, sub, prop.Value, agg, nameIndex);
                }
                return;

            // numbers/bools/null: not relevant to ref detection.
        }
    }

    private static Aggregate GetOrAdd(
        Dictionary<(string, string), Aggregate> agg,
        string folder, string path)
    {
        if (!agg.TryGetValue((folder, path), out var a))
            agg[(folder, path)] = a = new Aggregate();
        return a;
    }
}
