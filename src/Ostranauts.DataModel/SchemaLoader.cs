using System.Text.Json;
using System.Text.RegularExpressions;

namespace Ostranauts.DataModel;

/// <summary>
/// Reads <c>data/schemas/*-schema.json</c> and derives <see cref="SchemaCatalog.FieldRule"/>s
/// by regex-matching reference phrases in field descriptions
/// (e.g. <i>"reffers to entry within items.json"</i>, <i>"Found in lights.json"</i>).
///
/// Strict schema-driven: if a field has no description, or its description doesn't
/// match any of the patterns below, no rule is emitted. To extend coverage, add or
/// improve descriptions in the schema files themselves.
/// </summary>
public static class SchemaLoader
{
    private const RegexOptions PatternOptions =
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled;

    /// <summary>
    /// Patterns are tried in order; the first match wins. Each must capture
    /// the target folder name (without ".json") in group 1. Ordering goes from
    /// most-specific to least-specific so that broader fallbacks don't shadow
    /// authoritative phrasings.
    /// </summary>
    private static readonly Regex[] DescriptionPatterns =
    {
        // "refers to entry within items.json", "reffers to entries in loot.json" (handles base-game typo)
        new(@"\b(?:refers?|reffers?)\s+to\s+entr(?:y|ies)\s+(?:in|within)\s+(\w+)\.json", PatternOptions),
        // "Found in lights.json", "located in colors.json"
        new(@"\b(?:found|located)\s+in\s+(\w+)\.json", PatternOptions),
        // "(strName from chargeprofiles.json)", "from condtrigs.json"
        new(@"\bfrom\s+(\w+)\.json", PatternOptions),
        // "entry in loot.json", "entries from condtrigs.json"
        new(@"\bentr(?:y|ies)\s+(?:in|from|within)\s+(\w+)\.json", PatternOptions),
        // "the pledges.json entry"
        new(@"\b(\w+)\.json\s+entry", PatternOptions),
        // "Check colors.json to find options", "see lights.json"
        new(@"\b(?:check|see)\s+(\w+)\.json", PatternOptions),
        // "in loot.json", "within ledgerdefs.json" — broad fallback, last so specifics win
        new(@"\b(?:in|within)\s+(\w+)\.json", PatternOptions),
    };

    private static readonly JsonDocumentOptions ParseOptions = new()
    {
        AllowTrailingCommas = true,
        CommentHandling = JsonCommentHandling.Skip,
    };

    /// <summary>
    /// Multi-root variant — loads schemas from each directory in order, then
    /// returns a single catalog. (sourceFolder, fieldName) collisions are
    /// resolved by <see cref="SchemaCatalog"/> with last-wins semantics, so
    /// later roots (e.g. a Comment Mod) override earlier ones.
    /// </summary>
    public static SchemaCatalog Load(IEnumerable<string> schemaDirs, Action<string>? onWarning = null)
    {
        var allRules = new List<SchemaCatalog.FieldRule>();
        foreach (var dir in schemaDirs)
            allRules.AddRange(Load(dir, onWarning).Rules);
        return new SchemaCatalog(allRules);
    }

    public static SchemaCatalog Load(string schemaDir, Action<string>? onWarning = null)
    {
        if (!Directory.Exists(schemaDir))
        {
            onWarning?.Invoke($"schemas dir not found: {schemaDir}");
            return SchemaCatalog.Empty;
        }

        var rules = new List<SchemaCatalog.FieldRule>();

        foreach (var schemaPath in Directory.EnumerateFiles(schemaDir, "*-schema.json"))
        {
            var basename = Path.GetFileNameWithoutExtension(schemaPath);
            var sourceFolder = basename.EndsWith("-schema", StringComparison.Ordinal)
                ? basename.Substring(0, basename.Length - "-schema".Length)
                : basename;

            JsonDocument doc;
            try
            {
                using var stream = File.OpenRead(schemaPath);
                doc = JsonDocument.Parse(stream, ParseOptions);
            }
            catch (JsonException ex)
            {
                onWarning?.Invoke($"skip schema (parse error): {schemaPath} — {ex.Message}");
                continue;
            }

            using (doc)
            {
                if (!TryGetItemProperties(doc.RootElement, out var properties)) continue;

                foreach (var fieldProp in properties.EnumerateObject())
                {
                    var rule = TryDeriveRule(sourceFolder, fieldProp.Name, fieldProp.Value);
                    if (rule is not null) rules.Add(rule);
                }
            }
        }

        return new SchemaCatalog(rules);
    }

    private static bool TryGetItemProperties(JsonElement root, out JsonElement properties)
    {
        properties = default;
        if (!root.TryGetProperty("items", out var items)) return false;
        if (!items.TryGetProperty("properties", out var props)) return false;
        properties = props;
        return true;
    }

