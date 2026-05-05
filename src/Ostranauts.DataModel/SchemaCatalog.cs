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

        // Slice E phase 2 — encoded-array shapes per CodeDocs/iverifiable-ref-map.md:

        InverseArray,         // array of "Name,..." entries; split on `,`, take [0].
                              // E.g. JsonInteraction.aInverse — references inverse interactions.
        CondRuleAttachArray,  // array of "RuleName=fModifier" entries; split on `=`, take [0]
                              // as the ref, parse [1] as double for fModifier metadata.
                              // E.g. JsonCondOwner.aStartingCondRules.
        LootItmsArray,        // array of "verb,lootName[,...]" entries; split on `,`, verb at [0],
                              // loot ref at [1]. E.g. JsonInteraction.aLootItms.
                              // Verbs: addus, addthem, removethem, take, use, lacks, input, give, removeus.

        // Slice E phase 4 — nested object refs:

        NestedDirectArray,    // array of objects; for each element, read a single sub-field whose
                              // value is a plain string ref. Use `x-nested-field: "<subFieldName>"`
                              // on the schema property to declare which sub-field to walk.
                              // E.g. condrules.aThresholds[*].strLootNew → loot/.
    }

    /// <summary>
    /// One reference rule. <see cref="TargetFolder"/> is the default/fallback
    /// target. When <see cref="RoutingSibling"/> is set, the extractor first
    /// looks up that sibling field on the same DataObject and uses
    /// <see cref="RoutingTargets"/>[siblingValue] to pick the actual target;
    /// it falls back to <see cref="TargetFolder"/> only if the sibling value
    /// isn't in the routing map.
    ///
    /// <see cref="IsGhost"/> = true means the field is documented by the schema
    /// but the decompiled C# game class doesn't deserialize it (per
    /// utils/python/decomp_schema_table.py). Modder-relevant —
    /// preserved here in case it's referenced elsewhere (older docs, mods,
    /// future game updates). Rule still fires; ghost-flag is plumbed through
    /// to the site for visual distinction.
    /// </summary>
    public sealed record FieldRule(
        string SourceFolder,
        string FieldName,
        string TargetFolder,
        FieldShape Shape,
        string? RoutingSibling = null,
        IReadOnlyDictionary<string, string>? RoutingTargets = null,
        bool IsGhost = false,
        string? Description = null,    // schema description text, for site tooltips
        IReadOnlyList<string>? FallbackTargets = null, // existence-aware alternatives;
        string? NestedField = null);   // for NestedDirectArray: the sub-field name within each
                                        // array element whose string value is the ref (e.g.
                                        // "strLootNew" for condrules.aThresholds[*].strLootNew).
        // when set, ReferenceExtractor checks each in [TargetFolder, ...FallbackTargets]
        // until it finds the value, then routes the edge to that folder. Falls back
        // to TargetFolder (primary) if none has it (= dangling). Used for fields
        // where the target value can live in multiple folders, e.g. condtrigs.aReqs
        // (a string is either a condtrig name OR a condition name).

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
