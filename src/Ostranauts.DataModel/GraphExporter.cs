using System.Text.Json;

namespace Ostranauts.DataModel;

/// <summary>
/// Serializes an ObjectIndex to the JSON shape the static site reads.
/// Schema version is recorded in the file as <c>$schema_version</c>;
/// see <c>CodeDocs/io/outputs.md</c> for the canonical spec.
/// </summary>
public static class GraphExporter
{
    private const int SchemaVersion = 5;

    private static readonly JsonWriterOptions WriterOptions = new()
    {
        Indented = true,
    };

    /// <summary>
    /// Writes graph.js (the direct graph) and properties.js (per-node scalar
    /// fields) as a pair under <paramref name="outPath"/>'s directory. v5
    /// schema split: the graph file no longer carries per-node fields — those
    /// move to a separate <c>window.NODE_PROPS</c> payload so the graph file
    /// can stay smaller for graph-only consumers (LSPs, future tooling).
    /// Both files are JS-wrapped JSON (literal <c>window.X = {...};</c>) so
    /// they load via <c>&lt;script src&gt;</c> without fetch (browsers block
    /// fetch from <c>file://</c>).
    /// </summary>
    public static void WriteJson(ObjectIndex index, string outPath, SchemaCatalog? catalog = null)
    {
        var dir = Path.GetDirectoryName(outPath);
        if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);

        WriteGraphFile(index, outPath, catalog);

        // Sibling properties file. Default name: properties.js next to graph.js.
        var propsPath = Path.Combine(dir ?? ".", "properties.js");
        WritePropertiesFile(index, propsPath);
    }

    private static void WriteGraphFile(ObjectIndex index, string outPath, SchemaCatalog? catalog)
    {
        using var stream = File.Create(outPath);
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
            // v5: per-node scalar fields moved to properties.js (window.NODE_PROPS).
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

        // rules — schema-derived field rules, for the schema inspector page.
        // Optional (omitted from older callers); v2 schema_version.
        if (catalog is not null)
        {
            writer.WriteStartArray("rules");
            foreach (var rule in catalog.Rules)
            {
                writer.WriteStartObject();
                writer.WriteString("sourceFolder", rule.SourceFolder);
                writer.WriteString("fieldName", rule.FieldName);
                writer.WriteString("targetFolder", rule.TargetFolder);
                writer.WriteString("shape", rule.Shape.ToString());
                if (rule.IsGhost) writer.WriteBoolean("isGhost", true);
                if (!string.IsNullOrEmpty(rule.Description))
                    writer.WriteString("description", rule.Description);
                writer.WriteEndObject();
            }
            writer.WriteEndArray();
        }

        writer.WriteEndObject();

        // Flush the JsonWriter, then append the JS terminator so the file is valid JS.
        writer.Flush();
        var suffix = System.Text.Encoding.UTF8.GetBytes(";\n");
        stream.Write(suffix, 0, suffix.Length);
    }

    /// <summary>
    /// Writes properties.js: window.NODE_PROPS = { "&lt;nodeId&gt;": { fieldName: value, ... }, ... }.
    /// Holds the scalar (string/number/bool/null) JSON fields per node so the graph
    /// file can stay graph-only. Arrays and nested objects are skipped (those are
    /// either edges or omitted by design). strName is also skipped — already on
    /// the node header in graph.js.
    /// </summary>
    private static void WritePropertiesFile(ObjectIndex index, string outPath)
    {
        using var stream = File.Create(outPath);
        var prefix = System.Text.Encoding.UTF8.GetBytes("window.NODE_PROPS = ");
        stream.Write(prefix, 0, prefix.Length);

        using var writer = new Utf8JsonWriter(stream, WriterOptions);

        writer.WriteStartObject();
        foreach (var obj in index.Objects)
        {
            // Skip nodes with zero scalar fields to keep the file lean.
            if (obj.Fields.ValueKind != JsonValueKind.Object) continue;

            var any = false;
            foreach (var prop in obj.Fields.EnumerateObject())
            {
                if (prop.Name == "strName") continue;
                switch (prop.Value.ValueKind)
                {
                    case JsonValueKind.String:
                    case JsonValueKind.Number:
                    case JsonValueKind.True:
                    case JsonValueKind.False:
                    case JsonValueKind.Null:
                        if (!any)
                        {
                            writer.WriteStartObject($"{obj.Folder}:{obj.StrName}");
                            any = true;
                        }
                        prop.WriteTo(writer);
                        break;
                }
            }
            if (any) writer.WriteEndObject();
        }
        writer.WriteEndObject();

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
            case string[] arr:
                writer.WriteStartArray(key);
                foreach (var s in arr) writer.WriteStringValue(s);
                writer.WriteEndArray();
                break;
            default: writer.WriteString(key, value.ToString() ?? ""); break;
        }
    }
}
