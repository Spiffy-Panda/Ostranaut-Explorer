# ComponentIndexer.cs

**Path:** `src/Ostranauts.Decomp/ComponentIndexer.cs`
**Status:** real (PLAN-AST Phase 2)

## Purpose

Recovers the `CondOwner.AddCommand` dispatcher table from a parsed decomp tree set and promotes each branch to a `code-component` graph node. The dispatcher is the C# equivalent of the data tree's `condowners.aUpdateCommands` strings — every command name a `condowners` JSON file can invoke at runtime is one branch of this giant `if (array[0] == "X") { ... } else if (...) { ... }` chain. PLAN-AST Phase 2 makes that table visible as graph data.

For each branch the indexer extracts:

- **Command name** — the literal compared against `array[0]`.
- **Minimum arity** — from the leading `if (array.Length < N) return;` guard.
- **Implementing C# class** — the type argument of the first `gameObject.AddComponent<T>()` (or `GetComponent<T>()`) call in the branch.
- **Typed in-ports** — for every `array[i]` access, the immediately-enclosing call is checked: if it's `DataHandler.GetXxx(array[i])`, port `[i]` resolves to the data folder for `Xxx` (via the static `KnownGetters` map). Otherwise `[i]` is recorded as untyped — still a port, just without a target folder.
- **Cond-touch literals** — the implementing class is then swept for invocations of `AddCond` / `AddCondAmount` / `RemoveCond` / `RemCond` / `ZeroCondAmount` / `HasCond` / `GetCondAmount`. A literal first argument becomes a `CodeComponentLiteralProducer` classified as `produces` / `consumes` / `observes` per the verb.

The Builder bridges these into the data graph as:

- One `code-component:<CommandName>` `DataObject` per branch (carrying `inPorts` and `produces` arrays in its `Fields` JsonElement).
- One `Reference(WiresTo)` from each `condowners.aUpdateCommands` entry to the matching `code-component`, plus one per typed port whose resolved arg names a real entry in the inferred folder.
- One `Reference(ProducesCondition / ConsumesCondition / ObservesCondition)` per `CodeComponentLiteralProducer`, but only when the named condition exists in `conditions/` (skips dynamic-name cases that wouldn't have a destination).

Resolution rules live entirely here, not in any data schema (PLAN-AST: *"Resolution rules live in the indexer, not the data schemas"*). The `KnownGetters` map is sourced from a one-time inspection of `decomp/Assembly-CSharp/DataHandler.cs`; entries for getters not in the map yield untyped ports rather than wrong edges.

## Public API

```csharp
public sealed record CodeComponent(
    string CommandName,
    string ImplementingType,
    int ArityMin,
    string DispatcherFile,
    int DispatcherLine,
    IReadOnlyList<CodeComponentInPort> InPorts,
    IReadOnlyList<CodeComponentLiteralProducer> Produces);

public sealed record CodeComponentInPort(
    int Index,            // 1-based; 0 is the command name token
    string TargetFolder,  // e.g. "gasrespires", "guipropmaps", "" if untyped
    string Source);       // e.g. "DataHandler.GetGasRespire" or "untyped"

public sealed record CodeComponentLiteralProducer(
    string ConditionName,
    string Verb,          // "AddCond" | "AddCondAmount" | "RemoveCond" | ...
    string Role,          // "produces" | "consumes" | "observes"
    string MethodName,
    string File,
    int Line);

public static class ComponentIndexer
{
    public static IReadOnlyList<CodeComponent> Index(
        ParsedDecompTreeSet parsed,
        Action<string>? onWarning = null);
}
```

## Output volumes (current real-data run)

```
14 code-component nodes (one per CondOwner.AddCommand branch)
1,367 wires-to edges    (head + typed positional args from condowners' aUpdateCommands)
   118 produces/consumes/observes edges (from literal AddCond patterns)
```

The 14 commands are: `GasExchange`, `Pledge`, `OnAddCond`, `OnRemoveCond`, `GasRespire2`, `GasPump`, `GasPressureSense`, `Sensor`, `Destructable`, `Heater`, `Explosion`, `Wound`, `Electrical`, `Meat`, `Rotor`. Five (`Pledge`, `GasRespire2`, `GasPump`, `GasPressureSense`, `Sensor`) have at least one typed in-port via `DataHandler.Get*` resolution; the rest emit untyped ports for their positional args — the wires-to-component head edge still surfaces.

## Limitations

- **One-hop resolution only.** `gasPump.SetData(array[1], ..., array[2])` is recorded as untyped because the indexer doesn't follow into `GasPump.SetData`. PLAN-AST Phase 3 (or a Phase-2 follow-up) lifts this.
- **Static literal cond-touches only.** Producers like `co.AddCondAmount(this.strSignalCond, ...)` — where the cond name is a runtime field set from a guipropmaps lookup — are *not* recovered here; they remain a data-side schema concern (the value flows through `dictGUIPropMap`'s `strSignalCond` entry, not through code).
- **No verb-level deduplication against Phase 1.** A literal `"StatPower"` inside `Heater.SomeMethod` produces both a Phase 1 `LiteralInMethod` edge (from `code-method:Heater.SomeMethod`) and a Phase 2 `ProducesCondition` edge (from `code-component:Heater`). Both are valid; the site groups them differently and the modder benefits from seeing both views.

## Depends on

- `Microsoft.CodeAnalysis.CSharp` 4.11+ (Roslyn).
- `DecompIndexer.ParsedDecompTreeSet` — shared parsed-tree set so each `.cs` file is read once across Phase 1 and Phase 2.

## Used by

- `Ostranauts.Site.Builder.Program` — bridges `CodeComponent` records into `DataObject` / `Reference` and merges into `graph.js`.
