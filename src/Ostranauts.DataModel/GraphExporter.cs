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

    public static void WriteJson(ObjectIndex index, string outPath)
    {
        var dir = Path.GetDirectoryName(outPath);
        if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);

        using var stream = File.Create(outPath);
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
