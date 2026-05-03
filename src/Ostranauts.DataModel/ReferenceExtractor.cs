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

    /// <summary>
    /// <paramref name="exists"/> is the existence checker for fallback target
    /// resolution (Phase 3). Pass null to skip fallback resolution — every
    /// edge then routes to the primary <c>rule.TargetFolder</c>.
    /// </summary>
    public static IEnumerable<Reference> Extract(
        DataObject obj,
        SchemaCatalog catalog,
        Func<string, string, bool>? exists = null)
    {
        if (obj.Fields.ValueKind != JsonValueKind.Object) yield break;

        foreach (var field in obj.Fields.EnumerateObject())
        {
            var rule = catalog.RuleFor(obj.Folder, field.Name);
            if (rule is null) continue;

            switch (rule.Shape)
            {
                case SchemaCatalog.FieldShape.Direct:
                    foreach (var r in ExtractDirect(obj, field, rule, exists)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.StringArray:
                    foreach (var r in ExtractStringArray(obj, field, rule, exists)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.CondStringArray:
                    foreach (var r in ExtractCondStringArray(obj, field, rule, exists)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.LootEntryArray:
                    foreach (var r in ExtractLootEntryArray(obj, field, rule)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.InverseArray:
                    foreach (var r in ExtractInverseArray(obj, field, rule)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.CondRuleAttachArray:
                    foreach (var r in ExtractCondRuleAttachArray(obj, field, rule)) yield return r;
                    break;

                case SchemaCatalog.FieldShape.LootItmsArray:
                    foreach (var r in ExtractLootItmsArray(obj, field, rule)) yield return r;
                    break;
            }
        }
    }

    /// <summary>
    /// Picks the effective target folder for a given value. Tries the primary
    /// (<paramref name="primary"/>) first; if <paramref name="exists"/> says
    /// the value isn't there, walks <paramref name="fallbacks"/> in order and
    /// returns the first folder that contains it. Falls back to primary
    /// (= dangling edge) if nothing matches.
    /// </summary>
    private static string ResolveExistingTarget(
        string primary,
        IReadOnlyList<string>? fallbacks,
        string value,
        Func<string, string, bool>? exists)
    {
        if (exists is null || fallbacks is null || fallbacks.Count == 0)
            return primary;
        if (exists(primary, value)) return primary;
        foreach (var f in fallbacks)
            if (exists(f, value)) return f;
        return primary;
    }

    /// <summary>
    /// Resolves the effective target folder for a rule, applying sibling-field
    /// routing if configured. Returns null if a routing-required value is missing
    /// — caller can decide to fall through to <c>rule.TargetFolder</c> or skip.
    /// </summary>
    private static string ResolveTarget(DataObject obj, SchemaCatalog.FieldRule rule)
    {
        if (rule.RoutingSibling is null || rule.RoutingTargets is null)
            return rule.TargetFolder;

        if (!obj.Fields.TryGetProperty(rule.RoutingSibling, out var siblingProp)
            || siblingProp.ValueKind != JsonValueKind.String)
            return rule.TargetFolder;

        var siblingValue = siblingProp.GetString();
        if (siblingValue is null) return rule.TargetFolder;

        return rule.RoutingTargets.TryGetValue(siblingValue, out var routed)
            ? routed
            : rule.TargetFolder;
    }

    private static IEnumerable<Reference> ExtractDirect(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule, Func<string, string, bool>? exists)
    {
        if (field.Value.ValueKind != JsonValueKind.String) yield break;
        var target = field.Value.GetString();
        if (string.IsNullOrEmpty(target)) yield break;
        if (PlaceholderToken.IsMatch(target!)) yield break;

        var folder = ResolveExistingTarget(rule.TargetFolder, rule.FallbackTargets, target!, exists);
        yield return new Reference(
            obj.Folder, obj.StrName, field.Name,
            folder, target!,
            RefKind.Direct);
    }

    private static IEnumerable<Reference> ExtractStringArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule, Func<string, string, bool>? exists)
    {
        if (field.Value.ValueKind != JsonValueKind.Array) yield break;

        foreach (var element in field.Value.EnumerateArray())
        {
            if (element.ValueKind != JsonValueKind.String) continue;
            var target = element.GetString();
            if (string.IsNullOrEmpty(target)) continue;
            if (PlaceholderToken.IsMatch(target!)) continue;

            var folder = ResolveExistingTarget(rule.TargetFolder, rule.FallbackTargets, target!, exists);
            yield return new Reference(
                obj.Folder, obj.StrName, field.Name,
                folder, target!,
                RefKind.DirectInArray);
        }
    }

    private static IEnumerable<Reference> ExtractCondStringArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule, Func<string, string, bool>? exists)
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

            var folder = ResolveExistingTarget(rule.TargetFolder, rule.FallbackTargets, parsed.Name, exists);
            yield return new Reference(
                obj.Folder, obj.StrName, field.Name,
                folder, parsed.Name,
                RefKind.Condition,
                Metadata: new Dictionary<string, object>
                {
                    ["value"] = parsed.Value,
                    ["duration"] = parsed.Duration,
                });
        }
    }

    private static IEnumerable<Reference> ExtractInverseArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule)
    {
        if (field.Value.ValueKind != JsonValueKind.Array) yield break;
        var target = ResolveTarget(obj, rule);

        foreach (var element in field.Value.EnumerateArray())
        {
            if (element.ValueKind != JsonValueKind.String) continue;
            var raw = element.GetString();
            if (string.IsNullOrEmpty(raw)) continue;

            var parts = raw!.Split(',');
            var name = parts[0].Trim();
            if (string.IsNullOrEmpty(name)) continue;
            if (PlaceholderToken.IsMatch(name)) continue;

            var meta = new Dictionary<string, object>();
            if (parts.Length > 1)
                meta["args"] = parts.Skip(1).Select(p => p.Trim()).ToArray();

            yield return new Reference(
                obj.Folder, obj.StrName, field.Name,
                target, name,
                RefKind.Inverse,
                Metadata: meta.Count > 0 ? meta : null);
        }
    }

    private static IEnumerable<Reference> ExtractCondRuleAttachArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule)
    {
        if (field.Value.ValueKind != JsonValueKind.Array) yield break;
        var target = ResolveTarget(obj, rule);

        foreach (var element in field.Value.EnumerateArray())
        {
            if (element.ValueKind != JsonValueKind.String) continue;
            var raw = element.GetString();
            if (string.IsNullOrEmpty(raw)) continue;

            var eq = raw!.IndexOf('=');
            string name;
            double? fModifier = null;
            if (eq <= 0)
            {
                name = raw.Trim();
            }
            else
            {
                name = raw.Substring(0, eq).Trim();
                if (eq < raw.Length - 1
                    && double.TryParse(raw.Substring(eq + 1), System.Globalization.NumberStyles.Float,
                        System.Globalization.CultureInfo.InvariantCulture, out var parsed))
                {
                    fModifier = parsed;
                }
            }
            if (string.IsNullOrEmpty(name)) continue;
            if (PlaceholderToken.IsMatch(name)) continue;

            var meta = new Dictionary<string, object>();
            if (fModifier.HasValue) meta["fModifier"] = fModifier.Value;

            yield return new Reference(
                obj.Folder, obj.StrName, field.Name,
                target, name,
                RefKind.CondRuleAttach,
                Metadata: meta.Count > 0 ? meta : null);
        }
    }

    private static IEnumerable<Reference> ExtractLootItmsArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule)
    {
        if (field.Value.ValueKind != JsonValueKind.Array) yield break;
        var target = ResolveTarget(obj, rule);

        foreach (var element in field.Value.EnumerateArray())
        {
            if (element.ValueKind != JsonValueKind.String) continue;
            var raw = element.GetString();
            if (string.IsNullOrEmpty(raw)) continue;

            var parts = raw!.Split(',');
            // Need at least verb (0) + lootName (1).
            if (parts.Length < 2) continue;

            var verb = parts[0].Trim();
            var name = parts[1].Trim();
            if (string.IsNullOrEmpty(name)) continue;
            if (PlaceholderToken.IsMatch(name)) continue;

            var meta = new Dictionary<string, object> { ["verb"] = verb };
            if (parts.Length > 2)
                meta["args"] = parts.Skip(2).Select(p => p.Trim()).ToArray();

            yield return new Reference(
                obj.Folder, obj.StrName, field.Name,
                target, name,
                RefKind.LootItm,
                Metadata: meta);
        }
    }

    private static IEnumerable<Reference> ExtractLootEntryArray(DataObject obj, JsonProperty field, SchemaCatalog.FieldRule rule)
    {
        if (field.Value.ValueKind != JsonValueKind.Array) yield break;

        // Resolve the routed target once per object; sibling-field value doesn't
        // change across the array's elements.
        var target = ResolveTarget(obj, rule);

        foreach (var element in field.Value.EnumerateArray())
        {
            if (element.ValueKind != JsonValueKind.String) continue;
            var raw = element.GetString();
            if (string.IsNullOrEmpty(raw)) continue;

            // One slot can hold multiple |-separated alternatives.
            foreach (var parsed in LootStringParser.ParseSlot(raw!))
            {
                if (PlaceholderToken.IsMatch(parsed.Name)) continue;

                yield return new Reference(
                    obj.Folder, obj.StrName, field.Name,
                    target, parsed.Name,
                    RefKind.Loot,
                    Metadata: new Dictionary<string, object>
                    {
                        ["chance"] = parsed.Chance,
                        ["min"] = parsed.MinCount,
                        ["max"] = parsed.MaxCount,
                        ["positive"] = parsed.Positive,
                    });
            }
        }
    }
}
