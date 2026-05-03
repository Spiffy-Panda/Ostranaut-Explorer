using System.Text;

namespace Ostranauts.DataModel;

/// <summary>
/// Serializes an ObjectIndex to the JSON shape the static site reads.
/// Scaffold version writes a minimal valid graph.json so the frontend
/// can be developed against it before real data flows through.
/// </summary>
public static class GraphExporter
{
    public static void WriteJson(ObjectIndex index, string outPath)
    {
        var dir = Path.GetDirectoryName(outPath);
        if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);

        var sb = new StringBuilder();
        sb.Append("{\n");
        sb.Append("  \"$schema_version\": 0,\n");
        sb.Append("  \"generated_by\": \"Ostranauts.Site.Builder (scaffold)\",\n");
        sb.Append($"  \"object_count\": {index.Objects.Count},\n");
        sb.Append($"  \"reference_count\": {index.References.Count},\n");
        sb.Append("  \"nodes\": [],\n");
        sb.Append("  \"edges\": []\n");
        sb.Append("}\n");

        File.WriteAllText(outPath, sb.ToString());
    }
}
