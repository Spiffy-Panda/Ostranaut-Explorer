using System.Text.Json;

namespace Ostranauts.DataModel;

/// <summary>
/// Writes the auto-detected ref-candidate report to a JS-wrapped JSON file
/// (<c>window.REF_CANDIDATES = {...};</c>). Sibling to graph.js / properties.js.
/// </summary>
public static class CandidateExporter
{
    private const int SchemaVersion = 1;

    private static readonly JsonWriterOptions WriterOptions = new() { Indented = true };

    public static void WriteJs(
        IReadOnlyList<RefCandidateDetector.Candidate> candidates,
        string outPath,
        RefCandidateDetector.Options? options = null)
    {
        var dir = Path.GetDirectoryName(outPath);
        if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);

        var opts = options ?? new RefCandidateDetector.Options();

        using var stream = File.Create(outPath);
        var prefix = System.Text.Encoding.UTF8.GetBytes("window.REF_CANDIDATES = ");
        stream.Write(prefix, 0, prefix.Length);

        using var w = new Utf8JsonWriter(stream, WriterOptions);
        w.WriteStartObject();
        w.WriteNumber("$schema_version", SchemaVersion);
        w.WriteString("generated_by", "Ostranauts.Site.Builder");
        w.WriteStartObject("thresholds");
        w.WriteNumber("minSampleSize", opts.MinSampleSize);
        w.WriteNumber("minHitRate", opts.MinHitRate);
        w.WriteBoolean("excludeSelfFolder", opts.ExcludeSelfFolder);
        w.WriteEndObject();
        w.WriteNumber("count", candidates.Count);

        w.WriteStartArray("candidates");
        foreach (var c in candidates)
        {
            w.WriteStartObject();
            w.WriteString("sourceFolder", c.SourceFolder);
            w.WriteString("fieldPath", c.FieldPath);
            w.WriteNumber("sampleSize", c.SampleSize);
            w.WriteNumber("distinctValues", c.DistinctValues);
            w.WriteBoolean("coveredBySchema", c.CoveredBySchema);

            if (c.RawTargets.Count > 0)
            {
                w.WriteStartArray("targets");
                foreach (var t in c.RawTargets)
                {
                    w.WriteStartObject();
                    w.WriteString("targetFolder", t.TargetFolder);
                    w.WriteNumber("hits", t.Hits);
                    w.WriteNumber("hitRate", t.HitRate);
                    w.WriteEndObject();
                }
                w.WriteEndArray();
            }

            if (c.Encoded is not null)
            {
                w.WriteStartObject("encoded");
                w.WriteString("separator", c.Encoded.Separator);
                w.WriteStartArray("targets");
                foreach (var t in c.Encoded.Targets)
                {
                    w.WriteStartObject();
                    w.WriteString("targetFolder", t.TargetFolder);
                    w.WriteNumber("hits", t.Hits);
                    w.WriteNumber("hitRate", t.HitRate);
                    w.WriteEndObject();
                }
                w.WriteEndArray();
                w.WriteEndObject();
            }

            w.WriteEndObject();
        }
        w.WriteEndArray();
        w.WriteEndObject();

        w.Flush();
        var suffix = System.Text.Encoding.UTF8.GetBytes(";\n");
        stream.Write(suffix, 0, suffix.Length);
    }
}
