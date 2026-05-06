# ComponentIndexer.cs

**Path:** `src/Ostranauts.Decomp/ComponentIndexer.cs`
**Status:** real (PLAN-AST Phase 2)

## Purpose

Recovers the `CondOwner.AddCommand` dispatcher table from a parsed decomp tree set and promotes each branch to a `code-component` graph node. The dispatcher is the C# equivalent of the data tree's `condowners.aUpdateCommands` strings — every command name a `condowners` JSON file can invoke at runtime is one branch of this giant `if (array[0] == "X") { ... } else if (...) { ... }` chain. PLAN-AST Phase 2 makes that table visible as graph data.

For each branch the indexer extracts:

- **Command name** — the literal compared against `array[0]`.
- **Minimum arity** — from the leading `if (array.Length < N) return;` guard.
- **Implementing C# class** — the type argument of the first `gameObject.AddComponent<T>()` (or `GetComponent<T>()`) call in the branch.
- **Typed in-ports** — for every `array[i]` access (direct or reachable through a depth-1 follow-into the implementing type), classify port `[i]`'s target data folder via five resolution patterns. See *Resolution patterns* below.
- **Cond-touch literals** — the implementing class is then swept for invocations of `AddCond` / `AddCondAmount` / `RemoveCond` / `RemCond` / `ZeroCondAmount` / `HasCond` / `GetCondAmount`. A literal first argument becomes a `CodeComponentLiteralProducer` classified as `produces` / `consumes` / `observes` per the verb.

#### Resolution patterns (Phase 2.1)

Five shapes the resolver tries, in order, against each `array[i]` it discovers:

| Pattern | Shape | Example component |
|---------|-------|---------|
| **A — direct** | `DataHandler.GetX(array[i])` | `GasPump`, `GasRespire2`, `GasPressureSense`, `Sensor`, `Pledge` |
| **B / C — pass-through method call** | `comp.M(array[i])` or `comp.M(arg0, array[i], …)` — follow into M, look for `DataHandler.GetX(paramName)` (also handles `paramName` stored to `this.field` then read elsewhere) | `Heater` (`SetData(strCT)`), `Wound` (`SetData(strName)`), `Rotor` (`SetData(this, rotorCoName, strCOKey)`) |
| **D — whole-array forwarding** | `comp.M(array)` — recurse into M's body using its parameter as the new "array" variable; chains B/C/E from there | `Electrical` (`SetData(strings)` → `strings[1] = this.strGPMKey` → `GetGUIPropMap(this.strGPMKey)`), `Destructable` (still untyped — forwards to a different class' SetData) |
| **E — direct field assignment** | `comp.field = array[i]`, then look for `DataHandler.GetX(this.field)` elsewhere in the impl type | `Explosion` (`explosion.strType = array[1]` + `GetExplosion(this.strType)`) |

Recursion is bounded at depth 1 — enough to cover every dispatcher branch without runaway analysis. Anything deeper falls through as untyped (still recorded so the modder knows the slot is consumed).

PLAN-AST originally framed Phase 2 as "Roslyn `SemanticModel` work"; in practice the dispatcher and the impl-type method bodies are syntactically obvious enough that an AST + a small static `KnownGetters` table is sufficient. If a future dispatcher gets harder, promoting to `SemanticModel` is a localized change in `ResolvePortFromArray` / `ResolveParamInMethod`.

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
    IReadOnlyList<CodeComponentLiteralProducer> Produces,
    IReadOnlyList<CodeComponentRuntimePort> RuntimePorts);  // PLAN-AST Phase 3

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

public sealed record CodeComponentRuntimePort(
    string Key,           // e.g. "strSignalCond", "strInput01", "bTurbo"
    string TargetFolder,  // resolved data folder, "" if untyped
    string Source,        // attribution chain
    bool PlayerWired);    // true for strInput0\d+ (player-edits-in-game by convention)

