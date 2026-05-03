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
        Direct,         // plain string, e.g. strItemDef
        StringArray,    // array of strings, e.g. aInteractions
        CondStringArray // array of "Name=val xdur" entries, e.g. aStartingConds
    }

    public sealed record FieldRule(
        string SourceFolder,
        string FieldName,
        string TargetFolder,
        FieldShape Shape);

    private readonly List<FieldRule> _rules;
    private readonly Dictionary<(string folder, string field), FieldRule> _byKey;

    public SchemaCatalog(IEnumerable<FieldRule> rules)
    {
        _rules = rules.ToList();
        _byKey = _rules.ToDictionary(r => (r.SourceFolder, r.FieldName));
    }

    public IReadOnlyList<FieldRule> Rules => _rules;

    public FieldRule? RuleFor(string folder, string field) =>
        _byKey.TryGetValue((folder, field), out var r) ? r : null;

    public static SchemaCatalog Empty => new(Enumerable.Empty<FieldRule>());
}
