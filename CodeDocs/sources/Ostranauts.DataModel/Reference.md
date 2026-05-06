# Reference.cs

**Path:** `src/Ostranauts.DataModel/Reference.cs`
**Status:** real

## Purpose

One typed edge in the reference graph: source object → target object, plus the kind of reference and any kind-specific metadata. Metadata stays on the edge so consumers (the site, future LSP) don't have to re-parse the source field — particularly important for condition refs that carry value + duration.

## Public API

```csharp
public enum RefKind
{
    Direct,           // plain string field, e.g. strItemDef
    DirectInArray,    // element of a string-array field, e.g. aInteractions[i]
    Condition,        // embedded condition string e.g. "IsSystem=1.0x1"
                      //   Metadata: { value: double, duration: int }
    Loot,             // embedded loot-entry string e.g. "Coughing=1.0x1" (or "-X=0.5x1-3")
                      //   Metadata: { chance, min, max, positive }
    LootItm,          // aLootItms verb-encoded entry, e.g. "addus,ItmFoo01,true"
                      //   Metadata: { verb, args[] }
    CondRuleAttach,   // aStartingCondRules entry "RuleName=fModifier"
                      //   Metadata: { fModifier }
    Inverse,          // aInverse entry "InteractionName,..."
                      //   Metadata: { args[] }
    LiteralInMethod,  // PLAN-AST Phase 1 — quoted literal in a decomp method body
                      //   Metadata: { line: int, text: string }
    LiteralInClass,   // PLAN-AST Phase 1 — quoted literal in a class-level initializer
                      //   Metadata: { line: int, text: string }
    WiresTo,          // PLAN-AST Phase 2 — condowner.aUpdateCommands → code-component
                      // OR a typed positional arg target. Source is condowners/<X>;
                      // target is code-component/<Cmd> OR a data folder.
                      //   Metadata: { commandName, position, raw, resolvedBy? }
    ProducesCondition,  // PLAN-AST Phase 2 — code-component → conditions/X via literal
                        // AddCond / AddCondAmount call.
                        //   Metadata: { verb, method, line }
    ConsumesCondition,  // PLAN-AST Phase 2 — code-component → conditions/X via literal
                        // RemoveCond / RemCond / ZeroCondAmount call.
                        //   Metadata: { verb, method, line }
    ObservesCondition,  // PLAN-AST Phase 2 — code-component → conditions/X via literal
                        // HasCond / GetCondAmount read.
                        //   Metadata: { verb, method, line }
    RuntimeWiresTo,     // PLAN-AST Phase 3 — guipropmap → resolved data target
                        // via a runtime dict-key lookup (e.g. strSignalCond →
                        // conditions/X). Site renders dashed.
                        //   Metadata: { portKey, component, playerWired }
}

public sealed record Reference(
    string SourceFolder,
    string SourceName,
    string SourceField,
    string TargetFolder,
    string TargetName,
    RefKind Kind,
    IReadOnlyDictionary<string, object>? Metadata = null);
```

For `RefKind.Condition`, `Metadata` is expected to contain `"value"` (double) and `"duration"` (int) keys.

For `RefKind.LiteralInMethod` / `RefKind.LiteralInClass`, the source `(SourceFolder, SourceName)` is a synthetic code-side node (folder = `code-method` or `code-class`, name = qualified C# name). `SourceField` is `"body"` or `"initializer"`; `Metadata` carries `"line"` (int) and `"text"` (≤200-char trimmed source line).

## Depends on

- Nothing beyond the BCL.

## Used by

- `ReferenceExtractor` (produces these).
- `ObjectIndex` (stores and indexes these by both endpoints).
- `GraphExporter` (serializes them as edges in `graph.js`).
