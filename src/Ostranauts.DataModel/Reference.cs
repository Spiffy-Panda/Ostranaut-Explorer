namespace Ostranauts.DataModel;

public enum RefKind
{
    /// <summary>Plain string field referencing another object's strName.</summary>
    Direct,
    /// <summary>Element of a string-array field.</summary>
    DirectInArray,
    /// <summary>Embedded condition string e.g. "IsSystem=1.0x1" — the name part references conditions/.</summary>
    Condition,
    /// <summary>Embedded loot-entry string e.g. "Coughing=1.0x1" — name+chance+min+max+positive on Metadata.</summary>
    Loot,
    /// <summary>aLootItms verb-encoded entry, e.g. "addus,ItmFoo01,true". Metadata: { verb: string, args: [string,...] }.</summary>
    LootItm,
    /// <summary>aStartingCondRules entry "RuleName=fModifier" — fModifier on Metadata.</summary>
    CondRuleAttach,
    /// <summary>aInverse entry "InteractionName,..." — extra tokens on Metadata.args.</summary>
    Inverse,
    /// <summary>
    /// Quoted-string literal inside a method body in decompiled C# (PLAN-AST Phase 1).
    /// Source is a synthetic <c>code-method</c> node; target is any data node whose
    /// strName matches the literal. Metadata: { line: int, text: string }.
    /// </summary>
    LiteralInMethod,
    /// <summary>
    /// Quoted-string literal inside a class-level field/property initializer
    /// (PLAN-AST Phase 1). Source is a synthetic <c>code-class</c> node;
    /// target is any data node whose strName matches the literal. Metadata: { line, text }.
    /// </summary>
    LiteralInClass,
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
