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
    /// <summary>
    /// PLAN-AST Phase 2 — a <c>condowners.aUpdateCommands[i]</c> string wires
    /// a condowner to a <c>code-component</c> dispatcher entry, OR to one of
    /// that entry's typed in-port targets. Source is a data condowner;
    /// target is either <c>code-component:&lt;Cmd&gt;</c> or the resolved
    /// data-folder/strName for a typed positional arg.
    /// Metadata: { commandName, position, raw } (raw = full aUpdateCommands string).
    /// </summary>
    WiresTo,
    /// <summary>
    /// PLAN-AST Phase 2 — code-component → conditions/X edge. Recovered from
    /// literal-string <c>AddCond("X")</c> / <c>AddCondAmount("X", ...)</c>
    /// inside the component's class body. Distinguishes from the Phase 1
    /// LiteralInMethod edge by classifying the call's role.
    /// Metadata: { verb, method, line }.
    /// </summary>
    ProducesCondition,
    /// <summary>
    /// PLAN-AST Phase 2 — code-component → conditions/X edge. Mirror of
    /// <see cref="ProducesCondition"/> for <c>RemoveCond("X")</c> /
    /// <c>RemCond("X")</c> / <c>ZeroCondAmount("X", ...)</c>.
    /// Metadata: { verb, method, line }.
    /// </summary>
    ConsumesCondition,
    /// <summary>
    /// PLAN-AST Phase 2 — code-component → conditions/X edge. Read-only
    /// observation of a condition (<c>HasCond("X")</c>, <c>GetCondAmount("X")</c>),
    /// distinguished from produces/consumes so detail pages can rank
    /// "actively maintained" producers above "merely consulted" observers.
    /// Metadata: { verb, method, line }.
    /// </summary>
    ObservesCondition,
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