    /// <summary>
    /// Marker phrase that promotes a StringArray rule to CondStringArray. Schema authors
    /// add this (in any case, surrounding text doesn't matter) to declare that the array
    /// holds entries in the cond-string DSL (<c>Name=value xduration</c>).
    /// </summary>
    private static readonly Regex CondStringMarker = new(
        @"\bcondition\s+string", PatternOptions);

    /// <summary>
    /// Marker phrase that promotes a StringArray rule to LootEntryArray. Schema authors
    /// add this to declare entries follow the <c>[-]Name=chance x min[-max]</c> format
    /// from <c>Loot.aCOs</c>.
    /// </summary>
    private static readonly Regex LootEntryMarker = new(
        @"\bloot\s+entr(?:y|ies)\s+string", PatternOptions);

    private static SchemaCatalog.FieldRule? TryDeriveRule(string sourceFolder, string fieldName, JsonElement fieldDef)
    {
        if (!fieldDef.TryGetProperty("description", out var descProp)) return null;
        if (descProp.ValueKind != JsonValueKind.String) return null;

        var description = descProp.GetString();
        if (string.IsNullOrWhiteSpace(description)) return null;

        var shape = InferShape(fieldDef);
        if (shape is null) return null;  // non-string-shaped field can't carry a strName reference

        var targetFolder = ExtractTargetFolder(description!);
        if (targetFolder is null) return null;

        // Promote StringArray -> CondStringArray / LootEntryArray when the description
        // marks the field's content format. LootEntry takes precedence (more specific).
        if (shape == SchemaCatalog.FieldShape.StringArray)
        {
            if (LootEntryMarker.IsMatch(description!))
                shape = SchemaCatalog.FieldShape.LootEntryArray;
            else if (CondStringMarker.IsMatch(description!))
                shape = SchemaCatalog.FieldShape.CondStringArray;
        }

        // x-route-by + x-route-targets — sibling-field-routed target folders.
        // E.g. loot.aCOs is type-routed by sibling strType.
        string? routingSibling = null;
        IReadOnlyDictionary<string, string>? routingTargets = null;
        if (fieldDef.TryGetProperty("x-route-by", out var routeByProp)
            && routeByProp.ValueKind == JsonValueKind.String)
        {
            routingSibling = routeByProp.GetString();
            if (fieldDef.TryGetProperty("x-route-targets", out var routeTargetsProp)
                && routeTargetsProp.ValueKind == JsonValueKind.Object)
            {
                var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                foreach (var prop in routeTargetsProp.EnumerateObject())
                    if (prop.Value.ValueKind == JsonValueKind.String)
                        map[prop.Name] = prop.Value.GetString()!;
                if (map.Count > 0) routingTargets = map;
            }
        }

        // x-ghost — field documented by schema but decomp says game doesn't
        // deserialize it. Rule still emits (in case real data uses it); the
        // flag rides through to the site for visual distinction.
        var isGhost = fieldDef.TryGetProperty("x-ghost", out var ghostProp)
            && ghostProp.ValueKind == JsonValueKind.True;

        return new SchemaCatalog.FieldRule(
            sourceFolder, fieldName, targetFolder, shape.Value,
            RoutingSibling: routingSibling,
            RoutingTargets: routingTargets,
            IsGhost: isGhost);
    }

    private static string? ExtractTargetFolder(string description)
    {
        foreach (var pattern in DescriptionPatterns)
        {
            var match = pattern.Match(description);
            if (match.Success) return match.Groups[1].Value;
        }
        return null;
    }

    /// <summary>
    /// Returns Direct or StringArray for fields whose JSON type can carry a strName
    /// reference (string, array of string, or nullable string). Returns null for
    /// numeric/boolean/object types — those can't be references regardless of what
    /// their description happens to mention.
    /// </summary>
    private static SchemaCatalog.FieldShape? InferShape(JsonElement fieldDef)
    {
        if (!fieldDef.TryGetProperty("type", out var typeProp))
            return SchemaCatalog.FieldShape.Direct;  // schema didn't say; assume string

        // type is either a string ("string", "array") or an array of allowed types (["string", "null"]).
        switch (typeProp.ValueKind)
        {
            case JsonValueKind.String:
                return typeProp.GetString() switch
                {
                    "string" => SchemaCatalog.FieldShape.Direct,
                    "array" => SchemaCatalog.FieldShape.StringArray,
                    _ => null,  // integer, number, boolean, object — not a reference carrier
                };

            case JsonValueKind.Array:
                var sawString = false;
                foreach (var t in typeProp.EnumerateArray())
                {
                    if (t.ValueKind != JsonValueKind.String) continue;
                    var s = t.GetString();
                    if (s == "array") return SchemaCatalog.FieldShape.StringArray;
                    if (s == "string") sawString = true;
                }
                return sawString ? SchemaCatalog.FieldShape.Direct : null;

            default:
                return null;
        }
    }
}
