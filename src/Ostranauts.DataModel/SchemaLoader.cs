namespace Ostranauts.DataModel;

/// <summary>
/// Reads data/schemas/*-schema.json and derives reference rules from
/// field descriptions (e.g. "refers to entry within items.json",
/// "Found in lights.json"). v1 step 1.
/// </summary>
public static class SchemaLoader
{
    /// <summary>
    /// Scaffold stub. Real implementation parses schema files and
    /// regex-matches description strings to build the rule set.
    /// Returns an empty catalog so the rest of the pipeline runs.
    /// </summary>
    public static SchemaCatalog Load(string schemaDir)
    {
        // TODO(v1): walk schemaDir/*-schema.json, parse each,
        // pull rules from field descriptions. See PROJECT-PITCH.md
        // "How references are extracted" section for the rule set.
        return SchemaCatalog.Empty;
    }
}
