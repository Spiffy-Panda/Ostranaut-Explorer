namespace Ostranauts.DataModel;

public enum RefKind
{
    /// <summary>Plain string field referencing another object's strName.</summary>
    Direct,
    /// <summary>Element of a string-array field.</summary>
    DirectInArray,
    /// <summary>Embedded condition string e.g. "IsSystem=1.0x1" — the name part references conditions/.</summary>
    Condition,
}

/// <summary>
/// One typed edge in the reference graph. Metadata carries kind-specific
/// extras (e.g. condition value + duration); kept on the edge so detail
/// pages can aggregate without re-parsing.
/// </summary>
public sealed record Reference(
    string SourceFolder,
    string SourceName,
    string SourceField,
    string TargetFolder,
    string TargetName,
    RefKind Kind,
    IReadOnlyDictionary<string, object>? Metadata = null);
