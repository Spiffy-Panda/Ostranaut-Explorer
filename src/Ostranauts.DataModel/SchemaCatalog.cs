namespace Ostranauts.DataModel;

/// <summary>
/// Result of reading data/schemas/*-schema.json. Maps every known
/// (sourceFolder, fieldName) to the targetFolder its values reference.
/// Field shape (plain string, string-array, condition-string) is
/// also captured so ReferenceExtractor knows how to walk the value.
/// </summary>
public sealed class SchemaCatalog
{
    public enum FieldShape
    {
        Direct,           // plain string, e.g. strItemDef
        StringArray,      // array of strings, e.g. aInteractions
        CondStringArray,  // array of "Name=val xdur" entries, e.g. aStartingConds
        LootEntryArray,   // array of "[-]Name=chance x min[-max]" entries, e.g. Loot.aCOs.
                          // Often paired with sibling-routing on a strType field.
    }

    /// <summary>
    /// One reference rule. <see cref="TargetFolder"/> is the default/fallback
    /// target. When <see cref="RoutingSibling"/> is set, the extractor first
    /// looks up that sibling field on the same DataObject and uses
    /// <see cref="RoutingTargets"/>[siblingValue] to pick the actual target;
    /// it falls back to <see cref="TargetFolder"/> only if the sibling value
    /// isn't in the routing map.
    /// </summary>
    public sealed record FieldRule(
        string SourceFolder,
        string FieldName,
        string TargetFolder,
        FieldShape Shape,
        string? RoutingSibling = null,
        IReadOnlyDictionary<string, string>? RoutingTargets = null);

    private readonly List<FieldRule> _rules;
    private readonly Dictionary<(string folder, string field), FieldRule> _byKey;

    /// <summary>
    /// When duplicate (SourceFolder, FieldName) keys appear (e.g. base data
    /// schema overlaid by Comment Mod), the later entry wins for lookups.
    /// All entries remain visible via <see cref="Rules"/>.
    /// </summary>
    public SchemaCatalog(IEnumerable<FieldRule> rules)
    {
        _rules = rules.ToList();
        _byKey = new Dictionary<(string folder, string field), FieldRule>();
        foreach (var r in _rules)
            _byKey[(r.SourceFolder, r.FieldName)] = r;  // last-wins on collision
    }

    public IReadOnlyList<FieldRule> Rules => _rules;

    public FieldRule? RuleFor(string folder, string field) =>
        _byKey.TryGetValue((folder, field), out var r) ? r : null;

    public static SchemaCatalog Empty => new(Enumerable.Empty<FieldRule>());
}
