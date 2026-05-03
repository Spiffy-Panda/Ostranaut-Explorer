using System.Text.Json;
using System.Text.RegularExpressions;

namespace Ostranauts.DataModel;

/// <summary>
/// Walks a DataObject's fields against the SchemaCatalog and emits one
/// Reference per outgoing cross-reference. Dispatches per FieldShape so
/// plain strings, string arrays, and condition-string arrays are each
/// handled correctly. Pronoun/placeholder tokens (regex <c>\[\w+\]</c>)
/// are not real references and are skipped.
/// </summary>
public static class ReferenceExtractor
{
    private static readonly Regex PlaceholderToken = new(
        @"^\[\w+\]$",
        RegexOptions.Compiled | RegexOptions.CultureInvariant);

    public static IEnumerable<Reference> Extract(DataObject obj, SchemaCatalog catalog)
    {
        if (obj.Fields.ValueKind != JsonValueKind.Object) yield break;

        foreach (var field in obj.Fields.EnumerateObject())
        {
            var rule = catalog.RuleFor(obj.Folder, field.Name);
            if (rule is null) continue;

            switch (rule.Shape)
            {
                case SchemaCatalog.FieldShape.Direct:
                    foreach (var r in ExtractDirect(obj, field, rule)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.StringArray:
                    foreach (var r in ExtractStringArray(obj, field, rule)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.CondStringArray:
                    foreach (var r in ExtractCondStringArray(obj, field, rule)) yield return r;
                    break;
            }
        }
    }

    private static IEnumerable<Reference> ExtractDirect(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule)
    {
        if (field.Value.ValueKind != JsonValueKind.String) yield break;
        var target = field.Value.GetString();
        if (string.IsNullOrEmpty(target)) yield break;
        if (PlaceholderToken.IsMatch(target!)) yield break;

        yield return new Reference(
            obj.Folder, obj.StrName, field.Name,
            rule.TargetFolder, target!,
            RefKind.Direct);
    }

    private static IEnumerable<Reference> ExtractStringArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule)
    {
        if (field.Value.ValueKind != JsonValueKind.Array) yield break;

        foreach (var element in field.Value.EnumerateArray())
        {
            if (element.ValueKind != JsonValueKind.String) continue;
            var target = element.GetString();
            if (string.IsNullOrEmpty(target)) continue;
            if (PlaceholderToken.IsMatch(target!)) continue;

            yield return new Reference(
                obj.Folder, obj.StrName, field.Name,
                rule.TargetFolder, target!,
                RefKind.DirectInArray);
        }
    }

    private static IEnumerable<Reference> ExtractCondStringArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule)
    {
        if (field.Value.ValueKind != JsonValueKind.Array) yield break;

        foreach (var element in field.Value.EnumerateArray())
        {
            if (element.ValueKind != JsonValueKind.String) continue;
            var raw = element.GetString();
            if (string.IsNullOrEmpty(raw)) continue;

            var parsed = CondStringParser.TryParse(raw!);
            if (parsed is null) continue;
            if (PlaceholderToken.IsMatch(parsed.Name)) continue;

            yield return new Reference(
                obj.Folder, obj.StrName, field.Name,
                rule.TargetFolder, parsed.Name,
                RefKind.Condition,
                Metadata: new Dictionary<string, object>
                {
                    ["value"] = parsed.Value,
                    ["duration"] = parsed.Duration,
                });
        }
    }
}
