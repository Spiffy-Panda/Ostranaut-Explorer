using System.Text.Json;

namespace Ostranauts.DataModel;

/// <summary>
/// Serializes an ObjectIndex to the JSON shape the static site reads.
/// Schema version is recorded in the file as <c>$schema_version</c>;
/// see <c>CodeDocs/io/outputs.md</c> for the canonical spec.
/// </summary>
public static class GraphExporter
{
    private const int SchemaVersion = 1;

    private static readonly JsonWriterOptions WriterOptions = new()
    {
        Indented = true,
    };

    /// <summary>
    /// Writes the graph as a JS file containing
    /// <c>window.GRAPH_DATA = { ... };</c>. This form loads via
    /// <c>&lt;script src=...&gt;</c> with no fetch, which is the only way
    /// the static site works from a <c>file://</c> URL — browsers block
    /// fetch() against local files for security.
    /// The bytes between the assignment and the trailing <c>;</c> are
    /// valid JSON, so non-browser consumers can still extract the payload.
    /// </summary>
    public static void WriteJson(ObjectIndex index, string outPath)
    {
        var dir = Path.GetDirectoryName(outPath);
        if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);

        using var stream = File.Create(outPath);
        // Prefix the JSON payload with a JS assignment so a <script src> tag
        // populates window.GRAPH_DATA when the file is loaded.
        var prefix = System.Text.Encoding.UTF8.GetBytes("window.GRAPH_DATA = ");
        stream.Write(prefix, 0, prefix.Length);

        using var writer = new Utf8JsonWriter(stream, WriterOptions);

        writer.WriteStartObject();
        writer.WriteNumber("$schema_version", SchemaVersion);
        writer.WriteString("generated_by", "Ostranauts.Site.Builder");
        writer.WriteNumber("object_count", index.Objects.Count);
        writer.WriteNumber("reference_count", index.References.Count);

        writer.WriteStartArray("nodes");
        foreach (var obj in index.Objects)
        {
            writer.WriteStartObject();
            writer.WriteString("id", $"{obj.Folder}:{obj.StrName}");
            writer.WriteString("folder", obj.Folder);
            writer.WriteString("strName", obj.StrName);
            writer.WriteString("file", obj.FilePath);
            writer.WriteEndObject();
        }
        writer.WriteEndArray();

        writer.WriteStartArray("edges");
        foreach (var r in index.References)
        {
            writer.WriteStartObject();
            writer.WriteString("source", $"{r.SourceFolder}:{r.SourceName}");
            writer.WriteString("target", $"{r.TargetFolder}:{r.TargetName}");
            writer.WriteString("kind", r.Kind.ToString());
            writer.WriteString("sourceField", r.SourceField);
            if (r.Metadata is { Count: > 0 })
            {
                writer.WriteStartObject("metadata");
                foreach (var (key, value) in r.Metadata)
                    WriteScalar(writer, key, value);
                writer.WriteEndObject();
            }
            writer.WriteEndObject();
        }
        writer.WriteEndArray();

        writer.WriteEndObject();

        // Flush the JsonWriter, then append the JS terminator so the file is valid JS.
        writer.Flush();
        var suffix = System.Text.Encoding.UTF8.GetBytes(";\n");
        stream.Write(suffix, 0, suffix.Length);
    }

    private static void WriteScalar(Utf8JsonWriter writer, string key, object value)
    {
        switch (value)
        {
            case string s: writer.WriteString(key, s); break;
            case bool b: writer.WriteBoolean(key, b); break;
            case int i: writer.WriteNumber(key, i); break;
            case long l: writer.WriteNumber(key, l); break;
            case double d: writer.WriteNumber(key, d); break;
            case float f: writer.WriteNumber(key, f); break;
            case decimal m: writer.WriteNumber(key, m); break;
            case null: writer.WriteNull(key); break;
            default: writer.WriteString(key, value.ToString() ?? ""); break;
        }
    }
}
