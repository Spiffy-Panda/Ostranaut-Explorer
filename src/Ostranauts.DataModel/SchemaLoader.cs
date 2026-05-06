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
    /// resolved by last-wins semantics, so later roots (e.g. a Comment Mod)
    /// override earlier ones.
    ///
    /// Also honors `x-no-ref: true` on overlay fields: any (folder, field) key
    /// flagged in a later dir is REMOVED from the catalog entirely, even if an
    /// earlier dir had a rule for it. Used to veto bad base-schema rules whose
    /// descriptions accidentally trip the regex (e.g. interactions.strUseCase).
    /// </summary>
    public static SchemaCatalog Load(IEnumerable<string> schemaDirs, Action<string>? onWarning = null)
    {
        var byKey = new Dictionary<(string folder, string field), SchemaCatalog.FieldRule>();
        var descriptions = new Dictionary<(string folder, string field), string>();
        foreach (var dir in schemaDirs)
        {
            var (rules, suppressed, descs) = LoadInternal(dir, onWarning);
            foreach (var rule in rules)
                byKey[(rule.SourceFolder, rule.FieldName)] = rule;
            foreach (var key in suppressed)
                byKey.Remove(key);
            foreach (var kv in descs)
                descriptions[kv.Key] = kv.Value;  // last-wins overlay
        }
        return new SchemaCatalog(byKey.Values, descriptions);
    }

    public static SchemaCatalog Load(string schemaDir, Action<string>? onWarning = null)
    {
        var (rules, _, descs) = LoadInternal(schemaDir, onWarning);
        return new SchemaCatalog(rules, descs);
    }

    /// <summary>
    /// Single-dir loader returning derived rules, any (folder, field) keys
    /// flagged with <c>x-no-ref: true</c> for cross-dir suppression, and the
    /// full per-field description map (all fields that have a description,
    /// regardless of whether they qualified as a ref rule).
    /// </summary>
    private static (
        List<SchemaCatalog.FieldRule> rules,
        List<(string folder, string field)> suppressed,
        List<KeyValuePair<(string folder, string field), string>> descriptions
    ) LoadInternal(string schemaDir, Action<string>? onWarning)
    {
        var rules = new List<SchemaCatalog.FieldRule>();
        var suppressed = new List<(string folder, string field)>();
        var descriptions = new List<KeyValuePair<(string folder, string field), string>>();

        if (!Directory.Exists(schemaDir))
        {
            onWarning?.Invoke($"schemas dir not found: {schemaDir}");
            return (rules, suppressed, descriptions);
        }

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
                    // x-no-ref handled here so we can collect the suppression key.
                    if (fieldProp.Value.TryGetProperty("x-no-ref", out var noRefProp)
                        && noRefProp.ValueKind == JsonValueKind.True)
                    {
                        suppressed.Add((sourceFolder, fieldProp.Name));
                        continue;
                    }

                    // Capture the description (if any) regardless of whether the field
                    // becomes a ref rule. Non-ref scalars (integers, booleans, etc.)
                    // still carry useful "what does this field mean" prose for the site.
                    if (fieldProp.Value.TryGetProperty("description", out var descProp)
                        && descProp.ValueKind == JsonValueKind.String)
                    {
                        var desc = descProp.GetString();
                        if (!string.IsNullOrWhiteSpace(desc))
                            descriptions.Add(new KeyValuePair<(string folder, string field), string>(
                                (sourceFolder, fieldProp.Name), desc!));
                    }

                    var rule = TryDeriveRule(sourceFolder, fieldProp.Name, fieldProp.Value);
                    if (rule is not null) rules.Add(rule);
                }
            }
        }

        return (rules, suppressed, descriptions);
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
        // Note: x-no-ref is handled by LoadInternal before reaching here so it can
        // generate cross-dir suppression entries. By the time we get here the field
        // is eligible for rule derivation if it qualifies.

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

        // x-shape — explicit shape override. Takes precedence over inference + markers.
        // Used for the encoded-array shapes (LootItmsArray, InverseArray, CondRuleAttachArray)
        // that don't have a natural English marker phrase.
        if (fieldDef.TryGetProperty("x-shape", out var xShapeProp)
            && xShapeProp.ValueKind == JsonValueKind.String
            && Enum.TryParse<SchemaCatalog.FieldShape>(xShapeProp.GetString(), ignoreCase: false, out var xShape))
        {
            shape = xShape;
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

        // x-nested-field — name of a sub-field within each array element to walk
        // (for NestedDirectArray shape). E.g. condrules.aThresholds is an array of
        // objects each containing strLootNew → loot/.
        string? nestedField = null;
        if (fieldDef.TryGetProperty("x-nested-field", out var nestedFieldProp)
            && nestedFieldProp.ValueKind == JsonValueKind.String)
        {
            nestedField = nestedFieldProp.GetString();
        }

        // x-targets — existence-aware fallback list. When set, the first folder
        // becomes the primary target (overriding regex-derived); the rest are
        // fallbacks the extractor tries when the value isn't in the primary.
        IReadOnlyList<string>? fallbackTargets = null;
        if (fieldDef.TryGetProperty("x-targets", out var targetsProp)
            && targetsProp.ValueKind == JsonValueKind.Array)
        {
            var list = new List<string>();
            foreach (var t in targetsProp.EnumerateArray())
                if (t.ValueKind == JsonValueKind.String) list.Add(t.GetString()!);
            if (list.Count > 0)
            {
                targetFolder = list[0];
                if (list.Count > 1)
                    fallbackTargets = list.Skip(1).ToList();
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
            IsGhost: isGhost,
            Description: description,
            FallbackTargets: fallbackTargets,
            NestedField: nestedField);
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