public static class ComponentIndexer
{
    public static IReadOnlyList<CodeComponent> Index(
        ParsedDecompTreeSet parsed,
        Action<string>? onWarning = null);
}
```

## Phase 3 — runtime ports

Each `code-component` also exposes a `RuntimePorts` array recovering the
dictionary-keyed config reads inside its implementing class. Two patterns:

| Pattern | Shape | Examples |
|---------|-------|---------|
| **TryGetValue** | `dict.TryGetValue("KEY", out destVar)` where `destVar` is `this.field`, a bare field/local, or `out var local` | `Heater.UpdateRemote`, `GasPump.SetData` |
| **Element-access** | `dict["KEY"]` directly inside an arg position (`co.HasCond(gpm["strSignalCond"])`) or as the RHS of `this.field = dict["KEY"]` | `GasPressureSense.SetData`, `Sensor.SetData`, `Electrical.InitGPMValues` |

Receiver-name allow-list (`dictionary` / `gpm` / `*propmap*` / `*mapgpm*`)
filters out unrelated dictionaries (`mapGasMols`, `mapInfo`, `mapGUIPropMaps`
the outer one). The destination value's type is recovered via the Phase 2.1
field-flow analysis, plus three new consumer shapes:

- `co.HasCond(value)` / `AddCondAmount(value, ...)` / etc. → `conditions/`
- `ship.GetCOByID(value)` → `condowners/`
- (existing `DataHandler.GetX(value)` → known folder)

For the local-variable case (`out string text`), the trace is bounded to the
nearest enclosing `IfStatementSyntax` or `BlockSyntax` so multiple
TryGetValue calls reusing the same `text` local don't cross-contaminate
typing. (GasPump.SetData reads `strInput01`, `bTurbo`, `bReverse`,
`bSlowMode`, `nKnobBus` all into `out text`; only `strInput01` flows into
`GetCOByID(text)` — others go through `bool.Parse(text)` / `int.Parse(text)`
and stay untyped.)

A `PlayerWired` flag on the port is true for keys matching
`strInput0\d+` (the convention for player-editable panel-input slots).

## Output volumes (current real-data run)

```
14 code-component nodes (one per CondOwner.AddCommand branch)
1,638 wires-to edges    (head + typed positional args from condowners' aUpdateCommands)
   118 produces/consumes/observes edges (from literal AddCond patterns)
    38 runtime-wires-to edges (Phase 3 — guipropmap → resolved typed target via runtime port)
```

The 14 commands are: `GasExchange`, `Pledge`, `OnAddCond`, `OnRemoveCond`, `GasRespire2`, `GasPump`, `GasPressureSense`, `Sensor`, `Destructable`, `Heater`, `Explosion`, `Wound`, `Electrical`, `Meat`, `Rotor`. Ten of them now have at least one typed in-port:

| Component | Port | Folder | Resolution chain |
|---|---|---|---|
| `Pledge` | `[1]` | `pledges` | A (direct `GetPledge`) |
| `GasRespire2` | `[1]` | `gasrespires` | A (direct `GetGasRespire`) |
| `GasPump` | `[1]` | `gasrespires` | A (direct `GetGasRespire`) |
| `GasPressureSense` | `[1]` | `guipropmaps` | A (direct `GetGUIPropMap`) |
| `Sensor` | `[1]` | `guipropmaps` | A (direct `GetGUIPropMap`) |
| `Heater` | `[1]` | `condtrigs` | B (`SetData(strCT)` → `GetCondTrigger(strCT)`) |
| `Wound` | `[1]` | `wounds` | B (`SetData(strName)` → `GetWound(strName)`) |
| `Rotor` | `[1]` | `condowners` | C (`SetData(this, rotorCoName, …)` → `GetCondOwner(rotorCoName)`) |
| `Explosion` | `[1]` | `explosions` | E (`explosion.strType = array[1]` + `GetExplosion(this.strType)`) |
| `Electrical` | `[1]` | `guipropmaps` | D + E + A (`SetData(strings)` → `strings[1] = this.strGPMKey` → `GetGUIPropMap(this.strGPMKey)`) |

The four remaining (`Destructable`, `GasExchange`, `OnAddCond`, `OnRemoveCond`, `Meat`) emit untyped or no positional ports. `Destructable` forwards into `DestCheck.SetData` — a different class outside the impl-type lookup — and would need a per-component allowlist of helper types to follow further. `OnAddCond`/`OnRemoveCond` populate `dictAddCondEvents` (the dispatcher itself stuffs values into a CondOwner-side dictionary; no third-party DataHandler getter to pin against). The wires-to-component head edge still surfaces for all of them.

## Limitations

- **One-hop resolution only.** `gasPump.SetData(array[1], ..., array[2])` is recorded as untyped because the indexer doesn't follow into `GasPump.SetData`. PLAN-AST Phase 3 (or a Phase-2 follow-up) lifts this.
- **Static literal cond-touches only.** Producers like `co.AddCondAmount(this.strSignalCond, ...)` — where the cond name is a runtime field set from a guipropmaps lookup — are *not* recovered here; they remain a data-side schema concern (the value flows through `dictGUIPropMap`'s `strSignalCond` entry, not through code).
- **No verb-level deduplication against Phase 1.** A literal `"StatPower"` inside `Heater.SomeMethod` produces both a Phase 1 `LiteralInMethod` edge (from `code-method:Heater.SomeMethod`) and a Phase 2 `ProducesCondition` edge (from `code-component:Heater`). Both are valid; the site groups them differently and the modder benefits from seeing both views.

## Depends on

- `Microsoft.CodeAnalysis.CSharp` 4.11+ (Roslyn).
- `DecompIndexer.ParsedDecompTreeSet` — shared parsed-tree set so each `.cs` file is read once across Phase 1 and Phase 2.

## Used by

- `Ostranauts.Site.Builder.Program` — bridges `CodeComponent` records into `DataObject` / `Reference` and merges into `graph.js`.
